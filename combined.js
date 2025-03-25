// ========================================================
// CORE WALLET FUNCTIONALITY
// ========================================================

console.error('Script loading started');

// Add viewport meta tag dynamically if missing
function checkViewport() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);
    }
}

// Enhanced input sanitization helper
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input.replace(/[^\w\s\.\-@]/g, '');
}

// Global variables with clear initialization
let passcodeEntered = '';
let touchSequence = [];
const correctPasscode = '123456'; // Default simple passcode
let balanceModified = false;
let expirationTimer = null;
let activeWallet = 'main';

// DOM Elements (Initialized in DOMContentLoaded)
let lockScreen, walletScreen, tokenDetail, sendScreen, receiveScreen, 
    adminPanel, verifyOverlay, biometricOverlay, explorerOverlay, 
    txStatusModal, dots, numpadKeys;

// Format currency with proper handling
function formatCurrency(value) {
    if (isNaN(value)) return '$0.00';
    return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Generate random wallet address with improved entropy
function generateRandomAddress() {
    let address = '0x';
    const characters = '0123456789abcdef';
    
    for (let i = 0; i < 40; i++) {
        address += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return address;
}

// Generate random transaction hash with improved entropy
function generateRandomTransactionHash() {
    let hash = '0x';
    const characters = '0123456789abcdef';
    
    for (let i = 0; i < 64; i++) {
        hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return hash;
}

// Format date for display with safety checks
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        }) + ' ' + date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Date formatting error:', e);
        return 'Invalid date';
    }
}

// Screen management with error handling
function hideAllScreens() {
    try {
        const screens = [
            'lock-screen', 'wallet-screen', 'token-detail', 
            'send-screen', 'receive-screen', 'admin-panel',
            'verification-overlay', 'biometric-overlay',
            'explorer-overlay', 'tx-status-modal'
        ];
        
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.style.display = 'none';
                screen.classList.add('hidden');
            }
        });
    } catch (error) {
        console.error('Error hiding screens:', error);
    }
}

function showScreen(screenId) {
    try {
        hideAllScreens();
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'flex';
            screen.classList.remove('hidden');
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
    } catch (error) {
        console.error(`Error showing screen ${screenId}:`, error);
    }
}

// Initialize screen visibility with error safety
function initializeAllScreens() {
    console.log('SCREEN INITIALIZATION: Starting screen setup');
    
    const screens = [
        'lock-screen', 'wallet-screen', 'token-detail', 
        'send-screen', 'receive-screen', 'admin-panel',
        'verification-overlay', 'biometric-overlay',
        'explorer-overlay', 'tx-status-modal'
    ];
    
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (!screen) {
            console.error(`SCREEN INITIALIZATION: Screen with ID ${screenId} not found`);
            return;
        }
        
        try {
            // Ensure screens start hidden except lock screen
            if (screenId === 'lock-screen') {
                screen.classList.remove('hidden');
                screen.style.display = 'flex';
            } else {
                screen.classList.add('hidden');
                screen.style.display = 'none';
            }
            
            console.log(`SCREEN INITIALIZATION: ${screenId} processed successfully`);
        } catch (error) {
            console.error(`SCREEN INITIALIZATION: Error processing ${screenId}`, error);
        }
    });
    
    console.log('SCREEN INITIALIZATION: Complete');
}

// ========================================================
// WALLET DATA STRUCTURES
// ========================================================

// Define wallet data structure
const walletData = {
    main: {
        totalBalance: 0,
        tokens: [
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0,
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
                amount: 0,
                value: 0,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            },
            {
                id: 'pol',
                name: 'Polygon',
                symbol: 'POL',
                network: 'Polygon',
                icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                amount: 0,
                value: 0,
                price: 0.20,
                change: 2.05,
                chainBadge: null
            },
            {
                id: 'bnb',
                name: 'BNB',
                symbol: 'BNB',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0,
                value: 0,
                price: 634.12,
                change: 0.95,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'trx',
                name: 'TRON',
                symbol: 'TRX',
                network: 'Tron',
                icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
                amount: 0,
                value: 0,
                price: 0.13,
                change: 0.95,
                chainBadge: null
            },
            {
                id: 'twt',
                name: 'Trust Wallet Token',
                symbol: 'TWT',
                network: 'BNB Smart Chain',
                icon: 'https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/logo.png',
                amount: 0,
                value: 0,
                price: 0.89,
                change: 0.09,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 0,
                value: 0,
                price: 1.00,
                change: 0.00,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'xrp',
                name: 'XRP',
                symbol: 'XRP',
                network: 'XRP Ledger',
                icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
                amount: 0,
                value: 0,
                price: 0.49,
                change: 1.25,
                chainBadge: null
            }
        ]
    },
    secondary: {
        totalBalance: 0,
        tokens: [
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0,
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
                amount: 0,
                value: 0,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            }
        ]
    },
    business: {
        totalBalance: 0,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 0,
                value: 0,
                price: 1.00,
                change: 0.00,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            }
        ]
    }
};

// Original transaction data for each wallet
const originalTransactions = {
    main: {
        usdt: [
            {
                id: 'tx1',
                type: 'receive',
                amount: 500,
                symbol: 'USDT',
                value: 500,
                date: '2024-03-15 14:32',
                from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
                hash: '0x8a65d7c4f5f43c3b390f39d5cf7eb3daddff0cecc7a0621428a03769f6b6e6c9'
            },
            {
                id: 'tx2',
                type: 'receive',
                amount: 750,
                symbol: 'USDT',
                value: 750,
                date: '2024-03-10 09:45',
                from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
                hash: '0x3f8d07cea5fb9537246dcf4dce484f4b6f0d1f6124b04e9ba79a4bf35ec7c5f1'
            }
        ],
        bnb: [
            {
                id: 'tx3',
                type: 'receive',
                amount: 0.25,
                symbol: 'BNB',
                value: 95.67,
                date: '2024-03-05 11:23',
                from: '0x4a3C860a7B60D297A808aCb9917A553A9923A3C8',
                to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
                hash: '0xf34f827283f5f69fa39c2e4683cb79e98f34f5a38c6c9c725d754212a73cb001'
            }
        ]
    },
    secondary: {
        usdt: [
            {
                id: 'tx4',
                type: 'receive',
                amount: 1000,
                symbol: 'USDT',
                value: 1000,
                date: '2024-03-01 16:42',
                from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                to: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2',
                hash: '0xd752a98c7f84b6ad01c88f2e0f5b5c902badab661ac3d1dd1ff339c47b154692'
            }
        ]
    },
    business: {
        usdt: []
    }
};

// FIXED: Deep clone the wallet data for safe reset functionality
const originalWalletData = JSON.parse(JSON.stringify(walletData));
let currentWalletData = JSON.parse(JSON.stringify(walletData));
let currentTransactions = JSON.parse(JSON.stringify(originalTransactions));

// Initialize data structures on page load
document.addEventListener('DOMContentLoaded', function() {
    console.error('DOMContentLoaded fired');
    checkViewport();
    
    console.error('Critical elements:', {
        lockScreen: document.getElementById('lock-screen'),
        walletScreen: document.getElementById('wallet-screen'),
        tokenDetail: document.getElementById('token-detail')
    });
    
    // Safe initialization of wallet data
    window.originalWalletData = JSON.parse(JSON.stringify(walletData));
    window.currentWalletData = JSON.parse(JSON.stringify(walletData));
    window.currentTransactions = JSON.parse(JSON.stringify(originalTransactions));
});

// ========================================================
// WALLET UI FUNCTIONS
// ========================================================

// Update wallet UI with current data with error handling
function updateWalletUI() {
    try {
        // Get current wallet data with safety checks
        if (!currentWalletData || !currentWalletData[activeWallet]) {
            console.error('Missing wallet data for', activeWallet);
            return;
        }
        
        const walletToShow = currentWalletData[activeWallet];
        
        // Update total balance
        const totalBalanceElement = document.getElementById('total-balance');
        if (totalBalanceElement) {
            totalBalanceElement.textContent = formatCurrency(walletToShow.totalBalance);
        }
        
        // Update token list
        const tokenListElement = document.getElementById('token-list');
        if (tokenListElement) {
            tokenListElement.innerHTML = '';
            
            walletToShow.tokens.forEach(token => {
                const tokenElement = createTokenElement(token);
                tokenListElement.appendChild(tokenElement);
            });
        }
    } catch (error) {
        console.error('Error updating wallet UI:', error);
    }
}

// Token detail display function with error handling
function showTokenDetail(tokenId) {
   try {
       tokenDetail = document.getElementById('token-detail');
       walletScreen = document.getElementById('wallet-screen');
       
       if (!tokenDetail || !currentWalletData[activeWallet]) {
           console.error('Token detail initialization failed');
           return;
       }
       
       const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
       if (!token) {
           console.error('Token not found:', tokenId);
           return;
       }
       
       // Update token details
       const elements = {
           'detail-symbol': token.symbol,
           'detail-fullname': token.name,
           'token-balance-amount': `${token.amount.toFixed(6)} ${token.symbol}`,
           'token-balance-value': formatCurrency(token.value),
           'token-staking-symbol': token.symbol,
           'token-price-symbol': token.symbol,
           'token-current-price': `$${token.price.toLocaleString()}`
       };
       
       Object.entries(elements).forEach(([id, value]) => {
           const element = document.getElementById(id);
           if (element) element.textContent = value;
       });

       // Update token icon
       const tokenDetailIcon = document.getElementById('token-detail-icon');
       if (tokenDetailIcon) tokenDetailIcon.src = token.icon;

       // Update token detail header
       try {
           // Get the header container
           const tokenDetailTitle = document.querySelector('.token-detail-title');
           if (tokenDetailTitle) {
               // Clear existing content
               tokenDetailTitle.innerHTML = '';
               
               // Create top line: Token Symbol only
               const symbolContainer = document.createElement('div');
               symbolContainer.className = 'token-symbol-container';
               symbolContainer.style.marginBottom = '2px';
               symbolContainer.style.textAlign = 'center';
               symbolContainer.style.width = '100%';
               
               const detailSymbol = document.createElement('span');
               detailSymbol.id = 'detail-symbol';
               detailSymbol.textContent = token.symbol;
               detailSymbol.style.fontWeight = '600';
               detailSymbol.style.fontSize = '18px';
               detailSymbol.style.textAlign = 'center';
               symbolContainer.appendChild(detailSymbol);
               
               // Create second line: "COIN | Token Name"
               const fullnameContainer = document.createElement('div');
               fullnameContainer.id = 'detail-fullname';
               fullnameContainer.textContent = `COIN | ${token.name}`;
               fullnameContainer.style.fontSize = '12px';
               fullnameContainer.style.color = 'var(--tw-medium-gray)';
               
               // Add both elements to the title container
               tokenDetailTitle.appendChild(symbolContainer);
               tokenDetailTitle.appendChild(fullnameContainer);
               
               // Apply better styling to container
               tokenDetailTitle.style.flexDirection = 'column';
               tokenDetailTitle.style.alignItems = 'flex-start';
               tokenDetailTitle.style.padding = '0';
               
               console.log('Token detail header updated successfully');
           }
       } catch (headerError) {
           console.error('Error updating token detail header:', headerError);
       }

       // Update staking icon for all tokens
       const stakingIcon = document.querySelector('.staking-icon img');
       if (stakingIcon) {
           stakingIcon.src = 'https://i.ibb.co/Ps8mYXGS/Screenshot-20250325-033954-Trust-Wallet.jpg';
       }
       
       // Set price change
       const priceChangeElement = document.getElementById('token-price-change');
       if (priceChangeElement) {
           priceChangeElement.className = token.change >= 0 ? 'positive' : 'negative';
           priceChangeElement.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
       }
       
       // Update gas fee
       const gasFeeAmount = document.getElementById('gas-fee-amount');
       if (gasFeeAmount) {
           gasFeeAmount.textContent = token.id === 'eth' ? '$0.01' : '$0.00';
       }
       
       // Show token detail
       if (walletScreen) walletScreen.classList.add('hidden');
       tokenDetail.classList.remove('hidden');
       tokenDetail.style.display = 'flex';
       
       // Update transactions
       const transactionList = document.getElementById('transaction-list');
       if (transactionList && currentTransactions?.[activeWallet]?.[tokenId]) {
           updateTransactionsForToken(tokenId);
       }

       // Force bottom tabs to remain visible
       setTimeout(() => {
           const bottomTabs = document.querySelector('.bottom-tabs');
           if (bottomTabs) {
               // Move to end of document to ensure proper stacking
               document.body.appendChild(bottomTabs);
               
               // Apply extensive forced styling
               bottomTabs.setAttribute('style', 
                   'display: flex !important; ' +
                   'position: fixed !important; ' +
                   'bottom: 0 !important; ' +
                   'left: 0 !important; ' +
                   'width: 100% !important; ' +
                   'height: 60px !important; ' +
                   'visibility: visible !important; ' +
                   'opacity: 1 !important; ' + 
                   'z-index: 10000 !important; ' +
                   'pointer-events: auto !important; ' +
                   'background-color: #FFFFFF !important; ' +
                   'border-top: 1px solid #F5F5F5 !important;');
               
               // Ensure all tab items are also visible
               const tabItems = bottomTabs.querySelectorAll('.tab-item');
               tabItems.forEach(item => {
                   item.style.display = 'flex';
                   item.style.visibility = 'visible';
                   item.style.opacity = '1';
               });
               
               console.log('Bottom tabs forcibly shown and repositioned');
           }
       }, 100);
       
       // Ensure token detail content is visible
       try {
           // Force details to be visible by adding inline styles
           const content = tokenDetail.querySelector('.token-detail-content');
           if (content) {
               content.style.display = 'block';
               content.style.visibility = 'visible';
               content.style.opacity = '1';
               content.style.height = 'auto';
           }
       } catch (visibilityError) {
           console.error('Error ensuring token detail visibility:', visibilityError);
       }
   } catch (error) {
       console.error('Error showing token detail:', error);
   }
}

// Show send screen with improved error handling
function showSendScreen(tokenId) {
    console.log('Showing send screen', tokenId);
    try {
        sendScreen = document.getElementById('send-screen');
        if (!sendScreen) {
            console.error('Send screen element not found');
            return;
        }
        
        sendScreen.style.display = 'flex';
        sendScreen.classList.remove('hidden');
        
        // Ensure wallet data exists
        if (!currentWalletData || !currentWalletData[activeWallet]) {
            console.error('Wallet data not available');
            return;
        }

        // Find the specific token or use USDT as default
        const tokens = currentWalletData[activeWallet].tokens;
        let token = tokens.find(t => t.id === tokenId) || tokens.find(t => t.id === 'usdt');

        if (!token) {
            console.error(`Token ${tokenId} not found and USDT fallback not available`);
            return;
        }
        
        // Update send screen elements
        const sendTokenTitle = document.getElementById('send-token-title');
        const maxAmount = document.getElementById('max-amount');
        const maxSymbol = document.getElementById('max-symbol');
        
        if (sendTokenTitle) sendTokenTitle.textContent = `Send ${token.symbol}`;
        if (maxAmount) maxAmount.textContent = token.amount.toFixed(6);
        if (maxSymbol) maxSymbol.textContent = token.symbol;
        
        // Ensure form fields have proper attributes
        const recipientAddress = document.getElementById('recipient-address');
        const sendAmount = document.getElementById('send-amount');
        
        if (recipientAddress) {
            recipientAddress.setAttribute('name', 'recipient-address');
            recipientAddress.value = '';
        }
        
        if (sendAmount) {
            sendAmount.setAttribute('name', 'send-amount');
            sendAmount.setAttribute('type', 'number');
            sendAmount.setAttribute('step', '0.000001');
            sendAmount.setAttribute('min', '0');
            sendAmount.setAttribute('max', token.amount.toString());
            sendAmount.value = '';
        }
        
    } catch (error) {
        console.error('Error showing send screen:', error);
    }
}

function getTokenLogoUrl(tokenId) {
   const logoUrls = {
       'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
       'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
       'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
       'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
       'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
       'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
       'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
       'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png'
   };
   return logoUrls[tokenId] || 'https://cryptologos.cc/logos/default-logo.png';
}
// Now modify your createTokenElement function
function createTokenElement(token) {
   try {
       const tokenItem = document.createElement('div');
       tokenItem.className = 'token-item';
       tokenItem.setAttribute('data-token-id', token.id);
       
      let chainBadgeHTML = '';
if (token.chainBadge) {
    // Use the chainBadge directly if it's a URL, otherwise get the logo URL
    const badgeUrl = token.chainBadge.startsWith('http') ? token.chainBadge : getTokenLogoUrl(token.chainBadge);
    chainBadgeHTML = `
        <div class="chain-badge">
            <img src="${badgeUrl}" alt="${token.network}">
        </div>
    `;
}
       
       const formattedPrice = token.price >= 1 
           ? token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
           : token.price.toFixed(2);
       
       const changeClass = token.change >= 0 ? 'positive' : 'negative';
       const changeSign = token.change >= 0 ? '+' : '';
       
       const formattedAmount = token.amount > 0 ? token.amount.toFixed(6) : '0';
       
       const formattedValue = token.value > 0 
           ? formatCurrency(token.value) 
           : '$0.00';
       
       const safeIconUrl = getTokenLogoUrl(token.id);
       
       tokenItem.innerHTML = `
           <div class="token-icon">
               <img src="${safeIconUrl}" alt="${token.name}">
               ${chainBadgeHTML}
           </div>
           <div class="token-info">
               <div class="token-name">
                   ${token.symbol} <span class="token-network">${token.name}</span>
               </div>
               <div class="token-price">
                   $${formattedPrice} <span class="token-price-change ${changeClass}">${changeSign}${token.change}%</span>
               </div>
           </div>
           <div class="token-amount">
               <div class="token-balance">${formattedAmount}</div>
               <div class="token-value">${formattedValue}</div>
           </div>
       `;
       
       return tokenItem;
   } catch (error) {
       console.error('Error creating token element:', error);
       const fallbackItem = document.createElement('div');
       fallbackItem.className = 'token-item error';
       fallbackItem.textContent = 'Error loading token';
       return fallbackItem;
   }
}

// Show receive screen with improved security
function showReceiveScreen(tokenId) {
    console.log('Showing receive screen', tokenId);
    try {
        receiveScreen = document.getElementById('receive-screen');
        if (!receiveScreen) {
            console.error('Receive screen element not found');
            return;
        }
        
        receiveScreen.style.display = 'flex';
        receiveScreen.classList.remove('hidden');
        
        // Ensure wallet data exists
        if (!currentWalletData || !currentWalletData[activeWallet]) {
            console.error('Wallet data not available');
            return;
        }

        const tokens = currentWalletData[activeWallet].tokens;
        const token = tokens.find(t => t.id === tokenId) || tokens[0];
        
        if (!token) {
            console.error(`Token ${tokenId} not found`);
            return;
        }
        
        const tokenIcon = document.getElementById('receive-token-icon');
        const tokenName = document.getElementById('receive-token-name');
        const bitcoinWarning = document.getElementById('bitcoin-warning');
        
        if (tokenIcon) tokenIcon.src = token.icon;
        if (tokenName) tokenName.textContent = token.symbol;
        
        if (bitcoinWarning) {
            if (token.id === 'btc') {
                bitcoinWarning.classList.remove('hidden');
            } else {
                bitcoinWarning.classList.add('hidden');
            }
        }
        
        // Static QR code is already in HTML, no generation needed
    } catch (error) {
        console.error('Error showing receive screen:', error);
    }
}

// Fixed QR code function
function generateQRCode() {
  console.log('Using static QR code - no generation needed');
  
  // No need to get canvas context or draw dynamically
  const walletAddressEl = document.getElementById('wallet-address');
  if (walletAddressEl) {
    // We can update the wallet address text if needed
    // But no need to manipulate the QR code itself as it's now static SVG
    console.log('Wallet address:', walletAddressEl.textContent.trim());
  }
}

// ========================================================
// TRANSACTION MANAGEMENT
// ========================================================

// Update transactions for a specific token with safety
function updateTransactionsForToken(tokenId) {
    try {
        if (!currentTransactions || !currentTransactions[activeWallet]) {
            console.error('Transaction data not available');
            return;
        }
        
        const transactions = currentTransactions[activeWallet][tokenId] || [];
        const transactionListElement = document.getElementById('transaction-list');
        
        if (!transactionListElement) {
            console.error('Transaction list element not found');
            return;
        }
        
        transactionListElement.innerHTML = '';
        
        if (transactions.length === 0) {
            transactionListElement.innerHTML = `
                <div class="empty-transactions">
                    <p>No transactions yet</p>
                </div>
            `;
            return;
        }
        
        transactions.forEach(transaction => {
            const transactionElement = createTransactionElement(transaction);
            transactionListElement.appendChild(transactionElement);
        });
    } catch (error) {
        console.error('Error updating transactions:', error);
    }
}

// Create transaction element with security protections
function createTransactionElement(transaction) {
    try {
        const transactionItem = document.createElement('div');
        transactionItem.className = `transaction-item transaction-${transaction.type}`;
        
        // Safely format values
        const safeAmount = parseFloat(transaction.amount) || 0;
        const safeValue = parseFloat(transaction.value) || 0;
        const safeSymbol = transaction.symbol || '';
        const safeDate = transaction.date || 'Unknown date';
        const safeType = transaction.type === 'receive' ? 'receive' : 'send'; // Only allow valid types
        
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <i class="fas fa-${safeType === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
            </div>
            <div class="transaction-info">
                <div class="transaction-type">${safeType === 'receive' ? 'Received' : 'Sent'}</div>
                <div class="transaction-date">${safeDate}</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value">${safeType === 'receive' ? '+' : '-'}${safeAmount} ${safeSymbol}</div>
                <div class="transaction-usd">${formatCurrency(safeValue)}</div>
            </div>
        `;
        
        // Add click event to show transaction details
        transactionItem.addEventListener('click', () => {
            showTransactionDetails(transaction);
        });
        
        return transactionItem;
    } catch (error) {
        console.error('Error creating transaction element:', error);
        
        // Return fallback element
        const fallbackItem = document.createElement('div');
        fallbackItem.className = 'transaction-item error';
        fallbackItem.textContent = 'Error loading transaction';
        return fallbackItem;
    }
}

// Show transaction details with sanitized values
function showTransactionDetails(transaction) {
    try {
        // Sanitize all values for display
        const safeHash = sanitizeInput(transaction.hash) || 'Unknown';
        const safeFrom = sanitizeInput(transaction.from) || 'Unknown';
        const safeTo = sanitizeInput(transaction.to) || 'Unknown';
        const safeAmount = parseFloat(transaction.amount) || 0;
        const safeValue = parseFloat(transaction.value) || 0;
        const safeSymbol = transaction.symbol || '';
        const safeDate = transaction.date || 'Unknown date';
        
        // In a real app, this would open a modal with transaction details
        alert(`
            Transaction Hash: ${safeHash}
            From: ${safeFrom}
            To: ${safeTo}
            Amount: ${safeAmount} ${safeSymbol}
            Value: ${formatCurrency(safeValue)}
            Date: ${safeDate}
        `);
    } catch (error) {
        console.error('Error showing transaction details:', error);
        alert('Error displaying transaction details');
    }
}

// Process send transaction with improved security
function processSendTransaction() {
    try {
        // Get elements with safety checks
        const sendButton = document.getElementById('continue-send');
        const sendScreen = document.getElementById('send-screen');
        const txStatusModal = document.getElementById('tx-status-modal');
        
        if (!sendButton || !sendScreen || !txStatusModal) {
            console.error('Missing required elements for transaction');
            return;
        }
        
        // Add loading state
        sendButton.classList.add('loading');
        
        // Get and validate input values
        const amountInput = document.getElementById('send-amount');
        const recipientInput = document.getElementById('recipient-address');
        
        if (!amountInput || !recipientInput) {
            alert('Form fields not found');
            sendButton.classList.remove('loading');
            return;
        }
        
        // Sanitize inputs
        const amount = parseFloat(sanitizeInput(amountInput.value));
        const recipient = sanitizeInput(recipientInput.value.trim());
        
        // Basic validation
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            sendButton.classList.remove('loading');
            return;
        }
        
        if (!recipient || !recipient.startsWith('0x')) {
            alert('Please enter a valid recipient address');
            sendButton.classList.remove('loading');
            return;
        }
        
        // Get the current token from active wallet
        const currentWallet = currentWalletData[activeWallet];
        const usdtToken = currentWallet.tokens.find(t => t.id === 'usdt');
        
        if (!usdtToken) {
            alert('Token not found');
            sendButton.classList.remove('loading');
            return;
        }
        
        // Check if we have enough balance
        if (amount > usdtToken.amount) {
            alert('Insufficient balance');
            sendButton.classList.remove('loading');
            return;
        }
        
        // Close send modal
        sendScreen.style.display = 'none';
        
        // Show transaction pending
        txStatusModal.style.display = 'flex';
        document.getElementById('tx-pending').classList.remove('hidden');
        document.getElementById('tx-success').classList.add('hidden');
        
        // Generate random tx hash
        const txHash = generateRandomTransactionHash();
        
        // Update UI elements
        const txHashEl = document.getElementById('tx-hash');
        const txAmountEl = document.getElementById('tx-amount');
        const txToEl = document.getElementById('tx-to');
        
        if (txHashEl) txHashEl.textContent = txHash.substring(0, 10) + '...';
        if (txAmountEl) txAmountEl.textContent = `${amount} USDT`;
        if (txToEl) txToEl.textContent = `${recipient.substring(0, 6)}...`;
        
        // Find recipient wallet if it's one of our wallets
        const walletAddresses = {
            main: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
            secondary: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2',
            business: '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A'
        };
        
        let recipientWalletId = null;
        for (const [walletId, address] of Object.entries(walletAddresses)) {
            if (recipient === address) {
                recipientWalletId = walletId;
                break;
            }
        }
        
        // Simulate blockchain confirmation (3-5 seconds)
        setTimeout(() => {
            try {
                // Remove loading state
                sendButton.classList.remove('loading');
                
                // Show success view
                document.getElementById('tx-pending').classList.add('hidden');
                document.getElementById('tx-success').classList.remove('hidden');
                
                // Update sender wallet balance
                const newAmount = usdtToken.amount - amount;
                usdtToken.amount = newAmount;
                usdtToken.value = newAmount;
                
                // Update total balance
                currentWallet.totalBalance -= amount;
                
                // Update recipient wallet if it's one of our wallets
                if (recipientWalletId) {
                    const recipientWallet = currentWalletData[recipientWalletId];
                    const recipientToken = recipientWallet.tokens.find(t => t.id === 'usdt');
                    
                    if (recipientToken) {
                        recipientToken.amount += amount;
                        recipientToken.value += amount;
                        recipientWallet.totalBalance += amount;
                    }
                }
                
                // Update UI
                updateWalletUI();
                
                // Add transaction to sender history
                const newSendTx = {
                    id: 'tx-' + Date.now(),
                    type: 'send',
                    amount: amount,
                    symbol: 'USDT',
                    value: amount,
                    date: new Date().toISOString().split('T')[0] + ' ' + 
                          new Date().toTimeString().split(' ')[0].substring(0, 5),
                    from: walletAddresses[activeWallet],
                    to: recipient,
                    hash: txHash
                };
                
                // Add to sender transactions
                if (!currentTransactions[activeWallet].usdt) {
                    currentTransactions[activeWallet].usdt = [];
                }
                currentTransactions[activeWallet].usdt.unshift(newSendTx);
                
                // Add to recipient transactions if it's one of our wallets
                if (recipientWalletId) {
                    const newReceiveTx = {
                        id: 'tx-' + Date.now() + 1,
                        type: 'receive',
                        amount: amount,
                        symbol: 'USDT',
                        value: amount,
                        date: new Date().toISOString().split('T')[0] + ' ' + 
                              new Date().toTimeString().split(' ')[0].substring(0, 5),
                        from: walletAddresses[activeWallet],
                        to: recipient,
                        hash: txHash
                    };
                    
                    if (!currentTransactions[recipientWalletId].usdt) {
                        currentTransactions[recipientWalletId].usdt = [];
                    }
                    currentTransactions[recipientWalletId].usdt.unshift(newReceiveTx);
                }
                
                // If detail view is open, update transactions
                const tokenDetail = document.getElementById('token-detail');
                if (tokenDetail && !tokenDetail.classList.contains('hidden')) {
                    updateTransactionsForToken('usdt');
                }
            } catch (finalError) {
                console.error('Error completing transaction:', finalError);
                alert('Transaction processing error');
            }
        }, 3000 + Math.random() * 2000); // Random time between 3-5 seconds
    } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed: ' + error.message);
        
        const sendButton = document.getElementById('continue-send');
        if (sendButton) {
            sendButton.classList.remove('loading');
        }
    }
}

// ========================================================
// TRANSACTION HISTORY FUNCTIONS
// ========================================================

// Generate fake transaction history with security
function generateFakeTransactionHistory(totalAmount, tokenId, walletId) {
    try {
        // Validate parameters
        if (isNaN(totalAmount) || totalAmount <= 0 || !tokenId || !walletId) {
            console.error('Invalid parameters for fake transaction history');
            return;
        }
        
        // Clear existing transactions safely
        if (!currentTransactions[walletId]) {
            currentTransactions[walletId] = {};
        }
        
        if (!currentTransactions[walletId][tokenId]) {
            currentTransactions[walletId][tokenId] = [];
        } else {
            currentTransactions[walletId][tokenId] = [];
        }
        
        // Safety for very large amounts
        const safeAmount = Math.min(totalAmount, 999999999);
        
        // Create a series of fake incoming transactions to match the requested amount
        const transactionCount = Math.min(10, Math.max(3, Math.floor(Math.log10(safeAmount) * 2)));
        
        // Generate random splits of the total amount
        const amounts = splitAmountRandomly(safeAmount, transactionCount);
        
        // Get wallet addresses
        const walletAddresses = {
            main: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
            secondary: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2',
            business: '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A'
        };
        
        const currentWalletAddress = walletAddresses[walletId] || generateRandomAddress();
        
        // Create fake transactions with realistic data
        for (let i = 0; i < amounts.length; i++) {
            const amount = amounts[i];
            
            // Calculate random date within the last 30 days, with newer transactions for larger amounts
            const daysAgo = Math.floor((i / amounts.length) * 30) + Math.floor(Math.random() * 5);
            const transactionDate = new Date();
            transactionDate.setDate(transactionDate.getDate() - daysAgo);
            
            const formattedDate = transactionDate.toISOString().split('T')[0] + ' ' +
                                  transactionDate.toTimeString().split(' ')[0].substring(0, 5);
            
            // Generate random addresses and transaction hash
            const fromAddress = generateRandomAddress();
            const hash = generateRandomTransactionHash();
            
            // Add transaction
            currentTransactions[walletId][tokenId].unshift({
                id: 'fake-tx-' + i,
                type: 'receive',
                amount: parseFloat(amount.toFixed(6)),
                symbol: tokenId.toUpperCase(),
                value: parseFloat(amount.toFixed(2)),
                date: formattedDate,
                from: fromAddress,
                to: currentWalletAddress,
                hash: hash
            });
        }
        
        // Sort transactions by date (newest first)
        currentTransactions[walletId][tokenId].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Update UI if this is the active token in the active wallet
        if (activeWallet === walletId) {
            const tokenDetail = document.getElementById('token-detail');
            if (tokenDetail && !tokenDetail.classList.contains('hidden')) {
                updateTransactionsForToken(tokenId);
            }
        }
    } catch (error) {
        console.error('Error generating fake transaction history:', error);
    }
}

// Split total amount into random chunks for transactions
function splitAmountRandomly(total, parts) {
    try {
        if (isNaN(total) || total <= 0 || parts <= 0) {
            return [total];
        }
        
        const amounts = [];
        let remainingAmount = total;
        let remainingParts = parts;
        
        while (remainingParts > 0) {
            // For the last part, just use the remaining amount
            if (remainingParts === 1) {
                amounts.push(remainingAmount);
                break;
            }
            
            // Generate a random proportion for this part
            const averagePart = remainingAmount / remainingParts;
            const minPart = averagePart * 0.3; // At least 30% of average
            const maxPart = averagePart * 2.5; // At most 250% of average
            
            const part = Math.min(maxPart, Math.max(minPart, Math.random() * averagePart * 2));
            amounts.push(part);
            
            remainingAmount -= part;
            remainingParts--;
        }
        
        // Shuffle the array to avoid having the largest amount at the end
        return amounts.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error splitting amount:', error);
        return [total];
    }
}

// Reset transactions to original data with safety
function resetTransactionsToOriginal(walletId) {
    try {
        if (walletId === 'all') {
            // Reset all wallets to empty transactions
            Object.keys(currentTransactions).forEach(wid => {
                Object.keys(currentTransactions[wid]).forEach(tid => {
                    currentTransactions[wid][tid] = [];
                });
            });
        } else {
            // Reset specific wallet
            if (currentTransactions[walletId]) {
                Object.keys(currentTransactions[walletId]).forEach(tid => {
                    currentTransactions[walletId][tid] = [];
                });
            }
        }
        
        // If token detail view is open, update the transactions
        const tokenDetail = document.getElementById('token-detail');
        if (tokenDetail && !tokenDetail.classList.contains('hidden')) {
            const detailSymbol = document.getElementById('detail-symbol');
            if (detailSymbol) {
                const activeTokenId = detailSymbol.textContent.toLowerCase();
                updateTransactionsForToken(activeTokenId);
            }
        }
    } catch (error) {
        console.error('Error resetting transactions:', error);
    }
}

// ========================================================
// ADMIN PANEL & BALANCE MANIPULATION
// ========================================================

// Function to specifically show the admin panel (can be called from anywhere)
function showAdminPanel() {
  try {
    const adminPanel = document.getElementById('admin-panel');
    if (!adminPanel) {
      console.error('Admin panel element not found');
      return;
    }
    
    console.log('Showing admin panel...');
    
    // First remove the hidden class
    adminPanel.classList.remove('hidden');
    
    // This is critical: The modal parent needs to be flex to display correctly
    adminPanel.style.display = 'flex';
    
    // Make sure it's visible and on top
    adminPanel.style.opacity = '1';
    adminPanel.style.zIndex = '9999';
    adminPanel.style.visibility = 'visible';
    
    console.log('Admin panel display style set to:', adminPanel.style.display);
    
    // Handle close button event
    const closeButton = document.getElementById('close-admin');
    if (closeButton) {
      // Remove any existing listeners to avoid duplicates
      const newCloseBtn = closeButton.cloneNode(true);
      if (closeButton.parentNode) {
        closeButton.parentNode.replaceChild(newCloseBtn, closeButton);
      }
      
      // Add new listener
      newCloseBtn.addEventListener('click', function() {
        console.log('Close button clicked');
        adminPanel.style.display = 'none';
        adminPanel.classList.add('hidden');
      });
    }
  } catch (error) {
    console.error('Error showing admin panel:', error);
  }
}

// Apply fake balance with error handling
function applyFakeBalance(tokenId, amount, expirationHours, generateHistory, walletId) {
    try {
        // Validate inputs
        if (!tokenId || isNaN(amount) || amount < 0 || !walletId) {
            console.error('Invalid parameters for fake balance');
            return;
        }
        
        // Update wallet data with fake balance
        updateWalletWithFakeBalance(tokenId, amount, walletId);
        
        // Generate fake transaction history if needed
        if (generateHistory) {
            generateFakeTransactionHistory(amount, tokenId, walletId);
        }
        
        // Set expiration timer
        setExpirationTimer(expirationHours, walletId);
        
        balanceModified = true;
    } catch (error) {
        console.error('Error applying fake balance:', error);
    }
}

// Setup demo balance with error handling
function setupDemoBalance() {
    try {
        // Update token balances
        updateWalletWithFakeBalance('btc', 8398474.00, 'main');
        updateWalletWithFakeBalance('eth', 986905.00, 'main');
        updateWalletWithFakeBalance('usdt', 10000000.00, 'main');
        updateWalletWithFakeBalance('xrp', 24329.67, 'main');
        updateWalletWithFakeBalance('pol', 1500.00, 'main');
        
        // Generate transaction history for each token
        generateFakeTransactionHistory(8398474.00, 'btc', 'main');
        generateFakeTransactionHistory(986905.00, 'eth', 'main');
        generateFakeTransactionHistory(10000000.00, 'usdt', 'main');
        generateFakeTransactionHistory(24329.67, 'xrp', 'main');
        generateFakeTransactionHistory(1500.00, 'pol', 'main');
        
        // Set total balance
        currentWalletData.main.totalBalance = 19411208.67; // Sum of all token values
        
        // Update UI
        updateWalletUI();
    } catch (error) {
        console.error('Demo balance setup failed:', error);
        try {
            resetToOriginalBalance('main');
        } catch (resetError) {
            console.error('Reset after demo balance failure also failed:', resetError);
        }
    }
}

// Update wallet with fake balance safely
function updateWalletWithFakeBalance(tokenId, amount, walletId) {
    try {
        if (!currentWalletData[walletId]) {
            console.error('Wallet not found:', walletId);
            return;
        }
        
        const wallet = currentWalletData[walletId];
        const token = wallet.tokens.find(t => t.id === tokenId);
        
        if (!token) {
            console.error('Token not found:', tokenId);
            return;
        }
        
        // Calculate the difference to add to total balance
        const difference = amount - token.value;
        
        // Update token with safety checks
        const safeAmount = Math.max(0, amount);
        
        token.amount = safeAmount / (token.price || 1);
        token.value = safeAmount;
        
        // Update total balance
        wallet.totalBalance = Math.max(0, wallet.totalBalance + difference);
        
        // Update UI if this is the active wallet
        if (activeWallet === walletId) {
            updateWalletUI();
        }
    } catch (error) {
        console.error('Error updating wallet with fake balance:', error);
    }
}

// ========================================================
// SECURITY & AUTHENTICATION FUNCTIONS
// ========================================================

// Set expiration timer with safety
function setExpirationTimer(hours, walletId) {
    try {
        // Validate hours
        const safeHours = Math.max(0, parseInt(hours) || 1);
        
        // Clear any existing timer
        if (expirationTimer) {
            clearInterval(expirationTimer);
        }
        
        // Calculate expiration time
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + safeHours);
        
        // Set interval to update the countdown
        expirationTimer = setInterval(() => {
            try {
                const remaining = expirationTime - new Date();
                
                if (remaining <= 0) {
                    // Time expired, reset to original
                    clearInterval(expirationTimer);
                    expirationTimer = null;
                    resetToOriginalBalance(walletId);
                } else {
                    updateExpirationDisplay(remaining);
                }
            } catch (error) {
                console.error('Timer update error:', error);
            }
        }, 1000);
        
        // Initial update
        updateExpirationDisplay(expirationTime - new Date());
    } catch (error) {
        console.error('Error setting expiration timer:', error);
    }
}
// Update expiration display safely
function updateExpirationDisplay(remainingMs) {
    try {
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
    } catch (error) {
        console.error('Error updating expiration display:', error);
    }
}

// Reset to original balance with improved safety
function resetToOriginalBalance(walletId) {
    try {
        resetWalletToOriginal(walletId);
        resetTransactionsToOriginal(walletId);
        
        if (expirationTimer) {
            clearInterval(expirationTimer);
            expirationTimer = null;
        }
        
        updateExpirationDisplay();
        balanceModified = false;
        
        // Update UI
        updateWalletUI();
    } catch (error) {
        console.error('Error resetting to original balance:', error);
    }
}

// Reset wallet to original data safely
function resetWalletToOriginal(walletId) {
    try {
        if (walletId === 'all') {
            // Reset all wallets to the deep copied original data
            currentWalletData = JSON.parse(JSON.stringify(originalWalletData));
        } else if (currentWalletData[walletId] && originalWalletData[walletId]) {
            // Reset specific wallet
            currentWalletData[walletId] = JSON.parse(JSON.stringify(originalWalletData[walletId]));
        }
        
        // Update UI
        updateWalletUI();
    } catch (error) {
        console.error('Error resetting wallet to original:', error);
        
        // Fallback: just zero out all balances
        try {
            if (walletId === 'all') {
                Object.keys(currentWalletData).forEach(wid => {
                    currentWalletData[wid].totalBalance = 0;
                    currentWalletData[wid].tokens.forEach(token => {
                        token.amount = 0;
                        token.value = 0;
                    });
                });
            } else if (currentWalletData[walletId]) {
                currentWalletData[walletId].totalBalance = 0;
                currentWalletData[walletId].tokens.forEach(token => {
                    token.amount = 0;
                    token.value = 0;
                });
            }
            updateWalletUI();
        } catch (fallbackError) {
            console.error('Even fallback reset failed:', fallbackError);
        }
    }
}

// Initialize passcode functionality
function initPasscode() {
    try {
        const numpadKeys = document.querySelectorAll('.numpad-key');
        const dots = document.querySelectorAll('.dot');
        
        numpadKeys.forEach(key => {
            key.addEventListener('click', handlePasscodeInput);
        });
        
        // Add event listener to unlock button
        const unlockButton = document.getElementById('unlock-button');
        if (unlockButton) {
            unlockButton.addEventListener('click', function() {
                if (passcodeEntered.length === 6) {
                    if (passcodeEntered === correctPasscode) {
                        unlockWallet();
                    } else {
                        // Show error (shake animation)
                        const dotsContainer = document.querySelector('.passcode-dots');
                        if (dotsContainer) {
                            dotsContainer.classList.add('shake');
                            setTimeout(() => {
                                dotsContainer.classList.remove('shake');
                                passcodeEntered = '';
                                updatePasscodeDots();
                            }, 500);
                        }
                    }
                } else {
                    // Show error for incomplete passcode
                    alert('Please enter your 6-digit password');
                }
            });
        }
    } catch (error) {
        console.error('Passcode initialization failed:', error);
    }
}

// Handle passcode input safely
function handlePasscodeInput(event) {
    try {
        const key = event.currentTarget.getAttribute('data-key');
        
        if (key === 'bio') {
            // Simulate biometric authentication
            simulateBiometricAuth();
            return;
        }
        
        if (key === 'back') {
            // Handle backspace
            if (passcodeEntered.length > 0) {
                passcodeEntered = passcodeEntered.slice(0, -1);
                updatePasscodeDots();
            }
            return;
        }
        
        // Add digit to passcode
        if (passcodeEntered.length < 6) {
            passcodeEntered += key;
            
            // Animate the dot
            const dotIndex = passcodeEntered.length - 1;
            if (dots && dots[dotIndex]) {
                dots[dotIndex].classList.add('pulse');
                setTimeout(() => {
                    dots[dotIndex].classList.remove('pulse');
                }, 300);
            }
            
            updatePasscodeDots();
            
            // Check if complete passcode entered
            if (passcodeEntered.length === 6) {
                setTimeout(() => {
                    if (passcodeEntered === correctPasscode) {
                        unlockWallet();
                    } else {
                        // Show error (shake animation)
                        const dotsContainer = document.querySelector('.passcode-dots');
                        if (dotsContainer) {
                            dotsContainer.classList.add('shake');
                            setTimeout(() => {
                                dotsContainer.classList.remove('shake');
                                passcodeEntered = '';
                                updatePasscodeDots();
                            }, 500);
                        }
                    }
                }, 300);
            }
        }
    } catch (error) {
        console.error('Error handling passcode input:', error);
    }
}

// Update passcode dots safely
function updatePasscodeDots() {
    try {
        dots = document.querySelectorAll('.dot');
        if (!dots || dots.length === 0) return;
        
        dots.forEach((dot, index) => {
            if (index < passcodeEntered.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    } catch (error) {
        console.error('Error updating passcode dots:', error);
    }
}

// Unlock wallet and show main screen
function unlockWallet() {
    try {
        lockScreen = document.getElementById('lock-screen');
        walletScreen = document.getElementById('wallet-screen');
        
        if (lockScreen) {
            lockScreen.classList.add('hidden');
            lockScreen.style.display = 'none';
        }
        
        if (walletScreen) {
            walletScreen.classList.remove('hidden');
            walletScreen.style.display = 'flex';
        }
        
        passcodeEntered = '';
        updatePasscodeDots();
        
        // If we have an active expiration timer, update the UI
        if (balanceModified && expirationTimer) {
            updateExpirationDisplay();
        }
    } catch (error) {
        console.error('Error unlocking wallet:', error);
    }
}

// Simulate biometric authentication safely
function simulateBiometricAuth() {
    try {
        biometricOverlay = document.getElementById('biometric-overlay');
        const biometricButton = document.querySelector('.numpad-key.biometric');
        
        if (biometricButton) {
            biometricButton.classList.add('loading');
        }
        
        if (!biometricOverlay) {
            throw new Error('Biometric overlay not found');
        }
        
        biometricOverlay.style.display = 'flex';
        
        const fingerprintIcon = document.getElementById('fingerprint-icon');
        const biometricStatus = document.getElementById('biometric-status');
        
        if (!fingerprintIcon || !biometricStatus) {
            throw new Error('Biometric elements missing');
        }
        
        // Simulate scanning animation
        fingerprintIcon.style.color = 'var(--tw-blue)';
        
        setTimeout(() => {
            try {
                biometricStatus.textContent = 'Fingerprint recognized';
                biometricStatus.style.color = 'var(--tw-green)';
                
                setTimeout(() => {
                    biometricOverlay.style.display = 'none';
                    unlockWallet();
                    
                    if (biometricButton) {
                        biometricButton.classList.remove('loading');
                    }
                }, 500);
            } catch (innerError) {
                console.error('Biometric completion error:', innerError);
                if (biometricButton) {
                    biometricButton.classList.remove('loading');
                }
            }
        }, 1500);
    } catch (error) {
        console.error('Biometric simulation failed:', error);
        
        const biometricStatus = document.getElementById('biometric-status');
        if (biometricStatus) {
            biometricStatus.textContent = 'Authentication failed';
            biometricStatus.style.color = 'var(--tw-red)';
        }
        
        const biometricButton = document.querySelector('.numpad-key.biometric');
        if (biometricButton) {
            biometricButton.classList.remove('loading');
        }
    }
}

function initTouchTargets() {
    try {
        // First, remove any existing admin button
        const existingButton = document.querySelector('.admin-test-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Create visible touch target in top right for debugging (will be invisible in final)
        const touchTarget = document.createElement('div');
        touchTarget.id = 'admin-touch-target';
        touchTarget.style.position = 'fixed';
        touchTarget.style.top = '0';
        touchTarget.style.right = '0';
        touchTarget.style.width = '80px'; // Larger target area
        touchTarget.style.height = '80px'; // Larger target area
        touchTarget.style.zIndex = '9999';
        touchTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'; // Slightly visible for testing
        // touchTarget.style.backgroundColor = 'transparent'; // Use this in final version
        
        // Ensure the touch target is added directly to the body
        document.body.appendChild(touchTarget);
        console.log('Touch target created and added to DOM');

        // Track taps for both touch and click
        let tapCount = 0;
        let lastTapTime = 0;
        
        // Handle both touch and click events for maximum compatibility
        const handleTap = function(e) {
            e.preventDefault(); // Prevent default behavior
            console.log('Tap detected on touch target');
            
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastTapTime;
            
            if (timeDiff > 1000) {
                tapCount = 1;
            } else {
                tapCount++;
            }
            
            console.log('Current tap count:', tapCount);
            lastTapTime = currentTime;
            
            if (tapCount >= 3) {
                tapCount = 0;
                console.log('3 taps detected! Opening admin panel...');
                
                // Get the admin panel directly from document
                const adminPanel = document.getElementById('admin-panel');
                console.log('Admin panel element found:', !!adminPanel);
                
                if (adminPanel) {
                    // Force the modal to display with multiple techniques
                    adminPanel.style.display = 'flex';
                    adminPanel.classList.remove('hidden');
                    
                    // Apply inline styles with !important to override any CSS
                    adminPanel.setAttribute('style', 
                        'display: flex !important; ' +
                        'opacity: 1 !important; ' +
                        'visibility: visible !important; ' +
                        'pointer-events: auto !important; ' +
                        'z-index: 10000 !important;');
                    
                    console.log('Admin panel display style set to:', adminPanel.style.display);
                } else {
                    console.error('Admin panel element not found in the DOM');
                }
            }
        };
        
        // Add both touch and click handlers
        touchTarget.addEventListener('click', handleTap);
        touchTarget.addEventListener('touchend', handleTap);
        
        console.log('Admin access setup complete - tap top right corner 3 times quickly');
    } catch (error) {
        console.error('Touch target initialization failed:', error);
    }
}

// Show explorer with transaction details
function showExplorerWithTransaction() {
    try {
        explorerOverlay = document.getElementById('explorer-overlay');
        if (!explorerOverlay) {
            console.error('Explorer overlay not found');
            return;
        }
        
        // Generate a random transaction hash if not already present
        const txHash = generateRandomTransactionHash();
        const explorerTxHashElement = document.getElementById('explorer-tx-hash');
        if (explorerTxHashElement) {
            explorerTxHashElement.textContent = txHash.substring(0, 18) + '...';
        }
        
        // Determine the display amount
        const verifyBalanceElement = document.getElementById('verify-balance');
        const explorerTokenAmountElement = document.getElementById('explorer-token-amount');
        if (verifyBalanceElement && explorerTokenAmountElement) {
            explorerTokenAmountElement.textContent = verifyBalanceElement.textContent;
        }
        
        // Show explorer
        explorerOverlay.style.display = 'flex';
    } catch (error) {
        console.error('Error showing explorer:', error);
    }
}

// Initialize verification process UI
function showVerificationProcess() {
    try {
        verifyOverlay = document.getElementById('verification-overlay');
        if (!verifyOverlay) {
            console.error('Verification overlay not found');
            return;
        }
        
        verifyOverlay.style.display = 'flex';
        
        const verificationResult = document.getElementById('verification-result');
        const progressFill = document.getElementById('progress-fill');
        
        if (verificationResult) verificationResult.classList.add('hidden');
        if (progressFill) progressFill.style.width = '0%';
        
        // Generate random verification ID
        const certId = 'TW-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const certIdElement = document.getElementById('cert-id');
        if (certIdElement) certIdElement.textContent = certId;
        
        // Current timestamp
        const timestamp = new Date().toLocaleString();
        const timestampElement = document.getElementById('verify-timestamp');
        if (timestampElement) timestampElement.textContent = timestamp;
        
        // Current balance
        const balanceElement = document.getElementById('total-balance');
        const verifyBalanceElement = document.getElementById('verify-balance');
        if (balanceElement && verifyBalanceElement) {
            verifyBalanceElement.textContent = balanceElement.textContent;
        }
        
        // Animate progress
        let progress = 0;
        const statusElement = document.getElementById('verification-status');
        
        const progressSteps = [
            { percent: 10, text: 'Initializing secure connection...' },
            { percent: 20, text: 'Connecting to blockchain nodes...' },
            { percent: 30, text: 'Verifying wallet address signature...' },
            { percent: 40, text: 'Authenticating with Tether smart contract...' },
            { percent: 50, text: 'Retrieving token balance from contract...' },
            { percent: 60, text: 'Validating transaction history...' },
            { percent: 70, text: 'Computing cryptographic checksum...' },
            { percent: 80, text: 'Verifying with multiple independent nodes...' },
            { percent: 90, text: 'Generating digital certificate...' },
            { percent: 100, text: 'Verification complete and authenticated' }
        ];
        
        let currentStep = 0;
        const verifyInterval = setInterval(() => {
            if (currentStep < progressSteps.length) {
                const step = progressSteps[currentStep];
                progress = step.percent;
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (statusElement) statusElement.textContent = step.text;
                currentStep++;
                
                if (currentStep === progressSteps.length) {
                    // Complete verification
                    setTimeout(() => {
                        clearInterval(verifyInterval);
                        if (verificationResult) verificationResult.classList.remove('hidden');
                        
                        // Set up blockchain explorer link
                        const viewBlockchainButton = document.getElementById('view-blockchain');
                        if (viewBlockchainButton) {
                            viewBlockchainButton.addEventListener('click', function() {
                                showExplorerWithTransaction();
                            });
                        }
                    }, 500);
                }
            }
        }, 700);
    } catch (error) {
        console.error('Verification process error:', error);
    }
}

// Initialize wallet selector with error handling
function initWalletSelector() {
    try {
        // Use the new wallet name UI
        const walletNameContainer = document.querySelector('.wallet-name');
        
        if (walletNameContainer) {
            // Use dropdown to switch wallets
            walletNameContainer.addEventListener('click', function() {
                // Cycle through wallets
                switch(activeWallet) {
                    case 'main':
                        activeWallet = 'secondary';
                        walletNameContainer.textContent = 'Mnemonic 2';
                        break;
                    case 'secondary':
                        activeWallet = 'business';
                        walletNameContainer.textContent = 'Mnemonic 3';
                        break;
                    default:
                        activeWallet = 'main';
                        walletNameContainer.textContent = 'Mnemonic 1';
                }
                
                // Update wallet display
                updateWalletUI();
            });
        }
    } catch (error) {
        console.error('Wallet selector initialization failed:', error);
    }
}

// Initialize investment warning display
function initInvestmentWarning() {
    try {
        const warningBanner = document.getElementById('investment-warning');
        const closeButton = document.getElementById('close-investment-warning');
        
        if (!warningBanner || !closeButton) {
            console.error('Investment warning elements not found');
            return;
        }
        
        closeButton.addEventListener('click', function() {
            warningBanner.style.display = 'none';
        });
        
        // Show warning initially
        warningBanner.style.display = 'block';
        
        // Initialize disclaimer link
        const disclaimerLink = document.querySelector('.disclaimer-link');
        if (disclaimerLink) {
            disclaimerLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
            });
        }
    } catch (error) {
        console.error('Investment warning initialization failed:', error);
    }
}
// Initialize admin panel
function initAdminPanel() {
    try {
        const adminPanel = document.getElementById('admin-panel');
        const closeAdminBtn = document.getElementById('close-admin');
        const applyFakeBtn = document.getElementById('apply-fake');
        const resetWalletBtn = document.getElementById('reset-wallet');

        if (!adminPanel || !closeAdminBtn || !applyFakeBtn || !resetWalletBtn) return;

        closeAdminBtn.addEventListener('click', () => adminPanel.style.display = 'none');
        
        applyFakeBtn.addEventListener('click', function() {
            const walletId = document.getElementById('admin-wallet-select').value;
            const tokenId = document.getElementById('admin-token-select').value;
            const amount = parseFloat(document.getElementById('fake-balance').value);
            const expiration = parseInt(document.getElementById('expiration-time').value);
            const generateHistory = document.getElementById('generate-history').checked;
            const applyAll = document.getElementById('modify-all-wallets').checked;

            if (applyAll) {
                Object.keys(currentWalletData).forEach(wId => {
                    applyFakeBalance(tokenId, amount, expiration, generateHistory, wId);
                });
            } else {
                applyFakeBalance(tokenId, amount, expiration, generateHistory, walletId);
            }
        });

        resetWalletBtn.addEventListener('click', function() {
            const walletId = document.getElementById('admin-wallet-select').value;
            const applyAll = document.getElementById('modify-all-wallets').checked;
            resetToOriginalBalance(applyAll ? 'all' : walletId);
        });

    } catch (error) {
        console.error('Admin panel init failed:', error);
    }
}

// Initialize event listeners
function initEventListeners() {
    try {
        // Token list click events
        const tokenList = document.getElementById('token-list');
        if (tokenList) {
            tokenList.addEventListener('click', function(event) {
                const tokenItem = event.target.closest('.token-item');
                if (tokenItem) {
                    const tokenId = tokenItem.getAttribute('data-token-id');
                    showTokenDetail(tokenId);
                }
            });
        }
        
        // Back button on token detail
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                console.log('Back button clicked on token detail');
                hideAllScreens();
                const walletScreen = document.getElementById('wallet-screen');
                if (walletScreen) {
                    walletScreen.style.display = 'flex';
                    walletScreen.classList.remove('hidden');
                }
            });
        }
        
        // All other back buttons in send/receive screens
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Back button clicked on send/receive screen');
                hideAllScreens();
                const walletScreen = document.getElementById('wallet-screen');
                if (walletScreen) {
                    walletScreen.style.display = 'flex';
                    walletScreen.classList.remove('hidden');
                }
            });
        });
        
        // Send/Receive buttons
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            sendButton.addEventListener('click', function() {
                showSendScreen('usdt');
            });
        }
        
        const receiveButton = document.getElementById('receive-button');
        if (receiveButton) {
            receiveButton.addEventListener('click', function() {
                showReceiveScreen('btc');
            });
        }
        
        // Add other event listeners if needed...
        
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// Token detail Send/Receive buttons
const detailSendButton = document.querySelector('#token-detail .detail-action:nth-child(1)');
const detailReceiveButton = document.querySelector('#token-detail .detail-action:nth-child(2)');

if (detailSendButton) {
    detailSendButton.addEventListener('click', function() {
        const tokenId = document.getElementById('detail-symbol')?.textContent?.toLowerCase() || 'usdt';
        showSendScreen(tokenId);
    });
}

if (detailReceiveButton) {
    detailReceiveButton.addEventListener('click', function() {
        const tokenId = document.getElementById('detail-symbol')?.textContent?.toLowerCase() || 'btc';
        showReceiveScreen(tokenId);
    });
}

// Setup demo balance with error handling
function setupDemoBalance() {
    try {
        updateWalletWithFakeBalance('btc', 8398474.00, 'main');
        updateWalletWithFakeBalance('eth', 986905.00, 'main');
        updateWalletWithFakeBalance('usdt', 10000000.00, 'main');
        currentWalletData.main.totalBalance = 19385379.00;
        updateWalletUI();
    } catch (error) {
        console.error('Demo balance setup failed:', error);
    }
}
// Initialize pull to refresh functionality
function initPullToRefresh() {
    try {
        const walletBody = document.querySelector('.wallet-body');
        if (!walletBody) return;
        
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        let pullThreshold = 80;
        
        // For mouse simulation (desktop)
        walletBody.addEventListener('mousedown', function(e) {
            if (walletBody.scrollTop === 0) {
                startY = e.clientY;
                isPulling = true;
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isPulling) return;
            
            currentY = e.clientY;
        });
        
        document.addEventListener('mouseup', function() {
            if (!isPulling) return;
            
            isPulling = false;
            
            const pullDistance = currentY - startY;
            
            if (pullDistance > pullThreshold) {
                // Simulate refresh
                setTimeout(() => {
                    // Refresh the wallet UI
                    updateWalletUI();
                }, 500);
            }
        });
        
        // Touch events for mobile
        walletBody.addEventListener('touchstart', function(e) {
            if (walletBody.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });
        
        walletBody.addEventListener('touchmove', function(e) {
            if (!isPulling) return;
            
            currentY = e.touches[0].clientY;
        });
        
        walletBody.addEventListener('touchend', function() {
            if (!isPulling) return;
            
            isPulling = false;
            
            const pullDistance = currentY - startY;
            
            if (pullDistance > pullThreshold) {
                // Simulate refresh
                setTimeout(() => {
                    // Refresh the wallet UI
                    updateWalletUI();
                }, 500);
            }
        });
    } catch (error) {
        console.error('Pull to refresh initialization failed:', error);
    }
}

// ========================================================
// INITIALIZATION
// ========================================================

// Main initialization function with error handling
function safeInit(name, initFunction) {
    try {
        console.group(`Initializing: ${name}`);
        const startTime = performance.now();
        
        if (typeof initFunction !== 'function') {
            throw new Error(`${name} is not a valid function`);
        }
        initFunction();
        const endTime = performance.now();
        console.log(`✅ ${name} initialized (${(endTime - startTime).toFixed(2)}ms)`);
        console.groupEnd();
    } catch (error) {
        console.error(`❌ Initialization failed: ${name}`, error);
        console.groupEnd();
    }
}

// Function to adjust bottom buttons to avoid footer overlap
function adjustBottomButtons() {
    try {
        console.log('Adjusting bottom buttons to avoid footer overlap');
        
        // For the Send button on send screen
        const sendButton = document.getElementById('continue-send');
        if (sendButton) {
            sendButton.style.marginBottom = '70px';
        }
        
        // For Receive screen actions
        const receiveActions = document.querySelector('.receive-actions');
        if (receiveActions) {
            receiveActions.style.marginBottom = '70px';
        }
        
        console.log('Bottom buttons adjusted');
    } catch (error) {
        console.error('Error adjusting bottom buttons:', error);
    }
}

// Function to standardize all investment warning banners
function standardizeWarningBanners() {
    try {
        console.log('Standardizing warning banners across the app');
        
        // Get the main warning banner content
        const mainWarning = document.querySelector('#investment-warning .investment-warning-content');
        if (!mainWarning) {
            console.error('Main warning banner not found');
            return;
        }
        
        // Also clone the close button
        const closeButton = document.querySelector('#close-investment-warning');
        
        // Clone the main warning content HTML
        const warningHTML = mainWarning.innerHTML;
        
        // Get the token detail warning banner
        const tokenWarning = document.querySelector('.token-warning .investment-warning-content');
        if (tokenWarning) {
            tokenWarning.innerHTML = warningHTML;
            // Add a close button if it exists in the original
            if (closeButton) {
                // Check if tokenWarning already has a close button
                const existingClose = tokenWarning.querySelector('.close-warning');
                if (!existingClose) {
                    const newCloseButton = closeButton.cloneNode(true);
                    tokenWarning.appendChild(newCloseButton);
                    newCloseButton.addEventListener('click', function() {
                        tokenWarning.parentElement.style.display = 'none';
                    });
                }
            }
        }
        
        // Add consistent styling to ALL warnings
        const allWarnings = document.querySelectorAll('.investment-warning');
        allWarnings.forEach(warning => {
            warning.style.width = 'calc(100% - 32px)';
            warning.style.margin = '16px';
            warning.style.borderLeft = '4px solid var(--tw-warning-text)';
        });
        
    } catch (error) {
        console.error('Error standardizing warning banners:', error);
    }
}

// Main entry point - DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM Content Loaded - Starting initialization...');
        
        // Log critical elements status
        const criticalElements = {
            adminPanel: document.getElementById('admin-panel'),
            lockScreen: document.getElementById('lock-screen'),
            walletScreen: document.getElementById('wallet-screen'),
            tokenDetail: document.getElementById('token-detail')
        };
        
        console.log('DOM Elements Status:', 
            Object.entries(criticalElements)
                  .map(([k,v]) => `${k}: ${v ? '✓' : '❌'}`)
                  .join(', ')
        );
        
        // Assign to window for global access
        Object.assign(window, criticalElements);
        
        // Initialize in sequence with error handling
        checkViewport();
        
        // Initialize all main components safely
        safeInit('Screen Initialization', initializeAllScreens);
        safeInit('Touch Targets', initTouchTargets);
        safeInit('Passcode', initPasscode);
        safeInit('Admin Panel', initAdminPanel);
        safeInit('Wallet Selector', initWalletSelector);
        safeInit('Event Listeners', initEventListeners);
        safeInit('Investment Warning', initInvestmentWarning);
        safeInit('Pull to Refresh', initPullToRefresh);
        
        // Add our new fixes
        safeInit('Adjust Bottom Buttons', adjustBottomButtons);
        safeInit('Standardize Warnings', standardizeWarningBanners);
        
        // Setup demo data
        safeInit('Demo Balance', setupDemoBalance);
        updateWalletUI();
        
        console.log('✅ INITIALIZATION COMPLETE');
    } catch (globalError) {
        console.error('🔴 CRITICAL GLOBAL INITIALIZATION ERROR:', globalError);
    }
    
    // Add the diagnostic function
    function runDiagnostics() {
      console.log('=== DIAGNOSTICS ===');
      
      // Check critical elements
      const elements = [
        'token-detail', 
        'detail-symbol', 
        'wallet-screen', 
        'admin-panel',
        'token-list'
      ];
      
      elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element "${id}" exists:`, !!element);
        if (element) {
          console.log(`- Display:`, getComputedStyle(element).display);
          console.log(`- Visibility:`, getComputedStyle(element).visibility);
          console.log(`- Z-index:`, getComputedStyle(element).zIndex);
        }
      });
      
      // Check event listeners
      const tokenList = document.getElementById('token-list');
      if (tokenList) {
        console.log('Token list has children:', tokenList.children.length > 0);
      }
      
      // Check global variables
      console.log('Current wallet data:', !!window.currentWalletData);
      console.log('Active wallet:', window.activeWallet);
      
      console.log('=== END DIAGNOSTICS ===');
    }
    
    // Run diagnostics after a delay
    setTimeout(runDiagnostics, 2000);
});

// Export key functions to window for global access
window.hideAllScreens = hideAllScreens;
window.showScreen = showScreen;
window.updateWalletUI = updateWalletUI;
window.showTokenDetail = showTokenDetail;
window.processSendTransaction = processSendTransaction;
window.formatCurrency = formatCurrency;
window.unlockWallet = unlockWallet;
window.setupDemoBalance = setupDemoBalance;
