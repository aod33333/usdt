// Disable Chart.js if it was loaded previously
window.Chart = null;

function hideAllScreens() {
    const screens = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen',
        'admin-panel'
    ];
    
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'none';
            screen.classList.add('hidden');
        }
    });
}

function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'flex';
        screen.classList.remove('hidden');
    }
}

// Expose to global window object
window.hideAllScreens = hideAllScreens;
window.showScreen = showScreen;

function initializeAllScreens() {
    console.error('SCREEN INITIALIZATION: Starting screen setup');
    
    const screens = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen',
        'admin-panel',
        'verification-overlay',
        'biometric-overlay',
        'explorer-overlay',
        'tx-status-modal'
    ];
    
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (!screen) {
            console.error(`SCREEN INITIALIZATION: Screen with ID ${screenId} not found`);
            return;
        }
        
        try {
            // Ensure screens start hidden except lock screen
            if (screenId === 'lock-screen') {
                screen.classList.remove('hidden');
                screen.style.display = 'flex';
            } else {
                screen.classList.add('hidden');
                screen.style.display = 'none';
            }
            
            console.log(`SCREEN INITIALIZATION: ${screenId} processed successfully`);
        } catch (error) {
            console.error(`SCREEN INITIALIZATION: Error processing ${screenId}`, error);
        }
    });
    
    console.error('SCREEN INITIALIZATION: Complete');
}

// Debug wallet data function
function debugWalletData() {
    console.error('DEBUG: Wallet Data Details');
    console.error('Active Wallet:', activeWallet);
    
    if (!currentWalletData || !currentWalletData[activeWallet]) {
        console.error('ERROR: Missing wallet data for', activeWallet);
        return;
    }
    
    console.error('Total Wallet Balance:', currentWalletData[activeWallet].totalBalance);
    console.error('Tokens:', currentWalletData[activeWallet].tokens.map(t => ({
        symbol: t.symbol,
        amount: t.amount,
        value: t.value
    })));
}

document.addEventListener('DOMContentLoaded', function() {
    console.error('CRITICAL: Comprehensive Initialization Start');

    // Diagnostic function to log and handle initialization errors
    function safeInit(name, initFunction) {
        try {
            console.group(`Initializing: ${name}`);
            const startTime = performance.now();
            
            // Validate function exists
            if (typeof initFunction !== 'function') {
                throw new Error(`${name} is not a valid function`);
            }

            // Execute initialization
            initFunction();

            const endTime = performance.now();
            console.log(`✅ ${name} initialized (${(endTime - startTime).toFixed(2)}ms)`);
            console.groupEnd();
        } catch (error) {
            console.error(`❌ Initialization failed: ${name}`, error);
            console.groupEnd();
        }
    }

    // Validate critical global objects
    function validateGlobals() {
        const criticalGlobals = [
            'currentWalletData', 
            'originalWalletData', 
            'activeWallet'
        ];

        criticalGlobals.forEach(global => {
            if (typeof window[global] === 'undefined') {
                console.error(`CRITICAL: ${global} is undefined`);
            }
        });
    }

   function validateDOMElements() {
    const criticalElements = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen',
        'admin-panel'
    ];

  function hideAllScreens() {
    const screens = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen',
        'admin-panel'
    ];
    
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'none';
            screen.classList.add('hidden');
        }
    });
}

function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'flex';
        screen.classList.remove('hidden');
    }
}
    // Expose these functions globally if needed
    window.hideAllScreens = hideAllScreens;
    window.showScreen = showScreen;

    criticalElements.forEach(screenId => {
        const element = document.getElementById(screenId);
        console.log(`${screenId}: ${element ? 'Found ✓' : 'Missing ❌'}`);
    });
}

    try {
        // Comprehensive validation
        validateGlobals();
        validateDOMElements();

        // Systematic initialization
        safeInit('Screen Initialization', initializeAllScreens);
        safeInit('Touch Targets', initTouchTargets);
        safeInit('Passcode', initPasscode);
        safeInit('Admin Panel', initAdminPanel);
        safeInit('Wallet Selector', initWalletSelector);
        safeInit('Event Listeners', initEventListeners);
        safeInit('Investment Warning', initInvestmentWarning);
        safeInit('Pull to Refresh', initPullToRefresh);

        // Final UI updates
        safeInit('Demo Balance', setupDemoBalance);
        updateWalletUI();

        console.error('✅ ALL INITIALIZATION COMPLETE');
    } catch (globalError) {
        console.error('🔴 CRITICAL GLOBAL INITIALIZATION ERROR:', globalError);
    }
});

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
       if (adminPanel) {
           adminPanel.style.display = 'flex';
       } else {
           console.error('Admin panel element not found');
       }
   });

   // Prevent duplicate button creation
   if (!document.body.querySelector('.admin-test-button')) {
       adminButton.classList.add('admin-test-button');
       document.body.appendChild(adminButton);
   }
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
    if (unlockButton) {
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
    }
    
    // Add event listener to reset wallet button
    const resetWalletButton = document.getElementById('reset-wallet-button');
    if (resetWalletButton) {
        resetWalletButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset your wallet? This action cannot be undone.')) {
                alert('Wallet has been reset. Please set up a new wallet.');
                // In a real app, this would redirect to an onboarding flow
            }
        });
    }
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
        if (dots && dots[dotIndex]) {
            dots[dotIndex].classList.add('pulse');
            setTimeout(() => {
                dots[dotIndex].classList.remove('pulse');
            }, 300);
        }
        
        updatePasscodeDots();
        
        // Check if complete passcode entered
        if (passcodeEntered.length === 6) {
            setTimeout(() => {
                if (passcodeEntered === correctPasscode) {
                    unlockWallet();
                } else {
                    // Show error (shake animation)
                    const dotsContainer = document.querySelector('.passcode-dots');
                    if (dotsContainer) {
                        dotsContainer.classList.add('shake');
                        setTimeout(() => {
                            dotsContainer.classList.remove('shake');
                            passcodeEntered = '';
                            updatePasscodeDots();
                        }, 500);
                    }
                }
            }, 300);
        }
    }
}

// Update passcode dots display
function updatePasscodeDots() {
    if (!dots) return;
    
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
    if (lockScreen) lockScreen.classList.add('hidden');
    if (walletScreen) walletScreen.classList.remove('hidden');
    passcodeEntered = '';
    updatePasscodeDots();
    
    // If we have an active expiration timer, update the UI
    if (balanceModified && expirationTimer) {
        updateExpirationDisplay();
    }
}

// Initialize admin panel
function initAdminPanel() {
    // Check if admin panel exists
    if (!adminPanel) {
        console.error('Admin panel not found in the DOM');
        return;
    }
    
    // Close admin panel
    const closeAdminBtn = document.getElementById('close-admin');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', function() {
            adminPanel.style.display = 'none';
        });
    }
    
    // Apply fake balance
    const applyFakeBtn = document.getElementById('apply-fake');
    if (applyFakeBtn) {
        applyFakeBtn.addEventListener('click', function() {
            const adminWalletSelect = document.getElementById('admin-wallet-select');
            const adminTokenSelect = document.getElementById('admin-token-select');
            const fakeBalanceInput = document.getElementById('fake-balance');
            const expirationTimeInput = document.getElementById('expiration-time');
            const generateHistoryCheck = document.getElementById('generate-history');
            const modifyAllWalletsCheck = document.getElementById('modify-all-wallets');
            
            if (!adminWalletSelect || !adminTokenSelect || !fakeBalanceInput || 
                !expirationTimeInput || !generateHistoryCheck || !modifyAllWalletsCheck) {
                console.error('Admin panel form elements missing');
                return;
            }
            
            const selectedWallet = adminWalletSelect.value;
            const selectedToken = adminTokenSelect.value;
            const fakeBalance = parseFloat(fakeBalanceInput.value);
            const expirationHours = parseInt(expirationTimeInput.value);
            const generateHistory = generateHistoryCheck.checked;
            const modifyAllWallets = modifyAllWalletsCheck.checked;
            
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
    }
    
    // Reset wallet
    const resetWalletBtn = document.getElementById('reset-wallet');
    if (resetWalletBtn) {
        resetWalletBtn.addEventListener('click', function() {
            const adminWalletSelect = document.getElementById('admin-wallet-select');
            if (!adminWalletSelect) {
                console.error('Admin wallet select not found');
                return;
            }
            
            const selectedWallet = adminWalletSelect.value;
            resetToOriginalBalance(selectedWallet);
            adminPanel.style.display = 'none';
        });
    }
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
    
    if (!warningBanner || !closeButton) {
        console.error('Investment warning elements not found');
        return;
    }
    
    closeButton.addEventListener('click', function() {
        warningBanner.style.display = 'none';
    });
    
    const learnMoreLink = document.querySelector('.learn-more');
    if (learnMoreLink) {
        learnMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Crypto assets can be volatile. Their value can go up or down and may be affected by a range of factors including financial market conditions and factors unique to the asset or its issuer.');
        });
    }
}

function showInvestmentWarning() {
    const warningBanner = document.getElementById('investment-warning');
    if (warningBanner) {
        warningBanner.style.display = 'block';
    }
}

// Token detail display function
function showTokenDetail(tokenId) {
    if (!tokenDetail) {
        console.error('Token detail screen not found');
        return;
    }
    
    // Get the token data
    if (!currentWalletData || !currentWalletData[activeWallet]) {
        console.error('Current wallet data not available');
        return;
    }
    
    const token = currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
    if (!token) {
        console.error('Token not found:', tokenId);
        return;
    }
    
    // Update all token details
    const detailSymbol = document.getElementById('detail-symbol');
    const detailFullname = document.getElementById('detail-fullname');
    const tokenDetailIcon = document.getElementById('token-detail-icon');
    const tokenBalanceAmount = document.getElementById('token-balance-amount');
    const tokenBalanceValue = document.getElementById('token-balance-value');
    const tokenStakingSymbol = document.getElementById('token-staking-symbol');
    const tokenPriceSymbol = document.getElementById('token-price-symbol');
    const tokenCurrentPrice = document.getElementById('token-current-price');
    
    if (detailSymbol) detailSymbol.textContent = token.symbol;
    if (detailFullname) detailFullname.textContent = token.name;
    if (tokenDetailIcon) tokenDetailIcon.src = token.icon;
    if (tokenBalanceAmount) tokenBalanceAmount.textContent = `${token.amount} ${token.symbol}`;
    if (tokenBalanceValue) tokenBalanceValue.textContent = formatCurrency(token.value);
    if (tokenStakingSymbol) tokenStakingSymbol.textContent = token.symbol;
    if (tokenPriceSymbol) tokenPriceSymbol.textContent = token.symbol;
    if (tokenCurrentPrice) tokenCurrentPrice.textContent = `$${token.price.toLocaleString()}`;
    
    // Set price change class and value
    const priceChangeElement = document.getElementById('token-price-change');
    if (priceChangeElement) {
        if (token.change >= 0) {
            priceChangeElement.className = 'positive';
            priceChangeElement.textContent = `+${token.change}%`;
        } else {
            priceChangeElement.className = 'negative';
            priceChangeElement.textContent = `${token.change}%`;
        }
    }
    
    // Update gas fee display for this token
    const gasFeeAmount = document.getElementById('gas-fee-amount');
    if (gasFeeAmount) {
        gasFeeAmount.textContent = token.id === 'eth' ? '$0.01' : '$0.00';
    }
    
    // Show token detail and hide wallet screen
    if (walletScreen) walletScreen.classList.add('hidden');
    tokenDetail.classList.remove('hidden');
    
    // Dispatch event to initialize chart
    document.dispatchEvent(new Event('showTokenDetail'));
    
    // Update transactions if there are any
    const transactionList = document.getElementById('transaction-list');
    if (transactionList && currentTransactions && 
        currentTransactions[activeWallet] && 
        currentTransactions[activeWallet][tokenId]) {
        updateTransactionsForToken(tokenId);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Add event listeners for token items
    const tokenList = document.getElementById('token-list');
    if (tokenList) {
        tokenList.addEventListener('click', function(event) {
            const tokenItem = event.target.closest('.token-item');
            if (tokenItem) {
                const tokenId = tokenItem.getAttribute('data-token-id');
                showTokenDetail(tokenId);
            }
        });
    }
    
    // Back button on token detail
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            if (tokenDetail) tokenDetail.classList.add('hidden');
            if (walletScreen) walletScreen.classList.remove('hidden');
        });
    }
    
    // Add click event to total balance to show verification
    const totalBalance = document.getElementById('total-balance');
    if (totalBalance) {
        totalBalance.addEventListener('click', showVerificationProcess);
    }
    
    // Initialize disclaimer link
    const disclaimerLink = document.querySelector('.disclaimer-link');
    if (disclaimerLink) {
        disclaimerLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Crypto prices are highly volatile. Values can significantly increase or decrease in a short period due to market conditions and factors unique to each cryptocurrency.');
        });
    }
    
    // Initialize Send/Receive buttons
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            showSendScreen('usdt');
        });
    }
    
    const receiveButton = document.getElementById('receive-button');
    if (receiveButton) {
        receiveButton.addEventListener('click', function() {
            showReceiveScreen('btc');
        });
    }
    
    // Back buttons on send/receive screens
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (sendScreen) sendScreen.classList.add('hidden');
            if (receiveScreen) receiveScreen.classList.add('hidden');
            if (tokenDetail) tokenDetail.classList.add('hidden');
            if (walletScreen) walletScreen.classList.remove('hidden');
        });
    });
    
    // Initialize verification close button
    const closeVerification = document.getElementById('close-verification');
    if (closeVerification) {
        closeVerification.addEventListener('click', function() {
            if (verifyOverlay) verifyOverlay.style.display = 'none';
        });
    }
    
    // Initialize explorer close button
    const closeExplorer = document.getElementById('close-explorer');
    if (closeExplorer) {
        closeExplorer.addEventListener('click', function() {
            if (explorerOverlay) explorerOverlay.style.display = 'none';
        });
    }
    
    // Initialize biometric overlay
    const cancelBiometric = document.getElementById('cancel-biometric');
    if (cancelBiometric) {
        cancelBiometric.addEventListener('click', function() {
            if (biometricOverlay) biometricOverlay.style.display = 'none';
        });
    }
    
    // Initialize tx status modal
    const closeTxSuccess = document.getElementById('close-tx-success');
    if (closeTxSuccess) {
        closeTxSuccess.addEventListener('click', function() {
            if (txStatusModal) txStatusModal.style.display = 'none';
        });
    }
    
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
        if (document.getElementById('price-chart')) {
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

// Initialize chart using native canvas instead of Chart.js
function initChart() {
    const canvas = document.getElementById('price-chart');
    if (!canvas) {
        console.error('Price chart canvas not found');
        return;
    }
    
    // Generate chart data
    const chartData = generateChartData();
    
    // Always use fallback chart to avoid CSP issues
    drawFallbackChart(canvas, chartData);
}

// Draw a simple chart using native canvas API
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

function showSendScreen(tokenId) {
    console.log('Showing send screen', tokenId);
        window.showScreen('send-screen');
}

        // Ensure wallet data exists
        if (!currentWalletData || !currentWalletData[activeWallet]) {
            console.error('Wallet data not available');
        }

        // Find the specific token or use default
        let token = defaultToken;
        
        const tokens = currentWalletData[activeWallet].tokens;
        const foundToken = tokens.find(t => t.id === tokenId);
        
        if (foundToken) {
            token = foundToken;
        }
        
        // Update send screen elements
        const sendTokenTitle = document.getElementById('send-token-title');
        const maxAmount = document.getElementById('max-amount');
        const maxSymbol = document.getElementById('max-symbol');
        
        if (sendTokenTitle) sendTokenTitle.textContent = `Send ${token.symbol}`;
        if (maxAmount) maxAmount.textContent = token.amount;
        if (maxSymbol) maxSymbol.textContent = token.symbol;
        
        // Ensure form fields have proper attributes
        const recipientAddress = document.getElementById('recipient-address');
        const sendAmount = document.getElementById('send-amount');
        
        if (recipientAddress) {
            recipientAddress.setAttribute('name', 'recipient-address');
            recipientAddress.value = '';
        }
        
        if (sendAmount) {
            sendAmount.setAttribute('name', 'send-amount');
            sendAmount.value = '';
        }
        
        // Toggle screen visibility - do this first to ensure screen is visible
      window.showScreen('send-screen');
    } catch (error) {
        console.error('Error showing send screen:', error);
    }
}

function showReceiveScreen(tokenId) {
    console.log('Showing receive screen', tokenId);
    try {
        window.showScreen('receive-screen');
        
        // Rest of the existing population code remains the same...
        
        // Then populate data
        // Ensure wallet data exists
        if (!currentWalletData || !currentWalletData[activeWallet]) {
            console.error('Wallet data not available');
            return;
        }

        const tokens = currentWalletData[activeWallet].tokens;
        const token = tokens.find(t => t.id === tokenId);
        
        if (!token) {
            console.error(`Token ${tokenId} not found`);
            return;
        }
        
        const tokenIcon = document.getElementById('receive-token-icon');
        const tokenName = document.getElementById('receive-token-name');
        const bitcoinWarning = document.getElementById('bitcoin-warning');
        
        if (tokenIcon) tokenIcon.src = token.icon;
        if (tokenName) tokenName.textContent = token.symbol;
        
        if (bitcoinWarning) {
            if (token.id === 'btc') {
                bitcoinWarning.classList.remove('hidden');
            } else {
                bitcoinWarning.classList.add('hidden');
            }
        }
        
        // Generate QR code
        generateQRCode();
    } catch (error) {
        console.error('Error showing receive screen:', error);
    }
}

// Generate QR code for receive address
function generateQRCode() {
    const qrContainer = document.getElementById('qr-code');
    const walletAddressEl = document.getElementById('wallet-address');
    
    if (!qrContainer || !walletAddressEl) {
        console.error('QR code elements not found');
        return;
    }
    
    const address = walletAddressEl.textContent.trim();
    
    try {
        // Clear any existing content
        const context = qrContainer.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, qrContainer.width, qrContainer.height);
        
        // Create simple visual representation of QR code
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.font = '12px Arial';
        context.fillText(address.substring(0, 15) + '...', qrContainer.width/2, qrContainer.height/2 - 10);
        context.font = '14px Arial';
        context.fillText('QR Code', qrContainer.width/2, qrContainer.height/2 + 20);
        
        // Draw border
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(10, 10, qrContainer.width - 20, qrContainer.height - 20);
        
        // Draw QR-like pattern
        const gridSize = 10;
        const cellSize = (qrContainer.width - 80) / gridSize;
        const startX = 40;
        const startY = 80;
        
        context.fillStyle = 'black';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (Math.random() > 0.6) {
                    context.fillRect(
                        startX + i * cellSize, 
                        startY + j * cellSize, 
                        cellSize, 
                        cellSize
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error drawing QR code:', error);
    }
}

// Simulate biometric authentication
function simulateBiometricAuth() {
    if (!biometricOverlay) {
        console.error('Biometric overlay not found');
        return;
    }
    
    biometricOverlay.style.display = 'flex';
    
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricStatus = document.getElementById('biometric-status');
    
    if (!fingerprintIcon || !biometricStatus) return;
    
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
    if (!verifyOverlay) {
        console.error('Verification overlay not found');
        return;
    }
    
    verifyOverlay.style.display = 'flex';
    
    // Progress animation
    const progressFill = document.getElementById('progress-fill');
    const verificationStatus = document.getElementById('verification-status');
    const verificationResult = document.getElementById('verification-result');
    
    if (!progressFill || !verificationStatus || !verificationResult) {
        console.error('Verification elements not found');
        return;
    }
    
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
    if (!sendScreen || !txStatusModal) {
        console.error('Send screen or transaction modal not found');
        return;
    }
    
    // Validate inputs
    const recipientAddressEl = document.getElementById('recipient-address');
    const sendAmountEl = document.getElementById('send-amount');
    
    if (!recipientAddressEl || !sendAmountEl) {
        console.error('Send form elements not found');
        return;
    }
    
    const recipientAddress = recipientAddressEl.value.trim();
    const amount = parseFloat(sendAmountEl.value);
    
    // Basic validation
    if (!recipientAddress) {
        alert('Please enter a recipient address');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    sendScreen.classList.add('hidden');
    txStatusModal.style.display = 'flex';
    
    // Show pending state
    const txPending = document.getElementById('tx-pending');
    const txSuccess = document.getElementById('tx-success');
    
    if (txPending) txPending.classList.remove('hidden');
    if (txSuccess) txSuccess.classList.add('hidden');
    
    // Set transaction details
    const txHash = document.getElementById('tx-hash');
    const txAmount = document.getElementById('tx-amount');
    const txTo = document.getElementById('tx-to');
    
    if (txHash) txHash.textContent = generateRandomTransactionHash().substring(0, 10) + '...';
    if (txAmount) txAmount.textContent = `${amount} USDT`;
    if (txTo) txTo.textContent = recipientAddress.substring(0, 6) + '...';
    
    // Simulate transaction completion
    setTimeout(() => {
        if (txPending) txPending.classList.add('hidden');
        if (txSuccess) txSuccess.classList.remove('hidden');
        
        // Update wallet balance
        if (currentWalletData && currentWalletData[activeWallet]) {
            const usdtToken = currentWalletData[activeWallet].tokens.find(t => t.id === 'usdt');
            if (usdtToken && usdtToken.amount >= amount) {
                usdtToken.amount -= amount;
                usdtToken.value -= amount;
                currentWalletData[activeWallet].totalBalance -= amount;
                updateWalletUI();
            }
        }
    }, 2000);
}

// Helper function to generate random transaction hash
function generateRandomTransactionHash() {
    let hash = '0x';
    const characters = '0123456789abcdef';
    
    for (let i = 0; i < 64; i++) {
        hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return hash;
}
