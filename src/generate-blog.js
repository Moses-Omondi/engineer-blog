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
    
    <link rel="stylesheet" href="../public/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    
    <style>
        .blog-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 120px 20px 60px;
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
            font-weight: 400;
            margin-bottom: 20px;
            color: var(--text-color);
            letter-spacing: -0.02em;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .blog-meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .blog-meta span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .blog-article {
            color: var(--text-secondary);
        }
        
        .blog-article h1,
        .blog-article h2,
        .blog-article h3 {
            margin-top: 2em;
            margin-bottom: 1em;
            color: var(--text-color);
            font-weight: 500;
        }
        
        .blog-article h1 {
            font-size: 2rem;
        }
        
        .blog-article h2 {
            font-size: 1.6rem;
        }
        
        .blog-article h3 {
            font-size: 1.3rem;
        }
        
        .blog-article p {
            margin-bottom: 1.5em;
            line-height: 1.8;
        }
        
        .blog-article pre {
            background: var(--code-bg);
            border: 1px solid var(--code-border);
            border-radius: 12px;
            padding: 20px;
            overflow-x: auto;
            margin: 2em 0;
            font-size: 0.9rem;
        }
        
        .blog-article code {
            background: var(--code-bg);
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 0.9em;
            color: var(--gradient-start);
            font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
        }
        
        .blog-article pre code {
            padding: 0;
            background: none;
            color: inherit;
        }
        
        .blog-article blockquote {
            border-left: 4px solid var(--gradient-start);
            padding-left: 20px;
            margin: 2em 0;
            font-style: italic;
            color: var(--text-secondary);
            background: var(--tag-bg);
            padding: 20px 20px 20px 30px;
            border-radius: 8px;
        }
        
        .blog-article ul,
        .blog-article ol {
            margin-bottom: 1.5em;
            padding-left: 30px;
        }
        
        .blog-article li {
            margin-bottom: 0.5em;
        }
        
        .blog-article a {
            color: var(--gradient-start);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .blog-article a:hover {
            color: var(--gradient-end);
            text-decoration: underline;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 30px;
            color: var(--gradient-start);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            gap: 12px;
            color: var(--gradient-end);
        }
        
        .back-link::before {
            content: "←";
            transition: transform 0.3s ease;
        }
        
        .back-link:hover::before {
            transform: translateX(-3px);
        }
        
        @media (max-width: 768px) {
            .blog-title {
                font-size: 2rem;
            }
            
            .blog-content {
                padding: 100px 15px 40px;
            }
        }
        
        @media (max-width: 480px) {
            .blog-title {
                font-size: 1.7rem;
            }
            
            .blog-content {
                padding: 90px 15px 30px;
            }
            
            .blog-article h1 {
                font-size: 1.7rem;
            }
            
            .blog-article h2 {
                font-size: 1.4rem;
            }
            
            .blog-article h3 {
                font-size: 1.2rem;
            }
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

    <script src="../public/js/main.js"></script>
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

      // Replace posts section (this is a simple implementation)
      const updatedHtml = blogHtml.replace(
        /<div class="blog-posts">.*?<\/div>/s,
        `<div class="blog-posts">${postsHtml}</div>`
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
