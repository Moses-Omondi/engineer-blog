// Theme toggle functionality
// eslint-disable-next-line no-unused-vars
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

// Emergency fallback - add static terminal content
function addStaticTerminalContent() {
  const terminalBody = document.querySelector('.terminal-body');
  const hobbiesSection = document.querySelector('.hobbies');
  const contactSection = document.querySelector('.contact');
  const initialCommand = document.getElementById('initial-command');
  const initialCursor = document.getElementById('initial-cursor');

  if (!terminalBody) {
    return;
  }

  try {
    // Add static content immediately
    if (initialCommand) {
      initialCommand.textContent = 'cat intro.txt';
    }
    if (initialCursor) {
      initialCursor.style.display = 'none';
    }

    // Add intro content
    const introLine = document.createElement('div');
    introLine.className = 'terminal-output';
    introLine.style.color = '#ffffff';
    introLine.style.marginTop = '10px';
    introLine.textContent =
      "Hello! I'm Moses, a passionate software engineer with a deep curiosity for technology and continuous learning. I love building elegant solutions to complex problems and exploring the fascinating world of computers.";
    terminalBody.appendChild(introLine);

    // Add second command line
    const commandLine2 = document.createElement('div');
    commandLine2.className = 'terminal-line';
    commandLine2.style.marginTop = '20px';
    commandLine2.innerHTML =
      '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span><span class="terminal-command">cat about.txt</span>';
    terminalBody.appendChild(commandLine2);

    // Add about content
    const aboutLine = document.createElement('div');
    aboutLine.className = 'terminal-output';
    aboutLine.style.color = '#ffffff';
    aboutLine.style.marginTop = '10px';
    aboutLine.textContent =
      "When I'm not coding, I enjoy discovering new technologies, contributing to open-source projects, and sharing knowledge with the developer community.";
    terminalBody.appendChild(aboutLine);

    // Add final prompt
    const finalPrompt = document.createElement('div');
    finalPrompt.className = 'terminal-line';
    finalPrompt.style.marginTop = '20px';
    finalPrompt.innerHTML =
      '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span>';
    terminalBody.appendChild(finalPrompt);

    // Show sections immediately
    if (hobbiesSection) {
      hobbiesSection.classList.add('show');
    }
    if (contactSection) {
      contactSection.classList.add('show');
    }
  } catch (error) {
    // Final fallback - just show the sections
    if (hobbiesSection) {
      hobbiesSection.classList.add('show');
    }
    if (contactSection) {
      contactSection.classList.add('show');
    }
  }
}

// Navigation System with Mobile/Desktop Detection
class SwipeNavigation {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.isTransitioning = false;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.minSwipeDistance = 50;
    this.maxVerticalDistance = 100;
    this.isMobile = this.detectMobile();

    this.init();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('blog.html')) {
      return 'blog';
    }
    return 'home';
  }

  detectMobile() {
    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const hasTouchStart = 'ontouchstart' in window;
    const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return isMobileUA || hasTouchStart || hasMaxTouchPoints || isSmallScreen;
  }

  init() {
    if (this.isMobile) {
      // Mobile: Touch events for swiping
      document.addEventListener(
        'touchstart',
        this.handleTouchStart.bind(this),
        { passive: true }
      );
      document.addEventListener('touchmove', this.handleTouchMove.bind(this), {
        passive: true,
      });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), {
        passive: true,
      });

      // Add swipe indicators for mobile only
      this.addSwipeIndicators();
    } else {
      // Desktop: Click events for navigation
      this.addDesktopNavigation();
    }
  }

  addDesktopNavigation() {
    // Add subtle click areas on left/right edges for desktop navigation
    const leftClickArea = document.createElement('div');
    leftClickArea.className = 'desktop-nav-area left';
    leftClickArea.addEventListener('click', () => {
      if (this.currentPage === 'blog') {
        this.navigateToPage('home');
      }
    });

    const rightClickArea = document.createElement('div');
    rightClickArea.className = 'desktop-nav-area right';
    rightClickArea.addEventListener('click', () => {
      if (this.currentPage === 'home') {
        this.navigateToPage('blog');
      }
    });

    document.body.appendChild(leftClickArea);
    document.body.appendChild(rightClickArea);

    // Add CSS for desktop navigation areas
    const style = document.createElement('style');
    style.textContent = `
            .desktop-nav-area {
                position: fixed;
                top: 0;
                width: 60px;
                height: 100vh;
                z-index: 999;
                cursor: pointer;
                transition: background-color 0.3s ease;
                opacity: 0;
            }
            
            .desktop-nav-area:hover {
                background-color: rgba(var(--gradient-start), 0.1);
                opacity: 1;
            }
            
            .desktop-nav-area.left {
                left: 0;
            }
            
            .desktop-nav-area.right {
                right: 0;
            }
            
            .desktop-nav-area::before {
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-style: solid;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .desktop-nav-area.left::before {
                left: 20px;
                border-width: 8px 12px 8px 0;
                border-color: transparent var(--text-color) transparent transparent;
            }
            
            .desktop-nav-area.right::before {
                right: 20px;
                border-width: 8px 0 8px 12px;
                border-color: transparent transparent transparent var(--text-color);
            }
            
            .desktop-nav-area:hover::before {
                opacity: 0.7;
            }
        `;
    document.head.appendChild(style);
  }

  handleTouchStart(e) {
    if (this.isTransitioning) {
      return;
    }

    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  handleTouchMove(e) {
    if (this.isTransitioning) return;

    this.endX = e.touches[0].clientX;
    this.endY = e.touches[0].clientY;

    // Show visual feedback during swipe
    this.showSwipeFeedback();
  }

  handleTouchEnd() {
    if (this.isTransitioning) {
      return;
    }

    this.processSwipe();
    this.hideSwipeFeedback();
  }

  processSwipe() {
    const deltaX = this.endX - this.startX;
    const deltaY = Math.abs(this.endY - this.startY);

    // Check if it's a valid horizontal swipe
    if (
      Math.abs(deltaX) > this.minSwipeDistance &&
      deltaY < this.maxVerticalDistance
    ) {
      if (deltaX > 0) {
        // Swipe right - go to previous page (Home if on Blog)
        if (this.currentPage === 'blog') {
          this.navigateToPage('home');
        }
      } else {
        // Swipe left - go to next page (Blog if on Home)
        if (this.currentPage === 'home') {
          this.navigateToPage('blog');
        }
      }
    }
  }

  navigateToPage(page) {
    if (this.isTransitioning || this.currentPage === page) return;

    this.isTransitioning = true;

    // Add transition class to body
    document.body.classList.add('page-transitioning');

    // Show transition overlay
    this.showTransitionOverlay();

    // Navigate after short delay for smooth transition
    setTimeout(() => {
      if (page === 'home') {
        window.location.href = 'index.html';
      } else if (page === 'blog') {
        window.location.href = 'blog.html';
      }
    }, 200);
  }

  addSwipeIndicators() {
    // Add subtle swipe indicators to the page
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    indicator.innerHTML = `
            <div class="swipe-hint">
                <span class="swipe-arrow left">‹</span>
                <span class="swipe-text">Swipe to navigate</span>
                <span class="swipe-arrow right">›</span>
            </div>
        `;
    document.body.appendChild(indicator);

    // Show indicator for a few seconds, then hide
    setTimeout(() => {
      indicator.classList.add('fade-out');
    }, 3000);
  }

  showSwipeFeedback() {
    const deltaX = this.endX - this.startX;
    const container = document.querySelector('.container');

    if (Math.abs(deltaX) > 20) {
      const direction = deltaX > 0 ? 'right' : 'left';
      container.classList.add(`swipe-${direction}`);
    }
  }

  hideSwipeFeedback() {
    const container = document.querySelector('.container');
    container.classList.remove('swipe-left', 'swipe-right');
  }

  showTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add('active'), 10);
  }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function () {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('theme-icon');

  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }

  // Mobile tooltip functionality
  const tooltipOverlay = document.getElementById('tooltipOverlay');

  // Function to check if we're on mobile
  function isMobile() {
    return window.innerWidth <= 480;
  }

  // Function to close the overlay
  function closeOverlay() {
    if (tooltipOverlay) {
      tooltipOverlay.classList.remove('active');
      tooltipOverlay.innerHTML = '';
    }
    // Remove active class from all tags
    document.querySelectorAll('.hobby-tag.active').forEach(tag => {
      tag.classList.remove('active');
    });
  }

  // Get all hobby tags and check which ones have tooltips
  const allTags = document.querySelectorAll('.hobby-tag');

  allTags.forEach(tag => {
    const tooltip = tag.querySelector('.certification-tooltip');
    if (tooltip) {
      // Add click event listener to this tag
      tag.addEventListener('click', function (e) {
        e.stopPropagation();

        // Close any existing overlays first
        closeOverlay();

        // Add active class to clicked tag
        tag.classList.add('active');

        // Show overlay on mobile
        if (isMobile() && tooltipOverlay) {
          // Clone the tooltip content from this specific tag
          const tooltipClone = tooltip.cloneNode(true);
          tooltipOverlay.innerHTML = '';
          tooltipOverlay.appendChild(tooltipClone);
          tooltipOverlay.classList.add('active');
        }
      });
    }
  });

  // Close overlay when clicking outside
  document.addEventListener('click', function (e) {
    // Only close if click is not on a tooltip tag or inside a tooltip
    if (
      !e.target.closest('.hobby-tag') &&
      !e.target.closest('.certification-tooltip')
    ) {
      closeOverlay();
    }
  });

  // Close overlay when clicking on the overlay background
  if (tooltipOverlay) {
    tooltipOverlay.addEventListener('click', function (e) {
      // Only close if clicking on the overlay itself, not the tooltip content
      if (e.target === tooltipOverlay) {
        closeOverlay();
      }
    });
  }

  // Prevent tooltip content from closing when clicked
  document.addEventListener('click', function (e) {
    if (e.target.closest('.tooltip-overlay .certification-tooltip')) {
      e.stopPropagation();
    }
  });

  // Handle window resize
  window.addEventListener('resize', function () {
    closeOverlay();
  });

  // Clear any corrupted state and force fresh start
  localStorage.removeItem('terminalState');
  localStorage.removeItem('hobbiesShown');
  localStorage.removeItem('contactShown');

  // Only initialize typewriter on home page
  const currentPath = window.location.pathname;
  const isHomePage =
    currentPath === '/' ||
    currentPath.includes('index.html') ||
    currentPath === '';

  if (isHomePage) {
    // Get sections immediately
    const hobbiesSection = document.querySelector('.hobbies');
    const contactSection = document.querySelector('.contact');

    // Add static terminal content immediately
    addStaticTerminalContent();

    // Show sections immediately (no delays)
    if (hobbiesSection) {
      hobbiesSection.classList.add('show');
    }

    if (contactSection) {
      contactSection.classList.add('show');
    }
  }

  // Initialize swipe navigation
  try {
    new SwipeNavigation();
  } catch (error) {
    // Silently handle navigation errors
  }
});
