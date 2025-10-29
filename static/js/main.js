document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');
        
        clearResults();
    });
});

document.getElementById('scrollToDetector')?.addEventListener('click', () => {
    document.getElementById('detector').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('analyze-text-btn')?.addEventListener('click', async () => {
    const textInput = document.getElementById('text-input').value.trim();
    
    if (!textInput) {
        alert('Por favor, insira algum texto para análise.');
        return;
    }
    
    await analyzeText(textInput);
});

const imageInput = document.getElementById('image-input');
const cameraInput = document.getElementById('camera-input');
const cameraBtn = document.getElementById('camera-btn');
const imageUploadArea = document.getElementById('image-upload-area');
const previewImage = document.getElementById('preview-image');
const imageWrapper = document.getElementById('image-wrapper');
const analyzeImageBtn = document.getElementById('analyze-image-btn');

let imageRotation = 0;
let imageZoom = 1;
let imageBrightness = 1;
let imageContrast = 1;
let currentImageFile = null;

cameraBtn?.addEventListener('click', () => {
    if (cameraInput) {
        cameraInput.click();
    }
});

cameraInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
        if (imageInput && imageInput.files.length === 0) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
        }
    }
});

imageUploadArea.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        currentImageFile = file;
        handleImageFile(file);
    }
});

imageUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadArea.classList.add('dragover');
});

imageUploadArea.addEventListener('dragleave', () => {
    imageUploadArea.classList.remove('dragover');
});

imageUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        currentImageFile = file;
        handleImageFile(file);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        imageInput.files = dataTransfer.files;
    }
});

document.addEventListener('paste', (e) => {
    const imageTab = document.getElementById('image-tab');
    if (!imageTab.classList.contains('active')) {
        return;
    }
    
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const file = new File([blob], 'pasted-image.png', { type: 'image/png' });
            
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
            currentImageFile = file;
            
            handleImageFile(file);
            e.preventDefault();
            break;
        }
    }
});

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.tab === 'image') {
            setTimeout(() => {
                imageUploadArea.focus();
            }, 100);
        }
    });
});

function handleImageFile(file) {
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Por favor, selecione uma imagem válida.');
        return;
    }
    
    currentImageFile = file;
    imageRotation = 0;
    imageZoom = 1;
    imageBrightness = 1;
    imageContrast = 1;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        imageWrapper.style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';
        document.getElementById('image-adjustments').style.display = 'block';
        analyzeImageBtn.disabled = false;
        applyImageTransformations();
        resetSliderValues();
    };
    reader.readAsDataURL(file);
}

function resetSliderValues() {
    const brightnessSlider = document.getElementById('brightness-slider');
    const contrastSlider = document.getElementById('contrast-slider');
    const brightnessValue = document.getElementById('brightness-value');
    const contrastValue = document.getElementById('contrast-value');
    
    if (brightnessSlider) {
        brightnessSlider.value = 1;
        imageBrightness = 1;
    }
    if (contrastSlider) {
        contrastSlider.value = 1;
        imageContrast = 1;
    }
    if (brightnessValue) brightnessValue.textContent = '100%';
    if (contrastValue) contrastValue.textContent = '100%';
}

function applyImageTransformations() {
    if (!previewImage) return;
    
    previewImage.style.transform = `rotate(${imageRotation}deg) scale(${imageZoom})`;
    previewImage.style.filter = `brightness(${imageBrightness}) contrast(${imageContrast})`;
}

document.getElementById('rotate-btn')?.addEventListener('click', () => {
    imageRotation += 90;
    if (imageRotation >= 360) imageRotation = 0;
    applyImageTransformations();
});

document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
    imageZoom = Math.min(imageZoom + 0.25, 3);
    applyImageTransformations();
});

document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
    imageZoom = Math.max(imageZoom - 0.25, 0.5);
    applyImageTransformations();
});

document.getElementById('reset-image-btn')?.addEventListener('click', () => {
    imageRotation = 0;
    imageZoom = 1;
    applyImageTransformations();
});

document.getElementById('brightness-slider')?.addEventListener('input', (e) => {
    imageBrightness = parseFloat(e.target.value);
    applyImageTransformations();
    const value = document.getElementById('brightness-value');
    if (value) value.textContent = Math.round(imageBrightness * 100) + '%';
});

document.getElementById('contrast-slider')?.addEventListener('input', (e) => {
    imageContrast = parseFloat(e.target.value);
    applyImageTransformations();
    const value = document.getElementById('contrast-value');
    if (value) value.textContent = Math.round(imageContrast * 100) + '%';
});

document.getElementById('reset-adjustments-btn')?.addEventListener('click', () => {
    imageBrightness = 1;
    imageContrast = 1;
    applyImageTransformations();
    resetSliderValues();
});

previewImage?.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        imageZoom = Math.max(0.5, Math.min(3, imageZoom + delta));
        applyImageTransformations();
    }
});

analyzeImageBtn?.addEventListener('click', async () => {
    let file = imageInput.files[0] || cameraInput.files[0];
    if (!file && currentImageFile) {
        file = currentImageFile;
    }
    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }
    
    await analyzeImage(file);
});

async function analyzeText(text) {
    showLoading();
    
    try {
        const response = await fetch('/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        showResults(data);
    } catch (error) {
        showError('Erro ao analisar texto. Tente novamente.');
    }
}

async function analyzeImage(file) {
    showLoading();
    
    let fileToSend = file;
    
    if (imageRotation !== 0 || imageBrightness !== 1 || imageContrast !== 1) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
            img.onload = () => {
                try {
                    const rad = imageRotation * Math.PI / 180;
                    const cos = Math.abs(Math.cos(rad));
                    const sin = Math.abs(Math.sin(rad));
                    
                    const newWidth = img.width * cos + img.height * sin;
                    const newHeight = img.width * sin + img.height * cos;
                    
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(rad);
                    ctx.filter = `brightness(${imageBrightness}) contrast(${imageContrast})`;
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    ctx.restore();
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            fileToSend = new File([blob], file.name, { type: file.type });
                        }
                        resolve();
                    }, file.type, 0.95);
                } catch (error) {
                    console.error('Erro ao processar imagem:', error);
                    resolve();
                }
            };
            img.onerror = () => resolve();
            img.src = previewImage.src;
        });
    }
    
    const formData = new FormData();
    formData.append('image', fileToSend);
    
    try {
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        showResults(data);
    } catch (error) {
        showError('Erro ao analisar imagem. Tente novamente.');
    }
}

function getHistory() {
    const history = localStorage.getItem('bht-detector-history');
    return history ? JSON.parse(history) : [];
}

function saveToHistory(result) {
    const history = getHistory();
    const historyItem = {
        id: Date.now(),
        date: new Date().toLocaleString('pt-BR'),
        hasBht: result.has_bht,
        matches: result.matches || [],
        text: result.input_text || result.extracted_text?.substring(0, 100) || 'Análise por imagem',
        method: result.method || 'text'
    };
    
    history.unshift(historyItem);
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('bht-detector-history', JSON.stringify(history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = getHistory();
    const historyList = document.getElementById('history-list');
    const historySection = document.getElementById('history-section');
    
    if (history.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    historyList.innerHTML = history.slice(0, 10).map(item => {
        const status = item.hasBht ? 'has-bht' : 'no-bht';
        const icon = item.hasBht ? '⚠️' : '✓';
        const statusText = item.hasBht ? 'BHT Detectado' : 'Sem BHT';
        
        return `
            <div class="history-item ${status}">
                <div class="history-info">
                    <div class="history-date">${item.date}</div>
                    <div class="history-text">${icon} ${statusText} - ${item.text}</div>
                </div>
            </div>
        `;
    }).join('');
}

function clearHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        localStorage.removeItem('bht-detector-history');
        updateHistoryDisplay();
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('bht-detector-theme') || 'light';
    const body = document.body;
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
        body.classList.remove('dark-mode');
        localStorage.setItem('bht-detector-theme', 'light');
        updateThemeIcon('light');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('bht-detector-theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
}

function showLoading() {
    const resultsContainer = document.getElementById('results-container');
    const resultContent = document.getElementById('result-content');
    const resultActions = document.getElementById('result-actions');
    
    resultsContainer.style.display = 'block';
    resultActions.style.display = 'none';
    
    resultContent.innerHTML = `
        <div class="loading">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 30%"></div>
            </div>
            <p>Analisando... Aguarde.</p>
        </div>
    `;
    
    setTimeout(() => {
        const progressFill = resultContent.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = '60%';
        }
    }, 500);
    
    setTimeout(() => {
        const progressFill = resultContent.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = '90%';
        }
    }, 1000);
    
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showResults(data) {
    const resultsContainer = document.getElementById('results-container');
    const resultContent = document.getElementById('result-content');
    
    if (!data.success) {
        showError(data.error || 'Erro ao processar a análise.');
        return;
    }
    
    const hasBht = data.has_bht;
    const matches = data.matches || [];
    
    let html = '';
    
    if (hasBht) {
        html += `
            <div class="result-danger">
                <div class="result-title">⚠️ BHT DETECTADO</div>
                <div class="result-message">Este produto contém BHT ou suas variações.</div>
        `;
    } else {
        html += `
            <div class="result-success">
                <div class="result-title">✓ BHT NÃO DETECTADO</div>
                <div class="result-message">Nenhuma menção a BHT foi encontrada neste produto.</div>
        `;
    }
    
    if (matches.length > 0) {
        html += '<div class="result-matches"><strong>Encontrado(s):</strong>';
        matches.forEach(match => {
            html += `<div class="match-item">"${match.text}" encontrado na posição ${match.position}</div>`;
        });
        html += '</div>';
    }
    
    if (data.extracted_text && data.method === 'image') {
        html += `
            <div class="extracted-text">
                <strong>Texto extraído da imagem:</strong><br>
                ${data.extracted_text}
            </div>
        `;
    }
    
    html += '</div>';
    
    resultContent.innerHTML = html;
    resultsContainer.style.display = 'block';
    
    const resultActions = document.getElementById('result-actions');
    if (resultActions) {
        resultActions.style.display = 'flex';
        window.lastResultData = data;
    }
}

function showError(message) {
    const resultsContainer = document.getElementById('results-container');
    const resultContent = document.getElementById('result-content');
    
    resultContent.innerHTML = `
        <div class="result-danger">
            <div class="result-title">Erro</div>
            <div class="result-message">${message}</div>
        </div>
    `;
    resultsContainer.style.display = 'block';
}

function clearResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'none';
    
    if (previewImage) {
        previewImage.src = '';
    }
    if (imageWrapper) {
        imageWrapper.style.display = 'none';
    }
    if (document.querySelector('.upload-placeholder')) {
        document.querySelector('.upload-placeholder').style.display = 'flex';
    }
    if (analyzeImageBtn) {
        analyzeImageBtn.disabled = true;
    }
    if (imageInput) {
        imageInput.value = '';
    }
    if (cameraInput) {
        cameraInput.value = '';
    }
    if (document.getElementById('image-adjustments')) {
        document.getElementById('image-adjustments').style.display = 'none';
    }
    
    imageRotation = 0;
    imageZoom = 1;
    imageBrightness = 1;
    imageContrast = 1;
    currentImageFile = null;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
const product3d = document.querySelector('.product-3d');
if (product3d) {
    product3d.addEventListener('mousemove', (e) => {
        const rect = product3d.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        product3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    product3d.addEventListener('mouseleave', () => {
        product3d.style.transform = '';
        product3d.style.animationPlayState = 'running';
    });
}

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

initTheme();

document.getElementById('share-result-btn')?.addEventListener('click', () => {
    const resultData = window.lastResultData;
    if (!resultData) return;
    
    const hasBht = resultData.has_bht;
    const status = hasBht ? '⚠️ BHT DETECTADO' : '✓ SEM BHT';
    const text = `Resultado da análise: ${status}\n\nDetectado via BHT Detector`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Análise BHT Detector',
            text: text
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share-result-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copiado!';
        btn.style.backgroundColor = '#4ade80';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });
}

document.getElementById('save-result-btn')?.addEventListener('click', () => {
    const resultData = window.lastResultData;
    if (resultData) {
        saveToHistory(resultData);
        const btn = document.getElementById('save-result-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Salvo!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }
});

document.getElementById('clear-history-btn')?.addEventListener('click', clearHistory);

updateHistoryDisplay();

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === 'Enter') || (e.key === 'Enter' && e.target.tagName === 'TEXTAREA')) {
        const textTab = document.getElementById('text-tab');
        const imageTab = document.getElementById('image-tab');
        
        if (textTab?.classList.contains('active')) {
            document.getElementById('analyze-text-btn')?.click();
        } else if (imageTab?.classList.contains('active')) {
            const analyzeBtn = document.getElementById('analyze-image-btn');
            if (analyzeBtn && !analyzeBtn.disabled) {
                analyzeBtn.click();
            }
        }
    }
    
    if (e.ctrlKey) {
        if (e.key === '1') {
            e.preventDefault();
            document.querySelector('[data-tab="text"]')?.click();
        } else if (e.key === '2') {
            e.preventDefault();
            document.querySelector('[data-tab="image"]')?.click();
        }
    }
    
    if (e.key === 't' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleTheme();
    }
});

document.getElementById('scientific-article-btn')?.addEventListener('click', () => {
    const articlesSection = document.getElementById('scientific-articles');
    if (articlesSection) {
        const isVisible = articlesSection.style.display !== 'none';
        articlesSection.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            articlesSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});

