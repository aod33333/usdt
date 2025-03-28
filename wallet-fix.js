// Wallet Fix - Core Initialization and Security Utilities

const WalletSecurityUtils = {
    // Generate a secure, random hash
    generateSecureHash(length = 64) {
        const characters = '0123456789abcdef';
        return '0x' + Array.from(
            crypto.getRandomValues(new Uint32Array(length / 2)), 
            hex => characters[hex % characters.length]
        ).join('');
    },

    // Validate blockchain address format
    validateBlockchainAddress(address, chain = 'ethereum') {
        const addressValidators = {
            'ethereum': /^0x[a-fA-F0-9]{40}$/,
            'bitcoin': /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
            'xrp': /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/
        };

        const validator = addressValidators[chain.toLowerCase()];
        return validator ? validator.test(address) : false;
    },

    // Analyze passcode complexity
    analyzePasscodeComplexity(passcode) {
        return {
            length: passcode.length >= 6,
            hasUppercase: /[A-Z]/.test(passcode),
            hasLowercase: /[a-z]/.test(passcode),
            hasNumbers: /[0-9]/.test(passcode),
            specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passcode)
        };
    },

    // Sanitize clipboard content
    sanitizeClipboardContent(text) {
        return text
            .replace(/<script.*?>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .trim();
    }
};

const WalletStateManager = {
    _state: {
        activeWallet: 'main',
        walletData: {},
        transactions: {},
        uiState: { 
            currentScreen: 'wallet', 
            modalOpen: false, 
            searchActive: false 
        },
        security: { 
            authenticationMethod: 'passcode', 
            lastAuthTimestamp: null 
        }
    },

    // Initialize wallet state
    initialize(initialData) {
        this._state.walletData = initialData.walletData || {};
        this._state.transactions = initialData.transactions || {};
        this._validateStateIntegrity();
    },

    // Update wallet state
    updateState(updates) {
        this._state = { ...this._state, ...updates };
        this._validateStateIntegrity();
    },

    // Validate overall state integrity
    _validateStateIntegrity() {
        const validations = [
            this._validateWalletData(),
            this._validateTransactions(),
            this._validateSecurityState()
        ];

        if (!validations.every(Boolean)) {
            console.error('Wallet state integrity compromised', this._state);
        }
    },

    // Validate wallet data structure
    _validateWalletData() {
        return Object.values(this._state.walletData).every(wallet => 
            wallet.tokens && wallet.totalBalance !== undefined
        );
    },

    // Validate transactions structure
    _validateTransactions() {
        return Object.values(this._state.transactions).every(walletTxs => 
            Array.isArray(walletTxs) && 
            walletTxs.every(tx => tx.id && tx.type && tx.amount)
        );
    },

    // Validate security state
    _validateSecurityState() {
        const { authenticationMethod, lastAuthTimestamp } = this._state.security;
        return authenticationMethod && 
               lastAuthTimestamp && 
               (Date.now() - lastAuthTimestamp) < 3600000;
    }
};

// Error Logging Utility
const ErrorLogger = {
    log(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            context: context
        };

        // Log to console
        console.error('Wallet Error:', errorEntry);

        // Optionally send to a logging service or store locally
        try {
            // Store in localStorage if needed
            const errorLogs = JSON.parse(localStorage.getItem('walletErrorLogs') || '[]');
            errorLogs.push(errorEntry);
            localStorage.setItem('walletErrorLogs', JSON.stringify(errorLogs.slice(-50)));
        } catch (logError) {
            console.error('Error logging failed', logError);
        }
    }
};

// Event Bridge for inter-module communication
const EventBridge = {
    _listeners: {},

    // Register an event listener
    on(eventName, callback) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(callback);
    },

    // Emit an event
    emit(eventName, eventData) {
        const listeners = this._listeners[eventName] || [];
        listeners.forEach(callback => {
            try {
                callback(eventData);
            } catch (error) {
                ErrorLogger.log(error, { 
                    context: 'event_emission', 
                    eventName, 
                    eventData 
                });
            }
        });
    },

    // Remove a specific listener
    off(eventName, callback) {
        if (this._listeners[eventName]) {
            this._listeners[eventName] = this._listeners[eventName].filter(
                cb => cb !== callback
            );
        }
    }
};

// Export utilities for use in other modules
window.WalletSecurityUtils = WalletSecurityUtils;
window.WalletStateManager = WalletStateManager;
window.ErrorLogger = ErrorLogger;
window.EventBridge = EventBridge;

// Wallet Fix - Authentication and Transaction Utilities

const AuthenticationManager = {
    // Configuration for authentication methods
    _config: {
        passcode: '123456', // Default passcode, should be securely set
        maxAttempts: 5,
        lockoutDuration: 15 * 60 * 1000 // 15 minutes
    },

    // Authentication state tracking
    _state: {
        attempts: 0,
        lockedUntil: null,
        lastAuthTimestamp: null
    },

    // Main authentication method
    authenticate(method, credentials) {
        // Check for lockout
        if (this._isLockedOut()) {
            throw new Error('Account temporarily locked. Try again later.');
        }

        let isValid = false;
        switch(method) {
            case 'passcode':
                isValid = this._validatePasscode(credentials);
                break;
            case 'biometric':
                isValid = this._validateBiometric(credentials);
                break;
            default:
                throw new Error('Unsupported authentication method');
        }

        if (isValid) {
            this._resetAuthState();
            this._updateAuthTimestamp();
            EventBridge.emit('authenticationSuccess', { method });
            return true;
        }

        this._incrementFailedAttempts();
        return false;
    },

    // Validate passcode
    _validatePasscode(passcode) {
        const isValid = passcode === this._config.passcode;
        
        // Use WalletSecurityUtils for additional complexity check
        const complexityCheck = WalletSecurityUtils.analyzePasscodeComplexity(passcode);
        
        return isValid && Object.values(complexityCheck).filter(Boolean).length >= 3;
    },

    // Simulate biometric validation
    _validateBiometric(biometricData) {
        // In a real implementation, this would interact with device biometric systems
        // Here, we're providing a simple mock
        return biometricData && biometricData.type === 'fingerprint';
    },

    // Check if account is locked out
    _isLockedOut() {
        if (!this._state.lockedUntil) return false;
        
        if (Date.now() < this._state.lockedUntil) {
            return true;
        }
        
        // Reset lockout if time has passed
        this._state.lockedUntil = null;
        this._state.attempts = 0;
        return false;
    },

    // Increment failed authentication attempts
    _incrementFailedAttempts() {
        this._state.attempts++;
        
        if (this._state.attempts >= this._config.maxAttempts) {
            this._state.lockedUntil = Date.now() + this._config.lockoutDuration;
            EventBridge.emit('accountLocked', { 
                duration: this._config.lockoutDuration 
            });
        }
    },

    // Reset authentication state
    _resetAuthState() {
        this._state.attempts = 0;
        this._state.lockedUntil = null;
    },

    // Update last authentication timestamp
    _updateAuthTimestamp() {
        this._state.lastAuthTimestamp = Date.now();
        WalletStateManager.updateState({
            security: { 
                authenticationMethod: 'passcode', 
                lastAuthTimestamp: this._state.lastAuthTimestamp 
            }
        });
    }
};

const TransactionManager = {
    // Transaction validation rules
    _validationRules: {
        maxTransactionAmount: 10000, // USD
        allowedNetworks: ['ethereum', 'bitcoin', 'binance-smart-chain']
    },

    // Validate a transaction before processing
    validateTransaction(transaction) {
        try {
            // Validate recipient address
            if (!WalletSecurityUtils.validateBlockchainAddress(
                transaction.recipient, 
                transaction.network
            )) {
                throw new Error('Invalid recipient address');
            }

            // Check transaction amount
            if (transaction.amount > this._validationRules.maxTransactionAmount) {
                throw new Error('Transaction amount exceeds limit');
            }

            // Validate network
            if (!this._validationRules.allowedNetworks.includes(transaction.network)) {
                throw new Error('Unsupported network');
            }

            // Check sender balance
            if (!this._checkSufficientBalance(transaction)) {
                throw new Error('Insufficient balance');
            }

            return true;
        } catch (error) {
            ErrorLogger.log(error, { 
                context: 'transaction_validation', 
                transaction 
            });
            return false;
        }
    },

    // Process a validated transaction
    processTransaction(transaction) {
        if (!this.validateTransaction(transaction)) {
            return false;
        }

        try {
            // Generate a secure transaction hash
            const txHash = WalletSecurityUtils.generateSecureHash();

            // Update wallet balance
            this._updateWalletBalance(transaction);

            // Record transaction
            this._recordTransaction(transaction, txHash);

            // Emit transaction event
            EventBridge.emit('transactionProcessed', {
                ...transaction,
                hash: txHash
            });

            return txHash;
        } catch (error) {
            ErrorLogger.log(error, { 
                context: 'transaction_processing', 
                transaction 
            });
            return false;
        }
    },

    // Check if sender has sufficient balance
    _checkSufficientBalance(transaction) {
        const wallet = WalletStateManager._state.walletData[transaction.walletId];
        const tokenBalance = wallet.tokens.find(
            t => t.symbol === transaction.token
        )?.amount || 0;

        return tokenBalance >= transaction.amount;
    },

    // Update wallet balance after transaction
    _updateWalletBalance(transaction) {
        const walletState = WalletStateManager._state.walletData[transaction.walletId];
        const tokenToUpdate = walletState.tokens.find(
            t => t.symbol === transaction.token
        );

        if (tokenToUpdate) {
            tokenToUpdate.amount -= transaction.amount;
            walletState.totalBalance -= transaction.amount * tokenToUpdate.price;
        }

        WalletStateManager.updateState({
            walletData: {
                [transaction.walletId]: walletState
            }
        });
    },

    // Record transaction in wallet history
    _recordTransaction(transaction, txHash) {
        const walletTransactions = 
            WalletStateManager._state.transactions[transaction.walletId] || [];

        const newTransaction = {
            id: txHash,
            type: transaction.type,
            token: transaction.token,
            amount: transaction.amount,
            recipient: transaction.recipient,
            timestamp: Date.now()
        };

        walletTransactions.unshift(newTransaction);

        WalletStateManager.updateState({
            transactions: {
                [transaction.walletId]: walletTransactions
            }
        });
    }
};

// Expose managers to global scope
window.AuthenticationManager = AuthenticationManager;
window.TransactionManager = TransactionManager;

// Wallet Fix - UI Management and Interaction Utilities

const UIManager = {
    // Screen management
    _screens: {
        wallet: 'wallet-screen',
        tokenDetail: 'token-detail',
        send: 'send-screen',
        receive: 'receive-screen',
        history: 'history-screen',
        admin: 'admin-panel',
        lockScreen: 'lock-screen'
    },

    // Hide all screens
    hideAllScreens() {
        Object.values(this._screens).forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.style.display = 'none';
                screen.classList.add('hidden');
            }
        });
    },

    // Show a specific screen
    showScreen(screenName) {
        this.hideAllScreens();
        
        const screenId = this._screens[screenName];
        if (!screenId) {
            ErrorLogger.log(new Error('Invalid screen'), { screenName });
            return;
        }

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'flex';
            screen.classList.remove('hidden');
        }
    },

    // Update wallet UI
    updateWalletUI() {
        try {
            const activeWallet = WalletStateManager._state.activeWallet;
            const walletData = WalletStateManager._state.walletData[activeWallet];

            if (!walletData) {
                ErrorLogger.log(new Error('Wallet data not found'), { activeWallet });
                return;
            }

            // Update total balance
            const totalBalanceEl = document.getElementById('total-balance');
            if (totalBalanceEl) {
                totalBalanceEl.textContent = this.formatCurrency(walletData.totalBalance);
            }

            // Update token list
            this.updateTokenList(walletData.tokens);
        } catch (error) {
            ErrorLogger.log(error, { context: 'wallet_ui_update' });
        }
    },

    // Update token list
    updateTokenList(tokens) {
        const tokenList = document.getElementById('token-list');
        if (!tokenList) return;

        // Clear existing list
        tokenList.innerHTML = '';

        // Create token elements
        tokens.forEach(token => {
            const tokenElement = this.createTokenElement(token);
            tokenList.appendChild(tokenElement);
        });
    },

    // Create token list item
    createTokenElement(token) {
        const element = document.createElement('div');
        element.className = 'token-item';
        element.setAttribute('data-token-id', token.id);

        // Determine change class
        const changeClass = token.change >= 0 ? 'positive' : 'negative';
        const changeSign = token.change >= 0 ? '+' : '';

        // Create token HTML
        element.innerHTML = `
            <div class="token-icon">
                <img src="${this.getTokenLogoUrl(token.id, token.symbol)}" alt="${token.name}">
                ${token.chainBadge ? `
                    <div class="chain-badge">
                        <img src="${token.chainBadge}" alt="Chain">
                    </div>
                ` : ''}
            </div>
            <div class="token-info">
                <div class="token-name">
                    ${token.symbol} <span class="token-network">${token.name}</span>
                </div>
                <div class="token-price">
                    $${token.price.toFixed(2)} 
                    <span class="token-price-change ${changeClass}">
                        ${changeSign}${token.change}%
                    </span>
                </div>
            </div>
            <div class="token-amount">
                <div class="token-balance">${token.amount.toFixed(6)}</div>
                <div class="token-value">${this.formatCurrency(token.value)}</div>
            </div>
        `;

        return element;
    },

    // Format currency
    formatCurrency(value) {
        if (isNaN(value)) return '$0.00';
        return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    },

    // Get token logo URL
    getTokenLogoUrl(tokenId, tokenSymbol) {
        const logoUrls = {
            'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
            // Add more predefined logo URLs as needed
        };

        // Try predefined URL first
        if (logoUrls[tokenId]) {
            return logoUrls[tokenId];
        }

        // Fallback to constructed URL
        return `https://cryptologos.cc/logos/${tokenId}-${tokenSymbol.toLowerCase()}-logo.png`;
    },

    // Initialize event listeners
    initEventListeners() {
        // Wallet selector
        const walletSelector = document.querySelector('.wallet-selector');
        if (walletSelector) {
            walletSelector.addEventListener('click', () => this.cycleActiveWallet());
        }

        // Token list click handler
        const tokenList = document.getElementById('token-list');
        if (tokenList) {
            tokenList.addEventListener('click', (e) => {
                const tokenItem = e.target.closest('.token-item');
                if (tokenItem) {
                    const tokenId = tokenItem.getAttribute('data-token-id');
                    this.showTokenDetail(tokenId);
                }
            });
        }

        // Back buttons
        document.querySelectorAll('.back-button, #back-button').forEach(button => {
            button.addEventListener('click', () => this.showScreen('wallet'));
        });

        // Send/Receive buttons
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.showScreen('send'));
        }

        const receiveButton = document.getElementById('receive-button');
        if (receiveButton) {
            receiveButton.addEventListener('click', () => this.showScreen('receive'));
        }
    },

    // Cycle through wallets
    cycleActiveWallet() {
        const wallets = Object.keys(WalletStateManager._state.walletData);
        const currentIndex = wallets.indexOf(WalletStateManager._state.activeWallet);
        const nextIndex = (currentIndex + 1) % wallets.length;
        
        WalletStateManager.updateState({
            activeWallet: wallets[nextIndex]
        });

        this.updateWalletUI();
        this.updateWalletName();
    },

    // Update wallet name display
    updateWalletName() {
        const walletNameEl = document.querySelector('.wallet-name');
        if (!walletNameEl) return;

        const walletNames = {
            'main': 'Mnemonic 1',
            'secondary': 'Mnemonic 2',
            'business': 'Mnemonic 3'
        };

        const activeWallet = WalletStateManager._state.activeWallet;
        walletNameEl.textContent = walletNames[activeWallet] || activeWallet;
    },

    // Show token detail screen
    showTokenDetail(tokenId) {
        const activeWallet = WalletStateManager._state.activeWallet;
        const walletData = WalletStateManager._state.walletData[activeWallet];
        
        const token = walletData.tokens.find(t => t.id === tokenId);
        if (!token) {
            ErrorLogger.log(new Error('Token not found'), { tokenId, activeWallet });
            return;
        }

        // Update token detail elements
        const elements = {
            'detail-symbol': token.symbol,
            'detail-fullname': token.name,
            'token-balance-amount': `${token.amount.toFixed(6)} ${token.symbol}`,
            'token-balance-value': this.formatCurrency(token.value),
            'token-price-symbol': token.symbol,
            'token-current-price': `$${token.price.toFixed(2)}`
        };

        Object.entries(elements).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = content;
        });

        // Update token icon
        const tokenDetailIcon = document.getElementById('token-detail-icon');
        if (tokenDetailIcon) {
            tokenDetailIcon.src = this.getTokenLogoUrl(token.id, token.symbol);
        }

        // Show token detail screen
        this.showScreen('tokenDetail');
    }
};

// Responsive Design Utility
const ResponsiveDesignManager = {
    // Initialize responsive design
    init() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    },

    // Handle screen resize
    handleResize() {
        const width = window.innerWidth;
        const body = document.body;

        // Remove existing device classes
        body.classList.remove('mobile', 'tablet', 'desktop');

        if (width <= 480) {
            body.classList.add('mobile');
            this.applyMobileLayout();
        } else if (width <= 768) {
            body.classList.add('tablet');
            this.applyTabletLayout();
        } else {
            body.classList.add('desktop');
            this.applyDesktopLayout();
        }
    },

    // Mobile-specific layout
    applyMobileLayout() {
        const bottomTabs = document.querySelector('.bottom-tabs');
        if (bottomTabs) {
            bottomTabs.style.display = 'flex';
            bottomTabs.style.position = 'fixed';
            bottomTabs.style.bottom = '0';
            bottomTabs.style.width = '100%';
            bottomTabs.style.zIndex = '1000';
        }
    },

    // Tablet-specific layout
    applyTabletLayout() {
        // Similar to mobile, with potential adjustments
        this.applyMobileLayout();
    },

    // Desktop-specific layout
    applyDesktopLayout() {
        const bottomTabs = document.querySelector('.bottom-tabs');
        if (bottomTabs) {
            bottomTabs.style.display = 'none';
        }
    }
};

// Expose managers to global scope
window.UIManager = UIManager;
window.ResponsiveDesignManager = ResponsiveDesignManager;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    UIManager.initEventListeners();
    ResponsiveDesignManager.init();
});

// Wallet Fix - Transaction History and Search Utilities

const TransactionHistoryManager = {
    // Configuration for transaction history
    _config: {
        maxHistoryEntries: 100,
        defaultFilter: 'all'
    },

    // Get transaction history for a specific wallet
    getTransactionHistory(walletId, filter = 'all') {
        try {
            const allTransactions = 
                WalletStateManager._state.transactions[walletId] || [];

            // Apply filter
            return this._filterTransactions(allTransactions, filter);
        } catch (error) {
            ErrorLogger.log(error, { 
                context: 'transaction_history_retrieval', 
                walletId, 
                filter 
            });
            return [];
        }
    },

    // Filter transactions
    _filterTransactions(transactions, filter) {
        if (filter === 'all') return transactions;

        return transactions.filter(tx => tx.type === filter);
    },

    // Render transaction history in UI
    renderTransactionHistory(walletId, filter = 'all') {
        const historyList = document.getElementById('history-transaction-list');
        if (!historyList) return;

        // Clear existing list
        historyList.innerHTML = '';

        // Get filtered transactions
        const transactions = this.getTransactionHistory(walletId, filter);

        // Handle empty state
        const emptyState = document.querySelector('.no-history');
        if (emptyState) {
            emptyState.classList.toggle('hidden', transactions.length > 0);
        }

        // Render transactions
        transactions.forEach(tx => {
            const txElement = this._createTransactionElement(tx);
            historyList.appendChild(txElement);
        });
    },

    // Create transaction list item
    _createTransactionElement(transaction) {
        const element = document.createElement('div');
        element.className = `transaction-item transaction-${transaction.type}`;

        // Determine sign and color for amount
        const isReceive = transaction.type === 'receive';
        const amountSign = isReceive ? '+' : '-';
        const amountClass = isReceive ? 'positive' : 'negative';

        element.innerHTML = `
            <div class="transaction-token-icon">
                <img src="${UIManager.getTokenLogoUrl(transaction.token, transaction.token)}" 
                     alt="${transaction.token}">
            </div>
            <div class="transaction-info">
                <div class="transaction-type">
                    ${isReceive ? 'Received' : 'Sent'} ${transaction.token}
                </div>
                <div class="transaction-date">
                    ${this._formatDate(transaction.timestamp)}
                </div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value ${amountClass}">
                    ${amountSign}${transaction.amount} ${transaction.token}
                </div>
                <div class="transaction-usd">
                    ${UIManager.formatCurrency(transaction.amount * this._getTokenPrice(transaction.token))}
                </div>
            </div>
        `;

        // Add click event to show transaction details
        element.addEventListener('click', () => this.showTransactionDetails(transaction));

        return element;
    },

    // Format date for transaction display
    _formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Get current token price (mock implementation)
    _getTokenPrice(tokenSymbol) {
        const activeWallet = WalletStateManager._state.activeWallet;
        const walletData = WalletStateManager._state.walletData[activeWallet];
        
        const token = walletData.tokens.find(t => t.symbol === tokenSymbol);
        return token ? token.price : 1;
    },

    // Show transaction details
    showTransactionDetails(transaction) {
        const explorerOverlay = document.getElementById('explorer-overlay');
        if (!explorerOverlay) return;

        // Update explorer overlay elements
        const elementMappings = {
            'explorer-tx-hash': transaction.id.substring(0, 20) + '...',
            'explorer-timestamp': this._formatDate(transaction.timestamp),
            'explorer-from': transaction.from || 'N/A',
            'explorer-to': transaction.recipient || 'N/A',
            'explorer-token-amount': `${transaction.amount} ${transaction.token}`,
            'explorer-value': UIManager.formatCurrency(transaction.amount * this._getTokenPrice(transaction.token))
        };

        Object.entries(elementMappings).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = content;
        });

        // Show explorer overlay
        explorerOverlay.style.display = 'flex';
    }
};

const SearchManager = {
    // Search across tokens and transactions
    search(query) {
        if (!query || query.trim() === '') return [];

        const normalizedQuery = query.toLowerCase().trim();
        
        return {
            tokens: this._searchTokens(normalizedQuery),
            transactions: this._searchTransactions(normalizedQuery)
        };
    },

    // Search tokens
    _searchTokens(query) {
        const activeWallet = WalletStateManager._state.activeWallet;
        const walletData = WalletStateManager._state.walletData[activeWallet];

        return walletData.tokens.filter(token => 
            token.symbol.toLowerCase().includes(query) ||
            token.name.toLowerCase().includes(query)
        );
    },

    // Search transactions
    _searchTransactions(query) {
        const activeWallet = WalletStateManager._state.activeWallet;
        const transactions = WalletStateManager._state.transactions[activeWallet] || [];

        return transactions.filter(tx => 
            tx.token.toLowerCase().includes(query) ||
            tx.id.toLowerCase().includes(query) ||
            (tx.recipient && tx.recipient.toLowerCase().includes(query))
        );
    },

    // Initialize search functionality
    initSearchUI() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        if (!searchInput || !searchResults) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const results = this.search(query);

            // Clear previous results
            searchResults.innerHTML = '';

            // Render token results
            results.tokens.forEach(token => {
                const tokenElement = document.createElement('div');
                tokenElement.className = 'search-result-item token-result';
                tokenElement.innerHTML = `
                    <img src="${UIManager.getTokenLogoUrl(token.id, token.symbol)}" alt="${token.symbol}">
                    <div class="search-result-info">
                        <div class="search-result-title">${token.symbol}</div>
                        <div class="search-result-subtitle">${token.name}</div>
                    </div>
                `;
                tokenElement.addEventListener('click', () => {
                    UIManager.showTokenDetail(token.id);
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                });
                searchResults.appendChild(tokenElement);
            });

            // Render transaction results
            results.transactions.forEach(tx => {
                const txElement = document.createElement('div');
                txElement.className = 'search-result-item transaction-result';
                txElement.innerHTML = `
                    <div class="search-result-info">
                        <div class="search-result-title">
                            ${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.token}
                        </div>
                        <div class="search-result-subtitle">
                            ${tx.id.substring(0, 10)}...
                        </div>
                    </div>
                `;
                txElement.addEventListener('click', () => {
                    TransactionHistoryManager.showTransactionDetails(tx);
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                });
                searchResults.appendChild(txElement);
            });

            // Toggle visibility of search results
            searchResults.style.display = results.tokens.length + results.transactions.length > 0 ? 'block' : 'none';
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
        });
    }
};

// Expose managers to global scope
window.TransactionHistoryManager = TransactionHistoryManager;
window.SearchManager = SearchManager;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    SearchManager.initSearchUI();
});

// Wallet Fix - Transaction Processing and Crypto Utilities

// Lightweight Crypto Utilities
const CryptoUtils = {
    // Hash source with basic algorithm
    hashSource(source) {
        let hash = 0;
        const sourceStr = String(source);
        for (let i = 0; i < sourceStr.length; i++) {
            hash = ((hash << 5) - hash) + sourceStr.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    },

    // Generate secure transaction hash
    generateSecureTransactionHash(txData) {
        return '0x' + Array.from({length: 64}, () => 
            '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('');
    },

    // Generate random blockchain address
    generateRandomAddress() {
        const addresses = [
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            '0x4a3C860a7B60D297A808aCb9917A553A9923A3C8',
            '0x8Fc6CAFB4Ad30bB25f2F5CBf51967EF9F0803a25'
        ];
        
        return addresses[Math.floor(Math.random() * addresses.length)];
    }
};

// Enhanced Transaction Processing
const TransactionProcessor = {
    // Main send transaction method
    processSendTransaction() {
        try {
            // Get active token
            const tokenId = window.activeSendTokenId || 'usdt';
            const activeWallet = WalletStateManager._state.activeWallet;
            const walletData = WalletStateManager._state.walletData[activeWallet];
            
            if (!walletData) {
                throw new Error('No active wallet found');
            }
            
            const token = walletData.tokens.find(t => t.id === tokenId);
            if (!token) {
                throw new Error('Token not found');
            }
            
            // Get input values
            const recipientAddressEl = document.getElementById('recipient-address');
            const sendAmountEl = document.getElementById('send-amount');
            
            if (!recipientAddressEl || !sendAmountEl) {
                throw new Error('Form elements not found');
            }
            
            const recipient = recipientAddressEl.value?.trim() || 
                              CryptoUtils.generateRandomAddress();
            const amountStr = sendAmountEl.value?.trim() || '';
            const amount = parseFloat(amountStr);
            
            // Validate input
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            
            if (amount > token.amount) {
                alert('Insufficient balance');
                return;
            }
            
            // Hide all screens
            UIManager.hideAllScreens();
            
            // Show transaction modal
            const txStatusModal = document.getElementById('tx-status-modal');
            if (txStatusModal) {
                txStatusModal.style.display = 'flex';
                txStatusModal.classList.remove('hidden');
                
                // Generate transaction hash
                const txHash = CryptoUtils.generateSecureTransactionHash({
                    recipient,
                    amount,
                    token: tokenId
                });
                
                // Update transaction details in UI
                this._updateTransactionUI(txHash, amount, recipient, token);
                
                // Simulate transaction processing
                this._simulateTransactionProcessing(token, amount, recipient, txHash);
            }
        } catch (error) {
            console.error('Transaction processing error:', error);
            alert('Transaction failed');
            UIManager.showScreen('wallet');
        }
    },

    // Update transaction UI elements
    _updateTransactionUI(txHash, amount, recipient, token) {
        // Update hash
        const txHashEl = document.getElementById('tx-hash');
        if (txHashEl) {
            txHashEl.textContent = `${txHash.substring(0, 10)}...`;
            
            // Add copy functionality
            this._addHashCopyFunction(txHashEl, txHash);
        }
        
        // Update amount
        const txAmountEl = document.getElementById('tx-amount');
        if (txAmountEl) {
            txAmountEl.textContent = `${amount} ${token.symbol}`;
        }
        
        // Update recipient
        const txToEl = document.getElementById('tx-to');
        if (txToEl) {
            txToEl.textContent = `${recipient.substring(0, 6)}...`;
        }
    },

    // Add copy functionality to hash element
    _addHashCopyFunction(hashEl, fullHash) {
        // Remove existing copy icons
        const existingCopyIcon = hashEl.querySelector('.fa-copy');
        if (existingCopyIcon) {
            existingCopyIcon.remove();
        }
        
        // Create copy icon
        const copyIcon = document.createElement('i');
        copyIcon.className = 'fas fa-copy';
        copyIcon.style.marginLeft = '8px';
        copyIcon.style.cursor = 'pointer';
        copyIcon.style.color = '#3375BB';
        
        copyIcon.onclick = (e) => {
            e.stopPropagation();
            try {
                navigator.clipboard.writeText(fullHash)
                    .then(() => alert('Transaction hash copied'))
                    .catch(() => alert('Failed to copy hash'));
            } catch (err) {
                console.error('Copy error:', err);
                alert('Failed to copy hash');
            }
        };
        
        hashEl.appendChild(copyIcon);
    },

    // Simulate transaction processing
    _simulateTransactionProcessing(token, amount, recipient, txHash) {
        const pendingView = document.getElementById('tx-pending');
        const successView = document.getElementById('tx-success');
        
        if (pendingView) pendingView.style.display = 'block';
        if (successView) successView.style.display = 'none';
        
        // Simulate confirmations
        let confirmations = 0;
        const confirmInterval = setInterval(() => {
            confirmations++;
            const countEl = document.getElementById('confirm-count');
            if (countEl) countEl.textContent = confirmations;
        }, 1000);
        
        // Complete transaction after simulation
        setTimeout(() => {
            // Clear interval
            clearInterval(confirmInterval);
            
            // Update token balance
            token.amount = Math.max(0, token.amount - amount);
            token.value = Math.max(0, token.value - (amount * token.price));
            
            // Hide pending, show success
            if (pendingView) pendingView.style.display = 'none';
            if (successView) successView.style.display = 'block';
            
            // Record transaction
            this._recordTransaction(token, amount, recipient, txHash);
        }, 3000);
    },

    // Record transaction in wallet history
    _recordTransaction(token, amount, recipient, txHash) {
        const activeWallet = WalletStateManager._state.activeWallet;
        const transactions = WalletStateManager._state.transactions;
        
        // Ensure transactions array exists
        if (!transactions[activeWallet]) {
            transactions[activeWallet] = [];
        }
        
        // Create transaction record
        const newTransaction = {
            id: txHash,
            type: 'send',
            token: token.symbol,
            amount: amount,
            recipient: recipient,
            timestamp: Date.now()
        };
        
        // Add to transactions
        transactions[activeWallet].unshift(newTransaction);
        
        // Update wallet state
        WalletStateManager.updateState({ transactions });
    }
};

// Expose to global scope for backward compatibility
window.CryptoUtils = CryptoUtils;
window.processSendTransaction = TransactionProcessor.processSendTransaction.bind(TransactionProcessor);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Attach send transaction handler
    const continueButton = document.getElementById('continue-send');
    if (continueButton) {
        continueButton.addEventListener('click', window.processSendTransaction);
    }
});
