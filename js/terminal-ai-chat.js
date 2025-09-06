/**
 * Terminal-to-AI Chat Transformation
 * Converts terminal window to chat interface when AI-related words are clicked
 */

class TerminalAIChat {
  constructor() {
    this.terminalElement = null;
    this.originalContent = '';
    this.isChatMode = false;
    this.mosesAI = null;
    this.conversations = [];
    this.init();
  }

  init() {
    this.terminalElement = document.querySelector('.terminal-window');
    if (this.terminalElement) {
      this.originalContent = this.terminalElement.innerHTML;
      this.setupAIWordTriggers();
      this.setupMobileSupport();
    } else {
      // eslint-disable-next-line no-console
      console.warn('TerminalAIChat: Terminal element not found');
    }
  }

  setupAIWordTriggers() {
    // Find "Artificial Intelligence" text and add floating chat icon
    // Try multiple times with increasing delays to ensure elements are loaded
    this.retryAddFloatingIcon(0);
  }

  retryAddFloatingIcon(attemptCount) {
    const maxAttempts = 5;
    const baseDelay = 200;

    setTimeout(
      () => {
        // eslint-disable-next-line no-console
        console.log(
          `TerminalAIChat: Attempt ${attemptCount + 1} to add floating icon`
        );

        const success = this.addFloatingChatIcon();

        if (!success && attemptCount < maxAttempts - 1) {
          // If failed and we have more attempts, retry with longer delay
          // eslint-disable-next-line no-console
          console.log(
            `TerminalAIChat: Attempt ${attemptCount + 1} failed, retrying...`
          );
          this.retryAddFloatingIcon(attemptCount + 1);
        } else if (success) {
          // eslint-disable-next-line no-console
          console.log(
            `TerminalAIChat: Successfully added floating icon on attempt ${attemptCount + 1}`
          );
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            'TerminalAIChat: Failed to add floating icon after all attempts'
          );
        }
      },
      baseDelay * (attemptCount + 1)
    );
  }

  addFloatingChatIcon() {
    // ALWAYS add the fallback button on mobile - it's more reliable
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      // eslint-disable-next-line no-console
      console.log(
        'TerminalAIChat: Mobile detected, using fallback button for reliability'
      );
      this.addFallbackChatButton();
      return true;
    }

    // Desktop only: Try to add floating icon
    const hobbyTags = document.querySelectorAll('.hobby-tag');
    // eslint-disable-next-line no-console
    console.log('TerminalAIChat: Found', hobbyTags.length, 'hobby tags');

    if (hobbyTags.length === 0) {
      // eslint-disable-next-line no-console
      console.log('TerminalAIChat: No hobby tags found');
      // Fallback: Add a visible chat button to the terminal window itself
      this.addFallbackChatButton();
      return false;
    }

    for (let index = 0; index < hobbyTags.length; index++) {
      const tag = hobbyTags[index];
      // eslint-disable-next-line no-console
      console.log(`TerminalAIChat: Tag ${index}:`, tag.textContent.trim());
      if (tag.textContent.trim() === 'Artificial Intelligence') {
        // eslint-disable-next-line no-console
        console.log(
          'TerminalAIChat: Found Artificial Intelligence tag, creating floating icon'
        );

        // Check if icon already exists
        if (tag.querySelector('.floating-chat-icon')) {
          // eslint-disable-next-line no-console
          console.log('TerminalAIChat: Floating icon already exists');
          return true;
        }

        // Create floating chat icon
        const chatIcon = document.createElement('div');
        chatIcon.className = 'floating-chat-icon';
        chatIcon.innerHTML = `
          <div class="chat-icon-button" title="Chat with Moses AI">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <rect x="20" y="25" width="60" height="50" rx="10"/>
              <circle cx="35" cy="40" r="6" fill="white"/>
              <circle cx="65" cy="40" r="6" fill="white"/>
              <circle cx="35" cy="40" r="3" fill="currentColor"/>
              <circle cx="65" cy="40" r="3" fill="currentColor"/>
              <path d="M 35 55 Q 50 65 65 55" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
              <circle cx="35" cy="15" r="3"/>
              <circle cx="65" cy="15" r="3"/>
              <line x1="35" y1="25" x2="35" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="65" y1="25" x2="65" y2="18" stroke="currentColor" stroke-width="2"/>
              <rect x="30" y="75" width="40" height="20" rx="5"/>
              <rect x="15" y="80" width="15" height="8" rx="4"/>
              <rect x="70" y="80" width="15" height="8" rx="4"/>
            </svg>
            <span class="chat-counter">1</span>
          </div>
          <div class="chat-tooltip">Chat with Moses AI</div>
        `;

        // Position relative to the hobby tag
        tag.style.position = 'relative';
        tag.appendChild(chatIcon);
        // eslint-disable-next-line no-console
        console.log('TerminalAIChat: Floating icon appended to tag');

        // Add click and touch handlers
        const chatButton = chatIcon.querySelector('.chat-icon-button');

        // iOS Safari compatible touch handling
        let touchProcessing = false;

        const safeMobileHandler = (e, eventType) => {
          if (touchProcessing) return;
          touchProcessing = true;

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // eslint-disable-next-line no-console
          console.log(
            `TerminalAIChat: Floating icon ${eventType}, opening chat...`
          );

          setTimeout(() => {
            this.showChat();
            setTimeout(() => {
              touchProcessing = false;
            }, 1000);
          }, 50);
        };

        // Primary handler for mobile - use touchstart for iOS Safari
        chatButton.addEventListener(
          'touchstart',
          e => {
            safeMobileHandler(e, 'touched');
          },
          { passive: false }
        );

        // Desktop fallback - only if no touch
        chatButton.addEventListener('click', e => {
          if ('ontouchstart' in window) return;
          safeMobileHandler(e, 'clicked');
        });

        // Visual feedback for touch
        chatButton.addEventListener(
          'touchstart',
          e => {
            // eslint-disable-next-line no-unused-vars
            const _ = e; // Acknowledge parameter
            // eslint-disable-next-line no-console
            console.log('TerminalAIChat: Touch start - visual feedback');
            chatButton.style.transform = 'scale(0.95)';
            chatButton.style.opacity = '0.8';
          },
          { passive: true }
        ); // Passive for visual feedback only

        chatButton.addEventListener(
          'touchend',
          e => {
            // eslint-disable-next-line no-unused-vars
            const _ = e; // Acknowledge parameter
            chatButton.style.transform = '';
            chatButton.style.opacity = '';
          },
          { passive: true }
        );

        chatButton.addEventListener(
          'touchcancel',
          e => {
            // eslint-disable-next-line no-unused-vars
            const _ = e; // Acknowledge parameter
            chatButton.style.transform = '';
            chatButton.style.opacity = '';
          },
          { passive: true }
        );

        return true; // Successfully added icon
      }
    }

    // eslint-disable-next-line no-console
    console.log('TerminalAIChat: "Artificial Intelligence" tag not found');
    // Fallback: Add a visible chat button to the terminal window itself
    this.addFallbackChatButton();
    return false; // Failed to find the tag
  }

  addFallbackChatButton() {
    // Add a visible chat button as fallback when hobby tags aren't found
    const terminal = document.querySelector('.terminal-window');
    if (!terminal) return;

    // Check if fallback button already exists
    if (document.querySelector('.fallback-chat-button')) return;

    const fallbackButton = document.createElement('div');
    fallbackButton.className = 'fallback-chat-button';
    fallbackButton.innerHTML = `
      <button class="chat-test-btn" type="button" title="Chat with Moses AI">
        💬 Chat with Moses AI
      </button>
    `;

    // Position the button prominently with inline styles to override any conflicts
    fallbackButton.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 999999 !important;
      background: #00ff00 !important;
      color: #000 !important;
      padding: 12px 16px !important;
      border-radius: 25px !important;
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3) !important;
      cursor: pointer !important;
      font-family: 'Courier New', monospace !important;
      font-size: 14px !important;
      font-weight: bold !important;
      border: 2px solid #00ff00 !important;
      animation: pulse-glow 2s infinite !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    `;

    // Add to body instead of terminal for better visibility
    document.body.appendChild(fallbackButton);

    // Ensure button styles override any CSS conflicts
    const button = fallbackButton.querySelector('.chat-test-btn');
    button.style.cssText = `
      background: #00ff00 !important;
      color: #000 !important;
      border: none !important;
      padding: 12px 20px !important;
      cursor: pointer !important;
      font-family: 'Courier New', monospace !important;
      font-size: 14px !important;
      font-weight: bold !important;
      display: block !important;
      width: 100% !important;
      pointer-events: auto !important;
    `;

    // Add click handler with mobile-specific fixes
    let isProcessing = false;

    const handleChatOpen = (e, source) => {
      if (isProcessing) {
        // eslint-disable-next-line no-console
        console.log(`TerminalAIChat: Button ${source} - already processing`);
        return;
      }
      isProcessing = true;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }

      // eslint-disable-next-line no-console
      console.log(`TerminalAIChat: Fallback button ${source}, opening chat...`);

      // Use requestAnimationFrame for smoother transition
      requestAnimationFrame(() => {
        this.showChat();
        setTimeout(() => {
          isProcessing = false;
        }, 1500); // Longer delay to prevent issues
      });
    };

    // Mobile: Use both touchend and click for maximum compatibility
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      // Primary mobile handler
      button.addEventListener(
        'touchend',
        e => {
          e.preventDefault(); // Prevent ghost click
          handleChatOpen(e, 'touched');
        },
        { passive: false }
      );

      // Backup click handler for mobile
      button.addEventListener(
        'click',
        e => {
          // Check if this is a ghost click from touch
          const now = Date.now();
          if (window.lastTouchEnd && now - window.lastTouchEnd < 500) {
            e.preventDefault();
            return; // Ignore ghost click
          }
          handleChatOpen(e, 'clicked-mobile');
        },
        { passive: false }
      );

      // Track touch events to prevent ghost clicks
      button.addEventListener(
        'touchstart',
        () => {
          window.lastTouchEnd = Date.now();
        },
        { passive: true }
      );
    } else {
      // Desktop only
      button.addEventListener('click', e => {
        handleChatOpen(e, 'clicked-desktop');
      });
    }

    // eslint-disable-next-line no-console
    console.log('TerminalAIChat: Added fallback chat button');
  }

  setupMobileSupport() {
    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', e => {
        if (e.target.classList.contains('ai-trigger')) {
          e.target.style.backgroundColor = '#e3f2fd';
        }
      });

      document.addEventListener('touchend', e => {
        if (e.target.classList.contains('ai-trigger')) {
          setTimeout(() => {
            e.target.style.backgroundColor = '';
          }, 150);
        }
      });
    }
  }

  // Manual method to show chat interface
  showChat() {
    // Remove fallback button when chat is opened
    const fallbackButton = document.querySelector('.fallback-chat-button');
    if (fallbackButton) {
      fallbackButton.remove();
    }
    this.transformToChat();
  }

  async transformToChat() {
    if (this.isChatMode || !this.terminalElement) return;

    this.isChatMode = true;

    // Lock body scroll on mobile
    if (window.innerWidth <= 768) {
      document.body.classList.add('chat-open');
    }

    // Add transformation animation
    this.terminalElement.style.transition = 'all 0.5s ease-in-out';
    this.terminalElement.style.transform = 'scale(0.95)';
    this.terminalElement.style.opacity = '0.7';

    setTimeout(() => {
      this.renderChatInterface();
    }, 250);
  }

  renderChatInterface() {
    const chatHTML = `
      <div class="terminal-ai-chat">
        <div class="terminal-header">
          <div class="terminal-buttons">
            <span class="btn-close" id="chat-close-btn"></span>
            <span class="btn-minimize"></span>
            <span class="btn-maximize"></span>
          </div>
          <div class="terminal-title">
            <span class="ai-icon"></span> Moses AI Assistant
          </div>
          <div class="chat-status">
            <span class="status-indicator online" title="Connected to Moses AI"></span>
            online
          </div>
        </div>
        <div class="terminal-body terminal-chat-body">
          <div class="chat-messages" id="terminal-chat-messages">
            <div class="ai-message welcome-msg">
              <div class="message-avatar"></div>
              <div class="message-content">
                <div class="message-text">
                  Hello! I'm Moses Omondi's AI assistant specializing in DevSecOps and cloud architecture.
                  <br><br>
                  I can help you with:
                  <br><br>
                  <strong>DevSecOps</strong> - CI/CD security, SAST/DAST implementation
                  <br>
                  <strong>Cloud Architecture</strong> - AWS security, compliance, best practices
                  <br>
                  <strong>Container Security</strong> - Kubernetes RBAC, policies, scanning
                  <br>
                  <strong>MLOps Security</strong> - Model security, secure ML pipelines
                  <br><br>
                  What would you like to discuss?
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
          
          <div class="chat-input-container">
            <div class="typing-indicator" id="typing-indicator" style="display: none;">
              <div class="typing-avatar">🤖</div>
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            
            <div class="chat-input-form">
              <div class="input-wrapper">
                <textarea 
                  id="terminal-chat-input" 
                  placeholder="Ask Moses about DevSecOps, AWS, Kubernetes, AI/ML..."
                  rows="1"
                  maxlength="500"
                ></textarea>
                <button type="button" id="terminal-send-btn" onclick="terminalAI.sendMessage()">
                  <span id="terminal-send-icon">→</span>
                </button>
              </div>
              <div class="input-footer">
                <small class="char-count" id="terminal-char-count">0/500</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.terminalElement.innerHTML = chatHTML;

    // Reset transform and apply final styles
    setTimeout(() => {
      this.terminalElement.style.transform = 'scale(1)';
      this.terminalElement.style.opacity = '1';
      this.setupChatInteractions();
      this.setupCloseButtonHandler();
      this.initializeMosesAI();
      document.getElementById('terminal-chat-input').focus();
    }, 100);
  }

  setupCloseButtonHandler() {
    const closeBtn = document.getElementById('chat-close-btn');
    if (!closeBtn) return;

    // Add delay to prevent immediate close on mobile
    let isReady = false;
    setTimeout(() => {
      isReady = true;
    }, 800); // Wait 800ms after chat opens

    // Mobile-safe close handler
    const handleClose = (e, source) => {
      if (!isReady) {
        // eslint-disable-next-line no-console
        console.log(
          `TerminalAIChat: Close button ${source} too early, ignoring`
        );
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // eslint-disable-next-line no-console
      console.log(`TerminalAIChat: Close button ${source}, closing chat`);
      this.closeChat();
    };

    // Touch handler for mobile
    closeBtn.addEventListener(
      'touchstart',
      e => {
        handleClose(e, 'touched');
      },
      { passive: false }
    );

    // Click handler for desktop
    closeBtn.addEventListener('click', e => {
      if ('ontouchstart' in window) return; // Skip on touch devices
      handleClose(e, 'clicked');
    });

    // eslint-disable-next-line no-console
    console.log('TerminalAIChat: Close button handler setup complete');
  }

  setupChatInteractions() {
    const input = document.getElementById('terminal-chat-input');
    const sendBtn = document.getElementById('terminal-send-btn');
    const charCount = document.getElementById('terminal-char-count');

    if (!input || !sendBtn || !charCount) return;

    // Auto-resize textarea with controlled height
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height =
        Math.min(input.scrollHeight, 60) +
        'px'; /* Reduced to prevent UI expansion */

      const length = input.value.length;
      charCount.textContent = `${length}/500`;
      sendBtn.disabled = !input.value.trim();
    });

    // Send on Enter (Shift+Enter for new line)
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
          this.sendMessage();
        }
      }
    });

    // Send button click
    sendBtn.addEventListener('click', () => {
      if (!sendBtn.disabled) {
        this.sendMessage();
      }
    });
  }

  async initializeMosesAI() {
    if (window.mosesAI) {
      this.mosesAI = window.mosesAI;
    } else {
      // eslint-disable-next-line no-console
      console.error(
        'Moses AI client not found. Make sure moses-ai-client.js is loaded.'
      );
      this.showError('Failed to connect to Moses AI. Please refresh the page.');
      return;
    }

    // Test connection
    try {
      const health = await this.mosesAI.getHealth();
      const statusIndicator = document.querySelector('.status-indicator');
      if (statusIndicator) {
        statusIndicator.className = health.error
          ? 'status-indicator offline'
          : 'status-indicator online';
      }
    } catch (error) {
      const statusIndicator = document.querySelector('.status-indicator');
      if (statusIndicator) {
        statusIndicator.className = 'status-indicator offline';
      }
    }
  }

  async sendMessage() {
    const input = document.getElementById('terminal-chat-input');
    const sendBtn = document.getElementById('terminal-send-btn');
    const sendIcon = document.getElementById('terminal-send-icon');

    if (!input || !this.mosesAI) return;

    const question = input.value.trim();
    if (!question) return;

    // Disable input and show loading
    input.disabled = true;
    sendBtn.disabled = true;
    sendIcon.textContent = '⏳';

    // Add user message
    this.addMessage(question, 'user');
    input.value = '';
    document.getElementById('terminal-char-count').textContent = '0/500';

    // Show typing indicator
    this.showTypingIndicator();

    try {
      const response = await this.mosesAI.query(question);
      this.hideTypingIndicator();

      if (response.error) {
        if (response.fallback_response) {
          this.addMessage(response.fallback_response, 'assistant', response);
        } else {
          this.addMessage(
            response.message ||
              "I'm currently offline. Please try again later.",
            'error'
          );
        }
      } else {
        this.addMessage(
          response.response ||
            response.answer ||
            'Thank you for your question!',
          'assistant',
          response
        );
      }

      this.conversations.push({ question, response });
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(
        `Sorry, I encountered an error: ${error.message}`,
        'error'
      );
    } finally {
      // Re-enable input
      input.disabled = false;
      sendBtn.disabled = false;
      sendIcon.textContent = '→';
      input.focus();
    }
  }

  askQuickQuestion(button) {
    const questions = {
      'CI/CD Security':
        'What are the best practices for CI/CD pipeline security?',
      'Kubernetes Security': 'How do I secure a Kubernetes cluster?',
      'AWS Architecture': 'How do I design secure AWS infrastructure?',
      MLSecOps: 'What is MLSecOps and how do I implement it?',
    };

    const question = questions[button.textContent.trim()];
    if (question) {
      document.getElementById('terminal-chat-input').value = question;
      document
        .getElementById('terminal-chat-input')
        .dispatchEvent(new Event('input'));
    }
  }

  addMessage(content, type, metadata = {}) {
    const messagesContainer = document.getElementById('terminal-chat-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;

    const time = new Date().toLocaleTimeString();

    if (type === 'user') {
      messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
          <div class="message-text">
            ${this.escapeHtml(content)}
          </div>
          <div class="message-time">${time}</div>
        </div>
      `;
    } else if (type === 'assistant') {
      messageDiv.innerHTML = `
        <div class="message-avatar"></div>
        <div class="message-content">
          <div class="message-text">
            ${this.formatResponse(content)}
          </div>
          <div class="message-footer">
            <div class="message-time">${time}</div>
            ${metadata.processing_time ? `<span class="processing-time">⚡ ${metadata.processing_time.toFixed(2)}s</span>` : ''}
          </div>
        </div>
      `;
    } else if (type === 'error') {
      messageDiv.innerHTML = `
        <div class="message-avatar">⚠️</div>
        <div class="message-content">
          <div class="message-text error-text">
            ${this.escapeHtml(content)}
          </div>
          <div class="message-time">${time}</div>
        </div>
      `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // CSS animation handles the entrance animation
    // No need for manual JavaScript animation override
  }

  showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.style.display = 'flex';
      const messagesContainer = document.getElementById(
        'terminal-chat-messages'
      );
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  formatResponse(content) {
    return this.escapeHtml(content)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    const messagesContainer = document.getElementById('terminal-chat-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML += `
        <div class="error-message">
          <div class="message-avatar">⚠️</div>
          <div class="message-content">
            <div class="message-text error-text">${message}</div>
          </div>
        </div>
      `;
    }
  }

  closeChat() {
    if (!this.isChatMode || !this.terminalElement) return;

    // eslint-disable-next-line no-console
    console.log('TerminalAIChat: Closing chat...');

    // Unlock body scroll on mobile
    document.body.classList.remove('chat-open');

    // Remove fallback button when chat is opened (it's no longer needed)
    const fallbackButton = document.querySelector('.fallback-chat-button');
    if (fallbackButton) {
      fallbackButton.remove();
    }

    // Add closing animation
    this.terminalElement.style.transition = 'all 0.4s ease-in-out';
    this.terminalElement.style.transform = 'scale(0.95)';
    this.terminalElement.style.opacity = '0.7';

    setTimeout(() => {
      this.terminalElement.innerHTML = this.originalContent;
      this.terminalElement.style.transform = 'scale(1)';
      this.terminalElement.style.opacity = '1';
      this.isChatMode = false;

      // Re-add fallback button after closing - with delay for mobile
      setTimeout(() => {
        this.addFallbackChatButton();
      }, 500);
    }, 200);
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTerminalAI);
} else {
  initializeTerminalAI();
}

function initializeTerminalAI() {
  window.terminalAI = new TerminalAIChat();
  // eslint-disable-next-line no-console
  console.log('Moses AI Terminal Chat initialized:', window.terminalAI);

  // Add global debug function
  window.testChat = function () {
    // eslint-disable-next-line no-console
    console.log('Testing chat manually...');
    if (window.terminalAI) {
      window.terminalAI.showChat();
    } else {
      // eslint-disable-next-line no-console
      console.error('TerminalAI not available');
    }
  };

  // Add icon visibility check
  window.checkFloatingIcon = function () {
    const icons = document.querySelectorAll('.floating-chat-icon');
    // eslint-disable-next-line no-console
    console.log('Floating icons found:', icons.length);
    icons.forEach((icon, index) => {
      // eslint-disable-next-line no-console
      console.log(`Icon ${index}:`, icon, 'Visible:', icon.offsetHeight > 0);
    });
  };
}

// Also make the class available globally
window.TerminalAIChat = TerminalAIChat;

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TerminalAIChat;
}
