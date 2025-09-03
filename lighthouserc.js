module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/blog.html',
      ],
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Available on:',
      startServerReadyTimeout: 30000,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.7 }],
        
        // Performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 2500 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        'interactive': ['warn', { maxNumericValue: 5000 }],
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'tabindex': 'error',
        
        // Best practices
        'uses-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error',
        
        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'viewport': 'error',
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 2000 }],
        'unused-javascript': ['warn', { maxLength: 5000 }],
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
