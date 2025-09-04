// blog.js - Enhanced functionality for Moses's Engineer Blog

// Enhanced blog functionality
document.addEventListener('DOMContentLoaded', function () {
  // Only run on blog listing page, not on individual article pages
  // Check if we're on an article page by looking for .blog-article
  if (document.querySelector('.blog-article')) {
    // We're on an article page, don't add card click handlers
    return;
  }

  // Add enhanced hover effects to blog posts
  const blogPosts = document.querySelectorAll('.blog-post');

  blogPosts.forEach(post => {
    // Add smooth hover effects
    post.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
    });

    post.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });

    // Enhanced click handling with instant navigation
    post.addEventListener(
      'click',
      function (e) {
        // Stop all event propagation to prevent any parent handlers
        e.stopPropagation();
        e.stopImmediatePropagation();

        // If clicking directly on a link, let it handle navigation naturally
        if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
          // Link will handle its own navigation
          return;
        }

        // Don't navigate if clicking on interactive elements
        if (
          e.target.tagName.toLowerCase() === 'button' ||
          e.target.tagName.toLowerCase() === 'input'
        ) {
          return;
        }

        // Find the h2 link (the main article link) and navigate
        const h2Link = this.querySelector('h2 a');
        if (h2Link && h2Link.href) {
          // Prevent any other handlers from interfering
          e.preventDefault();
          // Add a small delay to ensure touch events are fully processed
          setTimeout(() => {
            window.location.href = h2Link.href;
          }, 10);
        }
      },
      true
    ); // Use capture phase to handle before any bubbling

    // Also prevent touchend from bubbling up and triggering swipe navigation
    post.addEventListener(
      'touchend',
      function (e) {
        e.stopPropagation();
      },
      true
    );
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
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(5px)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0)';
    });
  });
});
