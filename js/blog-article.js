// blog-article.js - Handles interactions within blog articles

document.addEventListener('DOMContentLoaded', function () {
  // Simple swipe navigation for articles - only swipe RIGHT to go back to blog
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  // Handle touch start
  document.addEventListener(
    'touchstart',
    function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  // Handle touch end
  document.addEventListener(
    'touchend',
    function (e) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipeGesture();
    },
    { passive: true }
  );

  function handleSwipeGesture() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const maxVerticalDistance = 100; // Maximum vertical movement allowed

    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);

    // Check if it's a valid horizontal swipe (not vertical scrolling)
    if (Math.abs(deltaX) > swipeThreshold && deltaY < maxVerticalDistance) {
      if (deltaX > 0) {
        // Swipe RIGHT - pull back to blog listing
        window.location.href = '../blog.html';
      }
      // Swipe LEFT does nothing in articles
    }
  }

  // Disable browser's swipe navigation on this page
  if ('overscrollBehavior' in document.body.style) {
    document.body.style.overscrollBehavior = 'none';
  }

  // Prevent any accidental link behavior in code blocks
  const codeBlocks = document.querySelectorAll(
    '.blog-article pre, .blog-article code'
  );

  codeBlocks.forEach(block => {
    // Prevent default link behavior
    block.addEventListener('click', function (e) {
      // If somehow there's a link inside, prevent it
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // Ensure text is selectable but not clickable as link
    block.addEventListener('mousedown', function (e) {
      // Allow text selection
      e.stopPropagation();
    });

    // Prevent navigation on touch devices
    block.addEventListener(
      'touchstart',
      function (e) {
        // Allow scrolling and text selection
        e.stopPropagation();
      },
      { passive: true }
    );
  });

  // Fix any links that might be accidentally created in code blocks
  const codeLinks = document.querySelectorAll(
    '.blog-article pre a, .blog-article code a'
  );
  codeLinks.forEach(link => {
    // Convert link to plain text
    const text = link.textContent;
    const textNode = document.createTextNode(text);
    link.parentNode.replaceChild(textNode, link);
  });

  // Ensure article content doesn't trigger parent navigation
  const articleContent = document.querySelector('.blog-article');
  if (articleContent) {
    articleContent.addEventListener('click', function (e) {
      // Stop propagation to prevent blog.js from interfering
      e.stopPropagation();
    });
  }

  // Ensure back link works correctly
  const backLink = document.querySelector('.back-link');
  if (backLink) {
    backLink.addEventListener('click', function (e) {
      e.stopPropagation();
      // Let the default link behavior work
    });
  }

  // Add copy button to code blocks for better UX
  document.querySelectorAll('.blog-article pre').forEach(pre => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.textContent = 'Copy';
    copyButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 8px;
            background: var(--code-border);
            color: var(--text-color);
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        `;

    // Show button on hover
    pre.style.position = 'relative';
    pre.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });
    pre.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0';
    });

    // Copy functionality
    copyButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const code = pre.querySelector('code');
      if (code) {
        const text = code.textContent;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 2000);
          })
          .catch(() => {
            // Silently fail if clipboard API is not available
            copyButton.textContent = 'Failed';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 2000);
          });
      }
    });

    pre.appendChild(copyButton);
  });
});
