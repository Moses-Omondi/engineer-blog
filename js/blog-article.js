// blog-article.js - Handles interactions within blog articles

document.addEventListener('DOMContentLoaded', function() {
    // Swipe left navigation to go back to blog list
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwipingLeft = false;
    
    // Create a visual feedback element
    const swipeFeedback = document.createElement('div');
    swipeFeedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 10000;
    `;
    swipeFeedback.textContent = '← Going back to blog';
    document.body.appendChild(swipeFeedback);
    
    // Add swipe detection
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwipingLeft = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!touchStartX) return;
        
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const diffX = touchStartX - currentX; // Positive = swiping left
        const diffY = Math.abs(currentY - touchStartY);
        
        // Show feedback when swiping left
        if (diffX > 30 && diffY < 100) {
            isSwipingLeft = true;
            swipeFeedback.style.opacity = Math.min(1, diffX / 100);
        } else {
            swipeFeedback.style.opacity = '0';
            isSwipingLeft = false;
        }
        
        // Prevent default behavior for horizontal swipes to disable browser navigation
        if (Math.abs(diffX) > 10 && diffY < 100) {
            // This prevents the browser's swipe navigation
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false }); // Note: passive is false to allow preventDefault
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        swipeFeedback.style.opacity = '0';
        handleSwipeGesture();
        isSwipingLeft = false;
    }, { passive: true });
    
    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const verticalThreshold = 100; // Maximum vertical movement allowed
        
        // Calculate swipe direction
        // touchStartX - touchEndX > 0 means finger moved from right to left (swipe left)
        // touchEndX - touchStartX > 0 means finger moved from left to right (swipe right)
        const swipeLeftDistance = touchStartX - touchEndX;
        const swipeRightDistance = touchEndX - touchStartX;
        const verticalDiff = Math.abs(touchStartY - touchEndY);
        
        // Check if this is a horizontal swipe (not vertical scrolling)
        if (verticalDiff < verticalThreshold) {
            // SWIPE LEFT to go back to blog list
            if (swipeLeftDistance > swipeThreshold) {
                // User swiped left - navigate back to blog
                swipeFeedback.style.opacity = '1';
                swipeFeedback.textContent = '← Returning to blog';
                
                setTimeout(() => {
                    window.location.href = '../blog.html';
                }, 200);
            }
            // SWIPE RIGHT is blocked (nothing to go forward to)
            else if (swipeRightDistance > swipeThreshold) {
                // User swiped right - show message
                swipeFeedback.textContent = 'Already at the latest';
                swipeFeedback.style.opacity = '1';
                setTimeout(() => {
                    swipeFeedback.style.opacity = '0';
                }, 1000);
            }
        }
    }
    
    // Disable browser's swipe navigation on this page
    if ('overscrollBehavior' in document.body.style) {
        document.body.style.overscrollBehavior = 'none';
    }
    
    // Prevent any accidental link behavior in code blocks
    const codeBlocks = document.querySelectorAll('.blog-article pre, .blog-article code');
    
    codeBlocks.forEach(block => {
        // Prevent default link behavior
        block.addEventListener('click', function(e) {
            // If somehow there's a link inside, prevent it
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
        
        // Ensure text is selectable but not clickable as link
        block.addEventListener('mousedown', function(e) {
            // Allow text selection
            e.stopPropagation();
        });
        
        // Prevent navigation on touch devices
        block.addEventListener('touchstart', function(e) {
            // Allow scrolling and text selection
            e.stopPropagation();
        }, { passive: true });
    });
    
    // Fix any links that might be accidentally created in code blocks
    const codeLinks = document.querySelectorAll('.blog-article pre a, .blog-article code a');
    codeLinks.forEach(link => {
        // Convert link to plain text
        const text = link.textContent;
        const textNode = document.createTextNode(text);
        link.parentNode.replaceChild(textNode, link);
    });
    
    // Ensure article content doesn't trigger parent navigation
    const articleContent = document.querySelector('.blog-article');
    if (articleContent) {
        articleContent.addEventListener('click', function(e) {
            // Stop propagation to prevent blog.js from interfering
            e.stopPropagation();
        });
    }
    
    // Ensure back link works correctly
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
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
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const code = pre.querySelector('code');
            if (code) {
                const text = code.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        });
        
        pre.appendChild(copyButton);
    });
});
