from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
import re
from PIL import Image

EASYOCR_AVAILABLE = False
try:
    import easyocr
    EASYOCR_AVAILABLE = True
except (ImportError, ValueError, Exception):
    EASYOCR_AVAILABLE = False

PYTESSERACT_AVAILABLE = False
try:
    import pytesseract
    PYTESSERACT_AVAILABLE = True
except (ImportError, ValueError, Exception):
    PYTESSERACT_AVAILABLE = False

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'bht-detector-dev-key-change-in-production')

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
BHT_PATTERNS = [
    r'\bBHT\b',
    r'\bbht\b',
    r'butylated\s+hydroxytoluene',
    r'butylat[eé]d\s+hydroxytoluene',
    r'butilado\s+hidroxitolueno',
    r'hidroxitolueno\s+butilado',
    r'\be\s*320\b',
    r'\bE\s*320\b',
    r'\bINS\s*320\b',
    r'\b320\s*\(BHT\)',
    r'antioxidante\s+320',
    r'antiox\.\s*320',
    r'conservante\s+320',
    r'preservativo\s+320',
]

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def detect_bht_in_text(text):
    if not text:
        return False, []
    
    matches = []
    
    for pattern in BHT_PATTERNS:
        pattern_matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in pattern_matches:
            matches.append({
                'text': match.group(),
                'position': match.start()
            })
    
    has_bht = len(matches) > 0
    return has_bht, matches

def preprocess_image(image_path):
    try:
        img = Image.open(image_path)
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        from PIL import ImageEnhance, ImageFilter
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.5)
        
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.2)
        
        max_size = 2000
        if max(img.size) > max_size:
            ratio = max_size / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        processed_path = image_path.replace('.', '_processed.')
        img.save(processed_path, 'JPEG', quality=95)
        return processed_path
    except Exception as e:
        print(f"Erro no pré-processamento: {str(e)}")
        return image_path

def extract_text_from_image(image_path):
    processed_path = preprocess_image(image_path)
    
    if EASYOCR_AVAILABLE:
        try:
            reader = easyocr.Reader(['pt', 'en'], gpu=False)
            results = reader.readtext(processed_path)
            extracted_text = ' '.join([result[1] for result in results])
            if extracted_text.strip():
                if processed_path != image_path:
                    try:
                        os.remove(processed_path)
                    except:
                        pass
                return extracted_text
        except Exception as e:
            print(f"Erro ao usar EasyOCR: {str(e)}")
    
    if PYTESSERACT_AVAILABLE:
        try:
            img = Image.open(processed_path)
            extracted_text = pytesseract.image_to_string(img, lang='por+eng')
            if extracted_text.strip():
                if processed_path != image_path:
                    try:
                        os.remove(processed_path)
                    except:
                        pass
                return extracted_text
        except Exception as tesseract_error:
            print(f"Erro ao usar Tesseract: {str(tesseract_error)}")
    
    if processed_path != image_path:
        try:
            os.remove(processed_path)
        except:
            pass
    
    return ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    try:
        if 'image' in request.files:
            file = request.files['image']
            
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                extracted_text = extract_text_from_image(filepath)
                has_bht, matches = detect_bht_in_text(extracted_text)
                
                try:
                    os.remove(filepath)
                except OSError:
                    pass
                
                return jsonify({
                    'success': True,
                    'has_bht': has_bht,
                    'matches': matches,
                    'extracted_text': extracted_text,
                    'method': 'image'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Arquivo inválido. Use PNG, JPG, JPEG ou GIF.'
                }), 400
        
        data = request.get_json(silent=True)
        
        if data and 'text' in data:
            text_input = data['text']
            has_bht, matches = detect_bht_in_text(text_input)
            
            return jsonify({
                'success': True,
                'has_bht': has_bht,
                'matches': matches,
                'input_text': text_input,
                'method': 'text'
            })
        
        else:
            return jsonify({
                'success': False,
                'error': 'Nenhum texto ou imagem fornecido.'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro ao processar: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("BHT Detector - Iniciando servidor...")
    print("=" * 50)
    
    if EASYOCR_AVAILABLE:
        print("✓ EasyOCR disponível - Análise de imagens habilitada")
    else:
        print("⚠ EasyOCR não encontrado - Instale com: pip install easyocr")
    
    if PYTESSERACT_AVAILABLE:
        print("✓ Pytesseract disponível (fallback)")
    else:
        print("ℹ Pytesseract não encontrado (opcional)")
    
    print("\nServidor rodando em: http://localhost:5000")
    print("Pressione Ctrl+C para parar\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)


