// TrustWalletFixer.js - Add this script AFTER all other scripts
(function() {
  console.log('TrustWallet Fixer: Starting repair process...');
  
  // Wait for DOM and all other scripts to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFixer);
  } else {
    // DOM already loaded, run immediately with a short delay
    setTimeout(initFixer, 100);
  }
  
  function initFixer() {
    // Wait a bit more to ensure everything else has loaded
    setTimeout(runFixes, 300);
  }
  
  function runFixes() {
    console.log('TrustWallet Fixer: Applying fixes...');
    
    // 1. Ensure screens exist and are populated
    ensureScreensExist();
    
    // 2. Fix navigation system
    fixNavigation();
    
    // 3. Fix styling issues
    fixStyling();
    
    // 4. Fix event handlers
    fixEventHandlers();
    
    console.log('TrustWallet Fixer: Repairs complete');
  }
  
  // Make sure all screens exist and have content
  function ensureScreensExist() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;
    
    // Create screens if they don't exist
    const screens = {
      'history-screen': 'UHS',
      'receive-screen': 'URS',
      'send-screen': 'USS'
    };
    
    Object.entries(screens).forEach(([id, source]) => {
      let screen = document.getElementById(id);
      
      // Create screen if it doesn't exist
      if (!screen) {
        screen = document.createElement('div');
        screen.id = id;
        screen.className = 'screen hidden';
        appContainer.appendChild(screen);
        console.log(`Created missing screen: ${id}`);
      }
      
      // Load content if screen is empty
      if (screen.innerHTML.trim() === '') {
        const content = document.querySelector(`document[source="${source}"] document_content`);
        if (content) {
          screen.innerHTML = content.textContent;
          console.log(`Loaded content for: ${id}`);
          
          // Execute scripts in the content
          const scripts = screen.querySelectorAll('script');
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
          });
        }
      }
    });
  }
  
  // Fix navigation system
  function fixNavigation() {
    // Create global navigation function
    window.navigateTo = function(targetId, fromId) {
      console.log(`Navigating to ${targetId} from ${fromId || 'unknown'}`);
      
      // Hide all screens
      document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.add('hidden');
      });
      
      // Show target screen
      const target = document.getElementById(targetId);
      if (target) {
        target.style.display = 'flex';
        target.classList.remove('hidden');
        
        // Store return screen if provided
        if (fromId) {
          target.dataset.returnTo = fromId;
        }
      }
    };
    
    // Fix back buttons
    document.querySelectorAll('.back-button').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
        window.navigateTo(returnTo);
      };
    });
  }
  
  // Fix styling issues
  function fixStyling() {
    // Add CSS fixes for priority styling
    const style = document.createElement('style');
    style.id = 'tw-fixer-style';
    style.textContent = `
      /* Fix screens to be properly hidden/shown */
      .screen {
        display: none !important;
      }
      .screen.hidden {
        display: none !important;
      }
      .screen:not(.hidden) {
        display: flex !important;
      }
      
      /* Fix network badges - hide in send/receive screens */
      #send-screen .chain-badge,
      #send-screen .chain-badge-fixed,
      #send-screen .network-badge,
      #receive-screen .chain-badge,
      #receive-screen .chain-badge-fixed,
      #receive-screen .network-badge {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* Fix bottom tabs */
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
      
      /* Fix token positioning */
      .token-icon {
        position: relative !important;
        overflow: visible !important;
      }
      
      /* Fix token detail view */
      #token-detail .chain-badge,
      #token-detail .chain-badge-fixed {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Move bottom tabs to body for proper stacking
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (bottomTabs) {
      document.body.appendChild(bottomTabs);
    }
  }
  
  // Fix event handlers
  function fixEventHandlers() {
    // Fix Send button
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
      sendButton.onclick = function(e) {
        e.preventDefault();
        window.navigateTo('send-token-select', 'wallet-screen');
        
        // Initialize token selection if needed
        const tokenList = document.getElementById('select-token-list');
        if (tokenList && tokenList.children.length === 0) {
          initTokenSelection();
        }
      };
    }
    
    // Fix Receive button
    const receiveButton = document.getElementById('receive-button');
    if (receiveButton) {
      receiveButton.onclick = function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'wallet-screen');
      };
    }
    
    // Fix History button
    const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    if (historyButton) {
      historyButton.onclick = function(e) {
        e.preventDefault();
        window.navigateTo('history-screen', 'wallet-screen');
      };
    }
    
    // Fix Token Detail Send/Receive buttons
    const detailSendButton = document.querySelector('#token-detail .detail-action:nth-child(1)');
    if (detailSendButton) {
      detailSendButton.onclick = function(e) {
        e.preventDefault();
        const tokenSymbol = document.getElementById('detail-symbol')?.textContent.toLowerCase();
        window.activeSendTokenId = tokenSymbol;
        window.navigateTo('send-screen', 'token-detail');
      };
    }
    
    const detailReceiveButton = document.querySelector('#token-detail .detail-action:nth-child(2)');
    if (detailReceiveButton) {
      detailReceiveButton.onclick = function(e) {
        e.preventDefault();
        window.navigateTo('receive-screen', 'token-detail');
      };
    }
    
    // Fix Continue Send button
    const continueButton = document.getElementById('continue-send');
    if (continueButton) {
      continueButton.onclick = function(e) {
        e.preventDefault();
        if (typeof window.processSendTransaction === 'function') {
          window.processSendTransaction(e);
        } else {
          console.log('Transaction processing not available');
        }
      };
    }
    
    // Fix Bottom tabs
    const tabItems = document.querySelectorAll('.bottom-tabs .tab-item');
    tabItems.forEach((tab, index) => {
      tab.onclick = function() {
        // Update active state
        tabItems.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Only home tab does something for now
        if (index === 0) {
          window.navigateTo('wallet-screen');
        }
      };
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
      tokenItem.onclick = function() {
        const tokenId = this.getAttribute('data-token-id');
        window.activeSendTokenId = tokenId;
        
        // Update send screen for selected token
        const sendTitle = document.getElementById('send-token-title');
        if (sendTitle) {
          sendTitle.textContent = `Send ${token.symbol}`;
        }
        
        window.navigateTo('send-screen', 'send-token-select');
      };
      
      tokenList.appendChild(tokenItem);
    });
  }
  
  // Helper function for token logos
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
