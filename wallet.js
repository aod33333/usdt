// Wallet balances
const walletBalances = {
    'main': {
        'USDT': 100000000,
        'BTC': 847,
        'ETH': 50000,
        'XRP': 500000000,
        'BNB': 2.456
    },
    'second': {
        'USDT': 250000,
        'BTC': 3.5,
        'ETH': 125,
        'XRP': 750000,
        'BNB': 45.78
    },
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': {
        'USDT': 750000,
        'BTC': 5.5,
        'ETH': 180,
        'XRP': 950000,
        'BNB': 67.45
    },
    '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0': {
        'USDT': 500000,
        'BTC': 12.3,
        'ETH': 275,
        'XRP': 1500000,
        'BNB': 124.78
    }
};

// Token prices in USD
const tokenPrices = {
    'USDT': 1.00,
    'BTC': 65000,
    'ETH': 2750,
    'XRP': 0.60,
    'BNB': 502.67
};

// Update wallet balances display
function updateWalletDisplay() {
    // Update token balances
    document.querySelector('#usdt-token .token-balance').textContent = formatNumber(walletBalances[currentAccount].USDT) + ' USDT';
    document.querySelector('#usdt-token .token-fiat-value').textContent = formatCurrency(walletBalances[currentAccount].USDT);
    
    // Update BTC balance
    document.querySelector('.token-item:nth-child(3) .token-balance').textContent = formatNumber(walletBalances[currentAccount].BTC) + ' BTC';
    document.querySelector('.token-item:nth-child(3) .token-fiat-value').textContent = formatCurrency(walletBalances[currentAccount].BTC * tokenPrices.BTC);
    
    // Update ETH balance
    document.querySelector('.token-item:nth-child(4) .token-balance').textContent = formatNumber(walletBalances[currentAccount].ETH) + ' ETH';
    document.querySelector('.token-item:nth-child(4) .token-fiat-value').textContent = formatCurrency(walletBalances[currentAccount].ETH * tokenPrices.ETH);
    
    // Update XRP balance
    document.querySelector('.token-item:nth-child(5) .token-balance').textContent = formatNumber(walletBalances[currentAccount].XRP) + ' XRP';
    document.querySelector('.token-item:nth-child(5) .token-fiat-value').textContent = formatCurrency(walletBalances[currentAccount].XRP * tokenPrices.XRP);
    
    // Update BNB balance
    document.querySelector('.token-item:nth-child(2) .token-balance').textContent = formatNumber(walletBalances[currentAccount].BNB) + ' BNB';
    document.querySelector('.token-item:nth-child(2) .token-fiat-value').textContent = formatCurrency(walletBalances[currentAccount].BNB * tokenPrices.BNB);
    
    // Update total balance
    const totalBalance = 
        walletBalances[currentAccount].USDT + 
        walletBalances[currentAccount].BTC * tokenPrices.BTC + 
        walletBalances[currentAccount].ETH * tokenPrices.ETH + 
        walletBalances[currentAccount].XRP * tokenPrices.XRP + 
        walletBalances[currentAccount].BNB * tokenPrices.BNB;
    
    document.querySelector('.wallet-total-balance').textContent = formatCurrency(totalBalance);
    
    // Update token detail screen if open
    if (tokenDetailScreen.style.display === 'flex') {
        document.querySelector('.holdings-amount').textContent = formatNumber(walletBalances[currentAccount].USDT) + ' USDT';
        document.querySelector('.holdings-value').textContent = formatCurrency(walletBalances[currentAccount].USDT);
    }
    
    // Update account selection visual indicator
    const accountOptions = document.querySelectorAll('.account-option');
    accountOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.account === currentAccount);
    });
    
    // Update wallet name in title
    let walletName = 'Main Wallet';
    if (currentAccount === 'second') {
        walletName = 'Account 2';
    }
    document.querySelector('.wallet-title').childNodes[0].textContent = walletName;
}

// Toggle accounts dropdown
function toggleAccountsDropdown() {
    const dropdown = document.getElementById('accounts-dropdown');
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    
    // Toggle arrow direction
    const arrow = document.querySelector('.wallet-dropdown-arrow');
    arrow.classList.toggle('active', !isVisible);
}

// Switch account
function switchAccount(account) {
    currentAccount = account;
    updateWalletDisplay();
    updateTransactionHistory();
    
    // Update UI to reflect active account
    document.querySelectorAll('.account-option').forEach(option => {
        option.classList.toggle('active', option.dataset.account === account);
    });
    
    // Update wallet dropdown options based on current account
    updateTransferOptions();
    
    // Hide dropdown
    document.getElementById('accounts-dropdown').style.display = 'none';
    document.querySelector('.wallet-dropdown-arrow').classList.remove('active');
}

// Update transfer options based on current account
function updateTransferOptions() {
    // Clear existing options
    const dropdown = document.getElementById('wallet-dropdown');
    dropdown.innerHTML = '';
    
    // If we're in the main account, the destination can be Account 2 or external wallets
    if (currentAccount === 'main') {
        const option1 = document.createElement('div');
        option1.className = 'wallet-option';
        option1.dataset.address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        option1.textContent = 'Account 2';
        dropdown.appendChild(option1);
        
        const option2 = document.createElement('div');
        option2.className = 'wallet-option';
        option2.dataset.address = '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0';
        option2.textContent = 'External Wallet (0x8A7F...)';
        dropdown.appendChild(option2);
    } 
    // If we're in Account 2, the destination can be the main account or external wallet
    else if (currentAccount === 'second') {
        const option1 = document.createElement('div');
        option1.className = 'wallet-option';
        option1.dataset.address = 'main';
        option1.textContent = 'Main Wallet';
        dropdown.appendChild(option1);
        
        const option2 = document.createElement('div');
        option2.className = 'wallet-option';
        option2.dataset.address = '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0';
        option2.textContent = 'External Wallet (0x8A7F...)';
        dropdown.appendChild(option2);
    }
    
    // Reattach click events
    document.querySelectorAll('.wallet-option').forEach(option => {
        option.addEventListener('click', () => {
            walletAddressInput.value = option.dataset.address;
            walletDropdown.style.display = 'none';
        });
    });
}
