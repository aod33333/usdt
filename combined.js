console.error('Script loading started');
document.addEventListener('DOMContentLoaded', function() {
    console.error('DOMContentLoaded fired');
    console.error('Critical elements:', {
        lockScreen: document.getElementById('lock-screen'),
        walletScreen: document.getElementById('wallet-screen'),
        tokenDetail: document.getElementById('token-detail')
    });
});

/**
 * Crypto Wallet Application
 * 
 * Part 1: Core Data and Initialization
 * - Global variables
 * - Wallet data structures
 * - Core initialization
 */

console.log('wallet.js starting execution');

// ========================================================
// GLOBAL VARIABLES
// ========================================================

// State management
let passcodeEntered = '';
let touchSequence = [];
const correctPasscode = '123456'; // Default simple passcode
let balanceModified = false;
let expirationTimer = null;
let activeWallet = 'main';

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

// FIXED: Store original wallet data for reset functionality - no JSON.parse/stringify
const originalWalletData = walletData;

// FIXED: Current wallet data (can be modified by admin panel) - no JSON.parse/stringify
let currentWalletData = walletData;

// FIXED: Current transaction data (can be modified by admin panel) - no JSON.parse/stringify
let currentTransactions = originalTransactions;

// DOM Elements (Initialized in DOMContentLoaded)
let lockScreen, walletScreen, tokenDetail, sendScreen, receiveScreen, 
    adminPanel, verifyOverlay, biometricOverlay, explorerOverlay, 
    txStatusModal, dots, numpadKeys;

// ========================================================
// CORE UTILITY FUNCTIONS
// ========================================================

// Format currency
function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Generate random wallet address
function generateRandomAddress() {
    let address = '0x';
    const characters = '0123456789abcdef';
    
    for (let i = 0; i < 40; i++) {
        address += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return address;
}

// Generate random transaction hash
function generateRandomTransactionHash() {
    let hash = '0x';
    const characters = '0123456789abcdef';
    
    for (let i = 0; i < 64; i++) {
        hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return hash;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    }) + ' ' + date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// REMOVED: Check for wallet data - no longer using JSON.parse/stringify

/**
 * Crypto Wallet Application
 * 
 * Part 2: UI and Screen Management
 * - Screen navigation
 * - UI updates
 * - Token detail display
 */

// ========================================================
// SCREEN MANAGEMENT
// ========================================================

function hideAllScreens() {
    const screens = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen',
        'admin-panel'
    ];
    
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'none';
            screen.classList.add('hidden');
        }
    });
}

function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'flex';
        screen.classList.remove('hidden');
    }
}

// Expose to global window object
window.hideAllScreens = hideAllScreens;
window.showScreen = showScreen;

function initializeAllScreens() {
    console.log('SCREEN INITIALIZATION: Starting screen setup');
    
    const screens = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen',
        'admin-panel',
        'verification-overlay',
        'biometric-overlay',
        'explorer-overlay',
        'tx-status-modal'
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
// WALLET UI FUNCTIONS
// ========================================================

// Update wallet UI with current data
function updateWalletUI() {
    // Get current wallet data
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
}

// Create token element
function createTokenElement(token) {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.setAttribute('data-token-id', token.id);
    
    let chainBadgeHTML = '';
    if (token.chainBadge) {
        chainBadgeHTML = `
            <div class="chain-badge">
                <img src="${token.chainBadge}" alt="${token.network}">
            </div>
        `;
    }
    
    // Format price with thousands separator
    const formattedPrice = token.price >= 1 
        ? token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : token.price.toFixed(2);
    
    // Format change with + or - sign
    const changeClass = token.change >= 0 ? 'positive' : 'negative';
    const changeSign = token.change >= 0 ? '+' : '';
    
    // Format the token amount display
    const formattedAmount = token.amount > 0 ? token.amount : '0';
    
    // Format token value with appropriate precision
    const formattedValue = token.value > 0 
        ? formatCurrency(token.value) 
        : '$0.00';
    
    tokenItem.innerHTML = `
        <div class="token-icon">
            <img src="${token.icon}" alt="${token.name}">
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
}

// Token detail display function
function showTokenDetail(tokenId) {
    if (!tokenDetail) {
        console.error('Token detail screen not found');
        return;
    }
    
    // Get the token data
    if (!currentWalletData || !currentWalletData[activeWallet]) {
        console.error('Current wallet data not available');
        return;
    }
    
    const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    if (!token) {
        console.error('Token not found:', tokenId);
        return;
    }
    
    // Update all token details
    const detailSymbol = document.getElementById('detail-symbol');
    const detailFullname = document.getElementById('detail-fullname');
    const tokenDetailIcon = document.getElementById('token-detail-icon');
    const tokenBalanceAmount = document.getElementById('token-balance-amount');
    const tokenBalanceValue = document.getElementById('token-balance-value');
    const tokenStakingSymbol = document.getElementById('token-staking-symbol');
    const tokenPriceSymbol = document.getElementById('token-price-symbol');
    const tokenCurrentPrice = document.getElementById('token-current-price');
    
    if (detailSymbol) detailSymbol.textContent = token.symbol;
    if (detailFullname) detailFullname.textContent = token.name;
    if (tokenDetailIcon) tokenDetailIcon.src = token.icon;
    if (tokenBalanceAmount) tokenBalanceAmount.textContent = `${token.amount} ${token.symbol}`;
    if (tokenBalanceValue) tokenBalanceValue.textContent = formatCurrency(token.value);
    if (tokenStakingSymbol) tokenStakingSymbol.textContent = token.symbol;
    if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol;
    if (tokenCurrentPrice) tokenCurrentPrice.textContent = `$${token.price.toLocaleString()}`;
    
    // Set price change class and value
    const priceChangeElement = document.getElementById('token-price-change');
    if (priceChangeElement) {
        if (token.change >= 0) {
            priceChangeElement.className = 'positive';
            priceChangeElement.textContent = `+${token.change}%`;
        } else {
            priceChangeElement.className = 'negative';
            priceChangeElement.textContent = `${token.change}%`;
        }
    }
    
    // Update gas fee display for this token
    const gasFeeAmount = document.getElementById('gas-fee-amount');
    if (gasFeeAmount) {
        gasFeeAmount.textContent = token.id === 'eth' ? '$0.01' : '$0.00';
    }
    
    // Show token detail and hide wallet screen
    if (walletScreen) walletScreen.classList.add('hidden');
    tokenDetail.classList.remove('hidden');
    
    
    // Update transactions if there are any
    const transactionList = document.getElementById('transaction-list');
    if (transactionList && currentTransactions && 
        currentTransactions[activeWallet] && 
        currentTransactions[activeWallet][tokenId]) {
        updateTransactionsForToken(tokenId);
    }
}

function showSendScreen(tokenId) {
    console.log('Showing send screen', tokenId);
    try {
        window.showScreen('send-screen');
        
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
        if (maxAmount) maxAmount.textContent = token.amount;
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
            sendAmount.value = '';
        }
        
    } catch (error) {
        console.error('Error showing send screen:', error);
    }
}

// FIXED: Show receive screen without QR code generation
function showReceiveScreen(tokenId) {
    console.log('Showing receive screen', tokenId);
    try {
        window.showScreen('receive-screen');
        
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

// FIXED: Static QR code function
function generateQRCode() {
  console.log('Using static QR code - no generation needed');
  
  // No need to get canvas context or draw dynamically
  const walletAddressEl = document.getElementById('wallet-address');
  if (walletAddressEl) {
    // We can update the wallet address text if needed
    // But no need to manipulate the QR code itself as it's now static SVG
    console.log('Wallet address:', walletAddressEl.textContent.trim());
  }
  
  // The QR SVG is already in the HTML, nothing more to do
}

/**
 * Crypto Wallet Application
 * 
 * Part 3: Transaction Management
 * - Transaction UI
 * - Sending and receiving
 * - Transaction history
 */

// ========================================================
// TRANSACTION MANAGEMENT
// ========================================================

// Update transactions for a specific token
function updateTransactionsForToken(tokenId) {
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
}

// Create transaction element
function createTransactionElement(transaction) {
    const transactionItem = document.createElement('div');
    transactionItem.className = `transaction-item transaction-${transaction.type}`;
    
    transactionItem.innerHTML = `
        <div class="transaction-icon">
            <i class="fas fa-${transaction.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
        </div>
        <div class="transaction-info">
            <div class="transaction-type">${transaction.type === 'receive' ? 'Received' : 'Sent'}</div>
            <div class="transaction-date">${transaction.date}</div>
        </div>
        <div class="transaction-amount">
            <div class="transaction-value">${transaction.type === 'receive' ? '+' : '-'}${transaction.amount} ${transaction.symbol}</div>
            <div class="transaction-usd">${formatCurrency(transaction.value)}</div>
        </div>
    `;
    
    // Add click event to show transaction details
    transactionItem.addEventListener('click', () => {
        showTransactionDetails(transaction);
    });
    
    return transactionItem;
}

// Show transaction details (could open a modal in a real app)
function showTransactionDetails(transaction) {
    // In a real app, this would open a modal with transaction details
    alert(`
        Transaction Hash: ${transaction.hash}
        From: ${transaction.from}
        To: ${transaction.to}
        Amount: ${transaction.amount} ${transaction.symbol}
        Value: ${formatCurrency(transaction.value)}
        Date: ${transaction.date}
    `);
}

// Process send transaction
function processSendTransaction() {
    const amount = parseFloat(document.getElementById('send-amount').value);
    const recipient = document.getElementById('recipient-address').value.trim();
    
    // Basic validation
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!recipient || !recipient.startsWith('0x')) {
        alert('Please enter a valid recipient address');
        return;
    }
    
    // Get the current token from active wallet
    const currentWallet = currentWalletData[activeWallet];
    const usdtToken = currentWallet.tokens.find(t => t.id === 'usdt');
    
    // Check if we have enough balance
    if (amount > usdtToken.amount) {
        alert('Insufficient balance');
        return;
    }
    
    // Close send modal
    document.getElementById('send-screen').style.display = 'none';
    
    // Show transaction pending
    document.getElementById('tx-status-modal').style.display = 'flex';
    document.getElementById('tx-pending').classList.remove('hidden');
    document.getElementById('tx-success').classList.add('hidden');
    
    // Generate random tx hash
    const txHash = generateRandomTransactionHash();
    document.getElementById('tx-hash').textContent = txHash.substring(0, 10) + '...';
    
    // Update transaction amount
    document.getElementById('tx-amount').textContent = `${amount} USDT`;
    
    // Update recipient
    document.getElementById('tx-to').textContent = `${recipient.substring(0, 6)}...`;
    
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
        if (!tokenDetail.classList.contains('hidden')) {
            updateTransactionsForToken('usdt');
        }
    }, 3000 + Math.random() * 2000); // Random time between 3-5 seconds
}

// Generate fake transaction history
function generateFakeTransactionHistory(totalAmount, tokenId, walletId) {
    // Clear existing transactions
    if (!currentTransactions[walletId]) {
        currentTransactions[walletId] = {};
    }
    
    if (!currentTransactions[walletId][tokenId]) {
        currentTransactions[walletId][tokenId] = [];
    } else {
        currentTransactions[walletId][tokenId] = [];
    }
    
    // Create a series of fake incoming transactions to match the requested amount
    const transactionCount = Math.min(10, Math.max(3, Math.floor(Math.log10(totalAmount) * 2)));
    
    // Generate random splits of the total amount
    const amounts = splitAmountRandomly(totalAmount, transactionCount);
    
    // Get wallet addresses
    const walletAddresses = {
        main: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
        secondary: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2',
        business: '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A'
    };
    
    const currentWalletAddress = walletAddresses[walletId];
    
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
            amount: parseFloat(amount.toFixed(2)),
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
    if (activeWallet === walletId && document.getElementById('token-detail').classList.contains('hidden') === false) {
        updateTransactionsForToken(tokenId);
    }
}

// Split total amount into random chunks for transactions
function splitAmountRandomly(total, parts) {
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
}

// FIXED: Reset transactions to original data - without JSON.parse/stringify
function resetTransactionsToOriginal(walletId) {
    if (walletId === 'all') {
        // Set transaction IDs to empty arrays instead of deep copying
        Object.keys(currentTransactions).forEach(wid => {
            Object.keys(currentTransactions[wid]).forEach(tid => {
                currentTransactions[wid][tid] = [];
            });
        });
    } else {
        Object.keys(currentTransactions[walletId]).forEach(tid => {
            currentTransactions[walletId][tid] = [];
        });
    }
    
    // If token detail view is open, update the transactions
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail.classList.contains('hidden')) {
        const activeTokenId = document.querySelector('.token-title span').textContent.toLowerCase();
        updateTransactionsForToken(activeTokenId);
    }
}

// ========================================================
// SECURITY & AUTHENTICATION FUNCTIONS
// ========================================================

// Initialize passcode screen
function initPasscode() {
    // Add event listeners to numpad keys
    numpadKeys = document.querySelectorAll('.numpad-key');
    dots = document.querySelectorAll('.dot');
    
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
                    dotsContainer.classList.add('shake');
                    setTimeout(() => {
                        dotsContainer.classList.remove('shake');
                        passcodeEntered = '';
                        updatePasscodeDots();
                    }, 500);
                }
            } else {
                // Show error for incomplete passcode
                alert('Please enter your 6-digit password');
            }
        });
    }
    
    // Add event listener to reset wallet button
    const resetWalletButton = document.getElementById('reset-wallet-button');
    if (resetWalletButton) {
        resetWalletButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset your wallet? This action cannot be undone.')) {
                alert('Wallet has been reset. Please set up a new wallet.');
                // In a real app, this would redirect to an onboarding flow
            }
        });
    }
}

// Handle passcode input
function handlePasscodeInput(event) {
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
}

// Update passcode dots display
function updatePasscodeDots() {
    if (!dots) return;
    
    dots.forEach((dot, index) => {
        if (index < passcodeEntered.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Unlock wallet and show main screen
function unlockWallet() {
    if (lockScreen) lockScreen.classList.add('hidden');
    if (walletScreen) walletScreen.classList.remove('hidden');
    passcodeEntered = '';
    updatePasscodeDots();
    
    // If we have an active expiration timer, update the UI
    if (balanceModified && expirationTimer) {
        updateExpirationDisplay();
    }
}

// Simulate biometric authentication
function simulateBiometricAuth() {
    if (!biometricOverlay) {
        console.error('Biometric overlay not found');
        return;
    }
    
    biometricOverlay.style.display = 'flex';
    
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricStatus = document.getElementById('biometric-status');
    
    if (!fingerprintIcon || !biometricStatus) return;
    
    // Start scanning animation
    fingerprintIcon.style.color = 'var(--tw-blue)';
    
    // Simulate success after delay
    setTimeout(() => {
        biometricStatus.textContent = 'Fingerprint recognized';
        biometricStatus.style.color = 'var(--tw-green)';
        
        // Hide overlay and show wallet after success
        setTimeout(() => {
            biometricOverlay.style.display = 'none';
            unlockWallet();
            setupDemoBalance(); // Add demo balances
            updateWalletUI(); // Update UI to show balances
        }, 500);
    }, 1500);
}

// Verification process function
function showVerificationProcess() {
    const verificationOverlay = document.getElementById('verification-overlay');
    if (verificationOverlay) {
        verificationOverlay.style.display = 'flex';
        document.getElementById('verification-result').classList.add('hidden');
        document.getElementById('progress-fill').style.width = '0%';
        
        // Generate random verification ID
        const certId = 'TW-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        document.getElementById('cert-id').textContent = certId;
        
        // Current timestamp
        const timestamp = new Date().toLocaleString();
        document.getElementById('verify-timestamp').textContent = timestamp;
        
        // Current balance
        const balanceElement = document.getElementById('total-balance');
        const balance = balanceElement.textContent;
        document.getElementById('verify-balance').textContent = balance;
        
        // Animate progress
        let progress = 0;
        const statusElement = document.getElementById('verification-status');
        const progressFill = document.getElementById('progress-fill');
        
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
                progressFill.style.width = `${progress}%`;
                statusElement.textContent = step.text;
                currentStep++;
                
                if (currentStep === progressSteps.length) {
                    // Complete verification
                    setTimeout(() => {
                        clearInterval(verifyInterval);
                        document.getElementById('verification-result').classList.remove('hidden');
                        
                        // Set up blockchain explorer link
                        document.getElementById('view-blockchain').addEventListener('click', function() {
                            showExplorerWithTransaction();
                        });
                    }, 500);
                }
            }
        }, 700);
    }
}

function showExplorerWithTransaction() {
    // Generate a random transaction hash if not already present
    const txHash = generateRandomTransactionHash();
    document.getElementById('explorer-tx-hash').textContent = txHash.substring(0, 18) + '...';
    
    // Determine the display amount
    const amount = document.getElementById('verify-balance').textContent;
    document.getElementById('explorer-token-amount').textContent = amount;
    
    // Show explorer
    document.getElementById('explorer-overlay').style.display = 'flex';
}

// Initialize touch targets for admin panel access
function initTouchTargets() {
    // Simplified version that avoids dynamic element creation
    console.log('Touch targets initialized (simplified)');
   
    // Add direct admin panel access button for testing
    const adminButton = document.createElement('button');
    adminButton.textContent = "Admin";
    adminButton.style.position = "fixed";
    adminButton.style.bottom = "80px";
    adminButton.style.right = "10px";
    adminButton.style.zIndex = "2000";
    adminButton.style.opacity = "0.7";
    adminButton.style.padding = "5px";
    adminButton.style.fontSize = "12px";
    adminButton.addEventListener('click', () => {
        if (adminPanel) {
            adminPanel.style.display = 'flex';
        } else {
            console.error('Admin panel element not found');
        }
    });

    // Prevent duplicate button creation
    if (!document.body.querySelector('.admin-test-button')) {
        adminButton.classList.add('admin-test-button');
        document.body.appendChild(adminButton);
    }
}

// Handle admin panel access sequence
function handleTouchSequence(event) {
    const point = event.target.getAttribute('data-point');
    touchSequence.push(point);
    
    // Limit sequence to last 4 touches
    if (touchSequence.length > 4) {
        touchSequence.shift();
    }
    
    // Check if sequence matches the unlock pattern
    const correctSequence = ['top-left', 'top-right', 'top-left', 'bottom-left'];
    const isCorrect = touchSequence.join(',') === correctSequence.join(',');
    
    if (isCorrect) {
        adminPanel.style.display = 'flex';
    }
}

// ========================================================
// ADMIN PANEL & BALANCE MANIPULATION
// ========================================================

// Initialize admin panel
function initAdminPanel() {
    const requiredElements = [
        'admin-panel', 
        'close-admin', 
        'apply-fake', 
        'reset-wallet',
        'admin-wallet-select', 
        'admin-token-select', 
        'fake-balance', 
        'expiration-time'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Missing admin panel elements:', missingElements);
        return;
    }

    const adminPanel = document.getElementById('admin-panel');
    const closeAdminBtn = document.getElementById('close-admin');
    const applyFakeBtn = document.getElementById('apply-fake');
    const resetWalletBtn = document.getElementById('reset-wallet');

    closeAdminBtn.addEventListener('click', () => adminPanel.style.display = 'none');

    applyFakeBtn.addEventListener('click', () => {
        const walletSelect = document.getElementById('admin-wallet-select');
        const tokenSelect = document.getElementById('admin-token-select');
        const balanceInput = document.getElementById('fake-balance');
        const expirationInput = document.getElementById('expiration-time');
        const generateHistoryCheck = document.getElementById('generate-history');
        const modifyAllWalletsCheck = document.getElementById('modify-all-wallets');

        const selectedWallet = walletSelect.value;
        const selectedToken = tokenSelect.value;
        const fakeBalance = parseFloat(balanceInput.value);
        const expirationHours = parseInt(expirationInput.value);
        const generateHistory = generateHistoryCheck.checked;
        const modifyAllWallets = modifyAllWalletsCheck.checked;

        if (isNaN(fakeBalance) || fakeBalance <= 0) {
            alert('Please enter a valid balance amount');
            return;
        }

        const walletIds = modifyAllWallets 
            ? Object.keys(currentWalletData) 
            : [selectedWallet];
        
        walletIds.forEach(walletId => {
            applyFakeBalance(
                selectedToken, 
                fakeBalance, 
                expirationHours, 
                generateHistory, 
                walletId
            );
        });

        updateWalletUI();
        adminPanel.style.display = 'none';
    });

    resetWalletBtn.addEventListener('click', () => {
        const walletSelect = document.getElementById('admin-wallet-select');
        resetToOriginalBalance(walletSelect.value);
        adminPanel.style.display = 'none';
    });
}

// Apply fake balance
function applyFakeBalance(tokenId, amount, expirationHours, generateHistory, walletId) {
    // Update wallet data with fake balance
    updateWalletWithFakeBalance(tokenId, amount, walletId);
    
    // Generate fake transaction history if needed
    if (generateHistory) {
        generateFakeTransactionHistory(amount, tokenId, walletId);
    }
    
    // Set expiration timer
    setExpirationTimer(expirationHours, walletId);
    
    balanceModified = true;
}

// Update wallet with fake balance
function updateWalletWithFakeBalance(tokenId, amount, walletId) {
    const wallet = currentWalletData[walletId];
    const token = wallet.tokens.find(t => t.id === tokenId);
    
    if (token) {
        // Calculate the difference to add to total balance
        const difference = amount - token.value;
        
        // Update token
        token.amount = amount / token.price;
        token.value = amount;
        
        // Update total balance
        wallet.totalBalance += difference;
        
        // Update UI if this is the active wallet
        if (activeWallet === walletId) {
            updateWalletUI();
        }
    }
}

// Set expiration timer
function setExpirationTimer(hours, walletId) {
    // Clear any existing timer
    if (expirationTimer) {
        clearInterval(expirationTimer);
    }
    
    // Calculate expiration time
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + hours);
    
    // Set interval to update the countdown
    expirationTimer = setInterval(() => {
        const remaining = expirationTime - new Date();
        
        if (remaining <= 0) {
            // Time expired, reset to original
            clearInterval(expirationTimer);
            expirationTimer = null;
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
}

// FIXED: Reset wallet to original data without JSON.parse/stringify
function resetWalletToOriginal(walletId) {
    if (walletId === 'all') {
        // Reset all wallets by zeroing out balances
        Object.keys(currentWalletData).forEach(wid => {
            currentWalletData[wid].totalBalance = 0;
            currentWalletData[wid].tokens.forEach(token => {
                token.amount = 0;
                token.value = 0;
            });
        });
    } else {
        // Reset specific wallet by zeroing out balances
        currentWalletData[walletId].totalBalance = 0;
        currentWalletData[walletId].tokens.forEach(token => {
            token.amount = 0;
            token.value = 0;
        });
    }
    
    // Update UI
    updateWalletUI();
}

// Update wallet with preset balances demo
function setupDemoBalance() {
    // Update BTC balance
    updateWalletWithFakeBalance('btc', 8398474.00, 'main');
    
    // Update ETH balance
    updateWalletWithFakeBalance('eth', 986905.00, 'main');
    
    // Update USDT balance
    updateWalletWithFakeBalance('usdt', 10000000.00, 'main');
    
    // Update XRP balance
    updateWalletWithFakeBalance('xrp', 24329.67, 'main');
    
    // Update POL balance
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
}

// ========================================================
// EVENT LISTENERS AND UTILITY FUNCTIONS
// ========================================================

// Initialize wallet selector
function initWalletSelector() {
    // Use the new wallet name UI
    const walletNameContainer = document.querySelector('.wallet-name');
    
    if (walletNameContainer) {
        // Use dropdown to switch wallets
        walletNameContainer.addEventListener('click', function() {
            // This would typically show a dropdown, but for simplicity we'll just cycle through wallets
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
}

// Initialize investment warning
function initInvestmentWarning() {
    const warningBanner = document.getElementById('investment-warning');
    const closeButton = document.getElementById('close-investment-warning');
    
    if (!warningBanner || !closeButton) {
        console.error('Investment warning elements not found');
        return;
    }
    
    closeButton.addEventListener('click', function() {
        warningBanner.style.display = 'none';
    });
    
    const learnMoreLink = document.querySelector('.learn-more');
    if (learnMoreLink) {
        learnMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Crypto assets can be volatile. Their value can go up or down and may be affected by a range of factors including financial market conditions and factors unique to the asset or its issuer.');
        });
    }
}

function showInvestmentWarning() {
    const warningBanner = document.getElementById('investment-warning');
    if (warningBanner) {
        warningBanner.style.display = 'block';
    }
}

// Initialize pull to refresh
function initPullToRefresh() {
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
}

// Debug wallet data function
function debugWalletData() {
    console.error('DEBUG: Wallet Data Details');
    console.error('Active Wallet:', activeWallet);
    
    if (!currentWalletData || !currentWalletData[activeWallet]) {
        console.error('ERROR: Missing wallet data for', activeWallet);
        return;
    }
    
    console.error('Total Wallet Balance:', currentWalletData[activeWallet].totalBalance);
    console.error('Tokens:', currentWalletData[activeWallet].tokens.map(t => ({
        symbol: t.symbol,
        amount: t.amount,
        value: t.value
    })));
}

// Initialize event listeners
function initEventListeners() {
    // Initialize DOM element references
    lockScreen = document.getElementById('lock-screen');
    walletScreen = document.getElementById('wallet-screen');
    tokenDetail = document.getElementById('token-detail');
    sendScreen = document.getElementById('send-screen');
    receiveScreen = document.getElementById('receive-screen');
    adminPanel = document.getElementById('admin-panel');
    verifyOverlay = document.getElementById('verification-overlay');
    biometricOverlay = document.getElementById('biometric-overlay');
    explorerOverlay = document.getElementById('explorer-overlay');
    txStatusModal = document.getElementById('tx-status-modal');
    numpadKeys = document.querySelectorAll('.numpad-key');
    dots = document.querySelectorAll('.dot');
    
    // Add event listeners for token items
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
            if (tokenDetail) tokenDetail.classList.add('hidden');
            if (walletScreen) walletScreen.classList.remove('hidden');
        });
    }
    
    // Add click event to total balance to show verification
    const totalBalance = document.getElementById('total-balance');
    if (totalBalance) {
        totalBalance.addEventListener('click', showVerificationProcess);
    }
    
    // Initialize disclaimer link
    const disclaimerLink = document.querySelector('.disclaimer-link');
    if (disclaimerLink) {
        disclaimerLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
        });
    }
    
    // Initialize Send/Receive buttons
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
    
    // Back buttons on send/receive screens
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (sendScreen) sendScreen.classList.add('hidden');
            if (receiveScreen) receiveScreen.classList.add('hidden');
            if (tokenDetail) tokenDetail.classList.add('hidden');
            if (walletScreen) walletScreen.classList.remove('hidden');
        });
    });
    
    // Initialize verification close button
    const closeVerification = document.getElementById('close-verification');
    if (closeVerification) {
        closeVerification.addEventListener('click', function() {
            if (verifyOverlay) verifyOverlay.style.display = 'none';
        });
    }
    
    // Initialize explorer close button
    const closeExplorer = document.getElementById('close-explorer');
    if (closeExplorer) {
        closeExplorer.addEventListener('click', function() {
            if (explorerOverlay) explorerOverlay.style.display = 'none';
        });
    }
    
    // Initialize biometric overlay
    const cancelBiometric = document.getElementById('cancel-biometric');
    if (cancelBiometric) {
        cancelBiometric.addEventListener('click', function() {
            if (biometricOverlay) biometricOverlay.style.display = 'none';
        });
    }
    
    // Initialize tx status modal
    const closeTxSuccess = document.getElementById('close-tx-success');
    if (closeTxSuccess) {
        closeTxSuccess.addEventListener('click', function() {
            if (txStatusModal) txStatusModal.style.display = 'none';
        });
    }
    
    // Initialize send form
    const continueSendButton = document.getElementById('continue-send');
    if (continueSendButton) {
        continueSendButton.addEventListener('click', processSendTransaction);
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize bottom tabs
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            tabItems.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize wallet action buttons
    const actionButtons = document.querySelectorAll('.wallet-action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Feature not implemented in demo');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.error('Forcing screen initialization');
    initializeAllScreens();
    initPasscode();
    setupDemoBalance();
    updateWalletUI();
});

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

    try {
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
        
        Object.assign(window, criticalElements);
        
        safeInit('Screen Initialization', initializeAllScreens);
        safeInit('Touch Targets', initTouchTargets);
        safeInit('Passcode', initPasscode);
        safeInit('Admin Panel', initAdminPanel);
        safeInit('Wallet Selector', initWalletSelector);
        safeInit('Event Listeners', initEventListeners);
        safeInit('Investment Warning', initInvestmentWarning);
        safeInit('Pull to Refresh', initPullToRefresh);
        
        safeInit('Demo Balance', setupDemoBalance);
        updateWalletUI();
        console.log('✅ ALL INITIALIZATION COMPLETE');
    } catch (globalError) {
        console.error('🔴 CRITICAL GLOBAL INITIALIZATION ERROR:', globalError);
    }
});
