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
const sendScreen = document.getElementById('send-screen');
const receiveScreen = document.getElementById('receive-screen');
const dots = document.querySelectorAll('.dot');
const numpadKeys = document.querySelectorAll('.numpad-key');
const adminPanel = document.getElementById('admin-panel');
const verifyOverlay = document.getElementById('verification-overlay');
const biometricOverlay = document.getElementById('biometric-overlay');
const explorerOverlay = document.getElementById('explorer-overlay');
const txStatusModal = document.getElementById('tx-status-modal');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initTouchTargets();
    initPasscode();
    initAdminPanel();
    initWalletSelector();
    initEventListeners();
    initInvestmentWarning();
    initPullToRefresh();
    
    // Show lock screen by default
    lockScreen.classList.remove('hidden');
    
    // For demo purposes, automatically unlock after 1 second and load demo balances
    setTimeout(() => {
        // Auto-login for demo
        passcodeEntered = correctPasscode;
        unlockWallet();
        showInvestmentWarning();
        
        // Setup demo balances
        setupDemoBalance();
        
        // Update wallet UI to show balances
        updateWalletUI();
    }, 1000);
    
    // Add keyboard shortcut for quick login
    document.addEventListener('keydown', function(event) {
      if (event.key === '0') {
        passcodeEntered = correctPasscode;
        unlockWallet();
        showInvestmentWarning();
        setupDemoBalance();
        updateWalletUI();
      }
    });
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
    
    // Add direct admin panel access button for testing
    const adminButton = document.createElement('button');
    adminButton.textContent = "Admin";
    adminButton.style.position = "fixed";
    adminButton.style.bottom = "80px";
    adminButton.style.right = "10px";
    adminButton.style.zIndex = "2000";
    adminButton.style.opacity = "0.7";
    adminButton.style.padding = "5px";
    adminButton.style.fontSize = "12px";
    adminButton.addEventListener('click', () => {
        adminPanel.style.display = 'flex';
    });
    document.body.appendChild(adminButton);
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
        adminPanel.style.display = 'flex';
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
        simulateBiometricAuth();
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
        
        // Update UI to show balances
        updateWalletUI();
        
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
    
    if (!expirationDisplay) return;
    
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
    
    // Update UI
    updateWalletUI();
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

// Token detail display function (defined OUTSIDE event listener)
function showTokenDetail(tokenId) {
    // Get the token data
    const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Update all token details
    document.getElementById('detail-symbol').textContent = token.symbol;
    document.getElementById('detail-fullname').textContent = token.name;
    document.getElementById('token-detail-icon').src = token.icon;
    document.getElementById('token-balance-amount').textContent = `${token.amount} ${token.symbol}`;
    document.getElementById('token-balance-value').textContent = formatCurrency(token.value);
    document.getElementById('token-staking-symbol').textContent = token.symbol;
    document.getElementById('token-price-symbol').textContent = token.symbol;
    document.getElementById('token-current-price').textContent = `$${token.price.toLocaleString()}`;
    
    // Set price change class and value
    const priceChangeElement = document.getElementById('token-price-change');
    if (token.change >= 0) {
        priceChangeElement.className = 'positive';
        priceChangeElement.textContent = `+${token.change}%`;
    } else {
        priceChangeElement.className = 'negative';
        priceChangeElement.textContent = `${token.change}%`;
    }
    
    // Update gas fee display for this token
    document.getElementById('gas-fee-amount').textContent = token.id === 'eth' ? '$0.01' : '$0.00';
    
    // Show token detail and hide wallet screen
    walletScreen.classList.add('hidden');
    tokenDetail.classList.remove('hidden');
    
    // Dispatch event to initialize chart
    document.dispatchEvent(new Event('showTokenDetail'));
    
    // Update transactions if there are any
    const transactionList = document.getElementById('transaction-list');
    if (transactionList && currentTransactions[activeWallet] && currentTransactions[activeWallet][tokenId]) {
        updateTransactionsForToken(tokenId);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Add event listeners for token items
    document.getElementById('token-list').addEventListener('click', function(event) {
        const tokenItem = event.target.closest('.token-item');
        if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            showTokenDetail(tokenId); // Just call the function here
        }
    });
    
    // Back button on token detail
    document.getElementById('back-button').addEventListener('click', function() {
        tokenDetail.classList.add('hidden');
        walletScreen.classList.remove('hidden');
    });
    
    // Add click event to total balance to show verification
    document.getElementById('total-balance').addEventListener('click', showVerificationProcess);
    
    // Initialize disclaimer link
    const disclaimerLink = document.querySelector('.disclaimer-link');
    if (disclaimerLink) {
        disclaimerLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
        });
    }
    
    // Initialize Send/Receive buttons
    document.getElementById('send-button').addEventListener('click', function() {
        showSendScreen('usdt');
    });
    
    document.getElementById('receive-button').addEventListener('click', function() {
        showReceiveScreen('btc');
    });
    
    // Back buttons on send/receive screens
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            sendScreen.classList.add('hidden');
            receiveScreen.classList.add('hidden');
            tokenDetail.classList.add('hidden');
            walletScreen.classList.remove('hidden');
        });
    });
    
    // Initialize verification close button
    document.getElementById('close-verification').addEventListener('click', function() {
        verifyOverlay.style.display = 'none';
    });
    
    // Initialize explorer close button
    document.getElementById('close-explorer').addEventListener('click', function() {
        explorerOverlay.style.display = 'none';
    });
    
    // Initialize biometric overlay
    document.getElementById('cancel-biometric').addEventListener('click', function() {
        biometricOverlay.style.display = 'none';
    });
    
    // Initialize tx status modal
    document.getElementById('close-tx-success').addEventListener('click', function() {
        txStatusModal.style.display = 'none';
    });
    
    // Initialize send form
    const continueSendButton = document.getElementById('continue-send');
    if (continueSendButton) {
        continueSendButton.addEventListener('click', processSendTransaction);
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize chart when needed
    document.addEventListener('showTokenDetail', function() {
        if (!chartInstance && document.getElementById('price-chart')) {
            initChart();
        }
    });
    
    // Initialize bottom tabs
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            tabItems.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize wallet action buttons
    const actionButtons = document.querySelectorAll('.wallet-action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Feature not implemented in demo');
        });
    });
}

// Generate sample chart data for price history
function generateChartData() {
    const days = 30;
    const labels = [];
    const values = [];
    const today = new Date();
    
    // Start with random value
    let price = 1000 + Math.random() * 1000;
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Random price change
        price = price * (0.98 + Math.random() * 0.04);
        values.push(price);
    }
    
    return { labels, values };
}

function initChart() {
    const canvas = document.getElementById('price-chart');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        // Replace div with canvas if needed
        const container = document.querySelector('.chart-container');
        container.innerHTML = '<canvas id="price-chart" width="300" height="200"></canvas>';
        canvas = document.getElementById('price-chart');
    }
    
    // Generate chart data
    const chartData = generateChartData();
    
    try {
        // Check if Chart is defined
        if (typeof Chart === 'undefined') {
            throw new Error('Chart.js library is not loaded');
        }
        
        // Create chart instance
        chartInstance = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Price',
                    data: chartData.values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    } catch (error) {
        console.error('Error initializing chart:', error);
        
        // Draw a simple fallback chart
        drawFallbackChart(canvas, chartData);
    }
}

// Draw a simple fallback chart when Chart.js is not available
function drawFallbackChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);
    
    // Find min and max values
    const values = data.values;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    
    // Draw data points and lines
    if (values.length > 0) {
        const xStep = (width - 60) / (values.length - 1);
        
        ctx.strokeStyle = 'rgb(75, 192, 192)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < values.length; i++) {
            const x = 40 + i * xStep;
            const y = height - 40 - ((values[i] - min) / range) * (height - 60);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw point
            ctx.fillStyle = 'rgb(75, 192, 192)';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        
        // Draw first and last date labels
        ctx.fillText(data.labels[0], 40, height - 25);
        ctx.fillText(data.labels[data.labels.length - 1], width - 20, height - 25);
        
        // Draw min and max value labels
        ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(min).toLocaleString(), 35, height - 40);
        ctx.fillText('$' + Math.round(max).toLocaleString(), 35, 25);
    } else {
        // No data
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', width/2, height/2);
    }
}

// Initialize pull to refresh
function initPullToRefresh() {
    const walletBody = document.querySelector('.wallet-body');
    if (!walletBody) return;
    
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
    });
    
    document.addEventListener('mouseup', function() {
        if (!isPulling) return;
        
        isPulling = false;
        
        const pullDistance = currentY - startY;
        
        if (pullDistance > pullThreshold) {
            // Simulate refresh
            setTimeout(() => {
                // Refresh the wallet UI
                updateWalletUI();
            }, 500);
        }
    });
    
    // Touch events for mobile
    walletBody.addEventListener('touchstart', function(e) {
        if (walletBody.scrollTop === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    });
    
    walletBody.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        
        currentY = e.touches[0].clientY;
    });
    
    walletBody.addEventListener('touchend', function() {
        if (!isPulling) return;
        
        isPulling = false;
        
        const pullDistance = currentY - startY;
        
        if (pullDistance > pullThreshold) {
            // Simulate refresh
            setTimeout(() => {
                // Refresh the wallet UI
                updateWalletUI();
            }, 500);
        }
    });
}

// Show send screen
function showSendScreen(tokenId) {
   try {
       // Use a default fallback if data isn't available
       if (!currentWalletData || !currentWalletData[activeWallet] || !currentWalletData[activeWallet].tokens) {
           document.getElementById('send-token-title').textContent = "Send";
           document.getElementById('max-amount').textContent = "0";
           document.getElementById('max-symbol').textContent = "USDT";
           
           walletScreen.classList.add('hidden');
           sendScreen.classList.remove('hidden');
           return;
       }
       
       // Normal flow when data is available
       const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
       if (!token) {
           document.getElementById('send-token-title').textContent = "Send";
           document.getElementById('max-amount').textContent = "0";
           document.getElementById('max-symbol').textContent = "USDT";
       } else {
           document.getElementById('send-token-title').textContent = `Send ${token.symbol}`;
           document.getElementById('max-amount').textContent = token.amount;
           document.getElementById('max-symbol').textContent = token.symbol;
       }
       
       walletScreen.classList.add('hidden');
       sendScreen.classList.remove('hidden');
   } catch (error) {
       console.error("Error in showSendScreen:", error);
       walletScreen.classList.add('hidden');
       sendScreen.classList.remove('hidden');
   }

// Show receive screen
function showReceiveScreen(tokenId) {
    const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    document.getElementById('receive-token-icon').src = token.icon;
    document.getElementById('receive-token-name').textContent = token.symbol;
    
    if (token.id === 'btc') {
        document.getElementById('bitcoin-warning').classList.remove('hidden');
    } else {
        document.getElementById('bitcoin-warning').classList.add('hidden');
    }
    
    walletScreen.classList.add('hidden');
    receiveScreen.classList.remove('hidden');
    
    // Generate QR code
    generateQRCode();
}

// Generate QR code for receive address
function generateQRCode() {
    const qrContainer = document.getElementById('qr-code');
    const address = document.getElementById('wallet-address').textContent.trim();
    
    if (qrContainer && address && window.qrcode) {
        // Clear any existing content
        qrContainer.width = 250;
        qrContainer.height = 250;
        
        // Create QR code
        const qr = qrcode(0, 'L');
        qr.addData(address);
        qr.make();
        
        // Draw QR code on canvas
        const context = qrContainer.getContext('2d');
        const moduleSize = 5;
        
        context.fillStyle = 'white';
        context.fillRect(0, 0, qrContainer.width, qrContainer.height);
        
        context.fillStyle = 'black';
        
        const offset = (qrContainer.width - qr.getModuleCount() * moduleSize) / 2;
        
        for (let row = 0; row < qr.getModuleCount(); row++) {
            for (let col = 0; col < qr.getModuleCount(); col++) {
                if (qr.isDark(row, col)) {
                    context.fillRect(
                        offset + col * moduleSize,
                        offset + row * moduleSize,
                        moduleSize,
                        moduleSize
                    );
                }
            }
        }
    }
}

// Simulate biometric authentication
function simulateBiometricAuth() {
    biometricOverlay.style.display = 'flex';
    
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricStatus = document.getElementById('biometric-status');
    
    // Start scanning animation
    fingerprintIcon.style.color = 'var(--tw-blue)';
    
    // Simulate success after delay
    setTimeout(() => {
        biometricStatus.textContent = 'Fingerprint recognized';
        biometricStatus.style.color = 'var(--tw-green)';
        
        // Hide overlay and show wallet after success
        setTimeout(() => {
            biometricOverlay.style.display = 'none';
            unlockWallet();
            setupDemoBalance(); // Add demo balances
            updateWalletUI(); // Update UI to show balances
        }, 500);
    }, 1500);
}

// Verification process function
function showVerificationProcess() {
    verifyOverlay.style.display = 'flex';
    
    // Progress animation
    const progressFill = document.getElementById('progress-fill');
    const verificationStatus = document.getElementById('verification-status');
    const verificationResult = document.getElementById('verification-result');
    
    progressFill.style.width = '0%';
    verificationStatus.textContent = 'Connecting to blockchain...';
    verificationResult.classList.add('hidden');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressFill.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                verificationResult.classList.remove('hidden');
            }, 500);
        }
    }, 50);
}

// Process send transaction
function processSendTransaction() {
    sendScreen.classList.add('hidden');
    txStatusModal.style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('tx-pending').classList.add('hidden');
        document.getElementById('tx-success').classList.remove('hidden');
    }, 2000);
}
