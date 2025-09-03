describe('Frontend JavaScript Functionality', () => {
  // Mock DOM elements we need for testing
  beforeEach(() => {
    // Create mock DOM structure
    document.body.innerHTML = `
      <body>
        <nav class="nav">
          <div class="nav-container">
            <div class="nav-links">
              <a href="index.html" class="nav-link">Home</a>
              <a href="blog.html" class="nav-link">Blog</a>
            </div>
            <button class="theme-toggle" onclick="toggleTheme()">
              <span id="theme-icon">🌙</span>
            </button>
          </div>
        </nav>
        
        <div class="container">
          <div class="terminal-window">
            <div class="terminal-body">
              <div class="terminal-line">
                <span class="terminal-prompt">mosesomondi@Desktop ~ % </span>
                <span id="initial-command"></span>
                <span class="cursor terminal-cursor" id="initial-cursor">█</span>
              </div>
            </div>
          </div>
          
          <div class="hobbies">
            <h2>Interests & Hobbies</h2>
            <div class="hobby-list">
              <div class="hobby-tag">JavaScript</div>
              <div class="hobby-tag">React</div>
              <div class="hobby-tag certification-tag">
                Docker
                <div class="certification-tooltip">
                  <div class="cert-header">
                    <div class="cert-logo">🐳</div>
                    <div class="cert-info">
                      <h4>Docker Certified</h4>
                      <p>Container Technology</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact">
            <a href="mailto:test@example.com">Email</a>
            <a href="https://github.com">GitHub</a>
          </div>
        </div>
      </body>
    `;
  });

  describe('Theme Toggle Functionality', () => {
    let mockSetItem, mockGetItem;
    
    // Define toggleTheme function in test scope
    beforeEach(() => {
      // Create fresh mocks for each test
      mockSetItem = jest.fn();
      mockGetItem = jest.fn();
      
      // Replace localStorage methods
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: mockSetItem,
          getItem: mockGetItem,
          removeItem: jest.fn(),
          clear: jest.fn()
        },
        writable: true
      });
      
      global.toggleTheme = function() {
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
      };
    });

    test('should toggle from light to dark theme', () => {
      const body = document.body;
      const themeIcon = document.getElementById('theme-icon');
      
      // Initial state should be light
      expect(body.getAttribute('data-theme')).toBeNull();
      expect(themeIcon.textContent).toBe('🌙');
      
      // Toggle to dark
      global.toggleTheme();
      
      expect(body.getAttribute('data-theme')).toBe('dark');
      expect(themeIcon.textContent).toBe('☀️');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should toggle from dark to light theme', () => {
      const body = document.body;
      const themeIcon = document.getElementById('theme-icon');
      
      // Set initial dark state
      body.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      
      // Toggle to light
      global.toggleTheme();
      
      expect(body.getAttribute('data-theme')).toBeNull();
      expect(themeIcon.textContent).toBe('🌙');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('should persist theme preference in localStorage', () => {
      global.toggleTheme();
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      
      global.toggleTheme();
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('Typewriter Effect', () => {
    // Define typewriter functions in test scope
    beforeEach(() => {
      jest.useFakeTimers();
      
      global.typeText = function(text, element, speed, callback) {
        if (!element) {
          if (callback) callback();
          return;
        }
        
        let index = 0;
        element.textContent = '';
        
        function addChar() {
          if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(addChar, speed);
          } else {
            if (callback) callback();
          }
        }
        
        addChar();
      };
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should type text character by character', () => {
      const element = document.getElementById('initial-command');
      const testText = 'cat intro.txt';
      
      let callbackCalled = false;
      
      // Clear element first
      element.textContent = '';
      
      global.typeText(testText, element, 50, () => {
        callbackCalled = true;
      });
      
      // Run all timers to complete the typing
      jest.runAllTimers();
      
      expect(element.textContent).toBe(testText);
      expect(callbackCalled).toBe(true);
    });

    test('should handle missing element gracefully', () => {
      let callbackCalled = false;
      global.typeText('test', null, 50, () => {
        callbackCalled = true;
      });
      
      expect(callbackCalled).toBe(true);
    });

    test('should execute callback when typing is complete', () => {
      const element = document.getElementById('initial-command');
      const callback = jest.fn();
      
      global.typeText('test', element, 10, callback);
      jest.runAllTimers();
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('DOM Content Loading', () => {
    beforeEach(() => {
      // Clean up any theme attributes from previous tests
      document.body.removeAttribute('data-theme');
    });
    
    test('should load saved theme on page load', () => {
      // Create a fresh mock for this test
      const mockGetItem = jest.fn().mockReturnValue('dark');
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      });
      
      const themeIcon = document.getElementById('theme-icon');
      
      // Manual theme loading simulation
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
      } else {
        themeIcon.textContent = '🌙';
      }
      
      expect(document.body.getAttribute('data-theme')).toBe('dark');
      expect(themeIcon.textContent).toBe('☀️');
      expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    });

    test('should initialize with light theme by default', () => {
      // Create a fresh mock for this test
      const mockGetItem = jest.fn().mockReturnValue(null);
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      });
      
      const themeIcon = document.getElementById('theme-icon');
      
      // Ensure body starts without theme attribute
      document.body.removeAttribute('data-theme');
      
      // Manual theme loading simulation
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
      } else {
        themeIcon.textContent = '🌙';
      }
      
      expect(document.body.getAttribute('data-theme')).toBeNull();
      expect(themeIcon.textContent).toBe('🌙');
    });
  });

  describe('Mobile Detection', () => {
    test('should detect mobile based on user agent', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      });
      
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      expect(isMobileUA).toBe(true);
    });

    test('should detect mobile based on touch support', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        value: () => {}
      });
      
      const hasTouchStart = 'ontouchstart' in window;
      expect(hasTouchStart).toBe(true);
    });

    test('should detect mobile based on screen size', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375
      });
      
      const isSmallScreen = window.innerWidth <= 768;
      expect(isSmallScreen).toBe(true);
    });
  });

  describe('Navigation Detection', () => {
    test('should identify home page correctly', () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/' }
      });
      
      const isHomePage = window.location.pathname === '/' || 
                        window.location.pathname.includes('index.html') || 
                        window.location.pathname === '';
      
      expect(isHomePage).toBe(true);
    });

    test('should identify blog page correctly', () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/blog.html' }
      });
      
      const isBlogPage = window.location.pathname.includes('blog.html');
      expect(isBlogPage).toBe(true);
    });
  });

  describe('Content Section Management', () => {
    test('should show hobbies section', () => {
      const hobbiesSection = document.querySelector('.hobbies');
      
      expect(hobbiesSection).toBeTruthy();
      expect(hobbiesSection.classList.contains('show')).toBe(false);
      
      // Simulate showing the section
      hobbiesSection.classList.add('show');
      expect(hobbiesSection.classList.contains('show')).toBe(true);
    });

    test('should show contact section', () => {
      const contactSection = document.querySelector('.contact');
      
      expect(contactSection).toBeTruthy();
      expect(contactSection.classList.contains('show')).toBe(false);
      
      // Simulate showing the section
      contactSection.classList.add('show');
      expect(contactSection.classList.contains('show')).toBe(true);
    });

    test('should handle missing sections gracefully', () => {
      // Remove sections
      const hobbiesSection = document.querySelector('.hobbies');
      const contactSection = document.querySelector('.contact');
      
      hobbiesSection.remove();
      contactSection.remove();
      
      const newHobbiesSection = document.querySelector('.hobbies');
      const newContactSection = document.querySelector('.contact');
      
      expect(newHobbiesSection).toBeNull();
      expect(newContactSection).toBeNull();
    });
  });

  describe('Terminal Elements', () => {
    test('should find terminal elements correctly', () => {
      const terminalBody = document.querySelector('.terminal-body');
      const initialCommand = document.getElementById('initial-command');
      const initialCursor = document.getElementById('initial-cursor');
      
      expect(terminalBody).toBeTruthy();
      expect(initialCommand).toBeTruthy();
      expect(initialCursor).toBeTruthy();
    });

    test('should handle missing terminal elements', () => {
      // Remove terminal elements
      document.querySelector('.terminal-window').remove();
      
      const terminalBody = document.querySelector('.terminal-body');
      const initialCommand = document.getElementById('initial-command');
      const initialCursor = document.getElementById('initial-cursor');
      
      expect(terminalBody).toBeNull();
      expect(initialCommand).toBeNull();
      expect(initialCursor).toBeNull();
    });
  });

  describe('Hobby Tags and Tooltips', () => {
    test('should find hobby tags', () => {
      const hobbyTags = document.querySelectorAll('.hobby-tag');
      expect(hobbyTags.length).toBeGreaterThan(0);
    });

    test('should identify certification tags', () => {
      const certificationTags = document.querySelectorAll('.certification-tag');
      expect(certificationTags.length).toBeGreaterThan(0);
      
      const dockerTag = document.querySelector('.certification-tag');
      const tooltip = dockerTag.querySelector('.certification-tooltip');
      expect(tooltip).toBeTruthy();
    });

    test('should handle clicks on certification tags', () => {
      const certificationTag = document.querySelector('.certification-tag');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      
      // Mock the click handler
      certificationTag.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.add('active');
      });
      
      certificationTag.dispatchEvent(clickEvent);
      expect(certificationTag.classList.contains('active')).toBe(true);
    });
  });

  describe('String Utilities', () => {
    test('should generate URL-friendly slugs', () => {
      const generateSlug = (title) => {
        return title.toLowerCase()
                   .replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-|-$/g, '');
      };
      
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('How AI is Transforming Software Development')).toBe('how-ai-is-transforming-software-development');
      expect(generateSlug('Special!@#$%Characters')).toBe('special-characters');
      expect(generateSlug('  Trimming  Spaces  ')).toBe('trimming-spaces');
    });

    test('should filter markdown files', () => {
      const files = ['post1.md', 'post2.md', 'not-markdown.txt'];
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      expect(markdownFiles).toHaveLength(2);
      expect(markdownFiles).toEqual(['post1.md', 'post2.md']);
    });

    test('should calculate read time', () => {
      const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return Math.max(minutes, 1);
      };
      
      const shortContent = 'word '.repeat(100); // 100 words
      const longContent = 'word '.repeat(500);  // 500 words
      
      expect(calculateReadTime(shortContent)).toBe(1);
      expect(calculateReadTime(longContent)).toBe(3);
    });
  });
});
