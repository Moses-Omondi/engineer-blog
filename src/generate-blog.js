#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import hljs from 'highlight.js';
import matter from 'gray-matter';
import { format } from 'date-fns';
import sanitizeHtml from 'sanitize-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logger utility - production-ready
class Logger {
  static get isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  static info(message, ...args) {
    if (!Logger.isProduction) {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  static error(message, ...args) {
    // Always log errors, even in production
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, ...args);
  }

  static warn(message, ...args) {
    if (!Logger.isProduction) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  static success(message, ...args) {
    if (!Logger.isProduction) {
      // eslint-disable-next-line no-console
      console.log(`[SUCCESS] ${message}`, ...args);
    }
  }
}

// Configure marked with highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        Logger.error('Error highlighting code:', err.message);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true,
});

class BlogGenerator {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.postsDir = path.join(this.rootDir, 'posts');
    this.blogDir = path.join(this.rootDir, 'blog');
    this.templateCache = new Map();
  }

  async ensureDirectoriesExist() {
    try {
      await fs.access(this.blogDir);
    } catch {
      await fs.mkdir(this.blogDir, { recursive: true });
      Logger.info('Created blog directory');
    }
  }

  async loadTemplate() {
    if (this.templateCache.has('blog')) {
      return this.templateCache.get('blog');
    }

    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - Moses Omondi</title>
    <meta name="description" content="{{EXCERPT}}">
    <meta name="author" content="Moses Omondi">
    <meta property="og:title" content="{{TITLE}}">
    <meta property="og:description" content="{{EXCERPT}}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://mosesomondi.dev/blog/{{SLUG}}.html">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{TITLE}}">
    <meta name="twitter:description" content="{{EXCERPT}}">
    
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    
    <style>
        /* Mac system fonts throughout */
        * {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .blog-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 120px 24px 60px;
            line-height: 1.8;
        }
        
        .blog-header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 30px;
        }
        
        .blog-title {
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--text-color);
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }
        
        .blog-meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .blog-article {
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }
        
        .blog-article h1,
        .blog-article h2,
        .blog-article h3 {
            margin-top: 2em;
            margin-bottom: 1em;
            color: var(--text-color);
            word-wrap: break-word;
            overflow-wrap: break-word;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
            font-weight: 600;
        }
        
        .blog-article p {
            margin-bottom: 1.5em;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            text-align: justify;
            text-justify: inter-word;
        }
        
        .blog-article ul,
        .blog-article ol {
            padding-left: 1.5em;
            margin-bottom: 1.5em;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .blog-article li {
            margin-bottom: 0.5em;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        /* Prevent code snippets from being clickable */
        .blog-article pre {
            background: var(--code-bg);
            border: 1px solid var(--code-border);
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
            margin: 2em 0;
            max-width: 100%;
            font-size: 14px;
            pointer-events: none;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }
        
        .blog-article pre code {
            display: block;
            overflow-x: auto;
            white-space: pre;
            word-wrap: normal;
            background: transparent;
            padding: 0;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
            pointer-events: auto;
            user-select: text;
        }
        
        /* Inline code styling */
        .blog-article code {
            background: var(--code-bg);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
            word-break: break-word;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
        }
        
        .blog-article blockquote {
            border-left: 4px solid var(--gradient-start);
            padding-left: 20px;
            margin: 2em 0;
            font-style: italic;
            color: var(--text-secondary);
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 30px;
            color: var(--gradient-start);
            text-decoration: none;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }
        
        .back-link:hover {
            text-decoration: underline;
        }
        
        /* Enhanced Mobile Responsiveness */
        @media (max-width: 768px) {
            .blog-content {
                padding: 100px 20px 40px;
            }
            
            .blog-title {
                font-size: 1.75rem;
                line-height: 1.3;
            }
            
            .blog-header {
                margin-bottom: 40px;
                padding-bottom: 20px;
            }
            
            .blog-meta {
                gap: 10px;
                font-size: 0.85rem;
            }
            
            .blog-article h1 {
                font-size: 1.5rem;
            }
            
            .blog-article h2 {
                font-size: 1.3rem;
            }
            
            .blog-article h3 {
                font-size: 1.15rem;
            }
            
            .blog-article p {
                text-align: left;
                font-size: 1rem;
                line-height: 1.7;
            }
            
            .blog-article pre {
                padding: 15px;
                margin: 1.5em 0;
                border-radius: 8px;
                font-size: 12px;
            }
            
            .blog-article blockquote {
                padding-left: 15px;
                margin: 1.5em 0;
            }
            
            .back-link {
                margin-bottom: 20px;
                font-size: 0.9rem;
            }
        }
        
        @media (max-width: 480px) {
            .blog-content {
                padding: 90px 16px 30px;
            }
            
            .blog-title {
                font-size: 1.5rem;
            }
            
            .blog-article {
                font-size: 0.95rem;
            }
            
            .blog-article p {
                font-size: 0.95rem;
                line-height: 1.65;
            }
            
            .blog-article pre {
                font-size: 11px;
                padding: 12px;
                margin: 1.5em 0;
                border-radius: 6px;
            }
            
            .blog-article ul,
            .blog-article ol {
                padding-left: 1.2em;
            }
            
            .blog-article li {
                font-size: 0.95rem;
            }
        }
        
        /* Prevent any links in code blocks */
        .blog-article pre a,
        .blog-article code a {
            pointer-events: none;
            text-decoration: none;
            color: inherit;
        }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="nav-container">
            <div class="nav-links">
                <a href="../index.html" class="nav-link">Home</a>
                <a href="../blog.html" class="nav-link active">Blog</a>
            </div>
            <button class="theme-toggle" onclick="toggleTheme()">
                <span id="theme-icon">🌙</span>
            </button>
        </div>
    </nav>

    <main class="blog-content">
        <a href="../blog.html" class="back-link">← Back to Blog</a>
        
        <header class="blog-header">
            <h1 class="blog-title">{{TITLE}}</h1>
            <div class="blog-meta">
                <span>{{DATE}}</span>
                <span>•</span>
                <span>{{CATEGORY}}</span>
                <span>•</span>
                <span>{{READ_TIME}} min read</span>
            </div>
        </header>
        
        <article class="blog-article">
            {{CONTENT}}
        </article>
    </main>

    <script src="../js/main.js"></script>
</body>
</html>`;

    this.templateCache.set('blog', template);
    return template;
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  async processMarkdownFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { data: frontMatter, content: body } = matter(content);

      // Validate required fields
      if (!frontMatter.title) {
        throw new Error('Missing required field: title');
      }

      // Generate metadata with defaults
      const metadata = {
        title: frontMatter.title,
        date: frontMatter.date || format(new Date(), 'MMMM d, yyyy'),
        category: frontMatter.category || 'General',
        excerpt: frontMatter.excerpt || this.generateExcerpt(body),
        slug: frontMatter.slug || this.generateSlug(frontMatter.title),
      };

      // Convert markdown to HTML
      const htmlContent = marked(body);

      // Sanitize HTML for security
      const sanitizedContent = sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          'img',
          'iframe',
          'pre',
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title', 'width', 'height'],
          pre: ['class'],
          code: ['class'],
          iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
        },
      });

      return {
        metadata,
        content: sanitizedContent,
        readTime: this.calculateReadTime(body),
      };
    } catch (error) {
      Logger.error(`Error processing ${filePath}:`, error.message);
      throw error;
    }
  }

  generateExcerpt(content) {
    const plainText = content.replace(/[#*`]/g, '').substring(0, 200);
    return plainText.length === 200 ? `${plainText}...` : plainText;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async generateBlogPost(markdownPath) {
    try {
      const { metadata, content, readTime } =
        await this.processMarkdownFile(markdownPath);
      const template = await this.loadTemplate();

      const html = template
        .replace(/{{TITLE}}/g, metadata.title)
        .replace(/{{EXCERPT}}/g, metadata.excerpt)
        .replace(/{{DATE}}/g, metadata.date)
        .replace(/{{CATEGORY}}/g, metadata.category)
        .replace(/{{SLUG}}/g, metadata.slug)
        .replace(/{{READ_TIME}}/g, readTime.toString())
        .replace(/{{CONTENT}}/g, content);

      const outputPath = path.join(this.blogDir, `${metadata.slug}.html`);
      await fs.writeFile(outputPath, html, 'utf8');

      Logger.success(`Generated: ${outputPath}`);
      return { metadata, readTime };
    } catch (error) {
      Logger.error(
        `Failed to generate blog post from ${markdownPath}:`,
        error.message
      );
      throw error;
    }
  }

  async updateBlogIndex(posts) {
    try {
      // Sort posts by date (newest first)
      posts.sort(
        (a, b) => new Date(b.metadata.date) - new Date(a.metadata.date)
      );

      const postsHtml = posts
        .map(
          post => `
            <article class="blog-post" onclick="location.href='blog/${post.metadata.slug}.html'">
                <h2><a href="blog/${post.metadata.slug}.html">${post.metadata.title}</a></h2>
                <div class="blog-meta">
                    <span class="blog-date">${post.metadata.date}</span>
                    <span class="blog-category">${post.metadata.category}</span>
                </div>
                <div class="blog-excerpt">
                    ${post.metadata.excerpt}
                </div>
                <a href="blog/${post.metadata.slug}.html" class="read-more">Read more →</a>
            </article>
      `
        )
        .join('\n\n');

      // Read current blog.html and update the posts section
      const blogIndexPath = path.join(this.rootDir, 'blog.html');
      let blogHtml;

      try {
        blogHtml = await fs.readFile(blogIndexPath, 'utf8');
      } catch {
        Logger.warn('blog.html not found, skipping index update');
        return;
      }

      // Replace posts section - find the blog-posts div and replace its content
      // More specific regex to match the entire blog-posts container
      const updatedHtml = blogHtml.replace(
        /<div class="blog-posts">[\s\S]*?<\/div>\s*<\/div>/,
        `<div class="blog-posts">${postsHtml}</div>\n    </div>`
      );

      await fs.writeFile(blogIndexPath, updatedHtml, 'utf8');
      Logger.success('Updated blog index');
    } catch (error) {
      Logger.error('Failed to update blog index:', error.message);
    }
  }

  async generateAll() {
    try {
      await this.ensureDirectoriesExist();

      const files = await fs.readdir(this.postsDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      if (markdownFiles.length === 0) {
        Logger.warn('No markdown files found in posts directory');
        return;
      }

      Logger.info(`Found ${markdownFiles.length} markdown files to process`);

      const posts = [];
      for (const file of markdownFiles) {
        const filePath = path.join(this.postsDir, file);
        try {
          const post = await this.generateBlogPost(filePath);
          posts.push(post);
        } catch (error) {
          Logger.error(`Skipping ${file} due to error:`, error.message);
        }
      }

      if (posts.length > 0) {
        await this.updateBlogIndex(posts);
        Logger.success(`Successfully generated ${posts.length} blog posts`);
      }
    } catch (error) {
      Logger.error('Failed to generate blog:', error.message);
      process.exit(1);
    }
  }

  async generateSingle(filePath) {
    try {
      await this.ensureDirectoriesExist();
      await this.generateBlogPost(filePath);
    } catch (error) {
      Logger.error('Failed to generate single post:', error.message);
      process.exit(1);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const generator = new BlogGenerator();

  if (args.includes('--all')) {
    await generator.generateAll();
  } else if (args.length === 1) {
    const filePath = path.resolve(args[0]);
    await generator.generateSingle(filePath);
  } else {
    Logger.info('Usage:');
    Logger.info('  node generate-blog.js --all          # Generate all posts');
    Logger.info(
      '  node generate-blog.js <file.md>      # Generate single post'
    );
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Always run main when this file is executed directly
if (
  import.meta.url.startsWith('file://') &&
  process.argv[1].includes('generate-blog.js')
) {
  main();
}

export default BlogGenerator;
