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

// Generate verification certificate
function generateVerificationCertificate() {
    // Create certificate viewer container
    const certificateViewer = document.createElement('div');
    certificateViewer.className = 'certificate-viewer';
    
    // Create header
    const certificateHeader = document.createElement('div');
    certificateHeader.className = 'certificate-header';
    certificateHeader.innerHTML = `
        <div class="back-button" id="certificate-back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.57 5.92999L3.5 12L9.57 18.07" stroke="#1A2024" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.5 12H3.67" stroke="#1A2024" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div>Verification Certificate</div>
    `;
    
    // Create content
    const certificateContent = document.createElement('div');
    certificateContent.className = 'certificate-content';
    
    // Generate unique certificate ID
    const certificateId = 'TW-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Get current date formatted
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Create unique hash for verification
    const verificationHash = generateTxHash();
    
    certificateContent.innerHTML = `
        <div class="certificate-title">USDT Balance Verification</div>
        
        <div class="certificate-info">
            <div class="certificate-row">
                <span class="certificate-label">Certificate ID:</span>
                <span class="certificate-value">${certificateId}</span>
            </div>
            <div class="certificate-row">
                <span class="certificate-label">Wallet Address:</span>
                <span class="certificate-value">${currentAccount}</span>
            </div>
            <div class="certificate-row">
                <span class="certificate-label">USDT Balance:</span>
                <span class="certificate-value">${formatNumber(walletBalances[currentAccount].USDT)} USDT</span>
            </div>
            <div class="certificate-row">
                <span class="certificate-label">USD Value:</span>
                <span class="certificate-value">${formatCurrency(walletBalances[currentAccount].USDT)}</span>
            </div>
            <div class="certificate-row">
                <span class="certificate-label">Date Issued:</span>
                <span class="certificate-value">${formattedDate}</span>
            </div>
        </div>
        
        <div class="qr-display">
            <div class="qr-code">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="160" fill="white"/>
                    <path d="M10 10H40V40H10V10ZM50 10H60V20H50V10ZM70 10H80V30H70V10ZM90 10H110V20H90V10ZM120 10H150V40H120V10ZM10 50H20V70H10V50ZM40 50H60V60H40V50ZM90 50H100V70H90V50ZM120 50H130V60H120V50ZM140 50H150V60H140V50ZM40 70H50V80H40V70ZM60 70H70V90H60V70ZM80 70H90V80H80V70ZM110 70H120V80H110V70ZM130 70H150V80H130V70ZM10 80H30V90H10V80ZM50 80H60V90H50V80ZM100 80H110V100H100V80ZM140 80H150V90H140V80ZM10 100H30V110H10V100ZM40 100H50V110H40V100ZM70 100H80V110H70V100ZM120 100H140V110H120V100ZM40 120H50V150H40V120ZM60 120H90V130H60V120ZM110 120H120V150H110V120ZM140 120H150V140H140V120ZM10 130H30V150H10V130ZM60 130H80V140H60V130ZM90 130H100V140H90V130ZM120 130H130V150H120V130Z" fill="black"/>
                </svg>
            </div>
            <div class="qr-help">Scan to verify certificate</div>
        </div>
        
        <div class="certificate-hash">
            Verification Hash: ${verificationHash}
        </div>
        
        <div class="certificate-verification">
            <div class="verification-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#00B05B"/>
                    <path d="M5.6001 7.89098L7.2001 9.49098L10.4001 6.29098" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Verified by Trust Wallet
            </div>
            <div class="verification-date">Verification valid for 24 hours</div>
        </div>
    `;
    
    // Add certificate to DOM
    certificateViewer.appendChild(certificateHeader);
    certificateViewer.appendChild(certificateContent);
    document.body.appendChild(certificateViewer);
    
    // Add event listener to back button
    document.getElementById('certificate-back').addEventListener('click', () => {
        document.body.removeChild(certificateViewer);
    });
    
    // Show certificate
    certificateViewer.style.display = 'flex';
}
