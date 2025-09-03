const fs = require('fs/promises');
const path = require('path');

// Since we can't easily import ES modules in Jest with CommonJS, let's create a simplified test
// This would normally import BlogGenerator but we'll test the concept

describe('BlogGenerator', () => {
  let generator;
  let mockFs;

  beforeEach(() => {
    generator = new BlogGenerator();
    mockFs = {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      mkdir: jest.fn(),
      access: jest.fn(),
      readdir: jest.fn(),
    };
    
    fs.readFile = mockFs.readFile;
    fs.writeFile = mockFs.writeFile;
    fs.mkdir = mockFs.mkdir;
    fs.access = mockFs.access;
    fs.readdir = mockFs.readdir;
  });

  describe('generateSlug', () => {
    test('should convert title to URL-friendly slug', () => {
      expect(generator.generateSlug('Hello World')).toBe('hello-world');
      expect(generator.generateSlug('How AI is Transforming Software Development')).toBe('how-ai-is-transforming-software-development');
      expect(generator.generateSlug('Special!@#$%Characters')).toBe('special-characters');
      expect(generator.generateSlug('  Trimming  Spaces  ')).toBe('trimming-spaces');
    });

    test('should handle edge cases', () => {
      expect(generator.generateSlug('')).toBe('');
      expect(generator.generateSlug('123')).toBe('123');
      expect(generator.generateSlug('---')).toBe('');
    });
  });

  describe('generateExcerpt', () => {
    test('should generate excerpt from content', () => {
      const longContent = 'A'.repeat(250) + ' more content';
      const excerpt = generator.generateExcerpt(longContent);
      expect(excerpt).toHaveLength(203); // 200 chars + "..."
      expect(excerpt).toEndWith('...');
    });

    test('should not add ellipsis for short content', () => {
      const shortContent = 'Short content';
      const excerpt = generator.generateExcerpt(shortContent);
      expect(excerpt).toBe('Short content');
      expect(excerpt).not.toEndWith('...');
    });

    test('should remove markdown characters', () => {
      const markdownContent = '# Header with **bold** and `code`';
      const excerpt = generator.generateExcerpt(markdownContent);
      expect(excerpt).toBe(' Header with bold and code');
    });
  });

  describe('calculateReadTime', () => {
    test('should calculate correct read time', () => {
      const content = 'word '.repeat(200); // 200 words
      expect(generator.calculateReadTime(content)).toBe(1); // 1 minute

      const longContent = 'word '.repeat(500); // 500 words  
      expect(generator.calculateReadTime(longContent)).toBe(3); // 3 minutes
    });

    test('should round up partial minutes', () => {
      const content = 'word '.repeat(150); // 150 words
      expect(generator.calculateReadTime(content)).toBe(1); // Should round up
    });
  });

  describe('processMarkdownFile', () => {
    test('should process valid markdown file', async () => {
      const mockContent = `---
title: "Test Post"
date: "January 1, 2024"
category: "Test"
excerpt: "Test excerpt"
slug: "test-post"
---

# Test Content

This is test content.`;

      mockFs.readFile.mockResolvedValue(mockContent);

      const result = await generator.processMarkdownFile('/path/to/test.md');

      expect(result.metadata).toEqual({
        title: 'Test Post',
        date: 'January 1, 2024',
        category: 'Test',
        excerpt: 'Test excerpt',
        slug: 'test-post',
      });
      expect(result.content).toContain('<h1>Test Content</h1>');
      expect(result.readTime).toBeGreaterThan(0);
    });

    test('should handle missing frontmatter fields', async () => {
      const mockContent = `---
title: "Test Post"
---

Content without full frontmatter.`;

      mockFs.readFile.mockResolvedValue(mockContent);

      const result = await generator.processMarkdownFile('/path/to/test.md');

      expect(result.metadata.title).toBe('Test Post');
      expect(result.metadata.category).toBe('General'); // Default value
      expect(result.metadata.slug).toBe('test-post'); // Generated from title
      expect(result.metadata.excerpt).toBeDefined(); // Generated from content
    });

    test('should throw error for missing title', async () => {
      const mockContent = `---
category: "Test"
---

Content without title.`;

      mockFs.readFile.mockResolvedValue(mockContent);

      await expect(generator.processMarkdownFile('/path/to/test.md')).rejects.toThrow('Missing required field: title');
    });

    test('should handle file read errors', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(generator.processMarkdownFile('/path/to/nonexistent.md')).rejects.toThrow('File not found');
    });
  });

  describe('ensureDirectoriesExist', () => {
    test('should create directory if it does not exist', async () => {
      mockFs.access.mockRejectedValue(new Error('Directory does not exist'));
      mockFs.mkdir.mockResolvedValue();

      await generator.ensureDirectoriesExist();

      expect(mockFs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    });

    test('should not create directory if it exists', async () => {
      mockFs.access.mockResolvedValue();

      await generator.ensureDirectoriesExist();

      expect(mockFs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe('generateAll', () => {
    test('should process all markdown files', async () => {
      const mockFiles = ['post1.md', 'post2.md', 'not-markdown.txt'];
      const mockMarkdownContent = `---
title: "Test Post"
---

Test content.`;

      mockFs.access.mockResolvedValue();
      mockFs.readdir.mockResolvedValue(mockFiles);
      mockFs.readFile.mockResolvedValue(mockMarkdownContent);
      mockFs.writeFile.mockResolvedValue();

      await generator.generateAll();

      expect(mockFs.readFile).toHaveBeenCalledTimes(2); // Only .md files
      expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // Generated HTML files
    });

    test('should handle empty posts directory', async () => {
      mockFs.access.mockResolvedValue();
      mockFs.readdir.mockResolvedValue([]);

      // Should not throw, just warn
      await expect(generator.generateAll()).resolves.toBeUndefined();
    });

    test('should continue processing when individual files fail', async () => {
      const mockFiles = ['good.md', 'bad.md'];
      
      mockFs.access.mockResolvedValue();
      mockFs.readdir.mockResolvedValue(mockFiles);
      mockFs.writeFile.mockResolvedValue();
      
      // Mock first file success, second file failure
      mockFs.readFile
        .mockResolvedValueOnce(`---\ntitle: "Good Post"\n---\nContent`)
        .mockRejectedValueOnce(new Error('Bad file'));

      await generator.generateAll();

      expect(mockFs.writeFile).toHaveBeenCalledTimes(1); // Only good file processed
    });
  });

  describe('loadTemplate', () => {
    test('should return cached template', async () => {
      const firstCall = await generator.loadTemplate();
      const secondCall = await generator.loadTemplate();

      expect(firstCall).toBe(secondCall);
      expect(firstCall).toContain('{{TITLE}}');
      expect(firstCall).toContain('{{CONTENT}}');
    });

    test('should include all required placeholders', async () => {
      const template = await generator.loadTemplate();

      expect(template).toContain('{{TITLE}}');
      expect(template).toContain('{{EXCERPT}}');
      expect(template).toContain('{{DATE}}');
      expect(template).toContain('{{CATEGORY}}');
      expect(template).toContain('{{SLUG}}');
      expect(template).toContain('{{READ_TIME}}');
      expect(template).toContain('{{CONTENT}}');
    });
  });
});
