// Store original wallet data for reset functionality
const originalWalletData = JSON.parse(JSON.stringify(walletData));

// Current wallet data (can be modified by admin panel)
let currentWalletData = JSON.parse(JSON.stringify(walletData));

// Current active wallet
let activeWallet = 'main';

// Init wallet on DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    updateWalletUI();
    initWalletSelector();
    
    // Add event listeners for token items
    document.getElementById('token-list').addEventListener('click', function(event) {
        const tokenItem = event.target.closest('.token-item');
        if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            showTokenDetail(tokenId);
        }
    });
    
    // Initialize disclaimer link
    document.querySelector('.disclaimer-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
    });
});

// Initialize wallet selector
function initWalletSelector() {
    const walletSelector = document.getElementById('wallet-selector');
    const selectedWalletEl = walletSelector.querySelector('.selected-wallet');
    const walletOptions = walletSelector.querySelectorAll('.wallet-option:not(.add-wallet)');
    
    walletOptions.forEach(option => {
        option.addEventListener('click', function() {
            const walletId = this.getAttribute('data-wallet');
            activeWallet = walletId;
            
            // Update UI
            selectedWalletEl.textContent = this.textContent;
            walletOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update wallet display
            updateWalletUI();
            
            // Show investment warning when switching wallets
            const warningBanner = document.getElementById('investment-warning');
            warningBanner.style.display = 'block';
        });
    });
}

// Update wallet UI with current data
function updateWalletUI() {
    // Get current wallet data
    const walletToShow = currentWalletData[activeWallet];
    
    // Update total balance
    const totalBalanceElement = document.getElementById('total-balance');
    totalBalanceElement.textContent = formatCurrency(walletToShow.totalBalance);
    
    // Update token list
    const tokenListElement = document.getElementById('token-list');
    tokenListElement.innerHTML = '';
    
    walletToShow.tokens.forEach(token => {
        const tokenElement = createTokenElement(token);
        tokenListElement.appendChild(tokenElement);
    });
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
    
    tokenItem.innerHTML = `
        <div class="token-icon">
            <img src="${token.icon}" alt="${token.name}">
            ${chainBadgeHTML}
        </div>
        <div class="token-info">
            <div class="token-name">${token.name}</div>
            <div class="token-price">
                ${token.network}
                <span class="token-price-change ${changeClass}">${changeSign}${token.change}%</span>
            </div>
        </div>
        <div class="token-amount">
            <div class="token-balance">${token.amount}</div>
            <div class="token-value">${token.value.toFixed(2)}</div>
        </div>
    `;
    
    return tokenItem;
}

// Show token detail view
function showTokenDetail(tokenId) {
    const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Update token detail view
    document.getElementById('detail-icon').src = token.icon;
    document.getElementById('detail-name').textContent = token.name;
    document.getElementById('detail-amount').textContent = `${token.amount} ${token.symbol}`;
    document.getElementById('detail-value').textContent = formatCurrency(token.value);
    
    const changeElement = document.getElementById('detail-change');
    changeElement.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
    changeElement.className = `detail-change ${token.change >= 0 ? 'positive' : 'negative'}`;
    
    // Update transactions for this token
    updateTransactionsForToken(tokenId);
    
    // Update chart for this token
    updateChartForToken(tokenId);
    
    // Show detail screen
    document.getElementById('wallet-screen').classList.add('hidden');
    document.getElementById('token-detail').classList.remove('hidden');
}

// Update chart for token
function updateChartForToken(tokenId) {
    // In a real implementation, this would load historical price data
    // For demo, we'll just regenerate random data
    const priceData = generateChartData();
    
    if (chartInstance) {
        chartInstance.data.labels = priceData.labels;
        chartInstance.data.datasets[0].data = priceData.values;
        chartInstance.update();
    }
}

// Format currency
function formatCurrency(value) {
    return '// Multiple wallet data
const walletData = {
    main: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'btc',
                name: 'BTC',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0.00,
                price: 83984.74,
                change: -0.59,
                chainBadge: null
            },
            {
                id: 'eth',
                name: 'ETH',
                symbol: 'ETH',
                network: 'Ethereum',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0,
                value: 0.00,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            },
            {
                id: 'pol',
                name: 'POL',
                symbol: 'POL',
                network: 'Polygon',
                icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.20,
                change: -2.05,
                chainBadge: null
            },
            {
                id: 'bnb',
                name: 'BNB',
                symbol: 'BNB',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0,
                value: 0.00,
                price: 634.12,
                change: 0.95,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'trx',
                name: 'TRX',
                symbol: 'TRX',
                network: 'Tron',
                icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.23,
                change: 0.95,
                chainBadge: null
            },
            {
                id: 'twt',
                name: 'TWT',
                symbol: 'TWT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.89,
                change: 0.09,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'usdt',
                name: 'USDT',
                symbol: 'USDT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 0,
                value: 0.00,
                price: 1.00,
                change: 0.00,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            }
        ]
    },
    secondary: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'btc',
                name: 'BTC',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0.00,
                price: 83984.74,
                change: -0.59,
                chainBadge: null
            },
            {
                id: 'eth',
                name: 'ETH',
                symbol: 'ETH',
                network: 'Ethereum',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0,
                value: 0.00,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            }
        ]
    },
    business: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'usdt',
                name: 'USDT',
                symbol: 'USDT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 0,
                value: 0.00,
                price: 1.00,
                change: 0.00,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            }
        ]
    }
};// Multiple wallet data
const walletData = {
    main: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'btc',
                name: 'BTC',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0.00,
                price: 83984.74,
                change: -0.59,
                chainBadge: null
            },
            {
                id: 'eth',
                name: 'ETH',
                symbol: 'ETH',
                network: 'Ethereum',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0,
                value: 0.00,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            },
            {
                id: 'pol',
                name: 'POL',
                symbol: 'POL',
                network: 'Polygon',
                icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.20,
                change: -2.05,
                chainBadge: null
            },
            {
                id: 'bnb',
                name: 'BNB',
                symbol: 'BNB',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0,
                value: 0.00,
                price: 634.12,
                change: 0.95,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'trx',
                name: 'TRX',
                symbol: 'TRX',
                network: 'Tron',
                icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.23,
                change: 0.95,
                chainBadge: null
            },
            {
                id: 'twt',
                name: 'TWT',
                symbol: 'TWT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.89,
                change: 0.09,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'usdt',
                name: '// Multiple wallet data
const walletData = {
    main: {
        totalBalance: 2845.67,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 1250.00,
                value: 1250.00,
                change: 0.0,
            },
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                network: 'BTC',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0.012,
                value: 750.25,
                change: 2.4,
            },
            {
                id: 'eth',
                name: 'Ethereum',
                symbol: 'ETH',
                network: 'ERC-20',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0.25,
                value: 650.75,
                change: -1.2,
            },
            {
                id: 'xrp',
                name: 'XRP',
                symbol: 'XRP',
                network: 'XRP',
                icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
                amount: 125.5,
                value: 99.00,
                change: 0.8,
            },
            {
                id: 'bnb',
                name: 'Binance Coin',
                symbol: 'BNB',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0.25,
                value: 95.67,
                change: 1.2,
            }
        ]
    },
    secondary: {
        totalBalance: 1500.00,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 1000.00,
                value: 1000.00,
                change: 0.0,
            },
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                network: 'BTC',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0.008,
                value: 500.00,
                change: 2.4,
            }
        ]
    },
    business: {
        totalBalance: 50000.00,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 50000.00,
                value: 50000.00,
                change: 0.0,
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

// Init wallet on DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    updateWalletUI();
    initWalletSelector();
    
    // Add event listeners for token items
    document.getElementById('token-list').addEventListener('click', function(event) {
        const tokenItem = event.target.closest('.token-item');
        if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            showTokenDetail(tokenId);
        }
    });
    
    // Initialize risk warning
    initRiskWarning();
});

// Initialize risk warning
function initRiskWarning() {
    const warningBanner = document.getElementById('risk-warning');
    const closeButton = document.getElementById('close-warning');
    
    closeButton.addEventListener('click', function() {
        warningBanner.style.display = 'none';
    });
    
    // Show warning when sending
    const sendButtons = document.querySelectorAll('.action-button:nth-child(2), .detail-action:nth-child(2)');
    sendButtons.forEach(button => {
        button.addEventListener('click', function() {
            warningBanner.style.display = 'block';
            setTimeout(() => {
                warningBanner.style.display = 'none';
            }, 5000);
        });
    });
}

// Initialize wallet selector
function initWalletSelector() {
    const walletSelector = document.getElementById('wallet-selector');
    const selectedWalletEl = walletSelector.querySelector('.selected-wallet');
    const walletOptions = walletSelector.querySelectorAll('.wallet-option:not(.add-wallet)');
    
    walletOptions.forEach(option => {
        option.addEventListener('click', function() {
            const walletId = this.getAttribute('data-wallet');
            activeWallet = walletId;
            
            // Update UI
            selectedWalletEl.textContent = this.textContent;
            walletOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update wallet display
            updateWalletUI();
            
            // Show investment warning when switching wallets
            const warningBanner = document.getElementById('investment-warning');
            warningBanner.style.display = 'block';
        });
    });
}

// Update wallet UI with current data
function updateWalletUI() {
    // Get current wallet data
    const walletToShow = currentWalletData[activeWallet];
    
    // Update total balance
    const totalBalanceElement = document.getElementById('total-balance');
    totalBalanceElement.textContent = formatCurrency(walletToShow.totalBalance);
    
    // Update token list
    const tokenListElement = document.getElementById('token-list');
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
    
    tokenItem.innerHTML = `
        <img src="${token.icon}" alt="${token.name}" class="token-icon">
        <div class="token-info">
            <div class="token-name">
                ${token.name} <span class="token-network">${token.network}</span>
            </div>
            <div class="token-amount">${token.amount} ${token.symbol}</div>
        </div>
        <div class="token-value">
            <div class="token-price">${formatCurrency(token.value)}</div>
            <div class="token-change ${token.change >= 0 ? 'positive' : 'negative'}">
                ${token.change >= 0 ? '+' : ''}${token.change}%
            </div>
        </div>
    `;
    
    return tokenItem;
}

// Show token detail view
function showTokenDetail(tokenId) {
    const token = currentWalletData.tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Update token detail view
    document.getElementById('detail-icon').src = token.icon;
    document.getElementById('detail-name').textContent = token.name;
    document.getElementById('detail-amount').textContent = `${token.amount} ${token.symbol}`;
    document.getElementById('detail-value').textContent = formatCurrency(token.value);
    
    const changeElement = document.getElementById('detail-change');
    changeElement.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
    changeElement.className = `detail-change ${token.change >= 0 ? 'positive' : 'negative'}`;
    
    // Update transactions for this token
    updateTransactionsForToken(tokenId);
    
    // Update chart for this token
    updateChartForToken(tokenId);
    
    // Show detail screen
    document.getElementById('wallet-screen').classList.add('hidden');
    document.getElementById('token-detail').classList.remove('hidden');
}

// Update chart for token
function updateChartForToken(tokenId) {
    // In a real implementation, this would load historical price data
    // For demo, we'll just regenerate random data
    const priceData = generateChartData();
    
    if (chartInstance) {
        chartInstance.data.labels = priceData.labels;
        chartInstance.data.datasets[0].data = priceData.values;
        chartInstance.update();
    }
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
        token.amount = amount;
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
} + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, ',');
}

// Update wallet with fake balance
function updateWalletWithFakeBalance(tokenId, amount, walletId) {
    const wallet = currentWalletData[walletId];
    const token = wallet.tokens.find(t => t.id === tokenId);
    
    if (token) {
        // Calculate the difference to add to total balance
        const difference = amount - token.value;
        
        // Update token
        token.amount = amount;
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
}// Multiple wallet data
const walletData = {
    main: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'btc',
                name: 'BTC',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0.00,
                price: 83984.74,
                change: -0.59,
                chainBadge: null
            },
            {
                id: 'eth',
                name: 'ETH',
                symbol: 'ETH',
                network: 'Ethereum',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0,
                value: 0.00,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            },
            {
                id: 'pol',
                name: 'POL',
                symbol: 'POL',
                network: 'Polygon',
                icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.20,
                change: -2.05,
                chainBadge: null
            },
            {
                id: 'bnb',
                name: 'BNB',
                symbol: 'BNB',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0,
                value: 0.00,
                price: 634.12,
                change: 0.95,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'trx',
                name: 'TRX',
                symbol: 'TRX',
                network: 'Tron',
                icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.23,
                change: 0.95,
                chainBadge: null
            },
            {
                id: 'twt',
                name: 'TWT',
                symbol: 'TWT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.89,
                change: 0.09,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'usdt',
                name: 'USDT',
                symbol: 'USDT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 0,
                value: 0.00,
                price: 1.00,
                change: 0.00,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            }
        ]
    },
    secondary: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'btc',
                name: 'BTC',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0.00,
                price: 83984.74,
                change: -0.59,
                chainBadge: null
            },
            {
                id: 'eth',
                name: 'ETH',
                symbol: 'ETH',
                network: 'Ethereum',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0,
                value: 0.00,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            }
        ]
    },
    business: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'usdt',
                name: 'USDT',
                symbol: 'USDT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 0,
                value: 0.00,
                price: 1.00,
                change: 0.00,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            }
        ]
    }
};// Multiple wallet data
const walletData = {
    main: {
        totalBalance: 0.00,
        tokens: [
            {
                id: 'btc',
                name: 'BTC',
                symbol: 'BTC',
                network: 'Bitcoin',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0,
                value: 0.00,
                price: 83984.74,
                change: -0.59,
                chainBadge: null
            },
            {
                id: 'eth',
                name: 'ETH',
                symbol: 'ETH',
                network: 'Ethereum',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0,
                value: 0.00,
                price: 1973.81,
                change: -0.71,
                chainBadge: null
            },
            {
                id: 'pol',
                name: 'POL',
                symbol: 'POL',
                network: 'Polygon',
                icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.20,
                change: -2.05,
                chainBadge: null
            },
            {
                id: 'bnb',
                name: 'BNB',
                symbol: 'BNB',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0,
                value: 0.00,
                price: 634.12,
                change: 0.95,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'trx',
                name: 'TRX',
                symbol: 'TRX',
                network: 'Tron',
                icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.23,
                change: 0.95,
                chainBadge: null
            },
            {
                id: 'twt',
                name: 'TWT',
                symbol: 'TWT',
                network: 'BNB Smart Chain',
                icon: 'https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png',
                amount: 0,
                value: 0.00,
                price: 0.89,
                change: 0.09,
                chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
                id: 'usdt',
                name: '// Multiple wallet data
const walletData = {
    main: {
        totalBalance: 2845.67,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 1250.00,
                value: 1250.00,
                change: 0.0,
            },
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                network: 'BTC',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0.012,
                value: 750.25,
                change: 2.4,
            },
            {
                id: 'eth',
                name: 'Ethereum',
                symbol: 'ETH',
                network: 'ERC-20',
                icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                amount: 0.25,
                value: 650.75,
                change: -1.2,
            },
            {
                id: 'xrp',
                name: 'XRP',
                symbol: 'XRP',
                network: 'XRP',
                icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
                amount: 125.5,
                value: 99.00,
                change: 0.8,
            },
            {
                id: 'bnb',
                name: 'Binance Coin',
                symbol: 'BNB',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                amount: 0.25,
                value: 95.67,
                change: 1.2,
            }
        ]
    },
    secondary: {
        totalBalance: 1500.00,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 1000.00,
                value: 1000.00,
                change: 0.0,
            },
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                network: 'BTC',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                amount: 0.008,
                value: 500.00,
                change: 2.4,
            }
        ]
    },
    business: {
        totalBalance: 50000.00,
        tokens: [
            {
                id: 'usdt',
                name: 'Tether',
                symbol: 'USDT',
                network: 'BEP-20',
                icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                amount: 50000.00,
                value: 50000.00,
                change: 0.0,
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

// Init wallet on DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    updateWalletUI();
    initWalletSelector();
    
    // Add event listeners for token items
    document.getElementById('token-list').addEventListener('click', function(event) {
        const tokenItem = event.target.closest('.token-item');
        if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            showTokenDetail(tokenId);
        }
    });
    
    // Initialize risk warning
    initRiskWarning();
});

// Initialize risk warning
function initRiskWarning() {
    const warningBanner = document.getElementById('risk-warning');
    const closeButton = document.getElementById('close-warning');
    
    closeButton.addEventListener('click', function() {
        warningBanner.style.display = 'none';
    });
    
    // Show warning when sending
    const sendButtons = document.querySelectorAll('.action-button:nth-child(2), .detail-action:nth-child(2)');
    sendButtons.forEach(button => {
        button.addEventListener('click', function() {
            warningBanner.style.display = 'block';
            setTimeout(() => {
                warningBanner.style.display = 'none';
            }, 5000);
        });
    });
}

// Initialize wallet selector
function initWalletSelector() {
    const walletSelector = document.getElementById('wallet-selector');
    const selectedWalletEl = walletSelector.querySelector('.selected-wallet');
    const walletOptions = walletSelector.querySelectorAll('.wallet-option:not(.add-wallet)');
    
    walletOptions.forEach(option => {
        option.addEventListener('click', function() {
            const walletId = this.getAttribute('data-wallet');
            activeWallet = walletId;
            
            // Update UI
            selectedWalletEl.textContent = this.textContent;
            walletOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update wallet display
            updateWalletUI();
            
            // Show investment warning when switching wallets
            const warningBanner = document.getElementById('investment-warning');
            warningBanner.style.display = 'block';
        });
    });
}

// Update wallet UI with current data
function updateWalletUI() {
    // Get current wallet data
    const walletToShow = currentWalletData[activeWallet];
    
    // Update total balance
    const totalBalanceElement = document.getElementById('total-balance');
    totalBalanceElement.textContent = formatCurrency(walletToShow.totalBalance);
    
    // Update token list
    const tokenListElement = document.getElementById('token-list');
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
    
    tokenItem.innerHTML = `
        <img src="${token.icon}" alt="${token.name}" class="token-icon">
        <div class="token-info">
            <div class="token-name">
                ${token.name} <span class="token-network">${token.network}</span>
            </div>
            <div class="token-amount">${token.amount} ${token.symbol}</div>
        </div>
        <div class="token-value">
            <div class="token-price">${formatCurrency(token.value)}</div>
            <div class="token-change ${token.change >= 0 ? 'positive' : 'negative'}">
                ${token.change >= 0 ? '+' : ''}${token.change}%
            </div>
        </div>
    `;
    
    return tokenItem;
}

// Show token detail view
function showTokenDetail(tokenId) {
    const token = currentWalletData.tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Update token detail view
    document.getElementById('detail-icon').src = token.icon;
    document.getElementById('detail-name').textContent = token.name;
    document.getElementById('detail-amount').textContent = `${token.amount} ${token.symbol}`;
    document.getElementById('detail-value').textContent = formatCurrency(token.value);
    
    const changeElement = document.getElementById('detail-change');
    changeElement.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
    changeElement.className = `detail-change ${token.change >= 0 ? 'positive' : 'negative'}`;
    
    // Update transactions for this token
    updateTransactionsForToken(tokenId);
    
    // Update chart for this token
    updateChartForToken(tokenId);
    
    // Show detail screen
    document.getElementById('wallet-screen').classList.add('hidden');
    document.getElementById('token-detail').classList.remove('hidden');
}

// Update chart for token
function updateChartForToken(tokenId) {
    // In a real implementation, this would load historical price data
    // For demo, we'll just regenerate random data
    const priceData = generateChartData();
    
    if (chartInstance) {
        chartInstance.data.labels = priceData.labels;
        chartInstance.data.datasets[0].data = priceData.values;
        chartInstance.update();
    }
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
        token.amount = amount;
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
