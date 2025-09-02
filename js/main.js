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

// Typewriter Effect - Fixed and Simplified
function typeWriter(text, element, speed = 50, callback) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// Initialize typewriter effect and content reveal
function initTypewriterEffect() {
    console.log('Initializing typewriter effect...');
    
    const typewriterText = document.getElementById('typewriter-text');
    const cursor = document.getElementById('cursor');
    const typewriterText2 = document.getElementById('typewriter-text-2');
    const cursor2 = document.getElementById('cursor-2');
    const contentAfterTyping = document.getElementById('contentAfterTyping');
    const hobbiesSection = document.querySelector('.hobbies');
    const contactSection = document.querySelector('.contact');
    
    // Check if elements exist
    if (!typewriterText || !typewriterText2) {
        console.error('Typewriter text elements not found!');
        return;
    }
    
    console.log('Elements found, starting typewriter...');
    
    // Check if mobile for timing adjustments
    const isMobile = window.innerWidth <= 480;
    const typingSpeed = isMobile ? 35 : 40; // Slightly faster on mobile
    const typingSpeed2 = isMobile ? 30 : 35; // Even faster for second paragraph
    const initialDelay = isMobile ? 600 : 800; // Slightly faster start on mobile
    
    const textToType1 = "Hello! I'm Moses, a passionate software engineer with a deep curiosity for technology and continuous learning. I love building elegant solutions to complex problems and exploring the fascinating world of computers.";
    const textToType2 = "When I'm not coding, I enjoy discovering new technologies, contributing to open-source projects, and sharing knowledge with the developer community.";
    
    // Clear the elements first
    typewriterText.textContent = '';
    typewriterText2.textContent = '';
    
    // Hide second cursor initially
    if (cursor2) cursor2.style.display = 'none';
    
    // Start typing after a small delay
    setTimeout(() => {
        console.log('Starting first paragraph typing...');
        
        typeWriter(textToType1, typewriterText, typingSpeed, function() {
            console.log('First paragraph typing complete!');
            
            // Remove first cursor and add a new line
            setTimeout(() => {
                if (cursor) cursor.style.display = 'none';
                
                // Show the second paragraph container and start typing
                if (contentAfterTyping) {
                    contentAfterTyping.classList.add('show');
                    console.log('Second paragraph container shown');
                    
                    // Show second cursor and start typing second paragraph
                    setTimeout(() => {
                        if (cursor2) cursor2.style.display = 'inline-block';
                        console.log('Starting second paragraph typing...');
                        
                        typeWriter(textToType2, typewriterText2, typingSpeed2, function() {
                            console.log('Second paragraph typing complete!');
                            
                            // Remove second cursor after typing
                            setTimeout(() => {
                                if (cursor2) cursor2.style.display = 'none';
                                
                                // Add terminal prompt after completion
                                const terminalBody = document.querySelector('.terminal-body');
                                if (terminalBody) {
                                    const promptLine = document.createElement('div');
                                    promptLine.className = 'terminal-line';
                                    promptLine.innerHTML = '<span class="terminal-prompt">mosesomondi@Desktop ~ % </span>';
                                    terminalBody.appendChild(promptLine);
                                }
                            }, isMobile ? 600 : 800);
                            
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
                        });
                    }, isMobile ? 300 : 400); // Brief delay before second typing starts
                }
            }, isMobile ? 600 : 800);
        });
        
    }, initialDelay); // Initial delay before typing starts
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
    
    // Initialize typewriter effect
    initTypewriterEffect();
});
