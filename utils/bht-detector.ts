/**
 * Copyright (c) 2025 Costanza Pasquotto Assef
 * All Rights Reserved
 * 
 * Criado por: Costanza Pasquotto Assef
 * 
 * Este arquivo contém algoritmos proprietários para detecção de BHT.
 * É proibida a cópia, modificação ou distribuição sem autorização.
 */

export interface BHTDetectionResult {
  containsBHT: boolean;
  confidence: 'high' | 'medium' | 'low';
  matches: string[];
  detectedText: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectBHT(text: string): BHTDetectionResult {
  const normalizedText = normalizeText(text);
  const originalText = text;
  
  const patterns = [
    /\bbht\b/gi,
    /\bb\.h\.t\.?\b/gi,
    /\bb-h-t\b/gi,
    /\bbutylated\s+hydroxytoluene\b/gi,
    /\bbutylate\s+hydroxytoluene\b/gi,
    /\b3[,\s-]?5[,\s-]?di[-\s]?tert[-\s]?butyl[-\s]?4[-\s]?hydroxytoluene\b/gi,
    /\b3[,\s-]?5[,\s-]?di[-\s]?tert[-\s]?butyl[-\s]?4[-\s]?hydroxytoluene\b/gi,
    /\be320\b/gi,
    /\be\s*320\b/gi,
    /\bbutylated\s+hydroxytoluene\s*\(bht\)/gi,
    /\bbht\s*\(butylated\s+hydroxytoluene\)/gi,
  ];

  const matches: string[] = [];
  let foundMatch = false;

  patterns.forEach((pattern) => {
    const match = originalText.match(pattern);
    if (match) {
      matches.push(...match);
      foundMatch = true;
    }
  });

  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  if (foundMatch) {
    if (
      matches.some((m) => /butylated\s+hydroxytoluene/i.test(m)) ||
      matches.some((m) => /e\s*320/i.test(m))
    ) {
      confidence = 'high';
    }
    else if (matches.some((m) => /\bbht\b/i.test(m))) {
      confidence = 'medium';
    }
  }

  return {
    containsBHT: foundMatch,
    confidence,
    matches: [...new Set(matches)],
    detectedText: originalText,
  };
}

export function extractIngredientsSection(text: string): string {
  const lines = text.split('\n');
  const ingredientsKeywords = [
    'ingredientes',
    'ingredients',
    'ingrediente',
    'ingredient',
    'composição',
    'composition',
  ];

  let ingredientsStartIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = normalizeText(lines[i]);
    if (ingredientsKeywords.some((keyword) => line.includes(keyword))) {
      ingredientsStartIndex = i;
      break;
    }
  }

  if (ingredientsStartIndex >= 0) {
    return lines.slice(ingredientsStartIndex).join('\n');
  }

  return text;
}

