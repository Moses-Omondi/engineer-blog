# 📝 Blog System Guide

This blog system allows you to write posts in **Markdown** and automatically convert them to styled HTML that matches your site's design perfectly.

## 🚀 Quick Start

### 1. Write Your Blog Post in Markdown

Create a new `.md` file in the `posts/` directory:

```markdown
---
title: "Your Blog Post Title"
date: "September 2, 2025"
category: "Technology"
excerpt: "A brief description of your post that appears on the blog listing page."
slug: "your-blog-post-title"  # Optional: will auto-generate from title
---

# Your Blog Post Title

Write your content here using standard Markdown syntax...

## Section Header

Your content with **bold text**, *italic text*, and `code snippets`.

### Subsection

* Bullet points work
* Lists are supported
* All markdown features

```python
# Code blocks are properly styled
def example_function():
    return "Hello, World!"
```

> Blockquotes look great too!

[Links work perfectly](https://example.com)
```

### 2. Generate the HTML

Run one of these commands:

```bash
# Generate a single blog post
node generate-blog.js posts/your-new-post.md

# Generate all posts and update the blog index
node generate-blog.js --all
```

### 3. That's It! 

Your post is now live with:
- ✅ **Perfect styling** that matches your site
- ✅ **Dark/light mode** support  
- ✅ **Mobile responsive** design
- ✅ **Automatic navigation** 
- ✅ **SEO-friendly** HTML structure

## 📋 Front Matter Fields

The metadata at the top of your markdown file:

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ Yes | The post title |
| `date` | No | Publication date (defaults to today) |
| `category` | No | Post category (defaults to "General") |
| `excerpt` | No | Short description (auto-generated from content) |
| `slug` | No | URL-friendly filename (auto-generated from title) |

## 📁 File Structure

```
engineer-blog/
├── posts/                    # Your markdown files go here
│   ├── my-first-post.md
│   └── another-post.md
├── blog/                     # Generated HTML files
│   ├── my-first-post.html
│   └── another-post.html
├── blog.html                 # Blog listing page (auto-updated)
├── generate-blog.js          # The magic script
└── BLOG_GUIDE.md            # This guide
```

## ✍️ Writing Tips

### Supported Markdown Features:
- **Headers** (`#`, `##`, `###`)
- **Bold** and *italic* text
- `Inline code` and code blocks
- Lists (bulleted and numbered)
- [Links](https://example.com)
- > Blockquotes
- Images (just add them to an `images/` folder)

### Best Practices:
1. **Keep filenames simple**: Use lowercase with dashes (e.g., `my-blog-post.md`)
2. **Write good excerpts**: They appear on the blog listing page
3. **Use clear headers**: They create a good reading structure
4. **Test locally**: Open the generated HTML files to preview

## 🔄 Workflow Examples

### Adding a New Post:
```bash
# 1. Create your markdown file
echo "---
title: 'My Amazing Post'
date: 'September 2, 2025'
category: 'Tech'
---

# My Amazing Post

This is my new blog post content..." > posts/my-amazing-post.md

# 2. Generate the HTML
node generate-blog.js --all

# 3. Commit and push
git add .
git commit -m "Add new blog post: My Amazing Post"
git push
```

### Updating Existing Posts:
```bash
# 1. Edit your markdown file
# 2. Regenerate
node generate-blog.js --all
# 3. Commit changes
```

## 🎨 Customization

The generated HTML uses your exact CSS styling. If you want to modify the blog post template, edit the `htmlTemplate` variable in `generate-blog.js`.

## 🔍 Troubleshooting

**Q: My post isn't showing up**
A: Make sure you ran `node generate-blog.js --all` to update the blog index

**Q: Code blocks look weird**
A: Make sure you're using triple backticks (\`\`\`) for code blocks

**Q: Links aren't working**
A: Use the format `[Link Text](https://example.com)`

**Q: The script won't run**
A: Make sure you have Node.js installed and run from the blog root directory

---

**Happy blogging!** 🚀 Your posts will automatically match your site's beautiful design and support both dark and light themes.
