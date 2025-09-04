// blog.js - Enhanced functionality for Moses's Engineer Blog

// Enhanced blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add enhanced hover effects to blog posts
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        // Add smooth hover effects
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Enhanced click handling with instant navigation
        post.addEventListener('click', function(e) {
            // Prevent event propagation for all link clicks
            if (e.target.tagName.toLowerCase() === 'a' || 
                e.target.closest('a')) {
                e.stopPropagation();
                return;
            }
            
            // Don't navigate if clicking on interactive elements
            if (e.target.tagName.toLowerCase() === 'button' ||
                e.target.tagName.toLowerCase() === 'input') {
                return;
            }
            
            // Find the h2 link (the main article link) and navigate
            const h2Link = this.querySelector('h2 a');
            if (h2Link) {
                // Create instant overlay for seamless transition
                const overlay = document.createElement('div');
                overlay.className = 'page-transition-overlay active';
                document.body.appendChild(overlay);
                
                // Navigate immediately
                setTimeout(() => {
                    window.location.href = h2Link.href;
                }, 30);
            }
        });
    });
    
    // Add loading animation for blog posts
    blogPosts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.6s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Enhanced read more button functionality if present
    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});
