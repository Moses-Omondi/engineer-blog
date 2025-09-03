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

// Typewriter Effect - Types text character by character
function typeWriter(text, element, speed = 50, callback) {
    if (!element) {
        console.error('Typewriter element not found!');
        if (callback) callback();
        return;
    }
    
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            console.log('Typewriter finished for:', text.substring(0, 20) + '...');
            if (callback) callback();
        }
    }
    
    console.log('Starting typewriter for:', text.substring(0, 20) + '...', 'Speed:', speed);
    type();
}

// Initialize realistic terminal typing sequence
function initTypewriterEffect() {
    console.log('Initializing realistic terminal typing...');
    
    const terminalBody = document.querySelector('.terminal-body');
    const hobbiesSection = document.querySelector('.hobbies');
    const contactSection = document.querySelector('.contact');
    const initialCommand = document.getElementById('initial-command');
    const initialCursor = document.getElementById('initial-cursor');
    
    if (!terminalBody || !initialCommand || !initialCursor) {
        console.error('Required terminal elements not found!');
        return;
    }
    
    // Check if mobile for timing adjustments
    const isMobile = window.innerWidth <= 480;
    console.log('Is mobile:', isMobile, 'Window width:', window.innerWidth);
    const commandTypingSpeed = isMobile ? 80 : 100; // Slower typing for commands
    const contentTypingSpeed = isMobile ? 30 : 40; // Faster for content
    const initialDelay = 100; // Very short delay - start almost immediately
    
    // Content to display
    const introContent = "Hello! I'm Moses, a passionate software engineer with a deep curiosity for technology and continuous learning. I love building elegant solutions to complex problems and exploring the fascinating world of computers.";
    const aboutContent = "When I'm not coding, I enjoy discovering new technologies, contributing to open-source projects, and sharing knowledge with the developer community.";
    
    // Step 1: Type "cat intro.txt" in the existing command line
    setTimeout(() => {
        typeWriter('cat intro.txt', initialCommand, commandTypingSpeed, function() {
            // Remove cursor and add pause before "enter"
            setTimeout(() => {
                initialCursor.style.display = 'none';
                
                // Step 2: Show intro content
                setTimeout(() => {
                    const introContainer = document.createElement('div');
                    introContainer.className = 'typewriter-container';
                    introContainer.innerHTML = '<p class="typewriter terminal-output" id="intro-output"></p><span class="cursor terminal-cursor" id="intro-cursor">█</span>';
                    terminalBody.appendChild(introContainer);
                    
                    const introOutput = document.getElementById('intro-output');
                    
                    // Type intro content
                    typeWriter(introContent, introOutput, contentTypingSpeed, function() {
                        // Remove intro cursor
                        setTimeout(() => {
                            document.getElementById('intro-cursor').style.display = 'none';
                            
                            // Step 3: Create second command line and type "cat about.txt"
                            setTimeout(() => {
                                const secondCommandLine = document.createElement('div');
                                secondCommandLine.className = 'terminal-line';
                                secondCommandLine.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span><span class="terminal-command" id="command2"></span><span class="cursor terminal-cursor" id="cursor2">█</span>';
                                terminalBody.appendChild(secondCommandLine);
                                
                                const command2Element = document.getElementById('command2');
                                
                                // Type "cat about.txt"
                                typeWriter('cat about.txt', command2Element, commandTypingSpeed, function() {
                                    // Remove cursor and add pause before "enter"
                                    setTimeout(() => {
                                        document.getElementById('cursor2').style.display = 'none';
                                        
                                        // Step 4: Show about content
                                        setTimeout(() => {
                                            const aboutContainer = document.createElement('div');
                                            aboutContainer.className = 'typewriter-container';
                                            aboutContainer.innerHTML = '<p class="typewriter terminal-output" id="about-output"></p><span class="cursor terminal-cursor" id="about-cursor">█</span>';
                                            terminalBody.appendChild(aboutContainer);
                                            
                                            const aboutOutput = document.getElementById('about-output');
                                            
                                            // Type about content
                                            typeWriter(aboutContent, aboutOutput, contentTypingSpeed, function() {
                                                // Remove about cursor
                                                setTimeout(() => {
                                                    document.getElementById('about-cursor').style.display = 'none';
                                                    
                                                    // Add final prompt
                                                    setTimeout(() => {
                                                        const finalPromptLine = document.createElement('div');
                                                        finalPromptLine.className = 'terminal-line';
                                                        finalPromptLine.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span>';
                                                        terminalBody.appendChild(finalPromptLine);
                                                    }, isMobile ? 500 : 700);
                                                    
                                                    // Show hobbies section
                                                    setTimeout(() => {
                                                        if (hobbiesSection) {
                                                            hobbiesSection.classList.add('show');
                                                            console.log('Hobbies section shown');
                                                        }
                                                    }, isMobile ? 1200 : 1500);
                                                    
                                                    // Show contact section
                                                    setTimeout(() => {
                                                        if (contactSection) {
                                                            contactSection.classList.add('show');
                                                            console.log('Contact section shown');
                                                        }
                                                    }, isMobile ? 1600 : 2000);
                                                    
                                                }, isMobile ? 600 : 800);
                                            });
                                        }, isMobile ? 300 : 500); // Pause after pressing enter
                                    }, isMobile ? 600 : 800); // Pause before pressing enter
                                });
                            }, isMobile ? 800 : 1000); // Pause between commands
                        }, isMobile ? 600 : 800);
                    });
                }, isMobile ? 300 : 500); // Pause after pressing enter
            }, isMobile ? 600 : 800); // Pause before pressing enter
        });
    }, initialDelay);
}

// Swipe Navigation System
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
        
        this.init();
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('blog.html')) {
            return 'blog';
        }
        return 'home';
    }
    
    init() {
        // Add touch event listeners
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Add mouse event listeners for desktop testing
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Prevent default drag behavior
        document.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Add visual swipe indicators
        this.addSwipeIndicators();
    }
    
    handleTouchStart(e) {
        if (this.isTransitioning) return;
        
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
    
    handleTouchEnd(e) {
        if (this.isTransitioning) return;
        
        this.processSwipe();
        this.hideSwipeFeedback();
    }
    
    handleMouseDown(e) {
        if (this.isTransitioning) return;
        
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.isMouseDown = true;
    }
    
    handleMouseMove(e) {
        if (this.isTransitioning || !this.isMouseDown) return;
        
        this.endX = e.clientX;
        this.endY = e.clientY;
        
        this.showSwipeFeedback();
    }
    
    handleMouseUp(e) {
        if (this.isTransitioning || !this.isMouseDown) return;
        
        this.isMouseDown = false;
        this.processSwipe();
        this.hideSwipeFeedback();
    }
    
    processSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = Math.abs(this.endY - this.startY);
        
        // Check if it's a valid horizontal swipe
        if (Math.abs(deltaX) > this.minSwipeDistance && deltaY < this.maxVerticalDistance) {
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
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    
    // Mobile tooltip functionality - completely rewritten for reliability
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
    
    // Find all tags with tooltips and add event listeners
    const tagSelectors = [
        { tag: 'Docker', selector: '.hobby-tag:has(.cert-logo:contains("🐳"))' },
        { tag: 'Kubernetes', selector: '.hobby-tag:has(.cert-logo:contains("⎈"))' },
        { tag: 'AWS', selector: '.hobby-tag:has(.cert-logo:contains("☁️"))' },
        { tag: 'CI/CD', selector: '.hobby-tag:has(.cert-logo:contains("🔒"))' },
        { tag: 'Security', selector: '.hobby-tag:has(.cert-logo:contains("🛡️"))' }
    ];
    
    // Get all hobby tags and check which ones have tooltips
    const allTags = document.querySelectorAll('.hobby-tag');
    
    allTags.forEach(tag => {
        const tooltip = tag.querySelector('.certification-tooltip');
        if (tooltip) {
            // Add click event listener to this tag
            tag.addEventListener('click', function(e) {
                e.stopPropagation();
                
                console.log('Clicked tag:', tag.textContent.trim());
                
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
                    
                    console.log('Showing tooltip for:', tag.textContent.trim());
                }
            });
            
            console.log('Added listener to tag:', tag.textContent.trim());
        }
    });
    
    // Close overlay when clicking outside
    document.addEventListener('click', function(e) {
        // Only close if click is not on a tooltip tag or inside a tooltip
        if (!e.target.closest('.hobby-tag') && !e.target.closest('.certification-tooltip')) {
            closeOverlay();
        }
    });
    
    // Close overlay when clicking on the overlay background
    if (tooltipOverlay) {
        tooltipOverlay.addEventListener('click', function(e) {
            // Only close if clicking on the overlay itself, not the tooltip content
            if (e.target === tooltipOverlay) {
                closeOverlay();
            }
        });
    }
    
    // Prevent tooltip content from closing when clicked
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tooltip-overlay .certification-tooltip')) {
            e.stopPropagation();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        closeOverlay();
    });
    
    // Initialize typewriter effect with error handling
    try {
        initTypewriterEffect();
    } catch (error) {
        console.error('Error initializing typewriter:', error);
        // Fallback: try again after a short delay
        setTimeout(() => {
            try {
                initTypewriterEffect();
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }, 500);
    }
    
    // Initialize swipe navigation
    try {
        new SwipeNavigation();
    } catch (error) {
        console.error('Error initializing swipe navigation:', error);
    }
});
