import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="google-site-verification" content="0l9phNowmklk5xSA8l_rtd_W7dWOxO_pPGkCfyTCO4M" />
        
        <meta name="description" content="BHT Detector - Detecte BHT (Butylated Hydroxytoluene) em rótulos de alimentos. Use sua câmera para escanear ingredientes e descubra se o produto contém BHT. Aplicativo gratuito e fácil de usar." />
        <meta name="keywords" content="BHT Detector, detector BHT, Butylated Hydroxytoluene, BHT em alimentos, escanear rótulos, detectar BHT, app BHT, verificar ingredientes, BHT detector online, app alimentos saudáveis, OCR rótulos, análise ingredientes" />
        <meta name="author" content="Costanza Pasquotto Assef" />
        <meta name="copyright" content="Copyright (c) 2025 Costanza Pasquotto Assef" />
        
        <meta property="og:title" content="BHT Detector - Detecte BHT em Rótulos de Alimentos" />
        <meta property="og:description" content="Use sua câmera para escanear rótulos e descobrir se o produto contém BHT (Butylated Hydroxytoluene). Aplicativo gratuito e fácil de usar." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BHT Detector" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BHT Detector - Costanza Pasquotto Assef" />
        <meta name="twitter:description" content="Aplicativo desenvolvido por Costanza Pasquotto Assef para detectar BHT em alimentos." />
        
        <link rel="canonical" href="https://bhtdetector.com.br" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BHT Detector" />
        
        <style>{`
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          html {
            font-size: 16px !important;
            -webkit-text-size-adjust: 100% !important;
            -moz-text-size-adjust: 100% !important;
            text-size-adjust: 100% !important;
          }
          body {
            font-size: 16px !important;
            line-height: 1.5;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          @media (max-width: 768px) {
            html {
              font-size: 16px !important;
            }
            body {
              font-size: 16px !important;
            }
          }
          div, p, span, a, button, input, textarea, label {
            font-size: inherit;
          }
          [class*="r-146c3p1"], [class*="css-146c3p1"] {
            font-size: 18px !important;
            line-height: 26px !important;
          }
          [class*="r-1jxf684"], [class*="css-1jxf684"] {
            font-size: 36px !important;
            line-height: 40px !important;
            font-weight: bold !important;
          }
          [class*="r-1awa8pu"], [class*="css-1awa8pu"] {
            font-size: 22px !important;
            line-height: 28px !important;
            font-weight: bold !important;
          }
        `}</style>
        
        <ScrollViewStyleReset />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('Service Worker registrado:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('Erro ao registrar Service Worker:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}


