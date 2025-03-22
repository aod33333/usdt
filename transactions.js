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

// Current transaction data (can be modified by admin panel)
let currentTransactions = JSON.parse(JSON.stringify(originalTransactions));

// Update transactions for a specific token
function updateTransactionsForToken(tokenId) {
    const transactions = currentTransactions[activeWallet][tokenId] || [];
    const transactionListElement = document.getElementById('transaction-list');
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

// Generate random Ethereum address
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

// Reset transactions to original data
function resetTransactionsToOriginal(walletId) {
    if (walletId === 'all') {
        currentTransactions = JSON.parse(JSON.stringify(originalTransactions));
    } else {
        currentTransactions[walletId] = JSON.parse(JSON.stringify(originalTransactions[walletId]));
    }
    
    // If token detail view is open, update the transactions
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail.classList.contains('hidden')) {
        const activeTokenId = document.querySelector('.token-title span').textContent.toLowerCase();
        updateTransactionsForToken(activeTokenId);
    }
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
    document.getElementById('send-modal').style.display = 'none';
    
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
