// trustwallet-enhancer.js
(function() {
  'use strict';
  
  // Wait for DOM and existing scripts to fully load
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initEnhancements, 600);
  });
  
  function initEnhancements() {
    console.log('TrustWallet Enhancer: Initializing...');
    
    // Add CSS enhancements inline to avoid CSP issues
    addEnhancementStyles();
    
    // Apply enhancements in sequence with small delays
    enhanceUIStyling();
    
    setTimeout(() => {
      enhanceNavigation();
      fixNetworkBadges();
    }, 200);
    
    setTimeout(() => {
      enhanceTransactions();
      fixTokenDetailView();
      connectScreens();
    }, 400);
    
    setTimeout(() => {
      optimizePerformance();
      addAuthenticTouchFeedback();
    }, 600);
    
    console.log('TrustWallet Enhancer: Initialization complete');
  }
  
  // Add CSS enhancements directly to avoid CSP issues with external stylesheet
  function addEnhancementStyles() {
    const style = document.createElement('style');
    style.textContent = `
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
      
      /* TrustWallet-specific UI adjustments */
      .token-name {
        font-weight: 600 !important;
        font-size: 15px !important;
        color: #1A2024 !important;
      }
      
      .token-balance {
        font-weight: 500 !important;
        font-size: 15px !important;
      }
      
      /* QR code authentic styling */
      .qr-code-container {
        width: 250px !important;
        height: 250px !important;
        padding: 16px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        border-radius: 12px !important;
        background-color: white !important;
      }
      
      /* TrustWallet exact colors */
      :root {
        --tw-blue: #3375BB !important;
        --tw-blue-light: #4D91DD !important;
        --tw-blue-dark: #1F5BB6 !important;
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
      }
      
      #detail-fullname {
        font-size: 12px !important;
        color: #8A939D !important;
        text-align: center !important;
      }
      
      /* Transaction items */
      .transaction-item {
        display: flex !important;
        align-items: center !important;
        padding: 14px 16px !important;
        border-bottom: 1px solid #F5F5F5 !important;
      }
      
      /* Blue for positive values - TrustWallet's specific design pattern */
      .transaction-value.positive {
        color: #3375BB !important;
      }
      
      /* Remove badges from send/receive screens */
      #send-screen .chain-badge,
      #send-screen .chain-badge-fixed,
      #receive-screen .chain-badge,
      #receive-screen .chain-badge-fixed {
        display: none !important;
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
      
      /* Authentic send/receive screens */
      #send-screen .form-group label,
      #receive-screen .form-group label {
        font-size: 16px !important;
        font-weight: 500 !important;
        color: #5F6C75 !important;
        margin-bottom: 8px !important;
      }
      
      /* Token network badge appearance */
      .token-network-badge {
        display: inline-block !important;
        padding: 2px 6px !important;
        font-size: 10px !important;
        background-color: rgba(243, 186, 47, 0.1) !important;
        color: #F3BA2F !important;
        border-radius: 4px !important;
        margin-left: 6px !important;
        font-weight: 500 !important;
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
      
      /* Wallet selector refinements */
      .wallet-selector {
        padding: 6px 0 !important;
      }
      
      .wallet-name {
        font-size: 14px !important;
        font-weight: 600 !important;
      }
      
      /* Transaction detail focus state */
      .transaction-item:active {
        background-color: rgba(245, 245, 245, 0.5) !important;
      }
      
      /* Transaction status improvements */
      .tx-status-icon.success {
        background-color: rgba(5, 196, 107, 0.1) !important;
        color: #05C46B !important;
      }
      
      /* Network fee selector styling */
      .fee-option.active {
        border: 1px solid #3375BB !important;
        background-color: rgba(51, 117, 187, 0.1) !important;
      }
      
      /* More precise QR code */
      .qr-code-container svg rect {
        shape-rendering: crispEdges !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Navigation and screen transitions
  function enhanceNavigation() {
    // Standardize back button behavior
    document.querySelectorAll('.back-button').forEach(button => {
      // Clone to remove existing listeners
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      newButton.addEventListener('click', function() {
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        // Default target is wallet screen unless specified
        const targetScreen = currentScreen.dataset.returnTo || 'wallet-screen';
        
        // Hide current screen
        currentScreen.style.display = 'none';
        currentScreen.classList.add('hidden');
        
        // Show target screen
        const targetEl = document.getElementById(targetScreen);
        if (targetEl) {
          targetEl.style.display = 'flex';
          targetEl.classList.remove('hidden');
        }
      });
    });
    
    // Fix bottom tabs
    fixBottomTabs();
  }
  
  // Fix bottom tabs with proper styling and behavior
  function fixBottomTabs() {
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (!bottomTabs) return;
    
    // Move to end of body for proper stacking
    document.body.appendChild(bottomTabs);
    
    // Set critical styles
    bottomTabs.style.position = 'fixed';
    bottomTabs.style.bottom = '0';
    bottomTabs.style.left = '0';
    bottomTabs.style.width = '100%';
    bottomTabs.style.zIndex = '9999';
    bottomTabs.style.backgroundColor = 'white';
    bottomTabs.style.borderTop = '1px solid #F5F5F5';
    bottomTabs.style.display = 'flex';
    
    // Fix tab items
    const tabItems = bottomTabs.querySelectorAll('.tab-item');
    tabItems.forEach((tab, index) => {
      // Add ripple effect for authentic touch feedback
      tab.classList.add('tw-ripple');
      
      // Connect tab clicks
      tab.addEventListener('click', function() {
        // Update active state
        tabItems.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Navigate based on tab index
        switch(index) {
          case 0: // Home tab
            navigateToScreen('wallet-screen');
            break;
          case 1: // Swap tab (just for demonstration)
            showToast('Swap feature coming soon');
            break;
          case 2: // Earn tab
            showToast('Earn feature coming soon');
            break;
          case 3: // Discover tab
            showToast('Discover feature coming soon');
            break;
        }
      });
    });
  }
  
  // UI styling enhancements
  function enhanceUIStyling() {
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
  }
  
  // Fix QR code screen for authenticity
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
    const copyButtons = receiveScreen.querySelectorAll('.action-round-button');
    copyButtons.forEach(btn => {
      btn.classList.add('tw-ripple');
      
      btn.addEventListener('click', function() {
        if (this.querySelector('i').classList.contains('fa-copy')) {
          showToast('Address copied to clipboard');
        } else if (this.querySelector('i').classList.contains('fa-share-alt')) {
          showToast('Share options opening...');
        }
      });
    });
  }
  
  // Transaction enhancements
  function enhanceTransactions() {
    // Enhance transaction items
    document.querySelectorAll('.transaction-item').forEach(item => {
      // Add ripple effect
      item.classList.add('tw-ripple');
      
      // Precise styling
      const txValue = item.querySelector('.transaction-value');
      if (txValue && txValue.classList.contains('positive')) {
        txValue.style.color = '#3375BB';
      }
    });
    
    // Update "Continue" button in send screen
    const continueButton = document.getElementById('continue-send');
    if (continueButton) {
      continueButton.classList.add('tw-ripple');
      
      // Add processing feedback
      continueButton.addEventListener('click', function() {
        // Basic validation for demo purposes
        const amount = document.getElementById('send-amount')?.value;
        const address = document.getElementById('recipient-address')?.value;
        
        if (!amount || !address) {
          showToast('Please fill all fields');
          return;
        }
        
        // Simulate processing
        this.textContent = 'Processing...';
        this.classList.add('loading');
        
        // To avoid breaking existing functionality, we don't change core behavior
        // but enhance the visual feedback only
        setTimeout(() => {
          if (this.textContent === 'Processing...') {
            this.textContent = 'Continue';
            this.classList.remove('loading');
          }
        }, 5000); // Reset if other handlers don't change it back
      });
    }
    
    // Enhance transaction detail modal
    const txStatusModal = document.getElementById('tx-status-modal');
    if (txStatusModal) {
      // Add authentic modal styling
      txStatusModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      
      // Fix close button behavior
      const closeButton = txStatusModal.querySelector('#close-tx-success');
      if (closeButton) {
        closeButton.classList.add('tw-ripple');
        
        closeButton.addEventListener('click', function() {
          txStatusModal.style.display = 'none';
          showToast('Transaction completed');
        });
      }
    }
  }
  
  // Fix token detail view for complete authenticity
  function fixTokenDetailView() {
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail) return;
    
    // Fix header
    const detailHeader = tokenDetail.querySelector('.detail-header');
    if (detailHeader) {
      detailHeader.style.backgroundColor = 'white';
      detailHeader.style.borderBottom = 'none';
      detailHeader.style.paddingTop = '10px';
      detailHeader.style.paddingBottom = '10px';
    }
    
    // Fix token symbol and name
    const detailSymbol = document.getElementById('detail-symbol');
    const detailFullname = document.getElementById('detail-fullname');
    
    if (detailSymbol) {
      detailSymbol.style.fontSize = '24px';
      detailSymbol.style.fontWeight = '600';
      detailSymbol.style.textAlign = 'center';
      detailSymbol.style.marginBottom = '2px';
    }
    
    if (detailFullname) {
      detailFullname.style.fontSize = '12px';
      detailFullname.style.color = '#8A939D';
      detailFullname.style.textAlign = 'center';
      
      // Ensure format is "COIN | TokenName"
      if (!detailFullname.textContent.includes('|')) {
        const tokenName = detailFullname.textContent;
        detailFullname.textContent = `COIN | ${tokenName}`;
      }
    }
    
    // Fix send/receive buttons
    const actions = tokenDetail.querySelectorAll('.detail-action');
    actions.forEach(action => {
      action.classList.add('tw-ripple');
      
      const actionIcon = action.querySelector('i');
      if (actionIcon) {
        actionIcon.style.backgroundColor = 'rgba(51, 117, 187, 0.08)';
        actionIcon.style.color = '#3375BB';
      }
    });
    
    // Remove all network badges from token detail view
    const badges = tokenDetail.querySelectorAll('.chain-badge, .chain-badge-fixed');
    badges.forEach(badge => {
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    });
  }
  
  // Fix network badges
  function fixNetworkBadges() {
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
          
          badge.appendChild(badgeImg);
          tokenIcon.appendChild(badge);
        }
        
        // Position correctly
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
      } else if (badge && !shouldHaveBadge) {
        // Remove badge if token shouldn't have one
        badge.parentNode.removeChild(badge);
      }
    });
    
    // Hide badges on send/receive screens
    document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
      if (!screen) return;
      
      const badges = screen.querySelectorAll('.chain-badge, .chain-badge-fixed');
      badges.forEach(badge => {
        badge.style.display = 'none';
      });
    });
  }
  
  // Connect screens for seamless navigation
  function connectScreens() {
    // Connect send button
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        navigateToScreen('send-screen');
      });
    }
    
    // Connect receive button
    const receiveButton = document.getElementById('receive-button');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        navigateToScreen('receive-screen');
      });
    }
    
    // Connect history button
    const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    if (historyButton) {
      historyButton.addEventListener('click', function() {
        navigateToScreen('history-screen');
      });
    }
    
    // Connect token detail actions
    const detailSendButton = document.querySelector('#token-detail .detail-action:nth-child(1)');
    const detailReceiveButton = document.querySelector('#token-detail .detail-action:nth-child(2)');
    
    if (detailSendButton) {
      detailSendButton.addEventListener('click', function() {
        navigateToScreen('send-screen');
      });
    }
    
    if (detailReceiveButton) {
      detailReceiveButton.addEventListener('click', function() {
        navigateToScreen('receive-screen');
      });
    }
  }
  
  // Optimize performance
  function optimizePerformance() {
    // Remove redundant event listeners by using event delegation
    const walletScreen = document.getElementById('wallet-screen');
    if (walletScreen) {
      // Delegate token list clicks
      const tokenList = document.getElementById('token-list');
      if (tokenList) {
        // Remove direct listeners from tokens
        const tokens = tokenList.querySelectorAll('.token-item');
        tokens.forEach(token => {
          const newToken = token.cloneNode(true);
          token.parentNode.replaceChild(newToken, token);
        });
        
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
      }
    }
    
    // Prevent passive event listener warnings
    document.addEventListener('touchstart', function(){}, {passive: true});
    document.addEventListener('touchmove', function(){}, {passive: true});
  }
  
  // Add authentic touch feedback effects
  function addAuthenticTouchFeedback() {
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
        
        // For demo, fill with a placeholder address
        const addressInput = document.getElementById('recipient-address');
        if (addressInput) {
          addressInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        }
      });
    });
  }
  
  // Navigate to screen with proper transition
  function navigateToScreen(screenId) {
    // First hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.style.display = 'none';
      screen.classList.add('hidden');
    });
    
    // Then show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.style.display = 'flex';
      targetScreen.classList.remove('hidden');
    }
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
  
  // Generate a random transaction hash (hex format)
  function generateRandomHash() {
    let hash = '0x';
    const characters = '0123456789abcdef';
    for (let i = 0; i < 64; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
  }
})();
