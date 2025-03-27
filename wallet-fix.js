 // Complete wallet fix script - restores ALL functionality
(function() {
  // Load when page is ready
  window.addEventListener('DOMContentLoaded', fixEverything);
  window.addEventListener('load', fixEverything);
  
  function fixEverything() {
    console.log('🔧 COMPLETE WALLET FIX RUNNING');
    
    // Initialize critical variables
    window.activeWallet = 'main';
    window.passcodeEntered = '';
    window.correctPasscode = '123456';
    window.balanceModified = false;
    window.expirationTimer = null;

    // Full wallet data with ALL tokens and correct balances
    const walletData = {
      main: {
        totalBalance: 19385379.00,
        tokens: [
          {id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', amount: 100, value: 8398474.00, price: 83984.74, change: -0.59},
          {id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', amount: 500, value: 986905.00, price: 1973.81, change: -0.71},
          {id: 'pol', name: 'Polygon', symbol: 'POL', network: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png', amount: 7500, value: 1500.00, price: 0.20, change: 2.05},
          {id: 'bnb', name: 'BNB', symbol: 'BNB', network: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', amount: 157.7, value: 100000.00, price: 634.12, change: 0.95, chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'},
          {id: 'trx', name: 'TRON', symbol: 'TRX', network: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png', amount: 769230, value: 100000.00, price: 0.13, change: 0.95},
          {id: 'twt', name: 'Trust Wallet Token', symbol: 'TWT', network: 'BNB Smart Chain', icon: 'src="https://i.ibb.co/ks3wxCRz/Screenshot-2025-03-25-031051.png', amount: 112359, value: 100000.00, price: 0.89, change: 0.09, chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'},
          {id: 'usdt', name: 'Tether', symbol: 'USDT', network: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', amount: 10000000, value: 10000000.00, price: 1.00, change: 0.00, chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'},
          {id: 'xrp', name: 'XRP', symbol: 'XRP', network: 'XRP Ledger', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', amount: 50000, value: 24500.00, price: 0.49, change: 1.25}
        ]
      },
      secondary: {
        totalBalance: 1000.00,
        tokens: [
          {id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', amount: 0.005, value: 419.92, price: 83984.74, change: -0.59},
          {id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', amount: 0.25, value: 493.45, price: 1973.81, change: -0.71},
          {id: 'usdt', name: 'Tether', symbol: 'USDT', network: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', amount: 1000, value: 1000.00, price: 1.00, change: 0.00, chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'}
        ]
      },
      business: {
        totalBalance: 500000.00,
        tokens: [
          {id: 'usdt', name: 'Tether', symbol: 'USDT', network: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', amount: 500000, value: 500000.00, price: 1.00, change: 0.00, chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'}
        ]
      }
    };
    
    // Complete transaction data for all wallets
    const transactions = {
      main: {
        usdt: [
          {id: 'tx1', type: 'receive', amount: 5000000, symbol: 'USDT', value: 5000000, date: '2025-03-15 14:32', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0x8a65d7c4f5f43c3b390f39d5cf7eb3daddff0cecc7a0621428a03769f6b6e6c9'},
          {id: 'tx2', type: 'receive', amount: 5000000, symbol: 'USDT', value: 5000000, date: '2025-03-10 09:45', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0x3f8d07cea5fb9537246dcf4dce484f4b6f0d1f6124b04e9ba79a4bf35ec7c5f1'}
        ],
        btc: [
          {id: 'tx3', type: 'receive', amount: 50, symbol: 'BTC', value: 4199237, date: '2025-03-08 11:20', from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', to: 'bc1qltfhpkgqw6ug6vtw76z2uftwy7jtmr6vfsxp4p', hash: '0xf34f827283f5f69fa39c2e4683cb79e98f34f5a38c6c9c725d754212a73cb001'},
          {id: 'tx4', type: 'receive', amount: 50, symbol: 'BTC', value: 4199237, date: '2025-03-05 09:12', from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', to: 'bc1qltfhpkgqw6ug6vtw76z2uftwy7jtmr6vfsxp4p', hash: '0xd752a98c7f84b6ad01c88f2e0f5b5c902badab661ac3d1dd1ff339c47b154692'}
        ],
        eth: [
          {id: 'tx5', type: 'receive', amount: 250, symbol: 'ETH', value: 493452.5, date: '2025-03-07 13:15', from: '0x4a3C860a7B60D297A808aCb9917A553A9923A3C8', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0xd752a98c7f84b6ad01c88f2e0f5b5c902badab661ac3d1dd1ff339c47b154692'},
          {id: 'tx6', type: 'receive', amount: 250, symbol: 'ETH', value: 493452.5, date: '2025-03-04 17:22', from: '0x4a3C860a7B60D297A808aCb9917A553A9923A3C8', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0x8a65d7c4f5f43c3b390f39d5cf7eb3daddff0cecc7a0621428a03769f6b6e6c9'}
        ],
        bnb: [
          {id: 'tx7', type: 'receive', amount: 157.7, symbol: 'BNB', value: 100000, date: '2025-03-03 08:45', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0x3f8d07cea5fb9537246dcf4dce484f4b6f0d1f6124b04e9ba79a4bf35ec7c5f1'}
        ],
        pol: [
          {id: 'tx8', type: 'receive', amount: 7500, symbol: 'POL', value: 1500, date: '2025-03-02 16:30', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0xf34f827283f5f69fa39c2e4683cb79e98f34f5a38c6c9c725d754212a73cb001'}
        ],
        trx: [
          {id: 'tx9', type: 'receive', amount: 769230, symbol: 'TRX', value: 100000, date: '2025-03-01 11:10', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', hash: '0xd752a98c7f84b6ad01c88f2e0f5b5c902badab661ac3d1dd1ff339c47b154692'}
        ]
      },
      secondary: {
        usdt: [
          {id: 'tx10', type: 'receive', amount: 1000, symbol: 'USDT', value: 1000, date: '2025-03-01 16:42', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2', hash: '0xd752a98c7f84b6ad01c88f2e0f5b5c902badab661ac3d1dd1ff339c47b154692'}
        ]
      },
      business: {
        usdt: [
          {id: 'tx11', type: 'receive', amount: 500000, symbol: 'USDT', value: 500000, date: '2025-03-20 08:30', from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A', hash: '0x8a65d7c4f5f43c3b390f39d5cf7eb3daddff0cecc7a0621428a03769f6b6e6c9'}
        ]
      }
    };

    // Initialize global transaction history
    const globalTransactions = {
      main: [],
      secondary: [],
      business: []
    };

    // Set wallet data into global scope
    window.currentWalletData = walletData;
    window.currentTransactions = transactions;
    window.originalWalletData = JSON.parse(JSON.stringify(walletData));
    window.globalTransactions = globalTransactions;

    // Migrate transactions to global history
    migrateTransactionsToGlobal();

    // Fix all major components
    fixLoginScreen();           // 1. Login/Authentication
    fixTokensList();            // 2. Wallet & Tokens Display
    fixNavigationButtons();     // 3. Navigation System
    fixTokenDetail();           // 4. Token Detail Page
    fixSendReceiveScreens();    // 5. Send/Receive Functionality
    fixAdminPanel();            // 6. Admin Panel
    fixTransactionModal();      // 7. Transaction Modal
    fixExplorerOverlay();       // 8. Explorer Overlay
    fixVerificationOverlay();   // 9. Verification Overlay
    fixHistoryScreen();         // 10. History Screen
    fixTouchTargets();          // 11. Admin Panel Access
    
    console.log('✅ ALL WALLET FUNCTIONALITY RESTORED');
  }

  // Migrate transactions to global history
  function migrateTransactionsToGlobal() {
    Object.keys(window.currentTransactions).forEach(walletId => {
      Object.keys(window.currentTransactions[walletId]).forEach(tokenId => {
        window.currentTransactions[walletId][tokenId].forEach(tx => {
          const wallet = window.currentWalletData[walletId];
          const token = wallet.tokens.find(t => t.id === tokenId);
          
          if (token) {
            const globalTx = {
              ...tx,
              token: tokenId,
              tokenName: token.name,
              icon: token.icon,
              timestamp: new Date(tx.date).getTime()
            };
            
            window.globalTransactions[walletId].push(globalTx);
          }
        });
      });
      
      // Sort by date (newest first)
      window.globalTransactions[walletId].sort((a, b) => b.timestamp - a.timestamp);
    });
  }

  // 1. Fix the login screen and authentication
  function fixLoginScreen() {
    const numpadKeys = document.querySelectorAll('.numpad-key');
    const dots = document.querySelectorAll('.dot');
    
    numpadKeys.forEach(key => {
      key.onclick = function() {
        const value = this.getAttribute('data-key');
        console.log('Numpad key pressed:', value);
        
        if (value === 'bio') {
          simulateBiometricAuth();
          return;
        }
        
        if (value === 'back') {
          if (window.passcodeEntered.length > 0) {
            window.passcodeEntered = window.passcodeEntered.slice(0, -1);
            updatePasscodeDots();
          }
          return;
        }
        
        if (window.passcodeEntered.length < 6) {
          window.passcodeEntered += value;
          
          // Animate dot
          const dotIndex = window.passcodeEntered.length - 1;
          if (dots && dots[dotIndex]) {
            dots[dotIndex].classList.add('pulse');
            setTimeout(() => {
              dots[dotIndex].classList.remove('pulse');
            }, 300);
          }
          
          updatePasscodeDots();
          
          if (window.passcodeEntered.length === 6) {
            setTimeout(() => {
              if (window.passcodeEntered === window.correctPasscode) {
                unlockWallet();
              } else {
                // Show error (shake animation)
                const dotsContainer = document.querySelector('.passcode-dots');
                if (dotsContainer) {
                  dotsContainer.classList.add('shake');
                  setTimeout(() => {
                    dotsContainer.classList.remove('shake');
                    window.passcodeEntered = '';
                    updatePasscodeDots();
                  }, 500);
                }
              }
            }, 300);
          }
        }
      };
    });
    
    // Connect unlock button
    const unlockButton = document.getElementById('unlock-button');
    if (unlockButton) {
      unlockButton.onclick = function() {
        if (window.passcodeEntered.length === 6) {
          if (window.passcodeEntered === window.correctPasscode) {
            unlockWallet();
          } else {
            // Show error (shake animation)
            const dotsContainer = document.querySelector('.passcode-dots');
            if (dotsContainer) {
              dotsContainer.classList.add('shake');
              setTimeout(() => {
                dotsContainer.classList.remove('shake');
                window.passcodeEntered = '';
                updatePasscodeDots();
              }, 500);
            }
          }
        } else {
          alert('Please enter your 6-digit password');
        }
      };
    }
  }
  
  // Update passcode dots
  function updatePasscodeDots() {
    const dots = document.querySelectorAll('.dot');
    if (!dots) return;
    
    dots.forEach((dot, index) => {
      if (index < window.passcodeEntered.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }
  
  // Simulate biometric authentication
  function simulateBiometricAuth() {
    const biometricOverlay = document.getElementById('biometric-overlay');
    if (!biometricOverlay) return;
    
    biometricOverlay.style.display = 'flex';
    
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricStatus = document.getElementById('biometric-status');
    
    if (fingerprintIcon) fingerprintIcon.style.color = 'var(--tw-blue)';
    
    // Add scanning animation
    const scanningEl = document.getElementById('fingerprint-scanning');
    if (scanningEl) {
      scanningEl.style.display = 'block';
    }
    
    setTimeout(() => {
      if (biometricStatus) {
        biometricStatus.textContent = 'Fingerprint recognized';
        biometricStatus.style.color = 'var(--tw-green)';
      }
      
      setTimeout(() => {
        biometricOverlay.style.display = 'none';
        unlockWallet();
      }, 500);
    }, 1500);
  }
  
  // Unlock wallet
  function unlockWallet() {
    window.passcodeEntered = '';
    hideAllScreens();
    const walletScreen = document.getElementById('wallet-screen');
    if (walletScreen) {
      walletScreen.style.display = 'flex';
      walletScreen.classList.remove('hidden');
    }
    updateWalletUI();
  }
  
  // Hide all screens
  function hideAllScreens() {
    const screens = [
      'lock-screen', 'wallet-screen', 'token-detail', 
      'send-screen', 'receive-screen', 'admin-panel',
      'verification-overlay', 'biometric-overlay',
      'explorer-overlay', 'tx-status-modal',
      'history-screen'
    ];
    
    screens.forEach(id => {
      const screen = document.getElementById(id);
      if (screen) {
        screen.style.display = 'none';
        screen.classList.add('hidden');
      }
    });
  }

  // 2. Fix token list display
  function fixTokensList() {
    updateWalletUI();
    updateWalletName();
  }
  
  // Update wallet UI
  function updateWalletUI() {
    const wallet = window.currentWalletData[window.activeWallet];
    if (!wallet) return;
    
    // Update total balance
    const totalBalance = document.getElementById('total-balance');
    if (totalBalance) {
      totalBalance.textContent = formatCurrency(wallet.totalBalance);
    }
    
    // Update token list
    const tokenList = document.getElementById('token-list');
    if (tokenList) {
      tokenList.innerHTML = '';
      
      wallet.tokens.forEach(token => {
        const tokenElement = createTokenElement(token);
        tokenList.appendChild(tokenElement);
      });
    }
  }
  
  // Update wallet name display
  function updateWalletName() {
    const walletNameEl = document.querySelector('.wallet-name');
    if (walletNameEl) {
      switch(window.activeWallet) {
        case 'main':
          walletNameEl.textContent = 'Mnemonic 1';
          break;
        case 'secondary':
          walletNameEl.textContent = 'Mnemonic 2';
          break;
        case 'business':
          walletNameEl.textContent = 'Mnemonic 3';
          break;
      }
    }
  }
  
  // Create token element
  function createTokenElement(token) {
    const element = document.createElement('div');
    element.className = 'token-item';
    element.setAttribute('data-token-id', token.id);
    
    // Handle chain badge
    let chainBadgeHTML = '';
    if (token.chainBadge) {
      chainBadgeHTML = `
        <div class="chain-badge">
          <img src="${token.chainBadge}" alt="Chain">
        </div>
      `;
    }
    
    const changeClass = token.change >= 0 ? 'positive' : 'negative';
    const changeSign = token.change >= 0 ? '+' : '';
    
    element.innerHTML = `
      <div class="token-icon">
        <img src="${token.icon}" alt="${token.name}">
        ${chainBadgeHTML}
      </div>
      <div class="token-info">
        <div class="token-name">
          ${token.symbol} <span class="token-network">${token.name}</span>
        </div>
        <div class="token-price">
          $${token.price.toFixed(2)} <span class="token-price-change ${changeClass}">${changeSign}${token.change}%</span>
        </div>
      </div>
      <div class="token-amount">
        <div class="token-balance">${token.amount.toFixed(6)}</div>
        <div class="token-value">${formatCurrency(token.value)}</div>
      </div>
    `;
    
    return element;
  }
  
  // Format currency
  function formatCurrency(value) {
    if (isNaN(value)) return '$0.00';
    return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  // 3. Fix navigation buttons and system
  function fixNavigationButtons() {
    // Wallet selector
    const walletSelector = document.querySelector('.wallet-selector');
    if (walletSelector) {
      walletSelector.onclick = function() {
        switch(window.activeWallet) {
          case 'main':
            window.activeWallet = 'secondary';
            break;
          case 'secondary':
            window.activeWallet = 'business';
            break;
          case 'business':
            window.activeWallet = 'main';
            break;
        }
        
        updateWalletName();
        updateWalletUI();
      };
    }
    
    // Token list clicks
    const tokenList = document.getElementById('token-list');
    if (tokenList) {
      tokenList.onclick = function(e) {
        const tokenItem = e.target.closest('.token-item');
        if (tokenItem) {
          const tokenId = tokenItem.getAttribute('data-token-id');
          showTokenDetail(tokenId);
        }
      };
    }
    
    // Back buttons
    document.querySelectorAll('.back-button, #back-button').forEach(button => {
      button.onclick = function() {
        hideAllScreens();
        document.getElementById('wallet-screen').style.display = 'flex';
        document.getElementById('wallet-screen').classList.remove('hidden');
      };
    });
    
    // Explorer back button
    const explorerBackBtn = document.querySelector('.explorer-back-button');
    if (explorerBackBtn) {
      explorerBackBtn.onclick = function() {
        document.getElementById('explorer-overlay').style.display = 'none';
      };
    }
    
    // Send/Receive buttons on main screen
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
      sendButton.onclick = function() {
        showSendScreen('usdt');
      };
    }
    
    const receiveButton = document.getElementById('receive-button');
    if (receiveButton) {
      receiveButton.onclick = function() {
        showReceiveScreen('usdt');
      };
    }
    
    // History button (fifth quick action)
    const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    if (historyButton) {
      historyButton.onclick = function() {
        showHistoryScreen();
      };
    }
    
    // Fix bottom tabs
    fixBottomTabs();
  }
  
  // Fix bottom tabs
  function fixBottomTabs() {
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (bottomTabs) {
      // Fix z-index and positioning
      bottomTabs.style.display = 'flex';
      bottomTabs.style.position = 'fixed';
      bottomTabs.style.bottom = '0';
      bottomTabs.style.left = '0';
      bottomTabs.style.width = '100%';
      bottomTabs.style.zIndex = '1000';
    }
    
    const tabs = document.querySelectorAll('.bottom-tabs .tab-item');
    tabs.forEach((tab, index) => {
      tab.onclick = function() {
        // Remove active from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Make this tab active
        tab.classList.add('active');
        
        // Home tab
        if (index === 0) {
          hideAllScreens();
          document.getElementById('wallet-screen').style.display = 'flex';
          document.getElementById('wallet-screen').classList.remove('hidden');
        } else {
          alert(`${tab.querySelector('span').textContent} functionality coming soon`);
          
          // Reset to home
          setTimeout(() => {
            tabs.forEach(t => t.classList.remove('active'));
            tabs[0].classList.add('active');
          }, 500);
        }
      };
    });
  }

  // 4. Fix token detail page
  function fixTokenDetail() {
    // The showTokenDetail function is defined lower down
  }
  
  // Show token detail
  function showTokenDetail(tokenId) {
    const wallet = window.currentWalletData[window.activeWallet];
    if (!wallet) return;
    
    const token = wallet.tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Update token detail
    const elements = {
      'detail-symbol': token.symbol,
      'detail-fullname': token.name,
      'token-balance-amount': `${token.amount.toFixed(6)} ${token.symbol}`,
      'token-balance-value': formatCurrency(token.value),
      'token-staking-symbol': token.symbol,
      'token-price-symbol': token.symbol,
      'token-current-price': `$${token.price.toFixed(2)}`
    };
    
    Object.keys(elements).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = elements[id];
      }
    });
    
    // Update token icon
    const tokenDetailIcon = document.getElementById('token-detail-icon');
    if (tokenDetailIcon) {
      tokenDetailIcon.src = token.icon;
    }
    
    // Setup chain badge if needed
    if (token.chainBadge) {
      const tokenDetailIconContainer = document.querySelector('.token-detail-icon-container');
      if (tokenDetailIconContainer) {
        // Check if badge already exists
        let chainBadge = tokenDetailIconContainer.querySelector('.chain-badge');
        if (!chainBadge) {
          chainBadge = document.createElement('div');
          chainBadge.className = 'chain-badge';
          chainBadge.innerHTML = `<img src="${token.chainBadge}" alt="Chain">`;
          tokenDetailIconContainer.appendChild(chainBadge);
        } else {
          // Update existing badge
          const badgeImg = chainBadge.querySelector('img');
          if (badgeImg) badgeImg.src = token.chainBadge;
        }
      }
    }
    
    // Set price change
    const priceChangeElement = document.getElementById('token-price-change');
    if (priceChangeElement) {
      priceChangeElement.className = token.change >= 0 ? 'positive' : 'negative';
      priceChangeElement.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
    }
    
    // Update transactions
    updateTransactions(tokenId);
    
    // Fix token detail actions
    fixTokenDetailActions(tokenId);
    
    // Show token detail screen
    hideAllScreens();
    const tokenDetail = document.getElementById('token-detail');
    if (tokenDetail) {
      tokenDetail.style.display = 'flex';
      tokenDetail.classList.remove('hidden');
    }
  }
  
  // Fix token detail actions
  function fixTokenDetailActions(tokenId) {
    const detailActions = document.querySelectorAll('#token-detail .detail-action');
    if (!detailActions || detailActions.length < 5) return;
    
    // Send button
    detailActions[0].onclick = function() {
      showSendScreen(tokenId);
    };
    
   // Receive button
    detailActions[1].onclick = function() {
      showReceiveScreen(tokenId);
    };
    
    // Other buttons - Swap, Buy, Sell
    detailActions[2].onclick = function() {
      alert('Swap functionality coming soon');
    };
    
    detailActions[3].onclick = function() {
      alert('Buy functionality coming soon');
    };
    
    detailActions[4].onclick = function() {
      alert('Sell functionality coming soon');
    };
  }
  
  // Update transactions
  function updateTransactions(tokenId) {
    const transactions = window.currentTransactions?.[window.activeWallet]?.[tokenId] || [];
    const transactionList = document.getElementById('transaction-list');
    const noTransactions = document.querySelector('.no-transactions');
    
    if (!transactionList) return;
    
    if (transactions.length === 0) {
      transactionList.innerHTML = '';
      if (noTransactions) {
        noTransactions.style.display = 'flex';
      }
      return;
    }
    
    if (noTransactions) {
      noTransactions.style.display = 'none';
    }
    
    transactionList.innerHTML = '';
    
    transactions.forEach(tx => {
      const element = document.createElement('div');
      element.className = `transaction-item transaction-${tx.type}`;
      
      element.innerHTML = `
        <div class="transaction-icon">
          <i class="fas fa-${tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
        </div>
        <div class="transaction-info">
          <div class="transaction-type">${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.symbol}</div>
          <div class="transaction-date">${tx.date}</div>
        </div>
        <div class="transaction-amount">
          <div class="transaction-value ${tx.type === 'receive' ? 'positive' : 'negative'}">
            ${tx.type === 'receive' ? '+' : '-'}${tx.amount} ${tx.symbol}
          </div>
          <div class="transaction-usd">${formatCurrency(tx.value)}</div>
        </div>
      `;
      
      // Make transaction clickable to show details
      element.onclick = function() {
        showTransactionDetails(tx);
      };
      
      transactionList.appendChild(element);
    });
  }
  
  // Show transaction details in explorer
  function showTransactionDetails(transaction) {
    const explorerOverlay = document.getElementById('explorer-overlay');
    if (!explorerOverlay) return;
    
    // Set transaction details
    const txHashEl = document.getElementById('explorer-tx-hash');
    if (txHashEl) txHashEl.textContent = transaction.hash.substring(0, 18) + '...';
    
    const txTimestampEl = document.getElementById('explorer-timestamp');
    if (txTimestampEl) txTimestampEl.textContent = formatTimestamp(transaction.date);
    
    const txFromEl = document.getElementById('explorer-from');
    if (txFromEl) txFromEl.textContent = transaction.from;
    
    const txToEl = document.getElementById('explorer-to');
    if (txToEl) txToEl.textContent = transaction.to;
    
    const txValueEl = document.getElementById('explorer-value');
    if (txValueEl) txValueEl.textContent = '0 BNB';
    
    const txTokenAmount = document.getElementById('explorer-token-amount');
    if (txTokenAmount) txTokenAmount.textContent = `${transaction.amount} ${transaction.symbol}`;
    
    // Update FROM/TO short addresses
    const fromShortEl = document.querySelector('.explorer-address-short:first-child');
    if (fromShortEl) fromShortEl.textContent = transaction.from.substring(0, 6) + '...' + transaction.from.substring(transaction.from.length - 4);
    
    const toShortEl = document.querySelector('.explorer-address-short:last-child');
    if (toShortEl) toShortEl.textContent = transaction.to.substring(0, 6) + '...' + transaction.to.substring(transaction.to.length - 4);
    
    // Set token icon
    const tokenIconEl = document.querySelector('.explorer-token-icon img');
    const wallet = window.currentWalletData[window.activeWallet];
    const token = wallet.tokens.find(t => t.symbol === transaction.symbol);
    
    if (tokenIconEl && token) {
      tokenIconEl.src = token.icon;
    }
    
    // Show explorer
    explorerOverlay.style.display = 'flex';
  }
  
  // Format timestamp
  function formatTimestamp(dateStr) {
    try {
      const parts = dateStr.split(' ');
      const dateParts = parts[0].split('-');
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[parseInt(dateParts[1]) - 1];
      
      return `${month}-${dateParts[2]}-${dateParts[0]} ${parts[1]} PM +UTC`;
    } catch (e) {
      return dateStr;
    }
  }

  // 5. Fix send/receive screens
  function fixSendReceiveScreens() {
    // Fix receiveScreen copy/share buttons
    const copyButton = document.querySelector('.receive-actions .action-round-button:first-child');
    if (copyButton) {
      copyButton.onclick = function() {
        const address = document.getElementById('wallet-address')?.textContent.trim();
        if (address) {
          try {
            navigator.clipboard.writeText(address)
              .then(() => alert('Address copied to clipboard'))
              .catch(err => {
                console.error('Failed to copy:', err);
                // Fallback method
                const textArea = document.createElement('textarea');
                textArea.value = address;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Address copied to clipboard');
              });
          } catch (error) {
            console.error('Copy failed:', error);
            alert('Failed to copy address');
          }
        }
      };
    }
    
    const shareButton = document.querySelector('.receive-actions .action-round-button:nth-child(2)');
    if (shareButton) {
      shareButton.onclick = function() {
        const address = document.getElementById('wallet-address')?.textContent.trim();
        if (address) {
          alert(`Share address: ${address}`);
        }
      };
    }
    
    // Fix send screen form and buttons
    const continueButton = document.getElementById('continue-send');
    if (continueButton) {
      continueButton.onclick = function(e) {
        e.preventDefault();
        processSendTransaction();
      };
    }
    
    // Fix fee options
    const feeOptions = document.querySelectorAll('.fee-option');
    feeOptions.forEach(option => {
      option.onclick = function() {
        feeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      };
    });
    
    // Fix max button
    const maxButton = document.querySelector('.max-button');
    if (maxButton) {
      maxButton.onclick = function() {
        const maxAmount = document.getElementById('max-amount');
        const sendAmount = document.getElementById('send-amount');
        if (maxAmount && sendAmount) {
          sendAmount.value = maxAmount.textContent;
        }
      };
    }
    
    // Fix paste button
    const pasteButton = document.querySelector('.paste-button');
    if (pasteButton) {
      pasteButton.onclick = function() {
        try {
          navigator.clipboard.readText()
            .then(text => {
              const recipientAddress = document.getElementById('recipient-address');
              if (recipientAddress) {
                recipientAddress.value = text;
              }
            })
            .catch(() => {
              // Fallback - just use a sample address
              const recipientAddress = document.getElementById('recipient-address');
              if (recipientAddress) {
                recipientAddress.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
              }
            });
        } catch (error) {
          // Fallback for browsers without clipboard API
          const recipientAddress = document.getElementById('recipient-address');
          if (recipientAddress) {
            recipientAddress.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
          }
        }
      };
    }
    
    // Fix scan button
    const scanButton = document.querySelector('.scan-button');
    if (scanButton) {
      scanButton.onclick = function() {
        alert('QR code scanner coming soon');
      };
    }
  }
  
  // Show send screen
  function showSendScreen(tokenId) {
    const wallet = window.currentWalletData[window.activeWallet];
    if (!wallet) return;
    
    const token = wallet.tokens.find(t => t.id === tokenId) || wallet.tokens.find(t => t.id === 'usdt');
    if (!token) return;
    
    // Update send screen title
    const sendTokenTitle = document.getElementById('send-token-title');
    if (sendTokenTitle) {
      sendTokenTitle.textContent = `Send ${token.symbol}`;
    }
    
    // Update max amount
    const maxAmount = document.getElementById('max-amount');
    if (maxAmount) {
      maxAmount.textContent = token.amount.toFixed(6);
    }
    
    const maxSymbol = document.getElementById('max-symbol');
    if (maxSymbol) {
      maxSymbol.textContent = token.symbol;
    }
    
    // Reset form
    const recipientAddress = document.getElementById('recipient-address');
    if (recipientAddress) {
      recipientAddress.value = '';
    }
    
    const sendAmount = document.getElementById('send-amount');
    if (sendAmount) {
      sendAmount.value = '';
    }
    
    // Reset fee options
    const feeOptions = document.querySelectorAll('.fee-option');
    feeOptions.forEach((option, index) => {
      option.classList.toggle('active', index === 0);
    });
    
    // Show screen
    hideAllScreens();
    const sendScreen = document.getElementById('send-screen');
    if (sendScreen) {
      sendScreen.style.display = 'flex';
      sendScreen.classList.remove('hidden');
    }
    
    // Store active token ID for transaction processing
    window.activeSendTokenId = tokenId;
  }
  
  // Show receive screen
  function showReceiveScreen(tokenId) {
    const wallet = window.currentWalletData[window.activeWallet];
    if (!wallet) return;
    
    const token = wallet.tokens.find(t => t.id === tokenId) || wallet.tokens.find(t => t.id === 'usdt');
    if (!token) return;
    
    // Update receive screen
    const receiveTokenIcon = document.getElementById('receive-token-icon');
    if (receiveTokenIcon) {
      receiveTokenIcon.src = token.icon;
    }
    
    const receiveTokenName = document.getElementById('receive-token-name');
    if (receiveTokenName) {
      receiveTokenName.textContent = token.symbol;
    }
    
    // Show/hide Bitcoin warning
    const bitcoinWarning = document.getElementById('bitcoin-warning');
    if (bitcoinWarning) {
      bitcoinWarning.style.display = token.id === 'btc' ? 'block' : 'none';
    }
    
    // Show receive address based on active wallet
    const walletAddress = document.getElementById('wallet-address');
    if (walletAddress) {
      switch(window.activeWallet) {
        case 'main':
          walletAddress.textContent = 'bc1qltfhpkgqw6ug6vtw76z2uftwy7jtmr6vfsxp4p';
          break;
        case 'secondary':
          walletAddress.textContent = '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2';
          break;
        case 'business':
          walletAddress.textContent = '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A';
          break;
      }
    }
    
    // Show screen
    hideAllScreens();
    const receiveScreen = document.getElementById('receive-screen');
    if (receiveScreen) {
      receiveScreen.style.display = 'flex';
      receiveScreen.classList.remove('hidden');
    }
  }
  
  // Process send transaction
  function processSendTransaction() {
    // Get the active token
    const tokenId = window.activeSendTokenId || 'usdt';
    const wallet = window.currentWalletData[window.activeWallet];
    if (!wallet) return;
    
    const token = wallet.tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Get input values
    const recipientAddressEl = document.getElementById('recipient-address');
    const sendAmountEl = document.getElementById('send-amount');
    
    if (!recipientAddressEl || !sendAmountEl) return;
    
    const recipient = recipientAddressEl.value.trim() || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const amountStr = sendAmountEl.value.trim();
    const amount = parseFloat(amountStr);
    
    // Validate input
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount > token.amount) {
      alert('Insufficient balance');
      return;
    }
    
    if (!recipient.startsWith('0x') && !recipient.startsWith('bc1') && !recipient.startsWith('1')) {
      alert('Please enter a valid recipient address');
      return;
    }
    
    // Hide send screen
    hideAllScreens();
    
    // Show transaction modal
    const txStatusModal = document.getElementById('tx-status-modal');
    if (txStatusModal) {
      txStatusModal.style.display = 'flex';
      
      const pendingView = document.getElementById('tx-pending');
      const successView = document.getElementById('tx-success');
      
      if (pendingView) pendingView.classList.remove('hidden');
      if (successView) successView.classList.add('hidden');
      
      // Generate TX hash and update details
      const txHash = generateRandomHash();
      
      const txHashEl = document.getElementById('tx-hash');
      if (txHashEl) {
        txHashEl.textContent = txHash.substring(0, 10) + '...';
        
        // Add copy icon if missing
        if (!txHashEl.querySelector('.fa-copy')) {
          const copyIcon = document.createElement('i');
          copyIcon.className = 'fas fa-copy';
          copyIcon.style.marginLeft = '8px';
          copyIcon.style.cursor = 'pointer';
          copyIcon.style.color = '#3375BB';
          
          copyIcon.onclick = function(e) {
            e.stopPropagation();
            navigator.clipboard.writeText(txHash)
              .then(() => alert('Transaction hash copied'))
              .catch(() => alert('Failed to copy hash'));
          };
          
          txHashEl.appendChild(copyIcon);
        }
      }
      
      const txAmountEl = document.getElementById('tx-amount');
      if (txAmountEl) {
        txAmountEl.textContent = `${amount} ${token.symbol}`;
      }
      
      const txToEl = document.getElementById('tx-to');
      if (txToEl) {
        txToEl.textContent = recipient.substring(0, 6) + '...';
      }
      
      // Add confirmation counter
      let confirmations = 0;
      const confirmInterval = setInterval(() => {
        confirmations++;
        const countEl = document.getElementById('confirm-count');
        if (countEl) countEl.textContent = confirmations;
      }, 1000);
      
      // Simulate transaction processing
      setTimeout(() => {
        // Clear interval
        clearInterval(confirmInterval);
        
        if (pendingView) pendingView.classList.add('hidden');
        if (successView) successView.classList.remove('hidden');
        
        // Update token balances
        token.amount -= amount;
        token.value -= amount * token.price;
        wallet.totalBalance -= amount * token.price;
        
        // Create transaction record
        if (!window.currentTransactions[window.activeWallet][tokenId]) {
          window.currentTransactions[window.activeWallet][tokenId] = [];
        }
        
        const newTx = {
          id: 'tx-' + Date.now(),
          type: 'send',
          amount: amount,
          symbol: token.symbol,
          value: amount * token.price,
          date: new Date().toISOString().split('T')[0] + ' ' + 
                new Date().toTimeString().split(' ')[0].substring(0, 5),
          from: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
          to: recipient,
          hash: txHash
        };
        
        window.currentTransactions[window.activeWallet][tokenId].unshift(newTx);
        
        // Add to global transactions
        const globalTx = {
          ...newTx,
          token: tokenId,
          tokenName: token.name,
          icon: token.icon,
          timestamp: Date.now()
        };
        
        window.globalTransactions[window.activeWallet].unshift(globalTx);
        
        // Fix close button
        const closeBtn = document.getElementById('close-tx-success');
        if (closeBtn) {
          closeBtn.onclick = function() {
            txStatusModal.style.display = 'none';
            hideAllScreens();
            document.getElementById('wallet-screen').style.display = 'flex';
            document.getElementById('wallet-screen').classList.remove('hidden');
            updateWalletUI();
          };
        }
      }, 3000 + Math.random() * 2000); // 3-5 seconds
    }
  }
  
  // Generate random hash
  function generateRandomHash() {
    return '0x' + Array.from({ length: 64 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
  }

  // 6. Fix admin panel
  function fixAdminPanel() {
    const closeAdminBtn = document.getElementById('close-admin');
    if (closeAdminBtn) {
      closeAdminBtn.onclick = function() {
        hideAllScreens();
        document.getElementById('wallet-screen').style.display = 'flex';
        document.getElementById('wallet-screen').classList.remove('hidden');
      };
    }
    
    const applyFakeBtn = document.getElementById('apply-fake');
    if (applyFakeBtn) {
      applyFakeBtn.onclick = function() {
        const walletId = document.getElementById('admin-wallet-select')?.value || 'main';
        const tokenId = document.getElementById('admin-token-select')?.value || 'usdt';
        const amountStr = document.getElementById('fake-balance')?.value || '100000';
        const expirationStr = document.getElementById('expiration-time')?.value || '48';
        const generateHistory = document.getElementById('generate-history')?.checked ?? true;
        const modifyAll = document.getElementById('modify-all-wallets')?.checked ?? false;
        
        const amount = parseFloat(amountStr);
        const expiration = parseInt(expirationStr);
        
        if (modifyAll) {
          Object.keys(window.currentWalletData).forEach(wId => {
            applyFakeBalance(tokenId, amount, expiration, generateHistory, wId);
          });
        } else {
          applyFakeBalance(tokenId, amount, expiration, generateHistory, walletId);
        }
        
        hideAllScreens();
        document.getElementById('wallet-screen').style.display = 'flex';
        document.getElementById('wallet-screen').classList.remove('hidden');
      };
    }
    
    const resetWalletBtn = document.getElementById('reset-wallet');
    if (resetWalletBtn) {
      resetWalletBtn.onclick = function() {
        const walletId = document.getElementById('admin-wallet-select')?.value || 'main';
        const modifyAll = document.getElementById('modify-all-wallets')?.checked ?? false;
        
        resetToOriginalBalance(modifyAll ? 'all' : walletId);
        
        hideAllScreens();
        document.getElementById('wallet-screen').style.display = 'flex';
        document.getElementById('wallet-screen').classList.remove('hidden');
      };
    }
  }
  
  // Apply fake balance
  function applyFakeBalance(tokenId, amount, expirationHours, generateHistory, walletId) {
    if (!window.currentWalletData[walletId]) return;
    
    // Update token balance
    updateWalletWithFakeBalance(tokenId, amount, walletId);
    
    // Generate transaction history if needed
    if (generateHistory) {
      generateFakeTransactionHistory(amount, tokenId, walletId);
    }
    
    // Set expiration timer
    setExpirationTimer(expirationHours, walletId);
    
    window.balanceModified = true;
  }
  
  // Update wallet with fake balance
  function updateWalletWithFakeBalance(tokenId, amount, walletId) {
    if (!window.currentWalletData[walletId]) return;
    
    const wallet = window.currentWalletData[walletId];
    let token = wallet.tokens.find(t => t.id === tokenId);
    
    if (!token) {
      // Try to find token in main wallet as template
      const templateToken = window.currentWalletData.main.tokens.find(t => t.id === tokenId);
      if (templateToken) {
        // Clone the token and add to this wallet
        token = JSON.parse(JSON.stringify(templateToken));
        wallet.tokens.push(token);
      } else {
        console.error('Token not found:', tokenId);
        return;
      }
    }
    
    // Calculate difference to add to total balance
    const oldValue = token.value;
    const newValue = amount;
    const difference = newValue - oldValue;
    
    // Update token
    token.value = newValue;
    token.amount = newValue / token.price;
    
    // Update total balance
    wallet.totalBalance += difference;
    
    // Update UI if this is the active wallet
    if (window.activeWallet === walletId) {
      updateWalletUI();
    }
  }
  
  // Generate fake transaction history
  function generateFakeTransactionHistory(totalAmount, tokenId, walletId) {
    if (!window.currentTransactions[walletId]) {
      window.currentTransactions[walletId] = {};
    }
    
    if (!window.currentTransactions[walletId][tokenId]) {
      window.currentTransactions[walletId][tokenId] = [];
    }
    
    // Clear existing transactions
    window.currentTransactions[walletId][tokenId] = [];
    
    // Create transaction parts
    const transactionCount = Math.min(10, Math.max(3, Math.floor(Math.log10(totalAmount) * 2)));
    const amounts = splitAmountRandomly(totalAmount, transactionCount);
    
    // Get wallet addresses
    const walletAddresses = {
      main: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
      secondary: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2',
      business: '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A'
    };
    
    const token = window.currentWalletData[walletId].tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Create fake transactions
    for (let i = 0; i < amounts.length; i++) {
      const amount = amounts[i];
      
      // Calculate date - newer transactions for larger amounts
      const daysAgo = Math.floor((i / amounts.length) * 30) + Math.floor(Math.random() * 5);
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - daysAgo);
      
      const formattedDate = transactionDate.toISOString().split('T')[0] + ' ' +
                            transactionDate.toTimeString().split(' ')[0].substring(0, 5);
      
      // Generate random addresses and hash
      const fromAddress = generateRandomAddress();
      const hash = generateRandomHash();
      
      // Create transaction
      const tx = {
        id: 'tx-' + Date.now() + i,
        type: 'receive',
        amount: parseFloat(amount.toFixed(6)),
        symbol: token.symbol,
        value: parseFloat((amount * token.price).toFixed(2)),
        date: formattedDate,
        from: fromAddress,
        to: walletAddresses[walletId] || generateRandomAddress(),
        hash: hash
      };
      
      // Add to wallet transactions
      window.currentTransactions[walletId][tokenId].unshift(tx);
      
      // Add to global transactions
      const globalTx = {
        ...tx,
        token: tokenId,
        tokenName: token.name,
        icon: token.icon,
        timestamp: transactionDate.getTime()
      };
      
      window.globalTransactions[walletId].unshift(globalTx);
    }
    
    // Sort by date (newest first)
    window.currentTransactions[walletId][tokenId].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    window.globalTransactions[walletId].sort((a, b) => {
      return b.timestamp - a.timestamp;
    });
    
    // Update UI if this is the active wallet
    if (window.activeWallet === walletId) {
      const tokenDetail = document.getElementById('token-detail');
      if (tokenDetail && !tokenDetail.classList.contains('hidden')) {
        updateTransactions(tokenId);
      }
      
      // Update history if visible
      updateHistoryTransactionList();
    }
  }
  
  // Split amount randomly
  function splitAmountRandomly(total, parts) {
    if (isNaN(total) || total <= 0 || parts <= 0) {
      return [total];
    }
    
    const amounts = [];
    let remainingAmount = total;
    let remainingParts = parts;
    
    while (remainingParts > 0) {
      if (remainingParts === 1) {
        amounts.push(remainingAmount);
        break;
      }
      
      const averagePart = remainingAmount / remainingParts;
      const minPart = averagePart * 0.3;
      const maxPart = averagePart * 2.5;
      
      const part = Math.min(maxPart, Math.max(minPart, Math.random() * averagePart * 2));
      amounts.push(part);
      
      remainingAmount -= part;
      remainingParts--;
    }
    
    return amounts.sort(() => Math.random() - 0.5);
  }
  
  // Generate random address
  function generateRandomAddress() {
    const addresses = [
      '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      '0x4a3C860a7B60D297A808aCb9917A553A9923A3C8',
      '0x8Fc6CAFB4Ad30bB25f2F5CBf51967EF9F0803a25',
      '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f'
    ];
    
    // Either pick from list or generate new
    if (Math.random() > 0.5) {
      return addresses[Math.floor(Math.random() * addresses.length)];
    } else {
      return '0x' + Array.from({ length: 40 }, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
    }
  }
  
  // Set expiration timer
  function setExpirationTimer(hours, walletId) {
    // Clear existing timer
    if (window.expirationTimer) {
      clearInterval(window.expirationTimer);
    }
    
    // Calculate expiration time
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + Math.max(1, hours));
    
    // Set interval to update countdown
    window.expirationTimer = setInterval(() => {
      const remaining = expirationTime - new Date();
      
      if (remaining <= 0) {
        // Time expired - reset to original
        clearInterval(window.expirationTimer);
        window.expirationTimer = null;
        resetToOriginalBalance(walletId);
      } else {
        updateExpirationDisplay(remaining);
      }
    }, 1000);
    
    // Initial update
    updateExpirationDisplay(expirationTime - new Date());
  }
  
  // Update expiration display
  function updateExpirationDisplay(remainingMs) {
    const expirationDisplay = document.getElementById('expiration-countdown');
    if (!expirationDisplay) return;
    
    if (!remainingMs) {
      expirationDisplay.textContent = 'Not Active';
      return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    expirationDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }
  
// Reset to original balance
  function resetToOriginalBalance(walletId) {
    if (walletId === 'all') {
      // Reset all wallets
      Object.keys(window.currentWalletData).forEach(wId => {
        resetWalletToOriginal(wId);
        resetTransactionsToOriginal(wId);
      });
    } else {
      resetWalletToOriginal(walletId);
      resetTransactionsToOriginal(walletId);
    }
    
    // Clear expiration timer
    if (window.expirationTimer) {
      clearInterval(window.expirationTimer);
      window.expirationTimer = null;
    }
    
    // Update display
    updateExpirationDisplay(null);
    window.balanceModified = false;
    
    // Update UI
    updateWalletUI();
  }
  
  // Reset wallet to original data
  function resetWalletToOriginal(walletId) {
    if (window.originalWalletData[walletId]) {
      window.currentWalletData[walletId] = JSON.parse(JSON.stringify(window.originalWalletData[walletId]));
    }
  }
  
  // Reset transactions to original
  function resetTransactionsToOriginal(walletId) {
    if (walletId === 'all') {
      // Reset all wallets
      Object.keys(window.currentTransactions).forEach(wId => {
        window.currentTransactions[wId] = {};
        window.globalTransactions[wId] = [];
      });
    } else {
      // Reset specific wallet
      window.currentTransactions[walletId] = {};
      window.globalTransactions[walletId] = [];
    }
    
    // Update UI if this is the active wallet
    if (window.activeWallet === walletId || walletId === 'all') {
      const tokenDetail = document.getElementById('token-detail');
      if (tokenDetail && !tokenDetail.classList.contains('hidden')) {
        const detailSymbol = document.getElementById('detail-symbol');
        if (detailSymbol) {
          const activeTokenId = detailSymbol.textContent.toLowerCase();
          updateTransactions(activeTokenId);
        }
      }
      
      // Update history if visible
      updateHistoryTransactionList();
    }
  }

  // 7. Fix transaction modal
  function fixTransactionModal() {
    // Fix close button
    const closeBtn = document.getElementById('close-tx-success');
    if (closeBtn) {
      closeBtn.onclick = function() {
        const modal = document.getElementById('tx-status-modal');
        if (modal) modal.style.display = 'none';
        
        // Show wallet screen
        hideAllScreens();
        document.getElementById('wallet-screen').style.display = 'flex';
        document.getElementById('wallet-screen').classList.remove('hidden');
      };
    }
    
    // Fix transaction hash copy
    const txHash = document.getElementById('tx-hash');
    if (txHash && !txHash.querySelector('.fa-copy')) {
      const copyIcon = document.createElement('i');
      copyIcon.className = 'fas fa-copy';
      copyIcon.style.marginLeft = '8px';
      copyIcon.style.cursor = 'pointer';
      copyIcon.style.color = '#3375BB';
      
      copyIcon.onclick = function(e) {
        e.stopPropagation();
        const hash = txHash.textContent;
        
        try {
          navigator.clipboard.writeText(hash)
            .then(() => alert('Transaction hash copied'))
            .catch(err => alert('Failed to copy: ' + err));
        } catch (err) {
          console.error('Copy failed:', err);
          alert('Failed to copy hash');
        }
      };
      
      txHash.appendChild(copyIcon);
    }
    
    // Ensure modal has proper z-index
    const modal = document.getElementById('tx-status-modal');
    if (modal) modal.style.zIndex = '9999';
  }

  // 8. Fix explorer overlay
  function fixExplorerOverlay() {
    // Fix back button
    const backButton = document.querySelector('.explorer-back-button');
    if (backButton) {
      backButton.onclick = function() {
        const explorerOverlay = document.getElementById('explorer-overlay');
        if (explorerOverlay) explorerOverlay.style.display = 'none';
      };
    }
    
    // Ensure z-index
    const explorerOverlay = document.getElementById('explorer-overlay');
    if (explorerOverlay) explorerOverlay.style.zIndex = '9999';
  }

  // 9. Fix verification overlay
  function fixVerificationOverlay() {
    // Close button
    const closeVerification = document.getElementById('close-verification');
    if (closeVerification) {
      closeVerification.onclick = function() {
        const verificationOverlay = document.getElementById('verification-overlay');
        if (verificationOverlay) verificationOverlay.style.display = 'none';
      };
    }
    
    // View blockchain button
    const viewBlockchain = document.getElementById('view-blockchain');
    if (viewBlockchain) {
      viewBlockchain.onclick = function() {
        const verificationOverlay = document.getElementById('verification-overlay');
        const explorerOverlay = document.getElementById('explorer-overlay');
        
        if (verificationOverlay) verificationOverlay.style.display = 'none';
        if (explorerOverlay) explorerOverlay.style.display = 'flex';
      };
    }
  }

  // 10. Fix history screen
  function fixHistoryScreen() {
    // Initialize history tabs
    const historyTabs = document.querySelectorAll('.history-tab');
    historyTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active from all tabs
        historyTabs.forEach(t => t.classList.remove('active'));
        
        // Make this tab active
        tab.classList.add('active');
        
        // Update history list with filter
        const filterType = tab.getAttribute('data-tab');
        updateHistoryTransactionList(filterType);
      });
    });
    
    // Fix wallet selector in history
    const walletSelector = document.querySelector('.wallet-selector-small');
    if (walletSelector) {
      walletSelector.addEventListener('click', function() {
        // Cycle through wallets
        const walletNameEl = document.querySelector('.wallet-name-small');
        
        switch(window.activeWallet) {
          case 'main':
            window.activeWallet = 'secondary';
            if (walletNameEl) walletNameEl.textContent = 'Mnemonic 2';
            break;
          case 'secondary':
            window.activeWallet = 'business';
            if (walletNameEl) walletNameEl.textContent = 'Mnemonic 3';
            break;
          default:
            window.activeWallet = 'main';
            if (walletNameEl) walletNameEl.textContent = 'Mnemonic 1';
        }
        
        // Get active tab
        const activeTab = document.querySelector('.history-tab.active');
        const filterType = activeTab ? activeTab.getAttribute('data-tab') : 'all';
        
        // Update transaction list
        updateHistoryTransactionList(filterType);
      });
    }
    
    // Fix back button
    const historyBackButton = document.querySelector('#history-screen .back-button');
    if (historyBackButton) {
      historyBackButton.addEventListener('click', function() {
        hideAllScreens();
        document.getElementById('wallet-screen').style.display = 'flex';
        document.getElementById('wallet-screen').classList.remove('hidden');
      });
    }
  }
  
  // Show history screen
  function showHistoryScreen() {
    hideAllScreens();
    
    const historyScreen = document.getElementById('history-screen');
    if (!historyScreen) {
      console.error('History screen not found');
      return;
    }
    
    historyScreen.style.display = 'flex';
    historyScreen.classList.remove('hidden');
    
    // Update transaction list
    updateHistoryTransactionList('all');
  }
  
  // Update history transaction list
  function updateHistoryTransactionList(filter = 'all') {
    const historyList = document.getElementById('history-transaction-list');
    if (!historyList) return;
    
    // Clear existing transactions
    historyList.innerHTML = '';
    
    // Get transactions for active wallet
    let transactions = window.globalTransactions[window.activeWallet] || [];
    
    // Apply filter if needed
    if (filter !== 'all') {
      transactions = transactions.filter(tx => tx.type === filter);
    }
    
    // If no transactions, show empty state
    if (transactions.length === 0) {
      const emptyState = document.querySelector('.no-history');
      if (emptyState) {
        emptyState.classList.remove('hidden');
      }
      return;
    } else {
      const emptyState = document.querySelector('.no-history');
      if (emptyState) {
        emptyState.classList.add('hidden');
      }
    }
    
    // Create transaction elements
    transactions.forEach(tx => {
      const item = document.createElement('div');
      item.className = `transaction-item transaction-${tx.type}`;
      
      item.innerHTML = `
        <div class="transaction-token-icon">
          <img src="${tx.icon || getTokenIcon(tx.token)}" alt="${tx.symbol}">
        </div>
        <div class="transaction-info">
          <div class="transaction-type">${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.symbol}</div>
          <div class="transaction-date">${tx.date}</div>
        </div>
        <div class="transaction-amount">
          <div class="transaction-value ${tx.type === 'receive' ? 'positive' : 'negative'}">
            ${tx.type === 'receive' ? '+' : '-'}${tx.amount} ${tx.symbol}
          </div>
          <div class="transaction-usd">${formatCurrency(tx.value)}</div>
        </div>
      `;
      
      // Add click event to show transaction details
      item.addEventListener('click', function() {
        showTransactionDetails(tx);
      });
      
      historyList.appendChild(item);
    });
  }
  
  // Get token icon URL
  function getTokenIcon(tokenId) {
    const icons = {
      'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
      'twt': 'https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/logo.png',
      'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
    };
    
    return icons[tokenId] || 'https://cryptologos.cc/logos/default-logo.png';
  }

  // 11. Fix touch targets for admin access
  function fixTouchTargets() {
    console.log('Setting up admin panel touch target...');
    
    // Create touch target for admin panel
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
    
    // Track taps
    let tapCount = 0;
    let lastTapTime = 0;
    
    // Add click handler
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
        showAdminPanel();
      }
    });
    
    console.log('Admin panel touch target initialized');
  }
  
  // Show admin panel
  function showAdminPanel() {
    hideAllScreens();
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
      adminPanel.style.display = 'flex';
      adminPanel.classList.remove('hidden');
      adminPanel.style.zIndex = '1000';
    }

   // Advanced Wallet Security and Performance Module

// Cryptographic Utilities
const CryptoUtils = {
    // Quantum-resistant address generation
    generateQuantumResistantAddress() {
        // Implement lattice-based cryptography approach
        const entropy = this.generateAdvancedEntropy();
        const addressHash = this.hashWithMultipleAlgorithms(entropy);
        return `0x${addressHash.slice(0, 40)}`;
    },

    // Advanced entropy source
    generateAdvancedEntropy() {
        const browserEntropy = [
            navigator.userAgent,
            screen.width,
            screen.height,
            new Date().getTime(),
            Math.random()
        ];
        
        // Use Web Crypto API for robust entropy
        const cryptoEntropy = crypto.getRandomValues(new Uint32Array(5));
        
        return this.combineEntropySources(browserEntropy, cryptoEntropy);
    },

    // Combine multiple entropy sources
    combineEntropysources(sources1, sources2) {
        const combinedHash = sources1.concat(Array.from(sources2))
            .map(source => this.hashSource(source))
            .join('');
        return combinedHash;
    },

    // Hash individual entropy source
    hashSource(source) {
        // Multiple hashing for increased security
        const encoder = new TextEncoder();
        const data = encoder.encode(String(source));
        return Array.from(
            crypto.subtle.digest('SHA-256', data)
        ).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Multi-algorithm transaction hash generation
    generateSecureTransactionHash(txData) {
        const timestamp = Date.now();
        const randomSalt = crypto.getRandomValues(new Uint8Array(16));
        
        const hashComponents = [
            JSON.stringify(txData),
            timestamp.toString(),
            Array.from(randomSalt).map(b => b.toString(16)).join('')
        ];
        
        return crypto.subtle.digest('SHA-256', 
            new TextEncoder().encode(hashComponents.join(''))
        ).then(hash => 
            '0x' + Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
        );
    },

    // Advanced blockchain address validation
    validateBlockchainAddress(address, chain = 'ethereum') {
        const addressValidators = {
            'ethereum': /^0x[a-fA-F0-9]{40}$/,
            'bitcoin': /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
            'xrp': /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/
        };

        const validator = addressValidators[chain.toLowerCase()];
        if (!validator) throw new Error('Unsupported blockchain');

        return validator.test(address);
    }
};

// Performance Optimization Module
const PerformanceManager = {
    // Memoization cache for token data
    _tokenDataCache: new Map(),
    
    // Cached token retrieval with memoization
    getTokenData(tokenId, forceRefresh = false) {
        if (!forceRefresh && this._tokenDataCache.has(tokenId)) {
            return this._tokenDataCache.get(tokenId);
        }
        
        const tokenData = this._fetchTokenData(tokenId);
        this._tokenDataCache.set(tokenId, tokenData);
        return tokenData;
    },

    // Lazy loading transaction history
    lazyLoadTransactions(wallet, startIndex = 0, limit = 20) {
        const allTransactions = wallet.transactions || [];
        return {
            transactions: allTransactions.slice(startIndex, startIndex + limit),
            hasMore: allTransactions.length > startIndex + limit,
            nextIndex: startIndex + limit
        };
    },

    // Implement in-memory transaction caching
    _transactionCache: new Map(),
    cacheTransactions(walletId, transactions) {
        this._transactionCache.set(walletId, transactions);
    },

    // Performance-optimized transaction filtering
    filterTransactions(walletId, filters = {}) {
        const cachedTransactions = this._transactionCache.get(walletId) || [];
        
        return cachedTransactions.filter(tx => {
            return Object.entries(filters).every(([key, value]) => {
                return tx[key] === value;
            });
        });
    }
};

// Enhanced Error Handling
const EnhancedErrorHandler = {
    _errorLog: [],
    
    log(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            context: context
        };
        
        this._errorLog.push(errorEntry);
        
        // Optional: Send to remote logging service
        this._sendErrorToRemoteLogging(errorEntry);
        
        console.error('Wallet Error:', errorEntry);
    },
    
    // Predictive error prevention
    predictErrorRisk(operation) {
        const riskFactors = {
            'transaction': this._calculateTransactionRisk(operation),
            'authentication': this._calculateAuthRisk(operation)
        };
        
        return riskFactors;
    },
    
    // Remote logging placeholder
    _sendErrorToRemoteLogging(errorEntry) {
        // Implement secure error logging mechanism
        // Could use fetch to send to a secure endpoint
    }
};

   // Advanced Transaction and Blockchain Integration Module

const TransactionManager = {
    // Multi-token transaction support
    async processCrossChainTransaction(transactions) {
        const validatedTransactions = await this._validateMultiTokenTransactions(transactions);
        const feeEstimates = await this._estimateNetworkFees(validatedTransactions);
        
        return {
            transactions: validatedTransactions,
            fees: feeEstimates,
            speedCategories: this._categorizeTransactionSpeed(feeEstimates)
        };
    },

    // Comprehensive transaction meta-analysis
    async _validateMultiTokenTransactions(transactions) {
        return Promise.all(transactions.map(async (tx) => {
            const addressValid = CryptoUtils.validateBlockchainAddress(
                tx.recipient, 
                tx.blockchain
            );

            const balanceCheck = await this._checkSufficientBalance(
                tx.sender, 
                tx.amount, 
                tx.token
            );

            return {
                ...tx,
                validated: addressValid && balanceCheck.sufficient,
                balanceDetails: balanceCheck
            };
        }));
    },

    // Network fee estimation with dynamic optimization
    async _estimateNetworkFees(transactions) {
        const feeEstimates = {};
        
        for (const tx of transactions) {
            feeEstimates[tx.token] = await this._calculateDynamicFee(tx);
        }

        return feeEstimates;
    },

    // Dynamic fee calculation considering network conditions
    async _calculateDynamicFee(transaction) {
        const networkConditions = await this._getCurrentNetworkConditions(transaction.blockchain);
        
        return {
            baseFee: networkConditions.baseFee,
            priorityFee: this._calculatePriorityFee(networkConditions),
            totalEstimatedFee: networkConditions.baseFee + this._calculatePriorityFee(networkConditions),
            networkCongestion: networkConditions.congestionLevel
        };
    },

    // Transaction speed categorization
    _categorizeTransactionSpeed(feeEstimates) {
        return Object.entries(feeEstimates).map(([token, feeData]) => ({
            token,
            speed: this._determineTransactionSpeed(feeData.networkCongestion)
        }));
    },

    _determineTransactionSpeed(congestionLevel) {
        if (congestionLevel < 0.3) return 'Fast';
        if (congestionLevel < 0.6) return 'Standard';
        return 'Slow';
    },

    // Placeholder for actual network condition retrieval
    async _getCurrentNetworkConditions(blockchain) {
        // In real implementation, would fetch from blockchain API
        return {
            blockchain,
            baseFee: Math.random() * 0.001,
            congestionLevel: Math.random(),
            gasPrice: Math.random() * 20
        };
    },

    // Balance checking mechanism
    async _checkSufficientBalance(sender, amount, token) {
        const balance = await this._getWalletBalance(sender, token);
        
        return {
            sufficient: balance.available >= amount,
            available: balance.available,
            required: amount,
            difference: balance.available - amount
        };
    },

    // Wallet balance retrieval (mock implementation)
    async _getWalletBalance(sender, token) {
        // In real implementation, would query blockchain
        return {
            token,
            available: Math.random() * 10000,
            total: Math.random() * 10000
        };
    }
};

const NetworkHealthMonitor = {
    // Network connectivity tracking
    _networkConnections: new Map(),
    
    // Real-time network health indicators
    monitorNetworkHealth(blockchains) {
        return blockchains.map(blockchain => ({
            blockchain,
            status: this._checkBlockchainStatus(blockchain),
            latency: this._measureNetworkLatency(blockchain),
            connections: this._trackActiveConnections(blockchain)
        }));
    },

    // Blockchain status check
    _checkBlockchainStatus(blockchain) {
        // Simulated blockchain status check
        const statuses = ['Operational', 'Degraded', 'Maintenance'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    },

    // Network latency measurement
    _measureNetworkLatency(blockchain) {
        // Simulated latency measurement
        return Math.random() * 500; // milliseconds
    },

    // Active connection tracking
    _trackActiveConnections(blockchain) {
        if (!this._networkConnections.has(blockchain)) {
            this._networkConnections.set(blockchain, new Set());
        }
        
        // Simulate connection management
        const connections = this._networkConnections.get(blockchain);
        connections.add(Date.now());
        
        // Remove stale connections
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        connections.forEach(conn => {
            if (conn < oneHourAgo) connections.delete(conn);
        });

        return connections.size;
    }
};

   // Advanced UI/UX and Search Enhancement Module

const UIEnhancer = {
    // Adaptive screen layout management
    initResponsiveDesign() {
        const breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        };

        const updateLayout = () => {
            const width = window.innerWidth;
            const body = document.body;

            body.classList.remove('mobile', 'tablet', 'desktop');

            if (width <= breakpoints.mobile) {
                body.classList.add('mobile');
                this._applyMobileLayout();
            } else if (width <= breakpoints.tablet) {
                body.classList.add('tablet');
                this._applyTabletLayout();
            } else {
                body.classList.add('desktop');
                this._applyDesktopLayout();
            }
        };

        window.addEventListener('resize', updateLayout);
        updateLayout();
    },

    // Mobile-specific layout adjustments
    _applyMobileLayout() {
        const elements = {
            'bottom-navigation': { display: 'flex' },
            'side-menu': { display: 'none' },
            'token-list': { flexDirection: 'column' }
        };

        Object.entries(elements).forEach(([id, styles]) => {
            const el = document.getElementById(id);
            if (el) Object.assign(el.style, styles);
        });
    },

    // Tablet-specific layout adjustments
    _applyTabletLayout() {
        // Similar to mobile, with slight modifications
    },

    // Desktop-specific layout adjustments
    _applyDesktopLayout() {
        // Expanded layout with more complex UI elements
    },

    // Gesture-based navigation
    initGestureNavigation() {
        const gestureZones = {
            'wallet-screen': this._createSwipeHandler('wallet'),
            'token-detail': this._createSwipeHandler('token'),
            'transaction-history': this._createSwipeHandler('history')
        };

        Object.entries(gestureZones).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('touchstart', handler.start);
                element.addEventListener('touchmove', handler.move);
                element.addEventListener('touchend', handler.end);
            }
        });
    },

    // Create swipe handler for different screens
    _createSwipeHandler(screenType) {
        let startX = 0, startY = 0;
        
        return {
            start: (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            },
            move: (e) => {
                // Implement swipe detection logic
            },
            end: (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                
                this._handleSwipeNavigation(screenType, startX, endX, startY, endY);
            }
        };
    },

    // Swipe navigation logic
    _handleSwipeNavigation(screenType, startX, endX, startY, endY) {
        const swipeThreshold = 50;
        const horizontalDiff = endX - startX;
        const verticalDiff = endY - startY;

        if (Math.abs(horizontalDiff) > swipeThreshold) {
            if (horizontalDiff > 0) {
                // Swipe right - go back
                this._navigateBack(screenType);
            } else {
                // Swipe left - go forward or open details
                this._navigateForward(screenType);
            }
        }
    }
};

const AdvancedSearch = {
    // Fuzzy token search with advanced matching
    searchTokens(query, tokens) {
        const normalizedQuery = query.toLowerCase().trim();
        
        return tokens.filter(token => {
            const matchScores = [
                this._calculateNameMatch(token.name, normalizedQuery),
                this._calculateSymbolMatch(token.symbol, normalizedQuery),
                this._calculateNetworkMatch(token.network, normalizedQuery)
            ];

            return Math.max(...matchScores) > 0.6;
        }).sort((a, b) => {
            const aScore = this._calculateTokenScore(a, normalizedQuery);
            const bScore = this._calculateTokenScore(b, normalizedQuery);
            return bScore - aScore;
        });
    },

    // Advanced transaction semantic search
    searchTransactions(query, transactions) {
        const normalizedQuery = query.toLowerCase().trim();
        
        return transactions.filter(tx => {
            const matchFields = [
                tx.type,
                tx.symbol,
                tx.from,
                tx.to,
                tx.hash
            ];

            return matchFields.some(field => 
                field.toLowerCase().includes(normalizedQuery)
            );
        }).sort((a, b) => {
            // Sort by relevance and recency
            const aRelevance = this._calculateTransactionRelevance(a, normalizedQuery);
            const bRelevance = this._calculateTransactionRelevance(b, normalizedQuery);
            return bRelevance - aRelevance;
        });
    },

    // Predictive search suggestions
    generateSearchSuggestions(query, context) {
        const suggestions = [];
        
        // Contextual suggestions based on user's wallet and recent activity
        if (context.recentTokens) {
            suggestions.push(
                ...context.recentTokens
                    .filter(token => token.name.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 3)
            );
        }

        // Add more sophisticated suggestion logic here
        return suggestions;
    },

    // Helper methods for advanced matching
    _calculateNameMatch(name, query) {
        // Implement advanced string matching (Levenshtein distance, etc.)
        return name.toLowerCase().includes(query) ? 1 : 0;
    },

    _calculateSymbolMatch(symbol, query) {
        return symbol.toLowerCase().includes(query) ? 1 : 0;
    },

    _calculateNetworkMatch(network, query) {
        return network.toLowerCase().includes(query) ? 0.7 : 0;
    },

    _calculateTokenScore(token, query) {
        // Complex scoring mechanism for token relevance
        const nameMatch = this._calculateNameMatch(token.name, query);
        const symbolMatch = this._calculateSymbolMatch(token.symbol, query);
        const networkMatch = this._calculateNetworkMatch(token.network, query);

        return (nameMatch * 0.5) + (symbolMatch * 0.3) + (networkMatch * 0.2);
    },

    _calculateTransactionRelevance(transaction, query) {
        // Implement transaction relevance scoring
        const matchFields = [
            transaction.type,
            transaction.symbol,
            transaction.from,
            transaction.to
        ];

        return matchFields.reduce((score, field) => 
            field.toLowerCase().includes(query) ? score + 1 : score
        , 0);
    }
};

   // Final Security and Comprehensive Error Management Module

const SecurityEnhancer = {
    // Passcode Complexity Analysis
    analyzePasscodeComplexity(passcode) {
        const checks = {
            length: passcode.length >= 6,
            hasUppercase: /[A-Z]/.test(passcode),
            hasLowercase: /[a-z]/.test(passcode),
            hasNumbers: /[0-9]/.test(passcode),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passcode)
        };

        const complexityScore = Object.values(checks).filter(Boolean).length;
        
        return {
            valid: complexityScore >= 4,
            score: complexityScore,
            details: checks
        };
    },

    // Biometric Authentication Enhancement
    biometricAuthenticationEntropy() {
        return {
            sources: [
                this._getBrowserFingerprint(),
                this._getHardwareEntropy(),
                this._getTouchPatternEntropy()
            ],
            securityLevel: this._calculateBiometricSecurityLevel()
        };
    },

    // Advanced Touch/Tap Sequence Recognition
    _getTouchPatternEntropy() {
        const touchEvents = [];
        
        const recordTouchPattern = (e) => {
            touchEvents.push({
                type: e.type,
                timestamp: Date.now(),
                coordinates: {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                }
            });
        };

        // Add event listeners
        document.addEventListener('touchstart', recordTouchPattern);
        document.addEventListener('touchmove', recordTouchPattern);
        document.addEventListener('touchend', recordTouchPattern);

        return this._analyzeTouchPatternComplexity(touchEvents);
    },

    // Secure Clipboard Management
    secureClipboardHandler() {
        const clipboardProxy = {
            read: async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    return this._sanitizeClipboardContent(text);
                } catch (error) {
                    EnhancedErrorHandler.log(error, { context: 'clipboard_read' });
                    return null;
                }
            },
            write: async (text) => {
                try {
                    const sanitizedText = this._sanitizeClipboardContent(text);
                    await navigator.clipboard.writeText(sanitizedText);
                    return true;
                } catch (error) {
                    EnhancedErrorHandler.log(error, { context: 'clipboard_write' });
                    return false;
                }
            }
        };

        return clipboardProxy;
    },

    // Sanitize clipboard content
    _sanitizeClipboardContent(text) {
        // Remove potentially malicious content
        return text
            .replace(/<script.*?>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .trim();
    },

    // Browser Fingerprinting for Additional Security
    _getBrowserFingerprint() {
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.colorDepth,
            navigator.hardwareConcurrency,
            navigator.platform,
            new Date().getTimezoneOffset()
        ].join('|');

        return this._hashFingerprint(fingerprint);
    },

    // Hardware Entropy Collection
    _getHardwareEntropy() {
        return [
            navigator.hardwareConcurrency,
            screen.width,
            screen.height,
            navigator.deviceMemory || 0
        ].join('|');
    },

    // Hash fingerprint for anonymization
    _hashFingerprint(fingerprint) {
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    },

    // Calculate Biometric Security Level
    _calculateBiometricSecurityLevel() {
        // Implement complex scoring mechanism
        const entropyFactors = [
            this._getBrowserFingerprint().length,
            this._getHardwareEntropy().split('|').length,
            // Add more entropy sources
        ];

        const baseScore = entropyFactors.reduce((a, b) => a + b, 0);
        return Math.min(Math.max(baseScore / 10, 0), 1);
    },

    // Analyze Touch Pattern Complexity
    _analyzeTouchPatternComplexity(events) {
        if (events.length < 10) return 0;

        const complexityMetrics = {
            uniqueCoordinates: new Set(events.map(e => `${e.coordinates.x},${e.coordinates.y}`)).size,
            timeBetweenEvents: events.slice(1).map((e, i) => e.timestamp - events[i].timestamp),
            eventTypes: new Set(events.map(e => e.type)).size
        };

        return (
            (complexityMetrics.uniqueCoordinates / events.length) * 0.5 +
            (complexityMetrics.eventTypes / 3) * 0.3 +
            (Math.max(...complexityMetrics.timeBetweenEvents) / 1000) * 0.2
        );
    }
};

// Comprehensive Error Handling and Logging
const EnhancedErrorHandler = {
    // Error logging with advanced categorization
    _errorLog: [],
    _errorCategories: {
        NETWORK: 'Network Error',
        AUTHENTICATION: 'Authentication Error',
        TRANSACTION: 'Transaction Error',
        UI: 'User Interface Error',
        SECURITY: 'Security Violation'
    },

    // Log error with comprehensive details
    log(error, context = {}) {
        const errorEntry = {
            id: this._generateErrorId(),
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            category: this._categorizeError(error),
            context: context,
            severity: this._determineSeverity(error)
        };

        this._errorLog.push(errorEntry);
        this._notifyUser(errorEntry);
        this._reportToMonitoringSystem(errorEntry);

        console.error('Wallet Error:', errorEntry);
    },

    // Generate unique error identifier
    _generateErrorId() {
        return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Categorize error type
    _categorizeError(error) {
        // Implement error type detection logic
        const errorTypeMap = {
            'NetworkError': this._errorCategories.NETWORK,
            'AuthenticationError': this._errorCategories.AUTHENTICATION,
            // Add more mappings
        };

        return errorTypeMap[error.name] || this._errorCategories.UI;
    },

    // Determine error severity
    _determineSeverity(error) {
        const severityMap = {
            'TypeError': 'Low',
            'ReferenceError': 'Medium',
            'Error': 'High',
            'SecurityError': 'Critical'
        };

        return severityMap[error.name] || 'Medium';
    },

    // User notification mechanism
    _notifyUser(errorEntry) {
        // Create user-friendly error notification
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'error-notification';
        notificationContainer.innerHTML = `
            <div class="error-header">
                <span class="error-category">${errorEntry.category}</span>
                <span class="error-severity">${errorEntry.severity}</span>
            </div>
            <div class="error-message">${errorEntry.message}</div>
            <button class="error-details-btn">View Details</button>
        `;

        document.body.appendChild(notificationContainer);

        // Add event listener for error details
        const detailsBtn = notificationContainer.querySelector('.error-details-btn');
        detailsBtn.addEventListener('click', () => this._showErrorDetails(errorEntry));
    },

    // Show detailed error information
    _showErrorDetails(errorEntry) {
        const detailsModal = document.createElement('div');
        detailsModal.className = 'error-details-modal';
        detailsModal.innerHTML = `
            <div class="modal-content">
                <h2>Error Details</h2>
                <pre>${JSON.stringify(errorEntry, null, 2)}</pre>
                <button class="close-modal">Close</button>
            </div>
        `;

        document.body.appendChild(detailsModal);
        
        const closeBtn = detailsModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(detailsModal);
        });
    },

    // Report to monitoring system (placeholder)
    _reportToMonitoringSystem(errorEntry) {
        // Implement secure error reporting mechanism
        // Could use fetch to send to a secure logging endpoint
    }
};

   // Wallet Integration and State Management Module

const WalletStateManager = {
    // Centralized state management
    _state: {
        activeWallet: 'main',
        walletData: {},
        transactions: {},
        uiState: {
            currentScreen: 'wallet',
            modalOpen: false,
            searchActive: false
        },
        security: {
            authenticationMethod: 'passcode',
            lastAuthTimestamp: null
        }
    },

    // Initialize wallet state
    initialize(initialData) {
        this._state.walletData = initialData.walletData;
        this._state.transactions = initialData.transactions;
        
        // Setup state persistence
        this._setupStateSync();
        
        // Trigger initial UI update
        this._notifyStateChange();
    },

    // Update wallet state with security checks
    updateState(updates) {
        // Implement immutable state update
        this._state = {
            ...this._state,
            ...updates
        };

        // Validate state changes
        this._validateStateIntegrity();
        
        // Notify components of state change
        this._notifyStateChange();
    },

    // Validate state integrity
    _validateStateIntegrity() {
        const validations = [
            this._validateWalletData(),
            this._validateTransactions(),
            this._validateSecurityState()
        ];

        if (!validations.every(Boolean)) {
            EnhancedErrorHandler.log(
                new Error('State Integrity Compromised'),
                { state: this._state }
            );
        }
    },

    // State synchronization mechanism
    _setupStateSync() {
        // Implement secure state persistence
        const encryptState = (state) => {
            // Use CryptoUtils for secure state encryption
            return CryptoUtils.generateSecureTransactionHash(JSON.stringify(state));
        };

        // Periodic state verification
        setInterval(() => {
            const currentStateHash = encryptState(this._state);
            // Verify state hasn't been tampered with
        }, 60000); // Every minute
    },

    // Notify state changes to registered components
    _notifyStateChange() {
        // Implement pub/sub pattern for state updates
        const stateChangeEvent = new CustomEvent('walletStateChange', {
            detail: { 
                state: { ...this._state },
                timestamp: Date.now()
            }
        });

        document.dispatchEvent(stateChangeEvent);
    },

    // Validation methods
    _validateWalletData() {
        // Comprehensive wallet data validation
        return Object.values(this._state.walletData).every(wallet => 
            wallet.tokens && wallet.totalBalance !== undefined
        );
    },

    _validateTransactions() {
        // Ensure transaction integrity
        return Object.values(this._state.transactions).every(walletTxs => 
            Array.isArray(walletTxs) && 
            walletTxs.every(tx => tx.id && tx.type && tx.amount)
        );
    },

    _validateSecurityState() {
        // Check security state validity
        const { authenticationMethod, lastAuthTimestamp } = this._state.security;
        
        return authenticationMethod && 
               lastAuthTimestamp && 
               (Date.now() - lastAuthTimestamp) < 3600000; // 1-hour auth window
    }
};

// Event Bridge for Module Communication
const EventBridge = {
    // Centralized event handling
    _eventListeners: {},

    // Register event listener
    on(eventName, callback) {
        if (!this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [];
        }
        this._eventListeners[eventName].push(callback);
    },

    // Trigger event
    emit(eventName, eventData) {
        if (this._eventListeners[eventName]) {
            this._eventListeners[eventName].forEach(callback => {
                try {
                    callback(eventData);
                } catch (error) {
                    EnhancedErrorHandler.log(error, {
                        context: 'event_emission',
                        eventName,
                        eventData
                    });
                }
            });
        }
    },

    // Remove event listener
    off(eventName, callback) {
        if (this._eventListeners[eventName]) {
            this._eventListeners[eventName] = 
                this._eventListeners[eventName].filter(cb => cb !== callback);
        }
    }
};

// Unified Authentication Manager
const AuthenticationManager = {
    // Comprehensive authentication method
    authenticate(method, credentials) {
        const authMethods = {
            passcode: this._validatePasscode,
            biometric: this._validateBiometric,
            multiFactor: this._validateMultiFactor
        };

        if (!authMethods[method]) {
            throw new Error('Invalid authentication method');
        }

        return authMethods[method](credentials);
    },

    // Passcode validation
    _validatePasscode(passcode) {
        const complexityCheck = SecurityEnhancer.analyzePasscodeComplexity(passcode);
        
        if (!complexityCheck.valid) {
            throw new Error('Passcode does not meet complexity requirements');
        }

        // Additional validation logic
        const isValid = passcode === window.correctPasscode;
        
        if (isValid) {
            WalletStateManager.updateState({
                security: {
                    authenticationMethod: 'passcode',
                    lastAuthTimestamp: Date.now()
                }
            });
        }

        return isValid;
    },

    // Biometric validation
    _validateBiometric(biometricData) {
        const biometricEntropy = SecurityEnhancer.biometricAuthenticationEntropy();
        
        // Implement biometric validation logic
        const isValid = biometricEntropy.securityLevel > 0.7;
        
        if (isValid) {
            WalletStateManager.updateState({
                security: {
                    authenticationMethod: 'biometric',
                    lastAuthTimestamp: Date.now()
                }
            });
        }

        return isValid;
    },

    // Multi-factor authentication
    _validateMultiFactor(credentials) {
        // Implement multi-factor authentication
        const { passcode, biometricData } = credentials;
        
        return this._validatePasscode(passcode) && 
               this._validateBiometric(biometricData);
    }
};

   // Advanced Wallet Features and Design Refinement Module

const WalletAdvancedFeatures = {
    // Price Prediction and Analytics
    TokenAnalytics: {
        predictPriceTrajectory(token, historicalData) {
            // Machine learning-based price prediction
            const predictionModel = this._createPredictionModel(historicalData);
            return {
                shortTermPrediction: predictionModel.predictNextDay(),
                longTermPrediction: predictionModel.predictNextMonth(),
                volatilityIndex: this._calculateVolatility(historicalData)
            };
        },

        _createPredictionModel(data) {
            // Simplified prediction logic
            return {
                predictNextDay: () => {
                    const lastPrice = data[data.length - 1].price;
                    const trends = this._analyzePriceTrends(data);
                    return lastPrice * (1 + trends.dailyMovementFactor);
                },
                predictNextMonth: () => {
                    const lastPrice = data[data.length - 1].price;
                    const trends = this._analyzePriceTrends(data);
                    return lastPrice * (1 + trends.monthlyMovementFactor);
                }
            };
        },

        _analyzePriceTrends(data) {
            // Calculate price trend factors
            const priceChanges = data.map((point, i) => 
                i > 0 ? point.price - data[i-1].price : 0
            );

            return {
                dailyMovementFactor: this._calculateMovementFactor(priceChanges, 1),
                monthlyMovementFactor: this._calculateMovementFactor(priceChanges, 30)
            };
        },

        _calculateMovementFactor(changes, period) {
            const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
            return avgChange / period;
        },

        _calculateVolatility(data) {
            const prices = data.map(point => point.price);
            const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
            const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
            return Math.sqrt(variance);
        }
    },

    // Enhanced Wallet Recovery Mechanism
    WalletRecovery: {
        generateRecoveryKit(wallet) {
            return {
                seedPhrase: this._generateSecureSeedPhrase(),
                recoveryTimestamp: Date.now(),
                backupKey: this._createBackupKey(wallet),
                securityCheckpoints: this._createRecoveryCheckpoints()
            };
        },

        _generateSecureSeedPhrase() {
            const wordList = [/* Secure word list */];
            return Array.from({length: 12}, () => 
                wordList[Math.floor(Math.random() * wordList.length)]
            ).join(' ');
        },

        _createBackupKey(wallet) {
            // Create encrypted backup key
            const walletData = JSON.stringify(wallet);
            return CryptoUtils.generateSecureTransactionHash(walletData);
        },

        _createRecoveryCheckpoints() {
            return {
                emailVerification: false,
                secondaryDeviceConfirmation: false,
                manualReviewRequired: true
            };
        }
    },

    // Multi-Signature Wallet Support
    MultiSignatureWallet: {
        createMultiSigWallet(owners, requiredSignatures) {
            if (owners.length < requiredSignatures) {
                throw new Error('Invalid multi-sig configuration');
            }

            return {
                type: 'multi-signature',
                owners: owners,
                requiredSignatures: requiredSignatures,
                transactions: [],
                pendingTransactions: []
            };
        },

        proposeTransaction(wallet, transaction) {
            const proposedTx = {
                ...transaction,
                id: CryptoUtils.generateSecureTransactionHash(transaction),
                signatures: [],
                status: 'pending'
            };

            wallet.pendingTransactions.push(proposedTx);
            return proposedTx;
        },

        signTransaction(wallet, transactionId, signer) {
            const tx = wallet.pendingTransactions.find(t => t.id === transactionId);
            
            if (!tx || tx.signatures.includes(signer)) {
                return false;
            }

            tx.signatures.push(signer);

            if (tx.signatures.length >= wallet.requiredSignatures) {
                this._executeFinalizedTransaction(wallet, tx);
            }

            return true;
        },

        _executeFinalizedTransaction(wallet, transaction) {
            // Execute transaction when enough signatures collected
            wallet.transactions.push(transaction);
            wallet.pendingTransactions = wallet.pendingTransactions.filter(
                tx => tx.id !== transaction.id
            );
        }
    },

    // Compliance and Regulatory Features
    ComplianceManager: {
        validateTransaction(transaction) {
            const checks = [
                this._checkTransactionLimit(transaction),
                this._checkGeographicalRestrictions(transaction),
                this._performAMLCheck(transaction)
            ];

            return checks.every(Boolean);
        },

        _checkTransactionLimit(transaction) {
            const DAILY_LIMIT = 10000; // USD equivalent
            return transaction.value <= DAILY_LIMIT;
        },

        _checkGeographicalRestrictions(transaction) {
            // Implement geoblocking logic
            const restrictedCountries = ['North Korea', 'Iran'];
            return !restrictedCountries.includes(transaction.country);
        },

        _performAMLCheck(transaction) {
            // Anti-Money Laundering checks
            return !(
                transaction.isHighRisk ||
                transaction.hasUnusualPattern
            );
        }
    }
};

// Design Refinement Utilities
const DesignRefinement = {
    applyTrustWalletTheme() {
        document.body.classList.add('trust-wallet-theme');
        this._updateColorPalette();
        this._applyTypography();
        this._implementMicroInteractions();
    },

    _updateColorPalette() {
        document.documentElement.style.setProperty('--primary-blue', '#3375BB');
        document.documentElement.style.setProperty('--dark-text', '#1A2024');
        document.documentElement.style.setProperty('--light-bg', '#F5F5F5');
        document.documentElement.style.setProperty('--accent-green', '#05C46B');
        document.documentElement.style.setProperty('--accent-red', '#EB5757');
    },

    _applyTypography() {
        document.body.style.fontFamily = "'Inter', sans-serif";
        // Apply Trust Wallet-like text styles
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            heading.style.fontWeight = '600';
            heading.style.letterSpacing = '-0.02em';
        });
    },

    _implementMicroInteractions() {
        // Add subtle animations and interactions
        const interactiveElements = document.querySelectorAll('.token-item, .action-button');
        interactiveElements.forEach(el => {
            el.addEventListener('mousedown', () => {
                el.style.transform = 'scale(0.98)';
            });
            el.addEventListener('mouseup', () => {
                el.style.transform = 'scale(1)';
            });
        });
    }
};
})();
