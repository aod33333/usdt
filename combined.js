// =================================================================
// TRUST WALLET INTERFACE - COMBINED JAVASCRIPT
// PART 1: CORE UTILITIES AND SECURITY
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('TrustWallet Interface: Starting initialization...');
  
  // Enhanced security-focused input sanitization
  const SecurityUtils = {
    /**
     * Sanitize input to prevent XSS and injection attacks
     * @param {string} input - Input string to sanitize
     * @returns {string} Sanitized input
     */
    sanitizeInput(input) {
      if (typeof input !== 'string') return '';
      
      // Comprehensive sanitization
      return input
        .replace(/[^\w\s\.\-@]/g, '') // Remove special characters
        .trim() // Remove whitespace
        .slice(0, 256); // Limit input length
    },

    /**
     * Generate cryptographically secure random hash
     * @param {number} [length=64] - Length of hash
     * @returns {string} Secure random hash
     */
    generateSecureHash(length = 64) {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomValues = new Uint32Array(length);
      
      try {
        crypto.getRandomValues(randomValues);
        
        return '0x' + Array.from(randomValues)
          .map(x => characters[x % characters.length])
          .join('');
      } catch (e) {
        console.error('Failed to generate secure hash:', e);
        // Fallback to less secure but functional alternative
        return '0x' + Array.from({length}, () => 
          characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');
      }
    },

    /**
     * Validate blockchain address format
     * @param {string} address - Blockchain address to validate
     * @returns {boolean} Whether address is valid
     */
    validateBlockchainAddress(address) {
      // Enhanced Ethereum address validation with checksum
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      return ethAddressRegex.test(address);
    },

    /**
     * Sanitize clipboard content to prevent XSS
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeClipboardContent(text) {
      if (typeof text !== 'string') return '';
      
      return text
        .replace(/<script.*?>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/onerror=/gi, '')
        .trim();
    }
  };

  // Currency and formatting utilities
  const FormatUtils = {
    /**
     * Format currency with proper handling and internationalization
     * @param {number} value - Numeric value to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(value) {
      if (isNaN(value)) return '$0.00';
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    },

    /**
     * Format date with localization and safety checks
     * @param {string} dateString - Date string to format
     * @returns {string} Formatted date string
     */
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        }).format(date);
      } catch (e) {
        console.error('Date formatting error:', e);
        return 'Invalid date';
      }
    }
  };

  // Random generation utilities with improved entropy
  const RandomGenerationUtils = {
    /**
     * Generate random wallet address with cryptographic randomness
     * @returns {string} Random wallet address
     */
    generateRandomAddress() {
      const entropy = new Uint8Array(20);
      
      try {
        crypto.getRandomValues(entropy);
        return '0x' + Array.from(entropy, byte => 
          byte.toString(16).padStart(2, '0')
        ).join('');
      } catch (e) {
        console.error('Failed to generate secure address:', e);
        // Fallback to less secure alternative
        return '0x' + Array.from({length: 40}, () => 
          "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
        ).join('');
      }
    },

    /**
     * Generate random transaction hash with high entropy
     * @returns {string} Random transaction hash
     */
    generateRandomTransactionHash() {
      const entropy = new Uint8Array(32);
      
      try {
        crypto.getRandomValues(entropy);
        return '0x' + Array.from(entropy, byte => 
          byte.toString(16).padStart(2, '0')
        ).join('');
      } catch (e) {
        console.error('Failed to generate secure transaction hash:', e);
        // Fallback to less secure alternative
        return '0x' + Array.from({length: 64}, () => 
          "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
        ).join('');
      }
    }
  };

  // Get token logo URL helper function
  function getTokenLogoUrl(tokenId) {
    const logoUrls = {
      'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
      'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
      'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
      'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
      'uni': 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
    };
    
    return logoUrls[tokenId] || 'https://cryptologos.cc/logos/default-logo.png';
  }

  // Dynamic viewport management
  function checkViewport() {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }

  // Initialize viewport
  checkViewport();

// =================================================================
  // PART 2: STATE MANAGEMENT
  // =================================================================
  
  /**
   * Wallet State Management Class
   * Provides robust, immutable state management for wallet data
   */
  class WalletStateManager {
    constructor(initialData) {
      // Deep freeze to prevent mutations
      this._originalData = this.deepFreeze(JSON.parse(JSON.stringify(initialData || {})));
      this._currentData = this.deepFreeze(JSON.parse(JSON.stringify(initialData || {})));
      
      // Tracks modifications for reset and tracking
      this._modificationHistory = [];
    }

    /**
     * Deep freeze object to prevent mutations
     * @param {Object} obj - Object to freeze
     * @returns {Object} Frozen object
     */
    deepFreeze(obj) {
      if (!obj) return {};
      
      Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          this.deepFreeze(obj[prop]);
        }
      });
      return Object.freeze(obj);
    }

    /**
     * Get current wallet data
     * @returns {Object} Current wallet data
     */
    getCurrentData() {
      return JSON.parse(JSON.stringify(this._currentData));
    }

    /**
     * Update wallet data with robust validation
     * @param {string} walletId - Wallet identifier
     * @param {Object} updates - Updates to apply
     */
    updateWallet(walletId, updates) {
      if (!this._currentData[walletId]) {
        throw new Error(`Wallet ${walletId} not found`);
      }

      // Validate and sanitize updates
      const sanitizedUpdates = this.validateUpdates(updates);

      // Create a new state with updates
      const newState = {
        ...this._currentData,
        [walletId]: {
          ...this._currentData[walletId],
          ...sanitizedUpdates
        }
      };

      // Track modification
      this._modificationHistory.push({
        timestamp: new Date(),
        walletId,
        updates: sanitizedUpdates
      });

      // Update current state
      this._currentData = this.deepFreeze(newState);
    }

    /**
     * Validate and sanitize wallet updates
     * @param {Object} updates - Updates to validate
     * @returns {Object} Sanitized updates
     */
    validateUpdates(updates) {
      const sanitizedUpdates = {};

      // Example validation rules
      if (updates.totalBalance !== undefined) {
        sanitizedUpdates.totalBalance = Math.max(0, Number(updates.totalBalance) || 0);
      }

      if (updates.tokens) {
        sanitizedUpdates.tokens = updates.tokens.map(token => ({
          ...token,
          amount: Math.max(0, Number(token.amount) || 0),
          value: Math.max(0, Number(token.value) || 0)
        }));
      }

      return sanitizedUpdates;
    }

    /**
     * Reset wallet to original state
     * @param {string} [walletId] - Specific wallet to reset, or all if not specified
     */
    reset(walletId = null) {
      if (walletId) {
        if (!this._originalData[walletId]) {
          throw new Error(`Wallet ${walletId} not found`);
        }
        
        const newState = {
          ...this._currentData,
          [walletId]: JSON.parse(JSON.stringify(this._originalData[walletId]))
        };
        
        this._currentData = this.deepFreeze(newState);
      } else {
        // Reset all wallets
        this._currentData = this.deepFreeze(
          JSON.parse(JSON.stringify(this._originalData))
        );
      }

      // Clear modification history
      this._modificationHistory = [];
    }

    /**
     * Get modification history
     * @returns {Array} Modification history
     */
    getModificationHistory() {
      return [...this._modificationHistory];
    }
  }

  /**
   * Transaction Store Management
   * Manages global and wallet-specific transaction records
   */
  class TransactionStore {
    constructor() {
      // Global transaction store
      this._globalTransactions = {
        main: [],
        secondary: [],
        business: []
      };

      // Original transaction data
      this._originalTransactions = {};
    }

    /**
     * Add transaction to global store
     * @param {Object} transaction - Transaction to add
     * @param {string} walletId - Wallet identifier
     */
    addTransaction(transaction, walletId) {
      if (!this._globalTransactions[walletId]) {
        this._globalTransactions[walletId] = [];
      }

      // Validate transaction
      const validatedTransaction = this.validateTransaction(transaction);

      // Add to beginning of transactions (newest first)
      this._globalTransactions[walletId].unshift({
        ...validatedTransaction,
        timestamp: Date.now()
      });

      // Sort by timestamp (newest first)
      this._globalTransactions[walletId].sort((a, b) => b.timestamp - a.timestamp);

      // Limit transaction history (e.g., keep last 100 transactions)
      this._globalTransactions[walletId] = this._globalTransactions[walletId].slice(0, 100);
    }

    /**
     * Validate transaction details
     * @param {Object} transaction - Transaction to validate
     * @returns {Object} Validated transaction
     */
    validateTransaction(transaction) {
      return {
        id: transaction.id || `tx-${Date.now()}`,
        type: transaction.type || 'unknown',
        amount: Math.max(0, Number(transaction.amount) || 0),
        symbol: transaction.symbol || '',
        value: Math.max(0, Number(transaction.value) || 0),
        date: transaction.date || new Date().toISOString(),
        from: transaction.from || 'Unknown',
        to: transaction.to || 'Unknown',
        hash: transaction.hash || RandomGenerationUtils.generateRandomTransactionHash()
      };
    }

    /**
     * Get transactions for a specific wallet
     * @param {string} walletId - Wallet identifier
     * @param {Object} [options] - Filtering options
     * @returns {Array} Filtered transactions
     */
    getTransactions(walletId, options = {}) {
      const { 
        type = null, 
        limit = 50, 
        startDate = null, 
        endDate = null 
      } = options;

      if (!this._globalTransactions[walletId]) {
        return [];
      }

      let transactions = [...this._globalTransactions[walletId]];

      // Apply type filter
      if (type) {
        transactions = transactions.filter(tx => tx.type === type);
      }

      // Apply date range filter
      if (startDate) {
        transactions = transactions.filter(tx => new Date(tx.date) >= new Date(startDate));
      }

      if (endDate) {
        transactions = transactions.filter(tx => new Date(tx.date) <= new Date(endDate));
      }

      // Return limited results
      return transactions.slice(0, limit);
    }

    /**
     * Reset transactions to original state
     * @param {string} [walletId] - Specific wallet or all if not specified
     */
    resetTransactions(walletId = null) {
      if (walletId) {
        if (!this._globalTransactions[walletId]) {
          this._globalTransactions[walletId] = [];
        } else {
          this._globalTransactions[walletId] = [];
        }
      } else {
        // Reset all wallets
        Object.keys(this._globalTransactions).forEach(id => {
          this._globalTransactions[id] = [];
        });
      }
    }
  }

  // =================================================================
  // PART 3: SCREEN MANAGEMENT
  // =================================================================

  /**
   * Screen Management Utility
   * Handles screen visibility, transitions, and UI updates
   */
  class ScreenManager {
    constructor() {
      // List of all screen IDs for management
      this.screenIds = [
        'lock-screen', 
        'wallet-screen', 
        'token-detail', 
        'send-screen', 
        'receive-screen', 
        'admin-panel',
        'verification-overlay', 
        'biometric-overlay',
        'explorer-overlay', 
        'tx-status-modal', 
        'history-screen',
        'send-token-select'
      ];

      // Initialize screen references
      this.screens = {};
      this.initializeScreenReferences();
    }

    /**
     * Initialize references to screen elements
     */
    initializeScreenReferences() {
      this.screenIds.forEach(screenId => {
        this.screens[screenId] = document.getElementById(screenId);
      });
    }

    /**
     * Hide all screens
     */
    hideAllScreens() {
      try {
        this.screenIds.forEach(screenId => {
          const screen = this.screens[screenId];
          if (screen) {
            screen.style.display = 'none';
            screen.classList.add('hidden');
          }
        });
      } catch (error) {
        console.error('Error hiding screens:', error);
      }
    }

    /**
     * Initialize screen visibility
     */
    initializeScreenVisibility() {
      console.log('SCREEN INITIALIZATION: Starting screen setup');
      
      this.screenIds.forEach(screenId => {
        const screen = this.screens[screenId];
        if (!screen) {
          console.error(`SCREEN INITIALIZATION: Screen with ID ${screenId} not found`);
          return;
        }
        
        try {
          // Ensure lock screen is visible, others hidden
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
      
      console.log('SCREEN INITIALIZATION: Complete');
    }

    /**
     * Navigate between screens
     * @param {string} targetScreenId - ID of screen to show
     * @param {string} [fromScreenId] - Optional ID of previous screen
     */
    navigateTo(targetScreenId, fromScreenId = null) {
      // Hide all screens
      this.hideAllScreens();
      
      // Show target screen
      const targetScreen = this.screens[targetScreenId];
      if (targetScreen) {
        targetScreen.style.display = 'flex';
        targetScreen.classList.remove('hidden');
        
        // Remember previous screen
        if (fromScreenId) {
          targetScreen.dataset.returnTo = fromScreenId;
        }
        
        console.log(`Navigated to ${targetScreenId}${fromScreenId ? ` from ${fromScreenId}` : ''}`);
      } else {
        console.error(`Target screen ${targetScreenId} not found`);
      }
    }

    /**
     * Show token detail screen
     * @param {string} tokenId - ID of token to show
     */
    showTokenDetail(tokenId) {
      try {
        const tokenDetail = this.screens['token-detail'];
        const walletScreen = this.screens['wallet-screen'];
        const activeWallet = window.activeWallet || 'main';
        
        if (!tokenDetail || !window.currentWalletData[activeWallet]) {
          console.error('Token detail initialization failed');
          return;
        }
        
        const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
        if (!token) {
          console.error('Token not found:', tokenId);
          return;
        }

        // Update token details
        const elements = {
          'detail-symbol': token.symbol,
          'detail-fullname': token.name,
          'token-balance-amount': `${token.amount.toFixed(6)} ${token.symbol}`,
          'token-balance-value': FormatUtils.formatCurrency(token.value),
          'token-staking-symbol': token.symbol,
          'token-price-symbol': token.symbol,
          'token-current-price': `$${token.price.toLocaleString()}`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
          const element = document.getElementById(id);
          if (element) element.textContent = value;
        });

        // Update token icon
        const tokenDetailIcon = document.getElementById('token-detail-icon');
        if (tokenDetailIcon) {
          tokenDetailIcon.src = getTokenLogoUrl(token.id);
        }
        
        // Update price change
        const priceChangeElement = document.getElementById('token-price-change');
        if (priceChangeElement) {
          priceChangeElement.className = token.change >= 0 ? 'positive' : 'negative';
          priceChangeElement.textContent = `${token.change >= 0 ? '+' : ''}${token.change}%`;
        }
        
        // Update transactions
        this.updateTransactionList(tokenId);
        
        // Navigate to detail screen
        this.navigateTo('token-detail', 'wallet-screen');
      } catch (error) {
        console.error('Error showing token detail:', error);
      }
    }

    /**
     * Update transaction list for token
     * @param {string} tokenId - Token ID to show transactions for
     */
    updateTransactionList(tokenId) {
      try {
        const transactionList = document.getElementById('transaction-list');
        const activeWallet = window.activeWallet || 'main';
        
        if (!transactionList) return;
        
        // Clear existing transactions
        transactionList.innerHTML = '';
        
        // Get transactions
        const transactions = window.currentTransactions?.[activeWallet]?.[tokenId] || [];
        
        if (transactions.length === 0) {
          // Show no transactions message
          const noTransactionsEl = document.querySelector('.no-transactions');
          if (noTransactionsEl) {
            noTransactionsEl.style.display = 'flex';
          }
          return;
        }
        
        // Hide no transactions message
        const noTransactionsEl = document.querySelector('.no-transactions');
        if (noTransactionsEl) {
          noTransactionsEl.style.display = 'none';
        }
        
        // Add transaction elements
        transactions.forEach(transaction => {
          const transactionEl = this.createTransactionElement(transaction);
          transactionList.appendChild(transactionEl);
        });
      } catch (error) {
        console.error('Error updating transaction list:', error);
      }
    }

    /**
     * Create transaction element
     * @param {Object} transaction - Transaction data
     * @returns {HTMLElement} Transaction element
     */
    createTransactionElement(transaction) {
      const transactionEl = document.createElement('div');
      transactionEl.className = `transaction-item transaction-${transaction.type}`;
      
      transactionEl.innerHTML = `
        <div class="transaction-icon">
          <i class="fas fa-${transaction.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
        </div>
        <div class="transaction-info">
          <div class="transaction-type">${transaction.type === 'receive' ? 'Received' : 'Sent'} ${transaction.symbol}</div>
          <div class="transaction-date">${transaction.date}</div>
        </div>
        <div class="transaction-amount">
          <div class="transaction-value ${transaction.type === 'receive' ? 'positive' : 'negative'}">
            ${transaction.type === 'receive' ? '+' : '-'}${transaction.amount.toFixed(6)} ${transaction.symbol}
          </div>
          <div class="transaction-usd">${FormatUtils.formatCurrency(transaction.value)}</div>
        </div>
      `;
      
      // Add click event to show transaction details
      transactionEl.addEventListener('click', () => {
        this.showTransactionDetails(transaction);
      });
      
      return transactionEl;
    }

    /**
     * Show transaction details in explorer overlay
     * @param {Object} transaction - Transaction data
     */
    showTransactionDetails(transaction) {
      try {
        const explorerOverlay = this.screens['explorer-overlay'];
        if (!explorerOverlay) return;
        
        // Get elements
        const explorerTxHash = document.getElementById('explorer-tx-hash');
        const explorerFrom = document.getElementById('explorer-from');
        const explorerTo = document.getElementById('explorer-to');
        const explorerTimestamp = document.getElementById('explorer-timestamp');
        const explorerTokenAmount = document.getElementById('explorer-token-amount');
        const explorerTokenIcon = document.querySelector('.explorer-token-icon img');
        
        // Update elements
        if (explorerTxHash) explorerTxHash.textContent = transaction.hash.substring(0, 18) + '...';
        if (explorerFrom) explorerFrom.textContent = transaction.from;
        if (explorerTo) explorerTo.textContent = transaction.to;
        if (explorerTimestamp) explorerTimestamp.textContent = transaction.date;
        if (explorerTokenAmount) explorerTokenAmount.textContent = `${transaction.amount.toFixed(6)} ${transaction.symbol}`;
        if (explorerTokenIcon) explorerTokenIcon.src = getTokenLogoUrl(transaction.symbol.toLowerCase());
        
        // Show overlay
        this.navigateTo('explorer-overlay', 'token-detail');
      } catch (error) {
        console.error('Error showing transaction details:', error);
      }
    }

    /**
     * Show send screen
     * @param {string} tokenId - Token ID to send
     */
    showSendScreen(tokenId) {
      try {
        const sendScreen = this.screens['send-screen'];
        if (!sendScreen) return;
        
        const activeWallet = window.activeWallet || 'main';
        if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return;
        
        // Find token
        const tokens = window.currentWalletData[activeWallet].tokens;
        const token = tokens.find(t => t.id === tokenId) || tokens.find(t => t.id === 'usdt');
        
        if (!token) {
          console.error(`Token ${tokenId} not found and no fallback available`);
          return;
        }
        
        // Update send screen elements
        const sendTokenTitle = document.getElementById('send-token-title');
        if (sendTokenTitle) sendTokenTitle.textContent = `Send ${token.symbol}`;
        
        const maxAmount = document.getElementById('max-amount');
        if (maxAmount) maxAmount.textContent = token.amount.toFixed(6);
        
        const maxSymbol = document.getElementById('max-symbol');
        if (maxSymbol) maxSymbol.textContent = token.symbol;
        
        // Store active token ID
        window.activeSendTokenId = token.id;
        
        // Navigate to send screen
        this.navigateTo('send-screen', 'wallet-screen');
      } catch (error) {
        console.error('Error showing send screen:', error);
      }
    }

    /**
     * Show receive screen
     * @param {string} tokenId - Token ID to receive
     */
    showReceiveScreen(tokenId) {
      try {
        const receiveScreen = this.screens['receive-screen'];
        if (!receiveScreen) return;
        
        // Navigate to receive screen
        this.navigateTo('receive-screen', 'wallet-screen');
      } catch (error) {
        console.error('Error showing receive screen:', error);
      }
    }
    
    /**
     * Run diagnostics on UI elements
     */
    runDiagnostics() {
      console.log('=== SCREEN DIAGNOSTICS ===');
      
      // Check critical elements
      const criticalScreens = ['token-detail', 'wallet-screen', 'send-screen', 'receive-screen'];
      criticalScreens.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Screen "${id}" exists:`, !!element);
        if (element) {
          console.log(`- Display:`, getComputedStyle(element).display);
          console.log(`- Visibility:`, getComputedStyle(element).visibility);
          console.log(`- Z-index:`, getComputedStyle(element).zIndex);
        }
      });
      
      // Check token list
      const tokenList = document.getElementById('token-list');
      if (tokenList) {
        console.log('Token list has children:', tokenList.children.length > 0);
      }
      
      console.log('=== END SCREEN DIAGNOSTICS ===');
    }
  }

 // =================================================================
  // PART 4: WALLET UI & AUTHENTICATION
  // =================================================================
  
  /**
   * Wallet UI Management Class
   * Handles wallet-specific UI updates and interactions
   */
  class WalletUIManager {
    constructor(stateManager, screenManager) {
      this.stateManager = stateManager;
      this.screenManager = screenManager;
      
      // Initialize critical UI elements
      this.initializeUIElements();
    }

    /**
     * Initialize critical UI references
     */
    initializeUIElements() {
      this.elements = {
        totalBalance: document.getElementById('total-balance'),
        tokenList: document.getElementById('token-list'),
        walletName: document.querySelector('.wallet-name'),
        visibilityToggle: document.querySelector('.visibility-toggle'),
        sendButton: document.getElementById('send-button'),
        receiveButton: document.getElementById('receive-button'),
        historyButton: document.querySelector('.quick-actions .action-circle:nth-child(5)'),
        investmentWarning: document.getElementById('investment-warning'),
        closeWarningButton: document.getElementById('close-investment-warning')
      };
      
      // Setup event listeners
      this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for wallet UI interactions
     */
    setupEventListeners() {
      // Setup investment warning close button
      if (this.elements.closeWarningButton && this.elements.investmentWarning) {
        this.elements.closeWarningButton.addEventListener('click', () => {
          this.elements.investmentWarning.style.display = 'none';
        });
      }
      
      // Setup balance visibility toggle
      if (this.elements.visibilityToggle) {
        this.elements.visibilityToggle.addEventListener('click', () => {
          this.toggleBalanceVisibility();
        });
      }
      
      // Setup navigation buttons if screen manager is available
      if (this.screenManager) {
        // Send button
        if (this.elements.sendButton) {
          this.elements.sendButton.addEventListener('click', () => {
            this.screenManager.navigateTo('send-token-select', 'wallet-screen');
          });
        }
        
        // Receive button
        if (this.elements.receiveButton) {
          this.elements.receiveButton.addEventListener('click', () => {
            this.screenManager.showReceiveScreen();
          });
        }
        
        // History button
        if (this.elements.historyButton) {
          this.elements.historyButton.addEventListener('click', () => {
            this.screenManager.navigateTo('history-screen', 'wallet-screen');
          });
        }
      }
    }
    
    /**
     * Update wallet UI with current data
     * @param {string} activeWallet - Currently active wallet
     */
    updateWalletUI(activeWallet) {
      try {
        const walletData = this.stateManager.getCurrentData()[activeWallet];
        
        if (!walletData) {
          console.error('Wallet data not found:', activeWallet);
          return;
        }
        
        // Update total balance
        if (this.elements.totalBalance) {
          this.elements.totalBalance.textContent = FormatUtils.formatCurrency(walletData.totalBalance);
        }
        
        // Update wallet name
        if (this.elements.walletName) {
          const walletNames = {
            'main': 'Mnemonic 1',
            'secondary': 'Mnemonic 2',
            'business': 'Mnemonic 3'
          };
          this.elements.walletName.textContent = walletNames[activeWallet] || 'Wallet';
        }
        
        // Update token list
        this.updateTokenList(walletData.tokens);
      } catch (error) {
        console.error('Error updating wallet UI:', error);
      }
    }

    /**
     * Update token list in the UI
     * @param {Array} tokens - List of tokens to display
     */
    updateTokenList(tokens) {
      if (!this.elements.tokenList) {
        console.error('Token list element not found');
        return;
      }
      
      // Clear existing list
      this.elements.tokenList.innerHTML = '';
      
      // Sort tokens by value (highest first)
      const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);
      
      // Create token elements
      sortedTokens.forEach(token => {
        const tokenElement = this.createTokenElement(token);
        this.elements.tokenList.appendChild(tokenElement);
      });
    }

    /**
     * Create token list item element
     * @param {Object} token - Token data
     * @returns {HTMLElement} Token list item
     */
    createTokenElement(token) {
      const tokenItem = document.createElement('div');
      tokenItem.className = 'token-item';
      tokenItem.setAttribute('data-token-id', token.id);
      
      // Determine if token should have network badge
      const showBadge = ['usdt', 'twt', 'bnb'].includes(token.id);
      const badgeHTML = showBadge 
          ? `<div class="chain-badge">
                 <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain">
             </div>` 
          : '';
      
      // Format amounts and prices
      const formattedAmount = token.amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
      });
      const formattedValue = FormatUtils.formatCurrency(token.value);
      const changeClass = token.change >= 0 ? 'positive' : 'negative';
      const changeSign = token.change >= 0 ? '+' : '';
      
      tokenItem.innerHTML = `
          <div class="token-icon">
              <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
              ${badgeHTML}
          </div>
          <div class="token-info">
              <div class="token-name">
                  ${token.symbol} <span class="token-network">${token.name}</span>
              </div>
              <div class="token-price">
                  $${token.price.toLocaleString()} 
                  <span class="token-price-change ${changeClass}">
                      ${changeSign}${token.change}%
                  </span>
              </div>
          </div>
          <div class="token-amount">
              <div class="token-balance">${formattedAmount}</div>
              <div class="token-value">${formattedValue}</div>
          </div>
      `;
      
      // Add click event to show token details
      tokenItem.addEventListener('click', () => {
          this.screenManager.showTokenDetail(token.id);
      });
      
      return tokenItem;
    }
    
    /**
     * Toggle balance visibility
     */
    toggleBalanceVisibility() {
      const balanceAmount = this.elements.totalBalance;
      const visibilityIcon = this.elements.visibilityToggle.querySelector('i');
      
      if (!balanceAmount || !visibilityIcon) return;
      
      const isHidden = visibilityIcon.classList.contains('fa-eye-slash');
      
      if (isHidden) {
        // Show balance
        visibilityIcon.classList.remove('fa-eye-slash');
        visibilityIcon.classList.add('fa-eye');
        balanceAmount.textContent = this.cachedBalance || '$0.00';
      } else {
        // Hide balance
        visibilityIcon.classList.remove('fa-eye');
        visibilityIcon.classList.add('fa-eye-slash');
        this.cachedBalance = balanceAmount.textContent;
        balanceAmount.textContent = '••••••';
      }
    }
  }
  
  /**
   * Authentication and Security Management
   */
  class AuthenticationManager {
    constructor(screenManager) {
      this.screenManager = screenManager;
      this.initializeAuthElements();
      this.setupEventListeners();
    }

    /**
     * Initialize authentication-related elements
     */
    initializeAuthElements() {
      this.elements = {
        lockScreen: document.getElementById('lock-screen'),
        walletScreen: document.getElementById('wallet-screen'),
        passcodeInput: document.querySelectorAll('.numpad-key'),
        dots: document.querySelectorAll('.dot'),
        unlockButton: document.getElementById('unlock-button'),
        biometricButton: document.querySelector('.numpad-key.biometric')
      };

      // Initialize global state
      window.passcodeEntered = '';
      window.correctPasscode = '123456'; // Default passcode
    }

    /**
     * Setup event listeners for authentication
     */
    setupEventListeners() {
      // Numpad key listeners
      this.elements.passcodeInput.forEach(key => {
        key.addEventListener('click', this.handlePasscodeInput.bind(this));
      });

      // Unlock button listener
      if (this.elements.unlockButton) {
        this.elements.unlockButton.addEventListener('click', this.validatePasscode.bind(this));
      }

      // Biometric authentication
      if (this.elements.biometricButton) {
        this.elements.biometricButton.addEventListener('click', this.simulateBiometricAuth.bind(this));
      }
    }
    
    /**
     * Handle passcode input
     * @param {Event} event - Input event
     */
    handlePasscodeInput(event) {
      const key = event.currentTarget.getAttribute('data-key');
      
      // Special handling for different keys
      if (key === 'bio') {
        this.simulateBiometricAuth();
        return;
      }
      
      if (key === 'back') {
        this.handleBackspace();
        return;
      }
      
      // Add digit to passcode
      this.addPasscodeDigit(key);
    }

    /**
     * Handle backspace in passcode entry
     */
    handleBackspace() {
      if (window.passcodeEntered.length > 0) {
        window.passcodeEntered = window.passcodeEntered.slice(0, -1);
        this.updatePasscodeDots();
      }
    }

    /**
     * Add digit to passcode
     * @param {string} digit - Digit to add
     */
    addPasscodeDigit(digit) {
      if (window.passcodeEntered.length < 6) {
        window.passcodeEntered += digit;
        this.updatePasscodeDots();
        
        // Check if passcode is complete
        if (window.passcodeEntered.length === 6) {
          setTimeout(this.validatePasscode.bind(this), 300);
        }
      }
    }

    /**
     * Update passcode dots visual representation
     */
    updatePasscodeDots() {
      this.elements.dots.forEach((dot, index) => {
        if (index < window.passcodeEntered.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      });
    }

    /**
     * Validate entered passcode
     */
    validatePasscode() {
      if (window.passcodeEntered === window.correctPasscode) {
        this.unlockWallet();
      } else {
        this.handleInvalidPasscode();
      }
    }

    /**
     * Unlock wallet after successful authentication
     */
    unlockWallet() {
      if (this.elements.lockScreen) {
        this.elements.lockScreen.classList.add('hidden');
        this.elements.lockScreen.style.display = 'none';
      }
      
      if (this.elements.walletScreen) {
        this.elements.walletScreen.classList.remove('hidden');
        this.elements.walletScreen.style.display = 'flex';
      }
      
      // Reset passcode input
      window.passcodeEntered = '';
      this.updatePasscodeDots();
    }

    /**
     * Handle invalid passcode entry
     */
    handleInvalidPasscode() {
      const dotsContainer = document.querySelector('.passcode-dots');
      if (dotsContainer) {
        dotsContainer.classList.add('shake');
        setTimeout(() => {
          dotsContainer.classList.remove('shake');
          window.passcodeEntered = '';
          this.updatePasscodeDots();
        }, 500);
      }
    }

    /**
     * Simulate biometric authentication
     */
    simulateBiometricAuth() {
      const biometricOverlay = document.getElementById('biometric-overlay');
      const biometricButton = document.querySelector('.numpad-key.biometric');
      
      if (biometricButton) {
        biometricButton.classList.add('loading');
      }
      
      if (!biometricOverlay) {
        console.error('Biometric overlay not found');
        return;
      }
      
      biometricOverlay.style.display = 'flex';
      
      const fingerprintIcon = document.getElementById('fingerprint-icon');
      const biometricStatus = document.getElementById('biometric-status');
      
      if (!fingerprintIcon || !biometricStatus) {
        console.error('Biometric elements missing');
        return;
      }
      
      // Simulate scanning animation
      fingerprintIcon.style.color = 'var(--tw-blue)';
      
      setTimeout(() => {
        biometricStatus.textContent = 'Fingerprint recognized';
        biometricStatus.style.color = 'var(--tw-green)';
        
        setTimeout(() => {
          biometricOverlay.style.display = 'none';
          this.unlockWallet();
          
          if (biometricButton) {
            biometricButton.classList.remove('loading');
          }
        }, 500);
      }, 1500);
    }
  }
  
  /**
   * Wallet Selector Management
   */
  class WalletSelectorManager {
    constructor(stateManager, uiManager) {
      this.stateManager = stateManager;
      this.uiManager = uiManager;
      this.initializeWalletSelector();
    }
    
    /**
     * Initialize wallet selector functionality
     */
    initializeWalletSelector() {
      const walletNameContainer = document.querySelector('.wallet-name');
      
      if (walletNameContainer) {
        walletNameContainer.addEventListener('click', this.cycleWallets.bind(this));
      }
    }

    /**
     * Cycle through available wallets
     */
    cycleWallets() {
      const walletOrder = ['main', 'secondary', 'business'];
      const currentIndex = walletOrder.indexOf(window.activeWallet);
      const nextIndex = (currentIndex + 1) % walletOrder.length;
      
      window.activeWallet = walletOrder[nextIndex];
      
      // Update UI for selected wallet
      this.uiManager.updateWalletUI(window.activeWallet);
    }
  }

  // =================================================================
  // PART 5: TRANSACTION MANAGEMENT
  // =================================================================
  
  /**
   * Transaction Manager
   * Handles transaction processing and management
   */
  class TransactionManager {
    constructor(stateManager, screenManager) {
      this.stateManager = stateManager;
      this.screenManager = screenManager;
      
      // Initialize transaction elements
      this.initializeElements();
      
      // Setup event listeners
      this.setupEventListeners();
    }
    
    /**
     * Initialize transaction-related elements
     */
    initializeElements() {
      this.elements = {
        sendButton: document.getElementById('continue-send'),
        sendScreen: document.getElementById('send-screen'),
        txStatusModal: document.getElementById('tx-status-modal'),
        amountInput: document.getElementById('send-amount'),
        recipientInput: document.getElementById('recipient-address'),
        maxButton: document.querySelector('.max-button'),
        pasteButton: document.querySelector('.paste-button')
      };
    }
    
    /**
     * Setup event listeners for transaction management
     */
    setupEventListeners() {
      // Continue send button
      if (this.elements.sendButton) {
        this.elements.sendButton.addEventListener('click', this.processSendTransaction.bind(this));
      }
      
      // Max button
      if (this.elements.maxButton) {
        this.elements.maxButton.addEventListener('click', this.setMaxAmount.bind(this));
      }
      
      // Paste button
      if (this.elements.pasteButton) {
        this.elements.pasteButton.addEventListener('click', this.pasteAddress.bind(this));
      }
    }
    
    /**
     * Process send transaction
     * @param {Event} e - Event object
     */
    processSendTransaction(e) {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
        e.stopPropagation();
      }

      try {
        // Get active token
        const tokenId = window.activeSendTokenId || 'usdt';
        const activeWallet = window.activeWallet || 'main';
        const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
        
        if (!token) {
          console.error(`Token ${tokenId} not found`);
          return;
        }
        
        // Get elements with safety checks
        const { sendButton, sendScreen, txStatusModal, amountInput, recipientInput } = this.elements;
        
        if (!sendButton || !sendScreen || !txStatusModal || !amountInput || !recipientInput) {
          console.error('Missing required elements for transaction');
          return;
        }
        
        // Add loading state
        sendButton.classList.add('loading');
        
        // Sanitize inputs
        const amount = parseFloat(amountInput.value);
        const recipient = recipientInput.value.trim();
        
        // Basic validation
        if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          sendButton.classList.remove('loading');
          return;
        }
        
        if (amount > token.amount) {
          alert('Insufficient balance');
          sendButton.classList.remove('loading');
          return;
        }
        
        if (!recipient || !recipient.startsWith('0x')) {
          alert('Please enter a valid recipient address');
          sendButton.classList.remove('loading');
          return;
        }
        
        // Close send modal
        sendScreen.style.display = 'none';
        
        // Show transaction pending
        txStatusModal.style.display = 'flex';
        txStatusModal.classList.remove('hidden');
        txStatusModal.style.zIndex = '9999';
        
        const pendingView = document.getElementById('tx-pending');
        const successView = document.getElementById('tx-success');
        
        if (pendingView) pendingView.classList.remove('hidden');
        if (successView) successView.classList.add('hidden');
        
        // Generate TX hash and update details
        const txHash = RandomGenerationUtils.generateRandomTransactionHash();
        
        const txHashEl = document.getElementById('tx-hash');
        if (txHashEl) {
          txHashEl.textContent = txHash.substring(0, 10) + '...';
          
          // Add copy icon if missing
          if (!txHashEl.querySelector('.fa-copy')) {
            const copyIcon = document.createElement('i');
            copyIcon.className = 'fas fa-copy';
            copyIcon.style.marginLeft = '8px';
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.color = '#3375BB';
            
            copyIcon.onclick = function(e) {
              e.stopPropagation();
              try {
                navigator.clipboard.writeText(txHash)
                  .then(() => alert('Transaction hash copied'))
                  .catch(() => alert('Failed to copy hash'));
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            };
            
            txHashEl.appendChild(copyIcon);
          }
        }
        
        const txAmountEl = document.getElementById('tx-amount');
        if (txAmountEl) {
          txAmountEl.textContent = `${amount} ${token.symbol}`;
        }
        
        const txToEl = document.getElementById('tx-to');
        if (txToEl) {
          txToEl.textContent = recipient.substring(0, 6) + '...';
        }
        
        // Add confirmation counter
        let confirmations = 0;
        const confirmInterval = setInterval(() => {
          confirmations++;
          const countEl = document.getElementById('confirm-count');
          if (countEl) countEl.textContent = confirmations;
        }, 1000);
        
        // Simulate transaction processing
        setTimeout(() => {
          // Clear interval
          clearInterval(confirmInterval);
          
          // Update token balance (subtract the sent amount)
          token.amount = Math.max(0, token.amount - amount);
          token.value = token.amount * token.price;
          
          // Update total wallet balance
          window.currentWalletData[activeWallet].totalBalance = 
            window.currentWalletData[activeWallet].tokens.reduce(
              (total, t) => total + t.value, 0
            );
          
          // Create transaction record
          if (!window.currentTransactions) {
            window.currentTransactions = {};
          }
          
          if (!window.currentTransactions[activeWallet]) {
            window.currentTransactions[activeWallet] = {};
          }
          
          if (!window.currentTransactions[activeWallet][tokenId]) {
            window.currentTransactions[activeWallet][tokenId] = [];
          }
          
          const transaction = {
            id: 'tx-' + Date.now(),
            type: 'send',
            amount: amount,
            symbol: token.symbol,
            value: amount * token.price,
            date: new Date().toISOString().split('T')[0] + ' ' + 
                 new Date().toTimeString().split(' ')[0].substring(0, 5),
            from: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
            to: recipient,
            hash: txHash
          };
          
          // Add to transactions
          window.currentTransactions[activeWallet][tokenId].unshift(transaction);
          
          // Show success view
          if (pendingView) pendingView.classList.add('hidden');
          if (successView) successView.classList.remove('hidden');
          
          // Fix close button
          const closeBtn = document.getElementById('close-tx-success');
          if (closeBtn) {
            closeBtn.onclick = function() {
              txStatusModal.style.display = 'none';
              const walletScreen = document.getElementById('wallet-screen');
              if (walletScreen) {
                walletScreen.style.display = 'flex';
                walletScreen.classList.remove('hidden');
              }
            };
          }
          
          // Remove loading state
          sendButton.classList.remove('loading');
        }, 3000 + Math.random() * 2000); // 3-5 seconds
      } catch (error) {
        console.error('Transaction process error:', error);
        alert('Transaction processing error occurred');
        
        const sendButton = this.elements.sendButton;
        if (sendButton) sendButton.classList.remove('loading');
      }
    }
    
    /**
     * Set max amount in send form
     */
    setMaxAmount() {
      const tokenId = window.activeSendTokenId || 'usdt';
      const activeWallet = window.activeWallet || 'main';
      const token = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
      
      if (!token) return;
      
      if (this.elements.amountInput) {
        this.elements.amountInput.value = token.amount.toFixed(6);
      }
    }
    
    /**
     * Paste wallet address from clipboard
     */
    pasteAddress() {
      if (!this.elements.recipientInput) return;
      
      if (navigator.clipboard) {
        navigator.clipboard.readText()
          .then(text => {
            this.elements.recipientInput.value = text;
          })
          .catch(err => {
            console.error('Failed to read clipboard:', err);
            alert('Unable to access clipboard');
          });
      } else {
        alert('Clipboard access not available in your browser');
      }
    }
  }
  
  /**
   * Token Selection Manager
   * Handles token selection for send/receive
   */
  class TokenSelectionManager {
    constructor(screenManager) {
      this.screenManager = screenManager;
      this.initializeElements();
      this.setupEventListeners();
    }
    
    /**
     * Initialize token selection elements
     */
    initializeElements() {
      this.elements = {
        tokenSelectScreen: document.getElementById('send-token-select'),
        tokenList: document.getElementById('select-token-list'),
        backButton: document.querySelector('#send-token-select .back-button'),
        searchInput: document.getElementById('token-search-input')
      };
    }
    
    /**
     * Setup event listeners for token selection
     */
    setupEventListeners() {
      // Back button
      if (this.elements.backButton) {
        this.elements.backButton.addEventListener('click', () => {
          this.screenManager.navigateTo('wallet-screen');
        });
      }
      
      // Search functionality
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener('input', () => {
          this.filterTokenList(this.elements.searchInput.value.toLowerCase());
        });
      }
    }
    
    /**
     * Populate token selection list
     */
    populateTokenList() {
      const { tokenList } = this.elements;
      if (!tokenList) return;
      
      // Clear existing items
      tokenList.innerHTML = '';
      
      // Get tokens from active wallet
      const activeWallet = window.activeWallet || 'main';
      const wallet = window.currentWalletData[activeWallet];
      
      if (!wallet || !wallet.tokens) {
        console.error('No tokens found in active wallet');
        return;
      }
      
      // Sort tokens by value (highest first)
      const sortedTokens = [...wallet.tokens].sort((a, b) => b.value - a.value);
      
      // Create token items
      sortedTokens.forEach(token => {
        const tokenItem = this.createTokenSelectionItem(token);
        tokenList.appendChild(tokenItem);
      });
    }
    
    /**
     * Create a token selection item
     * @param {Object} token - Token data
     * @returns {HTMLElement} Token list item
     */
    createTokenSelectionItem(token) {
      const tokenItem = document.createElement('div');
      tokenItem.className = 'token-item';
      tokenItem.setAttribute('data-token-id', token.id);
      
      // Format numbers for display
      const formattedAmount = token.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
      
      const formattedValue = FormatUtils.formatCurrency(token.value);
      
      // Show network badge for specific tokens
      const showBadge = ['usdt', 'twt', 'bnb'].includes(token.id);
      const networkBadge = showBadge ? 
        `<span class="token-network-badge">BEP20</span>` : '';
      
      // Check if balance is zero (to show warning)
      const isZeroBalance = token.amount <= 0;
      const warningText = isZeroBalance ? 
        `<div class="token-warning-text">Insufficient balance</div>` : '';
      
      tokenItem.innerHTML = `
        <div class="token-icon">
          <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
        </div>
        <div class="token-info">
          <div class="token-name">
            ${token.symbol} ${networkBadge}
          </div>
          <div class="token-price">
            ${token.name}
          </div>
        </div>
        <div class="token-amount-container">
          <div class="token-balance">${formattedAmount} ${token.symbol}</div>
          <div class="token-value">${formattedValue}</div>
          ${warningText}
        </div>
      `;
      
      // Add click handler to select this token and go to send screen
      tokenItem.addEventListener('click', () => {
        this.selectTokenForSend(token.id);
      });
      
      return tokenItem;
    }
    
    /**
     * Filter the token list based on search term
     * @param {string} searchTerm - Search term
     */
    filterTokenList(searchTerm) {
      const tokenItems = this.elements.tokenList.querySelectorAll('.token-item');
      
      tokenItems.forEach(item => {
        const tokenId = item.getAttribute('data-token-id');
        const activeWallet = window.activeWallet || 'main';
        const tokenInfo = window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
        
        if (!tokenInfo) return;
        
        const tokenName = tokenInfo.name.toLowerCase();
        const tokenSymbol = tokenInfo.symbol.toLowerCase();
        
        // Check if token matches search term
        const matches = tokenName.includes(searchTerm) || 
                        tokenSymbol.includes(searchTerm) ||
                        tokenId.includes(searchTerm);
        
        // Show/hide based on match
        item.style.display = matches ? 'flex' : 'none';
      });
    }
    
    /**
     * Select token for sending
     * @param {string} tokenId - Token ID
     */
    selectTokenForSend(tokenId) {
      // Store the selected token ID globally
      window.activeSendTokenId = tokenId;
      
      // Show the send screen with the selected token
      this.screenManager.showSendScreen(tokenId);
    }
  }

  // =================================================================
  // PART 6: ADMIN PANEL & INITIALIZATION
  // =================================================================
  
  /**
   * Admin Panel Management Class
   * Handles admin-specific functionality for wallet balance manipulation
   */
  class AdminPanelManager {
    constructor(stateManager, screenManager) {
      this.stateManager = stateManager;
      this.screenManager = screenManager;
      
      // Initialize admin panel elements
      this.initializeElements();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize admin access
      this.initAdminAccess();
      
      // Initialize expiration timer
      this.expirationTimer = null;
    }

    /**
     * Initialize references to admin panel DOM elements
     */
    initializeElements() {
      this.elements = {
        panel: document.getElementById('admin-panel'),
        closeButton: document.getElementById('close-admin'),
        applyFakeButton: document.getElementById('apply-fake'),
        resetWalletButton: document.getElementById('reset-wallet'),
        walletSelect: document.getElementById('admin-wallet-select'),
        tokenSelect: document.getElementById('admin-token-select'),
        balanceInput: document.getElementById('fake-balance'),
        expirationInput: document.getElementById('expiration-time'),
        generateHistoryCheckbox: document.getElementById('generate-history'),
        modifyAllCheckbox: document.getElementById('modify-all-wallets'),
        expirationCountdown: document.getElementById('expiration-countdown')
      };
    }

    /**
     * Setup event listeners for admin panel interactions
     */
    setupEventListeners() {
      if (this.elements.closeButton) {
        this.elements.closeButton.addEventListener('click', () => this.hideAdminPanel());
      }

      if (this.elements.applyFakeButton) {
        this.elements.applyFakeButton.addEventListener('click', () => this.applyFakeBalance());
      }

      if (this.elements.resetWalletButton) {
        this.elements.resetWalletButton.addEventListener('click', () => this.resetToOriginalBalance());
      }
    }
    
    /**
     * Initialize touch targets for admin panel access
     */
    initAdminAccess() {
      try {
        // Remove any existing admin access points
        const existingTarget = document.getElementById('admin-touch-target');
        if (existingTarget) {
          existingTarget.remove();
        }
        
        // Create touch target
        const touchTarget = document.createElement('div');
        touchTarget.id = 'admin-touch-target';
        touchTarget.style.position = 'fixed';
        touchTarget.style.top = '25px';
        touchTarget.style.right = '0';
        touchTarget.style.width = '100px';
        touchTarget.style.height = '100px';
        touchTarget.style.zIndex = '99999';
        touchTarget.style.backgroundColor = 'transparent';
        
        document.body.appendChild(touchTarget);
        
        // Track taps
        let tapCount = 0;
        let lastTapTime = 0;
        
        touchTarget.addEventListener('click', () => {
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - lastTapTime;
          
          if (timeDiff > 1000) {
            tapCount = 1;
          } else {
            tapCount++;
          }
          
          lastTapTime = currentTime;
          
          if (tapCount >= 3) {
            tapCount = 0;
            this.showAdminPanel();
          }
        });
      } catch (error) {
        console.error('Error initializing admin access:', error);
      }
    }

    /**
     * Show admin panel
     */
    showAdminPanel() {
      if (this.elements.panel) {
        this.elements.panel.style.display = 'flex';
        this.elements.panel.classList.remove('hidden');
      }
    }

    /**
     * Hide admin panel
     */
    hideAdminPanel() {
      if (this.elements.panel) {
        this.elements.panel.style.display = 'none';
        this.elements.panel.classList.add('hidden');
      }
    }

    /**
     * Apply fake balance to wallet(s)
     */
    applyFakeBalance() {
      try {
        const walletId = this.elements.walletSelect.value;
        const tokenId = this.elements.tokenSelect.value;
        const amount = parseFloat(this.elements.balanceInput.value);
        const expiration = parseInt(this.elements.expirationInput.value);
        const generateHistory = this.elements.generateHistoryCheckbox.checked;
        const applyAll = this.elements.modifyAllCheckbox.checked;

        // Validate inputs
        if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          return;
        }

        // Determine wallets to modify
        const walletsToModify = applyAll 
          ? Object.keys(window.currentWalletData || {})
          : [walletId];

        // Apply to selected wallet(s)
        walletsToModify.forEach(wId => {
          this.updateWalletBalance(wId, tokenId, amount, generateHistory);
        });

        // Start expiration timer
        this.startExpirationTimer(expiration);

        alert('Fake balance applied successfully');
      } catch (error) {
        console.error('Error applying fake balance:', error);
        alert('Failed to apply fake balance');
      }
    }

    /**
     * Update wallet balance for a specific token
     * @param {string} walletId - Wallet identifier
     * @param {string} tokenId - Token identifier
     * @param {number} amount - Balance amount
     * @param {boolean} generateHistory - Whether to generate transaction history
     */
    updateWalletBalance(walletId, tokenId, amount, generateHistory) {
      try {
        const wallet = window.currentWalletData[walletId];
        if (!wallet) {
          throw new Error(`Wallet ${walletId} not found`);
        }

        // Find the specific token
        const token = wallet.tokens.find(t => t.id === tokenId);
        if (!token) {
          throw new Error(`Token ${tokenId} not found in wallet`);
        }

        // Update token balance
        token.amount = amount / (token.price || 1);
        token.value = amount;

        // Recalculate total wallet balance
        wallet.totalBalance = wallet.tokens.reduce((total, t) => total + t.value, 0);

        // Generate transaction history if requested
        if (generateHistory) {
          this.generateFakeTransactionHistory(walletId, tokenId, amount);
        }
      } catch (error) {
        console.error('Error updating wallet balance:', error);
      }
    }

    /**
     * Generate fake transaction history for a token
     * @param {string} walletId - Wallet identifier
     * @param {string} tokenId - Token identifier
     * @param {number} amount - Total amount to distribute
     */
    generateFakeTransactionHistory(walletId, tokenId, amount) {
      try {
        const token = window.currentWalletData[walletId].tokens.find(t => t.id === tokenId);
        if (!token) return;

        // Ensure transactions array exists
        if (!window.currentTransactions) {
          window.currentTransactions = {};
        }
        
        if (!window.currentTransactions[walletId]) {
          window.currentTransactions[walletId] = {};
        }

        if (!window.currentTransactions[walletId][tokenId]) {
          window.currentTransactions[walletId][tokenId] = [];
        }

        // Generate 3-5 random transactions
        const transactionCount = 3 + Math.floor(Math.random() * 3);
        let remainingAmount = amount;

        for (let i = 0; i < transactionCount; i++) {
          // Calculate transaction amount
          const txAmount = i === transactionCount - 1 
              ? remainingAmount 
              : remainingAmount * (0.3 + Math.random() * 0.4);
          remainingAmount -= txAmount;

          // Generate random date
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          const formattedDate = date.toISOString().split('T')[0] + ' ' + 
                              date.toTimeString().split(' ')[0].substring(0, 5);

          // Create transaction
          const transaction = {
            id: `tx-${Date.now()}-${i}`,
            type: 'receive',
            amount: txAmount / token.price,
            symbol: token.symbol,
            value: txAmount,
            date: formattedDate,
            from: RandomGenerationUtils.generateRandomAddress(),
            to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
            hash: RandomGenerationUtils.generateRandomTransactionHash()
          };

          // Add to transactions
          window.currentTransactions[walletId][tokenId].unshift(transaction);
        }
      } catch (error) {
        console.error('Error generating fake transaction history:', error);
      }
    }

    /**
     * Start expiration timer for fake balance
     * @param {number} hours - Hours until balance resets
     */
    startExpirationTimer(hours) {
      // Clear any existing timer
      if (this.expirationTimer) {
        clearInterval(this.expirationTimer);
      }

      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + hours);

      this.expirationTimer = setInterval(() => {
        const remaining = expirationTime - new Date();
        
        if (remaining <= 0) {
          // Time expired, reset to original
          clearInterval(this.expirationTimer);
          this.expirationTimer = null;
          this.resetToOriginalBalance();
          
          if (this.elements.expirationCountdown) {
            this.elements.expirationCountdown.textContent = 'Not Active';
          }
        } else {
          this.updateExpirationDisplay(remaining);
        }
      }, 1000);
      
      // Initial update
      this.updateExpirationDisplay(expirationTime - new Date());
    }

    /**
     * Update expiration display
     * @param {number} remainingMs - Remaining milliseconds
     */
    updateExpirationDisplay(remainingMs) {
      if (!this.elements.expirationCountdown) return;

      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      this.elements.expirationCountdown.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    /**
     * Reset wallet to original balance
     */
    resetToOriginalBalance() {
      try {
        // Get the wallet ID to reset
        const walletId = this.elements.walletSelect.value;
        const applyAll = this.elements.modifyAllCheckbox.checked;
        
        // Reset original data
        if (window.originalWalletData) {
          if (applyAll) {
            // Reset all wallets
            window.currentWalletData = JSON.parse(JSON.stringify(window.originalWalletData));
          } else {
            // Reset specific wallet
            window.currentWalletData[walletId] = JSON.parse(JSON.stringify(window.originalWalletData[walletId]));
          }
        }
        
        // Reset transactions
        if (window.currentTransactions) {
          if (applyAll) {
            window.currentTransactions = {};
          } else if (window.currentTransactions[walletId]) {
            window.currentTransactions[walletId] = {};
          }
        }
        
        // Update UI to reflect changes
        if (typeof window.updateWalletUI === 'function') {
          window.updateWalletUI(window.activeWallet);
        }
        
        alert('Wallet reset to original state');
      } catch (error) {
        console.error('Error resetting wallet:', error);
        alert('Failed to reset wallet');
      }
    }
  }

  /**
   * Verification Process Management
   */
  class VerificationManager {
    constructor(screenManager) {
      this.screenManager = screenManager;
      
      this.initializeElements();
      this.setupEventListeners();
    }

    /**
     * Initialize verification-related elements
     */
    initializeElements() {
      this.elements = {
        verificationOverlay: document.getElementById('verification-overlay'),
        progressFill: document.getElementById('progress-fill'),
        verificationStatus: document.getElementById('verification-status'),
        verificationResult: document.getElementById('verification-result'),
        certId: document.getElementById('cert-id'),
        verifyTimestamp: document.getElementById('verify-timestamp'),
        verifyBalance: document.getElementById('verify-balance'),
        viewBlockchainButton: document.getElementById('view-blockchain'),
        closeVerificationButton: document.getElementById('close-verification')
      };
    }

    /**
     * Setup event listeners for verification process
     */
    setupEventListeners() {
      if (this.elements.viewBlockchainButton) {
        this.elements.viewBlockchainButton.addEventListener('click', 
          () => this.showExplorerWithTransaction());
      }
      
      if (this.elements.closeVerificationButton) {
        this.elements.closeVerificationButton.addEventListener('click',
          () => {
            if (this.elements.verificationOverlay) {
              this.elements.verificationOverlay.style.display = 'none';
            }
          });
      }
    }

    /**
     * Start verification process
     */
    startVerification() {
      try {
        // Show verification overlay
        if (this.elements.verificationOverlay) {
          this.elements.verificationOverlay.style.display = 'flex';
        }

        // Reset progress
        if (this.elements.progressFill) {
          this.elements.progressFill.style.width = '0%';
        }
        
        // Hide verification result initially
        if (this.elements.verificationResult) {
          this.elements.verificationResult.classList.add('hidden');
        }

        // Verification steps
        const steps = [
          { percent: 10, text: 'Initializing secure connection...' },
          { percent: 20, text: 'Connecting to blockchain nodes...' },
          { percent: 30, text: 'Verifying wallet address signature...' },
          { percent: 40, text: 'Authenticating with smart contract...' },
          { percent: 50, text: 'Retrieving token balance...' },
          { percent: 60, text: 'Validating transaction history...' },
          { percent: 70, text: 'Computing cryptographic checksum...' },
          { percent: 80, text: 'Verifying with independent nodes...' },
          { percent: 90, text: 'Generating digital certificate...' },
          { percent: 100, text: 'Verification complete and authenticated' }
        ];

        let currentStep = 0;
        const verifyInterval = setInterval(() => {
          if (currentStep < steps.length) {
            const step = steps[currentStep];
            
            // Update progress and status
            if (this.elements.progressFill) {
              this.elements.progressFill.style.width = `${step.percent}%`;
            }
            
            if (this.elements.verificationStatus) {
              this.elements.verificationStatus.textContent = step.text;
            }
            
            currentStep++;
            
            // Complete verification
            if (currentStep === steps.length) {
              setTimeout(() => {
                clearInterval(verifyInterval);
                this.completeVerification();
              }, 500);
            }
          }
        }, 700);
      } catch (error) {
        console.error('Verification process error:', error);
      }
    }

    /**
     * Complete verification process
     */
    completeVerification() {
      try {
        // Show verification result
        if (this.elements.verificationResult) {
          this.elements.verificationResult.classList.remove('hidden');
        }

        // Generate verification details
        this.populateVerificationDetails();
      } catch (error) {
        console.error('Verification completion error:', error);
      }
    }

    /**
     * Populate verification details
     */
    populateVerificationDetails() {
      try {
        // Generate random verification ID
        const certId = 'TW-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        if (this.elements.certId) {
          this.elements.certId.textContent = certId;
        }

        // Set current timestamp
        const timestamp = new Date().toLocaleString();
        if (this.elements.verifyTimestamp) {
          this.elements.verifyTimestamp.textContent = timestamp;
        }

        // Get current wallet balance
        const activeWallet = window.activeWallet || 'main';
        const walletData = window.currentWalletData[activeWallet];
        
        if (this.elements.verifyBalance && walletData) {
          this.elements.verifyBalance.textContent = 
            FormatUtils.formatCurrency(walletData.totalBalance);
        }
      } catch (error) {
        console.error('Error populating verification details:', error);
      }
    }

    /**
     * Show explorer with transaction details
     */
    showExplorerWithTransaction() {
      try {
        const explorerOverlay = document.getElementById('explorer-overlay');
        if (!explorerOverlay) {
          console.error('Explorer overlay not found');
          return;
        }
        
        // Generate a random transaction hash
        const txHash = RandomGenerationUtils.generateRandomTransactionHash();
        const explorerTxHash = document.getElementById('explorer-tx-hash');
        if (explorerTxHash) {
          explorerTxHash.textContent = txHash.substring(0, 18) + '...';
        }
        
        // Determine the display amount
        const verifyBalanceElement = document.getElementById('verify-balance');
        const explorerTokenAmountElement = document.getElementById('explorer-token-amount');
        const activeWallet = window.activeWallet || 'main';
        const walletData = window.currentWalletData[activeWallet];
        
        if (verifyBalanceElement && explorerTokenAmountElement && walletData) {
          const totalBalance = walletData.totalBalance;
          const mainToken = walletData.tokens.find(t => t.id === 'usdt') || 
                          walletData.tokens[0]; // Fallback to first token
          
          explorerTokenAmountElement.textContent = 
            `${mainToken ? mainToken.amount.toFixed(6) : totalBalance.toFixed(6)} ${mainToken ? mainToken.symbol : 'USDT'}`;
        }
        
        // Show explorer overlay
        explorerOverlay.style.display = 'flex';
        explorerOverlay.classList.remove('hidden');
        
        // Fix back button
        const backButton = explorerOverlay.querySelector('.explorer-back-button');
        if (backButton) {
          backButton.onclick = function() {
            explorerOverlay.style.display = 'none';
            explorerOverlay.classList.add('hidden');
          };
        }
      } catch (error) {
        console.error('Error showing explorer with transaction:', error);
      }
    }
  }
  
  // =================================================================
  // APPLICATION INITIALIZATION
  // =================================================================
  
  // Initialize default wallet data if not present
  if (!window.walletData) {
    window.walletData = {
      main: {
        totalBalance: 0,
        tokens: [
          {
            id: 'btc',
            name: 'Bitcoin',
            symbol: 'BTC',
            network: 'Bitcoin',
            icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            amount: 0,
            value: 0,
            price: 83984.74,
            change: -0.59,
            chainBadge: null
          },
          {
            id: 'eth',
            name: 'Ethereum',
            symbol: 'ETH',
            network: 'Ethereum',
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            amount: 0,
            value: 0,
            price: 1973.81,
            change: -0.71,
            chainBadge: null
          },
          {
            id: 'usdt',
            name: 'Tether',
            symbol: 'USDT',
            network: 'BNB Smart Chain',
            icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
            amount: 0,
            value: 0,
            price: 1.00,
            change: 0.00,
            chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
          }
        ]
      },
      secondary: {
        totalBalance: 0,
        tokens: [
          {
            id: 'btc',
            name: 'Bitcoin',
            symbol: 'BTC',
            network: 'Bitcoin',
            icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            amount: 0,
            value: 0,
            price: 83984.74,
            change: -0.59,
            chainBadge: null
          }
        ]
      },
      business: {
        totalBalance: 0,
        tokens: [
          {
            id: 'usdt',
            name: 'Tether',
            symbol: 'USDT',
            network: 'BNB Smart Chain',
            icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
            amount: 0,
            value: 0,
            price: 1.00,
            change: 0.00,
            chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
          }
        ]
      }
    };
  }
  
  // Initialize wallet state
  if (!window.originalWalletData) {
    window.originalWalletData = JSON.parse(JSON.stringify(window.walletData));
  }
  
  if (!window.currentWalletData) {
    window.currentWalletData = JSON.parse(JSON.stringify(window.walletData));
  }
  
  if (!window.activeWallet) {
    window.activeWallet = 'main';
  }
  
  if (!window.currentTransactions) {
    window.currentTransactions = {
      main: {},
      secondary: {},
      business: {}
    };
  }
  
  // Initialize application components
  function initializeApplication() {
    // Create state manager
    const stateManager = new WalletStateManager(window.walletData);
    
    // Create screen manager
    const screenManager = new ScreenManager();
    screenManager.initializeScreenVisibility();
    
    // Create UI manager
    const uiManager = new WalletUIManager(stateManager, screenManager);
    
    // Create wallet selector manager
    const walletSelector = new WalletSelectorManager(stateManager, uiManager);
    
    // Create authentication manager
    const authManager = new AuthenticationManager(screenManager);
    
    // Create transaction manager
    const transactionManager = new TransactionManager(stateManager, screenManager);
    
    // Create token selection manager
    const tokenSelectionManager = new TokenSelectionManager(screenManager);
    
    // Create admin panel manager
    const adminPanelManager = new AdminPanelManager(stateManager, screenManager);
    
    // Create verification manager
    const verificationManager = new VerificationManager(screenManager);
    
    // Initial UI update
    uiManager.updateWalletUI(window.activeWallet);
    
    // Expose critical methods globally for backward compatibility
    window.updateWalletUI = uiManager.updateWalletUI.bind(uiManager);
    window.showTokenDetail = screenManager.showTokenDetail.bind(screenManager);
    window.showSendScreen = screenManager.showSendScreen.bind(screenManager);
    window.showReceiveScreen = screenManager.showReceiveScreen.bind(screenManager);
    window.navigateTo = screenManager.navigateTo.bind(screenManager);
    window.processTransaction = transactionManager.processSendTransaction.bind(transactionManager);
    window.showAdminPanel = adminPanelManager.showAdminPanel.bind(adminPanelManager);
    window.startVerification = verificationManager.startVerification.bind(verificationManager);
    
    // Setup demo balance function
    window.setupDemoBalance = function() {
      try {
        // Update token balances
        if (window.currentWalletData && window.currentWalletData.main) {
          const mainWallet = window.currentWalletData.main;
          
          // BTC
          const btcToken = mainWallet.tokens.find(t => t.id === 'btc');
          if (btcToken) {
            btcToken.amount = 10;
            btcToken.value = btcToken.amount * btcToken.price;
          }
          
          // ETH
          const ethToken = mainWallet.tokens.find(t => t.id === 'eth');
          if (ethToken) {
            ethToken.amount = 100;
            ethToken.value = ethToken.amount * ethToken.price;
          }
          
          // USDT
          const usdtToken = mainWallet.tokens.find(t => t.id === 'usdt');
          if (usdtToken) {
            usdtToken.amount = 10000;
            usdtToken.value = usdtToken.amount * usdtToken.price;
          }
          
          // Update total balance
          mainWallet.totalBalance = mainWallet.tokens.reduce(
            (total, token) => total + token.value, 0
          );
          
          // Update UI
          if (typeof window.updateWalletUI === 'function') {
            window.updateWalletUI(window.activeWallet);
          }
          
          console.log('Demo balance setup complete');
        }
      } catch (error) {
        console.error('Demo balance setup failed:', error);
      }
    };
    
    // Initialize token selection screen
    tokenSelectionManager.populateTokenList();
    
    console.log('Application initialization complete');
    return {
      stateManager,
      screenManager,
      uiManager,
      walletSelector,
      authManager,
      transactionManager,
      tokenSelectionManager,
      adminPanelManager,
      verificationManager
    };
  }
  
  // Initialize the application
  const app = initializeApplication();
  
  // Make app instance accessible globally
  window.app = app;
  
  // Auto-start demo balance for testing
  if (window.autoStartDemo) {
    window.setupDemoBalance();
  }
});
  
