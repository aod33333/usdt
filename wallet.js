// Original wallet data
const originalWalletData = {
    totalBalance: 1345.67,
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
};

// Current wallet data (can be modified by admin panel)
let currentWalletData = JSON.parse(JSON.stringify(originalWalletData));

// Init wallet on DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    updateWalletUI();
    
    // Add event listeners for token items
    document.getElementById('token-list').addEventListener('click', function(event) {
        const tokenItem = event.target.closest('.token-item');
        if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            showTokenDetail(tokenId);
        }
    });
});

// Update wallet UI with current data
function updateWalletUI() {
    // Update total balance
    const totalBalanceElement = document.getElementById('total-balance');
    totalBalanceElement.textContent = formatCurrency(currentWalletData.totalBalance);
    
    // Update token list
    const tokenListElement = document.getElementById('token-list');
    tokenListElement.innerHTML = '';
    
    currentWalletData.tokens.forEach(token => {
        const tokenElement = createTokenElement(token);
        tokenListElement.appendChild(tokenElement);
    });
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
function updateWalletWithFakeBalance(amount) {
    const usdtToken = currentWalletData.tokens.find(t => t.id === 'usdt');
    
    if (usdtToken) {
        // Calculate the difference to add to total balance
        const difference = amount - usdtToken.value;
        
        // Update USDT token
        usdtToken.amount = amount;
        usdtToken.value = amount;
        
        // Update total balance
        currentWalletData.totalBalance += difference;
        
        // Update UI
        updateWalletUI();
    }
}

// Reset wallet to original data
function resetWalletToOriginal() {
    currentWalletData = JSON.parse(JSON.stringify(originalWalletData));
    updateWalletUI();
}
