import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Performance optimization utilities
 */
class PerformanceOptimizer {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.criticalCSS = '';
  }

  /**
   * Extract critical CSS for above-the-fold content
   */
  async extractCriticalCSS() {
    const cssPath = path.join(this.rootDir, 'css', 'styles.css');
    const cssContent = await fs.readFile(cssPath, 'utf8');
    
    // Critical CSS rules for above-the-fold content
    const criticalSelectors = [
      ':root',
      '[data-theme="dark"]',
      '*',
      'html',
      'body',
      '.nav',
      '.nav-container',
      '.nav-links',
      '.nav-link',
      '.theme-toggle',
      '.container',
      '.profile',
      '.subtitle',
      '.description',
      '.terminal-window',
      '.terminal-header',
      '.terminal-body',
      '.terminal-line',
      '.terminal-prompt',
      '.terminal-command',
      '.cursor',
      'h1',
      'h2',
      'p'
    ];
    
    // Parse CSS and extract critical rules
    const criticalRules = [];
    const root = postcss.parse(cssContent);
    
    root.walkRules(rule => {
      // Check if this rule matches any critical selector
      const isMatch = criticalSelectors.some(selector => {
        if (selector.startsWith(':') || selector.startsWith('[')) {
          return rule.selector.includes(selector);
        }
        return rule.selector === selector || 
               rule.selector.startsWith(selector + ' ') ||
               rule.selector.startsWith(selector + ',') ||
               rule.selector.includes(', ' + selector) ||
               rule.selector.includes(',' + selector);
      });
      
      if (isMatch) {
        criticalRules.push(rule.toString());
      }
    });
    
    // Minify critical CSS
    const minified = await postcss([cssnano()]).process(criticalRules.join('\n'), {
      from: undefined
    });
    
    this.criticalCSS = minified.css;
    return this.criticalCSS;
  }

  /**
   * Inject critical CSS and performance optimizations into HTML
   */
  async optimizeHTML(htmlPath) {
    let content = await fs.readFile(htmlPath, 'utf8');
    
    // Extract critical CSS if not done yet
    if (!this.criticalCSS) {
      await this.extractCriticalCSS();
    }
    
    // Add critical CSS inline in head
    const criticalCSSTag = `<style>${this.criticalCSS}</style>`;
    
    // Add resource hints for performance
    const resourceHints = `
    <!-- DNS Prefetch and Preconnect for external resources -->
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="css/styles.css" as="style">
    <link rel="preload" href="js/main.js" as="script">
    
    <!-- Critical CSS -->
    ${criticalCSSTag}
    
    <!-- Load main CSS asynchronously -->
    <link rel="preload" href="css/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/styles.css"></noscript>`;
    
    // Replace existing stylesheet link with optimized version
    content = content.replace(
      /<link rel="stylesheet" href="css\/styles\.css">/,
      resourceHints
    );
    
    // Add loading="lazy" to images
    content = content.replace(
      /<img([^>]*?)>/g,
      (match, attrs) => {
        if (!attrs.includes('loading=')) {
          return `<img${attrs} loading="lazy">`;
        }
        return match;
      }
    );
    
    // Add Web Vitals monitoring script
    const webVitalsScript = `
    <script>
      // Web Vitals monitoring
      if ('PerformanceObserver' in window) {
        try {
          // First Contentful Paint
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                console.log('FCP:', entry.startTime);
              }
            }
          }).observe({type: 'paint', buffered: true});
          
          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
          }).observe({type: 'largest-contentful-paint', buffered: true});
          
          // Cumulative Layout Shift
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log('CLS:', clsValue);
              }
            }
          }).observe({type: 'layout-shift', buffered: true});
        } catch (e) {
          console.error('Web Vitals monitoring error:', e);
        }
      }
    </script>`;
    
    // Add Web Vitals script before closing body tag
    content = content.replace('</body>', `${webVitalsScript}</body>`);
    
    return content;
  }

  /**
   * Create a service worker for offline support and caching
   */
  async createServiceWorker() {
    const swContent = `
// Service Worker for Moses Omondi's Blog
const CACHE_NAME = 'blog-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/blog.js',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // HTML requests - Network First strategy
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => response || caches.match('/offline.html'));
        })
    );
    return;
  }
  
  // Static assets - Cache First strategy
  if (url.pathname.match(/\\.(css|js|jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request).then(response => {
            // Don't cache non-200 responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          });
        })
    );
    return;
  }
  
  // Default - Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Background sync for offline form submissions (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Moses Omondi Blog', options)
  );
});`;

    const swPath = path.join(this.rootDir, 'sw.js');
    await fs.writeFile(swPath, swContent.trim(), 'utf8');
    console.log('✅ Created service worker');
    
    return swPath;
  }

  /**
   * Create an offline fallback page
   */
  async createOfflinePage() {
    const offlineHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Moses Omondi</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .offline-container {
            text-align: center;
            padding: 2rem;
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        button {
            background: white;
            color: #667eea;
            border: none;
            padding: 1rem 2rem;
            font-size: 1rem;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <div class="offline-container">
        <h1>📡 You're Offline</h1>
        <p>It looks like you've lost your internet connection.<br>Some content may still be available offline.</p>
        <button onclick="window.location.reload()">Try Again</button>
    </div>
</body>
</html>`;

    const offlinePath = path.join(this.rootDir, 'offline.html');
    await fs.writeFile(offlinePath, offlineHTML, 'utf8');
    console.log('✅ Created offline page');
    
    return offlinePath;
  }

  /**
   * Register service worker in HTML files
   */
  async registerServiceWorker(htmlPath) {
    let content = await fs.readFile(htmlPath, 'utf8');
    
    const swRegistration = `
    <script>
      // Register Service Worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered:', registration))
            .catch(error => console.log('ServiceWorker registration failed:', error));
        });
      }
    </script>`;
    
    // Add before closing body tag
    content = content.replace('</body>', `${swRegistration}</body>`);
    
    return content;
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    const optimizer = new PerformanceOptimizer();
    await optimizer.extractCriticalCSS();
    await optimizer.createServiceWorker();
    await optimizer.createOfflinePage();
    console.log('✅ Performance optimizations completed');
  })();
}

export default PerformanceOptimizer;
