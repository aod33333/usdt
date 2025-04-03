/**
 * TrustWallet - Complete Fix Script
 * This script repairs all functionality in the Trust Wallet demo
 */

console.log('🔧 TrustWallet: Starting comprehensive fix script...');

// Add these to the beginning of your fix.js file

// Fix for "enhanceHomeScreen is not defined"
window.enhanceHomeScreen = function() {
  console.log("Enhancing home screen");
  // Basic implementation to prevent errors
  return Promise.resolve();
};

// Fix for "navigateTo is not defined" 
window.navigateTo = function(targetScreenId, fromScreenId) {
  console.log(`Navigating to ${targetScreenId} from ${fromScreenId || 'unknown'}`);
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.style.display = 'none';
    screen.classList.add('hidden');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(targetScreenId);
  if (targetScreen) {
    targetScreen.style.display = 'flex';
    targetScreen.classList.remove('hidden');
    
    // Set return to screen
    if (fromScreenId) {
      targetScreen.dataset.returnTo = fromScreenId;
    }
    
    // Apply specific fixes based on the target screen
    setTimeout(() => {
      if (targetScreenId === 'token-detail' && window.fixTokenDetailPage) 
        window.fixTokenDetailPage();
      if (targetScreenId === 'send-screen' && window.fixSendScreen) 
        window.fixSendScreen();
      if (targetScreenId === 'receive-screen' && window.fixReceiveScreen) 
        window.fixReceiveScreen();
      if (window.centerHeaderTitles) 
        window.centerHeaderTitles();
    }, 50);
    
    return true;
  } else {
    console.error(`Target screen ${targetScreenId} not found`);
    return false;
  }
};

// Fix for "fixNetworkBadges is not defined"
window.fixNetworkBadges = function() {
  console.log("Fixing network badges");
  
  // Style all network filters
  document.querySelectorAll('.networks-filter .all-networks').forEach(filter => {
    if (filter) {
      filter.style.display = 'inline-flex';
      filter.style.alignItems = 'center';
      filter.style.background = '#F5F5F5';
      filter.style.borderRadius = '16px';
      filter.style.padding = '6px 12px';
      filter.style.fontSize = '12px';
      filter.style.color = '#5F6C75';
      filter.style.margin = '8px 16px';
      filter.style.fontWeight = '500';
    }
  });
  
  // Add network badges to tokens
  const networkMapping = {
    'usdt': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'twt': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
    'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'matic': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
    'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
  };
  
  document.querySelectorAll('.token-item').forEach(item => {
    const tokenId = item.getAttribute('data-token-id');
    if (!tokenId || !networkMapping[tokenId]) return;
    
    const tokenIcon = item.querySelector('.token-icon');
    if (!tokenIcon) return;
    
    // Add badge if missing
    let badge = tokenIcon.querySelector('.chain-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'chain-badge';
      
      const badgeImg = document.createElement('img');
      badgeImg.src = networkMapping[tokenId];
      badgeImg.alt = tokenId.toUpperCase() + ' Network';
      
      badge.appendChild(badgeImg);
      tokenIcon.appendChild(badge);
      
      // Style the badge
      badge.style.display = 'block';
      badge.style.position = 'absolute';
      badge.style.bottom = '-4px';
      badge.style.right = '-4px';
      badge.style.width = '18px';
      badge.style.height = '18px';
      badge.style.borderRadius = '50%';
      badge.style.backgroundColor = 'white';
      badge.style.border = '2px solid white';
      badge.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      badge.style.zIndex = '1000';
    }
  });
  
  return Promise.resolve();
};

// Essential utility functions
function formatTokenAmount(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  // Format based on size
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + 'K';
  } else if (amount >= 1) {
    return amount.toFixed(2);
  } else {
    // For small values, show more precision
    return amount.toFixed(6);
  }
}

function formatCurrency(value) {
  if (isNaN(value)) return '$0.00';
  
  // Format based on size
  if (value >= 1000000) {
    return '$' + (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return '$' + (value / 1000).toFixed(2) + 'K';
  } else {
    return '$' + value.toFixed(2);
  }
}

function shortenAddress(address) {
  if (!address) return '';
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

// Global navigation function
window.navigateTo = function(targetScreenId, fromScreenId) {
  console.log(`Navigating to ${targetScreenId} from ${fromScreenId || 'unknown'}`);
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.style.display = 'none';
    screen.classList.add('hidden');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(targetScreenId);
  if (targetScreen) {
    targetScreen.style.display = 'flex';
    targetScreen.classList.remove('hidden');
    
    // Set return to screen
    if (fromScreenId) {
      targetScreen.dataset.returnTo = fromScreenId;
    }
    
    // Apply specific fixes based on the target screen
    setTimeout(() => {
      if (targetScreenId === 'token-detail') fixTokenDetailPage();
      if (targetScreenId === 'send-screen') fixSendScreen();
      if (targetScreenId === 'receive-screen') fixReceiveScreen();
      centerHeaderTitles();
    }, 50);
    
    return true;
  } else {
    console.error(`Target screen ${targetScreenId} not found`);
    return false;
  }
};

// Essential format utilities
window.FormatUtils = {
  formatCurrency: formatCurrency,
  formatTokenAmount: formatTokenAmount,
  shortenAddress: shortenAddress
};

// Show toast notification
window.showToast = function(message, duration = 2000) {
  // Remove any existing toast
  const existingToast = document.querySelector('.tw-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
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
};

// Fix Token List Click Handlers
window.fixTokenListClickHandlers = function() {
  const tokenList = document.getElementById('token-list');
  if (!tokenList) return;
  
  // Clear and recreate click handlers
  tokenList.querySelectorAll('.token-item').forEach(item => {
    const newItem = item.cloneNode(true);
    if (item.parentNode) {
      item.parentNode.replaceChild(newItem, item);
    }
    
    // Add new click handler
    newItem.addEventListener('click', function() {
      const tokenId = this.getAttribute('data-token-id');
      if (tokenId) {
        window.showTokenDetail(tokenId);
      }
    });
  });
};

// Fix screen rendering issues
window.fixBottomTabs = function() {
  console.log("Fixing bottom tabs");
  const bottomTabs = document.querySelector('.bottom-tabs');
  if (!bottomTabs) {
    console.log('Bottom tabs not found, creating them');
    const newBottomTabs = document.createElement('div');
    newBottomTabs.className = 'bottom-tabs';
    newBottomTabs.innerHTML = `
      <div class="tab-item active">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </div>
      <div class="tab-item">
        <i class="fas fa-chart-line"></i>
        <span>Trending</span>
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
    
    // Add click handlers
    newBottomTabs.querySelectorAll('.tab-item').forEach((tab, index) => {
      tab.addEventListener('click', function() {
        newBottomTabs.querySelectorAll('.tab-item').forEach(t => {
          t.classList.remove('active');
        });
        this.classList.add('active');
        
        if (index === 0) {
          window.navigateTo('wallet-screen');
        } else {
          const tabName = this.querySelector('span').textContent;
          window.showToast(`${tabName} coming soon`);
        }
      });
    });
  }
  return Promise.resolve();
};

// Fix token detail page
window.fixTokenDetailPage = function() {
  console.log("Fixing token detail page");
  const tokenDetail = document.getElementById('token-detail');
  if (!tokenDetail) return;
  
  // Only rebuild if empty
  if (!tokenDetail.querySelector('.token-detail-content')) {
    tokenDetail.innerHTML = `
      <div class="detail-header">
        <button class="back-button">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="token-detail-title">
          <h2 id="detail-symbol">BTC</h2>
          <span id="detail-fullname">Bitcoin</span>
        </div>
        <div class="header-icons">
          <button class="icon-button">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      
      <div class="token-detail-content">
        <div class="token-detail-icon-container">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Token Logo" id="token-detail-icon" class="token-detail-large-icon">
        </div>
        
        <div class="token-detail-balance">
          <h2 id="token-balance-amount">0.00 BTC</h2>
          <p id="token-balance-value">$0.00</p>
        </div>
        
        <div class="token-detail-actions">
          <div class="detail-action">
            <i class="fas fa-arrow-up"></i>
            <span>Send</span>
          </div>
          <div class="detail-action">
            <i class="fas fa-arrow-down"></i>
            <span>Receive</span>
          </div>
          <div class="detail-action">
            <i class="fas fa-exchange-alt"></i>
            <span>Swap</span>
          </div>
          <div class="detail-action">
            <i class="fas fa-chart-line"></i>
            <span>Activity</span>
          </div>
        </div>
        
        <div class="transaction-header">
          <h3>Transactions</h3>
          <button class="filter-button">
            <i class="fas fa-filter"></i>
          </button>
        </div>
        
        <div id="transaction-list" class="transaction-list">
          <!-- Transactions will be dynamically populated -->
        </div>
        
        <div class="no-transactions" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
          <div class="no-tx-icon">
            <i class="fas fa-inbox" style="font-size: 40px; color: #8A939D; opacity: 0.5;"></i>
          </div>
          <p style="margin-top: 16px; color: #5F6C75;">No transactions yet</p>
        </div>
        
        <div class="token-price-info">
          <div class="current-price">
            <h3 id="token-price-symbol">BTC Price</h3>
            <div class="price-with-change">
              <span id="token-current-price">$0.00</span>
              <span id="token-price-change" class="positive">+0.00%</span>
            </div>
            <span class="price-timeframe">Past 24 hours</span>
          </div>
          <div class="price-disclaimer">
            Past performance is not a reliable indicator of future results. Assets can go down as well as up.
          </div>
        </div>
      </div>
    `;
    
    // Connect back button
    const backButton = tokenDetail.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', function() {
        window.navigateTo('wallet-screen');
      });
    }
    
    // Connect action buttons
    const sendButton = tokenDetail.querySelector('.detail-action:nth-child(1)');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        const tokenSymbol = document.getElementById('detail-symbol');
        const tokenId = tokenSymbol ? tokenSymbol.textContent.toLowerCase() : 'btc';
        window.activeSendTokenId = tokenId;
        window.navigateTo('send-screen');
      });
    }
    
    const receiveButton = tokenDetail.querySelector('.detail-action:nth-child(2)');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        window.navigateTo('receive-screen');
      });
    }
  }
  
  // Fix price section to stick at bottom
  const priceSection = tokenDetail.querySelector('.token-price-info');
  if (priceSection) {
    priceSection.style.position = 'sticky';
    priceSection.style.bottom = '0';
    priceSection.style.backgroundColor = 'white';
    priceSection.style.zIndex = '50';
    priceSection.style.paddingBottom = '80px';
    priceSection.style.marginBottom = '0';
    priceSection.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.05)';
  }
};

// Fix send screen
window.fixSendScreen = function() {
  console.log("Fixing send screen");
  const sendScreen = document.getElementById('send-screen');
  if (!sendScreen) return;
  
  if (!sendScreen.querySelector('.send-content')) {
    sendScreen.innerHTML = `
      <div class="screen-header">
        <button class="back-button" aria-label="Go back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 id="send-token-title">Send Token</h2>
      </div>
      <div class="send-content">
        <div class="form-group">
          <label for="recipient-address">Recipient Address</label>
          <div class="address-input">
            <input type="text" 
              id="recipient-address" 
              placeholder="Wallet Address or ENS">
            <button class="paste-button">Paste</button>
            <button class="scan-button">
              <i class="fas fa-qrcode"></i>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="send-amount">Amount</label>
          <div class="amount-input">
            <input type="text" 
              id="send-amount" 
              placeholder="0">
            <button class="max-button">Max</button>
          </div>
          <div id="available-balance">
            Available: <span id="max-amount">0</span> 
            <span id="max-symbol">USDT</span>
          </div>
        </div>
        <button id="continue-send" class="send-button">Continue</button>
      </div>
    `;
    
    // Connect back button
    const backButton = sendScreen.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', function() {
        window.navigateTo('wallet-screen');
      });
    }
    
    // Connect continue button
    const continueButton = sendScreen.querySelector('#continue-send');
    if (continueButton) {
      continueButton.addEventListener('click', function() {
        showTransactionModal();
      });
    }
    
    // Connect paste button
    const pasteButton = sendScreen.querySelector('.paste-button');
    if (pasteButton) {
      pasteButton.addEventListener('click', function() {
        const addressInput = document.getElementById('recipient-address');
        if (addressInput) {
          addressInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
          window.showToast('Demo address pasted');
        }
      });
    }
    
    // Connect max button
    const maxButton = sendScreen.querySelector('.max-button');
    if (maxButton) {
      maxButton.addEventListener('click', function() {
        const amountInput = document.getElementById('send-amount');
        const maxAmount = document.getElementById('max-amount');
        
        if (amountInput && maxAmount) {
          amountInput.value = maxAmount.textContent;
        }
      });
    }
  }
  
  // Update token selection
  const tokenId = window.activeSendTokenId || 'usdt';
  const activeWallet = window.activeWallet || 'main';
  
  // Try to find token in wallet data
  if (window.currentWalletData && window.currentWalletData[activeWallet]) {
    const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    
    if (token) {
      const maxAmount = document.getElementById('max-amount');
      const maxSymbol = document.getElementById('max-symbol');
      const sendTokenTitle = document.getElementById('send-token-title');
      
      if (maxAmount) maxAmount.textContent = token.amount.toFixed(6);
      if (maxSymbol) maxSymbol.textContent = token.symbol;
      if (sendTokenTitle) sendTokenTitle.textContent = 'Send ' + token.symbol;
      
      // Create token selection row if not present
      createTokenSelectionRow(token, sendScreen);
    }
  }
  
  return Promise.resolve();
};

function createTokenSelectionRow(token, sendScreen) {
  if (!token || !sendScreen) return;
  
  // Check if token selection row exists
  const sendContent = sendScreen.querySelector('.send-content');
  let tokenSelectionRow = sendScreen.querySelector('.token-selection-row');
  
  if (!tokenSelectionRow && sendContent) {
    // Create token selection row
    tokenSelectionRow = document.createElement('div');
    tokenSelectionRow.className = 'token-selection-row';
    tokenSelectionRow.innerHTML = `
      <div class="token-icon">
        <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="${token.name}">
      </div>
      <div class="token-info-column">
        <div class="token-name-row">
          <span class="selected-token-name">${token.symbol}</span>
          <span class="network-badge-pill">${token.network || 'Unknown Network'}</span>
        </div>
        <div class="token-fullname">${token.name}</div>
      </div>
      <div class="token-change-button">
        <i class="fas fa-chevron-right"></i>
      </div>
    `;
    
    // Insert at beginning of send content
    if (sendContent.firstChild) {
      sendContent.insertBefore(tokenSelectionRow, sendContent.firstChild);
    } else {
      sendContent.appendChild(tokenSelectionRow);
    }
    
    // Add click handler
    tokenSelectionRow.addEventListener('click', function() {
      window.navigateTo('send-token-select', 'send-screen');
    });
  }
}

function showTransactionModal() {
  const txStatusModal = document.getElementById('tx-status-modal');
  if (!txStatusModal) return;
  
  txStatusModal.style.display = 'flex';
  
  const pendingView = document.getElementById('tx-pending');
  const successView = document.getElementById('tx-success');
  
  if (pendingView) pendingView.classList.remove('hidden');
  if (successView) successView.classList.add('hidden');
  
  // Simulate processing
  setTimeout(() => {
    if (pendingView) pendingView.classList.add('hidden');
    if (successView) successView.classList.remove('hidden');
    
    // Fix close button
    const closeBtn = document.getElementById('close-tx-success');
    if (closeBtn) {
      closeBtn.onclick = function() {
        txStatusModal.style.display = 'none';
        window.navigateTo('wallet-screen');
      };
    }
  }, 2000);
}

// Fix receive screen
window.fixReceiveScreen = function() {
  console.log("Fixing receive screen");
  const receiveScreen = document.getElementById('receive-screen');
  if (!receiveScreen) return;
  
  if (!receiveScreen.querySelector('#receive-token-list')) {
    receiveScreen.innerHTML = `
      <div class="screen-header">
        <button class="back-button" aria-label="Go back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>Receive</h2>
      </div>
      <div class="search-container">
        <div class="search-bar token-search">
          <i class="fas fa-search"></i>
          <input type="text" id="receive-search-input" placeholder="Search" aria-label="Search tokens">
        </div>
      </div>
      <div class="networks-filter">
        <div class="all-networks">
          All Networks <i class="fas fa-chevron-down"></i>
        </div>
      </div>
      <div id="receive-token-list" class="token-list">
        <!-- Tokens will be dynamically populated here -->
      </div>
    `;
    
    // Connect back button
    const backButton = receiveScreen.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', function() {
        window.navigateTo('wallet-screen');
      });
    }
    
    // Populate token list
    populateReceiveTokenList();
  }
  
  return Promise.resolve();
};

function populateReceiveTokenList() {
  const tokenList = document.getElementById('receive-token-list');
  if (!tokenList) return;
  
  // Clear list
  tokenList.innerHTML = '';
  
  // Get active wallet
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
  
  if (!wallet || !wallet.tokens || !wallet.tokens.length) {
    console.error('No tokens available for receive screen');
    return;
  }
  
  // Create token items
  wallet.tokens.forEach(token => {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.setAttribute('data-token-id', token.id);
    
    // Show network badge for specific tokens
    const showBadge = ['usdt', 'twt', 'bnb'].includes(token.id);
    const networkBadge = showBadge ? 
      `<div class="chain-badge"><img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain"></div>` : '';
    
    tokenItem.innerHTML = `
      <div class="token-icon">
        <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="${token.name}">
        ${networkBadge}
      </div>
      <div class="token-info">
        <div class="token-name">${token.symbol}</div>
        <div class="token-price">
          ${token.network || token.name}
        </div>
      </div>
      <div class="receive-actions">
        <button class="qr-button">
          <i class="fas fa-qrcode"></i>
        </button>
      </div>
    `;
    
    // Add click handler to show receive details
    tokenItem.addEventListener('click', function() {
      showReceiveDetails(token.id);
    });
    
    tokenList.appendChild(tokenItem);
  });
}

function showReceiveDetails(tokenId) {
  const receiveScreen = document.getElementById('receive-screen');
  if (!receiveScreen) return;
  
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
  const token = wallet && wallet.tokens.find(t => t.id === tokenId);
  
  if (!token) {
    console.error('Token not found for receive details');
    return;
  }
  
  // Update receive screen to show QR code
  receiveScreen.innerHTML = `
    <div class="screen-header">
      <button class="back-button" aria-label="Go back">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2>Receive ${token.symbol}</h2>
    </div>
    <div class="receive-content">
      <div class="token-selection">
        <div class="token-icon-large">
          <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="${token.name}" style="width: 48px; height: 48px; border-radius: 50%;">
        </div>
        <h3>${token.name} (${token.symbol})</h3>
        <div class="token-address-badge">
          <span class="network-badge-pill">${token.network || 'Unknown Network'}</span>
          <span class="contract-address">${shortenAddress('0xC65B6...E90a51')}</span>
        </div>
      </div>
      <div class="qr-code-container">
        <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="Wallet QR Code" style="width: 200px; height: 200px;">
      </div>
      <div class="wallet-address-container">
        <input 
          type="text" 
          id="wallet-address" 
          readonly 
          value="0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71"
          placeholder="Your wallet address"
        >
        <button class="copy-address-button">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
    </div>
  `;
  
  // Connect back button
  const backButton = receiveScreen.querySelector('.back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      // Return to token selection view
      window.fixReceiveScreen();
    });
  }
  
  // Add copy button handler
  const copyButton = receiveScreen.querySelector('.copy-address-button');
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      const address = document.getElementById('wallet-address').value;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(address)
          .then(() => window.showToast('Address copied to clipboard'))
          .catch(err => console.error('Failed to copy:', err));
      } else {
        // Fallback
        const input = document.getElementById('wallet-address');
        input.select();
        document.execCommand('copy');
        window.showToast('Address copied to clipboard');
      }
    });
  }
}

// Center header titles in all screens
window.centerHeaderTitles = function() {
  document.querySelectorAll('.screen-header h2').forEach(title => {
    title.style.position = 'absolute';
    title.style.left = '0';
    title.style.right = '0';
    title.style.textAlign = 'center';
    title.style.width = 'auto';
    title.style.margin = '0 auto';
  });
  
  // Ensure back buttons are above the title
  document.querySelectorAll('.screen-header .back-button').forEach(button => {
    button.style.position = 'relative';
    button.style.zIndex = '2';
  });
};

// Fix scrolling on all screens
window.fixScrollingOnAllScreens = function() {
  const scrollableScreens = [
    'send-screen',
    'receive-screen',
    'history-screen',
    'send-token-select',
    'token-detail'
  ];
  
  scrollableScreens.forEach(screenId => {
    const screen = document.getElementById(screenId);
    if (!screen) return;
    
    // Enable scrolling
    screen.style.overflowY = 'auto';
    screen.style.overflowX = 'hidden';
    
   // Find content container in the screen
    const contentElement = screen.querySelector('.send-content, .receive-content, .screen-content, .token-detail-content, .token-list');
    if (contentElement) {
      // Ensure proper padding at the bottom for scrolling
      contentElement.style.paddingBottom = '80px';
    }
  });
  
  // Special handling for token list to ensure smooth scrolling
  const tokenLists = document.querySelectorAll('.token-list');
  tokenLists.forEach(list => {
    list.style.overflowY = 'auto';
    list.style.overflowX = 'hidden';
    list.style.webkitOverflowScrolling = 'touch'; // For smooth scrolling on iOS
  });
};

// Setup token detail view functionality
window.showTokenDetail = function(tokenId) {
  console.log(`Showing token detail for: ${tokenId}`);
  
  // Make sure token detail page exists
  const tokenDetail = document.getElementById('token-detail');
  if (!tokenDetail) {
    console.error('Token detail element not found');
    return;
  }
  
  // Fix structure if needed
  fixTokenDetailPage();
  
  // Get token data
  const activeWallet = window.activeWallet || 'main';
  
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) {
    console.error('Wallet data not available');
    return;
  }
  
  const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
  
  if (!token) {
    console.error(`Token ${tokenId} not found in wallet ${activeWallet}`);
    return;
  }
  
  // Update token details
  const detailSymbol = document.getElementById('detail-symbol');
  const detailFullname = document.getElementById('detail-fullname');
  const tokenDetailIcon = document.getElementById('token-detail-icon');
  const tokenBalanceAmount = document.getElementById('token-balance-amount');
  const tokenBalanceValue = document.getElementById('token-balance-value');
  const tokenPriceSymbol = document.getElementById('token-price-symbol');
  const tokenCurrentPrice = document.getElementById('token-current-price');
  const tokenPriceChange = document.getElementById('token-price-change');
  
  if (detailSymbol) detailSymbol.textContent = token.symbol;
  if (detailFullname) detailFullname.textContent = token.name;
  if (tokenDetailIcon) tokenDetailIcon.src = window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon;
  if (tokenBalanceAmount) tokenBalanceAmount.textContent = token.amount.toFixed(6) + ' ' + token.symbol;
  if (tokenBalanceValue) tokenBalanceValue.textContent = window.FormatUtils.formatCurrency(token.value);
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
  
  // Add sample transactions
  populateSampleTransactions(token);
  
  // Navigate to detail screen
  window.navigateTo('token-detail', 'wallet-screen');
};

// Add sample transactions for token detail view
function populateSampleTransactions(token) {
  if (!token) return;
  
  const transactionList = document.getElementById('transaction-list');
  const noTransactions = document.querySelector('.no-transactions');
  
  if (!transactionList) return;
  
  // Clear existing transactions
  transactionList.innerHTML = '';
  
  // Create sample transactions
  const transactions = [
    {
      type: 'receive',
      amount: token.amount * 0.1,
      value: token.price * (token.amount * 0.1),
      date: '2025-04-01 14:30'
    },
    {
      type: 'send',
      amount: token.amount * 0.05,
      value: token.price * (token.amount * 0.05),
      date: '2025-03-29 10:15'
    },
    {
      type: 'receive',
      amount: token.amount * 0.2,
      value: token.price * (token.amount * 0.2),
      date: '2025-03-25 09:45'
    }
  ];
  
  // Add transactions to list
  transactions.forEach(tx => {
    const txElement = document.createElement('div');
    txElement.className = `transaction-item transaction-${tx.type}`;
    
    txElement.innerHTML = `
      <div class="transaction-icon">
        <i class="fas fa-${tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
      </div>
      <div class="transaction-info">
        <div class="transaction-type">${tx.type === 'receive' ? 'Received' : 'Sent'} ${token.symbol}</div>
        <div class="transaction-date">${tx.date}</div>
      </div>
      <div class="transaction-amount">
        <div class="transaction-value ${tx.type === 'receive' ? 'positive' : 'negative'}">
          ${tx.type === 'receive' ? '+' : '-'}${formatTokenAmount(tx.amount)} ${token.symbol}
        </div>
        <div class="transaction-usd">${formatCurrency(tx.value)}</div>
      </div>
    `;
    
    // Add click handler
    txElement.addEventListener('click', function() {
      showTransactionExplorer(tx, token);
    });
    
    transactionList.appendChild(txElement);
  });
  
  // Toggle visibility of no transactions message
  if (noTransactions) {
    noTransactions.style.display = transactions.length > 0 ? 'none' : 'flex';
  }
}

// Show transaction in the explorer overlay
function showTransactionExplorer(tx, token) {
  const explorerOverlay = document.getElementById('explorer-overlay');
  if (!explorerOverlay) return;
  
  // Create random tx hash
  const txHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Prepare addresses
  const fromAddress = tx.type === 'receive' ? 
    '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) : 
    '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71';
    
  const toAddress = tx.type === 'receive' ? 
    '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71' : 
    '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Update explorer details
  const elements = {
    'explorer-tx-hash': txHash.substring(0, 18) + '...',
    'explorer-from': fromAddress,
    'explorer-to': toAddress,
    'explorer-timestamp': tx.date,
    'explorer-token-amount': tx.amount.toFixed(6) + ' ' + token.symbol,
    'explorer-value': '0 ' + token.symbol
  };
  
  // Set values in explorer
  for (const id in elements) {
    const element = document.getElementById(id);
    if (element) element.textContent = elements[id];
  }
  
  // Update token icon
  const tokenIcon = explorerOverlay.querySelector('.explorer-token-icon img');
  if (tokenIcon) {
    tokenIcon.src = window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon;
  }
  
  // Show explorer overlay
  explorerOverlay.style.display = 'flex';
  explorerOverlay.classList.remove('hidden');
  
  // Fix back button
  const backButton = explorerOverlay.querySelector('.explorer-back-button');
  if (backButton) {
    backButton.onclick = function() {
      explorerOverlay.style.display = 'none';
    };
  }
}

// Get token logo URL helper function
window.getTokenLogoUrl = function(tokenId) {
  const logoUrls = {
    'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
    'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'matic': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
    'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
    'uni': 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  };
  
  return logoUrls[tokenId] || 'https://cryptologos.cc/logos/bitcoin-btc-logo.png';
};

// Fix wallet selection
function fixWalletSelector() {
  const walletSelector = document.querySelector('.wallet-selector');
  if (!walletSelector) return;
  
  // Create cloned element to avoid event duplication
  const newSelector = walletSelector.cloneNode(true);
  walletSelector.parentNode.replaceChild(newSelector, walletSelector);
  
  newSelector.addEventListener('click', function() {
    const walletName = this.querySelector('.wallet-name');
    if (!walletName) return;
    
    // Cycle through wallets
    const walletOrder = ['main', 'secondary', 'business'];
    const currentIndex = walletOrder.indexOf(window.activeWallet);
    const nextIndex = (currentIndex + 1) % walletOrder.length;
    window.activeWallet = walletOrder[nextIndex];
    
    // Update wallet name
    const walletNames = {
      'main': 'Main Wallet 1',
      'secondary': 'Mnemonic 2',
      'business': 'Mnemonic 3'
    };
    
    walletName.textContent = walletNames[window.activeWallet];
    
    // Update wallet UI
    if (typeof window.populateMainWalletTokenList === 'function') {
      window.populateMainWalletTokenList();
    }
    
    // Update total balance display
    const totalBalance = document.getElementById('total-balance');
    if (totalBalance && window.currentWalletData && window.currentWalletData[window.activeWallet]) {
      totalBalance.textContent = window.FormatUtils.formatCurrency(window.currentWalletData[window.activeWallet].totalBalance);
    }
    
    window.showToast('Switched to ' + walletName.textContent);
  });
}

// Fix lock screen
function fixLockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  if (!lockScreen) return;
  
  // Setup numpad
  const numpadKeys = lockScreen.querySelectorAll('.numpad-key');
  const dots = lockScreen.querySelectorAll('.dot');
  
  numpadKeys.forEach(key => {
    // Remove existing handlers
    const newKey = key.cloneNode(true);
    key.parentNode.replaceChild(newKey, key);
    
    // Add new handler
    newKey.addEventListener('click', function() {
      const keyValue = this.getAttribute('data-key');
      
      if (keyValue === 'back') {
        // Backspace
        window.passcodeEntered = window.passcodeEntered.slice(0, -1);
      } else if (keyValue === 'bio') {
        // Show biometric overlay
        const biometricOverlay = document.getElementById('biometric-overlay');
        if (biometricOverlay) {
          biometricOverlay.style.display = 'flex';
          
          // Simulate successful authentication
          setTimeout(() => {
            biometricOverlay.style.display = 'none';
            window.navigateTo('wallet-screen');
          }, 2000);
        }
        return;
      } else {
        // Add digit to passcode
        window.passcodeEntered += keyValue;
        
        // Auto-unlock if correct passcode entered
        if (window.passcodeEntered.length === 6) {
          setTimeout(() => {
            if (window.passcodeEntered === window.correctPasscode) {
              window.navigateTo('wallet-screen');
            } else {
              // Shake effect for wrong passcode
              const dotsContainer = lockScreen.querySelector('.passcode-dots');
              if (dotsContainer) {
                dotsContainer.classList.add('shake');
                setTimeout(() => {
                  dotsContainer.classList.remove('shake');
                  window.passcodeEntered = '';
                  updateDots();
                }, 500);
              }
            }
          }, 200);
        }
      }
      
      // Update dots display
      updateDots();
    });
  });
  
  // Function to update dots display
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('filled', index < window.passcodeEntered.length);
    });
  }
  
  // Fix unlock button
  const unlockButton = lockScreen.querySelector('#unlock-button');
  if (unlockButton) {
    unlockButton.addEventListener('click', function() {
      window.navigateTo('wallet-screen');
    });
  }
}

// Fix Quick Actions
function fixQuickActions() {
  // Handle send button
  const sendButton = document.getElementById('send-button');
  if (sendButton) {
    sendButton.addEventListener('click', function() {
      window.activeSendTokenId = 'usdt'; // Default to USDT
      window.navigateTo('send-screen');
    });
  }
  
  // Handle receive button
  const receiveButton = document.getElementById('receive-button');
  if (receiveButton) {
    receiveButton.addEventListener('click', function() {
      window.navigateTo('receive-screen');
    });
  }
  
  // Handle other action buttons
  document.querySelectorAll('.action-circle').forEach(button => {
    if (!button.id || (button.id !== 'send-button' && button.id !== 'receive-button')) {
      button.addEventListener('click', function() {
        const actionName = this.querySelector('span').textContent;
        window.showToast(`${actionName} coming soon`);
      });
    }
  });
}

// Fix visibility toggle
function fixVisibilityToggle() {
  const visibilityToggle = document.querySelector('.visibility-toggle');
  if (!visibilityToggle) return;
  
  visibilityToggle.addEventListener('click', function() {
    const icon = this.querySelector('i');
    const isVisible = icon.classList.contains('fa-eye');
    
    if (isVisible) {
      // Hide balance
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      
      // Hide balances
      const balanceAmount = document.getElementById('total-balance');
      if (balanceAmount) {
        window.cachedBalance = balanceAmount.textContent;
        balanceAmount.textContent = '••••••';
      }
      
      // Hide token amounts
      document.querySelectorAll('.token-balance').forEach(function(tokenBalance) {
        tokenBalance.dataset.originalAmount = tokenBalance.textContent;
        tokenBalance.textContent = '••••••';
      });
      
      // Hide token values
      document.querySelectorAll('.token-value').forEach(function(tokenValue) {
        tokenValue.dataset.originalValue = tokenValue.textContent;
        tokenValue.textContent = '••••••';
      });
    } else {
      // Show balance
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      
      // Restore balances
      const balanceAmount = document.getElementById('total-balance');
      if (balanceAmount && window.cachedBalance) {
        balanceAmount.textContent = window.cachedBalance;
      }
      
      // Restore token amounts
      document.querySelectorAll('.token-balance').forEach(function(tokenBalance) {
        if (tokenBalance.dataset.originalAmount) {
          tokenBalance.textContent = tokenBalance.dataset.originalAmount;
        }
      });
      
      // Restore token values
      document.querySelectorAll('.token-value').forEach(function(tokenValue) {
        if (tokenValue.dataset.originalValue) {
          tokenValue.textContent = tokenValue.dataset.originalValue;
        }
      });
    }
  });
}

// Populate main wallet token list
window.populateMainWalletTokenList = function() {
  const tokenList = document.getElementById('token-list');
  if (!tokenList) {
    console.error('Token list element not found');
    return;
  }
  
  // Clear list
  tokenList.innerHTML = '';
  
  // Get active wallet data
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
  
  if (!wallet || !wallet.tokens || !wallet.tokens.length) {
    console.error('No tokens available for main wallet display');
    return;
  }
  
  // Create token items
  wallet.tokens.forEach(token => {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.setAttribute('data-token-id', token.id);
    
    // Format numbers for display
    const formattedAmount = token.amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
    
    const formattedValue = window.FormatUtils ? 
      window.FormatUtils.formatCurrency(token.value) : 
      '$' + token.value.toFixed(2);
    
    // Network badge for specific tokens
    const showBadge = ['usdt', 'twt', 'bnb'].includes(token.id);
    const networkBadge = showBadge ? 
      `<div class="chain-badge"><img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain"></div>` : '';
    
    tokenItem.innerHTML = `
      <div class="token-icon">
        <img src="${window.getTokenLogoUrl(token.id)}" alt="${token.name}">
        ${networkBadge}
      </div>
      <div class="token-info">
        <div class="token-name">${token.symbol}</div>
        <div class="token-price">
          ${token.name}
          <span class="token-price-change ${token.change >= 0 ? 'positive' : 'negative'}">
            ${token.change >= 0 ? '+' : ''}${token.change}%
          </span>
        </div>
      </div>
      <div class="token-amount">
        <div class="token-balance">${formattedAmount} ${token.symbol}</div>
        <div class="token-value">${formattedValue}</div>
      </div>
    `;
    
    // Add click handler
    tokenItem.addEventListener('click', function() {
      window.showTokenDetail(token.id);
    });
    
    tokenList.appendChild(tokenItem);
  });
};

// Apply all fixes
function applyAllFixes() {
  console.log("Applying all critical fixes...");
  
  // Fix formatting utilities first
  window.FormatUtils = window.FormatUtils || {
    formatCurrency: formatCurrency,
    formatTokenAmount: formatTokenAmount,
    shortenAddress: shortenAddress
  };
  
  // Fix token logo utility
  if (!window.getTokenLogoUrl) {
    window.getTokenLogoUrl = getTokenLogoUrl;
  }
  
  // Fix core UI elements
  centerHeaderTitles();
  fixBottomTabs();
  fixScrollingOnAllScreens();
  
  // Fix functional components
  fixTokenDetailPage();
  fixSendScreen();
  fixReceiveScreen();
  
  // Fix interactivity
  fixWalletSelector();
  fixQuickActions();
  fixVisibilityToggle();
  fixLockScreen();
  
  // Fix click handlers
  fixTokenListClickHandlers();
  
  // Initialize wallet if needed
  if (!window.currentWalletData) {
    initializeWalletData();
  }
  
  // Populate UI elements
  populateMainWalletTokenList();
  
  console.log("All critical fixes applied successfully!");
}

// Initialize wallet data if missing
function initializeWalletData() {
  window.currentWalletData = {
    main: {
      totalBalance: 250000,
      tokens: [
        {
          id: 'btc',
          name: 'Bitcoin',
          symbol: 'BTC',
          network: 'Bitcoin',
          icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
          amount: 1.5,
          value: 125976.11,
          price: 83984.74,
          change: -0.59,
          chainBadge: null
        },
        {
          id: 'eth',
          name: 'Ethereum',
          symbol: 'ETH',
          network: 'Ethereum',
          icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
          amount: 10,
          value: 19738.10,
          price: 1973.81,
          change: -0.71,
          chainBadge: null
        },
        {
          id: 'usdt',
          name: 'Tether',
          symbol: 'USDT',
          network: 'BNB Smart Chain',
          icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          amount: 50000,
          value: 50000,
          price: 1.00,
          change: 0.00,
          chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
        },
        {
          id: 'bnb',
          name: 'Binance Coin',
          symbol: 'BNB',
          network: 'BNB Smart Chain',
          icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
          amount: 25,
          value: 7500.75,
          price: 300.03,
          change: 1.25,
          chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
        }
      ]
    },
    secondary: {
      totalBalance: 75000,
      tokens: [
        {
          id: 'usdt',
          name: 'Tether',
          symbol: 'USDT',
          network: 'Polygon',
          icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          amount: 25000,
          value: 25000,
          price: 1.00,
          change: 0.00,
          chainBadge: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
        },
        {
          id: 'matic',
          name: 'Polygon',
          symbol: 'MATIC',
          network: 'Polygon',
          icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
          amount: 500,
          value: 750.25,
          price: 1.50,
          change: 1.25,
          chainBadge: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
        }
      ]
    },
    business: {
      totalBalance: 100000,
      tokens: [
        {
          id: 'usdt',
          name: 'Tether',
          symbol: 'USDT',
          network: 'Ethereum',
          icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          amount: 75000,
          value: 75000,
          price: 1.00,
          change: 0.00,
          chainBadge: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        },
        {
          id: 'eth',
          name: 'Ethereum',
          symbol: 'ETH',
          network: 'Ethereum',
          icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
          amount: 5,
          value: 9869.05,
          price: 1973.81,
          change: -0.71,
          chainBadge: null
        }
      ]
    }
  };
  
  // Make backup copy for reset functionality
  window.originalWalletData = JSON.parse(JSON.stringify(window.currentWalletData));
}

// Run fixes on load
document.addEventListener('DOMContentLoaded', function() {
  // Wait a moment for other scripts to initialize
  setTimeout(applyAllFixes, 500);
  
  // Add welcome toast
  setTimeout(function() {
    window.showToast('Trust Wallet demo loaded successfully');
  }, 1000);
});

console.log('🔧 TrustWallet: Fix script loaded successfully');
