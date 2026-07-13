module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      staticDirFileDiscoveryDepth: 4,
      settings: {
        blockedUrlPatterns: ['/404.html'],
      },
      numberOfRuns: 1,
      headless: 'chrome',
      disableStorageReset: false,
    },
    assert: {
      assertions: {
        // Categorías principales
        "categories:performance": ["error", {minScore: 0.45}], // Meta: 0.95
        "categories:accessibility": ["error", {minScore: 0.90}], // Meta: 0.95
        "categories:seo": ["error", {minScore: 0.90}], // Meta: 0.95
        "categories:best-practices": ["error", {minScore: 0.90}], // Meta: 0.95

        // Core Web Vitals (CWV)
        "first-contentful-paint": ["warn", {maxNumericValue: 6000}], // Meta: 1500ms
        "largest-contentful-paint": ["warn", {maxNumericValue: 8000}], // Meta: 2500ms
        "cumulative-layout-shift": ["warn", {maxNumericValue: 0.5}], // Meta: 0.1
        "total-blocking-time": ["warn", {maxNumericValue: 600}], // Meta: 200ms
        "speed-index": ["warn", {maxNumericValue: 8000}], // Meta: 3000ms

        // Estructura y DOM
        "dom-size": ["error", {maxNumericValue: 1500}],
        "viewport": "error",

        // Recursos y tamaños
        "resource-summary:document:size": ["error", {maxNumericValue: 14000}],
        "resource-summary:script:size": ["warn", {maxNumericValue: 120000}],
        "resource-summary:stylesheet:size": ["warn", {maxNumericValue: 50000}],
        "resource-summary:font:count": ["warn", {maxNumericValue: 2}],
        "resource-summary:font:size": ["warn", {maxNumericValue: 512000}],
        "resource-summary:image:count": ["warn", {maxNumericValue: 25}],
        "resource-summary:image:size": ["warn", {maxNumericValue: 1000000}],
        "resource-summary:media:count": ["warn", {maxNumericValue: 2}],
        "resource-summary:third-party:count": ["warn", {maxNumericValue: 5}],
        "resource-summary:third-party:size": ["warn", {maxNumericValue: 250000}],

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
        "canonical": "warn"
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './ci/lighthouse/',
      reportFilenamePattern: '%%PATHNAME%%.%%EXTENSION%%',
    },
  },
};
