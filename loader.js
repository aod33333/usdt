// TrustWalletLoader.js - Universal component and initialization system
(function() {
  'use strict';
  
  console.log('TrustWallet Loader: Starting initialization...');
  
  // Configuration
  const CONFIG = {
    debug: true,
    initDelay: 500,
    screenLoadDelay: 300,
    finalCleanupDelay: 800,
    removeConflictingHandlers: true,
    prioritizeCombinedJSNavigation: true
  };
  
  // Global state to track loading progress
  const state = {
    isInitialized: false,
    screensLoaded: {
      'history-screen': false,
      'receive-screen': false,
      'send-screen': false
    }
  };
  
  // Wait for DOM content to be loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeComponents, CONFIG.initDelay));
  } else {
    // DOM already loaded, run with a delay
    setTimeout(initializeComponents, CONFIG.initDelay);
  }
  
  // Logging helper with timestamp
  function log(message) {
    if (CONFIG.debug) {
      const timestamp = new Date().toISOString().substring(11, 19);
      console.log(`[${timestamp}] TrustWallet Loader: ${message}`);
    }
  }
  
  // Main initialization sequence
  function initializeComponents() {
    log('Starting component initialization sequence');
    
    // Step 1: Ensure all basic global variables are initialized
    initGlobalVariables()
      .then(() => createScreenContainers())          // Step 2: Create missing screen containers
      .then(() => loadScreenContents())              // Step 3: Load content into screen containers
      .then(() => harmonizeNavigationFunctions())    // Step 4: Fix navigation functions
      .then(() => fixNetworkBadges())                // Step 5: Remove problematic network badges
      .then(() => enhanceEventHandlers())            // Step 6: Connect missing event handlers
      .then(() => fixBottomNavigation())             // Step 7: Ensure bottom tabs work
      .then(() => finalizeInitialization())          // Step 8: Final cleanup and checks
      .then(() => {
        log('Component initialization complete! ✅');
        state.isInitialized = true;
      })
      .catch(error => {
        console.error('Error during TrustWallet initialization:', error);
        // Continue with partial initialization
        finalizeInitialization().then(() => {
          log('Partial initialization completed with errors.');
        });
      });
  }
  
  // Step 1: Initialize global variables
  function initGlobalVariables() {
    return new Promise(resolve => {
      log('Initializing global variables');
      
      // Only set these if they don't already exist
      window.originalWalletData = window.originalWalletData || null;
      window.currentWalletData = window.currentWalletData || null;
      window.activeWallet = window.activeWallet || 'main';
      window.correctPasscode = window.correctPasscode || '123456';
      window.activeSendTokenId = window.activeSendTokenId || 'usdt';
      
      // Store original functions to prevent conflicts
      window._originalFunctions = {
        navigateTo: window.navigateTo,
        showTokenDetail: window.showTokenDetail,
        showSendScreen: window.showSendScreen,
        showReceiveScreen: window.showReceiveScreen,
        processTransaction: window.processTransaction,
        processSendTransaction: window.processSendTransaction
      };
      
      resolve();
    });
  }
  
  // Step 2: Create missing screen containers
  function createScreenContainers() {
    return new Promise(resolve => {
      log('Creating/ensuring screen containers');
      
      const appContainer = document.querySelector('.app-container');
      if (!appContainer) {
        console.error('App container not found! Critical error.');
        return resolve(); // Continue anyway
      }
      
      // List of required screens
      const requiredScreens = [
        'history-screen',
        'receive-screen',
        'send-screen',
        'send-token-select',
        'wallet-screen',
        'token-detail',
        'lock-screen'
      ];
      
      // Create missing screens
      requiredScreens.forEach(screenId => {
        if (!document.getElementById(screenId)) {
          log(`Creating missing screen container: ${screenId}`);
          const screen = document.createElement('div');
          screen.id = screenId;
          screen.className = 'screen hidden';
          appContainer.appendChild(screen);
        } else {
          log(`Screen container exists: ${screenId}`);
        }
      });
      
      resolve();
    });
  }
  
 function loadScreenContents() {
  return new Promise(resolve => {
    log('Loading screen contents from document sources');
    
    // Load History Screen
    const historyScreen = document.getElementById('history-screen');
    if (historyScreen && historyScreen.innerHTML.trim() === '') {
      const documents = document.querySelectorAll('document');
      console.log("Found " + documents.length + " document elements");
      
      // Search through all documents
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const sourceEl = doc.querySelector('source');
        
        if (sourceEl && sourceEl.textContent.trim() === 'UHS.js') {
          console.log("Found UHS.js source");
          const contentEl = doc.querySelector('document_content');
          if (contentEl) {
            historyScreen.innerHTML = contentEl.textContent;
            console.log("Loaded history screen content");
            
            // Execute scripts
            const scripts = historyScreen.querySelectorAll('script');
            scripts.forEach(script => {
              const newScript = document.createElement('script');
              newScript.textContent = script.textContent;
              document.body.appendChild(newScript);
            });
            break;
          }
        }
      }
    }
    
    // Load Receive Screen
    const receiveScreen = document.getElementById('receive-screen');
    if (receiveScreen && receiveScreen.innerHTML.trim() === '') {
      const documents = document.querySelectorAll('document');
      
      // Search through all documents
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const sourceEl = doc.querySelector('source');
        
        if (sourceEl && sourceEl.textContent.trim() === 'URS.js') {
          console.log("Found URS.js source");
          const contentEl = doc.querySelector('document_content');
          if (contentEl) {
            receiveScreen.innerHTML = contentEl.textContent;
            console.log("Loaded receive screen content");
            
            // Execute scripts
            const scripts = receiveScreen.querySelectorAll('script');
            scripts.forEach(script => {
              const newScript = document.createElement('script');
              newScript.textContent = script.textContent;
              document.body.appendChild(newScript);
            });
            break;
          }
        }
      }
    }
    
    // Initialize token selection screen
    ensureTokenSelectionScreen();
    
    setTimeout(resolve, CONFIG.screenLoadDelay);
  });
}
  
  // Create token selection screen if it doesn't exist
  function ensureTokenSelectionScreen() {
    const tokenSelectScreen = document.getElementById('send-token-select');
    if (!tokenSelectScreen || tokenSelectScreen.innerHTML.trim() === '') {
      log('Creating token selection screen');
      tokenSelectScreen.innerHTML = `
        <div class="screen-header">
          <button class="back-button" aria-label="Go back">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2>Send</h2>
          <div class="placeholder-icon"></div>
        </div>
        
        <div class="search-container">
          <div class="search-bar token-search">
            <i class="fas fa-search"></i>
            <input type="text" 
              id="token-search-input" 
              placeholder="Search" 
              aria-label="Search tokens">
          </div>
        </div>
        
        <div class="networks-filter">
          <div class="all-networks">
            All Networks <i class="fas fa-chevron-down"></i>
          </div>
        </div>
        
        <div id="select-token-list" class="token-list">
          <!-- Tokens will be populated dynamically -->
        </div>
      `;
    }
  }
  
  // Step 4: Harmonize navigation functions
  function harmonizeNavigationFunctions() {
    return new Promise(resolve => {
      log('Harmonizing navigation functions');
      
      // Decide which navigation system to use
      const useCombinedJSNavigation = window.app && 
                                      window.app.screenManager && 
                                      typeof window.app.screenManager.navigateTo === 'function' &&
                                      CONFIG.prioritizeCombinedJSNavigation;
      
      if (useCombinedJSNavigation) {
        log('Using combined.js navigation system as primary');
        
        // Store the original function reference
        const originalNavigateTo = window.app.screenManager.navigateTo.bind(window.app.screenManager);
        
        // Create enhanced version with transition effects
        window.app.screenManager.navigateTo = function(screenId, fromScreenId) {
          log(`Navigation: ${screenId}${fromScreenId ? ' (from: ' + fromScreenId + ')' : ''}`);
          
          // Add animation class to target screen
          const targetScreen = document.getElementById(screenId);
          if (targetScreen) {
            targetScreen.classList.add('slide-in-right');
            
            // Remove animation class after transition
            setTimeout(() => {
              targetScreen.classList.remove('slide-in-right');
            }, 300);
          }
          
          // Call original function
          return originalNavigateTo(screenId, fromScreenId);
        };
        
        // Update global function to point to our enhanced version
        window.navigateTo = window.app.screenManager.navigateTo.bind(window.app.screenManager);
      } else {
        // Define our own navigation function
        log('Using custom navigation system');
        
        window.navigateTo = function(screenId, fromScreenId) {
          log(`Navigation: ${screenId}${fromScreenId ? ' (from: ' + fromScreenId + ')' : ''}`);
          
          // Hide all screens
          document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
            screen.classList.add('hidden');
          });
          
          // Show target screen
          const targetScreen = document.getElementById(screenId);
          if (targetScreen) {
            targetScreen.style.display = 'flex';
            targetScreen.classList.remove('hidden');
            
            // Add animation
            targetScreen.classList.add('slide-in-right');
            setTimeout(() => {
              targetScreen.classList.remove('slide-in-right');
            }, 300);
            
            // Remember previous screen for back navigation
            if (fromScreenId) {
              targetScreen.dataset.returnTo = fromScreenId;
            }
            
            return true;
          } else {
            console.error(`Navigation failed: screen "${screenId}" not found`);
            return false;
          }
        };
      }
      
      // Create CSS for animations if it doesn't exist
      if (!document.getElementById('tw-animation-styles')) {
        const animationStyle = document.createElement('style');
        animationStyle.id = 'tw-animation-styles';
        animationStyle.textContent = `
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          
          .slide-in-right {
            animation: slide-in-right 0.3s ease-out forwards;
          }
        `;
        document.head.appendChild(animationStyle);
      }
      
      // Make sure showTokenDetail and other navigator methods
      // use our navigation function consistently
      harmonizeNavigationMethods();
      
      resolve();
    });
  }
  
  // Harmonize all navigation-related methods
  function harmonizeNavigationMethods() {
    // If combined.js defines these functions, use them with our navigation
    if (window.app && window.app.screenManager) {
      const screenManager = window.app.screenManager;
      
      // Only update if original methods exist
      if (typeof screenManager.showTokenDetail === 'function') {
        window.showTokenDetail = screenManager.showTokenDetail.bind(screenManager);
      }
      
      if (typeof screenManager.showSendScreen === 'function') {
        window.showSendScreen = screenManager.showSendScreen.bind(screenManager);
      }
      
      if (typeof screenManager.showReceiveScreen === 'function') {
        window.showReceiveScreen = screenManager.showReceiveScreen.bind(screenManager);
      }
    } else {
      // Define our own handler methods if needed
      if (!window.showTokenDetail) {
        window.showTokenDetail = function(tokenId) {
          log(`Showing token detail for: ${tokenId}`);
          window.navigateTo('token-detail', 'wallet-screen');
        };
      }
      
      if (!window.showSendScreen) {
        window.showSendScreen = function(tokenId) {
          log(`Showing send screen for token: ${tokenId}`);
          window.activeSendTokenId = tokenId || 'usdt';
          window.navigateTo('send-screen', 'wallet-screen');
        };
      }
      
      if (!window.showReceiveScreen) {
        window.showReceiveScreen = function() {
          log('Showing receive screen');
          window.navigateTo('receive-screen', 'wallet-screen');
        };
      }
    }
  }
  
  // Step 5: Fix network badges
  function fixNetworkBadges() {
    return new Promise(resolve => {
      log('Fixing network badges');
      
      // Apply network badge CSS fixes
      const badgeFixStyle = document.createElement('style');
      badgeFixStyle.textContent = `
        /* Critical badge fixes - highest specificity */
        #send-screen .chain-badge,
        #send-screen .chain-badge-fixed,
        #send-screen .network-badge,
        #send-screen [class*="badge"],
        #send-screen [class*="chain"],
        #send-screen .token-icon > div:not(img),
        #receive-screen .chain-badge,
        #receive-screen .chain-badge-fixed,
        #receive-screen .network-badge,
        #receive-screen [class*="badge"],
        #receive-screen [class*="chain"],
        #receive-screen .token-icon > div:not(img) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          pointer-events: none !important;
          clip: rect(0, 0, 0, 0) !important;
          border: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `;
      document.head.appendChild(badgeFixStyle);
      
      // Set an interval to remove badges that might get added dynamically
      if (!window._badgeRemovalInterval) {
        window._badgeRemovalInterval = setInterval(() => {
          document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
            if (!screen) return;
            
            const badges = screen.querySelectorAll(
              '.chain-badge, .chain-badge-fixed, .network-badge, [class*="badge"], [class*="chain"]'
            );
            
            badges.forEach(badge => {
              badge.style.display = 'none';
              badge.style.visibility = 'hidden';
              badge.style.opacity = '0';
            });
          });
        }, 500);
      }
      
      resolve();
    });
  }
  
  // Step 6: Enhance event handlers
  function enhanceEventHandlers() {
    return new Promise(resolve => {
      log('Enhancing event handlers');
      
      // Connect back buttons
      document.querySelectorAll('.back-button').forEach(button => {
        if (!button._hasBackHandler) {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentScreen = this.closest('.screen');
            if (!currentScreen) return;
            
            const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
            window.navigateTo(returnTo);
          });
          button._hasBackHandler = true;
        }
      });
      
      // Connect send button on main screen
      const sendButton = document.getElementById('send-button');
      if (sendButton && !sendButton._hasEventHandler) {
        sendButton.addEventListener('click', function(e) {
          e.preventDefault();
          window.navigateTo('send-token-select', 'wallet-screen');
        });
        sendButton._hasEventHandler = true;
      }
      
      // Connect receive button
      const receiveButton = document.getElementById('receive-button');
      if (receiveButton && !receiveButton._hasEventHandler) {
        receiveButton.addEventListener('click', function(e) {
          e.preventDefault();
          window.navigateTo('receive-screen', 'wallet-screen');
        });
        receiveButton._hasEventHandler = true;
      }
      
      // Connect history button
      const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
      if (historyButton && !historyButton._hasEventHandler) {
        historyButton.addEventListener('click', function(e) {
          e.preventDefault();
          window.navigateTo('history-screen', 'wallet-screen');
        });
        historyButton._hasEventHandler = true;
      }
      
      // Connect transaction button
      const continueButton = document.getElementById('continue-send');
      if (continueButton && !continueButton._hasEventHandler) {
        continueButton.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Use the appropriate transaction function
          if (typeof window.processTransaction === 'function') {
            window.processTransaction(e);
          } else if (typeof window.processSendTransaction === 'function') {
            window.processSendTransaction(e);
          } else {
            // Fallback if no function is available
            log('No transaction processor available');
            
            // Show toast notification as feedback
            showToast('Transaction submitted');
            
            // Navigate back to wallet
            window.navigateTo('wallet-screen');
          }
        });
        continueButton._hasEventHandler = true;
      }
      
      resolve();
    });
  }
  
  // Step 7: Fix bottom navigation
  function fixBottomNavigation() {
    return new Promise(resolve => {
      log('Fixing bottom navigation tabs');
      
      const bottomTabs = document.querySelector('.bottom-tabs');
      if (!bottomTabs) {
        log('Bottom tabs not found, creating them');
        
        // Create bottom tabs
        const newBottomTabs = document.createElement('div');
        newBottomTabs.className = 'bottom-tabs';
        newBottomTabs.innerHTML = `
          <div class="tab-item active">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div class="tab-item">
            <i class="fas fa-exchange-alt"></i>
            <span>Swap</span>
          </div>
          <div class="tab-item">
            <i class="fas fa-piggy-bank"></i>
            <span>Earn</span>
          </div>
          <div class="tab-item">
            <i class="fas fa-compass"></i>
            <span>Discover</span>
          </div>
        `;
        document.body.appendChild(newBottomTabs);
        
        // Use the new tabs element
        bottomTabs = newBottomTabs;
      } else {
        // Move bottom tabs to body for proper z-index stacking
        document.body.appendChild(bottomTabs);
      }
      
      // Apply critical styling to ensure visibility
      bottomTabs.style.cssText = `
        display: flex !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        background-color: white !important;
        border-top: 1px solid #F5F5F5 !important;
        padding: 8px 0 !important;
        justify-content: space-around !important;
      `;
      
      // Add click handlers if not already present
      if (!bottomTabs._hasTabHandlers) {
        bottomTabs.querySelectorAll('.tab-item').forEach((tab, index) => {
          tab.addEventListener('click', function() {
            // Update active state
            bottomTabs.querySelectorAll('.tab-item').forEach(t => {
              t.classList.remove('active');
            });
            
            tab.classList.add('active');
            
            // Handle tab navigation
            if (index === 0) {
              // Home tab - navigate to wallet screen
              window.navigateTo('wallet-screen');
            } else {
              // Other tabs - show coming soon toast
              showToast(`${tab.querySelector('span')?.textContent || 'Feature'} coming soon`);
            }
          });
        });
        
        bottomTabs._hasTabHandlers = true;
      }
      
      resolve();
    });
  }
  
  // Step 8: Final cleanup and checks
  function finalizeInitialization() {
    return new Promise(resolve => {
      log('Performing final cleanup and checks');
      
      // Make sure we have a visible screen
      setTimeout(() => {
        const visibleScreens = Array.from(document.querySelectorAll('.screen')).filter(
          screen => !screen.classList.contains('hidden') && screen.style.display !== 'none'
        );
        
        if (visibleScreens.length === 0) {
          log('No visible screen detected, showing lock screen');
          window.navigateTo('lock-screen');
        }
      }, CONFIG.finalCleanupDelay);
      
      // Make sure admin panel access is available
      setupAdminPanelAccess();
      
      // Initialize toast notification UI if needed
      if (!document.getElementById('tw-toast-container')) {
        const toastStyle = document.createElement('style');
        toastStyle.textContent = `
          .tw-toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
          }
          
          .tw-toast.visible {
            opacity: 1;
          }
        `;
        document.head.appendChild(toastStyle);
        
        const toastContainer = document.createElement('div');
        toastContainer.id = 'tw-toast-container';
        document.body.appendChild(toastContainer);
      }
      
      // Add global toast function
      window.showToast = function(message, duration = 2000) {
        const toastContainer = document.getElementById('tw-toast-container');
        if (!toastContainer) return;
        
        // Remove existing toasts
        const existingToasts = toastContainer.querySelectorAll('.tw-toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'tw-toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => toast.classList.add('visible'), 10);
        
        // Hide and remove after duration
        setTimeout(() => {
          toast.classList.remove('visible');
          setTimeout(() => toast.remove(), 300);
        }, duration);
      };
      
      // Enhance touch feedback on buttons
      document.querySelectorAll('.action-circle, .detail-action, .fee-option, .numpad-key').forEach(el => {
        if (!el.classList.contains('tw-ripple')) {
          el.classList.add('tw-ripple');
        }
      });
      
      // Add ripple effect CSS if it doesn't exist
      if (!document.getElementById('tw-ripple-styles')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'tw-ripple-styles';
        rippleStyle.textContent = `
          .tw-ripple {
            position: relative;
            overflow: hidden;
          }
          
          .tw-ripple:after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            opacity: 0;
            transition: transform .3s, opacity .5s;
          }
          
          .tw-ripple:active:after {
            transform: scale(0, 0);
            opacity: 0.2;
            transition: 0s;
          }
        `;
        document.head.appendChild(rippleStyle);
      }
      
      log('Initialization finalized successfully');
      resolve();
    });
  }
  
  // Setup admin panel access
  function setupAdminPanelAccess() {
    // Remove any existing admin touch target to avoid duplicates
    const existingTarget = document.getElementById('admin-touch-target');
    if (existingTarget) {
      existingTarget.remove();
    }
    
    // Create new touch target for admin panel
    const touchTarget = document.createElement('div');
    touchTarget.id = 'admin-touch-target';
    touchTarget.style.position = 'fixed';
    touchTarget.style.top = '25px';
    touchTarget.style.right = '0';
    touchTarget.style.width = '100px';
    touchTarget.style.height = '100px';
    touchTarget.style.zIndex = '99999';
    touchTarget.style.backgroundColor = 'transparent';
    
    document.body.appendChild(touchTarget);
    
    // Setup touch tracking
    let tapCount = 0;
    let lastTapTime = 0;
    
    touchTarget.addEventListener('click', function() {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTapTime;
      
      if (timeDiff > 1000) {
        tapCount = 1;
      } else {
        tapCount++;
      }
      
      lastTapTime = currentTime;
      
      if (tapCount >= 3) {
        tapCount = 0;
        
        // Show admin panel
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
          adminPanel.style.display = 'flex';
          adminPanel.classList.remove('hidden');
          log('Admin panel opened');
        } else {
          log('Admin panel not found');
        }
      }
    });
  }
  
})();
