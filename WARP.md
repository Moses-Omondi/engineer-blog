# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Commands

### Development Workflow

```bash
# Start development server with hot reloading
npm run dev

# Serve static files only
npm run serve

# Full production build
npm run build

# Generate blog posts from Markdown
npm run build:blog

# Run single blog post generation
node src/generate-blog.js posts/filename.md

# Run all tests with coverage
npm test

# Run end-to-end tests
npm run test:e2e

# Lint and fix code issues
npm run lint

# Clean build artifacts
npm run clean

# Run full validation (linting, tests, security audit)
npm run validate
```

### Docker Development (Alternative)

```bash
# Start with Docker (no local Node.js needed)
docker-compose --profile development up

# Build Docker image
npm run docker:build

# Run production Docker container
npm run docker:run
```

### Security & Performance

```bash
# Security audit
npm run security:audit

# Snyk security scan
npm run security:scan

# Lighthouse performance audit
npm run performance:audit

# Bundle size analysis
npm run performance:bundle
```

## Architecture Overview

### Core System Design

This is a **static blog platform** with a unique **mobile-first swipe navigation system** and **automated Markdown-to-HTML generation**. The architecture prioritizes performance, security, and mobile user experience.

#### Key Components:

1. **Mobile Swipe Navigation (`js/main.js`)**
   - Touch gesture detection with smart swipe vs. tap differentiation
   - Push/pull navigation metaphor (swipe LEFT to push to blog, RIGHT to pull back to home)
   - Blog card click protection to prevent accidental navigation
   - Desktop fallback with click areas on page edges
   - Visual feedback during gestures

2. **Blog Generation Engine (`src/generate-blog.js`)**
   - Converts Markdown files in `posts/` to styled HTML in `blog/`
   - Template caching for performance
   - HTML sanitization for security (sanitize-html)
   - Auto-generates slugs, excerpts, reading time estimates
   - Updates blog index automatically

3. **Terminal-Style Home Interface**
   - Static terminal content system with emergency fallbacks
   - Animated typing effects with mobile optimizations
   - Theme toggle with localStorage persistence

4. **Multi-Browser Testing & CI/CD**
   - Jest unit tests with 80%+ coverage requirement
   - Playwright E2E tests (Chrome, Mobile Chrome)
   - Lighthouse CI for performance monitoring
   - Security scanning with Snyk and npm audit

### File Structure Logic

```
engineer-blog/
├── src/
│   ├── generate-blog.js        # Core blog generation engine
│   └── js/                     # Source JavaScript (duplicated in /js/)
├── js/                         # Client-side JavaScript
│   ├── main.js                 # Navigation & terminal system
│   ├── blog.js                 # Blog listing interactions
│   └── blog-article.js         # Article-specific functionality
├── posts/                      # Markdown source files
├── blog/                       # Generated HTML articles
├── css/                        # Stylesheets with mobile-first design
├── tests/                      # Jest unit tests & E2E tests
└── dist/                       # Built/minified assets
```

### Navigation System Architecture

The navigation system uses a **directional metaphor**:

- **Home → Blog**: Swipe LEFT (push home away, reveal blog behind it)
- **Blog → Home**: Swipe RIGHT (pull home back from the left)
- **Article → Blog**: Swipe RIGHT (return to blog listing)

#### Touch Event Handling:

- Distinguishes between swipes (navigation) and taps (interaction)
- Protects blog cards from accidental navigation during content interaction
- Mobile detection considers user agent, touch capabilities, and screen size
- Desktop users get hover-activated click areas on page edges

### Blog Content Management

#### Writing Process:

1. Create `.md` file in `posts/` with front matter:

```markdown
---
title: 'Post Title'
date: 'December 1, 2024' # Optional: defaults to today
category: 'Technology' # Optional: defaults to 'General'
excerpt: 'Brief description' # Optional: auto-generated
slug: 'post-title' # Optional: auto-generated from title
---

# Your content here...
```

2. Generate HTML: `npm run build:blog` or `node src/generate-blog.js --all`
3. Generated files include SEO meta tags, syntax highlighting, mobile responsive design

#### Security & Processing:

- HTML sanitization prevents XSS attacks
- Front matter validation ensures required fields
- Reading time calculation (200 WPM)
- Template caching for performance
- Error handling with detailed logging

### Performance & Quality Standards

#### Performance Targets:

- First Contentful Paint: < 2.5s
- Largest Contentful Paint: < 4.0s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

#### Code Quality:

- ESLint with security plugins
- Prettier formatting
- TypeScript support
- Pre-commit hooks (lint-staged + Husky)
- 80%+ test coverage requirement

#### Security Measures:

- All user input sanitized with `sanitize-html`
- Security-focused ESLint rules
- Dependency vulnerability scanning (npm audit + Snyk)
- No secrets in repository
- Regular automated security updates via Dependabot

### Development Notes

#### Mobile-First Approach:

- Touch events prioritized over mouse events
- Swipe indicators for mobile users
- Optimized animations for mobile performance
- Terminal interface adapts to small screens
- Theme toggle works across all devices

#### Build System:

- **CSS**: PostCSS with autoprefixer and cssnano
- **JS**: esbuild for fast bundling and minification
- **Testing**: Jest (unit) + Playwright (E2E) + Lighthouse (performance)
- **Deployment**: GitHub Actions → GitHub Pages

#### Error Handling:

- Comprehensive logging in blog generator
- Static terminal fallback if dynamic content fails
- Graceful degradation for unsupported features
- Error boundaries in navigation system

### Common Debugging

#### Blog Generation Issues:

- Check front matter format (YAML syntax)
- Ensure required `title` field exists
- Verify Markdown file is in `posts/` directory
- Check console output for validation errors

#### Navigation Issues:

- Test mobile detection: `SwipeNavigation.detectMobile()`
- Verify touch event listeners are attached
- Check for CSS classes: `page-transitioning`, `swipe-left/right`
- Ensure proper page detection in `getCurrentPage()`

#### Performance Issues:

- Run `npm run performance:audit` for Lighthouse analysis
- Check bundle size with `npm run performance:bundle`
- Review terminal animation performance on mobile
- Monitor swipe gesture responsiveness

### Testing Strategy

#### Unit Tests (`npm test`):

- Blog generation logic
- Navigation system functions
- Template processing
- Security validation

#### E2E Tests (`npm run test:e2e`):

- Cross-browser compatibility (Chrome, Mobile Chrome)
- Swipe navigation functionality
- Blog post generation workflow
- Theme switching persistence

#### Performance Tests:

- Lighthouse CI runs on every build
- Core Web Vitals monitoring
- Bundle size regression detection

This architecture balances modern web standards with unique UX innovations, prioritizing mobile users while maintaining desktop compatibility.
