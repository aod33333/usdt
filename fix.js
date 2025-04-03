/**
 * TrustWallet.js - Fix Script
 * 
 * This script fixes the errors in combined1.js by implementing missing functions
 * and repairing broken functionality.
 */

console.log('TrustWallet Fix: Applying critical fixes...');

// Define missing functions that are being called but not defined
window.fixBottomTabs = function() {
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
  }
  return Promise.resolve();
};

window.fixNetworkFilters = function() {
  const networkFilters = document.querySelectorAll('.networks-filter');
  networkFilters.forEach(filter => {
    if (filter && !filter.getAttribute('data-fixed')) {
      const allNetworks = filter.querySelector('.all-networks');
      if (allNetworks) {
        allNetworks.style.display = 'inline-flex';
        allNetworks.style.alignItems = 'center';
        allNetworks.style.background = '#F5F5F5';
        allNetworks.style.borderRadius = '16px';
        allNetworks.style.padding = '6px 12px';
        allNetworks.style.fontSize = '12px';
        allNetworks.style.color = '#5F6C75';
        allNetworks.style.margin = '8px 16px';
        allNetworks.style.fontWeight = '500';
      }
      filter.setAttribute('data-fixed', 'true');
    }
  });
  return Promise.resolve();
};

window.fixReceiveScreen = function() {
  const receiveScreen = document.getElementById('receive-screen');
  if (!receiveScreen) return Promise.resolve();
  
  // Check if we need to populate the token list
  const tokenList = receiveScreen.querySelector('#receive-token-list');
  if (tokenList && tokenList.children.length === 0) {
    if (typeof window.populateReceiveTokenList === 'function') {
      window.populateReceiveTokenList();
    }
  }
  
  return Promise.resolve();
};

window.fixSendScreen = function() {
  const sendScreen = document.getElementById('send-screen');
  if (!sendScreen) return Promise.resolve();
  
  // Update token selection display if needed
  const tokenId = window.activeSendTokenId || 'usdt';
  
  // Find token data
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  if (!token) return Promise.resolve();
  
  // Check if token selection row exists
  let tokenSelectionRow = sendScreen.querySelector('.token-selection-row');
  
  if (!tokenSelectionRow) {
    // Create token selection row
    const sendContent = sendScreen.querySelector('.send-content');
    if (!sendContent) return Promise.resolve();
    
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
  
  return Promise.resolve();
};

window.fixSendTokenSelectionDisplay = function() {
  const sendTokenSelect = document.getElementById('send-token-select');
  if (!sendTokenSelect) return;
  
  // Ensure token list is populated
  const tokenList = sendTokenSelect.querySelector('#select-token-list');
  if (tokenList && tokenList.children.length === 0) {
    if (typeof window.tokenSelectionManager?.populateTokenList === 'function') {
      window.tokenSelectionManager.populateTokenList();
    }
  }
};

window.fixReceiveTokenDisplay = function() {
  const receiveScreen = document.getElementById('receive-screen');
  if (!receiveScreen) return;
  
  // Ensure token list is populated
  const tokenList = receiveScreen.querySelector('#receive-token-list');
  if (tokenList && tokenList.children.length === 0) {
    if (typeof window.populateReceiveTokenList === 'function') {
      window.populateReceiveTokenList();
    }
  }
};

window.fixHeaderIconsAlignment = function() {
  const headerIcons = document.querySelectorAll('.screen-header .icon-button');
  headerIcons.forEach(icon => {
    icon.style.position = 'relative';
    icon.style.zIndex = '2';
  });
};

// Rebuild missing send screen
window.rebuildSendScreen = function() {
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
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('wallet-screen');
        }
      });
    }
    
    // Connect continue button
    const continueButton = sendScreen.querySelector('#continue-send');
    if (continueButton) {
      continueButton.addEventListener('click', function() {
        // Show transaction pending modal
        const txStatusModal = document.getElementById('tx-status-modal');
        if (txStatusModal) {
          txStatusModal.style.display = 'flex';
          txStatusModal.classList.remove('hidden');
          
          const pendingView = document.getElementById('tx-pending');
          const successView = document.getElementById('tx-success');
          
          if (pendingView) pendingView.classList.remove('hidden');
          if (successView) successView.classList.add('hidden');
          
          // Simulate transaction processing
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
  
  // Update max amount based on selected token
  const tokenId = window.activeSendTokenId || 'usdt';
  const maxAmount = document.getElementById('max-amount');
  const maxSymbol = document.getElementById('max-symbol');
  const sendTokenTitle = document.getElementById('send-token-title');
  
  // Find active token
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  if (token) {
    if (maxAmount) maxAmount.textContent = token.amount.toFixed(6);
    if (maxSymbol) maxSymbol.textContent = token.symbol;
    if (sendTokenTitle) sendTokenTitle.textContent = 'Send ' + token.symbol;
  }
};

// Rebuild history screen
window.rebuildHistoryScreen = function() {
  const historyScreen = document.getElementById('history-screen');
  if (!historyScreen) return;
  
  if (!historyScreen.querySelector('.history-transaction-list')) {
    historyScreen.innerHTML = `
      <div class="screen-header">
        <button class="back-button" aria-label="Go back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>Transaction History</h2>
      </div>
      <div class="networks-filter">
        <div class="all-networks">
          All Networks <i class="fas fa-chevron-down"></i>
        </div>
      </div>
      <div class="history-transaction-list" id="history-transaction-list">
        <!-- Transactions will be dynamically populated -->
      </div>
    `;
    
    // Connect back button
    const backButton = historyScreen.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', function() {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('wallet-screen');
        }
      });
    }
    
    // Populate with demo transactions
    const txList = historyScreen.querySelector('#history-transaction-list');
    if (txList) {
      populateHistoryWithDemoTransactions(txList);
    }
  }
};

// Rebuild send token select screen
window.rebuildSendTokenSelectScreen = function() {
  const sendTokenSelect = document.getElementById('send-token-select');
  if (!sendTokenSelect) return;
  
  if (!sendTokenSelect.querySelector('#select-token-list')) {
    sendTokenSelect.innerHTML = `
      <div class="screen-header">
        <button class="back-button" aria-label="Go back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>Select Token</h2>
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
    
    // Connect back button
    const backButton = sendTokenSelect.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', function() {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('send-screen');
        }
      });
    }
    
    // Populate token list
    const tokenList = sendTokenSelect.querySelector('#select-token-list');
    if (tokenList) {
      populateTokenSelectList(tokenList);
    }
  }
};

// Rebuild receive screen
window.rebuildReceiveScreen = function() {
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
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('wallet-screen');
        }
      });
    }
    
    // Populate token list
    const tokenList = receiveScreen.querySelector('#receive-token-list');
    if (tokenList) {
      populateReceiveTokenList(tokenList);
    }
  }
};

// Helper functions for populating content

// Populate token select list
function populateTokenSelectList(container) {
  if (!container) return;
  
  // Get tokens from current wallet
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData?.[activeWallet];
  
  if (!wallet || !wallet.tokens) {
    container.innerHTML = '<div class="empty-state">No tokens available</div>';
    return;
  }
  
  // Create token items
  container.innerHTML = '';
  wallet.tokens.forEach(token => {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.setAttribute('data-token-id', token.id);
    
    tokenItem.innerHTML = `
      <div class="token-icon">
        <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="${token.name}">
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
        <div class="token-balance">${token.amount.toLocaleString()} ${token.symbol}</div>
        <div class="token-value">${token.value.toLocaleString()}</div>
      </div>
    `;
    
    // Add click handler
    tokenItem.addEventListener('click', function() {
      const tokenId = this.getAttribute('data-token-id');
      window.activeSendTokenId = tokenId;
      window.navigateTo('send-screen');
    });
    
    container.appendChild(tokenItem);
  });
}

// Populate receive token list
function populateReceiveTokenList(container) {
  if (!container) return;
  
  // Get tokens from current wallet
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData?.[activeWallet];
  
  if (!wallet || !wallet.tokens) {
    container.innerHTML = '<div class="empty-state">No tokens available</div>';
    return;
  }
  
  // Create token items
  container.innerHTML = '';
  wallet.tokens.forEach(token => {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.setAttribute('data-token-id', token.id);
    
    tokenItem.innerHTML = `
      <div class="token-icon">
        <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="${token.name}">
      </div>
      <div class="token-info">
        <div class="token-name">${token.symbol}</div>
        <div class="token-price">${token.network || token.name}</div>
      </div>
      <div class="receive-actions">
        <button class="qr-button">
          <i class="fas fa-qrcode"></i>
        </button>
      </div>
    `;
    
    // Add click handler
    tokenItem.addEventListener('click', function() {
      const tokenId = this.getAttribute('data-token-id');
      showReceiveDetails(tokenId, container.closest('#receive-screen'));
    });
    
    container.appendChild(tokenItem);
  });
}

// Show receive details
function showReceiveDetails(tokenId, receiveScreen) {
  if (!receiveScreen) return;
  
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData?.[activeWallet];
  const token = wallet?.tokens.find(t => t.id === tokenId);
  
  if (!token) return;
  
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
        <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="Wallet QR Code" style="width: 200px; height: 200px; background-color: #f5f5f5; padding: 20px; border-radius: 12px;">
      </div>
      <div class="wallet-address-container">
        <input 
          type="text" 
          id="wallet-address" 
          readonly 
          value="0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71"
          placeholder="Your wallet address"
          style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ddd;"
        >
        <button class="copy-address-button" style="margin-top: 8px; background-color: #f5f5f5; padding: 8px 16px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px;">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
    </div>
  `;
  
  // Connect back button
  const backButton = receiveScreen.querySelector('.back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      // Rebuild receive screen with token list
      window.rebuildReceiveScreen();
    });
  }
  
  // Connect copy button
  const copyButton = receiveScreen.querySelector('.copy-address-button');
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      const address = document.getElementById('wallet-address')?.value;
      if (address) {
        window.showToast('Address copied to clipboard');
      }
    });
  }
}

// Populate history with demo transactions
function populateHistoryWithDemoTransactions(container) {
  if (!container) return;
  
  // Create a few sample transactions
  const transactions = [
    {
      type: 'receive',
      symbol: 'BTC',
      amount: 0.1,
      value: 8398.47,
      date: '2025-03-22 14:30'
    },
    {
      type: 'send',
      symbol: 'USDT',
      amount: 1000,
      value: 1000,
      date: '2025-03-21 10:15'
    },
    {
      type: 'receive',
      symbol: 'ETH',
      amount: 0.5,
      value: 986.91,
      date: '2025-03-20 09:45'
    },
    {
      type: 'send',
      symbol: 'BNB',
      amount: 2,
      value: 600.06,
      date: '2025-03-18 16:20'
    }
  ];
  
  // Create transaction elements
  container.innerHTML = '';
  transactions.forEach(tx => {
    const txItem = document.createElement('div');
    txItem.className = 'transaction-item transaction-' + tx.type;
    
    txItem.innerHTML = `
      <div class="transaction-icon">
        <i class="fas fa-${tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
      </div>
      <div class="transaction-info">
        <div class="transaction-type">${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.symbol}</div>
        <div class="transaction-date">${tx.date}</div>
      </div>
      <div class="transaction-amount">
        <div class="transaction-value ${tx.type === 'receive' ? 'positive' : 'negative'}">
          ${tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(6)} ${tx.symbol}
        </div>
        <div class="transaction-usd">${tx.value.toLocaleString()}</div>
      </div>
    `;
    
    // Add click handler
    txItem.addEventListener('click', function() {
      // Show transaction details in explorer overlay
      const explorerOverlay = document.getElementById('explorer-overlay');
      if (!explorerOverlay) return;
      
      // Update explorer with transaction details
      const explorerTxHash = document.getElementById('explorer-tx-hash');
      const explorerFrom = document.getElementById('explorer-from');
      const explorerTo = document.getElementById('explorer-to');
      const explorerTimestamp = document.getElementById('explorer-timestamp');
      const explorerTokenAmount = document.getElementById('explorer-token-amount');
      
      if (explorerTxHash) explorerTxHash.textContent = '0x' + Math.random().toString(16).substring(2, 18) + '...';
      if (explorerFrom) explorerFrom.textContent = tx.type === 'receive' ? 
        '0x' + Math.random().toString(16).substring(2, 42) : 
        '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71';
      if (explorerTo) explorerTo.textContent = tx.type === 'receive' ? 
        '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71' : 
        '0x' + Math.random().toString(16).substring(2, 42);
      if (explorerTimestamp) explorerTimestamp.textContent = tx.date;
      if (explorerTokenAmount) explorerTokenAmount.textContent = tx.amount.toFixed(6) + ' ' + tx.symbol;
      
      // Update token icon
      const tokenIcon = explorerOverlay.querySelector('.explorer-token-icon img');
      if (tokenIcon && window.getTokenLogoUrl) {
        tokenIcon.src = window.getTokenLogoUrl(tx.symbol.toLowerCase());
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
    });
    
    container.appendChild(txItem);
  });
}

// Helper to shorten an address
function shortenAddress(address) {
  if (!address) return '';
  
  if (address.includes('...')) return address; // Already shortened
  
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

// Critical fix for token detail page
window.fixTokenDetailPage = function() {
  const tokenDetail = document.getElementById('token-detail');
  if (!tokenDetail) return;
  
  // If the token detail page is empty or broken, completely rebuild it
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
      
      <div class="no-transactions" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px; text-align: center;">
        <div class="no-tx-icon">
          <i class="fas fa-inbox" style="font-size: 40px; color: #8A939D; opacity: 0.5;"></i>
        </div>
        <p style="margin-top: 16px; color: #5F6C75;">No transactions yet</p>
        <div class="explorer-link" style="margin-top: 8px;">
          <a href="#" style="color: #3375BB; text-decoration: none;">View in Explorer</a>
        </div>
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
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('wallet-screen');
      }
    });
  }
  
  // Connect send action
  const sendAction = tokenDetail.querySelector('.detail-action:nth-child(1)');
  if (sendAction) {
    sendAction.addEventListener('click', function() {
      const tokenSymbol = document.getElementById('detail-symbol');
      const tokenId = tokenSymbol ? tokenSymbol.textContent.toLowerCase() : 'btc';
      window.activeSendTokenId = tokenId;
      
      // Ensure send screen is rebuilt before navigating
      window.rebuildSendScreen();
      
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('send-screen');
      }
    });
  }
  
  // Connect receive action
  const receiveAction = tokenDetail.querySelector('.detail-action:nth-child(2)');
  if (receiveAction) {
    receiveAction.addEventListener('click', function() {
      // Ensure receive screen is rebuilt before navigating
      window.rebuildReceiveScreen();
      
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('receive-screen');
      }
    });
  }
  
  // Add demo transactions
  const transactionList = tokenDetail.querySelector('#transaction-list');
  if (transactionList) {
    // Get current token details
    const tokenSymbol = document.getElementById('detail-symbol')?.textContent || 'BTC';
    
    // Create sample transactions for this token
    const transactions = [
      {
        type: 'receive',
        symbol: tokenSymbol,
        amount: 0.05,
        value: tokenSymbol === 'BTC' ? 4199.24 : 98.69,
        date: '2025-03-22 14:30'
      },
      {
        type: 'send',
        symbol: tokenSymbol,
        amount: 0.02,
        value: tokenSymbol === 'BTC' ? 1679.69 : 39.48,
        date: '2025-03-19 10:15'
      },
      {
        type: 'receive',
        symbol: tokenSymbol,
        amount: 0.1,
        value: tokenSymbol === 'BTC' ? 8398.47 : 197.38,
        date: '2025-03-15 09:45'
      }
    ];
    
    // Populate transaction list
    transactionList.innerHTML = '';
    transactions.forEach(tx => {
      const txItem = document.createElement('div');
      txItem.className = 'transaction-item transaction-' + tx.type;
      
      txItem.innerHTML = `
        <div class="transaction-icon">
          <i class="fas fa-${tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
        </div>
        <div class="transaction-info">
          <div class="transaction-type">${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.symbol}</div>
          <div class="transaction-date">${tx.date}</div>
        </div>
        <div class="transaction-amount">
          <div class="transaction-value ${tx.type === 'receive' ? 'positive' : 'negative'}">
            ${tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(6)} ${tx.symbol}
          </div>
          <div class="transaction-usd">${tx.value.toLocaleString()}</div>
        </div>
      `;
      
      transactionList.appendChild(txItem);
    });
    
    // Show transaction list and hide empty state
    const noTransactions = tokenDetail.querySelector('.no-transactions');
    if (noTransactions) {
      noTransactions.style.display = 'none';
    }
    
    // Connect transaction click handlers
    tokenDetail.querySelectorAll('.transaction-item').forEach(item => {
      item.addEventListener('click', function() {
        const txType = this.classList.contains('transaction-receive') ? 'receive' : 'send';
        showTransactionDetails(txType, tokenSymbol);
      });
    });
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

// Fix the showTokenDetail function to properly rebuild the screen
window.showTokenDetail = function(tokenId) {
  const tokenDetail = document.getElementById('token-detail');
  if (!tokenDetail) return;
  
  // First navigate to token detail screen
  if (typeof window.navigateTo === 'function') {
    window.navigateTo('token-detail', 'wallet-screen');
  } else {
    // Manual navigation if navigateTo is broken
    document.querySelectorAll('.screen').forEach(screen => {
      screen.style.display = 'none';
      screen.classList.add('hidden');
    });
    
    tokenDetail.style.display = 'flex';
    tokenDetail.classList.remove('hidden');
  }
  
  // Make sure token detail page has structure
  fixTokenDetailPage();
  
  // Update token details
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  if (token) {
    // Update text elements
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
    if (tokenDetailIcon && window.getTokenLogoUrl) tokenDetailIcon.src = window.getTokenLogoUrl(token.id);
    if (tokenBalanceAmount) tokenBalanceAmount.textContent = token.amount.toFixed(6) + ' ' + token.symbol;
    if (tokenBalanceValue) tokenBalanceValue.textContent = '
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
        
        <div class="no-transactions" style="display: flex;">
          <div class="no-tx-icon">
            <i class="fas fa-inbox"></i>
          </div>
          <p>No transactions yet</p>
          <div class="explorer-link">
            <a href="#">View in Explorer</a>
          </div>
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
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('wallet-screen');
        }
      });
    }
    
    // Connect action buttons
    const sendButton = tokenDetail.querySelector('.detail-action:nth-child(1)');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        const tokenSymbol = document.getElementById('detail-symbol');
        const tokenId = tokenSymbol ? tokenSymbol.textContent.toLowerCase() : 'btc';
        window.activeSendTokenId = tokenId;
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('send-screen');
        }
      });
    }
    
    const receiveButton = tokenDetail.querySelector('.detail-action:nth-child(2)');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('receive-screen');
        }
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

// Center header titles in all screens
window.centerHeaderTitles = function() {
  const headers = document.querySelectorAll('.screen-header');
  headers.forEach(header => {
    const title = header.querySelector('h2');
    if (title) {
      title.style.position = 'absolute';
      title.style.left = '0';
      title.style.right = '0';
      title.style.textAlign = 'center';
      title.style.width = 'auto';
      title.style.margin = '0 auto';
      title.style.zIndex = '1';
      title.style.pointerEvents = 'none';
    }
    
    const backButton = header.querySelector('.back-button');
    if (backButton) {
      backButton.style.position = 'relative';
      backButton.style.zIndex = '2';
    }
    
    const iconButton = header.querySelector('.icon-button');
    if (iconButton) {
      iconButton.style.position = 'relative';
      iconButton.style.zIndex = '2';
    }
  });
};

// Add network badges to tokens
window.addNetworkBadgesToTokens = function() {
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
  
  const tokenItems = document.querySelectorAll('.token-item');
  tokenItems.forEach(item => {
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
      badge.style.overflow = 'visible';
    }
  });
};

// Enhance network badges
window.enhanceNetworkBadges = function() {
  const networkFilters = document.querySelectorAll('.networks-filter');
  networkFilters.forEach(filter => {
    if (filter) {
      const allNetworks = filter.querySelector('.all-networks');
      if (allNetworks) {
        allNetworks.style.display = 'inline-flex';
        allNetworks.style.alignItems = 'center';
        allNetworks.style.background = '#F5F5F5';
        allNetworks.style.borderRadius = '16px';
        allNetworks.style.padding = '6px 12px';
        allNetworks.style.fontSize = '12px';
        allNetworks.style.color = '#5F6C75';
        allNetworks.style.margin = '8px 16px';
        allNetworks.style.fontWeight = '500';
      }
    }
  });

  addNetworkBadgesToTokens();
};

// Function to ensure navigateTo exists and works
if (typeof window.navigateTo !== 'function') {
  window.navigateTo = function(targetScreenId, fromScreenId) {
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
      
      console.log('Navigated to ' + targetScreenId + (fromScreenId ? ' from ' + fromScreenId : ''));
      
      // Apply specific fixes based on the target screen
      setTimeout(() => {
        if (targetScreenId === 'token-detail') fixTokenDetailPage();
        if (targetScreenId === 'send-screen') fixSendScreen();
        if (targetScreenId === 'receive-screen') fixReceiveScreen();
        if (targetScreenId === 'send-token-select' || 
            targetScreenId === 'receive-screen' || 
            targetScreenId === 'history-screen') {
          fixNetworkFilters();
        }
        centerHeaderTitles();
      }, 50);
      
      return true;
    } else {
      console.error('Target screen ' + targetScreenId + ' not found');
      return false;
    }
  };
}

// Make sure showToast exists
if (typeof window.showToast !== 'function') {
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
}

// Update the token balance
function updateTokenBalance(tokenId) {
  if (!tokenId) return;
  
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return;
  
  const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
  if (!token) return;
  
  const tokenBalance = document.getElementById('token-balance-amount');
  const tokenValue = document.getElementById('token-balance-value');
  const tokenPriceSymbol = document.getElementById('token-price-symbol');
  const tokenCurrentPrice = document.getElementById('token-current-price');
  const tokenPriceChange = document.getElementById('token-price-change');
  
  if (tokenBalance) tokenBalance.textContent = token.amount.toFixed(6) + ' ' + token.symbol;
  if (tokenValue) tokenValue.textContent = '$' + token.value.toLocaleString();
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
}

// Fix showTokenDetail to ensure it works correctly
if (typeof window.showTokenDetail === 'function') {
  const originalShowTokenDetail = window.showTokenDetail;
  window.showTokenDetail = function(tokenId) {
    // Call original function
    const result = originalShowTokenDetail.call(this, tokenId);
    
    // Apply fixes
    setTimeout(() => {
      fixTokenDetailPage();
      updateTokenBalance(tokenId);
    }, 100);
    
    return result;
  };
} else {
  window.showTokenDetail = function(tokenId) {
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail) return;
    
    // Make sure token detail page has structure
    fixTokenDetailPage();
    
    // Update token details
    const token = getTokenData(tokenId);
    if (!token) return;
    
    // Update text elements
    updateTokenDetail(token);
    
    // Navigate to token detail screen
    navigateTo('token-detail', 'wallet-screen');
  };
}

// Helper function to get token data
function getTokenData(tokenId) {
  if (!tokenId) return null;
  
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return null;
  
  return window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
}

// Helper to update token detail view
function updateTokenDetail(token) {
  if (!token) return;
  
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
  if (tokenBalanceValue) tokenBalanceValue.textContent = '$' + token.value.toLocaleString();
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
}

// Make sure back buttons work
function fixBackButtons() {
  const backButtons = document.querySelectorAll('.back-button');
  
  backButtons.forEach(button => {
    if (button && !button.getAttribute('data-fixed-back-button')) {
      button.addEventListener('click', function() {
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        let returnTo = 'wallet-screen';
        if (currentScreen.dataset.returnTo) {
          returnTo = currentScreen.dataset.returnTo;
        }
        
        if (typeof window.navigateTo === 'function') {
          window.navigateTo(returnTo);
        }
      });
      
      button.setAttribute('data-fixed-back-button', 'true');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('TrustWallet Fix: DOM loaded, applying fixes');
  
  setTimeout(() => {
    // First fix token list click handlers
    fixTokenListClickHandlers();
    
    // Rebuild missing screens
    rebuildSendScreen();
    rebuildHistoryScreen();
    rebuildSendTokenSelectScreen();
    rebuildReceiveScreen();
    
    // Apply visual fixes
    fixTokenDetailPage();
    centerHeaderTitles();
    fixHeaderIconsAlignment();
    enhanceNetworkBadges();
    fixScrollingOnAllScreens();
    fixBackButtons();
    
    console.log('TrustWallet Fix: All screens rebuilt and fixes applied');
  }, 500);
});

// Apply fixes when called from combined1.js
if (typeof window.applyAllEnhancedFixes !== 'function') {
  window.applyAllEnhancedFixes = function() {
    console.log('TrustWallet Fix: Applying all enhanced fixes');
    
    // Rebuild missing screens first
    rebuildSendScreen();
    rebuildHistoryScreen();
    rebuildSendTokenSelectScreen();
    rebuildReceiveScreen();
    
    // Apply all fixes in sequence
    fixBottomTabs()
      .then(() => centerHeaderTitles())
      .then(() => fixHeaderIconsAlignment())
      .then(() => enhanceNetworkBadges())
      .then(() => fixTokenDetailPage())
      .then(() => fixScrollingOnAllScreens())
      .then(() => fixSendTokenSelectionDisplay())
      .then(() => fixReceiveTokenDisplay())
      .then(() => fixBackButtons())
      .then(() => {
        console.log('TrustWallet Fix: All fixes applied successfully');
      })
      .catch(error => {
        console.error('TrustWallet Fix: Error applying fixes', error);
      });
  };
}

// Call the fixes now to ensure immediate repair
setTimeout(() => {
  console.log('TrustWallet Fix: Applying immediate fixes');
  
  // Fix token list to enable click handlers
  fixTokenListClickHandlers();
  
  // Apply all enhanced fixes
  if (typeof window.applyAllEnhancedFixes === 'function') {
    window.applyAllEnhancedFixes();
  }
}, 100);

console.log('TrustWallet Fix: Script loaded successfully');
 + token.value.toLocaleString();
    if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
    if (tokenCurrentPrice) tokenCurrentPrice.textContent = '
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
        
        <div class="no-transactions" style="display: flex;">
          <div class="no-tx-icon">
            <i class="fas fa-inbox"></i>
          </div>
          <p>No transactions yet</p>
          <div class="explorer-link">
            <a href="#">View in Explorer</a>
          </div>
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
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('wallet-screen');
        }
      });
    }
    
    // Connect action buttons
    const sendButton = tokenDetail.querySelector('.detail-action:nth-child(1)');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        const tokenSymbol = document.getElementById('detail-symbol');
        const tokenId = tokenSymbol ? tokenSymbol.textContent.toLowerCase() : 'btc';
        window.activeSendTokenId = tokenId;
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('send-screen');
        }
      });
    }
    
    const receiveButton = tokenDetail.querySelector('.detail-action:nth-child(2)');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('receive-screen');
        }
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

// Center header titles in all screens
window.centerHeaderTitles = function() {
  const headers = document.querySelectorAll('.screen-header');
  headers.forEach(header => {
    const title = header.querySelector('h2');
    if (title) {
      title.style.position = 'absolute';
      title.style.left = '0';
      title.style.right = '0';
      title.style.textAlign = 'center';
      title.style.width = 'auto';
      title.style.margin = '0 auto';
      title.style.zIndex = '1';
      title.style.pointerEvents = 'none';
    }
    
    const backButton = header.querySelector('.back-button');
    if (backButton) {
      backButton.style.position = 'relative';
      backButton.style.zIndex = '2';
    }
    
    const iconButton = header.querySelector('.icon-button');
    if (iconButton) {
      iconButton.style.position = 'relative';
      iconButton.style.zIndex = '2';
    }
  });
};

// Add network badges to tokens
window.addNetworkBadgesToTokens = function() {
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
  
  const tokenItems = document.querySelectorAll('.token-item');
  tokenItems.forEach(item => {
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
      badge.style.overflow = 'visible';
    }
  });
};

// Enhance network badges
window.enhanceNetworkBadges = function() {
  const networkFilters = document.querySelectorAll('.networks-filter');
  networkFilters.forEach(filter => {
    if (filter) {
      const allNetworks = filter.querySelector('.all-networks');
      if (allNetworks) {
        allNetworks.style.display = 'inline-flex';
        allNetworks.style.alignItems = 'center';
        allNetworks.style.background = '#F5F5F5';
        allNetworks.style.borderRadius = '16px';
        allNetworks.style.padding = '6px 12px';
        allNetworks.style.fontSize = '12px';
        allNetworks.style.color = '#5F6C75';
        allNetworks.style.margin = '8px 16px';
        allNetworks.style.fontWeight = '500';
      }
    }
  });

  addNetworkBadgesToTokens();
};

// Function to ensure navigateTo exists and works
if (typeof window.navigateTo !== 'function') {
  window.navigateTo = function(targetScreenId, fromScreenId) {
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
      
      console.log('Navigated to ' + targetScreenId + (fromScreenId ? ' from ' + fromScreenId : ''));
      
      // Apply specific fixes based on the target screen
      setTimeout(() => {
        if (targetScreenId === 'token-detail') fixTokenDetailPage();
        if (targetScreenId === 'send-screen') fixSendScreen();
        if (targetScreenId === 'receive-screen') fixReceiveScreen();
        if (targetScreenId === 'send-token-select' || 
            targetScreenId === 'receive-screen' || 
            targetScreenId === 'history-screen') {
          fixNetworkFilters();
        }
        centerHeaderTitles();
      }, 50);
      
      return true;
    } else {
      console.error('Target screen ' + targetScreenId + ' not found');
      return false;
    }
  };
}

// Make sure showToast exists
if (typeof window.showToast !== 'function') {
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
}

// Update the token balance
function updateTokenBalance(tokenId) {
  if (!tokenId) return;
  
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return;
  
  const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
  if (!token) return;
  
  const tokenBalance = document.getElementById('token-balance-amount');
  const tokenValue = document.getElementById('token-balance-value');
  const tokenPriceSymbol = document.getElementById('token-price-symbol');
  const tokenCurrentPrice = document.getElementById('token-current-price');
  const tokenPriceChange = document.getElementById('token-price-change');
  
  if (tokenBalance) tokenBalance.textContent = token.amount.toFixed(6) + ' ' + token.symbol;
  if (tokenValue) tokenValue.textContent = '$' + token.value.toLocaleString();
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
}

// Fix showTokenDetail to ensure it works correctly
if (typeof window.showTokenDetail === 'function') {
  const originalShowTokenDetail = window.showTokenDetail;
  window.showTokenDetail = function(tokenId) {
    // Call original function
    const result = originalShowTokenDetail.call(this, tokenId);
    
    // Apply fixes
    setTimeout(() => {
      fixTokenDetailPage();
      updateTokenBalance(tokenId);
    }, 100);
    
    return result;
  };
} else {
  window.showTokenDetail = function(tokenId) {
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail) return;
    
    // Make sure token detail page has structure
    fixTokenDetailPage();
    
    // Update token details
    const token = getTokenData(tokenId);
    if (!token) return;
    
    // Update text elements
    updateTokenDetail(token);
    
    // Navigate to token detail screen
    navigateTo('token-detail', 'wallet-screen');
  };
}

// Helper function to get token data
function getTokenData(tokenId) {
  if (!tokenId) return null;
  
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return null;
  
  return window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
}

// Helper to update token detail view
function updateTokenDetail(token) {
  if (!token) return;
  
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
  if (tokenBalanceValue) tokenBalanceValue.textContent = '$' + token.value.toLocaleString();
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
}

// Make sure back buttons work
function fixBackButtons() {
  const backButtons = document.querySelectorAll('.back-button');
  
  backButtons.forEach(button => {
    if (button && !button.getAttribute('data-fixed-back-button')) {
      button.addEventListener('click', function() {
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        let returnTo = 'wallet-screen';
        if (currentScreen.dataset.returnTo) {
          returnTo = currentScreen.dataset.returnTo;
        }
        
        if (typeof window.navigateTo === 'function') {
          window.navigateTo(returnTo);
        }
      });
      
      button.setAttribute('data-fixed-back-button', 'true');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('TrustWallet Fix: DOM loaded, applying fixes');
  
  setTimeout(() => {
    // Rebuild missing screens
    rebuildSendScreen();
    rebuildHistoryScreen();
    rebuildSendTokenSelectScreen();
    rebuildReceiveScreen();
    
    // Apply visual fixes
    fixTokenDetailPage();
    centerHeaderTitles();
    fixHeaderIconsAlignment();
    enhanceNetworkBadges();
    fixScrollingOnAllScreens();
    fixBackButtons();
  }, 500);
});

// Apply fixes when called from combined1.js
if (typeof window.applyAllEnhancedFixes !== 'function') {
  window.applyAllEnhancedFixes = function() {
    console.log('TrustWallet Fix: Applying all enhanced fixes');
    
    // Rebuild missing screens first
    rebuildSendScreen();
    rebuildHistoryScreen();
    rebuildSendTokenSelectScreen();
    rebuildReceiveScreen();
    
    // Apply all fixes in sequence
    fixBottomTabs()
      .then(() => centerHeaderTitles())
      .then(() => fixHeaderIconsAlignment())
      .then(() => enhanceNetworkBadges())
      .then(() => fixTokenDetailPage())
      .then(() => fixScrollingOnAllScreens())
      .then(() => fixSendTokenSelectionDisplay())
      .then(() => fixReceiveTokenDisplay())
      .then(() => fixBackButtons())
      .then(() => {
        console.log('TrustWallet Fix: All fixes applied successfully');
      })
      .catch(error => {
        console.error('TrustWallet Fix: Error applying fixes', error);
      });
  };
}

// Call the fixes now to ensure immediate repair
setTimeout(applyAllEnhancedFixes, 100);

console.log('TrustWallet Fix: Script loaded successfully');
 + token.price.toLocaleString();
    
    if (tokenPriceChange) {
      tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
      tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
    }
  }
};

// Function to show transaction details in explorer
function showTransactionDetails(txType, tokenSymbol) {
  // Show transaction details in explorer overlay
  const explorerOverlay = document.getElementById('explorer-overlay');
  if (!explorerOverlay) return;
  
  // Generate demo transaction data
  const txHash = '0x' + Math.random().toString(16).substring(2, 42);
  const fromAddress = txType === 'receive' ?
    '0x' + Math.random().toString(16).substring(2, 42) :
    '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71';
  const toAddress = txType === 'receive' ?
    '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71' :
    '0x' + Math.random().toString(16).substring(2, 42);
  const timestamp = new Date().toLocaleString();
  const amount = Math.random() * 0.1;
  const value = tokenSymbol === 'BTC' ? amount * 83984.74 : amount * 1973.81;
  
  // Update explorer with transaction details
  const explorerTxHash = document.getElementById('explorer-tx-hash');
  const explorerFrom = document.getElementById('explorer-from');
  const explorerTo = document.getElementById('explorer-to');
  const explorerTimestamp = document.getElementById('explorer-timestamp');
  const explorerTokenAmount = document.getElementById('explorer-token-amount');
  const explorerValue = document.getElementById('explorer-value');
  
  if (explorerTxHash) explorerTxHash.textContent = txHash.substring(0, 18) + '...';
  if (explorerFrom) explorerFrom.textContent = fromAddress;
  if (explorerTo) explorerTo.textContent = toAddress;
  if (explorerTimestamp) explorerTimestamp.textContent = timestamp;
  if (explorerTokenAmount) explorerTokenAmount.textContent = amount.toFixed(6) + ' ' + tokenSymbol;
  if (explorerValue) explorerValue.textContent = '0 ' + (tokenSymbol === 'BTC' ? 'BTC' : 'ETH');
  
  // Update token icon
  const tokenIcon = explorerOverlay.querySelector('.explorer-token-icon img');
  if (tokenIcon && window.getTokenLogoUrl) {
    tokenIcon.src = window.getTokenLogoUrl(tokenSymbol.toLowerCase());
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

// Fix the token list to properly connect to showTokenDetail
function fixTokenListClickHandlers() {
  const tokenList = document.getElementById('token-list');
  if (!tokenList) return;
  
  // Remove any existing handlers to prevent duplicates
  const tokenItems = tokenList.querySelectorAll('.token-item');
  tokenItems.forEach(item => {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
    
    // Add new click handler
    newItem.addEventListener('click', function() {
      const tokenId = this.getAttribute('data-token-id');
      if (tokenId && typeof window.showTokenDetail === 'function') {
        window.showTokenDetail(tokenId);
      }
    });
  });
}
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
        
        <div class="no-transactions" style="display: flex;">
          <div class="no-tx-icon">
            <i class="fas fa-inbox"></i>
          </div>
          <p>No transactions yet</p>
          <div class="explorer-link">
            <a href="#">View in Explorer</a>
          </div>
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
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('wallet-screen');
        }
      });
    }
    
    // Connect action buttons
    const sendButton = tokenDetail.querySelector('.detail-action:nth-child(1)');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        const tokenSymbol = document.getElementById('detail-symbol');
        const tokenId = tokenSymbol ? tokenSymbol.textContent.toLowerCase() : 'btc';
        window.activeSendTokenId = tokenId;
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('send-screen');
        }
      });
    }
    
    const receiveButton = tokenDetail.querySelector('.detail-action:nth-child(2)');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('receive-screen');
        }
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

// Center header titles in all screens
window.centerHeaderTitles = function() {
  const headers = document.querySelectorAll('.screen-header');
  headers.forEach(header => {
    const title = header.querySelector('h2');
    if (title) {
      title.style.position = 'absolute';
      title.style.left = '0';
      title.style.right = '0';
      title.style.textAlign = 'center';
      title.style.width = 'auto';
      title.style.margin = '0 auto';
      title.style.zIndex = '1';
      title.style.pointerEvents = 'none';
    }
    
    const backButton = header.querySelector('.back-button');
    if (backButton) {
      backButton.style.position = 'relative';
      backButton.style.zIndex = '2';
    }
    
    const iconButton = header.querySelector('.icon-button');
    if (iconButton) {
      iconButton.style.position = 'relative';
      iconButton.style.zIndex = '2';
    }
  });
};

// Add network badges to tokens
window.addNetworkBadgesToTokens = function() {
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
  
  const tokenItems = document.querySelectorAll('.token-item');
  tokenItems.forEach(item => {
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
      badge.style.overflow = 'visible';
    }
  });
};

// Enhance network badges
window.enhanceNetworkBadges = function() {
  const networkFilters = document.querySelectorAll('.networks-filter');
  networkFilters.forEach(filter => {
    if (filter) {
      const allNetworks = filter.querySelector('.all-networks');
      if (allNetworks) {
        allNetworks.style.display = 'inline-flex';
        allNetworks.style.alignItems = 'center';
        allNetworks.style.background = '#F5F5F5';
        allNetworks.style.borderRadius = '16px';
        allNetworks.style.padding = '6px 12px';
        allNetworks.style.fontSize = '12px';
        allNetworks.style.color = '#5F6C75';
        allNetworks.style.margin = '8px 16px';
        allNetworks.style.fontWeight = '500';
      }
    }
  });

  addNetworkBadgesToTokens();
};

// Function to ensure navigateTo exists and works
if (typeof window.navigateTo !== 'function') {
  window.navigateTo = function(targetScreenId, fromScreenId) {
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
      
      console.log('Navigated to ' + targetScreenId + (fromScreenId ? ' from ' + fromScreenId : ''));
      
      // Apply specific fixes based on the target screen
      setTimeout(() => {
        if (targetScreenId === 'token-detail') fixTokenDetailPage();
        if (targetScreenId === 'send-screen') fixSendScreen();
        if (targetScreenId === 'receive-screen') fixReceiveScreen();
        if (targetScreenId === 'send-token-select' || 
            targetScreenId === 'receive-screen' || 
            targetScreenId === 'history-screen') {
          fixNetworkFilters();
        }
        centerHeaderTitles();
      }, 50);
      
      return true;
    } else {
      console.error('Target screen ' + targetScreenId + ' not found');
      return false;
    }
  };
}

// Make sure showToast exists
if (typeof window.showToast !== 'function') {
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
}

// Update the token balance
function updateTokenBalance(tokenId) {
  if (!tokenId) return;
  
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return;
  
  const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
  if (!token) return;
  
  const tokenBalance = document.getElementById('token-balance-amount');
  const tokenValue = document.getElementById('token-balance-value');
  const tokenPriceSymbol = document.getElementById('token-price-symbol');
  const tokenCurrentPrice = document.getElementById('token-current-price');
  const tokenPriceChange = document.getElementById('token-price-change');
  
  if (tokenBalance) tokenBalance.textContent = token.amount.toFixed(6) + ' ' + token.symbol;
  if (tokenValue) tokenValue.textContent = '$' + token.value.toLocaleString();
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
}

// Fix showTokenDetail to ensure it works correctly
if (typeof window.showTokenDetail === 'function') {
  const originalShowTokenDetail = window.showTokenDetail;
  window.showTokenDetail = function(tokenId) {
    // Call original function
    const result = originalShowTokenDetail.call(this, tokenId);
    
    // Apply fixes
    setTimeout(() => {
      fixTokenDetailPage();
      updateTokenBalance(tokenId);
    }, 100);
    
    return result;
  };
} else {
  window.showTokenDetail = function(tokenId) {
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail) return;
    
    // Make sure token detail page has structure
    fixTokenDetailPage();
    
    // Update token details
    const token = getTokenData(tokenId);
    if (!token) return;
    
    // Update text elements
    updateTokenDetail(token);
    
    // Navigate to token detail screen
    navigateTo('token-detail', 'wallet-screen');
  };
}

// Helper function to get token data
function getTokenData(tokenId) {
  if (!tokenId) return null;
  
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return null;
  
  return window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
}

// Helper to update token detail view
function updateTokenDetail(token) {
  if (!token) return;
  
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
  if (tokenBalanceValue) tokenBalanceValue.textContent = '$' + token.value.toLocaleString();
  if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol + ' Price';
  if (tokenCurrentPrice) tokenCurrentPrice.textContent = '$' + token.price.toLocaleString();
  
  if (tokenPriceChange) {
    tokenPriceChange.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
    tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
  }
}

// Make sure back buttons work
function fixBackButtons() {
  const backButtons = document.querySelectorAll('.back-button');
  
  backButtons.forEach(button => {
    if (button && !button.getAttribute('data-fixed-back-button')) {
      button.addEventListener('click', function() {
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        let returnTo = 'wallet-screen';
        if (currentScreen.dataset.returnTo) {
          returnTo = currentScreen.dataset.returnTo;
        }
        
        if (typeof window.navigateTo === 'function') {
          window.navigateTo(returnTo);
        }
      });
      
      button.setAttribute('data-fixed-back-button', 'true');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('TrustWallet Fix: DOM loaded, applying fixes');
  
  setTimeout(() => {
    // Rebuild missing screens
    rebuildSendScreen();
    rebuildHistoryScreen();
    rebuildSendTokenSelectScreen();
    rebuildReceiveScreen();
    
    // Apply visual fixes
    fixTokenDetailPage();
    centerHeaderTitles();
    fixHeaderIconsAlignment();
    enhanceNetworkBadges();
    fixScrollingOnAllScreens();
    fixBackButtons();
  }, 500);
});

// Apply fixes when called from combined1.js
if (typeof window.applyAllEnhancedFixes !== 'function') {
  window.applyAllEnhancedFixes = function() {
    console.log('TrustWallet Fix: Applying all enhanced fixes');
    
    // Rebuild missing screens first
    rebuildSendScreen();
    rebuildHistoryScreen();
    rebuildSendTokenSelectScreen();
    rebuildReceiveScreen();
    
    // Apply all fixes in sequence
    fixBottomTabs()
      .then(() => centerHeaderTitles())
      .then(() => fixHeaderIconsAlignment())
      .then(() => enhanceNetworkBadges())
      .then(() => fixTokenDetailPage())
      .then(() => fixScrollingOnAllScreens())
      .then(() => fixSendTokenSelectionDisplay())
      .then(() => fixReceiveTokenDisplay())
      .then(() => fixBackButtons())
      .then(() => {
        console.log('TrustWallet Fix: All fixes applied successfully');
      })
      .catch(error => {
        console.error('TrustWallet Fix: Error applying fixes', error);
      });
  };
}

// Call the fixes now to ensure immediate repair
setTimeout(applyAllEnhancedFixes, 100);

console.log('TrustWallet Fix: Script loaded successfully');
