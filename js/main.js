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

// Typewriter function removed - no longer used

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
    // Error handling - sections already attempted to show above
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
    this.touchStartTime = 0;
    this.touchStartTarget = null;
    this.isInteractingWithCard = false;
    this.isMobile = this.detectMobile();

    this.init();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    // Check if we're in a blog article (not the blog listing)
    if (path.includes('/blog/') && path.includes('.html')) {
      return 'article'; // In a blog article - don't handle swipes here
    }
    if (path.includes('blog.html')) {
      return 'blog';
    }
    return 'home';
  }

  detectMobile() {
    // More accurate mobile detection
    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const hasTouchStart = 'ontouchstart' in window;
    const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    // Check if it's actually a touch device (not just small screen)
    const isTouchDevice = hasTouchStart && hasMaxTouchPoints;

    return isMobileUA || (isTouchDevice && isSmallScreen);
  }

  init() {
    // Don't initialize swipe navigation if we're in a blog article
    if (this.currentPage === 'article') {
      return; // Let blog-article.js handle the swipes
    }

    // Initialize touch events for any device that supports touch
    // This ensures navigation works on all mobile devices regardless of detection
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      // Touch events for swiping work on both home and blog pages
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

      // Add swipe indicators for touch devices
      if (this.isMobile) {
        this.addSwipeIndicators();
      }
    }
    // Desktop navigation removed - only mobile swipe navigation is active
  }

  // Desktop navigation method removed - only mobile swipe navigation is supported

  handleTouchStart(event) {
    if (this.isTransitioning) {
      return;
    }

    // If touch starts on a blog card, mark it so we can handle it specially
    this.touchStartTarget = event.target;
    this.isInteractingWithCard = !!(
      this.touchStartTarget && this.touchStartTarget.closest('.blog-post')
    );

    // Record the starting position for all touches
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  handleTouchMove(event) {
    if (this.isTransitioning) return;

    // Always update end positions
    if (event.touches && event.touches[0]) {
      this.endX = event.touches[0].clientX;
      this.endY = event.touches[0].clientY;
    }

    // Show visual feedback during swipe
    this.showSwipeFeedback();
  }

  handleTouchEnd() {
    if (this.isTransitioning) {
      return;
    }

    if (!this.startX) {
      this.hideSwipeFeedback();
      return;
    }

    const touchDuration = Date.now() - this.touchStartTime;
    const deltaX = this.endX - this.startX;
    const deltaY = Math.abs(this.endY - this.startY);

    // Check if this is a swipe gesture (significant horizontal movement)
    const isSwipe =
      Math.abs(deltaX) > this.minSwipeDistance &&
      deltaY < this.maxVerticalDistance;

    // Check if this is a tap gesture (minimal movement, short duration)
    const isTap = touchDuration < 300 && Math.abs(deltaX) < 10 && deltaY < 10;

    // Process swipe regardless of where it started
    if (isSwipe) {
      this.processSwipe();
    }
    // If it's a tap on a blog card, let the card's click handler deal with it
    else if (isTap && this.isInteractingWithCard) {
      // Do nothing - let the blog card's click handler navigate to the article
    }

    this.hideSwipeFeedback();
    this.resetTouchState();
  }

  resetTouchState() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.touchStartTime = 0;
    this.touchStartTarget = null;
    this.isInteractingWithCard = false;
  }

  processSwipe() {
    const deltaX = this.endX - this.startX;
    const deltaY = Math.abs(this.endY - this.startY);

    // Check if it's a valid horizontal swipe
    if (
      Math.abs(deltaX) > this.minSwipeDistance &&
      deltaY < this.maxVerticalDistance
    ) {
      // Mark that a swipe was detected to prevent blog card click
      window.lastSwipeDetected = Date.now();

      if (deltaX < 0) {
        // Swipe LEFT - push forward (like pushing a card away)
        if (this.currentPage === 'home') {
          this.navigateToPage('blog'); // Home → Blog (push home left, reveal blog)
        }
      } else if (deltaX > 0) {
        // Swipe RIGHT - pull back (like pulling a card back)
        if (this.currentPage === 'blog') {
          this.navigateToPage('home'); // Blog → Home (pull home back from left)
        }
      }
    }
  }

  navigateToPage(page) {
    if (this.isTransitioning || this.currentPage === page) return;

    this.isTransitioning = true;

    // Create instant overlay for seamless transition
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay active';
    document.body.appendChild(overlay);

    // Navigate immediately with minimal delay for smooth visual transition
    setTimeout(() => {
      if (page === 'home') {
        window.location.href = 'index.html';
      } else if (page === 'blog') {
        window.location.href = 'blog.html';
      }
    }, 50);
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
      tag.addEventListener('click', function (event) {
        event.stopPropagation();

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
  document.addEventListener('click', function (event) {
    // Only close if click is not on a tooltip tag or inside a tooltip
    if (
      !event.target.closest('.hobby-tag') &&
      !event.target.closest('.certification-tooltip')
    ) {
      closeOverlay();
    }
  });

  // Close overlay when clicking on the overlay background
  if (tooltipOverlay) {
    tooltipOverlay.addEventListener('click', function (event) {
      // Only close if clicking on the overlay itself, not the tooltip content
      if (event.target === tooltipOverlay) {
        closeOverlay();
      }
    });
  }

  // Prevent tooltip content from closing when clicked
  document.addEventListener('click', function (event) {
    if (event.target.closest('.tooltip-overlay .certification-tooltip')) {
      event.stopPropagation();
    }
  });

  // Handle window resize
  window.addEventListener('resize', function () {
    closeOverlay();
  });

  // Removed localStorage cleanup - no longer needed

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
    // Silent fail for production
  }
});
