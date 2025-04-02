// TrustWallet UI Fixes - Complete Version
// This script applies various fixes to make the UI more authentic to Trust Wallet

console.log('Loading TrustWallet UI fixes...');

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Start with a slight delay to ensure other scripts have run
  setTimeout(initFixes, 300);
});

function initFixes() {
  console.log('Initializing TrustWallet UI fixes...');
  
  // Apply all fixes
  fixStatusBarPadding();
  fixNetworkFilters();
  fixReceivePage();
  fixSendPage();
  fixTokenDetailPage();
  
  // Connect to dynamic content updates
  setupDynamicContentObserver();
  
  console.log('TrustWallet UI fixes initialized');
}

// =================================================================
// GLOBAL FIXES
// =================================================================

// FIX 1: Add proper padding to account for status bar on all screens except home
function fixStatusBarPadding() {
  // Get all screens except wallet home and lock screen
  const screens = document.querySelectorAll('.screen:not(#wallet-screen):not(#lock-screen)');
  
  screens.forEach(screen => {
    // Skip if already fixed
    if (screen.classList.contains('status-bar-fixed')) return;
    
    // Add padding to the entire screen
    screen.style.paddingTop = '20px';
    
    // Also adjust screen header if present
    const header = screen.querySelector('.screen-header');
    if (header) {
      header.style.position = 'sticky';
      header.style.top = '0';
      header.style.zIndex = '100';
      header.style.backgroundColor = '#FFFFFF';
    }
    
    // Mark as fixed
    screen.classList.add('status-bar-fixed');
  });
  
  console.log('Status bar padding fix applied');
}

// Fix 2: Fix the "All Networks" filters in various screens
function fixNetworkFilters() {
  const networkFilters = document.querySelectorAll('.networks-filter .all-networks');
  
  networkFilters.forEach(filter => {
    // Check if filter already has the fix applied
    if (!filter.classList.contains('filter-fixed')) {
      // Apply styling to make it look like Trust Wallet's design
      filter.style.display = 'inline-block';
      filter.style.background = '#F5F5F5';
      filter.style.borderRadius = '16px';
      filter.style.padding = '6px 12px';
      filter.style.fontSize = '12px';
      filter.style.color = '#5F6C75';
      filter.style.margin = '8px 16px';
      filter.style.fontWeight = '500';
      
      // Mark as fixed
      filter.classList.add('filter-fixed');
    }
  });
  
  // Fix container styles
  const filterContainers = document.querySelectorAll('.networks-filter');
  filterContainers.forEach(container => {
    container.style.textAlign = 'left';
    container.style.borderBottom = '1px solid #F5F5F5';
    container.style.paddingBottom = '8px';
  });
}

// =================================================================
// TOKEN DETAIL PAGE FIXES
// =================================================================

function fixTokenDetailPage() {
  const tokenDetailPage = document.getElementById('token-detail');
  if (!tokenDetailPage) {
    console.log('Token detail page not found');
    return;
  }
  
  console.log('Fixing token detail page');
  
  // Fix header format - FORCE DIRECT REPLACEMENT TO ENSURE IT WORKS
  fixTokenDetailHeader(tokenDetailPage);
  
  // Add missing components
  addMissingComponents(tokenDetailPage);
  
  // Fix layout and scrolling
  fixTokenDetailLayout(tokenDetailPage);
  
  // Fix transaction amounts
  fixTransactionAmounts(tokenDetailPage);
  
  // Add event listener for when token details are shown
  document.addEventListener('click', function(e) {
    const tokenItem = e.target.closest('.token-item');
    if (tokenItem) {
      setTimeout(() => {
        console.log('Token item clicked, applying detail fixes');
        fixTokenDetailPage();
      }, 200);
    }
  });
}

function fixTokenDetailHeader(detailPage) {
  console.log('Fixing token detail header');
  
  // DIRECT DOM MANIPULATION - Find token text content
  const detailHeader = detailPage.querySelector('.detail-header');
  if (!detailHeader) {
    console.log('Detail header not found');
    return;
  }
  
  // Get active token
  const activeWallet = window.activeWallet || 'main';
  const tokenId = getActiveTokenId();
  
  // Find token data
  let token = null;
  if (window.currentWalletData && 
      window.currentWalletData[activeWallet] && 
      window.currentWalletData[activeWallet].tokens) {
    token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
  }
  
  if (!token) {
    console.log('Token data not found for ID:', tokenId);
    return;
  }
  
  console.log('Found token:', token);
  
  // DIRECT REPLACEMENT OF TITLE
  const titleElement = detailHeader.querySelector('.token-detail-title');
  if (titleElement) {
    titleElement.innerHTML = `
      <div class="token-text-content">
        <span id="detail-symbol" class="token-symbol">${token.symbol}</span>
        <div id="detail-fullname" class="token-fullname">Coin | ${token.name}</div>
      </div>
    `;
    
    // Style the elements
    const symbolElement = titleElement.querySelector('#detail-symbol');
    if (symbolElement) {
      symbolElement.style.fontSize = '20px';
      symbolElement.style.fontWeight = '600';
      symbolElement.style.display = 'block';
      symbolElement.style.textAlign = 'center';
      symbolElement.style.marginBottom = '4px';
    }
    
    const fullnameElement = titleElement.querySelector('#detail-fullname');
    if (fullnameElement) {
      fullnameElement.style.fontSize = '12px';
      fullnameElement.style.color = '#8A939D';
      fullnameElement.style.textAlign = 'center';
    }
  } else {
    console.log('Title element not found');
  }
}

function addMissingComponents(detailPage) {
  console.log('Adding missing components to token detail page');
  const detailContent = detailPage.querySelector('.token-detail-content');
  if (!detailContent) {
    console.log('Detail content not found');
    return;
  }
  
  // Add investment warning if not already present
  if (!detailContent.querySelector('.investment-warning')) {
    addInvestmentWarning(detailContent);
  }
  
  // Add staking banner if not already present
  if (!detailContent.querySelector('.staking-container')) {
    addStakingBanner(detailContent);
  }
}

function addInvestmentWarning(detailContent) {
  console.log('Adding investment warning');
  
  // Create investment warning
  const warningBanner = document.createElement('div');
  warningBanner.className = 'investment-warning';
  warningBanner.innerHTML = `
    <div class="investment-warning-content">
      <i class="fas fa-exclamation-circle warning-icon"></i>
      <div class="investment-warning-text">
        <p>Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you are unlikely to be protected if something goes wrong. <a href="#" class="learn-more">Take 2 mins to learn more</a>.</p>
      </div>
      <button class="close-warning">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Find where to insert
  const balanceDisplay = detailContent.querySelector('.token-detail-balance');
  if (balanceDisplay) {
    // Insert after balance display
    if (balanceDisplay.nextSibling) {
      detailContent.insertBefore(warningBanner, balanceDisplay.nextSibling);
    } else {
      detailContent.appendChild(warningBanner);
    }
  } else {
    // Insert at beginning
    detailContent.insertBefore(warningBanner, detailContent.firstChild);
  }
  
  // Style the warning
  warningBanner.style.width = 'calc(100% - 32px)';
  warningBanner.style.margin = '16px';
  warningBanner.style.backgroundColor = '#FEF9E7';
  warningBanner.style.color = '#D4AC0D';
  warningBanner.style.borderRadius = '8px';
  warningBanner.style.borderLeft = '4px solid #D4AC0D';
  warningBanner.style.fontSize = '12px';
  
  const warningContent = warningBanner.querySelector('.investment-warning-content');
  if (warningContent) {
    warningContent.style.display = 'flex';
    warningContent.style.alignItems = 'flex-start';
    warningContent.style.padding = '12px';
  }
  
  const warningIcon = warningBanner.querySelector('.warning-icon');
  if (warningIcon) {
    warningIcon.style.fontSize = '20px';
    warningIcon.style.marginRight = '12px';
    warningIcon.style.marginTop = '2px';
  }
  
  const warningText = warningBanner.querySelector('.investment-warning-text');
  if (warningText) {
    warningText.style.flex = '1';
  }
  
  const closeButton = warningBanner.querySelector('.close-warning');
  if (closeButton) {
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#D4AC0D';
    closeButton.style.marginLeft = '8px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.addEventListener('click', function() {
      warningBanner.style.display = 'none';
    });
  }
}

function addStakingBanner(detailContent) {
  console.log('Adding staking banner');
  
  // Get active token
  const activeWallet = window.activeWallet || 'main';
  const tokenId = getActiveTokenId();
  
  // Find token data
  let token = null;
  if (window.currentWalletData && 
      window.currentWalletData[activeWallet] && 
      window.currentWalletData[activeWallet].tokens) {
    token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
  }
  
  if (!token) {
    console.log('Token data not found for staking banner');
    return;
  }
  
  // Create staking banner
  const stakingBanner = document.createElement('div');
  stakingBanner.className = 'staking-container';
  stakingBanner.innerHTML = `
    <div class="staking-icon">
      <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
    </div>
    <div class="staking-content">
      <h3>Earn ${token.symbol}</h3>
      <p>Stake your ${token.symbol} to earn up to 6.5% APY</p>
    </div>
    <i class="fas fa-chevron-right staking-arrow"></i>
  `;
  
  // Find where to insert
  const transactionHeader = detailContent.querySelector('.transaction-header');
  const actionButtons = detailContent.querySelector('.token-detail-actions');
  
  if (transactionHeader) {
    // Insert before transaction section
    detailContent.insertBefore(stakingBanner, transactionHeader);
  } else if (actionButtons) {
    // Insert after action buttons
    if (actionButtons.nextSibling) {
      detailContent.insertBefore(stakingBanner, actionButtons.nextSibling);
    } else {
      detailContent.appendChild(stakingBanner);
    }
  } else {
    // Insert after investment warning or at beginning
    const investmentWarning = detailContent.querySelector('.investment-warning');
    if (investmentWarning) {
      if (investmentWarning.nextSibling) {
        detailContent.insertBefore(stakingBanner, investmentWarning.nextSibling);
      } else {
        detailContent.appendChild(stakingBanner);
      }
    } else {
      detailContent.appendChild(stakingBanner);
    }
  }
  
  // Style the staking banner
  stakingBanner.style.backgroundColor = '#F5F5F5';
  stakingBanner.style.borderRadius = '16px';
  stakingBanner.style.padding = '16px';
  stakingBanner.style.margin = '16px';
  stakingBanner.style.display = 'flex';
  stakingBanner.style.alignItems = 'center';
  stakingBanner.style.position = 'relative';
  stakingBanner.style.cursor = 'pointer';
  
  const stakingIcon = stakingBanner.querySelector('.staking-icon');
  if (stakingIcon) {
    stakingIcon.style.width = '40px';
    stakingIcon.style.height = '40px';
    stakingIcon.style.marginRight = '16px';
  }
  
  const stakingContent = stakingBanner.querySelector('.staking-content');
  if (stakingContent) {
    stakingContent.style.flex = '1';
  }
  
  const stakingTitle = stakingContent.querySelector('h3');
  if (stakingTitle) {
    stakingTitle.style.fontSize = '16px';
    stakingTitle.style.fontWeight = '600';
    stakingTitle.style.marginBottom = '4px';
  }
  
  const stakingDesc = stakingContent.querySelector('p');
  if (stakingDesc) {
    stakingDesc.style.fontSize = '12px';
    stakingDesc.style.color = '#8A939D';
  }
  
  const stakingArrow = stakingBanner.querySelector('.staking-arrow');
  if (stakingArrow) {
    stakingArrow.style.color = '#8A939D';
    stakingArrow.style.position = 'absolute';
    stakingArrow.style.right = '16px';
  }
  
  // Add click handler
  stakingBanner.addEventListener('click', function() {
    showToast('Staking feature coming soon');
  });
}

function fixTokenDetailLayout(detailPage) {
  const detailContent = detailPage.querySelector('.token-detail-content');
  if (!detailContent) return;
  
  // Make only transaction list scrollable
  detailContent.style.display = 'flex';
  detailContent.style.flexDirection = 'column';
  
  // Get price section to pin at bottom
  const priceSection = detailContent.querySelector('.token-price-info');
  if (priceSection) {
    priceSection.style.marginTop = 'auto';
  }
  
  // Make transaction list scrollable
  const transactionList = detailContent.querySelector('.transaction-list');
  if (transactionList) {
    transactionList.style.flex = '1';
    transactionList.style.overflowY = 'auto';
    transactionList.style.overflowX = 'hidden';
    transactionList.style.maxHeight = '300px'; // Adjust based on screen size
  }
}

function fixTransactionAmounts(detailPage) {
  // Find all transaction items
  const transactions = detailPage.querySelectorAll('.transaction-item');
  
  transactions.forEach(tx => {
    const txValue = tx.querySelector('.transaction-value');
    const txUSD = tx.querySelector('.transaction-usd');
    
    // Shorten transaction amount display
    if (txValue) {
      const currentText = txValue.textContent;
      // Extract token amount and symbol
      const match = currentText.match(/([+-])?([\d.,]+)\s+([A-Z]+)/i);
      
      if (match) {
        const sign = match[1] || '';
        const amount = parseFloat(match[2].replace(',', ''));
        const symbol = match[3];
        
        // Format with shortened number
        txValue.textContent = `${sign}${formatTokenAmount(amount)} ${symbol}`;
        txValue.style.fontSize = '14px'; // Smaller font size
      }
    }
    
    // Shorten USD value
    if (txUSD) {
      const currentText = txUSD.textContent;
      const match = currentText.match(/\$?([\d.,]+)/);
      
      if (match) {
        const amount = parseFloat(match[1].replace(',', ''));
        txUSD.textContent = formatCurrency(amount);
        txUSD.style.fontSize = '12px'; // Smaller font size
      }
    }
  });
}

// =================================================================
// HELPER FUNCTIONS & DYNAMIC CONTENT OBSERVER
// =================================================================

function getActiveTokenId() {
  // First try to get from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenId = urlParams.get('token');
  
  if (tokenId) return tokenId;
  
  // Try to get from detail symbol
  const detailSymbol = document.getElementById('detail-symbol');
  if (detailSymbol) {
    return detailSymbol.textContent.toLowerCase();
  }
  
  // Fallback to window variable or default
  return window.activeSendTokenId || 'btc';
}

function getTokenNameById(tokenId) {
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  return token?.name || 'Bitcoin';
}

function getTokenSymbolById(tokenId) {
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  return token?.symbol || 'BTC';
}

function getTokenNetworkById(tokenId) {
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  return token?.network || 'Bitcoin Network';
}

function getTokenLogoUrl(tokenId) {
  // Use existing function if available
  if (typeof window.getTokenLogoUrl === 'function') {
    return window.getTokenLogoUrl(tokenId);
  }
  
  // Fallback implementation
  const logoUrls = {
    'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
    'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
    'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'uni': 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  };
  
  return logoUrls[tokenId.toLowerCase()] || 'https://cryptologos.cc/logos/bitcoin-btc-logo.png';
}

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

function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  // Format based on size
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toFixed(2) + 'M';
  } else if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(2) + 'K';
  } else {
    return '$' + amount.toFixed(2);
  }
}

function showToast(message, duration = 2000) {
  // Use existing function if available
  if (typeof window.showToast === 'function') {
    return window.showToast(message, duration);
  }
  
  // Fallback implementation
  const existingToast = document.querySelector('.tw-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'tw-toast';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  toast.style.color = 'white';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '10000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s';
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // Hide and remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// =================================================================
// RECEIVE PAGE FIXES
// =================================================================

function fixReceivePage() {
  const receiveScreen = document.getElementById('receive-screen');
  if (!receiveScreen) return;
  
  // Check if receive page is in token list mode or QR code mode
  const tokenList = receiveScreen.querySelector('#receive-token-list');
  
  if (tokenList) {
    // Fix token list mode
    fixReceiveTokenList();
  } else {
    // Fix QR code mode
    fixReceiveQRView();
  }
  
  // Add event listener to reapply fixes when navigating to receive screen
  document.addEventListener('click', function(e) {
    if (e.target.id === 'receive-button' || e.target.closest('#receive-button')) {
      setTimeout(fixReceiveTokenList, 100);
    }
  });
}

function fixReceiveTokenList() {
  const tokenItems = document.querySelectorAll('#receive-token-list .token-item');
  
  tokenItems.forEach(item => {
    if (!item.classList.contains('receive-item-fixed')) {
      // Get token data
      const tokenName = item.querySelector('.token-name')?.textContent || '';
      const tokenNetwork = item.querySelector('.token-price')?.textContent || '';
      
      // Fix token info structure
      const tokenInfo = item.querySelector('.token-info');
      if (tokenInfo) {
        tokenInfo.innerHTML = `
          <div class="token-name">${tokenName}</div>
          <div class="token-network-badge">${tokenNetwork}</div>
        `;
      }
      
      // Mark as fixed
      item.classList.add('receive-item-fixed');
    }
  });
}

function fixReceiveQRView() {
  const receiveScreen = document.getElementById('receive-screen');
  const receiveContent = receiveScreen?.querySelector('.receive-content');
  
  if (!receiveContent || receiveContent.classList.contains('receive-qr-fixed')) return;
  
  // Get content elements
  const qrContainer = receiveContent.querySelector('.qr-code-container');
  const addressContainer = receiveContent.querySelector('.wallet-address-container');
  
  if (qrContainer && addressContainer) {
    // Create token indicator
    const tokenSelection = document.createElement('div');
    tokenSelection.className = 'token-selection';
    
    // Get token info from URL or default to BTC
    const urlParams = new URLSearchParams(window.location.search);
    const tokenId = urlParams.get('token') || 'btc';
    const tokenName = getTokenNameById(tokenId);
    const tokenSymbol = getTokenSymbolById(tokenId);
    
    tokenSelection.innerHTML = `
      <div class="token-icon-large">
        <img src="${getTokenLogoUrl(tokenId)}" alt="${tokenName}">
      </div>
      <h3>${tokenName} (${tokenSymbol})</h3>
      <div class="token-address-badge">
        <span class="network-name">${getTokenNetworkById(tokenId)}</span>
        <span class="contract-address">0xC65B6...E90a51</span>
      </div>
    `;
    
    // Insert token selection before QR code
    receiveContent.insertBefore(tokenSelection, qrContainer);
    
    // Add copy/share buttons around QR code
    const actionButtons = document.createElement('div');
    actionButtons.className = 'qr-action-buttons';
    actionButtons.innerHTML = `
      <button class="qr-action-button copy-button">
        <div class="action-icon-circle">
          <i class="fas fa-copy"></i>
        </div>
        <span>Copy</span>
      </button>
      <button class="qr-action-button share-button">
        <div class="action-icon-circle">
          <i class="fas fa-share-alt"></i>
        </div>
        <span>Share</span>
      </button>
    `;
    
    // Insert action buttons after QR code
    receiveContent.insertBefore(actionButtons, addressContainer);
    
    // Style everything
    applyReceiveQRStyles(receiveContent, tokenSelection, actionButtons);
    
    // Mark as fixed
    receiveContent.classList.add('receive-qr-fixed');
    
    // Add copy functionality
    actionButtons.querySelector('.copy-button').addEventListener('click', function() {
      const address = document.getElementById('wallet-address')?.value;
      if (address) {
        try {
          navigator.clipboard.writeText(address)
            .then(() => showToast('Address copied to clipboard'))
            .catch(() => showToast('Failed to copy address'));
        } catch (e) {
          // Fallback for older browsers
          const input = document.getElementById('wallet-address');
          input.select();
          document.execCommand('copy');
          showToast('Address copied to clipboard');
        }
      }
    });
    
    // Add share functionality
    actionButtons.querySelector('.share-button').addEventListener('click', function() {
      showToast('Share functionality coming soon');
    });
  }
}

function applyReceiveQRStyles(receiveContent, tokenSelection, actionButtons) {
  // Fix overall layout
  receiveContent.style.display = 'flex';
  receiveContent.style.flexDirection = 'column';
  receiveContent.style.alignItems = 'center';
  receiveContent.style.padding = '16px';
  receiveContent.style.gap = '24px';
  
  // Style token selection
  tokenSelection.style.display = 'flex';
  tokenSelection.style.flexDirection = 'column';
  tokenSelection.style.alignItems = 'center';
  tokenSelection.style.gap = '8px';
  tokenSelection.style.marginBottom = '8px';
  
  const tokenIconLarge = tokenSelection.querySelector('.token-icon-large');
  if (tokenIconLarge) {
    tokenIconLarge.style.width = '48px';
    tokenIconLarge.style.height = '48px';
    tokenIconLarge.style.marginBottom = '8px';
  }
  
  const tokenAddressBadge = tokenSelection.querySelector('.token-address-badge');
  if (tokenAddressBadge) {
    tokenAddressBadge.style.display = 'flex';
    tokenAddressBadge.style.flexDirection = 'column';
    tokenAddressBadge.style.alignItems = 'center';
    tokenAddressBadge.style.gap = '4px';
    
    const networkName = tokenAddressBadge.querySelector('.network-name');
    if (networkName) {
      networkName.style.padding = '4px 8px';
      networkName.style.borderRadius = '12px';
      networkName.style.backgroundColor = '#F5F5F5';
      networkName.style.fontSize = '12px';
      networkName.style.color = '#5F6C75';
    }
    
    const contractAddress = tokenAddressBadge.querySelector('.contract-address');
    if (contractAddress) {
      contractAddress.style.fontSize = '12px';
      contractAddress.style.color = '#8A939D';
    }
  }
  
  // Style action buttons
  actionButtons.style.display = 'flex';
  actionButtons.style.justifyContent = 'center';
  actionButtons.style.gap = '32px';
  actionButtons.style.margin = '16px 0';
  
  const actionButtonElements = actionButtons.querySelectorAll('.qr-action-button');
  actionButtonElements.forEach(button => {
    button.style.display = 'flex';
    button.style.flexDirection = 'column';
    button.style.alignItems = 'center';
    button.style.gap = '8px';
    button.style.border = 'none';
    button.style.background = 'none';
    button.style.cursor = 'pointer';
    
    const iconCircle = button.querySelector('.action-icon-circle');
    if (iconCircle) {
      iconCircle.style.width = '40px';
      iconCircle.style.height = '40px';
      iconCircle.style.borderRadius = '50%';
      iconCircle.style.backgroundColor = '#F5F5F5';
      iconCircle.style.display = 'flex';
      iconCircle.style.justifyContent = 'center';
      iconCircle.style.alignItems = 'center';
      
      const icon = iconCircle.querySelector('i');
      if (icon) {
        icon.style.color = '#5F6C75';
        icon.style.fontSize = '16px';
      }
    }
    
    const span = button.querySelector('span');
    if (span) {
      span.style.fontSize = '12px';
      span.style.color = '#5F6C75';
    }
  });
  
  // Style QR code
  const qrContainer = receiveContent.querySelector('.qr-code-container');
  if (qrContainer) {
    qrContainer.style.width = '160px';
    qrContainer.style.height = '160px';
    qrContainer.style.padding = '8px';
    qrContainer.style.backgroundColor = 'white';
    qrContainer.style.borderRadius = '8px';
    qrContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }
  
  // Style address container
  const addressContainer = receiveContent.querySelector('.wallet-address-container');
  if (addressContainer) {
    addressContainer.style.display = 'flex';
    addressContainer.style.alignItems = 'center';
    addressContainer.style.justifyContent = 'space-between';
    addressContainer.style.width = '100%';
    addressContainer.style.padding = '12px 16px';
    addressContainer.style.backgroundColor = '#F5F5F5';
    addressContainer.style.borderRadius = '8px';
    
    const addressInput = addressContainer.querySelector('input');
    if (addressInput) {
      addressInput.style.flex = '1';
      addressInput.style.border = 'none';
      addressInput.style.backgroundColor = 'transparent';
      addressInput.style.fontSize = '14px';
      addressInput.style.fontFamily = 'monospace';
    }
    
    const copyButton = addressContainer.querySelector('.copy-address-button');
    if (copyButton) {
      copyButton.style.display = 'flex';
      copyButton.style.alignItems = 'center';
      copyButton.style.gap = '4px';
      copyButton.style.backgroundColor = '#3375BB';
      copyButton.style.color = 'white';
      copyButton.style.border = 'none';
      copyButton.style.borderRadius = '16px';
      copyButton.style.padding = '6px 12px';
      copyButton.style.fontSize = '12px';
      copyButton.style.cursor = 'pointer';
    }
  }
}

// =================================================================
// SEND PAGE FIXES
// =================================================================

function fixSendPage() {
  // Fix token selection page
  fixSendTokenSelect();
  
  // Fix send form page
  fixSendForm();
  
  // Add event listener to reapply fixes when navigating to send screen
  document.addEventListener('click', function(e) {
    if (e.target.id === 'send-button' || e.target.closest('#send-button')) {
      setTimeout(fixSendTokenSelect, 100);
    }
    
    // Listen for token selection
    if (e.target.closest('#select-token-list .token-item')) {
      setTimeout(fixSendForm, 100);
    }
  });
}

function fixSendTokenSelect() {
  const sendTokenSelect = document.getElementById('send-token-select');
  if (!sendTokenSelect || sendTokenSelect.classList.contains('token-select-fixed')) return;
  
  // Get token list
  const tokenList = sendTokenSelect.querySelector('#select-token-list');
  if (!tokenList) return;
  
  // Clear existing content
  tokenList.innerHTML = '';
  
  // Create Popular section
  const popularSection = document.createElement('div');
  popularSection.className = 'token-list-section';
  popularSection.innerHTML = `
    <div class="section-header">Popular</div>
    <div class="token-items-container" id="popular-tokens"></div>
  `;
  
  // Create All crypto section
  const allCryptoSection = document.createElement('div');
  allCryptoSection.className = 'token-list-section';
  allCryptoSection.innerHTML = `
    <div class="section-header">All crypto</div>
    <div class="token-items-container" id="all-tokens"></div>
  `;
  
  // Add sections to token list
  tokenList.appendChild(popularSection);
  tokenList.appendChild(allCryptoSection);
  
  // Style sections
  applySendTokenSelectStyles(sendTokenSelect, popularSection, allCryptoSection);
  
  // Populate sections with tokens
  populateTokenSections();
  
  // Mark as fixed
  sendTokenSelect.classList.add('token-select-fixed');
}

function populateTokenSections() {
  // Get token data from current wallet
  const activeWallet = window.activeWallet || 'main';
  const walletData = window.currentWalletData?.[activeWallet];
  
  if (!walletData?.tokens) return;
  
  // Get container elements
  const popularContainer = document.getElementById('popular-tokens');
  const allContainer = document.getElementById('all-tokens');
  
  if (!popularContainer || !allContainer) return;
  
  // Define popular tokens
  const popularSymbols = ['btc', 'eth', 'bnb', 'sol'];
  
  // Sort tokens with popular tokens first
  const sortedTokens = [...walletData.tokens].sort((a, b) => {
    const aIsPopular = popularSymbols.includes(a.id.toLowerCase());
    const bIsPopular = popularSymbols.includes(b.id.toLowerCase());
    
    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    
    // Secondary sort by value
    return b.value - a.value;
  });
  
  // Create token items
  sortedTokens.forEach(token => {
    const isPopular = popularSymbols.includes(token.id.toLowerCase());
    const container = isPopular ? popularContainer : allContainer;
    
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.setAttribute('data-token-id', token.id);
    
    tokenItem.innerHTML = `
      <div class="token-icon">
        <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
      </div>
      <div class="token-info">
        <div class="token-name">${token.symbol}</div>
        <div class="token-network-badge">${token.network}</div>
      </div>
      <div class="token-amount">
        <div class="token-balance">${formatTokenAmount(token.amount)} ${token.symbol}</div>
        <div class="token-value">${formatCurrency(token.value)}</div>
      </div>
    `;
    
    // Add click handler
    tokenItem.addEventListener('click', function() {
      window.activeSendTokenId = token.id;
      window.navigateTo('send-screen', 'send-token-select');
    });
    
    container.appendChild(tokenItem);
  });
}

function applySendTokenSelectStyles(container, popularSection, allCryptoSection) {
  // Style section headers
  const sectionHeaders = container.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    header.style.fontSize = '14px';
    header.style.fontWeight = '600';
    header.style.color = '#1A2024';
    header.style.padding = '16px 16px 8px';
  });
  
  // Style token sections
  const tokenSections = container.querySelectorAll('.token-list-section');
  tokenSections.forEach(section => {
    section.style.marginBottom = '16px';
  });
  
  // Adjust token items styling
  setTimeout(() => {
    const tokenItems = container.querySelectorAll('.token-item');
    tokenItems.forEach(item => {
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.padding = '12px 16px';
      item.style.borderBottom = '1px solid #F5F5F5';
      
      const tokenIcon = item.querySelector('.token-icon');
      if (tokenIcon) {
        tokenIcon.style.width = '36px';
        tokenIcon.style.height = '36px';
        tokenIcon.style.marginRight = '16px';
        tokenIcon.style.flexShrink = '0';
      }
      
      const tokenInfo = item.querySelector('.token-info');
      if (tokenInfo) {
        tokenInfo.style.flex = '1';
      }
      
      const tokenNameEl = item.querySelector('.token-name');
      if (tokenNameEl) {
        tokenNameEl.style.fontWeight = '600';
        tokenNameEl.style.fontSize = '14px';
        tokenNameEl.style.marginBottom = '4px';
      }
      
      const tokenNetworkBadge = item.querySelector('.token-network-badge');
      if (tokenNetworkBadge) {
        tokenNetworkBadge.style.fontSize = '12px';
        tokenNetworkBadge.style.color = '#8A939D';
      }
      
      const tokenAmount = item.querySelector('.token-amount');
      if (tokenAmount) {
        tokenAmount.style.textAlign = 'right';
      }
      
      const tokenBalance = item.querySelector('.token-balance');
      if (tokenBalance) {
        tokenBalance.style.fontWeight = '600';
        tokenBalance.style.fontSize = '14px';
        tokenBalance.style.marginBottom = '4px';
      }
      
      const tokenValue = item.querySelector('.token-value');
      if (tokenValue) {
        tokenValue.style.fontSize = '12px';
        tokenValue.style.color = '#8A939D';
      }
    });
  }, 0);
}

function fixSendForm() {
  const sendScreen = document.getElementById('send-screen');
  if (!sendScreen || sendScreen.classList.contains('send-form-fixed')) return;
  
  // Get token ID
  const tokenId = window.activeSendTokenId || 'usdt';
  
  // Get token data
  const activeWallet = window.activeWallet || 'main';
  const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
  
  if (!token) return;
  
  // Add token selection display
  const sendContent = sendScreen.querySelector('.send-content');
  if (!sendContent) return;
  
  // Create token selection
  const tokenSelectionRow = document.createElement('div');
  tokenSelectionRow.className = 'token-selection-row';
  tokenSelectionRow.innerHTML = `
    <div class="token-icon">
      <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
    </div>
    <div class="token-info-column">
      <div class="token-name-row">
        <span class="selected-token-name">${token.symbol}</span>
        <span class="token-network-badge">${token.network}</span>
      </div>
      <div class="token-fullname">${token.name}</div>
    </div>
    <div class="token-change-button">
      <i class="fas fa-chevron-right"></i>
    </div>
  `;
  
  // Insert at the beginning of send content
  sendContent.insertBefore(tokenSelectionRow, sendContent.firstChild);
  
  // Style the token selection
  applySendFormStyles(sendScreen, tokenSelectionRow);
  
  // Add click handler to change token
  tokenSelectionRow.addEventListener('click', function() {
    window.navigateTo('send-token-select', 'send-screen');
  });
  
  // Mark as fixed
  sendScreen.classList.add('send-form-fixed');
}

function applySendFormStyles(sendScreen, tokenSelectionRow) {
  // Style token selection row
  tokenSelectionRow.style.display = 'grid';
  tokenSelectionRow.style.gridTemplateColumns = '36px 1fr auto';
  tokenSelectionRow.style.alignItems = 'center';
  tokenSelectionRow.style.gap = '16px';
  tokenSelectionRow.style.padding = '12px 16px';
  tokenSelectionRow.style.backgroundColor = '#F5F5F5';
  tokenSelectionRow.style.borderRadius = '8px';
  tokenSelectionRow.style.marginBottom = '16px';
  tokenSelectionRow.style.cursor = 'pointer';
  
  const tokenIcon = tokenSelectionRow.querySelector('.token-icon');
  if (tokenIcon) {
    tokenIcon.style.width = '36px';
    tokenIcon.style.height = '36px';
    tokenIcon.style.borderRadius = '50%';
    tokenIcon.style.overflow = 'hidden';
  }
  
  const tokenInfoColumn = tokenSelectionRow.querySelector('.token-info-column');
  if (tokenInfoColumn) {
    tokenInfoColumn.style.overflow = 'hidden';
  }
  
  const tokenNameRow = tokenSelectionRow.querySelector('.token-name-row');
  if (tokenNameRow) {
    tokenNameRow.style.display = 'flex';
    tokenNameRow.style.alignItems = 'center';
    tokenNameRow.style.gap = '8px';
  }
  
  const selectedTokenName = tokenSelectionRow.querySelector('.selected-token-name');
  if (selectedTokenName) {
    selectedTokenName.style.fontWeight = '600';
    selectedTokenName.style.fontSize = '16px';
  }
  
  const tokenNetworkBadge = tokenSelectionRow.querySelector('.token-network-badge');
  if (tokenNetworkBadge) {
    tokenNetworkBadge.style.fontSize = '12px';
    tokenNetworkBadge.style.color = '#8A939D';
    tokenNetworkBadge.style.padding = '2px 6px';
    tokenNetworkBadge.style.backgroundColor = 'rgba(138, 147, 157, 0.1)';
    tokenNetworkBadge.style.borderRadius = '10px';
  }
  
  const tokenFullname = tokenSelectionRow.querySelector('.token-fullname');
  if (tokenFullname) {
    tokenFullname.style.fontSize = '12px';
    tokenFullname.style.color = '#8A939D';
    tokenFullname.style.whiteSpace = 'nowrap';
    tokenFullname.style.overflow = 'hidden';
    tokenFullname.style.textOverflow = 'ellipsis';
  }
  
  const tokenChangeButton = tokenSelectionRow.querySelector('.token-change-button');
  if (tokenChangeButton) {
    tokenChangeButton.style.color = '#8A939D';
  }
  
  // Fix form groups
  const formGroups = sendScreen.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.style.marginBottom = '16px';
  });
  
  // Fix labels
  const labels = sendScreen.querySelectorAll('label');
  labels.forEach(label => {
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    label.style.fontSize = '14px';
    label.style.fontWeight = '500';
  });
  
  // Fix inputs
  const inputs = sendScreen.querySelectorAll('input');
  inputs.forEach(input => {
    input.style.width = '100%';
    input.style.padding = '12px';
    input.style.border = '1px solid #E0E0E0';
    input.style.borderRadius = '8px';
    input.style.fontSize = '14px';
  });
  
  // Fix buttons
  const buttons = sendScreen.querySelectorAll('button:not(.back-button):not(.token-change-button)');
  buttons.forEach(button => {
    if (button.id === 'continue-send') {
      button.style.width = '100%';
      button.style.padding = '14px';
      button.style.backgroundColor = '#3375BB';
      button.style.color = 'white';
      button.style.borderRadius = '8px';
      button.style.fontSize = '16px';
      button.style.fontWeight = '600';
      button.style.marginTop = '16px';
    } else {
      button.style.padding = '8px 12px';
      button.style.borderRadius = '4px';
      button.style.fontSize = '12px';
    }
  });
  
  // Fix available balance
  const availableBalance = sendScreen.querySelector('#available-balance');
  if (availableBalance) {
    availableBalance.style.fontSize = '12px';
    availableBalance.style.color = '#8A939D';
    availableBalance.style.marginTop = '8px';
  }
}

// =================================================================
// DYNAMIC CONTENT OBSERVER
// =================================================================

function setupDynamicContentObserver() {
  // Set up a mutation observer to watch for dynamic content changes
  const observer = new MutationObserver(function(mutations) {
    let needsUpdate = false;
    
    mutations.forEach(function(mutation) {
      // Check for added nodes that may indicate screen changes
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // ELEMENT_NODE
            // If a screen becomes visible
            if (node.classList && (
                node.classList.contains('screen') ||
                node.id === 'receive-screen' ||
                node.id === 'send-screen' ||
                node.id === 'token-detail' ||
                node.id === 'send-token-select'
              ) && !node.classList.contains('hidden')) {
              needsUpdate = true;
            }
            
            // If display style changes
            if (mutation.attributeName === 'style' && 
                node.style.display !== 'none' &&
                node.classList && node.classList.contains('screen')) {
              needsUpdate = true;
            }
          }
        });
      }
      
      // Check for attribute changes that may indicate screen visibility changes
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target.nodeType === 1 && // ELEMENT_NODE
            target.classList && target.classList.contains('screen') &&
            mutation.attributeName === 'class' &&
            !target.classList.contains('hidden')) {
          needsUpdate = true;
        }
        
        if (target.nodeType === 1 && // ELEMENT_NODE
            mutation.attributeName === 'style' &&
            target.style.display !== 'none' &&
            target.classList && target.classList.contains('screen')) {
          needsUpdate = true;
        }
      }
    });
    
    if (needsUpdate) {
      // Apply all fixes with a small delay to let other scripts finish
      setTimeout(function() {
        fixStatusBarPadding();
        fixNetworkFilters();
        fixReceivePage();
        fixSendPage();
        fixTokenDetailPage();
      }, 100);
    }
  });
  
  // Observe all changes to the app container
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    observer.observe(appContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
}

// =================================================================
// AUTO-INITIALIZATION ON SCRIPT LOAD
// =================================================================

// Execute fixes when script is loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initFixes, 300);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initFixes, 300);
  });
}

// Also add a dedicated token detail fix that runs after a short delay
setTimeout(function() {
  const tokenDetail = document.getElementById('token-detail');
  if (tokenDetail) {
    fixTokenDetailPage();
  }
}, 1000);

// Export public API
window.TrustWalletFixes = {
  init: initFixes,
  applyAllFixes: function() {
    fixStatusBarPadding();
    fixNetworkFilters();
    fixReceivePage();
    fixSendPage();
    fixTokenDetailPage();
  },
  // Add specific fixers for direct access
  fixTokenDetail: fixTokenDetailPage
};

// Add event listener for navigation events
document.addEventListener('click', function(e) {
  const tokenItem = e.target.closest('.token-item');
  if (tokenItem) {
    // When clicking a token, wait a bit then fix the token detail page
    setTimeout(fixTokenDetailPage, 300);
  }
});
