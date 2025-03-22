// Original transaction data
const originalTransactions = {
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
};

// Current transaction data (can be modified by admin panel)
let currentTransactions = JSON.parse(JSON.stringify(originalTransactions));

// Update transactions for a specific token
function updateTransactionsForToken(tokenId) {
    const transactions = currentTransactions[tokenId] || [];
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
function generateFakeTransactionHistory(totalAmount) {
    // Clear existing USDT transactions
    currentTransactions.usdt = [];
    
    // Create a series of fake incoming transactions to match the requested amount
    const transactionCount = Math.min(10, Math.max(3, Math.floor(Math.log10(totalAmount) * 2)));
    
    // Generate random splits of the total amount
    const amounts = splitAmountRandomly(totalAmount, transactionCount);
    
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
        const toAddress = '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71'; // User's address
        const hash = generateRandomTransactionHash();
        
        // Add transaction
        currentTransactions.usdt.unshift({
            id: 'fake-tx-' + i,
            type: 'receive',
            amount: parseFloat(amount.toFixed(2)),
            symbol: 'USDT',
            value: parseFloat(amount.toFixed(2)),
            date: formattedDate,
            from: fromAddress,
            to: toAddress,
            hash: hash
        });
    }
    
    // Sort transactions by date (newest first)
    currentTransactions.usdt.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
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
function resetTransactionsToOriginal() {
    currentTransactions = JSON.parse(JSON.stringify(originalTransactions));
    
    // If token detail view is open, update the transactions
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail.classList.contains('hidden')) {
        const activeTokenId = document.querySelector('.token-title span').textContent.toLowerCase();
        updateTransactionsForToken(activeTokenId);
    }
