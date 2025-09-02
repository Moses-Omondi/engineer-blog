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
    const contentAfterTyping = document.getElementById('contentAfterTyping');
    const hobbiesSection = document.querySelector('.hobbies');
    const contactSection = document.querySelector('.contact');
    
    // Check if elements exist
    if (!typewriterText) {
        console.error('Typewriter text element not found!');
        return;
    }
    
    console.log('Elements found, starting typewriter...');
    
    // Check if mobile for timing adjustments
    const isMobile = window.innerWidth <= 480;
    const typingSpeed = isMobile ? 35 : 40; // Slightly faster on mobile
    const initialDelay = isMobile ? 600 : 800; // Slightly faster start on mobile
    
    const textToType = "Hello! I'm Moses, a passionate software engineer with a deep curiosity for technology and continuous learning. I love building elegant solutions to complex problems and exploring the fascinating world of computers.";
    
    // Clear the element first
    typewriterText.textContent = '';
    
    // Start typing after a small delay
    setTimeout(() => {
        console.log('Starting to type...');
        
        typeWriter(textToType, typewriterText, typingSpeed, function() {
            console.log('Typing complete!');
            
            // Remove cursor after typing is complete
            setTimeout(() => {
                if (cursor) cursor.style.display = 'none';
            }, isMobile ? 800 : 1000);
            
            // Show the second paragraph after typing completes
            setTimeout(() => {
                if (contentAfterTyping) {
                    contentAfterTyping.classList.add('show');
                    console.log('Second paragraph shown');
                }
            }, isMobile ? 1000 : 1200);
            
            // Show hobbies section
            setTimeout(() => {
                if (hobbiesSection) {
                    hobbiesSection.classList.add('show');
                    console.log('Hobbies section shown');
                }
            }, isMobile ? 1600 : 2000);
            
            // Show contact section
            setTimeout(() => {
                if (contactSection) {
                    contactSection.classList.add('show');
                    console.log('Contact section shown');
                }
            }, isMobile ? 2000 : 2500);
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
