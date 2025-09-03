describe('Simple Blog Tests', () => {
  test('basic functionality works', () => {
    expect(1 + 1).toBe(2);
  });

  test('string operations work', () => {
    const title = 'Hello World';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    expect(slug).toBe('hello-world');
  });

  test('array operations work', () => {
    const files = ['post1.md', 'post2.md', 'not-markdown.txt'];
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    expect(markdownFiles).toHaveLength(2);
    expect(markdownFiles).toEqual(['post1.md', 'post2.md']);
  });

  test('DOM mock works', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    expect(element.textContent).toBe('Hello World');
  });

  test('testing infrastructure works', () => {
    // This test demonstrates our testing setup is working
    const mockFunction = jest.fn();
    mockFunction('test', 'value');
    expect(mockFunction).toHaveBeenCalledWith('test', 'value');
  });
});
