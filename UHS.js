<!-- History Screen -->
<div id="history-screen" class="screen hidden">
    <div class="screen-header">
        <button class="back-button" aria-label="Go back">
            <i class="fas fa-arrow-left"></i>
        </button>
        <h2>History</h2>
        <div class="wallet-selector-small">
            <span class="wallet-name-small">Mnemonic 1</span>
            <i class="fas fa-chevron-down"></i>
        </div>
    </div>
    
    <!-- All Networks filter -->
    <div class="networks-filter">
        <div class="all-networks">
            All Networks <i class="fas fa-chevron-down"></i>
        </div>
    </div>
    
    <!-- Transaction tabs -->
    <div class="history-tabs">
        <div class="history-tab active" data-tab="all">All</div>
        <div class="history-tab" data-tab="sent">Sent</div>
        <div class="history-tab" data-tab="received">Received</div>
    </div>
    
    <!-- Transaction list -->
    <div class="history-transaction-list">
        <!-- Example transactions based on screenshot -->
        <!-- POL Transactions -->
        <div class="transaction-item transaction-receive" data-token="pol">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" alt="POL">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received POL</div>
                <div class="transaction-date">2025-03-13 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+1513.70279621439 POL</div>
                <div class="transaction-usd">$302.74</div>
            </div>
        </div>
        
        <div class="transaction-item transaction-receive" data-token="pol">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" alt="POL">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received POL</div>
                <div class="transaction-date">2025-03-16 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+4737.67095088464 POL</div>
                <div class="transaction-usd">$947.53</div>
            </div>
        </div>
        
        <div class="transaction-item transaction-receive" data-token="pol">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" alt="POL">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received POL</div>
                <div class="transaction-date">2025-03-21 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+1248.62625290095 POL</div>
                <div class="transaction-usd">$249.73</div>
            </div>
        </div>
        
        <!-- XRP Transactions -->
        <div class="transaction-item transaction-receive" data-token="xrp">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received XRP</div>
                <div class="transaction-date">2025-03-20 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+4465.67975270099 XRP</div>
                <div class="transaction-usd">$2,188.18</div>
            </div>
        </div>
        
        <div class="transaction-item transaction-receive" data-token="xrp">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received XRP</div>
                <div class="transaction-date">2025-03-24 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+7724.03778668871 XRP</div>
                <div class="transaction-usd">$3,784.78</div>
            </div>
        </div>
        
        <div class="transaction-item transaction-receive" data-token="xrp">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received XRP</div>
                <div class="transaction-date">2025-03-24 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+16817.4650162243 XRP</div>
                <div class="transaction-usd">$8,240.56</div>
            </div>
        </div>
        
        <div class="transaction-item transaction-receive" data-token="xrp">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received XRP</div>
                <div class="transaction-date">2025-03-26 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+9398.73462650421 XRP</div>
                <div class="transaction-usd">$4,605.38</div>
            </div>
        </div>
        
        <div class="transaction-item transaction-receive" data-token="xrp">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received XRP</div>
                <div class="transaction-date">2025-03-28 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+11246.4705729838 XRP</div>
                <div class="transaction-usd">$5,510.77</div>
            </div>
        </div>
        
        <!-- ETH Transaction -->
        <div class="transaction-item transaction-receive" data-token="eth">
            <div class="transaction-token-icon">
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">Received ETH</div>
                <div class="transaction-date">2025-03-04 01:45</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value positive">+215.39990496076 ETH</div>
                <div class="transaction-usd">$425,158.49</div>
            </div>
        </div>
        
        <!-- Explorer link button -->
        <div class="check-explorer">
            Cannot find your transaction? <a href="#" id="check-explorer-link">Check explorer</a>
        </div>
    </div>
    
    <!-- No transactions state (hidden by default) -->
    <div class="no-history hidden">
        <div class="no-history-icon">
            <img src="https://i.ibb.co/p6nYxhpw/Screenshot-20250327-203752-Trust-Wallet.jpg" alt="No transactions">
        </div>
        <p>No transactions found</p>
    </div>
</div>

<!-- Transaction Details Modal (Explorer) -->
<div id="transaction-details-modal" class="modal hidden">
    <div class="explorer-header">
        <button class="explorer-back-button">
            <i class="fas fa-arrow-left"></i>
        </button>
        <div class="explorer-title">Transaction Details</div>
        <button class="explorer-menu-button">
            <i class="fas fa-ellipsis-v"></i>
        </button>
    </div>
    
    <div class="explorer-content">
        <div class="explorer-section">
            <div class="explorer-section-header">
                <h3>Transaction Details</h3>
                <div class="transaction-status success">Success</div>
            </div>
            
            <div class="explorer-details">
                <div class="explorer-detail-row">
                    <div class="detail-label">Transaction Hash:</div>
                    <div class="detail-value hash">0x8a65d7c4f5f43c3b390f39d...</div>
                </div>
                <div class="explorer-detail-row">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value">
                        <span class="status-badge success">Success</span>
                        <span class="confirmation-count">285 Block Confirmations</span>
                    </div>
                </div>
                <div class="explorer-detail-row">
                    <div class="detail-label">Timestamp:</div>
                    <div class="detail-value" id="tx-timestamp">Mar-28-2025 01:45:15 PM +UTC</div>
                </div>
                <div class="explorer-detail-row">
                    <div class="detail-label">From:</div>
                    <div class="detail-value address" id="tx-from">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</div>
                </div>
                <div class="explorer-detail-row">
                    <div class="detail-label">To:</div>
                    <div class="detail-value address" id="tx-to">0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71</div>
                </div>
            </div>
        </div>
        
        <div class="explorer-section">
            <div class="explorer-section-header">
                <h3>Token Transfer</h3>
            </div>
            
            <div class="token-transfer">
                <div class="token-transfer-icon" id="tx-token-icon">
                    <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
                </div>
                <div class="token-transfer-details">
                    <div class="token-transfer-addresses">
                        <span class="address-short" id="tx-from-short">0x742d...44e</span>
                        <i class="fas fa-arrow-right"></i>
                        <span class="address-short" id="tx-to-short">0x9B3a...E71</span>
                    </div>
                    <div class="token-transfer-amount">
                        <span>For</span>
                        <span class="token-amount" id="tx-token-amount">11246.4705729838 XRP</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
/* History Screen Styles */
#history-screen {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    height: 100%;
}

#history-screen .screen-header {
    display: flex;
    align-items: center;
    padding: 16px;
    position: relative;
}

#history-screen .back-button {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1A2024;
    background: transparent;
    border: none;
}

#history-screen h2 {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #1A2024;
}

.wallet-selector-small {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background-color: #F5F5F5;
    border-radius: 16px;
    cursor: pointer;
}

.wallet-name-small {
    font-size: 14px;
    color: #1A2024;
    margin-right: 4px;
}

.networks-filter {
    padding: 8px 16px;
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
}

.all-networks {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 12px;
    color: #1A2024;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.all-networks i {
    margin-left: 4px;
    font-size: 10px;
    color: #8A939D;
}

.history-tabs {
    display: flex;
    background-color: #FFFFFF;
    border-bottom: 1px solid #F5F5F5;
}

.history-tab {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 14px;
    color: #8A939D;
    cursor: pointer;
    position: relative;
}

.history-tab.active {
    color: #3375BB;
    font-weight: 500;
}

.history-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #3375BB;
}

.history-transaction-list {
    flex: 1;
    overflow-y: auto;
    background-color: #FFFFFF;
    padding-bottom: 16px;
}

.transaction-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #F5F5F5;
    cursor: pointer;
}

.transaction-token-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(51, 117, 187, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
}

.transaction-token-icon img {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.transaction-info {
    flex: 1;
}

.transaction-type {
    font-size: 15px;
    font-weight: 500;
    color: #1A2024;
    margin-bottom: 4px;
}

.transaction-date {
    font-size: 13px;
    color: #8A939D;
}

.transaction-amount {
    text-align: right;
}

.transaction-value {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
}

.transaction-value.positive {
    color: #3375BB;
}

.transaction-value.negative {
    color: #EB5757;
}

.transaction-usd {
    font-size: 13px;
    color: #8A939D;
}

.check-explorer {
    text-align: center;
    padding: 24px 16px;
    font-size: 14px;
    color: #8A939D;
}

.check-explorer a {
    color: #3375BB;
    text-decoration: none;
}

.no-history {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 24px;
    text-align: center;
}

.no-history-icon {
    width: 96px;
    height: 96px;
    margin-bottom: 16px;
}

.no-history-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.5;
}

.no-history p {
    font-size: 16px;
    color: #8A939D;
}

/* Transaction Details Modal (Explorer) */
#transaction-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.explorer-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #3375BB;
    color: #FFFFFF;
}

.explorer-back-button {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: #FFFFFF;
    border: none;
    margin-right: 16px;
}

.explorer-title {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
}

.explorer-menu-button {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    color: #FFFFFF;
    border: none;
}

.explorer-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.explorer-section {
    background-color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    overflow: hidden;
}

.explorer-section-header {
    padding: 16px;
    border-bottom: 1px solid #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.explorer-section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1A2024;
}

.transaction-status {
    font-size: 14px;
    font-weight: 500;
}

.transaction-status.success {
    color: #05C46B;
}

.explorer-details {
    padding: 16px;
}

.explorer-detail-row {
    display: flex;
    margin-bottom: 12px;
    font-size: 14px;
}

.explorer-detail-row:last-child {
    margin-bottom: 0;
}

.detail-label {
    width: 140px;
    color: #8A939D;
    flex-shrink: 0;
}

.detail-value {
    flex: 1;
    color: #1A2024;
    word-break: break-all;
}

.detail-value.hash,
.detail-value.address {
    color: #3375BB;
}

.status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    margin-right: 8px;
}

.status-badge.success {
    background-color: rgba(5, 196, 107, 0.1);
    color: #05C46B;
}

.confirmation-count {
    color: #8A939D;
    font-size: 13px;
}

.token-transfer {
    padding: 16px;
    display: flex;
    align-items: center;
}

.token-transfer-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(51, 117, 187, 0.1);
}

.token-transfer-icon img {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.token-transfer-details {
    flex: 1;
}

.token-transfer-addresses {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    font-size: 13px;
}

.address-short {
    color: #3375BB;
}

.token-transfer-addresses i {
    margin: 0 8px;
    font-size: 10px;
    color: #8A939D;
}

.token-transfer-amount {
    font-size: 13px;
    color: #8A939D;
}

.token-amount {
    color: #1A2024;
    font-weight: 500;
    margin-left: 4px;
}
</style>

<script>
// Script to make the History Screen functional
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const historyTabs = document.querySelectorAll('.history-tab');
    historyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            historyTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the tab type (all, sent, received)
            const tabType = this.getAttribute('data-tab');
            
            // Filter transactions based on tab type
            filterTransactions(tabType);
        });
    });
    
    // Function to filter transactions based on tab
    function filterTransactions(type) {
        const allTransactions = document.querySelectorAll('.transaction-item');
        const noHistory = document.querySelector('.no-history');
        let visibleCount = 0;
        
        allTransactions.forEach(tx => {
            if (type === 'all') {
                tx.style.display = 'flex';
                visibleCount++;
            } else if (type === 'sent' && tx.classList.contains('transaction-send')) {
                tx.style.display = 'flex';
                visibleCount++;
            } else if (type === 'received' && tx.classList.contains('transaction-receive')) {
                tx.style.display = 'flex';
                visibleCount++;
            } else {
                tx.style.display = 'none';
            }
        });
        
        // Show "No transactions" message if no transactions match the filter
        if (noHistory) {
            if (visibleCount === 0) {
                noHistory.classList.remove('hidden');
            } else {
                noHistory.classList.add('hidden');
            }
        }
    }
    
    // Open transaction details when clicking on a transaction
    const transactionItems = document.querySelectorAll('.transaction-item');
    const transactionDetailsModal = document.getElementById('transaction-details-modal');
    
    transactionItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get transaction details from the clicked item
            const tokenType = this.getAttribute('data-token');
            const txType = this.classList.contains('transaction-receive') ? 'Received' : 'Sent';
            const amount = this.querySelector('.transaction-value').textContent;
            const date = this.querySelector('.transaction-date').textContent;
            const iconSrc = this.querySelector('.transaction-token-icon img').src;
            
            // Update transaction details modal
            if (transactionDetailsModal) {
                // Update token icon
                const txTokenIcon = document.getElementById('tx-token-icon');
                if (txTokenIcon) {
                    txTokenIcon.querySelector('img').src = iconSrc;
                }
                
                // Update token amount
                const txTokenAmount = document.getElementById('tx-token-amount');
                if (txTokenAmount) {
                    txTokenAmount.textContent = amount.replace('+', '').replace('-', '');
                }
                
                // Update timestamp
                const txTimestamp = document.getElementById('tx-timestamp');
                if (txTimestamp && date) {
                    // This would normally convert the date format, but we'll keep it simple
                    txTimestamp.textContent = date;
                }
                
                // Show the modal
                transactionDetailsModal.classList.remove('hidden');
            }
        });
    });
    
    // Close transaction details modal
    const backButton = document.querySelector('.explorer-back-button');
    if (backButton && transactionDetailsModal) {
        backButton.addEventListener('click', function() {
            transactionDetailsModal.classList.add('hidden');
        });
    }
    
    // Open explorer from the "Check explorer" link
    const checkExplorerLink = document.getElementById('check-explorer-link');
    if (checkExplorerLink && transactionDetailsModal) {
        checkExplorerLink.addEventListener('click', function(e) {
            e.preventDefault();
            transactionDetailsModal.classList.remove('hidden');
        });
    }
    
    // Wallet selector functionality
    const walletSelector = document.querySelector('.wallet-selector-small');
    if (walletSelector) {
        walletSelector.addEventListener('click', function() {
            // In a real app, this would show a wallet selection dropdown
            // For now, just cycle through wallet names
            const walletName = this.querySelector('.wallet-name-small');
            if (!walletName) return;
            
            if (walletName.textContent === 'Mnemonic 1') {
                walletName.textContent = 'Mnemonic 2';
            } else if (walletName.textContent === 'Mnemonic 2') {
                walletName.textContent = 'Mnemonic 3';
            } else {
                walletName.textContent = 'Mnemonic 1';
            }
            
            // This would normally update the transactions list based on the selected wallet
            // For demonstration, we'll just simulate this by re-filtering the current tab
            const activeTab = document.querySelector('.history-tab.active');
            if (activeTab) {
                filterTransactions(activeTab.getAttribute('data-tab'));
            }
        });
    }
});
