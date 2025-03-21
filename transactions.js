// Transaction history
let transactionHistory = [
    {
        from: 'main',
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        token: 'USDT',
        amount: 50000,
        date: 'Mar 15, 2025',
        type: 'send'
    },
    {
        from: '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0',
        to: 'main',
        token: 'USDT',
        amount: 150000,
        date: 'Mar 10, 2025',
        type: 'receive'
    },
    {
        from: 'main',
        to: '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0',
        token: 'BTC',
        amount: 1.25,
        date: 'Mar 7, 2025',
        type: 'send'
    },
    {
        from: 'second',
        to: 'main',
        token: 'ETH',
        amount: 5.5,
        date: 'Mar 3, 2025',
        type: 'receive'
    },
    {
        from: 'second',
        to: '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0',
        token: 'USDT',
        amount: 25000,
        date: 'Feb 28, 2025',
        type: 'send'
    }
];

// Update transaction history
function updateTransactionHistory() {
    const transactionList = document.querySelector('.transaction-list');
    if (!transactionList) return;
    
    transactionList.innerHTML = '';
    
    const recentTransactions = transactionHistory
        .filter(tx => {
            // For USDT detailed view, only show USDT transactions
            if (tokenDetailScreen.style.display === 'flex') {
                return tx.token === 'USDT' && 
                      (tx.from === currentAccount || tx.to === currentAccount);
            }
            // For main wallet view, show all transactions
            return (tx.from === currentAccount || tx.to === currentAccount);
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    recentTransactions.forEach(tx => {
        const isSent = tx.from === currentAccount;
        
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        let iconPath = '';
        if (isSent) {
            iconPath = `<path d="M7.50008 13.4753L12.4751 8.50033M12.4751 8.50033H8.17508M12.4751 8.50033V12.8003" stroke="#1A2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
        } else {
            iconPath = `<path d="M12.4999 6.52467L7.52492 11.4997M7.52492 11.4997H11.8249M7.52492 11.4997L7.52492 7.19967" stroke="#1A2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${iconPath}
                    <path d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337Z" stroke="#1A2024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="transaction-details">
                <div class="transaction-type">${isSent ? 'Sent' : 'Received'} ${tx.token}</div>
                <div class="transaction-date">${tx.date}</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value">${isSent ? '-' : '+'}${formatNumber(tx.amount)} ${tx.token}</div>
                <div class="transaction-usd">${isSent ? '-' : '+'}${formatCurrency(tx.amount * (tx.token === 'USDT' ? 1 : tokenPrices[tx.token]))}</div>
            </div>
        `;
        
        transactionList.appendChild(transactionItem);
    });
}

// Process transfer
function processTransfer() {
    const toAddress = walletAddressInput.value;
    const amount = parseFloat(transferAmountInput.value);
    
    if (!toAddress || !amount || amount <= 0) {
        showToast('Please enter a valid wallet address and amount');
        return;
    }
    
    if (amount > walletBalances[currentAccount].USDT) {
        showToast('Insufficient balance');
        return;
    }
    
    // Determine the recipient account
    let toAccount = toAddress;
    
    // For simplicity and demo purposes
    if (toAddress === '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' && currentAccount === 'main') {
        toAccount = 'second';
    } else if (toAddress === 'main' && currentAccount === 'second') {
        toAccount = 'main';
    }
    
    // Update balances
    walletBalances[currentAccount].USDT -= amount;
    
    // Update destination balance if it's one of our accounts
    if (walletBalances[toAccount]) {
        walletBalances[toAccount].USDT += amount;
    }
    
    // Add to transaction history
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    transactionHistory.unshift({
        from: currentAccount,
        to: toAccount,
        token: 'USDT',
        amount: amount,
        date: dateStr,
        type: 'send'
    });
    
    // Update UI
    hideTransferModal();
    showLoading();
    
    setTimeout(() => {
        updateWalletDisplay();
        updateTransactionHistory();
        
        // Show toast
        showToast(`${formatNumber(amount)} USDT sent successfully`);
        hideLoading();
    }, 1500);
}
