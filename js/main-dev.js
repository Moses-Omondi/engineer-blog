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

// Simple and reliable terminal typing sequence
function initTypewriterEffect() {
    console.log('=== STARTING TERMINAL EFFECT ===');
    
    // Get required elements
    const terminalBody = document.querySelector('.terminal-body');
    const hobbiesSection = document.querySelector('.hobbies');
    const contactSection = document.querySelector('.contact');
    const initialCommand = document.getElementById('initial-command');
    const initialCursor = document.getElementById('initial-cursor');
    
    // Debug element availability
    console.log('Terminal elements check:');
    console.log('- terminalBody:', terminalBody ? 'FOUND' : 'NOT FOUND');
    console.log('- hobbiesSection:', hobbiesSection ? 'FOUND' : 'NOT FOUND');
    console.log('- contactSection:', contactSection ? 'FOUND' : 'NOT FOUND');
    console.log('- initialCommand:', initialCommand ? 'FOUND' : 'NOT FOUND');
    console.log('- initialCursor:', initialCursor ? 'FOUND' : 'NOT FOUND');
    
    if (!terminalBody || !initialCommand || !initialCursor) {
        console.error('❌ CRITICAL: Missing required elements for terminal!');
        console.error('terminalBody:', !!terminalBody);
        console.error('initialCommand:', !!initialCommand);
        console.error('initialCursor:', !!initialCursor);
        return;
    }
    
    console.log('✅ All required elements found, starting typewriter...');
    
    // Clear any existing content first
    initialCommand.textContent = '';
    initialCursor.style.display = 'inline';
    
    // Content to display
    const introText = "Hello! I'm Moses, a passionate software engineer with a deep curiosity for technology and continuous learning. I love building elegant solutions to complex problems and exploring the fascinating world of computers.";
    const aboutText = "When I'm not coding, I enjoy discovering new technologies, contributing to open-source projects, and sharing knowledge with the developer community.";
    
    // Step 1: Type the first command
    console.log('Step 1: Typing first command...');
    typeText('cat intro.txt', initialCommand, 50, () => {
        console.log('✅ First command typed');
        
        // Hide cursor
        initialCursor.style.display = 'none';
        
        // Step 2: Add intro content
        setTimeout(() => {
            console.log('Step 2: Adding intro content...');
            
            const introLine = document.createElement('div');
            introLine.className = 'terminal-output';
            introLine.style.color = '#ffffff';
            introLine.style.marginTop = '10px';
            introLine.textContent = introText;
            terminalBody.appendChild(introLine);
            
            console.log('✅ Intro content added');
            
            // Step 3: Add second command line
            setTimeout(() => {
                console.log('Step 3: Adding second command...');
                
                const commandLine2 = document.createElement('div');
                commandLine2.className = 'terminal-line';
                commandLine2.style.marginTop = '20px';
                commandLine2.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span><span id="command2"></span><span class="cursor terminal-cursor" id="cursor2">█</span>';
                terminalBody.appendChild(commandLine2);
                
                const command2 = document.getElementById('command2');
                const cursor2 = document.getElementById('cursor2');
                
                // Type second command
                typeText('cat about.txt', command2, 50, () => {
                    console.log('✅ Second command typed');
                    
                    // Hide cursor
                    cursor2.style.display = 'none';
                    
                    // Step 4: Add about content
                    setTimeout(() => {
                        console.log('Step 4: Adding about content...');
                        
                        const aboutLine = document.createElement('div');
                        aboutLine.className = 'terminal-output';
                        aboutLine.style.color = '#ffffff';
                        aboutLine.style.marginTop = '10px';
                        aboutLine.textContent = aboutText;
                        terminalBody.appendChild(aboutLine);
                        
                        console.log('✅ About content added');
                        
                        // Step 5: Add final prompt
                        setTimeout(() => {
                            const finalPrompt = document.createElement('div');
                            finalPrompt.className = 'terminal-line';
                            finalPrompt.style.marginTop = '20px';
                            finalPrompt.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span>';
                            terminalBody.appendChild(finalPrompt);
                            
                            console.log('✅ Final prompt added');
                            
                            // Step 6: Show other sections
                            setTimeout(() => {
                                if (hobbiesSection) {
                                    hobbiesSection.classList.add('show');
                                    console.log('✅ Hobbies section shown');
                                }
                            }, 500);
                            
                            setTimeout(() => {
                                if (contactSection) {
                                    contactSection.classList.add('show');
                                    console.log('✅ Contact section shown');
                                }
                            }, 800);
                            
                            console.log('🎉 TERMINAL EFFECT COMPLETE!');
                        }, 300);
                    }, 200);
                });
            }, 500);
        }, 300);
    });
}

// Simplified typewriter function
function typeText(text, element, speed, callback) {
    if (!element) {
        console.error('❌ typeText: Element not found!');
        if (callback) callback();
        return;
    }
    
    console.log(`🔤 Typing: "${text}"`);
    let index = 0;
    element.textContent = '';
    
    function addChar() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(addChar, speed);
        } else {
            console.log(`✅ Finished typing: "${text}"`);
            if (callback) callback();
        }
    }
    
    addChar();
}

// Emergency fallback - add static terminal content
function addStaticTerminalContent() {
    console.log('🆘 EMERGENCY FALLBACK: Adding static terminal content');
    
    const terminalBody = document.querySelector('.terminal-body');
    const hobbiesSection = document.querySelector('.hobbies');
    const contactSection = document.querySelector('.contact');
    const initialCommand = document.getElementById('initial-command');
    const initialCursor = document.getElementById('initial-cursor');
    
    if (!terminalBody) {
        console.error('❌ Cannot add fallback content - no terminal body found');
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
        introLine.textContent = "Hello! I'm Moses, a passionate software engineer with a deep curiosity for technology and continuous learning. I love building elegant solutions to complex problems and exploring the fascinating world of computers.";
        terminalBody.appendChild(introLine);
        
        // Add second command line
        const commandLine2 = document.createElement('div');
        commandLine2.className = 'terminal-line';
        commandLine2.style.marginTop = '20px';
        commandLine2.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span><span class="terminal-command">cat about.txt</span>';
        terminalBody.appendChild(commandLine2);
        
        // Add about content
        const aboutLine = document.createElement('div');
        aboutLine.className = 'terminal-output';
        aboutLine.style.color = '#ffffff';
        aboutLine.style.marginTop = '10px';
        aboutLine.textContent = "When I'm not coding, I enjoy discovering new technologies, contributing to open-source projects, and sharing knowledge with the developer community.";
        terminalBody.appendChild(aboutLine);
        
        // Add final prompt
        const finalPrompt = document.createElement('div');
        finalPrompt.className = 'terminal-line';
        finalPrompt.style.marginTop = '20px';
        finalPrompt.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span>';
        terminalBody.appendChild(finalPrompt);
        
        // Show sections immediately
        if (hobbiesSection) {
            hobbiesSection.classList.add('show');
            console.log('✅ Static fallback: Hobbies section shown');
        }
        if (contactSection) {
            contactSection.classList.add('show');
            console.log('✅ Static fallback: Contact section shown');
        }
        
        console.log('✅ Static terminal content added successfully');
        
    } catch (error) {
        console.error('❌ Error adding static terminal content:', error);
        
        // Final desperate attempt - just show the sections
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
        
        console.log('SwipeNavigation initialized:', {
            currentPage: this.currentPage,
            isMobile: this.isMobile
        });
        
        this.init();
        // Removed saveTerminalState() - we don't want to save state anymore
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('blog.html')) {
            return 'blog';
        }
        return 'home';
    }
    
    detectMobile() {
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasTouchStart = 'ontouchstart' in window;
        const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        const isMobile = isMobileUA || hasTouchStart || hasMaxTouchPoints || isSmallScreen;
        
        console.log('Mobile detection details:', {
            userAgent: navigator.userAgent,
            isMobileUA,
            hasTouchStart,
            hasMaxTouchPoints,
            maxTouchPoints: navigator.maxTouchPoints,
            screenWidth: window.innerWidth,
            isSmallScreen,
            finalResult: isMobile
        });
        
        return isMobile;
    }
    
    init() {
        if (this.isMobile) {
            // Mobile: Touch events for swiping
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
            document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            
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
        console.log('Touch start detected:', e.touches[0]);
        if (this.isTransitioning) {
            console.log('Ignoring touch start - currently transitioning');
            return;
        }
        
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        console.log('Touch start coordinates:', { startX: this.startX, startY: this.startY });
    }
    
    handleTouchMove(e) {
        if (this.isTransitioning) return;
        
        this.endX = e.touches[0].clientX;
        this.endY = e.touches[0].clientY;
        
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;
        console.log('Touch move:', { endX: this.endX, endY: this.endY, deltaX, deltaY });
        
        // Show visual feedback during swipe
        this.showSwipeFeedback();
    }
    
    handleTouchEnd(e) {
        console.log('Touch end detected');
        if (this.isTransitioning) {
            console.log('Ignoring touch end - currently transitioning');
            return;
        }
        
        console.log('Processing swipe with coordinates:', {
            startX: this.startX,
            startY: this.startY,
            endX: this.endX,
            endY: this.endY
        });
        
        this.processSwipe();
        this.hideSwipeFeedback();
    }
    
    
    processSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = Math.abs(this.endY - this.startY);
        
        console.log('Processing swipe:', {
            deltaX,
            deltaY,
            absDeltaX: Math.abs(deltaX),
            minSwipeDistance: this.minSwipeDistance,
            maxVerticalDistance: this.maxVerticalDistance,
            isValidSwipe: Math.abs(deltaX) > this.minSwipeDistance && deltaY < this.maxVerticalDistance,
            currentPage: this.currentPage
        });
        
        // Check if it's a valid horizontal swipe
        if (Math.abs(deltaX) > this.minSwipeDistance && deltaY < this.maxVerticalDistance) {
            if (deltaX > 0) {
                console.log('Swipe right detected');
                // Swipe right - go to previous page (Home if on Blog)
                if (this.currentPage === 'blog') {
                    console.log('Navigating from blog to home');
                    this.navigateToPage('home');
                } else {
                    console.log('Swipe right ignored - not on blog page');
                }
            } else {
                console.log('Swipe left detected');
                // Swipe left - go to next page (Blog if on Home)
                if (this.currentPage === 'home') {
                    console.log('Navigating from home to blog');
                    this.navigateToPage('blog');
                } else {
                    console.log('Swipe left ignored - not on home page');
                }
            }
        } else {
            console.log('Swipe not valid - distance or direction requirements not met');
        }
    }
    
    navigateToPage(page) {
        if (this.isTransitioning || this.currentPage === page) return;
        
        console.log(`🚀 Instant navigation to: ${page}`);
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
    
    // Removed showTransitionOverlay - using instant transitions now
    
    saveTerminalState() {
        if (this.currentPage === 'home') {
            const terminalBody = document.querySelector('.terminal-body');
            const hobbiesSection = document.querySelector('.hobbies');
            const contactSection = document.querySelector('.contact');
            
            if (terminalBody) {
                localStorage.setItem('terminalState', terminalBody.innerHTML);
            }
            
            if (hobbiesSection && hobbiesSection.classList.contains('show')) {
                localStorage.setItem('hobbiesShown', 'true');
            }
            
            if (contactSection && contactSection.classList.contains('show')) {
                localStorage.setItem('contactShown', 'true');
            }
        }
    }
    
    restoreTerminalState() {
        if (this.currentPage === 'home') {
            const terminalBody = document.querySelector('.terminal-body');
            const hobbiesSection = document.querySelector('.hobbies');
            const contactSection = document.querySelector('.contact');
            
            const savedTerminalState = localStorage.getItem('terminalState');
            const hobbiesWasShown = localStorage.getItem('hobbiesShown') === 'true';
            const contactWasShown = localStorage.getItem('contactShown') === 'true';
            
            if (savedTerminalState && terminalBody) {
                // Skip the typewriter effect and restore the saved state
                terminalBody.innerHTML = savedTerminalState;
                
                // Show sections immediately if they were previously shown
                if (hobbiesWasShown && hobbiesSection) {
                    hobbiesSection.classList.add('show');
                }
                
                if (contactWasShown && contactSection) {
                    contactSection.classList.add('show');
                }
                
                return true; // State was restored
            }
        }
        return false; // No state to restore
    }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    
    console.log('Theme setup complete');
    
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
    
    console.log('About to clear localStorage and initialize terminal');
    
    // Clear any corrupted state and force fresh start
    localStorage.removeItem('terminalState');
    localStorage.removeItem('hobbiesShown');
    localStorage.removeItem('contactShown');
    
    console.log('LocalStorage cleared, checking if we should initialize typewriter...');
    
    // Only initialize typewriter on home page
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    const isHomePage = currentPath === '/' || currentPath.includes('index.html') || currentPath === '';
    console.log('Is home page:', isHomePage);
    
    if (isHomePage) {
        console.log('Initializing content for home page...');
        
        // Get sections immediately
        const hobbiesSection = document.querySelector('.hobbies');
        const contactSection = document.querySelector('.contact');
        
        // IMMEDIATE APPROACH - Start right away
        console.log('🚀 IMMEDIATE: Adding content right now...');
        
        // Add static terminal content immediately
        addStaticTerminalContent();
        
        // Show sections immediately (no delays)
        if (hobbiesSection) {
            hobbiesSection.classList.add('show');
            console.log('✅ Hobbies section shown immediately');
        } else {
            console.error('❌ Hobbies section not found!');
        }
        
        if (contactSection) {
            contactSection.classList.add('show');
            console.log('✅ Contact section shown immediately');
        } else {
            console.error('❌ Contact section not found!');
        }
        
        console.log('🎉 ALL CONTENT LOADED IMMEDIATELY!');
        
    } else {
        console.log('Not on home page, skipping initialization');
    }
    
    console.log('About to initialize swipe navigation...');
    
    // Initialize swipe navigation
    try {
        new SwipeNavigation();
        console.log('Swipe navigation initialized successfully');
    } catch (error) {
        console.error('Error initializing swipe navigation:', error);
    }
    
    console.log('DOMContentLoaded setup complete');
});
