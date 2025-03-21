// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const passcodeScreen = document.getElementById('passcode-screen');
const walletScreen = document.getElementById('wallet-screen');
const tokenDetailScreen = document.getElementById('token-detail-screen');
const loadingOverlay = document.querySelector('.loading-overlay');
const transferModal = document.getElementById('transfer-modal');

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

// Global Variables
let passcode = '';
const correctPasscode = '123456'; // For demo purposes
let currentAccount = 'main'; // main or second
let currentWalletAddress = '0x1234...6789'; // Your wallet
let alternateWalletAddress = '';

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
