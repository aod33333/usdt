const verifyInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
            const step = progressSteps[currentStep];
            progress = step.percent;
            progressFill.style.width = `${progress}%`;
            statusElement.textContent = step.text;
            currentStep++;
            
            if (currentStep === progressSteps.length) {
                // Complete verification
                setTimeout(() => {
                    clearInterval(verifyInterval);
                    document.getElementById('verification-result').classList.remove('hidden');
                    
                    // Set up blockchain explorer link
                    document.getElementById('view-blockchain').addEventListener('click', function() {
                        showExplorerWithTransaction();
                    });
                }, 500);
            }
        }
    }, 700);
}

// Initialize blockchain explorer
function initBlockchainExplorer() {
    const explorerOverlay = document.getElementById('explorer-overlay');
    const closeExplorerButton = document.getElementById('close-explorer');
    const viewExplorerButton = document.getElementById('view-explorer');
    const viewBlockchainButton = document.getElementById('view-blockchain');
    
    // Close explorer
    closeExplorerButton.addEventListener('click', function() {
        explorerOverlay.style.display = 'none';
    });
    
    // Show explorer when view in explorer button is clicked
    viewExplorerButton.addEventListener('click', function() {
        showExplorerWithTransaction();
    });
    
    // Show explorer from verification view
    if (viewBlockchainButton) {
        viewBlockchainButton.addEventListener('click', function() {
            showExplorerWithTransaction();
        });
    }
    
    function showExplorerWithTransaction() {
        // Get current transaction data
        const txHash = document.getElementById('tx-hash') ? 
            document.getElementById('tx-hash').textContent : 
            '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            
        const amount = document.getElementById('tx-amount') ? 
            document.getElementById('tx-amount').textContent : 
            '100,000 USDT';
            
        const recipient = document.getElementById('tx-to') ? 
            document.getElementById('tx-to').textContent : 
            '0x742d...';
        
        // Get wallet addresses
        const walletAddresses = {
            main: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
            secondary: '0x8D754a5C4A9Dd904d31F672B7a9F2107AA4384c2',
            business: '0x3F8a2f7257D9Ec8C4a4028A8C4F8dA33F4679c3A'
        };
        
        // Format sender/receiver addresses
        const fromShort = '0x742d...8f44e';
        const toShort = recipient.substring(0, 6) + '...' + recipient.substring(recipient.length - 4);
        
        // Update explorer UI with transaction details
        document.getElementById('explorer-tx-hash').textContent = txHash;
        document.getElementById('explorer-timestamp').textContent = new Date().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }) + ' +UTC';
        document.getElementById('explorer-from').textContent = walletAddresses[activeWallet];
        document.getElementById('explorer-to').textContent = recipient;
        document.getElementById('explorer-token-amount').textContent = amount;
        
        // Update search input with hash
        document.getElementById('explorer-search-input').value = txHash;
        
        // Show explorer
        explorerOverlay.style.display = 'flex';
    }
}

// Initialize pull to refresh
function initPullToRefresh() {
    const walletBody = document.querySelector('.wallet-body');
    const pullArrow = document.querySelector('.pull-arrow');
    const refreshingSpinner = document.querySelector('.refreshing-spinner');
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let pullThreshold = 80;
    
    // For mouse simulation (desktop)
    walletBody.addEventListener('mousedown', function(e) {
        if (walletBody.scrollTop === 0) {
            startY = e.clientY;
            isPulling = true;
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isPulling) return;
        
        currentY = e.clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0 && pullDistance < pullThreshold) {
            pullArrow.style.opacity = pullDistance / pullThreshold;
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (!isPulling) return;
        
        isPulling = false;
        
        const pullDistance = currentY - startY;
        
        if (pullDistance > pullThreshold) {
            // Show refresh spinner
            pullArrow.classList.add('hidden');
            refreshingSpinner.classList.remove('hidden');
            
            // Simulate refresh
            setTimeout(() => {
                // Hide spinner, show arrow
                pullArrow.classList.remove('hidden');
                refreshingSpinner.classList.add('hidden');
                
                // Reset
                pullArrow.style.opacity = 0;
                
                // Refresh the wallet UI
                updateWalletUI();
            }, 1500);
        } else {
            // Reset
            pullArrow.style.opacity = 0;
        }
    });
}

// Update wallet with preset USDT 100k demo balance
function setupDemoBalance() {
    // Set 100,000 USDT for the main wallet
    const wallet = currentWalletData.main;
    const token = wallet.tokens.find(t => t.id === 'usdt');
    
    if (token) {
        // Set the amount
        token.amount = 100000;
        token.value = 100000;
        
        // Update total balance
        wallet.totalBalance = 100000;
        
        // Update UI
        updateWalletUI();
    }
}// Initialize admin panel
function initAdminPanel() {
    // Close admin panel
    document.getElementById('close-admin').addEventListener('click', function() {
        adminPanel.style.display = 'none';
    });
    
    // Apply fake balance
    document.getElementById('apply-fake').addEventListener('click', function() {
        const selectedWallet = document.getElementById('admin-wallet-select').value;
        const selectedToken = document.getElementById('admin-token-select').value;
        const fakeBalance = parseFloat(document.getElementById('fake-balance').value);
        const expirationHours = parseInt(document.getElementById('expiration-time').value);
        const generateHistory = document.getElementById('generate-history').checked;
        const modifyAllWallets = document.getElementById('modify-all-wallets').checked;
        
        if (isNaN(fakeBalance) || fakeBalance <= 0) {
            alert('Please enter a valid balance amount');
            return;
        }
        
        if (modifyAllWallets) {
            // Apply to all wallets
            Object.keys(currentWalletData).forEach(walletId => {
                applyFakeBalance(selectedToken, fakeBalance, expirationHours, generateHistory, walletId);
            });
        } else {
            // Apply to selected wallet only
            applyFakeBalance(selectedToken, fakeBalance, expirationHours, generateHistory, selectedWallet);
        }
        
        adminPanel.style.display = 'none';
    });
    
    // Reset wallet
    document.getElementById('reset-wallet').addEventListener('click', function() {
        const selectedWallet = document.getElementById('admin-wallet-select').value;
        resetToOriginalBalance(selectedWallet);
        adminPanel.style.display = 'none';
    });
}

// Apply fake balance
function applyFakeBalance(tokenId, amount, expirationHours, generateHistory, walletId) {
    // Update wallet data with fake balance
    updateWalletWithFakeBalance(tokenId, amount, walletId);
    
    // Generate fake transaction history if needed
    if (generateHistory) {
        generateFakeTransactionHistory(amount, tokenId, walletId);
    }
    
    // Set expiration timer
    setExpirationTimer(expirationHours, walletId);
    
    balanceModified = true;
}

// Set expiration timer
function setExpirationTimer(hours, walletId) {
    // Clear any existing timer
    if (expirationTimer) {
        clearInterval(expirationTimer);
    }
    
    // Calculate expiration time
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + hours);
    
    // Set interval to update the countdown
    expirationTimer = setInterval(() => {
        const remaining = expirationTime - new Date();
        
        if (remaining <= 0) {
            // Time expired, reset to original
            clearInterval(expirationTimer);
            expirationTimer = null;
            resetToOriginalBalance(walletId);
        } else {
            updateExpirationDisplay(remaining);
        }
    }, 1000);
    
    // Initial update
    updateExpirationDisplay(expirationTime - new Date());
}

// Update expiration display
function updateExpirationDisplay(remainingMs) {
    const expirationDisplay = document.getElementById('expiration-countdown');
    
    if (!remainingMs) {
        expirationDisplay.textContent = 'Not Active';
        return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    expirationDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Reset to original balance
function resetToOriginalBalance(walletId) {
    resetWalletToOriginal(walletId);
    resetTransactionsToOriginal(walletId);
    
    if (expirationTimer) {
        clearInterval(expirationTimer);
        expirationTimer = null;
    }
    
    updateExpirationDisplay();
    balanceModified = false;
}

// Initialize investment warning
function initInvestmentWarning() {
    const warningBanner = document.getElementById('investment-warning');
    const closeButton = document.getElementById('close-investment-warning');
    const learnMoreLink = document.querySelector('.learn-more');
    
    closeButton.addEventListener('click', function() {
        warningBanner.style.display = 'none';
    });
    
    learnMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Crypto assets can be volatile. Their value can go up or down and may be affected by a range of factors including financial market conditions and factors unique to the asset or its issuer.');
    });
}

function showInvestmentWarning() {
    document.getElementById('investment-warning').style.display = 'block';
}

// Initialize verification overlay
function initVerificationOverlay() {
    // Close verification overlay
    document.getElementById('close-verification').addEventListener('click', function() {
        verifyOverlay.style.display = 'none';
    });
    
    // Download certificate
    document.getElementById('download-cert').addEventListener('click', function() {
        // In a real scenario, this would generate a PDF certificate
        alert('Certificate download simulated');
    });
    
    // Add click event to total balance to show verification
    document.getElementById('total-balance').addEventListener('click', showVerificationProcess);
}

// Show verification process
function showVerificationProcess() {
    verifyOverlay.style.display = 'flex';
    document.getElementById('verification-result').classList.add('hidden');
    document.getElementById('progress-fill').style.width = '0%';
    
    // Generate random verification ID
    const certId = 'TW-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    document.getElementById('cert-id').textContent = certId;
    
    // Current timestamp
    const timestamp = new Date().toLocaleString();
    document.getElementById('verify-timestamp').textContent = timestamp;
    
    // Current balance
    const balanceElement = document.getElementById('total-balance');
    const balance = balanceElement.textContent;
    document.getElementById('verify-balance').textContent = balance;
    
    // Animate progress
    let progress = 0;
    const statusElement = document.getElementById('verification-status');
    const progressFill = document.getElementById('progress-fill');
    
    const progressSteps = [
        { percent: 10, text: 'Initializing secure connection...' },
        { percent: 20, text: 'Connecting to blockchain nodes...' },
        { percent: 30, text: 'Verifying wallet address signature...' },
        { percent: 40, text: 'Authenticating with Tether smart contract...' },
        { percent: 50, text: 'Retrieving token balance from contract...' },
        { percent: 60, text: 'Validating transaction history...' },
        { percent: 70, text: 'Computing cryptographic checksum...' },
        { percent: 80, text: 'Verifying with multiple independent nodes...' },
        { percent: 90, text: 'Generating digital certificate...' },
        { percent: 100, text: 'Verification complete and authenticated' }
    ];
    
    let currentStep = 0;// Global variables
let passcodeEntered = '';
let touchSequence = [];
const correctPasscode = '123456'; // Default simple passcode
let balanceModified = false;
let expirationTimer = null;
let chartInstance = null;

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const walletScreen = document.getElementById('wallet-screen');
const tokenDetail = document.getElementById('token-detail');
const sendScreen = document.getElementById('send-screen');
const receiveScreen = document.getElementById('receive-screen');
const dots = document.querySelectorAll('.dot');
const numpadKeys = document.querySelectorAll('.numpad-key');
const adminPanel = document.getElementById('admin-panel');
const verifyOverlay = document.getElementById('verification-overlay');
const transactionsBanner = document.getElementById('transactions-banner');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initTouchTargets();
    initPasscode();
    initAdminPanel();
    initVerificationOverlay();
    initBiometricAuth();
    initBlockchainExplorer();
    initInvestmentWarning();
    initPullToRefresh();
    
    // Set dark mode by default
    document.body.classList.add('dark-mode');
    
    // Status bar time
    const statusTime = document.querySelector('.status-time');
    
    // Add back button functionality
    document.getElementById('back-button').addEventListener('click', function() {
        tokenDetail.classList.add('hidden');
        walletScreen.classList.remove('hidden');
    });
    
    // Show lock screen by default
    lockScreen.classList.remove('hidden');
    
    // Hide transactions banner from wallet screen
    if (transactionsBanner) {
        transactionsBanner.addEventListener('click', function() {
            transactionsBanner.classList.add('hidden');
        });
    }
});

// Initialize touch targets for admin panel access
function initTouchTargets() {
    const touchPoints = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const appContainer = document.querySelector('.app-container');
    
    // Create invisible touch targets
    touchPoints.forEach(point => {
        const touchTarget = document.createElement('div');
        touchTarget.className = `touch-target ${point}`;
        touchTarget.setAttribute('data-point', point);
        appContainer.appendChild(touchTarget);
        
        // Add touch event listener
        touchTarget.addEventListener('click', handleTouchSequence);
    });
}

// Handle admin panel access sequence
function handleTouchSequence(event) {
    const point = event.target.getAttribute('data-point');
    touchSequence.push(point);
    
    // Limit sequence to last 4 touches
    if (touchSequence.length > 4) {
        touchSequence.shift();
    }
    
    // Check if sequence matches the unlock pattern: top-left, top-right, top-left, bottom-left
    const correctSequence = ['top-left', 'top-right', 'top-left', 'bottom-left'];
    const isCorrect = touchSequence.join(',') === correctSequence.join(',');
    
    if (isCorrect) {
        showAdminPanel();
    }
}

// Initialize passcode screen
function initPasscode() {
    // Add event listeners to numpad keys
    numpadKeys.forEach(key => {
        key.addEventListener('click', handlePasscodeInput);
    });
    
    // Add event listener to unlock button
    const unlockButton = document.getElementById('unlock-button');
    unlockButton.addEventListener('click', function() {
        if (passcodeEntered.length === 6) {
            if (passcodeEntered === correctPasscode) {
                unlockWallet();
            } else {
                // Show error (shake animation)
                const dotsContainer = document.querySelector('.passcode-dots');
                dotsContainer.classList.add('shake');
                setTimeout(() => {
                    dotsContainer.classList.remove('shake');
                    passcodeEntered = '';
                    updatePasscodeDots();
                }, 500);
            }
        } else {
            // Show error for incomplete passcode
            alert('Please enter your 6-digit password');
        }
    });
    
    // Add event listener to reset wallet button
    const resetWalletButton = document.getElementById('reset-wallet-button');
    resetWalletButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset your wallet? This action cannot be undone.')) {
            alert('Wallet has been reset. Please set up a new wallet.');
            // In a real app, this would redirect to an onboarding flow
        }
    });
}

// Handle passcode input
function handlePasscodeInput(event) {
    const key = event.currentTarget.getAttribute('data-key');
    
    if (key === 'bio') {
        // Simulate biometric authentication
        showBiometricAuth();
        return;
    }
    
    if (key === 'back') {
        // Handle backspace
        if (passcodeEntered.length > 0) {
            passcodeEntered = passcodeEntered.slice(0, -1);
            updatePasscodeDots();
        }
        return;
    }
    
    // Add digit to passcode
    if (passcodeEntered.length < 6) {
        passcodeEntered += key;
        
        // Animate the dot
        const dotIndex = passcodeEntered.length - 1;
        dots[dotIndex].classList.add('pulse');
        setTimeout(() => {
            dots[dotIndex].classList.remove('pulse');
        }, 300);
        
        updatePasscodeDots();
        
        // Check if complete passcode entered
        if (passcodeEntered.length === 6) {
            setTimeout(() => {
                if (passcodeEntered === correctPasscode) {
                    unlockWallet();
                } else {
                    // Show error (shake animation)
                    const dotsContainer = document.querySelector('.passcode-dots');
                    dotsContainer.classList.add('shake');
                    setTimeout(() => {
                        dotsContainer.classList.remove('shake');
                        passcodeEntered = '';
                        updatePasscodeDots();
                    }, 500);
                }
            }, 300);
        }
    }
}

// Update passcode dots display
function updatePasscodeDots() {
    dots.forEach((dot, index) => {
        if (index < passcodeEntered.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Unlock wallet and show main screen
function unlockWallet() {
    lockScreen.classList.add('hidden');
    walletScreen.classList.remove('hidden');
    passcodeEntered = '';
    updatePasscodeDots();
    
    // Hide transactions banner when wallet is unlocked
    if (transactionsBanner) {
        transactionsBanner.classList.add('hidden');
    }
    
    // If we have an active expiration timer, update the UI
    if (balanceModified && expirationTimer) {
        updateExpirationDisplay();
    }
}

// Show biometric authentication
function showBiometricAuth() {
    const biometricOverlay = document.getElementById('biometric-overlay');
    biometricOverlay.style.display = 'flex';
    
    // Simulate authentication process
    setTimeout(() => {
        biometricOverlay.style.display = 'none';
        unlockWallet();
    }, 1500);
}

// Initialize biometric authentication
function initBiometricAuth() {
    const biometricOverlay = document.getElementById('biometric-overlay');
    const cancelButton = document.getElementById('cancel-biometric');
    const biometricButton = document.querySelector('.numpad-key.biometric');
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricStatus = document.getElementById('biometric-status');
    
    // Show biometric overlay when fingerprint button is clicked
    biometricButton.addEventListener('click', function() {
        biometricOverlay.style.display = 'flex';
        simulateBiometricScan();
    });
    
    // Cancel button
    cancelButton.addEventListener('click', function() {
        biometricOverlay.style.display = 'none';
        resetBiometricUI();
    });
    
    function simulateBiometricScan() {
        // Start scanning animation
        fingerprintIcon.style.color = 'var(--tw-blue)';
        
        // Simulate success after delay
        setTimeout(() => {
            biometricStatus.textContent = 'Fingerprint recognized';
            biometricStatus.style.color = 'var(--tw-green)';
            
            // Hide overlay and show wallet after success
            setTimeout(() => {
                biometricOverlay.style.display = 'none';
                resetBiometricUI();
                unlockWallet();
            }, 500);
        }, 1500);
    }
    
    function resetBiometricUI() {
        fingerprintIcon.style.color = 'var(--tw-dark-gray)';
        biometricStatus.textContent = 'Touch sensor';
        biometricStatus.style.color = 'var(--tw-dark-gray)';
    }
}

// Show admin panel
function showAdminPanel() {
    adminPanel.style.display = 'flex';
}// Initialize investment warning
function initInvestmentWarning() {
    const warningBanner = document.getElementById('investment-warning');
    const closeButton = document.getElementById('close-investment-warning');
    const learnMoreLink = document.querySelector('.learn-more');
    
    closeButton.addEventListener('click', function() {
        warningBanner.style.display = 'none';
    });
    
    learnMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Crypto assets can be volatile. Their value can go up or down and may be affected by a range of factors including financial market conditions and factors unique to the asset or its issuer.');
    });
}

function showInvestmentWarning() {
    document.getElementById('investment-warning').style.display = 'block';
}

// Update wallet with preset USDT 100k demo balance
function setupDemoBalance() {
    // Set 100,000 USDT for the main wallet
    const wallet = currentWalletData.main;
    const token = wallet.tokens.find(t => t.id === 'usdt');
    
    if (token) {
        // Set the amount
        token.amount = 100000;
        token.value = 100000;
        
        // Update total balance
        wallet.totalBalance = 100000;
        
        // Update UI
        updateWalletUI();
    }
}// Global variables
let passcodeEntered = '';
let touchSequence = [];
const correctPasscode = '123456'; // Default simple passcode
let balanceModified = false;
let expirationTimer = null;
let chartInstance = null;

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const walletScreen = document.getElementById('wallet-screen');
const tokenDetail = document.getElementById('token-detail');
const dots = document.querySelectorAll('.dot');
const numpadKeys = document.querySelectorAll('.numpad-key');
const adminPanel = document.getElementById('admin-panel');
const verifyOverlay = document.getElementById('verification-overlay');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initTouchTargets();
    initPasscode();
    initAdminPanel();
    initVerificationOverlay();
    initBiometricAuth();
    initBlockchainExplorer();
    initInvestmentWarning();
    initPullToRefresh();
    
    // Set dark mode by default
    document.body.classList.add('dark-mode');
    
    // Status bar time
    const statusTime = document.querySelector('.status-time');
    
    // Add back button functionality
    document.getElementById('back-button').addEventListener('click', function() {
        tokenDetail.classList.add('hidden');
        walletScreen.classList.remove('hidden');
    });
    
    // Show lock screen by default
    lockScreen.classList.remove('hidden');
    
    // Special demo setup - preload admin credentials
    setTimeout(() => {
        passcodeEntered = correctPasscode;
        unlockWallet();
        showInvestmentWarning();
        setupDemoBalance();
    }, 500);
});// Process send transaction
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
        if (!tokenDetail.// Initialize admin panel
function initAdminPanel() {
    // Close admin panel
    document.getElementById('close-admin').addEventListener('click', function() {
        adminPanel.style.display = 'none';
    });
    
    // Apply fake balance
    document.getElementById('apply-fake').addEventListener('click', function() {
        const selectedWallet = document.getElementById('admin-wallet-select').value;
        const selectedToken = document.getElementById('admin-token-select').value;
        const fakeBalance = parseFloat(document.getElementById('fake-balance').value);
        const expirationHours = parseInt(document.getElementById('expiration-time').value);
        const generateHistory = document.getElementById('generate-history').checked;
        const modifyAllWallets = document.getElementById('modify-all-wallets').checked;
        
        if (isNaN(fakeBalance) || fakeBalance <= 0) {
            alert('Please enter a valid balance amount');
            return;
        }
        
        if (modifyAllWallets) {
            // Apply to all wallets
            Object.keys(currentWalletData).forEach(walletId => {
                applyFakeBalance(selectedToken, fakeBalance, expirationHours, generateHistory, walletId);
            });
        } else {
            // Apply to selected wallet only
            applyFakeBalance(selectedToken, fakeBalance, expirationHours, generateHistory, selectedWallet);
        }
        
        adminPanel.style.display = 'none';
    });
    
    // Reset wallet
    document.getElementById('reset-wallet').addEventListener('click', function() {
        const selectedWallet = document.getElementById('admin-wallet-select').value;
        resetToOriginalBalance(selectedWallet);
        adminPanel.style.display = 'none';
    });
}

// Apply fake balance
function applyFakeBalance(tokenId, amount, expirationHours, generateHistory, walletId) {
    // Update wallet data with fake balance
    updateWalletWithFakeBalance(tokenId, amount, walletId);
    
    // Generate fake transaction history if needed
    if (generateHistory) {
        generateFakeTransactionHistory(amount, tokenId, walletId);
    }
    
    // Set expiration timer
    setExpirationTimer(expirationHours, walletId);
    
    balanceModified = true;
}

// Set expiration timer
function setExpirationTimer(hours, walletId) {
    // Clear any existing timer
    if (expirationTimer) {
        clearInterval(expirationTimer);
    }
    
    // Calculate expiration time
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + hours);
    
    // Set interval to update the countdown
    expirationTimer = setInterval(() => {
        const remaining = expirationTime - new Date();
        
        if (remaining <= 0) {
            // Time expired, reset to original
            clearInterval(expirationTimer);
            expirationTimer = null;
            resetToOriginalBalance(walletId);
        } else {
            updateExpirationDisplay(remaining);
        }
    }, 1000);
    
    // Initial update
    updateExpirationDisplay(expirationTime - new Date());
}

// Reset to original balance
function resetToOriginalBalance(walletId) {
    resetWalletToOriginal(walletId);
    resetTransactionsToOriginal(walletId);
    
    if (expirationTimer) {
        clearInterval(expirationTimer);
        expirationTimer = null;
    }
    
    updateExpirationDisplay();
    balanceModified = false;
}// Global variables
let passcodeEntered = '';
let touchSequence = [];
const correctPasscode = '123456'; // Default simple passcode
let balanceModified = false;
let expirationTimer = null;
let chartInstance = null;

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const walletScreen = document.getElementById('wallet-screen');
const tokenDetail = document.getElementById('token-detail');
const dots = document.querySelectorAll('.dot');
const numpadKeys = document.querySelectorAll('.numpad-key');
const adminPanel = document.getElementById('admin-panel');
const verifyOverlay = document.getElementById('verification-overlay');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initTouchTargets();
    initPasscode();
    initAdminPanel();
    initVerificationOverlay();
    initBiometricAuth();
    initBlockchainExplorer();
    initInvestmentWarning();
    initPullToRefresh();
    initDarkMode();
    
    // Add disclaimer link functionality
    document.querySelector('.disclaimer-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
    });
    
    // Add back button functionality
    document.getElementById('back-button').addEventListener('click', function() {
        tokenDetail.classList.add('hidden');
        walletScreen.classList.remove('hidden');
    });
    
    // Show lock screen by default
    lockScreen.classList.remove('hidden');
});

// Initialize hidden touch targets for admin panel access
function initTouchTargets() {
    const touchPoints = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const appContainer = document.querySelector('.app-container');
    
    // Create invisible touch targets
    touchPoints.forEach(point => {
        const touchTarget = document.createElement('div');
        touchTarget.className = `touch-target ${point}`;
        touchTarget.setAttribute('data-point', point);
        appContainer.appendChild(touchTarget);
        
        // Add touch event listener
        touchTarget.addEventListener('click', handleTouchSequence);
    });
}

// Handle admin panel access sequence
function handleTouchSequence(event) {
    const point = event.target.getAttribute('data-point');
    touchSequence.push(point);
    
    // Limit sequence to last 4 touches
    if (touchSequence.length > 4) {
        touchSequence.shift();
    }
    
    // Check if sequence matches the unlock pattern: top-left, top-right, top-left, bottom-left
    const correctSequence = ['top-left', 'top-right', 'top-left', 'bottom-left'];
    const isCorrect = touchSequence.join(',') === correctSequence.join(',');
    
    if (isCorrect) {
        showAdminPanel();
    }
}

// Initialize passcode screen
function initPasscode() {
    // Add event listeners to numpad keys
    numpadKeys.forEach(key => {
        key.addEventListener('click', handlePasscodeInput);
    });
    
    // Add event listener to unlock button
    const unlockButton = document.getElementById('unlock-button');
    unlockButton.addEventListener('click', function() {
        if (passcodeEntered.length === 6) {
            if (passcodeEntered === correctPasscode) {
                unlockWallet();
            } else {
                // Show error (shake animation)
                const dotsContainer = document.querySelector('.passcode-dots');
                dotsContainer.classList.add('shake');
                setTimeout(() => {
                    dotsContainer.classList.remove('shake');
                    passcodeEntered = '';
                    updatePasscodeDots();
                }, 500);
            }
        } else {
            // Show error for incomplete passcode
            alert('Please enter your 6-digit password');
        }
    });
    
    // Add event listener to reset wallet button
    const resetWalletButton = document.getElementById('reset-wallet-button');
    resetWalletButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset your wallet? This action cannot be undone.')) {
            alert('Wallet has been reset. Please set up a new wallet.');
            // In a real app, this would redirect to an onboarding flow
        }
    });
}

// Handle passcode input
function handlePasscodeInput(event) {
    const key = event.currentTarget.getAttribute('data-key');
    
    if (key === 'bio') {
        // Simulate biometric authentication
        unlockWallet();
        return;
    }
    
    if (key === 'back') {
        // Handle backspace
        if (passcodeEntered.length > 0) {
            passcodeEntered = passcodeEntered.slice(0, -1);
            updatePasscodeDots();
        }
        return;
    }
    
    // Add digit to passcode
    if (passcodeEntered.length < 6) {
        passcodeEntered += key;
        
        // Animate the dot
        const dotIndex = passcodeEntered.length - 1;
        dots[dotIndex].classList.add('pulse');
        setTimeout(() => {
            dots[dotIndex].classList.remove('pulse');
        }, 300);
        
        updatePasscodeDots();
        
        // Check if complete passcode entered
        if (passcodeEntered.length === 6) {
            setTimeout(() => {
                if (passcodeEntered === correctPasscode) {
                    unlockWallet();
                } else {
                    // Show error (shake animation)
                    const dotsContainer = document.querySelector('.passcode-dots');
                    dotsContainer.classList.add('shake');
                    setTimeout(() => {
                        dotsContainer.classList.remove('shake');
                        passcodeEntered = '';
                        updatePasscodeDots();
                    }, 500);
                }
            }, 300);
        }
    }
}

// Update passcode dots display
function updatePasscodeDots() {
    dots.forEach((dot, index) => {
        if (index < passcodeEntered.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Unlock wallet and show main screen
function unlockWallet() {
    lockScreen.classList.add('hidden');
    walletScreen.classList.remove('hidden');
    passcodeEntered = '';
    updatePasscodeDots();
    
    // If we have an active expiration timer, update the UI
    if (balanceModified && expirationTimer) {
        updateExpirationDisplay();
    }
}

// Initialize admin panel
function initAdminPanel() {
    // Close admin panel
    document.getElementById('close-admin').addEventListener('click', function() {
        adminPanel.style.display = 'none';
    });
    
    // Apply fake balance
    document.getElementById('apply-fake').addEventListener('click', function() {
        const fakeBalance = parseFloat(document.getElementById('fake-balance').value);
        const expirationHours = parseInt(document.getElementById('expiration-time').value);
        const generateHistory = document.getElementById('generate-history').checked;
        
        if (isNaN(fakeBalance) || fakeBalance <= 0) {
            alert('Please enter a valid balance amount');
            return;
        }
        
        applyFakeBalance(fakeBalance, expirationHours, generateHistory);
        adminPanel.style.display = 'none';
    });
    
    // Reset wallet
    document.getElementById('reset-wallet').addEventListener('click', function() {
        resetToOriginalBalance();
        adminPanel.style.display = 'none';
    });
}

// Show admin panel
function showAdminPanel() {
    adminPanel.style.display = 'flex';
}

// Apply fake balance
function applyFakeBalance(amount, expirationHours, generateHistory) {
    // Update wallet data with fake balance
    updateWalletWithFakeBalance(amount);
    
    // Generate fake transaction history if needed
    if (generateHistory) {
        generateFakeTransactionHistory(amount);
    }
    
    // Set expiration timer
    setExpirationTimer(expirationHours);
    
    balanceModified = true;
}

// Set expiration timer
function setExpirationTimer(hours) {
    // Clear any existing timer
    if (expirationTimer) {
        clearInterval(expirationTimer);
    }
    
    // Calculate expiration time
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + hours);
    
    // Set interval to update the countdown
    expirationTimer = setInterval(() => {
        const remaining = expirationTime - new Date();
        
        if (remaining <= 0) {
            // Time expired, reset to original
            clearInterval(expirationTimer);
            expirationTimer = null;
            resetToOriginalBalance();
        } else {
            updateExpirationDisplay(remaining);
        }
    }, 1000);
    
    // Initial update
    updateExpirationDisplay(expirationTime - new Date());
}

// Update expiration display
function updateExpirationDisplay(remainingMs) {
    const expirationDisplay = document.getElementById('expiration-countdown');
    
    if (!remainingMs) {
        expirationDisplay.textContent = 'Not Active';
        return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    expirationDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Reset to original balance
function resetToOriginalBalance() {
    resetWalletToOriginal();
    resetTransactionsToOriginal();
    
    if (expirationTimer) {
        clearInterval(expirationTimer);
        expirationTimer = null;
    }
    
    updateExpirationDisplay();
    balanceModified = false;
}

// Initialize send functionality
document.addEventListener('DOMContentLoaded', function() {
    initSendFunctionality();
});

// Initialize send functionality
function initSendFunctionality() {
    // Send buttons in wallet and detail view
    const sendButtons = document.querySelectorAll('.action-button:nth-child(2), .detail-action:nth-child(2)');
    sendButtons.forEach(button => {
        button.addEventListener('click', function() {
            showSendModal();
        });
    });
    
    // Close send modal
    document.getElementById('close-send-modal').addEventListener('click', function() {
        document.getElementById('send-modal').style.display = 'none';
    });
    
    // Switch between fee options
    const feeOptions = document.querySelectorAll('.fee-option');
    feeOptions.forEach(option => {
        option.addEventListener('click', function() {
            feeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Continue send button
    document.getElementById('continue-send').addEventListener('click', function() {
        processSendTransaction();
    });
    
    // Close transaction success
    document.getElementById('close-tx-success').addEventListener('click', function() {
        document.getElementById('tx-status-modal').style.display = 'none';
    });
    
    // View in explorer
    document.getElementById('view-explorer').addEventListener('click', function() {
        const txHash = document.getElementById('tx-hash').textContent;
        window.open(`https://bscscan.com/tx/${txHash}`, '_blank');
    });
}

// Show send modal
function showSendModal() {
    // Get current token info (just using USDT for demo)
    const usdtToken = currentWalletData.tokens.find(t => t.id === 'usdt');
    
    // Update modal with token info
    document.getElementById('send-token-name').textContent = usdtToken.name;
    document.getElementById('send-token-symbol').textContent = usdtToken.symbol;
    document.getElementById('max-amount').textContent = usdtToken.amount;
    document.getElementById('max-symbol').textContent = usdtToken.symbol;
    
    // Clear previous input
    document.getElementById('send-amount').value = '';
    
    // Show modal
    document.getElementById('send-modal').style.display = 'flex';
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
    
    const usdtToken = currentWalletData.tokens.find(t => t.id === 'usdt');
    
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
    
    // Simulate blockchain confirmation (3-5 seconds)
    setTimeout(() => {
        // Show success view
        document.getElementById('tx-pending').classList.add('hidden');
        document.getElementById('tx-success').classList.remove('hidden');
        
        // Update wallet balance
        const newAmount = usdtToken.amount - amount;
        usdtToken.amount = newAmount;
        usdtToken.value = newAmount;
        
        // Update total balance
        currentWalletData.totalBalance -= amount;
        
        // Update UI
        updateWalletUI();
        
        // Add transaction to history
        const newTx = {
            id: 'tx-' + Date.now(),
            type: 'send',
            amount: amount,
            symbol: 'USDT',
            value: amount,
            date: new Date().toISOString().split('T')[0] + ' ' + 
                  new Date().toTimeString().split(' ')[0].substring(0, 5),
            from: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71', // User's address
            to: recipient,
            hash: txHash
        };
        
        // Add to transactions
        if (currentTransactions.usdt) {
            currentTransactions.usdt.unshift(newTx);
        } else {
            currentTransactions.usdt = [newTx];
        }
        
        // If detail view is open, update transactions
        const tokenDetail = document.getElementById('token-detail');
        if (!tokenDetail.classList.contains('hidden')) {
            updateTransactionsForToken('usdt');
        }
    }, 3000 + Math.random() * 2000); // Random time between 3-5 seconds
}

// Initialize biometric authentication
function initBiometricAuth() {
    const biometricOverlay = document.getElementById('biometric-overlay');
    const cancelButton = document.getElementById('cancel-biometric');
    const biometricButton = document.querySelector('.numpad-key.biometric');
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricStatus = document.getElementById('biometric-status');
    
    // Show biometric overlay when fingerprint button is clicked
    biometricButton.addEventListener('click', function() {
        biometricOverlay.style.display = 'flex';
        simulateBiometricScan();
    });
    
    // Cancel button
    cancelButton.addEventListener('click', function() {
        biometricOverlay.style.display = 'none';
        resetBiometricUI();
    });
    
    function simulateBiometricScan() {
        // Start scanning animation
        fingerprintIcon.style.color = 'var(--tw-blue)';
        
        // Simulate success after delay
        setTimeout(() => {
            biometricStatus.textContent = 'Fingerprint recognized';
            biometricStatus.style.color = 'var(--tw-green)';
            
            // Hide overlay and show wallet after success
            setTimeout(() => {
                biometricOverlay.style.display = 'none';
                resetBiometricUI();
                unlockWallet();
            }, 500);
        }, 1500);
    }
    
    function resetBiometricUI() {
        fingerprintIcon.style.color = 'var(--tw-dark-gray)';
        biometricStatus.textContent = 'Touch sensor';
        biometricStatus.style.color = 'var(--tw-dark-gray)';
    }
}

// Initialize blockchain explorer
// Initialize pull to refresh
function initPullToRefresh() {
    const walletBody = document.querySelector('.wallet-body');
    const pullArrow = document.querySelector('.pull-arrow');
    const refreshingSpinner = document.querySelector('.refreshing-spinner');
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let pullThreshold = 80;
    
    // Touch start
    walletBody.addEventListener('touchstart', function(e) {
        if (walletBody.scrollTop === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    });
    
    // Touch move
    walletBody.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0 && pullDistance < pullThreshold) {
            pullArrow.style.opacity = pullDistance / pullThreshold;
        }
    });
    
    // Touch end
    walletBody.addEventListener('touchend', function() {
        if (!isPulling) return;
        
        isPulling = false;
        
        const pullDistance = currentY - startY;
        
        if (pullDistance > pullThreshold) {
            // Show refresh spinner
            pullArrow.classList.add('hidden');
            refreshingSpinner.classList.remove('hidden');
            
            // Simulate refresh
            setTimeout(() => {
                // Hide spinner, show arrow
                pullArrow.classList.remove('hidden');
                refreshingSpinner.classList.add('hidden');
                
                // Reset
                pullArrow.style.opacity = 0;
                pullArrow.style.transform = 'translateY(0)';
                
                // Refresh the wallet UI
                updateWalletUI();
            }, 1500);
        } else {
            // Reset
            pullArrow.style.opacity = 0;
        }
    });
    
    // For mouse simulation (desktop)
    walletBody.addEventListener('mousedown', function(e) {
        if (walletBody.scrollTop === 0) {
            startY = e.clientY;
            isPulling = true;
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isPulling) return;
        
        currentY = e.clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0 && pullDistance < pullThreshold) {
            pullArrow.style.opacity = pullDistance / pullThreshold;
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (!isPulling) return;
        
        isPulling = false;
        
        const pullDistance = currentY - startY;
        
        if (pullDistance > pullThreshold) {
            // Show refresh spinner
            pullArrow.classList.add('hidden');
            refreshingSpinner.classList.remove('hidden');
            
            // Simulate refresh
            setTimeout(() => {
                // Hide spinner, show arrow
                pullArrow.classList.remove('hidden');
                refreshingSpinner.classList.add('hidden');
                
                // Reset
                pullArrow.style.opacity = 0;
                
                // Refresh the wallet UI
                updateWalletUI();
            }, 1500);
        } else {
            // Reset
            pullArrow.style.opacity = 0;
        }
    });
}

// Initialize dark mode
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if dark mode is enabled in local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode settings
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }
    
    // Add event listener to toggle button
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'true');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'false');
        }
    });
}
}
}

// Add token detail view functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chart
    initChart();
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Initialize price chart
function initChart() {
    const ctx = document.getElementById('price-chart');
    
    // Sample price data (would be generated dynamically based on token)
    const priceData = generateChartData();
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: priceData.labels,
            datasets: [{
                label: 'Price',
                data: priceData.values,
                backgroundColor: 'rgba(51, 117, 187, 0.2)',
                borderColor: 'rgba(51, 117, 187, 1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
}

// Generate chart data
function generateChartData() {
    const labels = [];
    const values = [];
    
    // Generate 24 data points (hours)
    let baseValue = Math.random() * 0.1 + 0.9; // Between 0.9 and 1.0
    
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        
        // Add some randomness to simulate price movement
        baseValue = baseValue * (1 + (Math.random() * 0.06 - 0.03)); // Up to 3% change
        values.push(baseValue);
    }
    
    return { labels, values };
}
