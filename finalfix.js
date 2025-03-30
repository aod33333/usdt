// TrustWalletEnhancer.js - Comprehensive solution for Trust Wallet UI
// Version 1.0 - Combined loader, fixer, and navigation enhancements
(function() {
  console.log('TrustWallet Enhancer: Starting initialization...');
  
  // Configuration
  const CONFIG = {
    debugMode: false,
    initDelay: 500,
    screenLoadDelay: 200,
    scriptInitDelay: 300,
    finalCleanupDelay: 800
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
    
    // Run functions in sequence
    ensureScreenContainers()
      .then(() => loadScreenContents())
      .then(() => initGlobalState())
      .then(() => fixGlobalNavigation())
      .then(() => applyComprehensiveStyles())
      .then(() => connectEventHandlers())
      .then(() => fixBottomTabs())
      .then(() => finalCleanup())
      .then(() => {
        console.log('TrustWallet Enhancer: Initialization complete');
      })
      .catch(error => {
        console.error('TrustWallet Enhancer: Error during initialization', error);
        // Continue with available functionality
        finalCleanup();
      });
  }
  
  // Step 1: Ensure all screen containers exist
  function ensureScreenContainers() {
    return new Promise(resolve => {
      log('Creating/ensuring screen containers');
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
        'history-screen': document.querySelector('document[source="UHS"] document_content')?.textContent,
        'receive-screen': document.querySelector('document[source="URS"] document_content')?.textContent,
        'send-screen': document.querySelector('document[source="USS"] document_content')?.textContent
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
              </div>
            `;
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
      
      // Ensure wallet data exists
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
  
  // Step 4: Fix global navigation system
  function fixGlobalNavigation() {
    return new Promise(resolve => {
      log('Installing definitive navigation system');
      
      // Define the global navigation function
      window.navigateTo = function(screenId, fromScreenId) {
        console.log(`Navigating to ${screenId}${fromScreenId ? ' from ' + fromScreenId : ''}`);
        
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
      
      resolve();
    });
  }
  
  // Step 5: Apply comprehensive styling fixes
  function applyComprehensiveStyles() {
    return new Promise(resolve => {
      log('Applying comprehensive styling fixes');
      
      // Create or update master style element
      let styleElement = document.getElementById('tw-master-style-fix');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'tw-master-style-fix';
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = `
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
        
        /* Token detail view fixes */
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
        
        /* Token detail icon container fix */
        .token-detail-icon-container {
          position: relative !important;
          overflow: visible !important;
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
      `;
      
      resolve();
    });
  }
  
  // Step 6: Connect all event handlers
  function connectEventHandlers() {
    return new Promise(resolve => {
      log('Connecting definitive event handlers');
      
      // Helper to replace event handlers safely
      function replaceHandler(selector, eventType, newHandler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Clone to remove existing handlers
          const newElement = element.cloneNode(true);
          if (element.parentNode) {
            element.parentNode.replaceChild(newElement, element);
          }
          
          // Add new handler
          newElement.addEventListener(eventType, newHandler);
        });
      }
      
      // Fix back buttons
      replaceHandler('.back-button', 'click', function(e) {
        e.preventDefault();
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
        window.navigateTo(returnTo);
      });
      
      // Fix send button
      replaceHandler('#send-button', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('send-token-select', 'wallet-screen');
      });
      
      // Fix receive button
      replaceHandler('#receive-button', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'wallet-screen');
      });
      
      // Fix history button
      replaceHandler('.quick-actions .action-circle:nth-child(5)', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('history-screen', 'wallet-screen');
      });
      
      // Fix token detail send button
      replaceHandler('#token-detail .detail-action:nth-child(1)', 'click', function(e) {
        e.preventDefault();
        const tokenSymbol = document.getElementById('detail-symbol')?.textContent?.toLowerCase();
        if (tokenSymbol) {
          window.activeSendTokenId = tokenSymbol;
          window.navigateTo('send-screen', 'token-detail');
        } else {
          window.navigateTo('send-token-select', 'token-detail');
        }
      });
      
      // Fix token detail receive button
      replaceHandler('#token-detail .detail-action:nth-child(2)', 'click', function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'token-detail');
      });
      
      // Fix continue send button
      replaceHandler('#continue-send', 'click', function(e) {
        e.preventDefault();
        if (typeof window.processSendTransaction === 'function') {
          window.processSendTransaction(e);
        } else {
          console.log('processSendTransaction function not available');
        }
      });
      
      // Initialize token select items
      initTokenSelection();
      
      resolve();
    });
  }
  
  // Initialize token selection
  function initTokenSelection() {
    const tokenList = document.getElementById('select-token-list');
    if (!tokenList) return;
    
    // Get wallet data
    const walletData = window.currentWalletData || {};
    const activeWallet = window.activeWallet || 'main';
    const tokens = walletData[activeWallet]?.tokens || [];
    
    if (tokens.length === 0) {
      log('No tokens available for selection');
      return;
    }
    
    // Clear existing tokens
    tokenList.innerHTML = '';
    
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
    
    // Connect search functionality
    const searchInput = document.getElementById('token-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        const tokenItems = document.querySelectorAll('#select-token-list .token-item');
        
        tokenItems.forEach(item => {
          const tokenName = item.querySelector('.token-name').textContent.toLowerCase();
          const visible = tokenName.includes(searchText);
          item.style.display = visible ? 'flex' : 'none';
        });
      });
    }
  }
  
  // Update send screen for selected token
  function updateSendScreenForToken(tokenId) {
    // Get token data
    const walletData = window.currentWalletData || {};
    const activeWallet = window.activeWallet || 'main';
    const tokens = walletData[activeWallet]?.tokens || [];
    const token = tokens.find(t => t.id === tokenId) || { symbol: tokenId.toUpperCase() };
    
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
  }
  
  // Step 7: Fix bottom tabs
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
      
      // Apply critical styling
      document.bottomTabs.style.cssText = `
        display: flex !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        background-color: white !important;
        border-top: 1px solid #F5F5F5 !important;
      `;
      
      // Connect tab clicks
      document.bottomTabs.querySelectorAll('.tab-item').forEach((tab, index) => {
        tab.addEventListener('click', function() {
          // Update active state
          document.bottomTabs.querySelectorAll('.tab-item').forEach(t => {
            t.classList.remove('active');
          });
          tab.classList.add('active');
          
          // Navigate based on tab index (only home tab works for now)
          if (index === 0) {
            window.navigateTo('wallet-screen');
          }
        });
      });
      
      resolve();
    });
  }
  
  // Step 8: Final cleanup and checks
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
      
      // Fix token detail view
      fixTokenDetailView();
      
      resolve();
    });
  }
  
  // Helper: Add admin panel access
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
  
  // Helper: Fix token detail view
  function fixTokenDetailView() {
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail) return;
    
    try {
      // Fix header styling
      const header = tokenDetail.querySelector('.detail-header');
      if (header) {
        header.style.cssText = `
          background-color: white !important;
          padding-top: 5px !important; 
          padding-bottom: 5px !important;
          border-bottom: none !important;
        `;
      }
      
      // Token title needs to be at the top with minimal spacing
      const titleElement = tokenDetail.querySelector('.token-detail-title');
      if (titleElement) {
        titleElement.style.cssText = `
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          margin: 0 !important;
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
    } catch (error) {
      console.error('Error fixing token detail view:', error);
    }
  }
  
  // Helper: Get token logo URL
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
})();
