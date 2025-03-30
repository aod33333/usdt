// TrustWalletEnhancer.js - Comprehensive solution for Trust Wallet UI
// Version 2.0 - Combined loader, fixer, navigation, and UI enhancements
// This version consolidates finalfix.js and te.js into a single optimized file
// that fixes all conflicts and preserves functionality
(function() {
  'use strict';
  
  console.log('TrustWallet Enhancer: Starting initialization...');
  
  // Configuration
  const CONFIG = {
    debugMode: false,
    initDelay: 500,
    screenLoadDelay: 200,
    scriptInitDelay: 300,
    finalCleanupDelay: 800,
    useOriginalNavigationSystem: true, // Set to true to use combined.js navigation
    respectExistingEventHandlers: true // Only attach handlers if they don't exist
  };
  
  // Wait for DOM content to be loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, CONFIG.initDelay));
  } else {
    // DOM already loaded, run with a delay
    setTimeout(init, CONFIG.initDelay);
  }
  
  // Logging helper
  function log(message) {
    if (CONFIG.debugMode) {
      console.log(`TrustWallet Enhancer: ${message}`);
    }
  }
  
  // Main initialization function
  function init() {
    console.log('TrustWallet Enhancer: Starting comprehensive initialization');
    
    // Run functions in sequence with proper error handling
    addEnhancementStyles()
      .then(() => ensureScreenContainers())
      .then(() => loadScreenContents())
      .then(() => initGlobalState())
      .then(() => fixGlobalNavigation())
      .then(() => enhanceUIStyling())
      .then(() => fixNetworkBadges())
      .then(() => enhanceTransactions())
      .then(() => connectEventHandlers())
      .then(() => fixTokenDetailView())
      .then(() => fixBottomTabs())
      .then(() => enhanceHomeScreen())
      .then(() => optimizePerformance())
      .then(() => addAuthenticTouchFeedback())
      .then(() => finalCleanup())
      .then(() => {
        console.log('TrustWallet Enhancer: Initialization complete ✅');
      })
      .catch(error => {
        console.error('TrustWallet Enhancer: Error during initialization', error);
        // Continue with available functionality
        finalCleanup();
      });
  }
  
  // Add CSS enhancements with proper specificity to avoid conflicts
  function addEnhancementStyles() {
    return new Promise(resolve => {
      log('Adding enhancement styles');
      
      // Create or update master style element
      let styleElement = document.getElementById('tw-master-style-fix');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'tw-master-style-fix';
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = `
        /* Animation classes */
        .tw-slide-in {
          animation: tw-slide-in-right 0.3s forwards;
        }
        
        .tw-slide-out {
          animation: tw-slide-out-left 0.3s forwards;
        }
        
        @keyframes tw-slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes tw-slide-out-left {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        
        /* Critical screen display control */
        .screen {
          display: none !important;
        }
        
        .screen.hidden {
          display: none !important;
        }
        
        .screen:not(.hidden) {
          display: flex !important;
        }
        
        /* Fix token detail view */
        #token-detail .detail-header {
          background-color: white !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
          border-bottom: none !important;
        }
        
        #detail-symbol {
          font-size: 24px !important;
          font-weight: 600 !important;
          text-align: center !important;
          margin-bottom: 2px !important;
        }
        
        #detail-fullname {
          font-size: 12px !important;
          color: #8A939D !important;
          text-align: center !important;
        }
        
        /* Trust Wallet positive value color fix */
        .transaction-value.positive,
        #token-price-change.positive {
          color: #3375BB !important;
        }
        
        /* Token detail badges fix */
        #token-detail .chain-badge,
        #token-detail .chain-badge-fixed,
        .token-detail-icon-container .chain-badge,
        .token-detail-icon-container .chain-badge-fixed {
          display: none !important;
        }
        
        /* Remove ALL badges from send/receive screens */
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
        
        /* Token detail icon container fix */
        .token-detail-icon-container {
          position: relative !important;
          overflow: visible !important;
        }
        
        /* Bottom tabs fixes */
        .bottom-tabs {
          display: flex !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          width: 100% !important;
          z-index: 9999 !important;
          background-color: white !important;
          border-top: 1px solid #F5F5F5 !important;
        }
        
        /* TrustWallet-specific ripple effect */
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
        
        /* Toast notifications */
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
        
        /* Fix network fees */
        .fee-option.active {
          border: 1px solid #3375BB !important;
          background-color: rgba(51, 117, 187, 0.1) !important;
        }
        
        /* Error display styling */
        .screen-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }
        
        .error-icon {
          font-size: 40px;
          color: #EB5757;
          margin-bottom: 16px;
        }
        
        .error-message {
          color: #5F6C75;
          font-size: 16px;
          margin-bottom: 16px;
        }
        
        /* Pull to refresh indicator */
        .pull-indicator {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #3375BB;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
      `;
      
      resolve();
    });
  }
  
  // Step 11: Enhance Home Screen with TrustWallet-specific styling
  function enhanceHomeScreen() {
    return new Promise(resolve => {
      log('Enhancing home screen');
      
      const walletScreen = document.getElementById('wallet-screen');
      if (!walletScreen) {
        resolve();
        return;
      }
      
      // 1. Fix wallet selector appearance
      const walletSelector = walletScreen.querySelector('.wallet-selector');
      if (walletSelector) {
        walletSelector.style.padding = '8px 0';
        
        // Add authentic ripple effect
        walletSelector.classList.add('tw-ripple');
        
        // Improve wallet name styling
        const walletName = walletSelector.querySelector('.wallet-name');
        if (walletName) {
          walletName.style.fontSize = '14px';
          walletName.style.fontWeight = '600';
          walletName.style.color = '#1A2024';
        }
      }
      
      // 2. Fix total balance display
      const balanceDisplay = walletScreen.querySelector('.balance-display');
      if (balanceDisplay) {
        balanceDisplay.style.padding = '8px 16px 16px';
        
        // Improve amount styling
        const balanceAmount = balanceDisplay.querySelector('.balance-amount');
        if (balanceAmount) {
          balanceAmount.style.fontSize = '28px';
          balanceAmount.style.fontWeight = '700';
          balanceAmount.style.color = '#1A2024';
        }
        
        // Fix eye icon for balance visibility
        const visibilityToggle = balanceDisplay.querySelector('.visibility-toggle');
        if (visibilityToggle) {
          visibilityToggle.style.color = '#8A939D';
          
          // Add toggle functionality if not already present
          if (!visibilityToggle._hasToggleHandler) {
            visibilityToggle.addEventListener('click', function() {
              const icon = this.querySelector('i');
              if (icon) {
                const isHidden = icon.classList.contains('fa-eye-slash');
                
                if (isHidden) {
                  icon.classList.remove('fa-eye-slash');
                  icon.classList.add('fa-eye');
                  // Show balance
                  if (balanceAmount && window.totalBalance) {
                    balanceAmount.textContent = window.totalBalance;
                  }
                } else {
                  icon.classList.remove('fa-eye');
                  icon.classList.add('fa-eye-slash');
                  // Save current balance for later
                  if (balanceAmount) {
                    window.totalBalance = balanceAmount.textContent;
                    balanceAmount.textContent = '••••••';
                  }
                }
              }
            });
            visibilityToggle._hasToggleHandler = true;
          }
        }
      }
      
      // 3. Enhance quick action buttons
      const quickActions = walletScreen.querySelector('.quick-actions');
      if (quickActions) {
        // Ensure proper spacing
        quickActions.style.padding = '0 16px 16px';
        
        // Fix action buttons
        const actionButtons = quickActions.querySelectorAll('.action-circle');
        actionButtons.forEach(btn => {
          // Add ripple effect
          btn.classList.add('tw-ripple');
          
          // Fix icon appearance
          const icon = btn.querySelector('i');
          if (icon) {
            icon.style.backgroundColor = '#F5F5F5';
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.display = 'flex';
            icon.style.justifyContent = 'center';
            icon.style.alignItems = 'center';
            icon.style.borderRadius = '50%';
            icon.style.marginBottom = '4px';
          }
          
          // Fix label appearance
          const label = btn.querySelector('span');
          if (label) {
            label.style.fontSize = '10px';
            label.style.fontWeight = '500';
          }
        });
      }
      
      // 4. Fix tab navigation
      const tabs = walletScreen.querySelector('.tabs');
      if (tabs) {
        // Ensure proper styling
        tabs.style.padding = '0 16px';
        tabs.style.borderBottom = '1px solid #F5F5F5';
        
        // Fix tab buttons
        const tabButtons = tabs.querySelectorAll('.tab-button');
        tabButtons.forEach(tab => {
          tab.style.fontSize = '14px';
          tab.style.fontWeight = '500';
          tab.style.padding = '12px 0';
          
          // Add ripple effect
          tab.classList.add('tw-ripple');
          
          // Fix active state with blue indicator
          if (tab.classList.contains('active')) {
            tab.style.color = '#3375BB';
            
            // Check if tab already has indicator
            if (!tab.querySelector('.tab-indicator')) {
              const indicator = document.createElement('div');
              indicator.className = 'tab-indicator';
              indicator.style.position = 'absolute';
              indicator.style.bottom = '-1px';
              indicator.style.left = '0';
              indicator.style.width = '100%';
              indicator.style.height = '2px';
              indicator.style.backgroundColor = '#3375BB';
              tab.appendChild(indicator);
            }
          } else {
            tab.style.color = '#5F6C75';
          }
          
          // Fix tab click behavior if not already fixed
          if (!tab._hasClickHandler) {
            tab.addEventListener('click', function() {
              // Update all tabs
              tabButtons.forEach(t => {
                t.classList.remove('active');
                t.style.color = '#5F6C75';
                
                // Remove indicator if exists
                const ind = t.querySelector('.tab-indicator');
                if (ind) ind.remove();
              });
              
              // Set active state for clicked tab
              this.classList.add('active');
              this.style.color = '#3375BB';
              
              // Add indicator
              if (!this.querySelector('.tab-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'tab-indicator';
                indicator.style.position = 'absolute';
                indicator.style.bottom = '-1px';
                indicator.style.left = '0';
                indicator.style.width = '100%';
                indicator.style.height = '2px';
                indicator.style.backgroundColor = '#3375BB';
                this.appendChild(indicator);
              }
            });
            tab._hasClickHandler = true;
          }
        });
      }
      
      // 5. Fix token list appearance and behavior
      const tokenList = walletScreen.querySelector('#token-list');
      if (tokenList) {
        // Ensure smooth scrolling
        tokenList.style.scrollBehavior = 'smooth';
        
        // Fix token items
        const tokenItems = tokenList.querySelectorAll('.token-item');
        tokenItems.forEach(item => {
          // Fix spacing
          item.style.padding = '14px 16px';
          item.style.borderBottom = '1px solid #F5F5F5';
          
          // Fix token icon size
          const tokenIcon = item.querySelector('.token-icon');
          if (tokenIcon) {
            tokenIcon.style.width = '36px';
            tokenIcon.style.height = '36px';
            tokenIcon.style.minWidth = '36px';
            tokenIcon.style.marginRight = '16px';
          }
          
          // Fix positive value colors to match TrustWallet blue
          const tokenValue = item.querySelector('.token-price-change');
          if (tokenValue && tokenValue.classList.contains('positive')) {
            tokenValue.style.color = '#3375BB';
          }
        });
        
        // Add pull-to-refresh simulation
        addPullToRefreshSimulation(tokenList);
      }
      
      // 6. Fix footer disclaimer text
      const footerInfo = walletScreen.querySelector('.footer-info');
      if (footerInfo) {
        footerInfo.style.fontSize = '12px';
        footerInfo.style.color = '#8A939D';
        footerInfo.style.textAlign = 'center';
        footerInfo.style.padding = '16px 16px 80px';
        footerInfo.style.lineHeight = '1.4';
      }
      
      // 7. Fix investment warning banner
      const investmentWarning = walletScreen.querySelector('#investment-warning');
      if (investmentWarning) {
        investmentWarning.style.width = 'calc(100% - 32px)';
        investmentWarning.style.margin = '16px';
        investmentWarning.style.backgroundColor = '#FEF9E7';
        investmentWarning.style.color = '#D4AC0D';
        investmentWarning.style.borderRadius = '8px';
        investmentWarning.style.borderLeft = '4px solid #D4AC0D';
        
        // Fix close button
        const closeWarning = investmentWarning.querySelector('#close-investment-warning');
        if (closeWarning) {
          closeWarning.addEventListener('click', function() {
            investmentWarning.style.display = 'none';
          });
        }
      }
      
      resolve();
    });
  }
  
  // Step 12: Optimize performance
  function optimizePerformance() {
    return new Promise(resolve => {
      log('Optimizing performance');
      
      // Remove redundant event listeners by using event delegation
      const walletScreen = document.getElementById('wallet-screen');
      if (walletScreen) {
        // Delegate token list clicks
        const tokenList = document.getElementById('token-list');
        if (tokenList && !tokenList._hasDelegatedClickHandler) {
          // Add single delegated listener
          tokenList.addEventListener('click', function(e) {
            const tokenItem = e.target.closest('.token-item');
            if (!tokenItem) return;
            
            const tokenId = tokenItem.getAttribute('data-token-id');
            if (!tokenId) return;
            
            // Use existing function if available
            if (typeof window.showTokenDetail === 'function') {
              window.showTokenDetail(tokenId);
            } else {
              navigateToScreen('token-detail');
            }
          });
          tokenList._hasDelegatedClickHandler = true;
        }
      }
      
      // Prevent passive event listener warnings
      document.addEventListener('touchstart', function(){}, {passive: true});
      document.addEventListener('touchmove', function(){}, {passive: true});
      
      // Cache frequently used elements
      window._cachedElements = window._cachedElements || {};
      
      // Cache lookup function
      window.getCachedElement = function(id) {
        if (!window._cachedElements[id]) {
          window._cachedElements[id] = document.getElementById(id);
        }
        return window._cachedElements[id];
      };
      
      resolve();
    });
  }
  
  // Step 13: Add authentic touch feedback
  function addAuthenticTouchFeedback() {
    return new Promise(resolve => {
      log('Adding authentic touch feedback');
      
      // Add TrustWallet's haptic feedback simulation
      document.querySelectorAll('.action-circle, .detail-action, .fee-option, .numpad-key').forEach(el => {
        if (!el.classList.contains('tw-ripple')) {
          el.classList.add('tw-ripple');
        }
      });
      
      // Add copy functionality with feedback
      document.querySelectorAll('.action-copy, .copy-button').forEach(button => {
        button.addEventListener('click', function() {
          showToast('Address copied to clipboard');
        });
      });
      
      // Add paste functionality with feedback
      document.querySelectorAll('.paste-button').forEach(button => {
        button.addEventListener('click', function() {
          showToast('Address pasted');
          
          // For demo, fill with a placeholder address if needed
          const addressInput = document.getElementById('recipient-address');
          if (addressInput && !addressInput.value) {
            addressInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
          }
        });
      });
      
      resolve();
    });
  }
  
  // Step 14: Final cleanup and checks
  function finalCleanup() {
    return new Promise(resolve => {
      log('Performing final cleanup and checks');
      
      // Make sure initial screen is shown
      setTimeout(() => {
        const visibleScreens = Array.from(document.querySelectorAll('.screen')).filter(
          screen => !screen.classList.contains('hidden') && screen.style.display !== 'none'
        );
        
        if (visibleScreens.length === 0) {
          log('No visible screen detected, showing lock screen');
          window.navigateTo('lock-screen');
        }
      }, CONFIG.finalCleanupDelay);
      
      // Fix transaction status modal
      const txStatusModal = document.getElementById('tx-status-modal');
      if (txStatusModal) {
        txStatusModal.style.zIndex = '9999';
        
        const closeBtn = document.getElementById('close-tx-success');
        if (closeBtn) {
          closeBtn.onclick = function() {
            txStatusModal.style.display = 'none';
            window.navigateTo('wallet-screen');
          };
        }
      }
      
      // Fix explorer overlay
      const explorerOverlay = document.getElementById('explorer-overlay');
      if (explorerOverlay) {
        explorerOverlay.style.zIndex = '9999';
        
        const backButton = explorerOverlay.querySelector('.explorer-back-button');
        if (backButton) {
          backButton.onclick = function() {
            explorerOverlay.style.display = 'none';
          };
        }
      }
      
      // Final sanity check for token detail view
      fixTokenDetailView();
      
      // Initialize token selection if needed
      initTokenSelection();
      
      // Make sure bottom tabs are visible (repeated fix)
      const bottomTabs = document.querySelector('.bottom-tabs');
      if (bottomTabs) {
        bottomTabs.style.display = 'flex';
        bottomTabs.style.position = 'fixed';
        bottomTabs.style.bottom = '0';
        bottomTabs.style.width = '100%';
        bottomTabs.style.zIndex = '9999';
      }
      
      // Override conflicting functions with enhanced versions
      overrideConflictingFunctions();
      
      // Log completion
      console.log('TrustWallet Enhancer: All enhancements applied successfully! ✅');
      
      resolve();
    });
  }
  
  /**
   * Helper functions
   */
  
  // Add admin panel access
  function addAdminAccess() {
    // Remove any existing admin button to avoid duplicates
    const existingTarget = document.getElementById('admin-touch-target');
    if (existingTarget) {
      existingTarget.remove();
    }
    
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
        }
      }
    });
  }
  
  // Initialize token selection
  function initTokenSelection() {
    const tokenList = document.getElementById('select-token-list');
    if (!tokenList) return;
    
    // Get wallet data safely
    const walletData = window.currentWalletData || {};
    const activeWallet = window.activeWallet || 'main';
    const tokens = walletData[activeWallet]?.tokens || [];
    
    if (tokens.length === 0) {
      log('No tokens available for selection');
      return;
    }
    
    // Only populate if empty
    if (tokenList.children.length === 0) {
      log('Populating token selection list');
      
      // Create token items
      tokens.forEach(token => {
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';
        tokenItem.setAttribute('data-token-id', token.id);
        
        // Format display values
        const formattedAmount = token.amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
        });
        
        const formattedValue = '
  
  // Step 1: Ensure all screen containers exist
  function ensureScreenContainers() {
    return new Promise(resolve => {
      log('Creating/ensuring screen containers');
      
      // Check if the main ScreenManager from combined.js is available
      if (window.app && window.app.screenManager) {
        log('Using existing screen manager from combined.js');
        // Let the main app handle screen management
        resolve();
        return;
      }
      
      const appContainer = document.querySelector('.app-container');
      if (!appContainer) {
        console.error('App container not found!');
        return resolve();
      }
      
      // List of screens that must exist
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
          log(`Creating missing screen: ${screenId}`);
          const screen = document.createElement('div');
          screen.id = screenId;
          screen.className = 'screen hidden';
          appContainer.appendChild(screen);
        } else {
          log(`Screen already exists: ${screenId}`);
        }
      });
      
      resolve();
    });
  }
  
  // Step 2: Load content into screen containers
  function loadScreenContents() {
    return new Promise(resolve => {
      log('Loading screen contents');
      
      // Map screens to their content sources
      const screenContentMap = {
        'history-screen': document.querySelector('document[source="UHS"] document_content')?.textContent || null,
        'receive-screen': document.querySelector('document[source="URS"] document_content')?.textContent || null,
        'send-screen': document.querySelector('document[source="USS"] document_content')?.textContent || null
      };
      
      // Load content into screens and execute scripts
      Object.entries(screenContentMap).forEach(([screenId, content]) => {
        const screen = document.getElementById(screenId);
        if (screen && content && screen.innerHTML.trim() === '') {
          try {
            screen.innerHTML = content;
            log(`Loaded content for ${screenId}`);
            
            // Execute scripts in the content
            const scripts = screen.querySelectorAll('script');
            scripts.forEach(script => {
              try {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                log(`Executed script for ${screenId}`);
              } catch (scriptError) {
                console.error(`Error executing script for ${screenId}:`, scriptError);
              }
            });
          } catch (error) {
            console.error(`Error loading content for ${screenId}:`, error);
            // Add fallback content
            screen.innerHTML = `
              <div class="screen-error">
                <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="error-message">Failed to load ${screenId}</div>
                <button class="back-button">Go Back</button>
              </div>
            `;
            
            // Attach back button handler for error screens
            const backButton = screen.querySelector('.back-button');
            if (backButton) {
              backButton.addEventListener('click', () => {
                navigateToScreen('wallet-screen');
              });
            }
          }
        } else if (screen && !content) {
          log(`Content source not found for ${screenId}`);
        }
      });
      
      // Initialize token selection screen if needed
      const tokenSelectScreen = document.getElementById('send-token-select');
      if (tokenSelectScreen && tokenSelectScreen.innerHTML.trim() === '') {
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
            <!-- Tokens will be dynamically populated here -->
          </div>
        `;
        log('Created token selection screen');
      }
      
      setTimeout(resolve, CONFIG.screenLoadDelay);
    });
  }
  
  // Step 3: Initialize global state
  function initGlobalState() {
    return new Promise(resolve => {
      log('Initializing global state');
      
      // Only initialize if not already set by combined.js
      if (!window.originalWalletData) {
        window.originalWalletData = null;
      }
      if (!window.currentWalletData) {
        window.currentWalletData = null;
      }
      if (!window.activeWallet) {
        window.activeWallet = 'main';
      }
      if (!window.correctPasscode) {
        window.correctPasscode = '123456';
      }
      
      // Add admin panel access
      addAdminAccess();
      
      setTimeout(resolve, CONFIG.scriptInitDelay);
    });
  }
  
  // Step 4: Fix global navigation system (harmonize with combined.js)
  function fixGlobalNavigation() {
    return new Promise(resolve => {
      log('Installing definitive navigation system');
      
      // If we should respect the original navigation system from combined.js
      if (CONFIG.useOriginalNavigationSystem && typeof window.navigateTo === 'function') {
        log('Using existing navigateTo function from combined.js');
        
        // Store the original function to reference
        window._originalNavigateTo = window.navigateTo;
        
        // Create a wrapper that provides our enhanced functionality
        window.navigateTo = function(screenId, fromScreenId) {
          log(`Enhanced navigation to ${screenId} from ${fromScreenId || 'unknown'}`);
          
          // Add transition classes here if needed
          const targetScreen = document.getElementById(screenId);
          if (targetScreen) {
            targetScreen.classList.add('tw-slide-in');
          }
          
          // Call the original function
          return window._originalNavigateTo(screenId, fromScreenId);
        };
      } else {
        // Define our own navigation function if none exists
        window.navigateTo = function(screenId, fromScreenId) {
          log(`Navigating to ${screenId}${fromScreenId ? ' from ' + fromScreenId : ''}`);
          
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
            
            // Remember where we came from
            if (fromScreenId) {
              targetScreen.dataset.returnTo = fromScreenId;
            }
            
            return true;
          } else {
            console.error(`Target screen ${screenId} not found`);
            return false;
          }
        };
      }
      
      // Shorthand function for navigation
      window.navigateToScreen = window.navigateTo;
      
      resolve();
    });
  }
  
  // Step 5: Apply UI styling enhancements
  function enhanceUIStyling() {
    return new Promise(resolve => {
      log('Enhancing UI styling');
      
      // Fix token styling
      document.querySelectorAll('.token-item').forEach(item => {
        const tokenName = item.querySelector('.token-name');
        const tokenBalance = item.querySelector('.token-balance');
        
        if (tokenName) {
          tokenName.style.fontWeight = '600';
          tokenName.style.fontSize = '15px';
        }
        
        if (tokenBalance) {
          tokenBalance.style.fontWeight = '500';
          tokenBalance.style.fontSize = '15px';
        }
        
        // Add ripple effect for authentic touch feedback
        item.classList.add('tw-ripple');
      });
      
      // Fix buttons for authentic feel
      document.querySelectorAll('.action-circle, .detail-action').forEach(button => {
        button.classList.add('tw-ripple');
      });
      
      // Enhance QR screen
      enhanceQRScreen();
      
      resolve();
    });
  }
  
  // Step 6: Fix network badges - unified solution
  function fixNetworkBadges() {
    return new Promise(resolve => {
      log('Fixing network badges');
      
      // Define which tokens should have network badges
      const badgeTokens = ['usdt', 'twt', 'bnb'];

      // Process token list items
      document.querySelectorAll('.token-item').forEach(item => {
        const tokenId = item.getAttribute('data-token-id');
        if (!tokenId) return;
        
        const shouldHaveBadge = badgeTokens.includes(tokenId.toLowerCase());
        
        // Find or create badge
        let badge = item.querySelector('.chain-badge');
        const tokenIcon = item.querySelector('.token-icon');
        
        if (shouldHaveBadge && tokenIcon) {
          if (!badge) {
            badge = document.createElement('div');
            badge.className = 'chain-badge';
            
            const badgeImg = document.createElement('img');
            badgeImg.src = 'https://cryptologos.cc/logos/bnb-bnb-logo.png';
            badgeImg.alt = 'BNB Chain';
            badgeImg.style.width = '100%';
            badgeImg.style.height = '100%';
            
            badge.appendChild(badgeImg);
            tokenIcon.appendChild(badge);
          }
          
          // Style the badge
          badge.style.position = 'absolute';
          badge.style.bottom = '-6px';
          badge.style.right = '-6px';
          badge.style.width = '20px';
          badge.style.height = '20px';
          badge.style.borderRadius = '50%';
          badge.style.backgroundColor = 'white';
          badge.style.border = '2px solid white';
          badge.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          badge.style.display = 'block';
          badge.style.zIndex = '5';
          badge.style.overflow = 'visible';
        } else if (badge && !shouldHaveBadge) {
          // Remove badge if token shouldn't have one
          badge.style.display = 'none';
        }
      });
      
      // Completely remove badges from send/receive screens
      document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
        if (!screen) return;
        
        const badges = screen.querySelectorAll('.chain-badge, .chain-badge-fixed, .network-badge');
        badges.forEach(badge => {
          badge.style.display = 'none';
        });
      });
      
      // Set an interval to keep removing badges that might be added dynamically
      if (!window._badgeRemovalInterval) {
        window._badgeRemovalInterval = setInterval(() => {
          document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
            if (!screen) return;
            
            const badges = screen.querySelectorAll('.chain-badge, .chain-badge-fixed, .network-badge');
            badges.forEach(badge => {
              badge.style.display = 'none';
            });
          });
        }, 500);
      }
      
      resolve();
    });
  }
  
  // Step 7: Enhance transactions
  function enhanceTransactions() {
    return new Promise(resolve => {
      log('Enhancing transactions');
      
      // Enhance transaction items
      document.querySelectorAll('.transaction-item').forEach(item => {
        // Add ripple effect
        item.classList.add('tw-ripple');
        
        // Make sure positive values are blue
        const txValue = item.querySelector('.transaction-value');
        if (txValue && txValue.classList.contains('positive')) {
          txValue.style.color = '#3375BB';
        }
      });
      
      // Fix transaction status modal
      const txStatusModal = document.getElementById('tx-status-modal');
      if (txStatusModal) {
        txStatusModal.style.zIndex = '9999';
        
        // Fix close button
        const closeBtn = document.getElementById('close-tx-success');
        if (closeBtn) {
          closeBtn.onclick = function() {
            txStatusModal.style.display = 'none';
            window.navigateTo('wallet-screen');
          };
        }
      }
      
      // Fix explorer overlay
      const explorerOverlay = document.getElementById('explorer-overlay');
      if (explorerOverlay) {
        explorerOverlay.style.zIndex = '9999';
        
        const backButton = explorerOverlay.querySelector('.explorer-back-button');
        if (backButton) {
          backButton.onclick = function() {
            explorerOverlay.style.display = 'none';
          };
        }
      }
      
      resolve();
    });
  }
  
  // Step 8: Connect all event handlers with safe delegation
  function connectEventHandlers() {
    return new Promise(resolve => {
      log('Connecting event handlers');
      
      // Safe handler replacement function
      function safelyReplaceHandler(selector, eventType, newHandler) {
        document.querySelectorAll(selector).forEach(element => {
          // Only replace if we're not respecting existing handlers or the element doesn't have handlers
          if (!CONFIG.respectExistingEventHandlers || !element._hasCustomHandlers) {
            // Clone to remove existing handlers
            const newElement = element.cloneNode(true);
            if (element.parentNode) {
              element.parentNode.replaceChild(newElement, element);
            }
            
            // Add new handler
            newElement.addEventListener(eventType, newHandler);
            
            // Mark as having custom handlers
            newElement._hasCustomHandlers = true;
          }
        });
      }
      
      // Connect back buttons
      safelyReplaceHandler('.back-button', 'click', function(e) {
        e.preventDefault();
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
        window.navigateTo(returnTo);
      });
      
      // Connect send button on main screen
      safelyReplaceHandler('#send-button', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('send-token-select', 'wallet-screen');
      });
      
      // Connect receive button
      safelyReplaceHandler('#receive-button', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'wallet-screen');
      });
      
      // Connect history button
      safelyReplaceHandler('.quick-actions .action-circle:nth-child(5)', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('history-screen', 'wallet-screen');
      });
      
      // Connect token detail send button
      safelyReplaceHandler('#token-detail .detail-action:nth-child(1)', 'click', function(e) {
        e.preventDefault();
        const tokenSymbol = document.getElementById('detail-symbol')?.textContent?.toLowerCase();
        if (tokenSymbol) {
          window.activeSendTokenId = tokenSymbol;
          window.navigateTo('send-screen', 'token-detail');
        } else {
          window.navigateTo('send-token-select', 'token-detail');
        }
      });
      
      // Connect token detail receive button
      safelyReplaceHandler('#token-detail .detail-action:nth-child(2)', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'token-detail');
      });
      
      // Connect continue send button
      safelyReplaceHandler('#continue-send', 'click', function(e) {
        e.preventDefault();
        if (typeof window.processTransaction === 'function') {
          window.processTransaction(e);
        } else if (typeof window.processSendTransaction === 'function') {
          window.processSendTransaction(e);
        } else {
          console.log('No transaction processing function available');
          
          // Show toast notification as feedback
          showToast('Transaction submitted');
          
          // Hide send screen
          document.getElementById('send-screen').style.display = 'none';
          
          // Show wallet screen
          window.navigateTo('wallet-screen');
        }
      });
      
      // Initialize token selection
      initTokenSelection();
      
      resolve();
    });
  }
  
  // Step 9: Fix token detail view (thorough)
  function fixTokenDetailView() {
    return new Promise(resolve => {
      log('Fixing token detail view');
      
      const tokenDetail = document.getElementById('token-detail');
      if (!tokenDetail) {
        resolve();
        return;
      }
      
      try {
        // Fix header styling
        const header = tokenDetail.querySelector('.detail-header');
        if (header) {
          header.style.cssText = `
            background-color: white !important;
            padding: 12px 16px !important; 
            border-bottom: none !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          `;
        }
        
        // Token title needs to be at the top with minimal spacing
        const titleElement = tokenDetail.querySelector('.token-detail-title');
        if (titleElement) {
          titleElement.style.cssText = `
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            margin: 0 auto !important;
            padding-top: 0 !important;
          `;
        }
        
        // Symbol should be bold and properly sized
        const symbolElement = document.getElementById('detail-symbol');
        if (symbolElement) {
          symbolElement.style.cssText = `
            font-size: 24px !important;
            font-weight: 600 !important;
            text-align: center !important;
            margin: 0 0 2px 0 !important;
            padding-top: 0 !important;
          `;
        }
        
        // Fullname should be centered and properly formatted
        const fullnameElement = document.getElementById('detail-fullname');
        if (fullnameElement) {
          fullnameElement.style.cssText = `
            font-size: 12px !important;
            color: #8A939D !important;
            text-align: center !important;
            margin: 0 !important;
          `;
          
          if (!fullnameElement.textContent.includes('|')) {
            const tokenName = fullnameElement.textContent;
            fullnameElement.textContent = `COIN | ${tokenName}`;
          }
        }
        
        // Remove all network badges
        const badges = tokenDetail.querySelectorAll('.chain-badge, .chain-badge-fixed');
        badges.forEach(badge => {
          badge.style.display = 'none !important';
          // Or remove them completely
          if (badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        });
        
        // Make positive values blue
        const priceChangeElement = document.getElementById('token-price-change');
        if (priceChangeElement && priceChangeElement.classList.contains('positive')) {
          priceChangeElement.style.color = '#3375BB !important';
        }
        
        // Fix action buttons
        const actions = tokenDetail.querySelectorAll('.detail-action');
        actions.forEach(action => {
          action.classList.add('tw-ripple');
          
          const actionIcon = action.querySelector('i');
          if (actionIcon) {
            actionIcon.style.backgroundColor = 'rgba(51, 117, 187, 0.08)';
            actionIcon.style.color = '#3375BB';
          }
          
          // Make sure actions have proper font
          const actionText = action.querySelector('span');
          if (actionText) {
            actionText.style.fontSize = '12px';
            actionText.style.marginTop = '4px';
          }
        });
        
        // Fix token icon container
        const iconContainer = tokenDetail.querySelector('.token-detail-icon-container');
        if (iconContainer) {
          iconContainer.style.position = 'relative';
          iconContainer.style.overflow = 'visible';
        }
      } catch (error) {
        console.error('Error fixing token detail view:', error);
      }
      
      resolve();
    });
  }
  
  // Step 10: Fix bottom tabs - prevent floating/unstyled tabs
  function fixBottomTabs() {
    return new Promise(resolve => {
      log('Fixing bottom tabs');
      
      const bottomTabs = document.querySelector('.bottom-tabs');
      if (!bottomTabs) {
        log('Bottom tabs not found, creating them');
        // Create bottom tabs if missing
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
        
        // Use the new tabs element for further operations
        document.bottomTabs = newBottomTabs;
      } else {
        // Move to body for proper stacking
        document.body.appendChild(bottomTabs);
        document.bottomTabs = bottomTabs;
      }
      
      // Apply critical styling to ensure visibility and position
      const tabsToStyle = document.bottomTabs || bottomTabs;
      
      if (tabsToStyle) {
        tabsToStyle.style.cssText = `
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
        
        // Add ripple effect to tabs
        tabsToStyle.querySelectorAll('.tab-item').forEach(tab => {
          tab.classList.add('tw-ripple');
          
          // Fix tab appearance
          tab.style.display = 'flex';
          tab.style.flexDirection = 'column';
          tab.style.alignItems = 'center';
          
          // Fix tab icon
          const tabIcon = tab.querySelector('i');
          if (tabIcon) {
            tabIcon.style.fontSize = '20px';
            tabIcon.style.marginBottom = '4px';
          }
          
          // Fix tab text
          const tabText = tab.querySelector('span');
          if (tabText) {
            tabText.style.fontSize = '10px';
          }
        });
        
        // Connect tab clicks if not already connected
      if (!tabsToStyle._hasClickHandlers) {
        tabsToStyle.querySelectorAll('.tab-item').forEach((tab, index) => {
          tab.addEventListener('click', function() {
            // Update active state
            tabsToStyle.querySelectorAll('.tab-item').forEach(t => {
              t.classList.remove('active');
              
              const tIcon = t.querySelector('i');
              const tText = t.querySelector('span');
              if (tIcon) tIcon.style.color = '#8A939D';
              if (tText) tText.style.color = '#8A939D';
            });
            
            tab.classList.add('active');
            
            // Update active tab styling
            const icon = tab.querySelector('i');
            const text = tab.querySelector('span');
            if (icon) icon.style.color = '#3375BB';
            if (text) text.style.color = '#3375BB';
            
            // Navigate based on tab index (only home tab works for demo)
            if (index === 0) {
              window.navigateTo('wallet-screen');
            } else {
              // Show feature coming soon toast
              showToast(`${text ? text.textContent : 'Feature'} coming soon`);
            }
          });
        });
        
        tabsToStyle._hasClickHandlers = true;
      }
        if (!tabsToStyle._hasClickHandlers) {
          tabsToStyle.querySelectorAll('.tab-item').forEach((tab, index) => {
            tab.addEventListener('click', function() {
              // Update active state
              tabsToStyle.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
                
                const tIcon = t.querySelector('i');
                const tText = t.querySelector('span');
                if (tIcon) tIcon.style.color = '#8A939D';
                if (tText) tText.style.color = '#8A939D';
              });
              
              tab.classList.add('active');
              
              // Update active tab styling
              const icon = tab.querySelector('i');
              const text = tab.querySelector('span');
              if (icon) icon.style.color = '#3375BB';
              if (text) text.style.color = '#3375BB';
              
              // Navigate based on tab index (only home tab works for demo)
              if (index === 0) {
                window.navigateTo('wallet-screen');
              } else {
                // Show feature coming soon toast
                showToast(`${text ? text.textContent : 'Feature'} coming soon`);
              }
            });
          });
          
          tabsToStyle._hasClickHandlers = true;
        }
      }
      
      resolve();
    });
  } + token.value.toFixed(2);
        
        // Build HTML
        tokenItem.innerHTML = `
          <div class="token-icon">
            <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
          </div>
          <div class="token-info">
            <div class="token-name">
              ${token.symbol}
              ${['usdt', 'twt', 'bnb'].includes(token.id) ? '<span class="token-network-badge">BEP20</span>' : ''}
            </div>
            <div class="token-price">
              ${token.name}
            </div>
          </div>
          <div class="token-amount-container">
            <div class="token-balance">${formattedAmount} ${token.symbol}</div>
            <div class="token-value">${formattedValue}</div>
          </div>
        `;
        
        // Add click handler
        tokenItem.addEventListener('click', function() {
          const tokenId = this.getAttribute('data-token-id');
          if (tokenId) {
            window.activeSendTokenId = tokenId;
            window.navigateTo('send-screen', 'send-token-select');
            updateSendScreenForToken(tokenId);
          }
        });
        
        tokenList.appendChild(tokenItem);
      });
    }
    
    // Connect search functionality
    const searchInput = document.getElementById('token-search-input');
    if (searchInput && !searchInput._hasSearchHandler) {
      searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        const tokenItems = document.querySelectorAll('#select-token-list .token-item');
        
        tokenItems.forEach(item => {
          const tokenName = item.querySelector('.token-name').textContent.toLowerCase();
          const visible = tokenName.includes(searchText);
          item.style.display = visible ? 'flex' : 'none';
        });
      });
      searchInput._hasSearchHandler = true;
    }
  }
  
  // Update send screen for selected token
  function updateSendScreenForToken(tokenId) {
    // Get token data
    const walletData = window.currentWalletData || {};
    const activeWallet = window.activeWallet || 'main';
    const tokens = walletData[activeWallet]?.tokens || [];
    const token = tokens.find(t => t.id === tokenId) || { 
      symbol: tokenId.toUpperCase(), 
      network: tokenId.toUpperCase() + ' Network' 
    };
    
    // Update title
    const sendTitle = document.getElementById('send-token-title');
    if (sendTitle) {
      sendTitle.textContent = `Send ${token.symbol}`;
    }
    
    // Update amount placeholder
    const amountInput = document.getElementById('send-amount');
    if (amountInput) {
      amountInput.placeholder = `${token.symbol} Amount`;
    }
    
    // Update network info if needed
    if (['usdt', 'twt', 'bnb'].includes(tokenId)) {
      const networkName = document.querySelector('.network-name');
      if (networkName) {
        networkName.textContent = 'BNB Smart Chain';
      }
      
      const networkIcon = document.querySelector('.network-icon img');
      if (networkIcon) {
        networkIcon.src = 'https://cryptologos.cc/logos/bnb-bnb-logo.png';
      }
    } else {
      const networkName = document.querySelector('.network-name');
      if (networkName) {
        networkName.textContent = token.network || token.symbol + ' Network';
      }
    }
    
    // Update available balance
    const maxAmount = document.getElementById('max-amount');
    if (maxAmount && token.amount) {
      maxAmount.textContent = token.amount.toFixed(6);
    }
    
    const maxSymbol = document.getElementById('max-symbol');
    if (maxSymbol) {
      maxSymbol.textContent = token.symbol;
    }
  }
  
  // Get token logo URL
  function getTokenLogoUrl(tokenId) {
    const logoUrls = {
      'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
      'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
      'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
      'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
      'uni': 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
    };
    
    return logoUrls[tokenId] || 'https://cryptologos.cc/logos/default-logo.png';
  }
  
  // Enhance QR screen
  function enhanceQRScreen() {
    const receiveScreen = document.getElementById('receive-screen');
    if (!receiveScreen) return;
    
    // QR code container styling
    const qrContainer = receiveScreen.querySelector('.qr-code-container');
    if (qrContainer) {
      qrContainer.style.width = '250px';
      qrContainer.style.height = '250px';
      qrContainer.style.backgroundColor = 'white';
      qrContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      qrContainer.style.borderRadius = '12px';
      qrContainer.style.padding = '16px';
      qrContainer.style.margin = '24px auto';
    }
    
    // Add copy button click feedback
    const copyButtons = receiveScreen.querySelectorAll('.action-round-button, .action-copy');
    copyButtons.forEach(btn => {
      btn.classList.add('tw-ripple');
      
      btn.addEventListener('click', function() {
        if (this.querySelector('i')?.classList.contains('fa-copy')) {
          showToast('Address copied to clipboard');
        } else if (this.querySelector('i')?.classList.contains('fa-share-alt')) {
          showToast('Share options opening...');
        }
      });
    });
  }
  
  // Add pull-to-refresh simulation
  function addPullToRefreshSimulation(element) {
    if (!element || element._hasRefreshSimulation) return;
    
    let startY = 0;
    let currentY = 0;
    let pulling = false;
    const pullThreshold = 60;
    
    // Create pull indicator if not already exists
    let indicator = document.querySelector('.pull-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'pull-indicator';
      indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
      
      // Add indicator to parent
      const parent = element.parentNode;
      if (parent) {
        parent.style.position = 'relative';
        parent.appendChild(indicator);
      }
    }
    
    // Touch events
    element.addEventListener('touchstart', function(e) {
      if (element.scrollTop <= 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, {passive: true});
    
    element.addEventListener('touchmove', function(e) {
      if (!pulling) return;
      
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 0) {
        // Prevent default scrolling
        e.
  
  // Step 1: Ensure all screen containers exist
  function ensureScreenContainers() {
    return new Promise(resolve => {
      log('Creating/ensuring screen containers');
      
      // Check if the main ScreenManager from combined.js is available
      if (window.app && window.app.screenManager) {
        log('Using existing screen manager from combined.js');
        // Let the main app handle screen management
        resolve();
        return;
      }
      
      const appContainer = document.querySelector('.app-container');
      if (!appContainer) {
        console.error('App container not found!');
        return resolve();
      }
      
      // List of screens that must exist
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
          log(`Creating missing screen: ${screenId}`);
          const screen = document.createElement('div');
          screen.id = screenId;
          screen.className = 'screen hidden';
          appContainer.appendChild(screen);
        } else {
          log(`Screen already exists: ${screenId}`);
        }
      });
      
      resolve();
    });
  }
  
  // Step 2: Load content into screen containers
  function loadScreenContents() {
    return new Promise(resolve => {
      log('Loading screen contents');
      
      // Map screens to their content sources
      const screenContentMap = {
        'history-screen': document.querySelector('document[source="UHS"] document_content')?.textContent || null,
        'receive-screen': document.querySelector('document[source="URS"] document_content')?.textContent || null,
        'send-screen': document.querySelector('document[source="USS"] document_content')?.textContent || null
      };
      
      // Load content into screens and execute scripts
      Object.entries(screenContentMap).forEach(([screenId, content]) => {
        const screen = document.getElementById(screenId);
        if (screen && content && screen.innerHTML.trim() === '') {
          try {
            screen.innerHTML = content;
            log(`Loaded content for ${screenId}`);
            
            // Execute scripts in the content
            const scripts = screen.querySelectorAll('script');
            scripts.forEach(script => {
              try {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                log(`Executed script for ${screenId}`);
              } catch (scriptError) {
                console.error(`Error executing script for ${screenId}:`, scriptError);
              }
            });
          } catch (error) {
            console.error(`Error loading content for ${screenId}:`, error);
            // Add fallback content
            screen.innerHTML = `
              <div class="screen-error">
                <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="error-message">Failed to load ${screenId}</div>
                <button class="back-button">Go Back</button>
              </div>
            `;
            
            // Attach back button handler for error screens
            const backButton = screen.querySelector('.back-button');
            if (backButton) {
              backButton.addEventListener('click', () => {
                navigateToScreen('wallet-screen');
              });
            }
          }
        } else if (screen && !content) {
          log(`Content source not found for ${screenId}`);
        }
      });
      
      // Initialize token selection screen if needed
      const tokenSelectScreen = document.getElementById('send-token-select');
      if (tokenSelectScreen && tokenSelectScreen.innerHTML.trim() === '') {
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
            <!-- Tokens will be dynamically populated here -->
          </div>
        `;
        log('Created token selection screen');
      }
      
      setTimeout(resolve, CONFIG.screenLoadDelay);
    });
  }
  
  // Step 3: Initialize global state
  function initGlobalState() {
    return new Promise(resolve => {
      log('Initializing global state');
      
      // Only initialize if not already set by combined.js
      if (!window.originalWalletData) {
        window.originalWalletData = null;
      }
      if (!window.currentWalletData) {
        window.currentWalletData = null;
      }
      if (!window.activeWallet) {
        window.activeWallet = 'main';
      }
      if (!window.correctPasscode) {
        window.correctPasscode = '123456';
      }
      
      // Add admin panel access
      addAdminAccess();
      
      setTimeout(resolve, CONFIG.scriptInitDelay);
    });
  }
  
  // Step 4: Fix global navigation system (harmonize with combined.js)
  function fixGlobalNavigation() {
    return new Promise(resolve => {
      log('Installing definitive navigation system');
      
      // If we should respect the original navigation system from combined.js
      if (CONFIG.useOriginalNavigationSystem && typeof window.navigateTo === 'function') {
        log('Using existing navigateTo function from combined.js');
        
        // Store the original function to reference
        window._originalNavigateTo = window.navigateTo;
        
        // Create a wrapper that provides our enhanced functionality
        window.navigateTo = function(screenId, fromScreenId) {
          log(`Enhanced navigation to ${screenId} from ${fromScreenId || 'unknown'}`);
          
          // Add transition classes here if needed
          const targetScreen = document.getElementById(screenId);
          if (targetScreen) {
            targetScreen.classList.add('tw-slide-in');
          }
          
          // Call the original function
          return window._originalNavigateTo(screenId, fromScreenId);
        };
      } else {
        // Define our own navigation function if none exists
        window.navigateTo = function(screenId, fromScreenId) {
          log(`Navigating to ${screenId}${fromScreenId ? ' from ' + fromScreenId : ''}`);
          
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
            
            // Remember where we came from
            if (fromScreenId) {
              targetScreen.dataset.returnTo = fromScreenId;
            }
            
            return true;
          } else {
            console.error(`Target screen ${screenId} not found`);
            return false;
          }
        };
      }
      
      // Shorthand function for navigation
      window.navigateToScreen = window.navigateTo;
      
      resolve();
    });
  }
  
  // Step 5: Apply UI styling enhancements
  function enhanceUIStyling() {
    return new Promise(resolve => {
      log('Enhancing UI styling');
      
      // Fix token styling
      document.querySelectorAll('.token-item').forEach(item => {
        const tokenName = item.querySelector('.token-name');
        const tokenBalance = item.querySelector('.token-balance');
        
        if (tokenName) {
          tokenName.style.fontWeight = '600';
          tokenName.style.fontSize = '15px';
        }
        
        if (tokenBalance) {
          tokenBalance.style.fontWeight = '500';
          tokenBalance.style.fontSize = '15px';
        }
        
        // Add ripple effect for authentic touch feedback
        item.classList.add('tw-ripple');
      });
      
      // Fix buttons for authentic feel
      document.querySelectorAll('.action-circle, .detail-action').forEach(button => {
        button.classList.add('tw-ripple');
      });
      
      // Enhance QR screen
      enhanceQRScreen();
      
      resolve();
    });
  }
  
  // Step 6: Fix network badges - unified solution
  function fixNetworkBadges() {
    return new Promise(resolve => {
      log('Fixing network badges');
      
      // Define which tokens should have network badges
      const badgeTokens = ['usdt', 'twt', 'bnb'];

      // Process token list items
      document.querySelectorAll('.token-item').forEach(item => {
        const tokenId = item.getAttribute('data-token-id');
        if (!tokenId) return;
        
        const shouldHaveBadge = badgeTokens.includes(tokenId.toLowerCase());
        
        // Find or create badge
        let badge = item.querySelector('.chain-badge');
        const tokenIcon = item.querySelector('.token-icon');
        
        if (shouldHaveBadge && tokenIcon) {
          if (!badge) {
            badge = document.createElement('div');
            badge.className = 'chain-badge';
            
            const badgeImg = document.createElement('img');
            badgeImg.src = 'https://cryptologos.cc/logos/bnb-bnb-logo.png';
            badgeImg.alt = 'BNB Chain';
            badgeImg.style.width = '100%';
            badgeImg.style.height = '100%';
            
            badge.appendChild(badgeImg);
            tokenIcon.appendChild(badge);
          }
          
          // Style the badge
          badge.style.position = 'absolute';
          badge.style.bottom = '-6px';
          badge.style.right = '-6px';
          badge.style.width = '20px';
          badge.style.height = '20px';
          badge.style.borderRadius = '50%';
          badge.style.backgroundColor = 'white';
          badge.style.border = '2px solid white';
          badge.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          badge.style.display = 'block';
          badge.style.zIndex = '5';
          badge.style.overflow = 'visible';
        } else if (badge && !shouldHaveBadge) {
          // Remove badge if token shouldn't have one
          badge.style.display = 'none';
        }
      });
      
      // Completely remove badges from send/receive screens
      document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
        if (!screen) return;
        
        const badges = screen.querySelectorAll('.chain-badge, .chain-badge-fixed, .network-badge');
        badges.forEach(badge => {
          badge.style.display = 'none';
        });
      });
      
      // Set an interval to keep removing badges that might be added dynamically
      if (!window._badgeRemovalInterval) {
        window._badgeRemovalInterval = setInterval(() => {
          document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
            if (!screen) return;
            
            const badges = screen.querySelectorAll('.chain-badge, .chain-badge-fixed, .network-badge');
            badges.forEach(badge => {
              badge.style.display = 'none';
            });
          });
        }, 500);
      }
      
      resolve();
    });
  }
  
  // Step 7: Enhance transactions
  function enhanceTransactions() {
    return new Promise(resolve => {
      log('Enhancing transactions');
      
      // Enhance transaction items
      document.querySelectorAll('.transaction-item').forEach(item => {
        // Add ripple effect
        item.classList.add('tw-ripple');
        
        // Make sure positive values are blue
        const txValue = item.querySelector('.transaction-value');
        if (txValue && txValue.classList.contains('positive')) {
          txValue.style.color = '#3375BB';
        }
      });
      
      // Fix transaction status modal
      const txStatusModal = document.getElementById('tx-status-modal');
      if (txStatusModal) {
        txStatusModal.style.zIndex = '9999';
        
        // Fix close button
        const closeBtn = document.getElementById('close-tx-success');
        if (closeBtn) {
          closeBtn.onclick = function() {
            txStatusModal.style.display = 'none';
            window.navigateTo('wallet-screen');
          };
        }
      }
      
      // Fix explorer overlay
      const explorerOverlay = document.getElementById('explorer-overlay');
      if (explorerOverlay) {
        explorerOverlay.style.zIndex = '9999';
        
        const backButton = explorerOverlay.querySelector('.explorer-back-button');
        if (backButton) {
          backButton.onclick = function() {
            explorerOverlay.style.display = 'none';
          };
        }
      }
      
      resolve();
    });
  }
  
  // Step 8: Connect all event handlers with safe delegation
  function connectEventHandlers() {
    return new Promise(resolve => {
      log('Connecting event handlers');
      
      // Safe handler replacement function
      function safelyReplaceHandler(selector, eventType, newHandler) {
        document.querySelectorAll(selector).forEach(element => {
          // Only replace if we're not respecting existing handlers or the element doesn't have handlers
          if (!CONFIG.respectExistingEventHandlers || !element._hasCustomHandlers) {
            // Clone to remove existing handlers
            const newElement = element.cloneNode(true);
            if (element.parentNode) {
              element.parentNode.replaceChild(newElement, element);
            }
            
            // Add new handler
            newElement.addEventListener(eventType, newHandler);
            
            // Mark as having custom handlers
            newElement._hasCustomHandlers = true;
          }
        });
      }
      
      // Connect back buttons
      safelyReplaceHandler('.back-button', 'click', function(e) {
        e.preventDefault();
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
        window.navigateTo(returnTo);
      });
      
      // Connect send button on main screen
      safelyReplaceHandler('#send-button', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('send-token-select', 'wallet-screen');
      });
      
      // Connect receive button
      safelyReplaceHandler('#receive-button', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'wallet-screen');
      });
      
      // Connect history button
      safelyReplaceHandler('.quick-actions .action-circle:nth-child(5)', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('history-screen', 'wallet-screen');
      });
      
      // Connect token detail send button
      safelyReplaceHandler('#token-detail .detail-action:nth-child(1)', 'click', function(e) {
        e.preventDefault();
        const tokenSymbol = document.getElementById('detail-symbol')?.textContent?.toLowerCase();
        if (tokenSymbol) {
          window.activeSendTokenId = tokenSymbol;
          window.navigateTo('send-screen', 'token-detail');
        } else {
          window.navigateTo('send-token-select', 'token-detail');
        }
      });
      
      // Connect token detail receive button
      safelyReplaceHandler('#token-detail .detail-action:nth-child(2)', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'token-detail');
      });
      
      // Connect continue send button
      safelyReplaceHandler('#continue-send', 'click', function(e) {
        e.preventDefault();
        if (typeof window.processTransaction === 'function') {
          window.processTransaction(e);
        } else if (typeof window.processSendTransaction === 'function') {
          window.processSendTransaction(e);
        } else {
          console.log('No transaction processing function available');
          
          // Show toast notification as feedback
          showToast('Transaction submitted');
          
          // Hide send screen
          document.getElementById('send-screen').style.display = 'none';
          
          // Show wallet screen
          window.navigateTo('wallet-screen');
        }
      });
      
      // Initialize token selection
      initTokenSelection();
      
      resolve();
    });
  }
  
  // Step 9: Fix token detail view (thorough)
  function fixTokenDetailView() {
    return new Promise(resolve => {
      log('Fixing token detail view');
      
      const tokenDetail = document.getElementById('token-detail');
      if (!tokenDetail) {
        resolve();
        return;
      }
      
      try {
        // Fix header styling
        const header = tokenDetail.querySelector('.detail-header');
        if (header) {
          header.style.cssText = `
            background-color: white !important;
            padding: 12px 16px !important; 
            border-bottom: none !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          `;
        }
        
        // Token title needs to be at the top with minimal spacing
        const titleElement = tokenDetail.querySelector('.token-detail-title');
        if (titleElement) {
          titleElement.style.cssText = `
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            margin: 0 auto !important;
            padding-top: 0 !important;
          `;
        }
        
        // Symbol should be bold and properly sized
        const symbolElement = document.getElementById('detail-symbol');
        if (symbolElement) {
          symbolElement.style.cssText = `
            font-size: 24px !important;
            font-weight: 600 !important;
            text-align: center !important;
            margin: 0 0 2px 0 !important;
            padding-top: 0 !important;
          `;
        }
        
        // Fullname should be centered and properly formatted
        const fullnameElement = document.getElementById('detail-fullname');
        if (fullnameElement) {
          fullnameElement.style.cssText = `
            font-size: 12px !important;
            color: #8A939D !important;
            text-align: center !important;
            margin: 0 !important;
          `;
          
          if (!fullnameElement.textContent.includes('|')) {
            const tokenName = fullnameElement.textContent;
            fullnameElement.textContent = `COIN | ${tokenName}`;
          }
        }
        
        // Remove all network badges
        const badges = tokenDetail.querySelectorAll('.chain-badge, .chain-badge-fixed');
        badges.forEach(badge => {
          badge.style.display = 'none !important';
          // Or remove them completely
          if (badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        });
        
        // Make positive values blue
        const priceChangeElement = document.getElementById('token-price-change');
        if (priceChangeElement && priceChangeElement.classList.contains('positive')) {
          priceChangeElement.style.color = '#3375BB !important';
        }
        
        // Fix action buttons
        const actions = tokenDetail.querySelectorAll('.detail-action');
        actions.forEach(action => {
          action.classList.add('tw-ripple');
          
          const actionIcon = action.querySelector('i');
          if (actionIcon) {
            actionIcon.style.backgroundColor = 'rgba(51, 117, 187, 0.08)';
            actionIcon.style.color = '#3375BB';
          }
          
          // Make sure actions have proper font
          const actionText = action.querySelector('span');
          if (actionText) {
            actionText.style.fontSize = '12px';
            actionText.style.marginTop = '4px';
          }
        });
        
        // Fix token icon container
        const iconContainer = tokenDetail.querySelector('.token-detail-icon-container');
        if (iconContainer) {
          iconContainer.style.position = 'relative';
          iconContainer.style.overflow = 'visible';
        }
      } catch (error) {
        console.error('Error fixing token detail view:', error);
      }
      
      resolve();
    });
  }
  
  // Step 10: Fix bottom tabs - prevent floating/unstyled tabs
  function fixBottomTabs() {
    return new Promise(resolve => {
      log('Fixing bottom tabs');
      
      const bottomTabs = document.querySelector('.bottom-tabs');
      if (!bottomTabs) {
        log('Bottom tabs not found, creating them');
        // Create bottom tabs if missing
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
        
        // Use the new tabs element for further operations
        document.bottomTabs = newBottomTabs;
      } else {
        // Move to body for proper stacking
        document.body.appendChild(bottomTabs);
        document.bottomTabs = bottomTabs;
      }
      
      // Apply critical styling to ensure visibility and position
      const tabsToStyle = document.bottomTabs || bottomTabs;
      
      if (tabsToStyle) {
        tabsToStyle.style.cssText = `
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
        
        // Add ripple effect to tabs
        tabsToStyle.querySelectorAll('.tab-item').forEach(tab => {
          tab.classList.add('tw-ripple');
          
          // Fix tab appearance
          tab.style.display = 'flex';
          tab.style.flexDirection = 'column';
          tab.style.alignItems = 'center';
          
          // Fix tab icon
          const tabIcon = tab.querySelector('i');
          if (tabIcon) {
            tabIcon.style.fontSize = '20px';
            tabIcon.style.marginBottom = '4px';
          }
          
          // Fix tab text
          const tabText = tab.querySelector('span');
          if (tabText) {
            tabText.style.fontSize = '10px';
          }
        });
        
        // Connect tab clicks if not already connected
        if (!tabsToStyle._hasClickHandlers) {
          tabsToStyle.querySelectorAll('.tab-item').forEach((tab, index) => {
            tab.addEventListener('click', function() {
              // Update active state
              tabsToStyle.querySelectorAll('.tab-item').forEach(t => {
                t.classList.remove('active');
                
                const tIcon = t.querySelector('i');
                const tText = t.querySelector('span');
                if (tIcon) tIcon.style.color = '#8A939D';
                if (tText) tText.style.color = '#8A939D';
              });
              
              tab.classList.add('active');
              
              // Update active tab styling
              const icon = tab.querySelector('i');
              const text = tab.querySelector('span');
              if (icon) icon.style.color = '#3375BB';
              if (text) text.style.color = '#3375BB';
              
              // Navigate based on tab index (only home tab works for demo)
              if (index === 0) {
                window.navigateTo('wallet-screen');
              } else {
                // Show feature coming soon toast
                showToast(`${text ? text.textContent : 'Feature'} coming soon`);
              }
            });
          });
          
          tabsToStyle._hasClickHandlers = true;
        }
      }
      
      resolve();
    });
  }

  // Step 11: Enhance Home Screen with TrustWallet-specific styling
function enhanceHomeScreen() {
  return new Promise(resolve => {
    log('Enhancing home screen');
    
    const walletScreen = document.getElementById('wallet-screen');
    if (!walletScreen) {
      resolve();
      return;
    }
    
    // 1. Fix wallet selector appearance
    const walletSelector = walletScreen.querySelector('.wallet-selector');
    if (walletSelector) {
      walletSelector.style.padding = '8px 0';
      
      // Add authentic ripple effect
      walletSelector.classList.add('tw-ripple');
      
      // Improve wallet name styling
      const walletName = walletSelector.querySelector('.wallet-name');
      if (walletName) {
        walletName.style.fontSize = '14px';
        walletName.style.fontWeight = '600';
        walletName.style.color = '#1A2024';
      }
    }
    
    // 2. Fix total balance display
    const balanceDisplay = walletScreen.querySelector('.balance-display');
    if (balanceDisplay) {
      balanceDisplay.style.padding = '8px 16px 16px';
      
      // Improve amount styling
      const balanceAmount = balanceDisplay.querySelector('.balance-amount');
      if (balanceAmount) {
        balanceAmount.style.fontSize = '28px';
        balanceAmount.style.fontWeight = '700';
        balanceAmount.style.color = '#1A2024';
      }
      
      // Fix eye icon for balance visibility
      const visibilityToggle = balanceDisplay.querySelector('.visibility-toggle');
      if (visibilityToggle) {
        visibilityToggle.style.color = '#8A939D';
        
        // Add toggle functionality if not already present
        if (!visibilityToggle._hasToggleHandler) {
          visibilityToggle.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
              const isHidden = icon.classList.contains('fa-eye-slash');
              
              if (isHidden) {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                // Show balance
                if (balanceAmount && window.totalBalance) {
                  balanceAmount.textContent = window.totalBalance;
                }
              } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                // Save current balance for later
                if (balanceAmount) {
                  window.totalBalance = balanceAmount.textContent;
                  balanceAmount.textContent = '••••••';
                }
              }
            }
          });
          visibilityToggle._hasToggleHandler = true;
        }
      }
    }
    
    // 3. Enhance quick action buttons
    const quickActions = walletScreen.querySelector('.quick-actions');
    if (quickActions) {
      // Ensure proper spacing
      quickActions.style.padding = '0 16px 16px';
      
      // Fix action buttons
      const actionButtons = quickActions.querySelectorAll('.action-circle');
      actionButtons.forEach(btn => {
        // Add ripple effect
        btn.classList.add('tw-ripple');
        
        // Fix icon appearance
        const icon = btn.querySelector('i');
        if (icon) {
          icon.style.backgroundColor = '#F5F5F5';
          icon.style.width = '40px';
          icon.style.height = '40px';
          icon.style.display = 'flex';
          icon.style.justifyContent = 'center';
          icon.style.alignItems = 'center';
          icon.style.borderRadius = '50%';
          icon.style.marginBottom = '4px';
        }
        
        // Fix label appearance
        const label = btn.querySelector('span');
        if (label) {
          label.style.fontSize = '10px';
          label.style.fontWeight = '500';
        }
      });
    }
    
    // 4. Fix tab navigation
    const tabs = walletScreen.querySelector('.tabs');
    if (tabs) {
      // Ensure proper styling
      tabs.style.padding = '0 16px';
      tabs.style.borderBottom = '1px solid #F5F5F5';
      
      // Fix tab buttons
      const tabButtons = tabs.querySelectorAll('.tab-button');
      tabButtons.forEach(tab => {
        tab.style.fontSize = '14px';
        tab.style.fontWeight = '500';
        tab.style.padding = '12px 0';
        
        // Add ripple effect
        tab.classList.add('tw-ripple');
        
        // Fix active state with blue indicator
        if (tab.classList.contains('active')) {
          tab.style.color = '#3375BB';
          
          // Check if tab already has indicator
          if (!tab.querySelector('.tab-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'tab-indicator';
            indicator.style.position = 'absolute';
            indicator.style.bottom = '-1px';
            indicator.style.left = '0';
            indicator.style.width = '100%';
            indicator.style.height = '2px';
            indicator.style.backgroundColor = '#3375BB';
            tab.appendChild(indicator);
          }
        } else {
          tab.style.color = '#5F6C75';
        }
        
        // Fix tab click behavior if not already fixed
        if (!tab._hasClickHandler) {
          tab.addEventListener('click', function() {
            // Update all tabs
            tabButtons.forEach(t => {
              t.classList.remove('active');
              t.style.color = '#5F6C75';
              
              // Remove indicator if exists
              const ind = t.querySelector('.tab-indicator');
              if (ind) ind.remove();
            });
            
            // Set active state for clicked tab
            this.classList.add('active');
            this.style.color = '#3375BB';
            
            // Add indicator
            if (!this.querySelector('.tab-indicator')) {
              const indicator = document.createElement('div');
              indicator.className = 'tab-indicator';
              indicator.style.position = 'absolute';
              indicator.style.bottom = '-1px';
              indicator.style.left = '0';
              indicator.style.width = '100%';
              indicator.style.height = '2px';
              indicator.style.backgroundColor = '#3375BB';
              this.appendChild(indicator);
            }
          });
          tab._hasClickHandler = true;
        }
      });
    }
    
    // 5. Fix token list appearance and behavior
    const tokenList = walletScreen.querySelector('#token-list');
    if (tokenList) {
      // Ensure smooth scrolling
      tokenList.style.scrollBehavior = 'smooth';
      
      // Fix token items
      const tokenItems = tokenList.querySelectorAll('.token-item');
      tokenItems.forEach(item => {
        // Fix spacing
        item.style.padding = '14px 16px';
        item.style.borderBottom = '1px solid #F5F5F5';
        
        // Fix token icon size
        const tokenIcon = item.querySelector('.token-icon');
        if (tokenIcon) {
          tokenIcon.style.width = '36px';
          tokenIcon.style.height = '36px';
          tokenIcon.style.minWidth = '36px';
          tokenIcon.style.marginRight = '16px';
        }
        
        // Fix positive value colors to match TrustWallet blue
        const tokenValue = item.querySelector('.token-price-change');
        if (tokenValue && tokenValue.classList.contains('positive')) {
          tokenValue.style.color = '#3375BB';
        }
      });
      
      // Add pull-to-refresh simulation
      addPullToRefreshSimulation(tokenList);
    }
    
    // 6. Fix footer disclaimer text
    const footerInfo = walletScreen.querySelector('.footer-info');
    if (footerInfo) {
      footerInfo.style.fontSize = '12px';
      footerInfo.style.color = '#8A939D';
      footerInfo.style.textAlign = 'center';
      footerInfo.style.padding = '16px 16px 80px';
      footerInfo.style.lineHeight = '1.4';
    }
    
    // 7. Fix investment warning banner
    const investmentWarning = walletScreen.querySelector('#investment-warning');
    if (investmentWarning) {
      investmentWarning.style.width = 'calc(100% - 32px)';
      investmentWarning.style.margin = '16px';
      investmentWarning.style.backgroundColor = '#FEF9E7';
      investmentWarning.style.color = '#D4AC0D';
      investmentWarning.style.borderRadius = '8px';
      investmentWarning.style.borderLeft = '4px solid #D4AC0D';
      
      // Fix close button
      const closeWarning = investmentWarning.querySelector('#close-investment-warning');
      if (closeWarning) {
        closeWarning.addEventListener('click', function() {
          investmentWarning.style.display = 'none';
        });
      }
    }
    
    resolve();
  });
}

// Step 12: Optimize performance
function optimizePerformance() {
  return new Promise(resolve => {
    log('Optimizing performance');
    
    // Remove redundant event listeners by using event delegation
    const walletScreen = document.getElementById('wallet-screen');
    if (walletScreen) {
      // Delegate token list clicks
      const tokenList = document.getElementById('token-list');
      if (tokenList && !tokenList._hasDelegatedClickHandler) {
        // Add single delegated listener
        tokenList.addEventListener('click', function(e) {
          const tokenItem = e.target.closest('.token-item');
          if (!tokenItem) return;
          
          const tokenId = tokenItem.getAttribute('data-token-id');
          if (!tokenId) return;
          
          // Use existing function if available
          if (typeof window.showTokenDetail === 'function') {
            window.showTokenDetail(tokenId);
          } else {
            navigateToScreen('token-detail');
          }
        });
        tokenList._hasDelegatedClickHandler = true;
      }
    }
    
    // Prevent passive event listener warnings
    document.addEventListener('touchstart', function(){}, {passive: true});
    document.addEventListener('touchmove', function(){}, {passive: true});
    
    // Cache frequently used elements
    window._cachedElements = window._cachedElements || {};
    
    // Cache lookup function
    window.getCachedElement = function(id) {
      if (!window._cachedElements[id]) {
        window._cachedElements[id] = document.getElementById(id);
      }
      return window._cachedElements[id];
    };
    
    resolve();
  });
}

// Step 13: Add authentic touch feedback
function addAuthenticTouchFeedback() {
  return new Promise(resolve => {
    log('Adding authentic touch feedback');
    
    // Add TrustWallet's haptic feedback simulation
    document.querySelectorAll('.action-circle, .detail-action, .fee-option, .numpad-key').forEach(el => {
      if (!el.classList.contains('tw-ripple')) {
        el.classList.add('tw-ripple');
      }
    });
    
    // Add copy functionality with feedback
    document.querySelectorAll('.action-copy, .copy-button').forEach(button => {
      button.addEventListener('click', function() {
        showToast('Address copied to clipboard');
      });
    });
    
    // Add paste functionality with feedback
    document.querySelectorAll('.paste-button').forEach(button => {
      button.addEventListener('click', function() {
        showToast('Address pasted');
        
        // For demo, fill with a placeholder address if needed
        const addressInput = document.getElementById('recipient-address');
        if (addressInput && !addressInput.value) {
          addressInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        }
      });
    });
    
    resolve();
  });
}

// Step 14: Final cleanup and checks
function finalCleanup() {
  return new Promise(resolve => {
    log('Performing final cleanup and checks');
    
    // Make sure initial screen is shown
    setTimeout(() => {
      const visibleScreens = Array.from(document.querySelectorAll('.screen')).filter(
        screen => !screen.classList.contains('hidden') && screen.style.display !== 'none'
      );
      
      if (visibleScreens.length === 0) {
        log('No visible screen detected, showing lock screen');
        window.navigateTo('lock-screen');
      }
    }, CONFIG.finalCleanupDelay);
    
    // Fix transaction status modal
    const txStatusModal = document.getElementById('tx-status-modal');
    if (txStatusModal) {
      txStatusModal.style.zIndex = '9999';
      
      const closeBtn = document.getElementById('close-tx-success');
      if (closeBtn) {
        closeBtn.onclick = function() {
          txStatusModal.style.display = 'none';
          window.navigateTo('wallet-screen');
        };
      }
    }
    
    // Fix explorer overlay
    const explorerOverlay = document.getElementById('explorer-overlay');
    if (explorerOverlay) {
      explorerOverlay.style.zIndex = '9999';
      
      const backButton = explorerOverlay.querySelector('.explorer-back-button');
      if (backButton) {
        backButton.onclick = function() {
          explorerOverlay.style.display = 'none';
        };
      }
    }
    
    // Final sanity check for token detail view
    fixTokenDetailView();
    
    // Initialize token selection if needed
    initTokenSelection();
    
    // Make sure bottom tabs are visible (repeated fix)
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (bottomTabs) {
      bottomTabs.style.display = 'flex';
      bottomTabs.style.position = 'fixed';
      bottomTabs.style.bottom = '0';
      bottomTabs.style.width = '100%';
      bottomTabs.style.zIndex = '9999';
    }
    
    // Override conflicting functions with enhanced versions
    overrideConflictingFunctions();
    
    // Log completion
    console.log('TrustWallet Enhancer: All enhancements applied successfully! ✅');
    
    resolve();
  });
}

/**
 * Helper functions
 */

// Add admin panel access
function addAdminAccess() {
  // Remove any existing admin button to avoid duplicates
  const existingTarget = document.getElementById('admin-touch-target');
  if (existingTarget) {
    existingTarget.remove();
  }
  
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
      }
    }
  });
}

// Initialize token selection
function initTokenSelection() {
  const tokenList = document.getElementById('select-token-list');
  if (!tokenList) return;
  
  // Get wallet data safely
  const walletData = window.currentWalletData || {};
  const activeWallet = window.activeWallet || 'main';
  const tokens = walletData[activeWallet]?.tokens || [];
  
  if (tokens.length === 0) {
    log('No tokens available for selection');
    return;
  }
  
  // Only populate if empty
  if (tokenList.children.length === 0) {
    log('Populating token selection list');
    
    // Create token items
    tokens.forEach(token => {
      const tokenItem = document.createElement('div');
      tokenItem.className = 'token-item';
      tokenItem.setAttribute('data-token-id', token.id);
      
      // Format display values
      const formattedAmount = token.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
      
      const formattedValue = '$' + token.value.toFixed(2);
      
      // Build HTML
      tokenItem.innerHTML = `
        <div class="token-icon">
          <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
        </div>
        <div class="token-info">
          <div class="token-name">
            ${token.symbol}
            ${['usdt', 'twt', 'bnb'].includes(token.id) ? '<span class="token-network-badge">BEP20</span>' : ''}
          </div>
          <div class="token-price">
            ${token.name}
          </div>
        </div>
        <div class="token-amount-container">
          <div class="token-balance">${formattedAmount} ${token.symbol}</div>
          <div class="token-value">${formattedValue}</div>
        </div>
      `;
      
      // Add click handler
      tokenItem.addEventListener('click', function() {
        const tokenId = this.getAttribute('data-token-id');
        if (tokenId) {
          window.activeSendTokenId = tokenId;
          window.navigateTo('send-screen', 'send-token-select');
          updateSendScreenForToken(tokenId);
        }
      });
      
      tokenList.appendChild(tokenItem);
    });
  }
  
  // Connect search functionality
  const searchInput = document.getElementById('token-search-input');
  if (searchInput && !searchInput._hasSearchHandler) {
    searchInput.addEventListener('input', function() {
      const searchText = this.value.toLowerCase();
      const tokenItems = document.querySelectorAll('#select-token-list .token-item');
      
      tokenItems.forEach(item => {
        const tokenName = item.querySelector('.token-name').textContent.toLowerCase();
        const visible = tokenName.includes(searchText);
        item.style.display = visible ? 'flex' : 'none';
      });
    });
    searchInput._hasSearchHandler = true;
  }
}

// Update send screen for selected token
function updateSendScreenForToken(tokenId) {
  // Get token data
  const walletData = window.currentWalletData || {};
  const activeWallet = window.activeWallet || 'main';
  const tokens = walletData[activeWallet]?.tokens || [];
  const token = tokens.find(t => t.id === tokenId) || { 
    symbol: tokenId.toUpperCase(), 
    network: tokenId.toUpperCase() + ' Network' 
  };
  
  // Update title
  const sendTitle = document.getElementById('send-token-title');
  if (sendTitle) {
    sendTitle.textContent = `Send ${token.symbol}`;
  }
  
  // Update amount placeholder
  const amountInput = document.getElementById('send-amount');
  if (amountInput) {
    amountInput.placeholder = `${token.symbol} Amount`;
  }
  
  // Update network info if needed
  if (['usdt', 'twt', 'bnb'].includes(tokenId)) {
    const networkName = document.querySelector('.network-name');
    if (networkName) {
      networkName.textContent = 'BNB Smart Chain';
    }
    
    const networkIcon = document.querySelector('.network-icon img');
    if (networkIcon) {
      networkIcon.src = 'https://cryptologos.cc/logos/bnb-bnb-logo.png';
    }
  } else {
    const networkName = document.querySelector('.network-name');
    if (networkName) {
      networkName.textContent = token.network || token.symbol + ' Network';
    }
  }
  
  // Update available balance
  const maxAmount = document.getElementById('max-amount');
  if (maxAmount && token.amount) {
    maxAmount.textContent = token.amount.toFixed(6);
  }
  
  const maxSymbol = document.getElementById('max-symbol');
  if (maxSymbol) {
    maxSymbol.textContent = token.symbol;
  }
}

// Get token logo URL
function getTokenLogoUrl(tokenId) {
  const logoUrls = {
    'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
    'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
    'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
    'uni': 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  };
  
  return logoUrls[tokenId] || 'https://cryptologos.cc/logos/default-logo.png';
}

// Add pull-to-refresh simulation
function addPullToRefreshSimulation(element) {
  if (!element || element._hasRefreshSimulation) return;
  
  let startY = 0;
  let currentY = 0;
  let pulling = false;
  const pullThreshold = 60;
  
  // Create pull indicator if not already exists
  let indicator = document.querySelector('.pull-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'pull-indicator';
    indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
    
    // Add indicator to parent
    const parent = element.parentNode;
    if (parent) {
      parent.style.position = 'relative';
      parent.appendChild(indicator);
    }
  }
  
  // Touch events
  element.addEventListener('touchstart', function(e) {
    if (element.scrollTop <= 0) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  }, {passive: true});
  
  element.addEventListener('touchmove', function(e) {
    if (!pulling) return;
    
    currentY = e.touches[0].clientY;
    const pullDistance = currentY - startY;
    
    if (pullDistance > 0) {
      // Prevent default scrolling
      e.preventDefault();
      
      // Show and rotate indicator
      indicator.style.opacity = Math.min(pullDistance / pullThreshold, 1);
      indicator.style.transform = `translateX(-50%) rotate(${pullDistance * 3}deg)`;
      
      // Slow down scrolling with resistance
      element.style.transform = `translateY(${Math.min(pullDistance / 2, 60)}px)`;
    }
  }, {passive: false});
  
  element.addEventListener('touchend', function() {
    if (!pulling) return;
    pulling = false;
    
    const pullDistance = currentY - startY;
    
    // Reset element position with animation
    element.style.transition = 'transform 0.3s';
    element.style.transform = 'translateY(0)';
    
    // Reset after animation completes
    setTimeout(() => {
      element.style.transition = '';
    }, 300);
    
    if (pullDistance > pullThreshold) {
      // Trigger refresh animation
      indicator.querySelector('i').classList.add('fa-spin');
      indicator.style.opacity = '1';
      
      // Show refresh toast
      showToast('Refreshing...');
      
      // Simulate refresh completion
      setTimeout(() => {
        indicator.querySelector('i').classList.remove('fa-spin');
        indicator.style.opacity = '0';
        showToast('Refreshed successfully');
      }, 1500);
    } else {
      // Hide indicator
      indicator.style.opacity = '0';
    }
  });
  
  element._hasRefreshSimulation = true;
}

// Show toast notification
function showToast(message, duration = 2000) {
  // Remove any existing toast
  const existingToast = document.querySelector('.tw-toast');
  if (existingToast) existingToast.remove();
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'tw-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('visible'), 10);
  
  // Hide and remove after duration
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Override conflicting functions with enhanced versions
function overrideConflictingFunctions() {
  // Save original functions
  window._originalShowSendScreen = window.showSendScreen;
  window._originalShowReceiveScreen = window.showReceiveScreen;
  window._originalShowTokenDetail = window.showTokenDetail;
  
  // Override with our priority functions
  window.showSendScreen = function(tokenId) {
    console.log('Showing send screen for token:', tokenId);
    window.activeSendTokenId = tokenId;
    
    // If we should go through token selection first
    if (!tokenId) {
      navigateTo('send-token-select', 'wallet-screen');
    } else {
      navigateTo('send-screen', 'send-token-select');
      updateSendScreenForToken(tokenId);
    }
  };
  
  window.showReceiveScreen = function() {
    console.log('Showing receive screen');
    navigateTo('receive-screen', 'wallet-screen');
  };
  
  // Make sure we don't replace the original if it exists
  if (!window.processSendTransaction && typeof window.processTransaction === 'function') {
    window.processSendTransaction = window.processTransaction;
  }
}

// Enhance QR screen
function enhanceQRScreen() {
  const receiveScreen = document.getElementById('receive-screen');
  if (!receiveScreen) return;
  
  // QR code container styling
  const qrContainer = receiveScreen.querySelector('.qr-code-container');
  if (qrContainer) {
    qrContainer.style.width = '250px';
    qrContainer.style.height = '250px';
    qrContainer.style.backgroundColor = 'white';
    qrContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    qrContainer.style.borderRadius = '12px';
    qrContainer.style.padding = '16px';
    qrContainer.style.margin = '24px auto';
  }
  
  // Add copy button click feedback
  const copyButtons = receiveScreen.querySelectorAll('.action-round-button, .action-copy');
  copyButtons.forEach(btn => {
    btn.classList.add('tw-ripple');
    
    btn.addEventListener('click', function() {
      if (this.querySelector('i')?.classList.contains('fa-copy')) {
        showToast('Address copied to clipboard');
      } else if (this.querySelector('i')?.classList.contains('fa-share-alt')) {
        showToast('Share options opening...');
      }
    });
  });
}

})();
