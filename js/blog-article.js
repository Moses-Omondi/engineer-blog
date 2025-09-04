// blog-article.js - Handles interactions within blog articles

document.addEventListener('DOMContentLoaded', function() {
    // Swipe navigation for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // Minimum distance for swipe
    const verticalThreshold = 100; // Maximum vertical movement allowed
    
    // Create edge glow element for visual feedback
    const edgeGlow = document.createElement('div');
    edgeGlow.className = 'swipe-edge-glow';
    document.body.appendChild(edgeGlow);
    
    // Add swipe detection to the entire document
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!touchStartX) return;
        
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const diffX = currentX - touchStartX;
        const diffY = Math.abs(currentY - touchStartY);
        
        // Show edge glow when swiping right
        if (diffX > 20 && diffY < verticalThreshold) {
            isSwiping = true;
            edgeGlow.style.opacity = Math.min(1, diffX / 100);
        } else {
            edgeGlow.style.opacity = '0';
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        edgeGlow.style.opacity = '0';
        handleSwipeGesture();
        isSwiping = false;
    }, { passive: true });
    
    function handleSwipeGesture() {
        const horizontalDiff = touchEndX - touchStartX;
        const verticalDiff = Math.abs(touchStartY - touchEndY);
        
        // Check if this is a horizontal swipe (not vertical scrolling)
        if (verticalDiff < verticalThreshold) {
            // Swipe right (go back to blog list)
            if (horizontalDiff > swipeThreshold) {
                navigateBack();
            }
            // Could add swipe left for next article in the future
        }
    }
    
    function navigateBack() {
        // Add visual feedback
        const overlay = document.createElement('div');
        overlay.className = 'swipe-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
            pointer-events: none;
            animation: swipeOut 0.3s ease-out;
            z-index: 9999;
        `;
        
        // Add animation keyframes if not already present
        if (!document.querySelector('#swipe-animations')) {
            const style = document.createElement('style');
            style.id = 'swipe-animations';
            style.textContent = `
                @keyframes swipeOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                }
                
                @keyframes slideIndicator {
                    0%, 100% {
                        transform: translateX(0);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateX(10px);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(overlay);
        
        // Navigate after animation starts
        setTimeout(() => {
            window.location.href = '../blog.html';
        }, 150);
    }
    
    // Add visual swipe indicator for mobile users
    if ('ontouchstart' in window) {
        const swipeIndicator = document.createElement('div');
        swipeIndicator.className = 'swipe-indicator';
        swipeIndicator.innerHTML = '→ Swipe to go back';
        swipeIndicator.style.cssText = `
            position: fixed;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 1000;
            animation: slideIndicator 2s ease-in-out infinite;
        `;
        
        document.body.appendChild(swipeIndicator);
        
        // Show indicator briefly on page load
        setTimeout(() => {
            swipeIndicator.style.opacity = '0.8';
            setTimeout(() => {
                swipeIndicator.style.opacity = '0';
                // Remove after fade out
                setTimeout(() => {
                    swipeIndicator.remove();
                }, 300);
            }, 2000);
        }, 1000);
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
    const preBlocks = document.querySelectorAll('.blog-article pre');
    preBlocks.forEach(pre => {
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
