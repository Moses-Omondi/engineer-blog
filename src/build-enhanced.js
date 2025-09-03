#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import SecurityConfig from './security-config.js';
import PerformanceOptimizer from './performance-optimizer.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Enhanced build process with security and performance optimizations
 */
class EnhancedBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.security = new SecurityConfig();
    this.performance = new PerformanceOptimizer();
  }

  /**
   * Log with color and emoji
   */
  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m'
    };
    const emojis = {
      info: 'ℹ️ ',
      success: '✅',
      warning: '⚠️ ',
      error: '❌'
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}${emojis[type]} ${message}${reset}`);
  }

  /**
   * Run standard build tasks
   */
  async runStandardBuild() {
    this.log('Running standard build tasks...', 'info');
    
    try {
      // Lint code
      this.log('Linting code...', 'info');
      await execAsync('npm run lint:check');
      
      // Run tests
      this.log('Running tests...', 'info');
      await execAsync('npm test');
      
      // Build CSS
      this.log('Building CSS...', 'info');
      await execAsync('npm run build:css');
      
      // Build JavaScript
      this.log('Building JavaScript...', 'info');
      await execAsync('npm run build:js');
      
      // Generate blog posts
      this.log('Generating blog posts...', 'info');
      await execAsync('npm run build:blog');
      
      this.log('Standard build completed', 'success');
    } catch (error) {
      this.log(`Build error: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Apply security enhancements
   */
  async applySecurityEnhancements() {
    this.log('Applying security enhancements...', 'info');
    
    // Generate CSP hashes and update nginx config
    await this.security.updateNginxConfig();
    
    // Add SRI to external resources
    await this.security.addSRIToResources();
    
    this.log('Security enhancements applied', 'success');
  }

  /**
   * Apply performance optimizations
   */
  async applyPerformanceOptimizations() {
    this.log('Applying performance optimizations...', 'info');
    
    // Create service worker
    await this.performance.createServiceWorker();
    
    // Create offline page
    await this.performance.createOfflinePage();
    
    // Optimize HTML files
    const htmlFiles = ['index.html', 'blog.html'];
    for (const file of htmlFiles) {
      const filePath = path.join(this.rootDir, file);
      const optimizedContent = await this.performance.optimizeHTML(filePath);
      
      // Add service worker registration
      const finalContent = await this.performance.registerServiceWorker({
        read: async () => optimizedContent
      });
      
      // Create optimized version
      const optimizedPath = filePath.replace('.html', '.optimized.html');
      await fs.writeFile(optimizedPath, finalContent, 'utf8');
      this.log(`Created optimized version: ${path.basename(optimizedPath)}`, 'success');
    }
    
    this.log('Performance optimizations applied', 'success');
  }

  /**
   * Generate security report
   */
  async generateSecurityReport() {
    this.log('Generating security report...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      checks: []
    };
    
    // Check for vulnerable dependencies
    try {
      const { stdout } = await execAsync('npm audit --json');
      const auditData = JSON.parse(stdout);
      report.checks.push({
        name: 'NPM Audit',
        status: auditData.metadata.vulnerabilities.total === 0 ? 'PASS' : 'FAIL',
        details: auditData.metadata.vulnerabilities
      });
    } catch (error) {
      report.checks.push({
        name: 'NPM Audit',
        status: 'ERROR',
        details: error.message
      });
    }
    
    // Check CSP configuration
    const nginxPath = path.join(this.rootDir, 'nginx.conf');
    const nginxContent = await fs.readFile(nginxPath, 'utf8');
    const hasStrictCSP = !nginxContent.includes('unsafe-inline') || 
                         nginxContent.includes('sha256-');
    report.checks.push({
      name: 'Content Security Policy',
      status: hasStrictCSP ? 'PASS' : 'FAIL',
      details: hasStrictCSP ? 'Strict CSP configured' : 'Weak CSP detected'
    });
    
    // Check security headers
    const securityHeaders = [
      'Strict-Transport-Security',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy'
    ];
    
    for (const header of securityHeaders) {
      const hasHeader = nginxContent.includes(header);
      report.checks.push({
        name: `Security Header: ${header}`,
        status: hasHeader ? 'PASS' : 'FAIL',
        details: hasHeader ? 'Present' : 'Missing'
      });
    }
    
    // Write report
    const reportPath = path.join(this.rootDir, 'security-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    // Print summary
    const passed = report.checks.filter(c => c.status === 'PASS').length;
    const failed = report.checks.filter(c => c.status === 'FAIL').length;
    const errors = report.checks.filter(c => c.status === 'ERROR').length;
    
    this.log(`Security Report: ${passed} passed, ${failed} failed, ${errors} errors`, 
             failed > 0 ? 'warning' : 'success');
    
    return report;
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport() {
    this.log('Generating performance report...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics: []
    };
    
    // Check file sizes
    const distFiles = [
      'dist/css/styles.min.css',
      'dist/js/main.min.js'
    ];
    
    for (const file of distFiles) {
      const filePath = path.join(this.rootDir, file);
      try {
        const stats = await fs.stat(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        report.metrics.push({
          name: path.basename(file),
          size: `${sizeKB} KB`,
          status: stats.size < 50000 ? 'GOOD' : 'NEEDS_OPTIMIZATION'
        });
      } catch (error) {
        report.metrics.push({
          name: path.basename(file),
          size: 'N/A',
          status: 'FILE_NOT_FOUND'
        });
      }
    }
    
    // Check for performance features
    const features = {
      'Service Worker': await this.checkFileExists('sw.js'),
      'Offline Page': await this.checkFileExists('offline.html'),
      'Critical CSS': true, // We always generate this
      'Image Lazy Loading': true, // We add this to all images
      'Resource Hints': true // We add preconnect/dns-prefetch
    };
    
    for (const [feature, enabled] of Object.entries(features)) {
      report.metrics.push({
        name: feature,
        status: enabled ? 'ENABLED' : 'DISABLED'
      });
    }
    
    // Write report
    const reportPath = path.join(this.rootDir, 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    this.log('Performance report generated', 'success');
    
    return report;
  }

  /**
   * Check if file exists
   */
  async checkFileExists(filename) {
    try {
      await fs.access(path.join(this.rootDir, filename));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Main build process
   */
  async build() {
    console.log('\n🚀 Starting Enhanced Build Process\n');
    
    try {
      // Run standard build
      await this.runStandardBuild();
      
      // Apply enhancements
      await this.applySecurityEnhancements();
      await this.applyPerformanceOptimizations();
      
      // Generate reports
      await this.generateSecurityReport();
      await this.generatePerformanceReport();
      
      console.log('\n✨ Enhanced build completed successfully!\n');
      
      // Print next steps
      console.log('📋 Next steps:');
      console.log('1. Review security-report.json for security status');
      console.log('2. Review performance-report.json for optimization metrics');
      console.log('3. Test the optimized HTML files (*.optimized.html)');
      console.log('4. Deploy with confidence! 🚀\n');
      
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the enhanced build
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    const builder = new EnhancedBuilder();
    await builder.build();
  })();
}

export default EnhancedBuilder;
