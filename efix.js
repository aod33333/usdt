/**
 * TRUST WALLET EMERGENCY FIX
 * This script fixes the critical errors in the wallet application
 */

(function() {
  console.log("EMERGENCY FIX: Starting wallet repair");
  
  // Define missing functions that are causing console errors
  window.fixBottomTabs = function() { return Promise.resolve(); }
  window.fixNetworkFilters = function() { return Promise.resolve(); }
  window.fixReceiveScreen = function() { return Promise.resolve(); }
  window.fixSendScreen = function() { return Promise.resolve(); }
  window.navigateTo = function(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => {
      s.style.display = 'none';
    });
    
    // Show requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.style.display = 'flex';
      screen.classList.remove('hidden');
    }
  };
  
  // Directly fix token list click handlers
  const fixTokenClicks = function() {
    const tokenItems = document.querySelectorAll('#token-list .token-item');
    tokenItems.forEach(item => {
      item.addEventListener('click', function() {
        const tokenId = this.getAttribute('data-token-id');
        if (!tokenId) return;
        
        // Get token data
        const wallet = window.currentWalletData?.main;
        if (!wallet) return;
        
        const token = wallet.tokens.find(t => t.id === tokenId);
        if (!token) return;
        
        // Show token detail screen
        const tokenDetail = document.getElementById('token-detail');
        if (!tokenDetail) return;
        
        // Create token detail content if missing
        if (!tokenDetail.querySelector('.token-detail-content')) {
          tokenDetail.innerHTML = `
            <div class="detail-header">
              <button class="back-button">
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="token-detail-title">
                <h2 id="detail-symbol">${token.symbol}</h2>
                <span id="detail-fullname">${token.name}</span>
              </div>
              <div class="header-icons">
                <button class="icon-button">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            
            <div class="token-detail-content">
              <div class="token-detail-icon-container">
                <img src="${token.icon}" alt="${token.name}" id="token-detail-icon" class="token-detail-large-icon">
              </div>
              
              <div class="token-detail-balance">
                <h2 id="token-balance-amount">${token.amount.toFixed(6)} ${token.symbol}</h2>
                <p id="token-balance-value">$${token.value.toLocaleString()}</p>
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
                  <h3 id="token-price-symbol">${token.symbol} Price</h3>
                  <div class="price-with-change">
                    <span id="token-current-price">$${token.price.toLocaleString()}</span>
                    <span id="token-price-change" class="${token.change >= 0 ? 'positive' : 'negative'}">${token.change >= 0 ? '+' : ''}${token.change}%</span>
                  </div>
                  <span class="price-timeframe">Past 24 hours</span>
                </div>
                <div class="price-disclaimer">
                  Past performance is not a reliable indicator of future results. Assets can go down as well as up.
                </div>
              </div>
            </div>
          `;
          
          // Add back button functionality
          const backButton = tokenDetail.querySelector('.back-button');
          if (backButton) {
            backButton.addEventListener('click', function() {
              document.getElementById('token-detail').style.display = 'none';
              document.getElementById('wallet-screen').style.display = 'flex';
            });
          }
        } else {
          // Update existing token detail content
          const detailSymbol = tokenDetail.querySelector('#detail-symbol');
          if (detailSymbol) detailSymbol.textContent = token.symbol;
          
          const detailFullname = tokenDetail.querySelector('#detail-fullname');
          if (detailFullname) detailFullname.textContent = token.name;
          
          const tokenDetailIcon = tokenDetail.querySelector('#token-detail-icon');
          if (tokenDetailIcon) tokenDetailIcon.src = token.icon;
          
          const tokenBalanceAmount = tokenDetail.querySelector('#token-balance-amount');
          if (tokenBalanceAmount) tokenBalanceAmount.textContent = `${token.amount.toFixed(6)} ${token.symbol}`;
          
          const tokenBalanceValue = tokenDetail.querySelector('#token-balance-value');
          if (tokenBalanceValue) tokenBalanceValue.textContent = `$${token.value.toLocaleString()}`;
          
          const tokenPriceSymbol = tokenDetail.querySelector('#token-price-symbol');
          if (tokenPriceSymbol) tokenPriceSymbol.textContent = `${token.symbol} Price`;
          
          const tokenCurrentPrice = tokenDetail.querySelector('#token-current-price');
          if (tokenCurrentPrice) tokenCurrentPrice.textContent = `$${token.price.toLocaleString()}`;
          
          const tokenPriceChange = tokenDetail.querySelector('#token-price-change');
          if (tokenPriceChange) {
            tokenPriceChange.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
            tokenPriceChange.className = token.change >= 0 ? 'positive' : 'negative';
          }
        }
        
        // Show token detail screen
        document.querySelectorAll('.screen').forEach(s => {
          s.style.display = 'none';
        });
        
        tokenDetail.style.display = 'flex';
      });
    });
  };
  
  // Fix send screen
  const fixSendScreen = function() {
    const sendScreen = document.getElementById('send-screen');
    if (!sendScreen) return;
    
    if (!sendScreen.querySelector('.screen-header')) {
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
              Available: <span id="max-amount">50000</span> 
              <span id="max-symbol">USDT</span>
            </div>
          </div>
          <button id="continue-send" class="send-button">Continue</button>
        </div>
      `;
      
      // Add back button handler
      const backButton = sendScreen.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          sendScreen.style.display = 'none';
          document.getElementById('wallet-screen').style.display = 'flex';
        });
      }
    }
  };
  
  // Fix receive screen
  const fixReceiveScreen = function() {
    const receiveScreen = document.getElementById('receive-screen');
    if (!receiveScreen) return;
    
    if (!receiveScreen.querySelector('.screen-header')) {
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
          <!-- Token items will be populated here -->
        </div>
      `;
      
      // Add back button handler
      const backButton = receiveScreen.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          receiveScreen.style.display = 'none';
          document.getElementById('wallet-screen').style.display = 'flex';
        });
      }
      
      // Populate token list
      const tokenList = receiveScreen.querySelector('#receive-token-list');
      if (tokenList && window.currentWalletData && window.currentWalletData.main) {
        const tokens = window.currentWalletData.main.tokens;
        
        tokens.forEach(token => {
          const item = document.createElement('div');
          item.className = 'token-item';
          item.setAttribute('data-token-id', token.id);
          
          item.innerHTML = `
            <div class="token-icon">
              <img src="${token.icon}" alt="${token.name}">
            </div>
            <div class="token-info">
              <div class="token-name">${token.symbol}</div>
              <div class="token-price">${token.network || ''}</div>
            </div>
            <div class="receive-actions">
              <button class="qr-button">
                <i class="fas fa-qrcode"></i>
              </button>
            </div>
          `;
          
          tokenList.appendChild(item);
        });
      }
    }
  };
  
  // Fix history screen
  const fixHistoryScreen = function() {
    const historyScreen = document.getElementById('history-screen');
    if (!historyScreen) return;
    
    if (!historyScreen.querySelector('.screen-header')) {
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
          <div class="transaction-item transaction-receive">
            <div class="transaction-icon">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div class="transaction-info">
              <div class="transaction-type">Received BTC</div>
              <div class="transaction-date">2025-03-22 14:30</div>
            </div>
            <div class="transaction-amount">
              <div class="transaction-value positive">+0.050000 BTC</div>
              <div class="transaction-usd">$4,199.24</div>
            </div>
          </div>
          <div class="transaction-item transaction-send">
            <div class="transaction-icon">
              <i class="fas fa-arrow-up"></i>
            </div>
            <div class="transaction-info">
              <div class="transaction-type">Sent USDT</div>
              <div class="transaction-date">2025-03-21 10:15</div>
            </div>
            <div class="transaction-amount">
              <div class="transaction-value negative">-1000.000000 USDT</div>
              <div class="transaction-usd">$1,000.00</div>
            </div>
          </div>
          <div class="transaction-item transaction-receive">
            <div class="transaction-icon">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div class="transaction-info">
              <div class="transaction-type">Received ETH</div>
              <div class="transaction-date">2025-03-20 09:45</div>
            </div>
            <div class="transaction-amount">
              <div class="transaction-value positive">+0.500000 ETH</div>
              <div class="transaction-usd">$986.91</div>
            </div>
          </div>
        </div>
      `;
      
      // Add back button handler
      const backButton = historyScreen.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          historyScreen.style.display = 'none';
          document.getElementById('wallet-screen').style.display = 'flex';
        });
      }
    }
  };
  
  // Fix token selection screen
  const fixSendTokenSelectScreen = function() {
    const selectScreen = document.getElementById('send-token-select');
    if (!selectScreen) return;
    
    if (!selectScreen.querySelector('.screen-header')) {
      selectScreen.innerHTML = `
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
          <!-- Token items will be populated here -->
        </div>
      `;
      
      // Add back button handler
      const backButton = selectScreen.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          selectScreen.style.display = 'none';
          document.getElementById('wallet-screen').style.display = 'flex';
        });
      }
      
      // Populate token list
      const tokenList = selectScreen.querySelector('#select-token-list');
      if (tokenList && window.currentWalletData && window.currentWalletData.main) {
        const tokens = window.currentWalletData.main.tokens;
        
        tokens.forEach(token => {
          const item = document.createElement('div');
          item.className = 'token-item';
          item.setAttribute('data-token-id', token.id);
          
          item.innerHTML = `
            <div class="token-icon">
              <img src="${token.icon}" alt="${token.name}">
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
              <div class="token-value">$${token.value.toLocaleString()}</div>
            </div>
          `;
          
          // Add click handler to select token
          item.addEventListener('click', function() {
            const tokenId = this.getAttribute('data-token-id');
            window.activeSendTokenId = tokenId;
            selectScreen.style.display = 'none';
            
            // Update send screen with token data
            const sendScreen = document.getElementById('send-screen');
            if (sendScreen) {
              sendScreen.style.display = 'flex';
              
              // Update title
              const title = sendScreen.querySelector('#send-token-title');
              if (title) title.textContent = `Send ${token.symbol}`;
              
              // Update max values
              const maxAmount = sendScreen.querySelector('#max-amount');
              if (maxAmount) maxAmount.textContent = token.amount.toFixed(6);
              
              const maxSymbol = sendScreen.querySelector('#max-symbol');
              if (maxSymbol) maxSymbol.textContent = token.symbol;
            }
          });
          
          tokenList.appendChild(item);
        });
      }
    }
  };
  
  // Fix basic home screen functionality
  const fixHomeScreen = function() {
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        const sendScreen = document.getElementById('send-screen');
        const tokenSelectScreen = document.getElementById('send-token-select');
        
        // Fix send screen first
        fixSendTokenSelectScreen();
        
        // Navigate to token select screen
        document.querySelectorAll('.screen').forEach(s => {
          s.style.display = 'none';
        });
        
        if (tokenSelectScreen) {
          tokenSelectScreen.style.display = 'flex';
        }
      });
    }
    
    const receiveButton = document.getElementById('receive-button');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        const receiveScreen = document.getElementById('receive-screen');
        
        // Fix receive screen first
        fixReceiveScreen();
        
        // Navigate to receive screen
        document.querySelectorAll('.screen').forEach(s => {
          s.style.display = 'none';
        });
        
        if (receiveScreen) {
          receiveScreen.style.display = 'flex';
        }
      });
    }
    
    const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    if (historyButton) {
      historyButton.addEventListener('click', function() {
        const historyScreen = document.getElementById('history-screen');
        
        // Fix history screen first
        fixHistoryScreen();
        
        // Navigate to history screen
        document.querySelectorAll('.screen').forEach(s => {
          s.style.display = 'none';
        });
        
        if (historyScreen) {
          historyScreen.style.display = 'flex';
        }
      });
    }
  };
  
  // Ensure getTokenLogoUrl exists
  if (typeof window.getTokenLogoUrl !== 'function') {
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
  }
  
  // Apply all fixes
  const applyAllFixes = function() {
    console.log("EMERGENCY FIX: Applying all fixes");
    fixTokenClicks();
    fixSendScreen();
    fixReceiveScreen();
    fixHistoryScreen();
    fixSendTokenSelectScreen();
    fixHomeScreen();
    console.log("EMERGENCY FIX: All fixes applied");
  };
  
  // Apply fixes immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(applyAllFixes, 200);
    });
  } else {
    // DOM already loaded
    setTimeout(applyAllFixes, 200);
  }
  
  // Expose methods globally
  window.emergencyFix = {
    fixAll: applyAllFixes,
    fixTokenClicks: fixTokenClicks,
    fixSendScreen: fixSendScreen,
    fixReceiveScreen: fixReceiveScreen,
    fixHistoryScreen: fixHistoryScreen,
    fixSendTokenSelectScreen: fixSendTokenSelectScreen
  };
})();
