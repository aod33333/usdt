// Trust Wallet Comprehensive Patch - Part 1
document.addEventListener('DOMContentLoaded', function() {
  // Network Badge Mapping with Precise Updates
  const networkBadgeMap = {
    'usdt': {
      logo: 'https://cryptologos.cc/logos/tron-trx-logo.png',
      network: 'Tron Network'
    },
    'twt': {
      logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      network: 'BNB Smart Chain'
    },
    'bnb': {
      logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      network: 'BNB Smart Chain'
    },
    'pol': {
      logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      network: 'Polygon Network'
    }
  };

  function applyNetworkBadges() {
    const tokenItems = document.querySelectorAll('.token-item');
    tokenItems.forEach(item => {
      const tokenId = item.getAttribute('data-token-id')?.toLowerCase();
      const tokenIcon = item.querySelector('.token-icon');
      
      if (tokenId && networkBadgeMap[tokenId] && tokenIcon) {
        // Remove existing badges first
        const existingBadge = tokenIcon.querySelector('.chain-badge');
        if (existingBadge) existingBadge.remove();

        // Create new badge
        const badge = document.createElement('div');
        badge.className = 'chain-badge';
        const badgeImg = document.createElement('img');
        badgeImg.src = networkBadgeMap[tokenId].logo;
        badgeImg.alt = networkBadgeMap[tokenId].network;
        badge.appendChild(badgeImg);
        
        tokenIcon.appendChild(badge);
      }
    });
  }

  // Small improvements to header alignment
  function improveTokenDetailHeader() {
    const detailHeader = document.querySelector('#token-detail .detail-header');
    if (detailHeader) {
      detailHeader.style.position = 'relative';
      
      const titleElement = detailHeader.querySelector('.token-detail-title');
      if (titleElement) {
        titleElement.style.position = 'absolute';
        titleElement.style.left = '50%';
        titleElement.style.transform = 'translateX(-50%)';
        titleElement.style.width = '100%';
        titleElement.style.textAlign = 'center';
      }
    }
  }

  // Initialization function
  function initializeTrustWalletPatches() {
    applyNetworkBadges();
    improveTokenDetailHeader();
  }

  // Run patches
  initializeTrustWalletPatches();

  // Mutation observer for dynamic content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' &&
          mutation.target.classList.contains('screen') &&
          mutation.target.style.display !== 'none') {
        initializeTrustWalletPatches();
      }
    });
  });

  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    observer.observe(appContainer, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
  }
});

// Trust Wallet Comprehensive Patch - Part 2
document.addEventListener('DOMContentLoaded', function() {
  // Receive Screen Icon Improvements
  function improveReceiveScreenIcons() {
    const receiveScreen = document.getElementById('receive-screen');
    if (!receiveScreen) return;

    const actionButtons = receiveScreen.querySelectorAll('.action-button, .qr-button, .copy-button');
    
    actionButtons.forEach(button => {
      // Circular styling
      button.style.width = '40px';
      button.style.height = '40px';
      button.style.borderRadius = '50%';
      button.style.backgroundColor = '#F5F5F5';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';
      button.style.border = 'none';
      
      // Icon color
      const icon = button.querySelector('i');
      if (icon) {
        icon.style.color = '#8A939D';
      }
    });

    // Specific copy button styling
    const copyAddressButton = receiveScreen.querySelector('.copy-address-button');
    if (copyAddressButton) {
      copyAddressButton.style.backgroundColor = '#3375BB';
      
      const copyIcon = copyAddressButton.querySelector('i');
      if (copyIcon) {
        copyIcon.style.color = 'white';
      }
    }
  }

  // Bottom Navigation Home Tab Fix
  function fixBottomNavigation() {
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (!bottomTabs) return;

    const homeTabs = bottomTabs.querySelectorAll('.tab-item');
    
    homeTabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // Deactivate all tabs
        homeTabs.forEach(t => {
          t.classList.remove('active');
          const icon = t.querySelector('i');
          const text = t.querySelector('span');
          if (icon) icon.style.color = '#8A939D';
          if (text) text.style.color = '#8A939D';
        });

        // Activate clicked tab
        this.classList.add('active');
        
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        if (icon) icon.style.color = '#3375BB';
        if (text) text.style.color = '#3375BB';

        // Home tab specific navigation
        if (index === 0) {
          if (typeof window.navigateTo === 'function') {
            window.navigateTo('wallet-screen');
          } else {
            document.querySelectorAll('.screen').forEach(screen => {
              screen.style.display = 'none';
              screen.classList.add('hidden');
            });
            
            const walletScreen = document.getElementById('wallet-screen');
            if (walletScreen) {
              walletScreen.style.display = 'flex';
              walletScreen.classList.remove('hidden');
            }
          }
        }
      });
    });
  }

  // Wallet Selection Mechanism
  function enhanceWalletSelection() {
    const walletSelector = document.querySelector('.wallet-selector');
    if (!walletSelector) return;

    walletSelector.addEventListener('click', function() {
      const walletOrder = ['main', 'secondary', 'business'];
      const currentIndex = walletOrder.indexOf(window.activeWallet || 'main');
      const nextIndex = (currentIndex + 1) % walletOrder.length;
      
      window.activeWallet = walletOrder[nextIndex];
      
      // Update wallet name
      const walletName = this.querySelector('.wallet-name');
      if (walletName) {
        walletName.textContent = {
          'main': 'Main Wallet 1',
          'secondary': 'Mnemonic 2',
          'business': 'Mnemonic 3'
        }[window.activeWallet];
      }
      
      // Update UI
      if (window.updateWalletUI) {
        window.updateWalletUI(window.activeWallet);
      }
      
      if (window.populateMainWalletTokenList) {
        window.populateMainWalletTokenList();
      }
    });
  }

  // Run improvements
  function runPatches() {
    improveReceiveScreenIcons();
    fixBottomNavigation();
    enhanceWalletSelection();
  }

  // Initial run and observer setup
  runPatches();

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' &&
          mutation.target.classList.contains('screen') &&
          mutation.target.style.display !== 'none') {
        runPatches();
      }
    });
  });

  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    observer.observe(appContainer, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
  }
});

// Trust Wallet Comprehensive Patch - Part 3
document.addEventListener('DOMContentLoaded', function() {
  // Token Detail Page Improvements
  function improveTokenDetailLayout() {
    const tokenDetailContent = document.querySelector('.token-detail-content');
    const tokenPriceInfo = document.querySelector('.token-price-info');
    
    if (tokenDetailContent && tokenPriceInfo) {
      // Make content scrollable
      tokenDetailContent.style.overflowY = 'auto';
      tokenDetailContent.style.height = 'calc(100% - 48px)';
      
      // Fix price section
      tokenPriceInfo.style.position = 'sticky';
      tokenPriceInfo.style.bottom = '0';
      tokenPriceInfo.style.backgroundColor = 'white';
      tokenPriceInfo.style.zIndex = '50';
      tokenPriceInfo.style.marginBottom = '0';
      tokenPriceInfo.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
      
      // Reduce padding on investment banner
      const investmentWarning = tokenDetailContent.querySelector('.investment-warning');
      if (investmentWarning) {
        investmentWarning.style.margin = '8px';
        investmentWarning.style.width = 'calc(100% - 16px)';
      }
    }
  }

  // Staking Banner Dynamic Text
  function updateStakingBanner() {
    const stakingBanners = document.querySelectorAll('.staking-container');
    stakingBanners.forEach(banner => {
      const tokenSymbol = document.getElementById('detail-symbol')?.textContent.toUpperCase() || 'BTC';
      
      const stakingDesc = banner.querySelector('p');
      if (stakingDesc) {
        stakingDesc.textContent = `START EARNING ON YOUR ${tokenSymbol} IN ${tokenSymbol} WALLET`;
      }
    });
  }

  // Send Screen Dynamic Token Icon
  function enhanceSendTokenSelection() {
    const sendTokenSelect = document.getElementById('send-token-select');
    if (!sendTokenSelect) return;

    const tokenItems = sendTokenSelect.querySelectorAll('.token-item');
    tokenItems.forEach(item => {
      const tokenId = item.getAttribute('data-token-id');
      const tokenIcon = item.querySelector('.token-icon img');
      
      if (tokenIcon && tokenId) {
        tokenIcon.src = window.getTokenLogoUrl 
          ? window.getTokenLogoUrl(tokenId)
          : `https://cryptologos.cc/logos/${tokenId}-${tokenId}-logo.png`;
      }
    });
  }

  // Scrolling Behavior
  function disableNestedScrolling() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.style.overscrollBehavor = 'none';
      screen.style.overflow = 'hidden';
    });

    const tokenDetailContent = document.querySelector('.token-detail-content');
    const transactionList = tokenDetailContent?.querySelector('.transaction-list');
    
    if (transactionList) {
      transactionList.style.maxHeight = 'calc(100% - 300px)';
      transactionList.style.overflowY = 'auto';
    }
  }

  // Run improvements
  function runPatches() {
    improveTokenDetailLayout();
    updateStakingBanner();
    enhanceSendTokenSelection();
    disableNestedScrolling();
  }

  // Initial run and observer setup
  runPatches();

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' &&
          mutation.target.classList.contains('screen') &&
          mutation.target.style.display !== 'none') {
        runPatches();
      }
    });
  });

  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    observer.observe(appContainer, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
  }
});

// Trust Wallet Comprehensive Patch - Part 4
document.addEventListener('DOMContentLoaded', function() {
  // Admin Panel Balance Propagation
  function enhanceAdminPanelUpdates() {
    const applyButton = document.getElementById('apply-fake');
    if (applyButton) {
      applyButton.addEventListener('click', function() {
        const walletId = document.getElementById('admin-wallet-select').value;
        const tokenId = document.getElementById('admin-token-select').value;
        const amount = parseFloat(document.getElementById('fake-balance').value);
        const generateHistory = document.getElementById('generate-history').checked;
        
        if (isNaN(amount)) {
          console.error('Invalid amount');
          return;
        }

        // Update wallet data
        if (window.currentWalletData && window.currentWalletData[walletId]) {
          const wallet = window.currentWalletData[walletId];
          const token = wallet.tokens.find(t => t.id === tokenId);
          
          if (token) {
            // Update individual token and total wallet balance
            token.amount = amount / token.price;
            token.value = amount;
            
            // Recalculate total wallet balance
            wallet.totalBalance = wallet.tokens.reduce((total, t) => total + t.value, 0);
            
            // Update all UI elements
            if (walletId === window.activeWallet) {
              const balanceElement = document.getElementById('total-balance');
              if (balanceElement) {
                balanceElement.textContent = window.FormatUtils 
                  ? window.FormatUtils.formatCurrency(wallet.totalBalance)
                  : ' + wallet.totalBalance.toFixed(2);
              }
              
              // Update token list
              if (window.populateMainWalletTokenList) {
                window.populateMainWalletTokenList();
              }
            }
            
            // Generate transaction history if enabled
            if (generateHistory) {
              if (!window.currentTransactions) window.currentTransactions = {};
              if (!window.currentTransactions[walletId]) window.currentTransactions[walletId] = {};
              if (!window.currentTransactions[walletId][tokenId]) window.currentTransactions[walletId][tokenId] = [];
              
              // Create transaction record
              const transaction = {
                id: `tx-${Date.now()}`,
                type: 'receive',
                amount: token.amount,
                symbol: token.symbol,
                value: token.value,
                date: new Date().toISOString().split('T')[0],
                from: '0x' + Math.random().toString(36).substring(2, 15),
                to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
                hash: '0x' + Math.random().toString(36).substring(2, 15)
              };
              
              // Add to transaction history
              window.currentTransactions[walletId][tokenId].unshift(transaction);
              
              // Update transaction history view if possible
              if (window.populateTransactionHistory) {
                window.populateTransactionHistory();
              }
            }
          }
        }
      });
    }
  }

  // Transaction Linking
  function linkTransactionHistory() {
    const historyScreen = document.getElementById('history-screen');
    if (historyScreen) {
      const transactionList = historyScreen.querySelector('#history-transaction-list');
      if (transactionList) {
        transactionList.addEventListener('click', function(e) {
          const transactionItem = e.target.closest('.transaction-item');
          if (transactionItem) {
            // Show transaction details or link to explorer
            if (window.showTransactionDetails) {
              const txData = {
                id: transactionItem.getAttribute('data-tx-id'),
                type: transactionItem.getAttribute('data-tx-type'),
                symbol: transactionItem.getAttribute('data-tx-symbol')
              };
              window.showTransactionDetails(txData);
            }
          }
        });
      }
    }
  }

  // Run improvements
  function runPatches() {
    enhanceAdminPanelUpdates();
    linkTransactionHistory();
  }

  // Initial run and observer setup
  runPatches();

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' &&
          mutation.target.classList.contains('screen') &&
          mutation.target.style.display !== 'none') {
        runPatches();
      }
    });
  });

  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    observer.observe(appContainer, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
  }
});
