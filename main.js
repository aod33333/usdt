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
    initDarkMode();
    initChart();
    initEventListeners();
    initInvestmentWarning();
    initPullToRefresh();
    updateStatusBarTime();
    
    // Set up clock update
    setInterval(updateStatusBarTime, 60000);
    
    // Hide status bar initially (only show after login)
    document.querySelector('.status-bar').style.display = 'none';
    
    // Investment warning and bitcoin warning should only appear after login
    document.getElementById('investment-warning').style.display = 'none';
    document.getElementById('bitcoin-warning').classList.add('hidden');
    
    // Show lock screen by default
    lockScreen.classList.remove('hidden');
    
    // For demo purposes, automatically unlock after 1 second
    if (window.location.search.includes('demo=true')) {
        setTimeout(() => {
            passcodeEntered = correctPasscode;
            unlockWallet();
            showInvestmentWarning();
            setupDemoBalance();
        }, 1000);
    }
});

// Update status bar time
function updateStatusBarTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    document.querySelector('.status-time').textContent = formattedTime;
}

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
    
    // Show status bar when wallet is unlocked
    document.querySelector('.status-bar').style.display = 'flex';
    
    // Add padding for status bar
    document.querySelector('.app-container').classList.add('with-status-bar');
    
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

// Initialize event listeners
function initEventListeners() {
    // Add event listeners for token items
    document.getElementById('token-list').addEventListener('click', function(event) {
        const tokenItem = event.target.closest('.token-item');
        if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            showTokenDetail(tokenId);
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
    document.querySelector('.disclaimer-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
    });
    
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
    document.getElementById('continue-send').addEventListener('click', processSendTransaction);
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Initialize chart
function initChart() {
    const ctx = document.getElementById('price-chart');
    
    if (ctx) {
        // Sample price data
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
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0 && pullDistance < pullThreshold) {
            e.preventDefault(); // Prevent scrolling
            pullArrow.style.opacity = pullDistance / pullThreshold;
        }
    });
    
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
                
                // Refresh the wallet UI
                updateWalletUI();
            }, 1500);
        } else {
            // Reset
            pullArrow.style.opacity = 0;
        }
    });
}

// Show send screen
function showSendScreen(tokenId) {
    const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    document.getElementById('send-token-title').textContent = `Send ${token.symbol}`;
    document.getElementById('max-amount').textContent = token.amount;
    document.getElementById('max-symbol').textContent = token.symbol;
    
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
    
    if (qrContainer && address) {
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
        }, 500);
    }, 1500);
}
