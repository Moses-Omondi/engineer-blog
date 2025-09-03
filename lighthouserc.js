module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/blog.html',
      ],
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Available on',
      startServerReadyTimeout: 30000,
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.6 }],
        'categories:accessibility': ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
        'categories:pwa': 'off'
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
