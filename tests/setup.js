// Jest test setup file
require('jest-environment-jsdom');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Uncomment these if you want to suppress console output in tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
};

// Add custom matchers
expect.extend({
  toHaveBeenCalledWithError(received, expectedError) {
    const pass = received.mock.calls.some(call => 
      call.some(arg => arg instanceof Error && arg.message.includes(expectedError))
    );
    
    if (pass) {
      return {
        message: () => `Expected function not to have been called with error containing "${expectedError}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected function to have been called with error containing "${expectedError}"`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.testUtils = {
  // Create a mock DOM element
  createElement: (tag, attributes = {}, innerHTML = '') => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    element.innerHTML = innerHTML;
    return element;
  },
  
  // Wait for async operations
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock fetch responses
  mockFetch: (data, status = 200) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
      })
    );
  },
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
  
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});
