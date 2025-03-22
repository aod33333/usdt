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
    document.getElementById('detail-value').addEventListener('click', showVerificationProcess);
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
