console.log('wallet.js loaded successfully');

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

// Store original wallet data for reset functionality
const originalWalletData = JSON.parse(JSON.stringify(walletData));

// Current wallet data (can be modified by admin panel)
let currentWalletData = JSON.parse(JSON.stringify(walletData));

// Current active wallet
let activeWallet = 'main';

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

// Format currency
function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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

// Reset wallet to original data
function resetWalletToOriginal(walletId) {
    if (walletId === 'all') {
        // Reset all wallets
        currentWalletData = JSON.parse(JSON.stringify(originalWalletData));
    } else {
        // Reset specific wallet
        currentWalletData[walletId] = JSON.parse(JSON.stringify(originalWalletData[walletId]));
    }
    
    // Update UI
    updateWalletUI();
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

// Show verification process
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
