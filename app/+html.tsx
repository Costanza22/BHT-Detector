import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        <meta name="description" content="BHT Detector - Aplicativo desenvolvido por Costanza Pasquotto Assef para detectar BHT (Butylated Hydroxytoluene) em rótulos de alimentos usando câmera e OCR." />
        <meta name="keywords" content="BHT Detector, Costanza Pasquotto Assef, detector BHT, Butylated Hydroxytoluene, app alimentos, OCR rótulos, análise ingredientes, app mobile, React Native, Expo" />
        <meta name="author" content="Costanza Pasquotto Assef" />
        <meta name="copyright" content="Copyright (c) 2025 Costanza Pasquotto Assef" />
        
        <meta property="og:title" content="BHT Detector - Criado por Costanza Pasquotto Assef" />
        <meta property="og:description" content="Aplicativo mobile desenvolvido por Costanza Pasquotto Assef para detectar BHT em rótulos de alimentos." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BHT Detector" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BHT Detector - Costanza Pasquotto Assef" />
        <meta name="twitter:description" content="Aplicativo desenvolvido por Costanza Pasquotto Assef para detectar BHT em alimentos." />
        
        <link rel="canonical" href="https://bht-detector.vercel.app" />
        
        <ScrollViewStyleReset />
        {children}
      </head>
      <body>{children}</body>
    </html>
  );
}

