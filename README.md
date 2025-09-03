# Moses Omondi - Engineer Blog

[![Deploy Status](https://github.com/Moses-Omondi/engineer-blog/workflows/Deploy%20Engineer%20Blog/badge.svg)](https://github.com/Moses-Omondi/engineer-blog/actions)
[![Security Rating](https://img.shields.io/snyk/vulnerabilities/github/Moses-Omondi/engineer-blog)](https://snyk.io/test/github/Moses-Omondi/engineer-blog)
[![Code Quality](https://img.shields.io/codeclimate/maintainability/Moses-Omondi/engineer-blog)](https://codeclimate.com/github/Moses-Omondi/engineer-blog)
[![Test Coverage](https://img.shields.io/codecov/c/github/Moses-Omondi/engineer-blog)](https://codecov.io/gh/Moses-Omondi/engineer-blog)

A modern, performant blog platform built with enterprise-grade standards for showcasing software engineering content and DevOps learning.

## 🚀 Live Site

Visit the live blog at [mosesomondi.dev](https://mosesomondi.dev)

## ✨ Features

### Enterprise-Grade Architecture
- **TypeScript Support**: Full type safety and modern JavaScript features
- **Module System**: ES6 modules with proper imports/exports
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Input sanitization, dependency scanning, and security policies

### Developer Experience
- **Hot Reloading**: Live development server with automatic reloads
- **Code Quality**: ESLint, Prettier, and pre-commit hooks
- **Testing**: Unit tests (Jest), E2E tests (Playwright), and coverage reporting
- **Performance Monitoring**: Lighthouse CI integration for performance tracking

### Modern Tooling
- **Build System**: Optimized build pipeline with minification and bundling
- **CI/CD**: Comprehensive GitHub Actions workflow
- **Dependency Management**: Automated security updates with Dependabot
- **Documentation**: Comprehensive guides and API documentation

### Content Management
- **Markdown Support**: Write posts in Markdown with front matter
- **Syntax Highlighting**: Code blocks with highlight.js
- **SEO Optimization**: Meta tags, OpenGraph, and Twitter Cards
- **Responsive Design**: Mobile-first, accessible design

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js 20+
- **Languages**: TypeScript/JavaScript, HTML5, CSS3
- **Markdown Processing**: Marked with syntax highlighting
- **Security**: Sanitize-HTML for XSS protection

### Development Tools
- **Testing**: Jest (unit), Playwright (E2E)
- **Linting**: ESLint with security plugins
- **Formatting**: Prettier
- **Build Tools**: esbuild, PostCSS
- **Performance**: Lighthouse CI

### Infrastructure
- **CI/CD**: GitHub Actions
- **Security**: Snyk, npm audit, Dependabot
- **Monitoring**: Performance metrics and error tracking
- **Deployment**: GitHub Pages with automated builds

## 📦 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Moses-Omondi/engineer-blog.git
cd engineer-blog

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:3000
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reloading
npm run serve           # Start static server

# Building
npm run build           # Full production build
npm run build:css       # Build and minify CSS
npm run build:js        # Build and minify JavaScript
npm run build:blog      # Generate blog posts from Markdown

# Testing
npm test                # Run unit tests with coverage
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests

# Code Quality
npm run lint            # Lint and fix code
npm run lint:check      # Check linting without fixes

# Security
npm run security:audit  # Run npm audit
npm run security:scan   # Run Snyk security scan

# Performance
npm run performance:audit    # Run Lighthouse audit
npm run performance:bundle  # Analyze bundle size

# Utilities
npm run clean           # Clean build artifacts
npm run validate        # Run all validation checks
```

## 📝 Content Management

### Writing Blog Posts

1. Create a new Markdown file in the `posts/` directory:

```markdown
---
title: "Your Amazing Post Title"
date: "December 1, 2024"
category: "Technology"
excerpt: "A brief description that appears on the blog listing page"
slug: "your-amazing-post-title"  # Optional: auto-generated from title
---

# Your Amazing Post Title

Write your content here using standard Markdown syntax...

## Code Examples

\`\`\`javascript
const example = () => {
  console.log('Hello, World!');
};
\`\`\`

> Blockquotes are supported and styled beautifully!

- Lists work perfectly
- All markdown features are supported
```

2. Generate the HTML:

```bash
# Generate a single post
npm run build:blog

# Or generate all posts
npm run build:blog
```

3. Your post is now live with:
   - ✅ Perfect styling that matches your site
   - ✅ Dark/light mode support  
   - ✅ Mobile responsive design
   - ✅ Automatic navigation
   - ✅ SEO-friendly HTML structure
   - ✅ Syntax highlighting
   - ✅ Reading time estimates

### Front Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ Yes | The post title |
| `date` | No | Publication date (defaults to today) |
| `category` | No | Post category (defaults to "General") |
| `excerpt` | No | Short description (auto-generated from content) |
| `slug` | No | URL-friendly filename (auto-generated from title) |

## 🏗 Architecture

### Project Structure

```
engineer-blog/
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   └── dependabot.yml      # Dependency updates
├── src/
│   ├── js/                 # TypeScript/JavaScript source
│   ├── utils/              # Utility functions
│   └── generate-blog.js    # Blog generation engine
├── tests/
│   ├── e2e/               # End-to-end tests
│   └── *.test.js          # Unit tests
├── posts/                 # Markdown blog posts
├── blog/                  # Generated HTML posts
├── css/                   # Stylesheets
├── images/               # Static assets
├── dist/                 # Built/minified assets
└── docs/                 # Documentation
```

### Key Components

#### Blog Generator (`src/generate-blog.js`)
- **Enterprise-grade**: Proper error handling, logging, and validation
- **Security**: HTML sanitization and input validation
- **Performance**: Template caching and optimized processing
- **Standards**: TypeScript support and comprehensive testing

#### CI/CD Pipeline
- **Security Scanning**: Snyk, npm audit
- **Code Quality**: ESLint, TypeScript checking
- **Testing**: Unit tests, E2E tests, coverage reporting
- **Performance**: Lighthouse CI audits
- **Deployment**: Automated GitHub Pages deployment

#### Development Workflow
- **Pre-commit Hooks**: Automated linting and formatting
- **Hot Reloading**: Live development server
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error logging

## 🔒 Security

### Security Measures
- All user input is sanitized using `sanitize-html`
- Dependencies are automatically scanned for vulnerabilities
- Security-focused ESLint rules are enforced
- Regular security audits via npm audit and Snyk
- No secrets stored in repository or CI variables

### Reporting Security Issues
Please see our [Security Policy](SECURITY.md) for information on reporting vulnerabilities.

## 🚀 Performance

### Optimization Features
- **Minification**: CSS and JavaScript are minified in production
- **Code Splitting**: Optimized bundling with esbuild
- **Image Optimization**: Responsive images with proper loading
- **Caching**: Effective browser caching strategies
- **Performance Monitoring**: Continuous Lighthouse audits

### Performance Targets
- First Contentful Paint: < 2.5s
- Largest Contentful Paint: < 4.0s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Jest with 80%+ coverage requirement
- **Integration Tests**: API and component integration
- **End-to-End Tests**: Playwright across multiple browsers
- **Performance Tests**: Lighthouse CI in every build
- **Security Tests**: Dependency scanning and SAST

### Running Tests

```bash
# All tests
npm test

# Specific test types
npm run test:unit
npm run test:e2e
npm run test:performance

# Coverage reports
npm run test -- --coverage
```

## 📊 Monitoring & Analytics

### Performance Monitoring
- Lighthouse CI integration
- Core Web Vitals tracking
- Bundle size analysis
- Build performance metrics

### Error Tracking
- Comprehensive error logging
- CI/CD failure notifications
- Security vulnerability alerts

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run the validation suite: `npm run validate`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style (enforced by ESLint/Prettier)
- Write tests for new functionality
- Update documentation as needed
- Ensure all CI checks pass
- Keep security and performance in mind

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Moses Omondi**
- Website: [mosesomondi.dev](https://mosesomondi.dev)
- GitHub: [@Moses-Omondi](https://github.com/Moses-Omondi)
- Email: moses@mosesomondi.dev

## 🙏 Acknowledgments

- Built with enterprise-grade standards inspired by FAANG engineering practices
- Performance optimizations following Google's Core Web Vitals guidelines
- Security implementations based on OWASP recommendations
- Accessibility following WCAG 2.1 AA standards

---

**⭐ Star this repository if you find it helpful!**
