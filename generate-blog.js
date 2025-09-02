#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple markdown parser
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
    
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
        if (match.includes('</li>\n<li>')) {
            return '<ul>\n' + match + '\n</ul>';
        }
        return '<ul>\n' + match + '\n</ul>';
    });
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Paragraphs
    html = html.split('\n\n').map(paragraph => {
        paragraph = paragraph.trim();
        if (paragraph && 
            !paragraph.startsWith('<h') && 
            !paragraph.startsWith('<ul') && 
            !paragraph.startsWith('<ol') && 
            !paragraph.startsWith('<pre') && 
            !paragraph.startsWith('<blockquote')) {
            return '<p>' + paragraph + '</p>';
        }
        return paragraph;
    }).join('\n\n');
    
    return html;
}

// Extract metadata from markdown front matter
function extractMetadata(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (match) {
        const frontMatter = match[1];
        const body = match[2];
        
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...value] = line.split(':');
            if (key && value.length > 0) {
                metadata[key.trim()] = value.join(':').trim().replace(/"/g, '');
            }
        });
        
        return { metadata, body };
    }
    
    return { metadata: {}, body: content };
}

// Generate HTML blog post
function generateBlogPost(markdownFile) {
    try {
        const content = fs.readFileSync(markdownFile, 'utf8');
        const { metadata, body } = extractMetadata(content);
        
        // Default metadata
        const title = metadata.title || 'Untitled Post';
        const date = metadata.date || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const category = metadata.category || 'General';
        const excerpt = metadata.excerpt || body.substring(0, 200) + '...';
        
        // Convert markdown to HTML
        const articleContent = parseMarkdown(body);
        
        // Generate filename
        const slug = metadata.slug || title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        
        const htmlFilename = `blog/${slug}.html`;
        
        // HTML template
        const htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Moses Omondi</title>
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #333;
            --text-secondary: #666;
            --text-tertiary: #555;
            --border-color: #eee;
            --tag-bg: #f5f5f5;
            --tag-hover: #e8e8e8;
            --gradient-start: #667eea;
            --gradient-end: #764ba2;
            --shadow: rgba(0, 0, 0, 0.1);
            --code-bg: #f8f9fa;
            --code-border: #e9ecef;
        }

        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #e0e0e0;
            --text-secondary: #b0b0b0;
            --text-tertiary: #999;
            --border-color: #333;
            --tag-bg: #2a2a2a;
            --tag-hover: #404040;
            --gradient-start: #667eea;
            --gradient-end: #764ba2;
            --shadow: rgba(0, 0, 0, 0.3);
            --code-bg: #2d2d2d;
            --code-border: #404040;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: var(--text-color);
            background: var(--bg-color);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            border-bottom: 1px solid var(--border-color);
            z-index: 1000;
            transition: background-color 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .nav-container {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
        }

        .nav-links {
            display: flex;
            gap: 30px;
            align-items: center;
        }

        .nav-link {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            position: relative;
        }

        .nav-link:hover {
            color: var(--gradient-start);
        }

        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
            border-radius: 1px;
        }

        .theme-toggle {
            background: none;
            border: 2px solid var(--border-color);
            border-radius: 20px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            color: var(--text-color);
        }

        .theme-toggle:hover {
            border-color: var(--gradient-start);
            transform: scale(1.05);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px 60px;
            min-height: 100vh;
            padding-top: 100px;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 30px;
            color: var(--gradient-start);
            text-decoration: none;
            font-weight: 500;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .article-header {
            margin-bottom: 40px;
        }

        .article-title {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
            color: var(--text-color);
        }

        .article-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }

        .article-date::before {
            content: "📅 ";
        }

        .article-category::before {
            content: "🏷️ ";
        }

        .article-content {
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .article-content h1 {
            font-size: 2rem;
            font-weight: 700;
            margin: 40px 0 20px;
            color: var(--text-color);
        }

        .article-content h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin: 40px 0 20px;
            color: var(--text-color);
        }

        .article-content h3 {
            font-size: 1.4rem;
            font-weight: 600;
            margin: 30px 0 15px;
            color: var(--text-color);
        }

        .article-content p {
            margin-bottom: 20px;
        }

        .article-content ul, .article-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }

        .article-content li {
            margin-bottom: 8px;
        }

        .article-content code {
            background: var(--code-bg);
            border: 1px solid var(--code-border);
            border-radius: 4px;
            padding: 2px 6px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.9em;
        }

        .article-content pre {
            background: var(--code-bg);
            border: 1px solid var(--code-border);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.9em;
            line-height: 1.5;
        }

        .article-content blockquote {
            border-left: 4px solid var(--gradient-start);
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: var(--text-secondary);
        }

        .article-content a {
            color: var(--gradient-start);
            text-decoration: none;
        }

        .article-content a:hover {
            text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links {
                gap: 20px;
            }
            
            .container {
                padding-top: 80px;
            }
            
            .article-title {
                font-size: 2rem;
            }
            
            .article-content {
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            .nav-container {
                padding: 15px;
            }
            
            .nav-links {
                gap: 15px;
            }
            
            .container {
                padding: 30px 15px 40px;
                padding-top: 70px;
            }
            
            .article-title {
                font-size: 1.7rem;
            }
            
            .article-meta {
                flex-direction: column;
                gap: 5px;
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
            <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
                <span id="theme-icon">🌙</span>
            </button>
        </div>
    </nav>
    
    <div class="container">
        <a href="../blog.html" class="back-link">← Back to Blog</a>
        
        <article>
            <div class="article-header">
                <h1 class="article-title">{{TITLE}}</h1>
                <div class="article-meta">
                    <span class="article-date">{{DATE}}</span>
                    <span class="article-category">{{CATEGORY}}</span>
                </div>
            </div>
            
            <div class="article-content">
                {{CONTENT}}
            </div>
        </article>
    </div>

    <script>
        // Theme toggle functionality
        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            const currentTheme = body.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                themeIcon.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        }
        
        // Load saved theme on page load
        document.addEventListener('DOMContentLoaded', function() {
            const savedTheme = localStorage.getItem('theme');
            const themeIcon = document.getElementById('theme-icon');
            
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.textContent = '☀️';
            } else {
                themeIcon.textContent = '🌙';
            }
        });
    </script>
</body>

</html>`;

        // Write the HTML file
        fs.writeFileSync(htmlFilename, htmlTemplate
            .replace('{{TITLE}}', title)
            .replace('{{DATE}}', date)
            .replace('{{CATEGORY}}', category)
            .replace('{{CONTENT}}', articleContent)
        );
        
        console.log(`✅ Generated: ${htmlFilename}`);
        
        // Return post info for blog index update
        return {
            title,
            date,
            category,
            excerpt,
            filename: htmlFilename,
            slug
        };
        
    } catch (error) {
        console.error(`❌ Error processing ${markdownFile}:`, error.message);
        return null;
    }
}

// Update blog index with new post
function updateBlogIndex(posts) {
    try {
        let blogHtml = fs.readFileSync('blog.html', 'utf8');
        
        // Generate blog post cards with proper indentation
        const postCards = posts.map(post => `            <!-- ${post.title} -->
            <article class="blog-post" onclick="location.href='${post.filename}'">
                <h2><a href="${post.filename}">${post.title}</a></h2>
                <div class="blog-meta">
                    <span class="blog-date">${post.date}</span>
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-excerpt">
                    ${post.excerpt}
                </div>
                <a href="${post.filename}" class="read-more">Read more →</a>
            </article>`).join('\n\n');
        
        // More precise regex to replace only the blog posts content
        const updatedHtml = blogHtml.replace(
            /(<div class="blog-posts">)[\s\S]*?(<\/div>\s*<\/div>\s*<script>)/,
            `$1\n${postCards}\n        </div>\n    $2`
        );
        
        fs.writeFileSync('blog.html', updatedHtml);
        console.log('✅ Updated blog index');
        
    } catch (error) {
        console.error('❌ Error updating blog index:', error.message);
    }
}

// Main function
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('📝 Blog Post Generator');
        console.log('Usage: node generate-blog.js <markdown-file>');
        console.log('   or: node generate-blog.js --all');
        console.log('');
        console.log('Example: node generate-blog.js posts/my-new-post.md');
        return;
    }
    
    if (args[0] === '--all') {
        // Process all markdown files in posts directory
        if (!fs.existsSync('posts')) {
            console.log('❌ No posts directory found. Create posts/ and add .md files.');
            return;
        }
        
        const markdownFiles = fs.readdirSync('posts')
            .filter(file => file.endsWith('.md'))
            .map(file => path.join('posts', file));
        
        if (markdownFiles.length === 0) {
            console.log('❌ No markdown files found in posts/ directory.');
            return;
        }
        
        const posts = [];
        markdownFiles.forEach(file => {
            const post = generateBlogPost(file);
            if (post) posts.push(post);
        });
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        updateBlogIndex(posts);
        
    } else {
        // Process single file
        const markdownFile = args[0];
        
        if (!fs.existsSync(markdownFile)) {
            console.error(`❌ File not found: ${markdownFile}`);
            return;
        }
        
        const post = generateBlogPost(markdownFile);
        if (post) {
            // For single posts, you might want to manually update the blog index
            console.log('📄 Post generated successfully!');
            console.log('💡 Run with --all flag to update the blog index automatically.');
        }
    }
}

if (require.main === module) {
    main();
}

module.exports = { generateBlogPost, updateBlogIndex, parseMarkdown };
