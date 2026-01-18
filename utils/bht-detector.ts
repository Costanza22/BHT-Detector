export interface BHTDetectionResult {
  containsBHT: boolean;
  confidence: 'high' | 'medium' | 'low';
  matches: string[];
  detectedText: string;
}

const BHT_PATTERNS = [
  /\bbht\b/gi,
  /\bb\.h\.t\.?\b/gi,
  /\bb-h-t\b/gi,
  /\bbutylated\s+hydroxytoluene\b/gi,
  /\bbutylate\s+hydroxytoluene\b/gi,
  /\b3[,\s-]?5[,\s-]?di[-\s]?tert[-\s]?butyl[-\s]?4[-\s]?hydroxytoluene\b/gi,
  /\be320\b/gi,
  /\be\s*320\b/gi,
  /\bbutylated\s+hydroxytoluene\s*\(bht\)/gi,
  /\bbht\s*\(butylated\s+hydroxytoluene\)/gi,
] as const;

const INGREDIENTS_KEYWORDS = [
  'ingredientes',
  'ingredients',
  'ingrediente',
  'ingredient',
  'composição',
  'composition',
] as const;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^\w\s]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function findMatches(text: string): string[] {
  const matches: string[] = [];
  
  for (const pattern of BHT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matches.push(...match);
    }
  }
  
  return [...new Set(matches)];
}

function calculateConfidence(matches: string[]): 'high' | 'medium' | 'low' {
  if (matches.length === 0) {
    return 'low';
  }

  const hasFullName = matches.some((m) => /butylated\s+hydroxytoluene/i.test(m));
  const hasECode = matches.some((m) => /e\s*320/i.test(m));
  const hasAcronym = matches.some((m) => /\bbht\b/i.test(m));

  if (hasFullName || hasECode) {
    return 'high';
  }
  if (hasAcronym) {
    return 'medium';
  }
  
  return 'low';
}

export function detectBHT(text: string): BHTDetectionResult {
  const matches = findMatches(text);
  const containsBHT = matches.length > 0;
  const confidence = calculateConfidence(matches);

  return {
    containsBHT,
    confidence,
    matches,
    detectedText: text,
  };
}

function findIngredientsSectionStartIndex(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    const normalizedLine = normalizeText(lines[i]);
    const hasKeyword = INGREDIENTS_KEYWORDS.some((keyword) => 
      normalizedLine.includes(keyword)
    );
    
    if (hasKeyword) {
      return i;
    }
  }
  
  return -1;
}

export function extractIngredientsSection(text: string): string {
  const lines = text.split('\n');
  const startIndex = findIngredientsSectionStartIndex(lines);
  
  if (startIndex >= 0) {
    return lines.slice(startIndex).join('\n');
  }
  
  return text;
}
