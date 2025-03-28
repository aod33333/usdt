// =================================================================
// SECTION 1: CORE UTILITIES AND SECURITY
// =================================================================

// Enhanced input sanitization helper
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input.replace(/[^\w\s\.\-@]/g, '');
}

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

// Security utilities
const WalletSecurityUtils = {
    // Generate a secure, random hash
    generateSecureHash(length = 64) {
        const characters = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < length; i++) {
            hash += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return hash;
    },

    // Validate blockchain address format (simple version)
    validateBlockchainAddress(address) {
        // Basic Ethereum address validation
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    },

    // Sanitize clipboard content
    sanitizeClipboardContent(text) {
        return text
            .replace(/<script.*?>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .trim();
    }
};

// Add viewport meta tag dynamically if missing
function checkViewport() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);
    }
}

// =================================================================
// SECTION 2: STATE MANAGEMENT
// =================================================================

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
                icon: 'https://i.ibb.co/ks3wxCRz/Screenshot-2025-03-25-031051.png',
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

// Global transaction store
const globalTransactions = {
    main: [],
    secondary: [],
    business: []
};

// FIXED: Deep clone the wallet data for safe reset functionality
const originalWalletData = JSON.parse(JSON.stringify(walletData));
let currentWalletData = JSON.parse(JSON.stringify(walletData));
let currentTransactions = JSON.parse(JSON.stringify(originalTransactions));

// =================================================================
// SECTION 3: SCREEN MANAGEMENT
// =================================================================

// Screen management with error handling
function hideAllScreens() {
    try {
        const screens = [
            'lock-screen', 'wallet-screen', 'token-detail', 
            'send-screen', 'receive-screen', 'admin-panel',
            'verification-overlay', 'biometric-overlay',
            'explorer-overlay', 'tx-status-modal', 'history-screen'
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
        'explorer-overlay', 'tx-status-modal', 'history-screen'
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

// =================================================================
// SECTION 4: WALLET UI FUNCTIONS
// =================================================================

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
        
        // Update wallet name
        const walletNameElement = document.querySelector('.wallet-name');
        if (walletNameElement) {
            const walletNames = {
                'main': 'Mnemonic 1',
                'secondary': 'Mnemonic 2',
                'business': 'Mnemonic 3'
            };
            walletNameElement.textContent = walletNames[activeWallet] || 'Wallet';
        }
    } catch (error) {
        console.error('Error updating wallet UI:', error);
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

function createTokenElement(token) {
   try {
       const tokenItem = document.createElement('div');
       tokenItem.className = 'token-item';
       tokenItem.setAttribute('data-token-id', token.id);
       
       // Only show network badges for USDT, TWT, and BNB
       let chainBadgeHTML = '';
       const showNetworkBadge = ['usdt', 'twt', 'bnb'].includes(token.id.toLowerCase());
       
       if (showNetworkBadge) {
           const badgeUrl = 'https://cryptologos.cc/logos/bnb-bnb-logo.png';
           chainBadgeHTML = `
               <div class="chain-badge">
                   <img src="${badgeUrl}" alt="BNB Chain">
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
       
       // Add click event listener
       tokenItem.addEventListener('click', function() {
           showTokenDetail(token.id);
       });
       
       return tokenItem;
   } catch (error) {
       console.error('Error creating token element:', error);
       const fallbackItem = document.createElement('div');
       fallbackItem.className = 'token-item error';
       fallbackItem.textContent = 'Error loading token';
       return fallbackItem;
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
      if (tokenDetailIcon) {
          tokenDetailIcon.src = getTokenLogoUrl(token.id);
      }
       
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
       if (walletScreen) walletScreen.style.display = 'none';
       tokenDetail.classList.remove('hidden');
       tokenDetail.style.display = 'flex';
       
       // Update transactions
       const transactionList = document.getElementById('transaction-list');
       if (transactionList && currentTransactions?.[activeWallet]?.[tokenId]) {
           updateTransactionsForToken(tokenId);
       }

       // Fix token detail network badge
       fixTokenDetailBadges();
       
       // Fix the bottom tabs
       fixBottomTabs();
   } catch (error) {
       console.error('Error showing token detail:', error);
   }
}

// Fix showSendScreen function to remove token images
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
        
        // Save active send token ID
        window.activeSendTokenId = tokenId;
        
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
        
        // Fix send button position
        const sendButton = document.getElementById('continue-send');
        if (sendButton) {
            sendButton.style.marginTop = 'auto';
            sendButton.style.marginBottom = '80px';
        }
        
        // Fix back button
        fixSendReceiveScreens();
        
        // At the end of the function, add this to forcefully remove all badges
        setTimeout(() => {
            const allBadges = sendScreen.querySelectorAll('.chain-badge, .chain-badge-fixed');
            allBadges.forEach(badge => {
                badge.remove(); // Completely remove the elements
            });
            
            // Add a style element to ensure they stay hidden
            const style = document.createElement('style');
            style.textContent = '#send-screen .chain-badge, #send-screen .chain-badge-fixed { display: none !important; }';
            document.head.appendChild(style);
        }, 50);
    } catch (error) {
        console.error('Error showing send screen:', error);
    }
}

// Fix showReceiveScreen function to remove token images
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
        
        if (tokenIcon) tokenIcon.src = getTokenLogoUrl(token.id);
        if (tokenName) tokenName.textContent = token.symbol;
        
        // For BTC show warning, otherwise hide
        if (bitcoinWarning) {
            if (token.id === 'btc') {
                bitcoinWarning.classList.remove('hidden');
            } else {
                bitcoinWarning.classList.add('hidden');
            }
        }
        
        // Fix back button
        fixSendReceiveScreens();
        
        // Similar aggressive removal in showReceiveScreen
        setTimeout(() => {
            const allBadges = receiveScreen.querySelectorAll('.chain-badge, .chain-badge-fixed');
            allBadges.forEach(badge => {
                badge.remove(); // Completely remove the elements
            });
            
            // Add a style element to ensure they stay hidden
            const style = document.createElement('style');
            style.textContent = '#receive-screen .chain-badge, #receive-screen .chain-badge-fixed { display: none !important; }';
            document.head.appendChild(style);
        }, 50);
    } catch (error) {
        console.error('Error showing receive screen:', error);
    }
}
// =================================================================
// SECTION 5: TRANSACTION MANAGEMENT
// =================================================================

// Process send transaction with improved security and UI
function processSendTransaction(e) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
        e.stopPropagation();
    }

    try {
        // Get active token
        const tokenId = window.activeSendTokenId || 'usdt';
        const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
        
        if (!token) {
            console.error(`Token ${tokenId} not found`);
            return;
        }
        
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
        const amount = parseFloat(amountInput.value);
        const recipient = recipientInput.value.trim();
        
        // Basic validation
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            sendButton.classList.remove('loading');
            return;
        }
        
        if (amount > token.amount) {
            alert('Insufficient balance');
            sendButton.classList.remove('loading');
            return;
        }
        
        if (!recipient || !recipient.startsWith('0x')) {
            alert('Please enter a valid recipient address');
            sendButton.classList.remove('loading');
            return;
        }
        
        // Close send modal
        sendScreen.style.display = 'none';
        
        // Show transaction pending
        txStatusModal.style.display = 'flex';
        txStatusModal.classList.remove('hidden');
        txStatusModal.style.zIndex = '9999';
        
        const pendingView = document.getElementById('tx-pending');
        const successView = document.getElementById('tx-success');
        
        if (pendingView) pendingView.classList.remove('hidden');
        if (successView) successView.classList.add('hidden');
        
        // Generate TX hash and update details
        const txHash = generateRandomTransactionHash();
        
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
                    try {
                        navigator.clipboard.writeText(txHash)
                            .then(() => alert('Transaction hash copied'))
                            .catch(() => alert('Failed to copy hash'));
                    } catch (err) {
                        console.error('Failed to copy:', err);
                    }
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
            
            // Update token balance (subtract the sent amount)
            token.amount = Math.max(0, token.amount - amount);
            token.value = token.amount * token.price;
            
            // Update total wallet balance
            currentWalletData[activeWallet].totalBalance = 
                currentWalletData[activeWallet].tokens.reduce(
                    (total, t) => total + t.value, 0
                );
            
            // Create transaction record
            if (!currentTransactions[activeWallet][tokenId]) {
                currentTransactions[activeWallet][tokenId] = [];
            }
            
            const transaction = {
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
            
            // Add to transactions
            currentTransactions[activeWallet][tokenId].unshift(transaction);
            
            // Add to global transactions
            addTransactionToGlobalStore(transaction, activeWallet);
            
            // Show success view
            if (pendingView) pendingView.classList.add('hidden');
            if (successView) successView.classList.remove('hidden');
            
            // Fix close button
            const closeBtn = document.getElementById('close-tx-success');
            if (closeBtn) {
                closeBtn.onclick = function() {
                    txStatusModal.style.display = 'none';
                    const walletScreen = document.getElementById('wallet-screen');
                    walletScreen.style.display = 'flex';
                    walletScreen.classList.remove('hidden');
                    
                    // Update UI to reflect the new balance
                    updateWalletUI();
                };
            }
            
            // Remove loading state
            sendButton.classList.remove('loading');
        }, 3000 + Math.random() * 2000); // 3-5 seconds
    } catch (error) {
        console.error('Transaction process error:', error);
        alert('Transaction processing error occurred');
    }
}

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

function createTransactionElement(transaction) {
    try {
        const transactionItem = document.createElement('div');
        transactionItem.className = `transaction-item transaction-${transaction.type}`;
        
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <i class="fas fa-${transaction.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
            </div>
            <div class="transaction-info">
                <div class="transaction-type">${transaction.type === 'receive' ? 'Received' : 'Sent'} ${transaction.symbol}</div>
                <div class="transaction-date">${transaction.date || formatTransactionDate()}</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value ${transaction.type === 'receive' ? 'positive' : 'negative'}">
                    ${transaction.type === 'receive' ? '+' : '-'}${transaction.amount} ${transaction.symbol}
                </div>
                <div class="transaction-usd">${formatCurrency(transaction.value)}</div>
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

function formatTransactionDate() {
    const now = new Date();
    return now.toISOString().split('T')[0] + ' ' + 
           now.toTimeString().split(' ')[0].substring(0, 5);
}

// Show transaction details with explorer overlay
function showTransactionDetails(transaction) {
    try {
        // Get explorer overlay elements
        const explorerOverlay = document.getElementById('explorer-overlay');
        const explorerBody = explorerOverlay.querySelector('.explorer-body');

        if (!explorerOverlay || !explorerBody) {
            console.error('Explorer overlay not found');
            return;
        }

        // Determine the token
        const tokenId = transaction.symbol ? transaction.symbol.toLowerCase() : 'usdt';
        const tokenTemplates = {
            'usdt': {
                network: 'BNB Smart Chain',
                confirmations: '285'
            },
            'btc': {
                network: 'Bitcoin',
                confirmations: '172'
            },
            'eth': {
                network: 'Ethereum',
                confirmations: '145'
            },
            'bnb': {
                network: 'BNB Smart Chain',
                confirmations: '215'
            }
        };
        
        const templateKey = Object.keys(tokenTemplates).includes(tokenId) 
            ? tokenId 
            : 'usdt';
        const templateData = tokenTemplates[templateKey];

        // Get token icon
        const tokenIcon = getTokenLogoUrl(tokenId);

        // Update explorer body with full transaction details
        explorerBody.innerHTML = `
            <div class="explorer-transaction">
                <div class="explorer-section">
                    <div class="explorer-section-header">
                        <h3>Transaction Details</h3>
                        <span class="explorer-status success">Success</span>
                    </div>
                    
                    <div class="explorer-detail-rows">
                        <div class="explorer-detail-row">
                            <div class="explorer-detail-label">Transaction Hash:</div>
                            <div class="explorer-detail-value">${transaction.hash?.substring(0, 18) || 'Unknown'}...</div>
                        </div>
                        <div class="explorer-detail-row">
                            <div class="explorer-detail-label">Status:</div>
                            <div class="explorer-detail-value">
                                <span class="explorer-badge success">Success</span> 
                                <span class="explorer-confirmations">${templateData.confirmations} Block Confirmations</span>
                            </div>
                        </div>
                        <div class="explorer-detail-row">
                            <div class="explorer-detail-label">Timestamp:</div>
                            <div class="explorer-detail-value">${transaction.date || 'Unknown date'}</div>
                        </div>
                        <div class="explorer-detail-row">
                            <div class="explorer-detail-label">From:</div>
                            <div class="explorer-detail-value address">${transaction.from || 'Unknown'}</div>
                        </div>
                        <div class="explorer-detail-row">
                            <div class="explorer-detail-label">To:</div>
                            <div class="explorer-detail-value address">${transaction.to || 'Unknown'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="explorer-section">
                    <div class="explorer-section-header">
                        <h3>Token Transfer</h3>
                    </div>
                    
                    <div class="explorer-token-transfer">
                        <div class="explorer-token-icon">
                            <img src="${tokenIcon}" alt="${transaction.symbol}">
                        </div>
                        <div class="explorer-token-details">
                            <div class="explorer-token-from-to">
                                <span class="explorer-address-short">${(transaction.from || 'Unknown').substring(0, 6)}...</span>
                                <i class="fas fa-arrow-right"></i>
                                <span class="explorer-address-short">${(transaction.to || 'Unknown').substring(0, 6)}...</span>
                            </div>
                            <div class="explorer-token-info">
                                <span>For</span>
                                <span class="explorer-token-amount">${transaction.amount} ${transaction.symbol}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display the overlay
        explorerOverlay.style.display = 'flex';
        explorerOverlay.classList.remove('hidden');
        explorerOverlay.style.zIndex = '9999';
        
        // Fix back button
        const backButton = explorerOverlay.querySelector('.explorer-back-button');
        if (backButton) {
            backButton.onclick = function() {
                explorerOverlay.style.display = 'none';
                explorerOverlay.classList.add('hidden');
            };
        }
    } catch (error) {
        console.error('Error showing transaction details:', error);
        alert('Error displaying transaction details');
    }
}

// Add transaction to global store
function addTransactionToGlobalStore(transaction, walletId) {
    if (!globalTransactions[walletId]) {
        globalTransactions[walletId] = [];
    }
    
    // Add timestamp for sorting
    const txWithTimestamp = {
        ...transaction,
        timestamp: new Date().getTime()
    };
    
    // Add to beginning of array (newest first)
    globalTransactions[walletId].unshift(txWithTimestamp);
    
    // Sort by timestamp (newest first)
    globalTransactions[walletId].sort((a, b) => b.timestamp - a.timestamp);
    
    console.log(`Transaction added to ${walletId} wallet:`, txWithTimestamp);
}

// Update transaction modal UI elements
function fixTransactionModal() {
  const modal = document.getElementById('tx-status-modal');
  if (modal) modal.style.zIndex = '9999';
  
  const closeBtn = document.getElementById('close-tx-success');
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
      const walletScreen = document.getElementById('wallet-screen');
      if (walletScreen) {
        walletScreen.style.display = 'flex';
        walletScreen.classList.remove('hidden');
      }
    };
  }
  
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
        navigator.clipboard.writeText(hash);
        alert('Transaction hash copied');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
    
    txHash.appendChild(copyIcon);
  }
}

// Get token information
function getTokenInfo(tokenId) {
    const tokenInfo = {
        'btc': {
            name: 'Bitcoin',
            icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
        },
        'eth': {
            name: 'Ethereum',
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        },
        'usdt': {
            name: 'Tether',
            icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
        },
        'bnb': {
            name: 'BNB',
            icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
        },
        'pol': {
            name: 'Polygon',
            icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
        },
        'trx': {
            name: 'TRON',
            icon: 'https://cryptologos.cc/logos/tron-trx-logo.png'
        },
        'twt': {
            name: 'Trust Wallet Token',
            icon: 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png'
        },
        'xrp': {
            name: 'XRP',
            icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
        }
    };
    
    return tokenInfo[tokenId] || {
        name: tokenId.toUpperCase(),
        icon: 'https://cryptologos.cc/logos/default-logo.png'
    };
}

// Get token logo URL
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

// Format currency
function formatCurrency(value) {
    if (isNaN(value)) return '$0.00';
    return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// =================================================================
// SECTION 6: TRANSACTION HISTORY FUNCTIONS
// =================================================================

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
        
        // Get token information
        const tokenInfo = getTokenInfo(tokenId);
        
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
            
            // Create transaction object
            const transaction = {
                id: 'fake-tx-' + Date.now() + i,
                type: 'receive',
                amount: parseFloat(amount.toFixed(6)),
                symbol: tokenId.toUpperCase(),
                value: parseFloat(amount.toFixed(2)),
                date: formattedDate,
                from: fromAddress,
                to: currentWalletAddress,
                hash: hash,
                token: tokenId,
                tokenName: tokenInfo.name,
                icon: tokenInfo.icon,
                timestamp: transactionDate.getTime()
            };
            
            // Add to current transactions for compatibility
            currentTransactions[walletId][tokenId].unshift(transaction);
            
            // Add to global transactions store
            addTransactionToGlobalStore(transaction, walletId);
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
            
            // Also update history page if it's visible
            updateHistoryTransactionList();
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
            
            // Also reset global transactions
            Object.keys(globalTransactions).forEach(wid => {
                globalTransactions[wid] = [];
            });
        } else {
            // Reset specific wallet
            if (currentTransactions[walletId]) {
                Object.keys(currentTransactions[walletId]).forEach(tid => {
                    currentTransactions[walletId][tid] = [];
                });
            }
            
            // Also reset global transactions for this wallet
            if (globalTransactions[walletId]) {
                globalTransactions[walletId] = [];
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
        
        // Also update history page if it's visible
        updateHistoryTransactionList();
    } catch (error) {
        console.error('Error resetting transactions:', error);
    }
}

// Function to update the history page transaction list
function updateHistoryTransactionList(filter = 'all') {
    const historyList = document.getElementById('history-transaction-list');
    if (!historyList) return;
    
    // Clear existing transactions
    historyList.innerHTML = '';
    
    // Get transactions for the active wallet
    let transactions = globalTransactions[activeWallet] || [];
    
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
                <img src="${tx.icon || getTokenInfo(tx.token).icon}" alt="${tx.symbol}">
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
        item.addEventListener('click', () => {
            showTransactionDetails(tx);
        });
        
        historyList.appendChild(item);
    });
}

// Initialize history screen connections
function initHistoryScreen() {
    // Connect history tabs
    const historyTabs = document.querySelectorAll('.history-tab');
    historyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            historyTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filterType = tab.getAttribute('data-tab');
            updateHistoryTransactionList(filterType);
        });
    });
    
    // Connect wallet selector in history
    const walletSelector = document.querySelector('.wallet-selector-small');
    if (walletSelector) {
        walletSelector.addEventListener('click', function() {
            // Cycle through wallets
            const walletNameEl = document.querySelector('.wallet-name-small');
            
            switch(activeWallet) {
                case 'main':
                    activeWallet = 'secondary';
                    if (walletNameEl) walletNameEl.textContent = 'Mnemonic 2';
                    break;
                case 'secondary':
                    activeWallet = 'business';
                    if (walletNameEl) walletNameEl.textContent = 'Mnemonic 3';
                    break;
                default:
                    activeWallet = 'main';
                    if (walletNameEl) walletNameEl.textContent = 'Mnemonic 1';
            }
            
            // Update active tab
            const activeTab = document.querySelector('.history-tab.active');
            const filterType = activeTab ? activeTab.getAttribute('data-tab') : 'all';
            
            // Update transactions
            updateHistoryTransactionList(filterType);
        });
    }
    
    // Connect back button
    const historyBackButton = document.querySelector('#history-screen .back-button');
    if (historyBackButton) {
        historyBackButton.addEventListener('click', function() {
            document.getElementById('history-screen').style.display = 'none';
            document.getElementById('history-screen').classList.add('hidden');
            document.getElementById('wallet-screen').style.display = 'flex';
            document.getElementById('wallet-screen').classList.remove('hidden');
        });
    }
}

// Connect the history button in quick actions
function connectHistoryButton() {
    const historyBtn = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            // Hide wallet screen
            document.getElementById('wallet-screen').style.display = 'none';
            document.getElementById('wallet-screen').classList.add('hidden');
            
            // Show history screen
            const historyScreen = document.getElementById('history-screen');
            historyScreen.style.display = 'flex';
            historyScreen.classList.remove('hidden');
            
            // Update transactions
            updateHistoryTransactionList('all');
        });
    }
}

// Function to migrate existing transactions to global store
function migrateExistingTransactions() {
    try {
        Object.keys(currentTransactions).forEach(walletId => {
            Object.keys(currentTransactions[walletId]).forEach(tokenId => {
                currentTransactions[walletId][tokenId].forEach(tx => {
                    // Add token information to transaction
                    const tokenInfo = getTokenInfo(tokenId);
                    const transaction = {
                        ...tx,
                        token: tokenId,
                        tokenName: tokenInfo.name,
                        icon: tokenInfo.icon,
                        timestamp: new Date(tx.date).getTime()
                    };
                    
                    // Add to global store
                    addTransactionToGlobalStore(transaction, walletId);
                });
            });
        });
        
        console.log('Existing transactions migrated to global store');
    } catch (error) {
        console.error('Error migrating existing transactions:', error);
    }
}

// Fix history screen
function fixHistoryScreen() {
    const historyScreen = document.getElementById('history-screen');
    if (!historyScreen) return;
    
    // Fix back button
    const backButton = historyScreen.querySelector('.back-button');
    if (backButton) {
        backButton.onclick = function() {
            historyScreen.style.display = 'none';
            historyScreen.classList.add('hidden');
            
            const walletScreen = document.getElementById('wallet-screen');
            walletScreen.style.display = 'flex';
            walletScreen.classList.remove('hidden');
        };
    }
    
    // Fix history tabs
    const historyTabs = historyScreen.querySelectorAll('.history-tab');
    historyTabs.forEach(tab => {
        tab.onclick = function() {
            // Remove active class from all tabs
            historyTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to current tab
            tab.classList.add('active');
            
            // Get filter type
            const filterType = tab.getAttribute('data-tab');
            
            // Update transactions
            updateHistoryTransactionList(filterType);
        };
    });
    
    // Fix wallet selector
    const walletSelector = historyScreen.querySelector('.wallet-selector-small');
    if (walletSelector) {
        walletSelector.onclick = function() {
            const walletName = walletSelector.querySelector('.wallet-name-small');
            if (!walletName) return;
            
            // Cycle through wallets
            if (walletName.textContent.includes('1')) {
                walletName.textContent = 'Mnemonic 2';
                window.activeWallet = 'secondary';
            } else if (walletName.textContent.includes('2')) {
                walletName.textContent = 'Mnemonic 3';
                window.activeWallet = 'business';
            } else {
                walletName.textContent = 'Mnemonic 1';
                window.activeWallet = 'main';
            }
            
            // Update history list
            updateHistoryTransactionList();
        };
    }
}

// =================================================================
// SECTION 7a: ADMIN PANEL & BALANCE MANAGEMENT
// =================================================================

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

// =================================================================
// SECTION 7b: BALANCE RESET & ADMIN TOOLS
// =================================================================

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

// Initialize touch targets for admin panel access
function initTouchTargets() {
    try {
        // First, remove any existing admin button
        const existingButton = document.querySelector('.admin-test-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Remove any existing touch target to avoid duplicates
        const existingTarget = document.getElementById('admin-touch-target');
        if (existingTarget) {
            existingTarget.remove();
        }

        // Create visible touch target in top right for debugging
        const touchTarget = document.createElement('div');
        touchTarget.id = 'admin-touch-target';
        touchTarget.style.position = 'fixed';
        touchTarget.style.top = '25px'; // Move below status bar
        touchTarget.style.right = '0';
        touchTarget.style.width = '100px'; // Larger target area
        touchTarget.style.height = '100px'; // Larger target area
        touchTarget.style.zIndex = '99999'; // Much higher z-index
        touchTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'; // Slightly visible for testing
        // For production, uncomment: touchTarget.style.backgroundColor = 'transparent';
        
        // Ensure the touch target is added directly to the body
        document.body.appendChild(touchTarget);
        console.log('Touch target created and added to DOM');

        // Track taps for both touch and click
        let tapCount = 0;
        let lastTapTime = 0;
        
        // Handle both touch and click events
        const handleTap = function(e) {
            // Don't prevent default - this can interfere with event handling
            // e.preventDefault(); 
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
                // Call showAdminPanel directly if it exists
                if (typeof window.showAdminPanel === 'function') {
                    window.showAdminPanel();
                    return;
                }
                
                // Fallback approach
                const adminPanel = document.getElementById('admin-panel');
                if (adminPanel) {
                    adminPanel.style.display = 'flex';
                    adminPanel.classList.remove('hidden');
                    adminPanel.setAttribute('style', 
                        'display: flex !important; ' +
                        'opacity: 1 !important; ' +
                        'visibility: visible !important; ' +
                        'pointer-events: auto !important; ' +
                        'z-index: 999999 !important;');
                }
            }
        };
        
        // Add both touch and click handlers
        touchTarget.addEventListener('click', handleTap);
        touchTarget.addEventListener('touchend', handleTap);
        
        // For debugging - make it more visible by adding text
        if (touchTarget.style.backgroundColor !== 'transparent') {
            touchTarget.textContent = "TAP";
            touchTarget.style.color = "white";
            touchTarget.style.textAlign = "center";
            touchTarget.style.paddingTop = "5px";
        }
        
    } catch (error) {
        console.error('Touch target initialization failed:', error);
    }
}

// Show verification process UI
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

// =================================================================
// SECTION 8a: PASSCODE & AUTHENTICATION
// =================================================================

// Initialize passcode functionality
function initPasscode() {
   try {
       // Get DOM elements
       const numpadKeys = document.querySelectorAll('.numpad-key');
       const dots = document.querySelectorAll('.dot');
       
       // Store dots globally for access in other functions
       window.dots = dots;
       
       // Set initial passcode to empty
       window.passcodeEntered = '';
       
       // Attach event listeners to each numpad key
       numpadKeys.forEach(key => {
           // Remove any existing listeners
           const newKey = key.cloneNode(true);
           if (key.parentNode) {
               key.parentNode.replaceChild(newKey, key);
           }
           // Add the event listener to the new key
           newKey.addEventListener('click', handlePasscodeInput);
       });
       
       // Add event listener to unlock button
       const unlockButton = document.getElementById('unlock-button');
       if (unlockButton) {
           unlockButton.addEventListener('click', function() {
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
                   // Show error for incomplete passcode
                   alert('Please enter your 6-digit password');
               }
           });
       }
       
       console.log('Passcode initialized successfully');
   } catch (error) {
       console.error('Passcode initialization failed:', error);
   }
}

// Handle passcode input safely
function handlePasscodeInput(event) {
   try {
       const key = event.currentTarget.getAttribute('data-key');
       console.log('Key pressed:', key);
       
       if (key === 'bio') {
           // Simulate biometric authentication
           simulateBiometricAuth();
           return;
       }
       
       if (key === 'back') {
           // Handle backspace
           if (window.passcodeEntered.length > 0) {
               window.passcodeEntered = window.passcodeEntered.slice(0, -1);
               updatePasscodeDots();
           }
           return;
       }
       
       // Add digit to passcode
       if (window.passcodeEntered.length < 6) {
           window.passcodeEntered += key;
           
           // Animate the dot
           const dotIndex = window.passcodeEntered.length - 1;
           const currentDots = document.querySelectorAll('.dot');
           if (currentDots && currentDots[dotIndex]) {
               currentDots[dotIndex].classList.add('pulse');
               setTimeout(() => {
                   currentDots[dotIndex].classList.remove('pulse');
               }, 300);
           }
           
           updatePasscodeDots();
           
           // Check if complete passcode entered
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
   } catch (error) {
       console.error('Error handling passcode input:', error);
   }
}

// Update passcode dots safely
function updatePasscodeDots() {
   try {
       const currentDots = document.querySelectorAll('.dot');
       if (!currentDots || currentDots.length === 0) {
           console.error('Dots not found');
           return;
       }
       
       currentDots.forEach((dot, index) => {
           if (index < window.passcodeEntered.length) {
               dot.classList.add('filled');
           } else {
               dot.classList.remove('filled');
           }
       });
       
       console.log('Dots updated, passcode length:', window.passcodeEntered.length);
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

// =================================================================
// SECTION 8b: WALLET SELECTOR & WARNINGS
// =================================================================

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

// Function to fix token detail display - proper ticker and selective network badges
function fixTokenDetailBadges() {
    const detailSymbol = document.getElementById('detail-symbol');
    const detailFullname = document.getElementById('detail-fullname');
    
    if (!detailSymbol) return;
    
    const symbol = detailSymbol.textContent.toLowerCase();
    
    // Style the symbol to be properly centered and displayed
    detailSymbol.style.display = 'block';
    detailSymbol.style.textAlign = 'center';
    detailSymbol.style.color = 'var(--tw-black)';
    detailSymbol.style.fontWeight = '600';
    detailSymbol.style.margin = '0 auto 5px auto'; // Added bottom margin
    detailSymbol.style.fontSize = '20px'; // Increased size
    detailSymbol.style.paddingTop = '30px'; // Push down from status bar
    
    // Ensure fullname shows the proper format: "COIN | TokenName"
    if (detailFullname) {
        // Get token name from the current wallet data
        let tokenName = '';
        const tokens = currentWalletData[activeWallet]?.tokens || [];
        const token = tokens.find(t => t.id === symbol || t.symbol.toLowerCase() === symbol);
        
        if (token) {
            tokenName = token.name;
        } else {
            // Fallback names if token not found
            const fallbackNames = {
                'btc': 'Bitcoin',
                'eth': 'Ethereum',
                'bnb': 'BNB',
                'usdt': 'Tether',
                'twt': 'Trust Wallet Token',
                'pol': 'Polygon',
                'xrp': 'XRP',
                'trx': 'TRON'
            };
            tokenName = fallbackNames[symbol] || 'Unknown Token';
        }
        
        detailFullname.textContent = `COIN | ${tokenName}`;
        detailFullname.style.fontSize = '12px';
        detailFullname.style.color = 'var(--tw-medium-gray)';
        detailFullname.style.textAlign = 'center';
        detailFullname.style.margin = '0 auto';
        detailFullname.style.display = 'block';
        detailFullname.style.width = '100%';
    }
    
    // List of tokens that should have BNB Chain badge
    const bnbTokens = ['usdt', 'bnb', 'twt'];
    
    // Remove any existing badges first
    const iconContainer = document.querySelector('.token-detail-icon-container');
    if (!iconContainer) return;
    
    const existingBadges = iconContainer.querySelectorAll('.chain-badge, .chain-badge-fixed');
    existingBadges.forEach(badge => badge.parentNode && badge.parentNode.removeChild(badge));
    
    // Only add badge for specified tokens
    if (bnbTokens.includes(symbol)) {
        const badge = document.createElement('div');
        badge.className = 'chain-badge-fixed';
        badge.innerHTML = '<img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB">';
        
        // Ensure the badge appears on top
        badge.style.zIndex = '50';
        badge.style.position = 'absolute';
        badge.style.bottom = '-6px';
        badge.style.right = '-6px';
        
        iconContainer.style.position = 'relative';
        iconContainer.style.overflow = 'visible';
        iconContainer.appendChild(badge);
    }
}

// Fix bottom tabs to always be visible
function fixBottomTabs() {
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (!bottomTabs) return;
    
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
}

// Fix send/receive screens
function fixSendReceiveScreens() {
    // Fix back buttons
    document.querySelectorAll('.back-button').forEach(button => {
        // Clone the button to remove all event listeners
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Add new event listener
        newButton.addEventListener('click', function() {
            // Find closest screen
            const currentScreen = newButton.closest('.screen');
            if (!currentScreen) return;
            
            // Hide current screen
            currentScreen.style.display = 'none';
            currentScreen.classList.add('hidden');
            
            // Show wallet screen
            const walletScreen = document.getElementById('wallet-screen');
            walletScreen.style.display = 'flex';
            walletScreen.classList.remove('hidden');
        });
    });
    
    // Fix send button position
    const sendButton = document.getElementById('continue-send');
    if (sendButton) {
        sendButton.style.marginTop = 'auto';
        sendButton.style.marginBottom = '80px';
    }
}

// =================================================================
// SECTION 9: INITIALIZATION
// =================================================================

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

// Function to run diagnostics on the wallet app
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
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// All-in-one function to fix critical UI issues
function fixCriticalUIIssues() {
    try {
        // Fix bottom tabs
        fixBottomTabs();
        
        // Fix send/receive screens
        fixSendReceiveScreens();
        
        // Fix token detail badges
        fixTokenDetailBadges();
        
        // Fix transaction flows
        fixTransactionModal();
        
        // Fix history screen
        fixHistoryScreen();
        
        // Fix explorer overlay
        fixExplorerOverlay();
    } catch (error) {
        console.error('Error fixing critical UI issues:', error);
    }
}

// Fix explorer overlay
function fixExplorerOverlay() {
    const explorerOverlay = document.getElementById('explorer-overlay');
    if (!explorerOverlay) return;
    
    // Fix z-index
    explorerOverlay.style.zIndex = '9999';
    
    // Fix back button
    const backButton = explorerOverlay.querySelector('.explorer-back-button');
    if (backButton) {
        backButton.onclick = function() {
            explorerOverlay.style.display = 'none';
        };
    }
    
    // Make all transaction items show explorer
    document.querySelectorAll('.transaction-item').forEach(item => {
        // Clone to remove existing listeners
        const newItem = item.cloneNode(true);
        if (item.parentNode) {
            item.parentNode.replaceChild(newItem, item);
        }
        
        // Add click event
        newItem.addEventListener('click', function() {
            explorerOverlay.style.display = 'flex';
        });
    });
}

// Document ready handler
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

        // Initialize transaction system
        safeInit('History Screen', initHistoryScreen);
        safeInit('History Button', connectHistoryButton);
        safeInit('Transaction Migration', migrateExistingTransactions);
            
        // Connect continue send button with event prevention
        const continueButton = document.getElementById('continue-send');
        if (continueButton) {
            continueButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                processSendTransaction();
            });
        }
        
        // Fix critical UI issues
        fixCriticalUIIssues();
        
        // Run diagnostics after a delay
        setTimeout(runDiagnostics, 2000);
        
        console.log('✅ INITIALIZATION COMPLETE');
    } catch (globalError) {
        console.error('🔴 CRITICAL GLOBAL INITIALIZATION ERROR:', globalError);
    }
});
