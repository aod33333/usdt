// Transaction history
let transactionHistory = [
    {
        from: 'main',
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        token: 'USDT',
        amount: 50000,
        date: 'Mar 15, 2025',
        type: 'send',
        hash: '0x7fd6a13c9bcd1c3bf70d0c9cd5e4af4e3b8de3fcef5cb4a6f0a26eec1a118d5e'
    },
    {
        from: '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0',
        to: 'main',
        token: 'USDT',
        amount: 150000,
        date: 'Mar 10, 2025',
        type: 'receive',
        hash: '0x2b9e52a4f5a4e3f6b72c1f5e3c8a4b5c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a'
    },
    {
        from: 'main',
        to: '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0',
        token: 'BTC',
        amount: 1.25,
        date: 'Mar 7, 2025',
        type: 'send',
        hash: '0x3c5d7a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f'
    },
    {
        from: 'second',
        to: 'main',
        token: 'ETH',
        amount: 5.5,
        date: 'Mar 3, 2025',
        type: 'receive',
        hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e'
    },
    {
        from: 'second',
        to: '0x8A7F7D7356bFBcf81Dd9E5749a0120C6A492F8a0',
        token: 'USDT',
        amount: 25000,
        date: 'Feb 28, 2025',
        type: 'send',
        hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6'
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
                <div class="transaction-hash">${tx.hash.substring(0, 10)}...${tx.hash.substring(tx.hash.length - 8)}</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value">${isSent ? '-' : '+'}${formatNumber(tx.amount)} ${tx.token}</div>
                <div class="transaction-usd">${isSent ? '-' : '+'}${formatCurrency(tx.amount * (tx.token === 'USDT' ? 1 : tokenPrices[tx.token]))}</div>
            </div>
        `;
        
        // Add click event to show transaction details
        transactionItem.addEventListener('click', () => {
            showTransactionDetails(tx);
        });
        
        transactionList.appendChild(transactionItem);
    });
}

// Show transaction details
function showTransactionDetails(transaction) {
    // Create modal for transaction details
    const modal = document.createElement('div');
    modal.className = 'transfer-modal';
    modal.style.display = 'flex';
    
    const isSent = transaction.from === currentAccount;
    const explorerLink = 'https://etherscan.io/tx/' + transaction.hash;
    
    // Format date nicely
    const txDate = new Date(transaction.date);
    const formattedDate = txDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    modal.innerHTML = `
        <div class="transfer-modal-content" style="padding-bottom: 15px;">
            <div class="transfer-header">
                <div class="transfer-title">${isSent ? 'Sent' : 'Received'} ${transaction.token}</div>
                <div class="transfer-description">${formattedDate}</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: center; margin: 20px 0;">
                    <div style="width: 48px; height: 48px; background-color: ${isSent ? '#FFEBEE' : '#E8F5E9'}; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            ${isSent ? 
                            `<path d="M9 5L4 12L9 19" stroke="${isSent ? '#E53935' : '#43A047'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 12H20" stroke="${isSent ? '#E53935' : '#43A047'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : 
                            `<path d="M15 19L20 12L15 5" stroke="${isSent ? '#E53935' : '#43A047'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 12H4" stroke="${isSent ? '#E53935' : '#43A047'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`}
                        </svg>
                    </div>
                </div>
                
                <div style="text-align: center; margin-bottom: 5px;">
                    <span style="font-size: 24px; font-weight: 600; color: ${isSent ? '#E53935' : '#43A047'};">
                        ${isSent ? '-' : '+'}${formatNumber(transaction.amount)} ${transaction.token}
                    </span>
                </div>
                
                <div style="text-align: center; margin-bottom: 20px; color: #7F8489;">
                    ${isSent ? '-' : '+'}${formatCurrency(transaction.amount * (transaction.token === 'USDT' ? 1 : tokenPrices[transaction.token]))}
                </div>
            </div>
            
            <div style="background-color: #F8F8FA; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #7F8489;">Status</span>
                    <span style="font-weight: 500; color: #00B05B;">Confirmed</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #7F8489;">From</span>
                    <span style="font-weight: 500; color: #1A1A1A; text-overflow: ellipsis; overflow: hidden; max-width: 170px;">${transaction.from}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #7F8489;">To</span>
                    <span style="font-weight: 500; color: #1A1A1A; text-overflow: ellipsis; overflow: hidden; max-width: 170px;">${transaction.to}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #7F8489;">Transaction Fee</span>
                    <span style="font-weight: 500; color: #1A1A1A;">0.00025 ETH</span>
                </div>
            </div>
            
            <div style="background-color: #F8F8FA; border-radius: 12px; padding: 15px; margin-bottom: 20px; word-break: break-all;">
                <div style="color: #7F8489; margin-bottom: 8px;">Transaction Hash</div>
                <div style="font-weight: 500; color: #1A1A1A; font-family: monospace; font-size: 13px;">${transaction.hash}</div>
            </div>
            
            <div class="transfer-buttons">
                <div class="transfer-button button-cancel" id="close-transaction-details">Close</div>
                <div class="transfer-button button-confirm" onclick="window.open('${explorerLink}', '_blank')">View on Explorer</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener to close button
    document.getElementById('close-transaction-details').addEventListener('click', () => {
        document.body.removeChild(modal);
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
    
    // Generate a new transaction hash
    const txHash = generateTxHash();
    
    // Add to transaction history
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    transactionHistory.unshift({
        from: currentAccount,
        to: toAccount,
        token: 'USDT',
        amount: amount,
        date: dateStr,
        type: 'send',
        hash: txHash
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

// Show blockchain verification screen
function showBlockchainVerification() {
    // Create verification overlay
    const verificationOverlay = document.createElement('div');
    verificationOverlay.className = 'verification-overlay';
    verificationOverlay.style.display = 'flex';
    
    // Create verification content
    const verificationContent = document.createElement('div');
    verificationContent.className = 'verification-content';
    
    verificationContent.innerHTML = `
        <img src="https://img.icons8.com/ios-filled/100/0B65C6/blockchain-technology.png" alt="Blockchain" style="width: 70px; height: 70px; margin-bottom: 20px;">
        <div style="font-size: 22px; font-weight: 600; margin-bottom: 15px; color: #0B65C6;">Verifying Balance</div>
        <div style="font-size: 14px; margin-bottom: 25px; color: #7F8489; line-height: 1.5;">
            Please wait while we verify your balance on the blockchain network. This process may take a few moments.
        </div>
        <div style="width: 40px; height: 40px; border: 3px solid rgba(11, 101, 198, 0.1); border-top: 3px solid #0B65C6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 25px;"></div>
        <div style="background-color: rgba(11, 101, 198, 0.1); color: #0B65C6; font-weight: 500; padding: 8px 20px; border-radius: 20px; display: inline-block;">
            Secure Connection Established
        </div>
    `;
    
    verificationOverlay.appendChild(verificationContent);
    document.body.appendChild(verificationOverlay);
    
    // Simulate verification process
    setTimeout(() => {
        verificationContent.innerHTML = `
            <img src="https://img.icons8.com/ios-filled/100/00B05B/checkmark--v1.png" alt="Success" style="width: 70px; height: 70px; margin-bottom: 20px;">
            <div style="font-size: 22px; font-weight: 600; margin-bottom: 15px; color: #00B05B;">Balance Verified</div>
            <div style="font-size: 14px; margin-bottom: 25px; color: #7F8489; line-height: 1.5;">
                Your wallet balance has been successfully verified on the blockchain network.
            </div>
            <div style="margin-bottom: 25px;">
                <div style="font-size: 30px; font-weight: 600; color: #1A1A1A; margin-bottom: 5px;">
                    ${formatNumber(walletBalances[currentAccount].USDT)} USDT
                </div>
                <div style="color: #7F8489;">
                    ${formatCurrency(walletBalances[currentAccount].USDT)}
                </div>
            </div>
            <div style="background-color: rgba(0, 176, 91, 0.1); color: #00B05B; font-weight: 500; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-bottom: 15px;">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: text-bottom; margin-right: 5px;">
                    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#00B05B"/>
                    <path d="M5.6001 7.89098L7.2001 9.49098L10.4001 6.29098" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Verification Successful
            </div>
            <div id="close-verification" style="color: #0B65C6; font-weight: 500; cursor: pointer; margin-top: 20px;">Close</div>
        `;
        
        document.getElementById('close-verification').addEventListener('click', () => {
            document.body.removeChild(verificationOverlay);
        });
    }, 3000);
}

// Create transaction certificate
function createTransactionCertificate() {
    // Certificate data
    const certificateId = 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const verificationHash = generateTxHash();
    const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Create certificate content
    const certificate = document.createElement('div');
    certificate.className = 'certificate-viewer';
    certificate.style.display = 'flex';
    
    certificate.innerHTML = `
        <div class="certificate-header">
            <div class="back-button" id="cert-back-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.57 5.92999L3.5 12L9.57 18.07" stroke="#1A2024" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.5 12H3.67" stroke="#1A2024" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div>Balance Certificate</div>
            <div style="width: 24px;"></div>
        </div>
        
        <div class="certificate-content">
            <div class="certificate-title">USDT Balance Certificate</div>
            
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
                    <span class="certificate-label">Verification Date:</span>
                    <span class="certificate-value">${timestamp}</span>
                </div>
            </div>
            
            <div class="qr-display">
                <div class="qr-code">
                    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="160" height="160" fill="white"/>
                        <path d="M10 10H40V40H10V10ZM50 10H60V20H50V10ZM70 10H80V30H70V10ZM90 10H110V20H90V10ZM120 10H150V40H120V10ZM10 50H20V70H10V50ZM40 50H60V60H40V50ZM90 50H100V70H90V50ZM120 50H130V60H120V50ZM140 50H150V60H140V50ZM40 70H50V80H40V70ZM60 70H70V90H60V70ZM80 70H90V80H80V70ZM110 70H120V80H110V70ZM130 70H150V80H130V70ZM10 80H30V90H10V80ZM50 80H60V90H50V80ZM100 80H110V100H100V80ZM140 80H150V90H140V80ZM10 100H30V110H10V100ZM40 100H50V110H40V100ZM70 100H80V110H70V100ZM120 100H140V110H120V100ZM40 120H50V150H40V120ZM60 120H90V130H60V120ZM110 120H120V150H110V120ZM140 120H150V140H140V120ZM10 130H30V150H10V130ZM60 130H80V140H60V130ZM90 130H100V140H90V130ZM120 130H130V150H120V130Z" fill="black"/>
                    </svg>
                </div>
                <div class="qr-help">Scan to verify balance</div>
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
        </div>
    `;
    
    document.body.appendChild(certificate);
    
    // Add event listener to back button
    document.getElementById('cert-back-button').addEventListener('click', () => {
        document.body.removeChild(certificate);
    });
}
