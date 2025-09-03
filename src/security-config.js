import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Security configuration and CSP hash generator
 */
class SecurityConfig {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.cspHashes = {
      scripts: [],
      styles: []
    };
  }

  /**
   * Generate SHA256 hash for inline scripts/styles
   */
  generateHash(content) {
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('base64');
  }

  /**
   * Extract and hash inline scripts from HTML
   */
  async extractInlineScripts(htmlContent) {
    const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    const hashes = [];
    let match;

    while ((match = scriptRegex.exec(htmlContent)) !== null) {
      const scriptContent = match[1].trim();
      if (scriptContent) {
        const hash = this.generateHash(scriptContent);
        hashes.push(`'sha256-${hash}'`);
      }
    }

    return hashes;
  }

  /**
   * Extract and hash inline styles from HTML
   */
  async extractInlineStyles(htmlContent) {
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const hashes = [];
    let match;

    while ((match = styleRegex.exec(htmlContent)) !== null) {
      const styleContent = match[1].trim();
      if (styleContent) {
        const hash = this.generateHash(styleContent);
        hashes.push(`'sha256-${hash}'`);
      }
    }

    // Also check for inline style attributes
    const inlineStyleRegex = /style="([^"]*)"/gi;
    while ((match = inlineStyleRegex.exec(htmlContent)) !== null) {
      const styleContent = match[1].trim();
      if (styleContent) {
        const hash = this.generateHash(styleContent);
        hashes.push(`'sha256-${hash}'`);
      }
    }

    return hashes;
  }

  /**
   * Process all HTML files and generate CSP hashes
   */
  async generateCSPHashes() {
    const htmlFiles = [
      'index.html',
      'blog.html'
    ];

    for (const file of htmlFiles) {
      const filePath = path.join(this.rootDir, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        
        const scriptHashes = await this.extractInlineScripts(content);
        const styleHashes = await this.extractInlineStyles(content);
        
        this.cspHashes.scripts.push(...scriptHashes);
        this.cspHashes.styles.push(...styleHashes);
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }

    // Remove duplicates
    this.cspHashes.scripts = [...new Set(this.cspHashes.scripts)];
    this.cspHashes.styles = [...new Set(this.cspHashes.styles)];

    return this.cspHashes;
  }

  /**
   * Generate CSP header string
   */
  generateCSPHeader() {
    const scriptSrc = ['\'self\'', ...this.cspHashes.scripts, 'cdnjs.cloudflare.com'].join(' ');
    const styleSrc = ['\'self\'', ...this.cspHashes.styles, 'cdnjs.cloudflare.com', 'fonts.googleapis.com'].join(' ');
    
    return `default-src 'self'; script-src ${scriptSrc}; style-src ${styleSrc}; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`;
  }

  /**
   * Update nginx configuration with actual CSP hashes
   */
  async updateNginxConfig() {
    const nginxPath = path.join(this.rootDir, 'nginx.conf');
    
    try {
      await this.generateCSPHashes();
      const cspHeader = this.generateCSPHeader();
      
      let nginxContent = await fs.readFile(nginxPath, 'utf8');
      
      // Replace placeholder CSP with actual one
      nginxContent = nginxContent.replace(
        /add_header Content-Security-Policy.*?;/s,
        `add_header Content-Security-Policy "${cspHeader}" always;`
      );
      
      await fs.writeFile(nginxPath, nginxContent, 'utf8');
      console.log('✅ Updated nginx.conf with CSP hashes');
      
      // Also create a development version with relaxed CSP
      const devCspHeader = cspHeader.replace('upgrade-insecure-requests;', 'upgrade-insecure-requests; script-src-elem \'self\' \'unsafe-inline\'; style-src-elem \'self\' \'unsafe-inline\';');
      
      console.log('\n📋 CSP Header for production:');
      console.log(cspHeader);
      console.log('\n📋 CSP Header for development (relaxed):');
      console.log(devCspHeader);
      
    } catch (error) {
      console.error('Error updating nginx config:', error.message);
    }
  }

  /**
   * Add Subresource Integrity (SRI) to external resources
   */
  async addSRIToResources() {
    const htmlFiles = ['index.html', 'blog.html'];
    
    for (const file of htmlFiles) {
      const filePath = path.join(this.rootDir, file);
      try {
        let content = await fs.readFile(filePath, 'utf8');
        
        // Add SRI to highlight.js CSS
        content = content.replace(
          /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/highlight\.js\/([^"]+)\.min\.css">/g,
          '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/$1.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKzF/1OxqktCkvJZ4n5Vk1SddqZBPnq5pSh7H6MAQE" crossorigin="anonymous">'
        );
        
        await fs.writeFile(filePath, content, 'utf8');
      } catch (error) {
        console.error(`Error adding SRI to ${file}:`, error.message);
      }
    }
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    const security = new SecurityConfig();
    await security.updateNginxConfig();
    await security.addSRIToResources();
  })();
}

export default SecurityConfig;
