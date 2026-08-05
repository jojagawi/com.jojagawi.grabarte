module.exports = {
  ci: {
    collect: {
      staticDistDir: "./out",
      staticDirFileDiscoveryDepth: 3,
      numberOfRuns: 1,
      headless: "chrome",
      disableStorageReset: false,
      settings: {
        blockedUrlPatterns: ["/404.html"],
        chromeFlags: "--headless=new --disable-gpu --no-first-run --no-default-browser-check --disable-background-networking --disable-features=Translate,MediaRouter --user-data-dir=./.lhci/chrome-profile",
      },
    },
    assert: {
      assertions: {
        // Categorías principales
        "categories:performance": ["error", { minScore: 0.4 }], // Meta: 0.4
        "categories:accessibility": ["error", { minScore: 0.9 }], // Meta: 0.95
        "categories:seo": ["error", { minScore: 0.9 }], // Meta: 0.95
        "categories:best-practices": ["error", { minScore: 0.9 }], // Meta: 0.95

        // Core Web Vitals (CWV)
        "first-contentful-paint": ["warn", { maxNumericValue: 7000 }], // Meta: 7000ms
        "largest-contentful-paint": ["warn", { maxNumericValue: 35000 }], // Meta: 35000ms
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.5 }], // Meta: 0.1
        "total-blocking-time": ["warn", { maxNumericValue: 600 }], // Meta: 200ms
        "speed-index": ["warn", { maxNumericValue: 8000 }], // Meta: 3000ms

        // Estructura y DOM
        "dom-size": ["error", { maxNumericValue: 1500 }],
        viewport: "error",

        // Recursos y tamaños
        "resource-summary:document:size": ["error", { maxNumericValue: 14000 }],
        "resource-summary:script:size": ["warn", { maxNumericValue: 800000 }],
        "resource-summary:stylesheet:size": [
          "warn",
          { maxNumericValue: 50000 },
        ],
        "resource-summary:font:count": ["warn", { maxNumericValue: 2 }],
        "resource-summary:font:size": ["warn", { maxNumericValue: 512000 }],
        "resource-summary:image:count": ["warn", { maxNumericValue: 25 }],
        "resource-summary:image:size": ["warn", { maxNumericValue: 1000000 }],
        "resource-summary:media:count": ["warn", { maxNumericValue: 2 }],
        "resource-summary:third-party:count": ["warn", { maxNumericValue: 5 }],
        "resource-summary:third-party:size": [
          "warn",
          { maxNumericValue: 250000 },
        ],

        // Imágenes
        "image-aspect-ratio-mismatch": ["warn"],
        "modern-image-formats": ["warn"],
        "uses-responsive-images": ["warn"],
        "offscreen-images": ["warn"],

        // Estilos y scripts
        "unused-css": ["warn"],
        "unused-javascript": ["warn"],
        "render-blocking-resources": ["warn"],

        // Accesibilidad extras
        "color-contrast": "warn",
        "heading-order": "warn",
        "image-alt": "warn",

        // SEO extras
        "meta-description": "warn",
        "crawlable-anchors": "warn",
        canonical: "warn",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./ci/lighthouse/",
      reportFilenamePattern: "%%PATHNAME%%.%%EXTENSION%%",
    },
  },
};
