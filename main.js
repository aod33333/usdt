// Global variables
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
        { percent: 15, text: 'Connecting to blockchain...' },
        { percent: 30, text: 'Verifying wallet address...' },
        { percent: 45, text: 'Checking USDT token contract...' },
        { percent: 60, text: 'Validating transactions...' },
        { percent: 75, text: 'Computing balance checksum...' },
        { percent: 90, text: 'Finalizing verification...' },
        { percent: 100, text: 'Verification complete' }
    ];
    
    let currentStep = 0;
    
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
                }, 500);
            }
        }
    }, 700);
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
