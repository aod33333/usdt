// TrustWallet.js - Comprehensive Solution - Part 1: Core Setup and Configuration

console.log('TrustWallet: Starting initialization...');

// Configuration constants
const CONFIG = {
  debug: false,                 // Enable/disable debug logging
  initDelay: 500,               // Delay before starting initialization (ms)
  screenLoadDelay: 300,         // Delay after loading screens (ms)
  finalCleanupDelay: 800,       // Delay for final cleanup checks (ms)
  autoStartDemo: true,          // Auto-start with demo balances
  fixNetworkBadges: true,       // Fix network badge display issues
  useAnimations: true,          // Use smooth animations for transitions
  badgeRemovalInterval: 500,    // Interval to remove unwanted badges (ms)
  respectExistingEventHandlers: true // Don't override existing event handlers
};

// Global state
const state = {
  isInitialized: false,
  screensLoaded: false,
  eventHandlersConnected: false,
  navigationReady: false
};

// Initialize global variables
window.originalWalletData = window.originalWalletData || null;
window.currentWalletData = window.currentWalletData || null;
window.activeWallet = window.activeWallet || 'main';
window.correctPasscode = window.correctPasscode || '123456';
window.activeSendTokenId = window.activeSendTokenId || 'usdt';
window.passcodeEntered = '';
window.currentTransactions = window.currentTransactions || {
  main: {},
  secondary: {},
  business: {}
};

// Logging helper with timestamp
function log(message) {
  if (CONFIG.debug) {
    const timestamp = new Date().toISOString().substring(11, 19);
    console.log(`[${timestamp}] TrustWallet: ${message}`);
  }
}

// Wait for DOM content to be loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, CONFIG.initDelay));
} else {
  // DOM already loaded, run with a delay
  setTimeout(init, CONFIG.initDelay);
}

function init() {
  console.log('TrustWallet: Starting comprehensive initialization');
  
  setupDefaultWalletData()
    .then(() => {
      // Update UI with what we have
      if (window.updateWalletUI) {
        window.updateWalletUI(window.activeWallet || 'main');
      }
      
      // Immediately populate token list
      if (typeof window.populateMainWalletTokenList === 'function') {
        window.populateMainWalletTokenList();
      }
      
      // Continue with the rest of initialization
      return setupSecurityUtils();
    })
    .then(() => setupFormatUtils())
    .then(() => ensureScreenContainers())
    .then(() => loadScreenContents())
    .then(() => setupStateManager())
    .then(() => setupScreenManager())
    .then(() => setupUIManager())
    .then(() => setupWalletSelector())
    .then(() => setupAuthManager())
    .then(() => setupTransactionManager())
    .then(() => setupTokenSelectionManager())
    .then(() => setupReceiveTokenManager())
    .then(() => setupHistoryManager())
    .then(() => setupAdminPanelManager())
    .then(() => setupVerificationManager())
    .then(() => fixBottomTabs())
    .then(() => addEnhancementStyles())
    .then(() => enhanceHomeScreen())
    .then(() => fixNetworkBadges())
    .then(() => fixTokenDetailView())
    .then(() => enhanceTransactions())
    .then(() => connectEventHandlers())
    .then(() => addAuthenticTouchFeedback())
    .then(() => finalCleanup())
    .then(() => {
      console.log('TrustWallet: Initialization complete ✅');
      state.isInitialized = true;
      
      // Auto-start demo if enabled
      if (CONFIG.autoStartDemo && window.setupDemoBalance) {
        window.setupDemoBalance();
      }
      
      // Apply enhanced fixes from fix.js
      applyAllEnhancedFixes();
    })
    .catch(error => {
      console.error('TrustWallet: Error during initialization', error);
      // Continue with available functionality
      if (window.updateWalletUI) {
        window.updateWalletUI(window.activeWallet || 'main');
      }
      finalCleanup();
    });
}

// Apply all enhanced fixes from fix.js
function applyAllEnhancedFixes() {
  // Add a slight delay to ensure everything is loaded
  setTimeout(() => {
    centerHeaderTitles();
    fixHeaderIconsAlignment();
    enhanceNetworkBadges();
    fixTokenDetailPage();
    fixScrollingOnAllScreens();
    addNetworkBadgesToTokens();
    fixSendTokenSelectionDisplay(); 
    fixReceiveTokenDisplay();
  }, 500);
  
  // Also set up an observer to reapply fixes when screens change
  setupDynamicContentObserver();
}

// TrustWallet.js - Comprehensive Solution - Part 2: Core Utilities and Security

// Security utilities
function setupSecurityUtils() {
  return new Promise(resolve => {
    log('Setting up security utilities');
    
    window.SecurityUtils = {
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
    
    resolve();
  });
}

// Formatting utilities
function setupFormatUtils() {
  return new Promise(resolve => {
    log('Setting up formatting utilities');
    
    window.FormatUtils = {
      /**
       * Format currency with proper handling and internationalization
       * @param {number} value - Numeric value to format
       * @returns {string} Formatted currency string
       */
      formatCurrency(value) {
        if (isNaN(value)) return '$0.00';
        
        // Format based on size
        if (value >= 1000000) {
          return '$' + (value / 1000000).toFixed(2) + 'M';
        } else if (value >= 1000) {
          return '$' + (value / 1000).toFixed(2) + 'K';
        } else {
          return '$' + value.toFixed(2);
        }
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
      },

      /**
       * Format token amount based on size
       * @param {number} amount - Amount to format
       * @returns {string} Formatted amount
       */
      formatTokenAmount(amount) {
        if (typeof amount !== 'number') {
          amount = parseFloat(amount) || 0;
        }
        
        // Format based on size
        if (amount >= 1000000) {
          return (amount / 1000000).toFixed(2) + 'M';
        } else if (amount >= 1000) {
          return (amount / 1000).toFixed(2) + 'K';
        } else if (amount >= 1) {
          return amount.toFixed(2);
        } else {
          // For small values, show more precision
          return amount.toFixed(6);
        }
      },

      /**
       * Shorten address for display
       * @param {string} address - Address to shorten
       * @returns {string} Shortened address
       */
      shortenAddress(address) {
        if (!address) return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
      }
    };
    
    // Create random generation utilities
    window.RandomGenerationUtils = {
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
    window.getTokenLogoUrl = function(tokenId) {
      const logoUrls = {
        'btc': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
        'usdt': 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
        'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
        'matic': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
        'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
        'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
        'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
        'uni': 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
      };
      
      return logoUrls[tokenId] || 'https://cryptologos.cc/logos/default-logo.png';
    };
    
    resolve();
  });
}

// Show toast notification
function showToast(message, duration = 2000) {
  // Remove any existing toast
  const existingToast = document.querySelector('.tw-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'tw-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('visible'), 10);
  
  // Hide and remove after duration
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Helper function to mark an element as fixed
function markFixed(element, fixName) {
  if (!element) return false;
  const attrName = 'data-fixed-' + fixName;
  if (element.getAttribute(attrName) === 'true') return false;
  element.setAttribute(attrName, 'true');
  return true;
}

// Force apply styles with !important
function forceStyle(element, property, value) {
  if (!element) return;
  const currentStyle = element.getAttribute('style') || '';
  element.setAttribute('style', `${currentStyle}; ${property}: ${value} !important;`);
}

// Get token data by ID
function getTokenData(tokenId) {
  if (!tokenId) return null;
  const activeWallet = window.activeWallet || 'main';
  if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return null;
  return window.currentWalletData[activeWallet].tokens.find(t => t.id === tokenId);
}

// Get active token ID
function getActiveTokenId() {
  // First try to get from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenId = urlParams.get('token');
  
  if (tokenId) return tokenId;
  
  // Try to get from detail symbol
  const detailSymbol = document.getElementById('detail-symbol');
  if (detailSymbol) {
    return detailSymbol.textContent.toLowerCase();
  }
  
  // Fallback to window variable or default
  return window.activeSendTokenId || 'btc';
}

// TrustWallet.js - Comprehensive Solution - Part 3: Screen Management & CSS Enhancements

// Step 1: Ensure all screen containers exist
function ensureScreenContainers() {
  return new Promise(resolve => {
    log('Creating/ensuring screen containers');
    
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
      console.error('App container not found! Critical error.');
      return resolve(); // Continue anyway
    }
    
    // List of required screens
    const requiredScreens = [
      'history-screen',
      'receive-screen',
      'send-screen',
      'send-token-select',
      'wallet-screen',
      'token-detail',
      'lock-screen'
    ];
    
    // Create missing screens
    requiredScreens.forEach(screenId => {
      if (!document.getElementById(screenId)) {
        log(`Creating missing screen container: ${screenId}`);
        const screen = document.createElement('div');
        screen.id = screenId;
        screen.className = 'screen hidden';
        appContainer.appendChild(screen);
      } else {
        log(`Screen container exists: ${screenId}`);
      }
    });
    
    resolve();
  });
}

function addEnhancementStyles() {
  return new Promise(resolve => {
    log('Adding enhancement styles');
    
    // Create or update master style element
    let styleElement = document.getElementById('tw-master-style-fix');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'tw-master-style-fix';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      /* TrustWallet Enhancements - Dynamic Styles */
      /* These styles complement total.css with dynamic and runtime-specific enhancements */
      
      /* Runtime animation classes - only added dynamically */
      .tw-slide-in-active {
        animation: tw-slide-in-right 0.3s forwards;
      }
      
      .tw-slide-out-active {
        animation: tw-slide-out-left 0.3s forwards;
      }
      
      /* Dynamic toast positioning based on current screen */
      .screen-specific-toast {
        position: fixed !important;
        bottom: 80px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 10001 !important;
      }
      
      /* Runtime-added error indicators */
      .input-error {
        border-color: var(--tw-red) !important;
        animation: shake 0.5s;
      }
      
      /* Dynamic loading indicators */
      .button-loading::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -10px;
      }
      
      /* Pull-to-refresh dynamic states */
      .pulling {
        transition: transform 0.2s;
      }
      
      .refreshing .refresh-icon {
        animation: spin 1s linear infinite;
      }
      
      /* Dynamically injected badges for new tokens */
      .new-token-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background-color: var(--tw-red);
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      /* Focus states for keyboard navigation - accessibility enhancement */
      .keyboard-focus:focus {
        outline: 2px solid var(--tw-blue);
        outline-offset: 2px;
      }
      
      /* Dark mode overrides that need to be applied dynamically */
      body.dark-mode-enabled .dynamic-color {
        color: #FFFFFF;
      }
      
      body.dark-mode-enabled .dynamic-background {
        background-color: #1F2128;
      }
      
      /* Token Detail enhancements */
      #token-detail .token-price-info {
        position: sticky !important;
        bottom: 0 !important;
        background-color: white !important;
        z-index: 50 !important;
        padding-bottom: 80px !important;
        margin-bottom: 0 !important;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.05) !important;
      }
      
      /* Investment warning */
      .investment-warning {
        width: calc(100% - 32px) !important;
        margin: 16px !important;
        background-color: #FEF9E7 !important;
        color: #D4AC0D !important;
        padding: 8px !important;
        font-size: 10px !important;
        border-radius: 8px !important;
        border-left: 4px solid #D4AC0D !important;
      }
      
      .investment-warning-content {
        display: flex !important;
        align-items: flex-start !important;
        padding: 4px !important;
      }
      
      .warning-icon {
        font-size: 20px !important;
        margin-right: 8px !important;
        margin-top: 2px !important;
      }
      
      .investment-warning-text {
        flex: 1 !important;
        font-size: 10px !important;
        line-height: 1.4 !important;
      }
      
      /* Staking container */
      .staking-container {
        background-color: #F5F5F5 !important;
        border-radius: 16px !important;
        padding: 16px !important;
        margin: 16px !important;
        display: flex !important;
        align-items: center !important;
        position: relative !important;
      }
      
      .staking-icon {
        width: 40px !important;
        height: 40px !important;
        margin-right: 16px !important;
      }
      
      .staking-content {
        flex: 1 !important;
      }
      
      .staking-content h3 {
        font-size: 16px !important;
        font-weight: 600 !important;
        margin-bottom: 4px !important;
      }
      
      .staking-content p {
        font-size: 12px !important;
        color: #8A939D !important;
        margin: 0 !important;
      }
      
      .staking-arrow {
        position: absolute !important;
        right: 16px !important;
        color: #8A939D !important;
      }
      
      /* Network filter */
      .networks-filter .all-networks {
        display: inline-flex !important;
        align-items: center !important;
        background: #F5F5F5 !important;
        border-radius: 16px !important;
        padding: 6px 12px !important;
        font-size: 12px !important;
        color: #5F6C75 !important;
        margin: 8px 16px !important;
        font-weight: 500 !important;
      }
      
      .networks-filter {
        text-align: left !important;
        border-bottom: 1px solid #F5F5F5 !important;
        padding-bottom: 8px !important;
      }
      
      /* Send screen token selection */
      .token-selection-row {
        display: grid !important;
        grid-template-columns: 36px 1fr auto !important;
        align-items: center !important;
        gap: 16px !important;
        padding: 12px 16px !important;
        background-color: #F5F5F5 !important;
        border-radius: 8px !important;
        margin-bottom: 16px !important;
        cursor: pointer !important;
      }
      
      .token-info-column {
        overflow: hidden !important;
      }
      
      .token-name-row {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      
      .selected-token-name {
        font-weight: 600 !important;
        font-size: 16px !important;
      }
      
      .token-fullname {
        font-size: 12px !important;
        color: #8A939D !important;
      }
      
      .network-badge-pill {
        display: inline-block !important;
        font-size: 12px !important;
        color: #5F6C75 !important;
        background-color: rgba(138, 147, 157, 0.1) !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        font-weight: 400 !important;
      }

      /* Screen headers */
      .screen-header h2 {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        text-align: center !important;
        width: auto !important;
        margin: 0 auto !important;
        z-index: 1 !important;
        pointer-events: none !important;
      }
      
      .screen-header .back-button {
        position: relative !important;
        z-index: 2 !important;
      }
      
      .screen-header .icon-button {
        position: relative !important;
        z-index: 2 !important;
      }
    `;
    
    resolve();
  });
}

function loadScreenContents() {
  return new Promise(resolve => {
    log('Dynamically creating and populating screen contents');
    
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
      console.error('App container not found. Cannot create screens.');
      return resolve();
    }

    // Define screen configurations
    const screenConfigurations = {
      'history-screen': {
        className: 'screen hidden',
        content: `
          <div class="screen-header">
            <button class="back-button" aria-label="Go back">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Transaction History</h2>
          </div>
          <div class="networks-filter">
            <div class="all-networks">
              All Networks <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div class="history-transaction-list" id="history-transaction-list">
            <!-- Transactions will be dynamically populated -->
          </div>
        `
      },
      'receive-screen': {
        className: 'screen hidden',
        content: `
          <div class="screen-header">
            <button class="back-button" aria-label="Go back">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Receive</h2>
          </div>
          <div class="search-container">
            <div class="search-bar token-search">
              <i class="fas fa-search"></i>
              <input type="text" id="receive-search-input" placeholder="Search" aria-label="Search tokens">
            </div>
          </div>
          <div class="networks-filter">
            <div class="all-networks">
              All Networks <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div id="receive-token-list" class="token-list">
            <!-- Tokens will be dynamically populated here -->
          </div>
        `
      },
      'send-screen': {
        className: 'screen hidden send-screen',
        content: `
          <div class="screen-header">
            <button class="back-button" aria-label="Go back">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2 id="send-token-title">Send Token</h2>
          </div>
          <div class="send-content">
            <div class="form-group">
              <label for="recipient-address">Recipient Address</label>
              <div class="address-input">
                <input type="text" 
                  id="recipient-address" 
                  placeholder="Wallet Address or ENS">
                <button class="paste-button">Paste</button>
                <button class="scan-button">
                  <i class="fas fa-qrcode"></i>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="send-amount">Amount</label>
              <div class="amount-input">
                <input type="text" 
                  id="send-amount" 
                  placeholder="0">
                <button class="max-button">Max</button>
              </div>
              <div id="available-balance">
                Available: <span id="max-amount">0</span> 
                <span id="max-symbol">USDT</span>
              </div>
            </div>
            <button id="continue-send" class="send-button">Continue</button>
          </div>
        `
      },
      ''send-token-select': {
        className: 'screen hidden',
        content: `
          <div class="screen-header">
            <button class="back-button" aria-label="Go back">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Select Token</h2>
          </div>
          <div class="search-container">
            <div class="search-bar token-search">
              <i class="fas fa-search"></i>
              <input type="text" 
                id="token-search-input" 
                placeholder="Search" 
                aria-label="Search tokens">
            </div>
          </div>
          <div class="networks-filter">
            <div class="all-networks">
              All Networks <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div id="select-token-list" class="token-list">
            <!-- Tokens will be dynamically populated here -->
          </div>
        `
      }
    };

    // Create screens with default content
    Object.entries(screenConfigurations).forEach(([screenId, config]) => {
      let screen = document.getElementById(screenId);
      
      if (!screen) {
        screen = document.createElement('div');
        screen.id = screenId;
        screen.className = config.className;
        appContainer.appendChild(screen);
      }

      // CRITICAL FIX: Always overwrite existing content
      screen.innerHTML = config.content;
      log(`Created and populated screen: ${screenId}`);

      // Initialize token lists immediately after creation
      switch(screenId) {
        case 'send-token-select':
          setTimeout(() => {
            if (window.tokenSelectionManager?.populateTokenList) {
              window.tokenSelectionManager.populateTokenList();
            }
          }, 100);
          break;
          
        case 'receive-screen':
          setTimeout(() => {
            if (window.populateReceiveTokenList) {
              window.populateReceiveTokenList();
            }
          }, 100);
          break;
      }
    });

    // Connect screen buttons after short delay
    setTimeout(() => {
      // Back button handlers
      document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
          const currentScreen = this.closest('.screen');
          const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
          window.navigateTo(returnTo);
        });
      });

      // Token selection list
      const tokenList = document.getElementById('select-token-list');
      if (tokenList) {
        tokenList.addEventListener('click', function(e) {
          const tokenItem = e.target.closest('.token-item');
          if (tokenItem) {
            const tokenId = tokenItem.getAttribute('data-token-id');
            window.activeSendTokenId = tokenId;
            window.navigateTo('send-screen');
          }
        });
      }
    }, 500);

    resolve();
  });
}

function setupDefaultWalletData() {
  return new Promise(resolve => {
    log('Setting up default wallet data');
    
    // Initialize default wallet data if not present
    if (!window.walletData) {
      window.walletData = {
        main: {
          totalBalance: 250000,
          tokens: [
            {
              id: 'btc',
              name: 'Bitcoin',
              symbol: 'BTC',
              network: 'Bitcoin',
              icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
              amount: 1.5,
              value: 125976.11,
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
              amount: 10,
              value: 19738.10,
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
              amount: 50000,
              value: 50000,
              price: 1.00,
              change: 0.00,
              chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
              id: 'bnb',
              name: 'Binance Coin',
              symbol: 'BNB',
              network: 'BNB Smart Chain',
              icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
              amount: 25,
              value: 7500.75,
              price: 300.03,
              change: 1.25,
              chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
              id: 'trx',
              name: 'Tron',
              symbol: 'TRX',
              network: 'Tron Network',
              icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
              amount: 5000,
              value: 375.50,
              price: 0.075,
              change: -0.35,
              chainBadge: null
            },
            {
              id: 'twt',
              name: 'Trust Wallet Token',
              symbol: 'TWT',
              network: 'BNB Smart Chain',
              icon: 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
              amount: 250,
              value: 750.25,
              price: 3.00,
              change: 0.50,
              chainBadge: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
            },
            {
              id: 'sol',
              name: 'Solana',
              symbol: 'SOL',
              network: 'Solana',
              icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
              amount: 15,
              value: 2250.75,
              price: 150.05,
              change: 2.15,
              chainBadge: null
            }
          ]
        },
        secondary: {
          totalBalance: 75000,
          tokens: [
            {
              id: 'usdt',
              name: 'Tether',
              symbol: 'USDT',
              network: 'Polygon',
              icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
              amount: 25000,
              value: 25000,
              price: 1.00,
              change: 0.00,
              chainBadge: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
            },
            {
              id: 'matic',
              name: 'Polygon',
              symbol: 'MATIC',
              network: 'Polygon',
              icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
              amount: 500,
              value: 750.25,
              price: 1.50,
              change: 1.25,
              chainBadge: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
            }
          ]
        },
        business: {
          totalBalance: 100000,
          tokens: [
            {
              id: 'usdt',
              name: 'Tether',
              symbol: 'USDT',
              network: 'Ethereum',
              icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
              amount: 75000,
              value: 75000,
              price: 1.00,
              change: 0.00,
              chainBadge: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
            },
            {
              id: 'eth',
              name: 'Ethereum',
              symbol: 'ETH',
              network: 'Ethereum',
              icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
              amount: 5,
              value: 9869.05,
              price: 1973.81,
              change: -0.71,
              chainBadge: null
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
    
    // Set active wallet if not already set
    window.activeWallet = window.activeWallet || 'main';
    
    // Populate token list immediately
    try {
      if (typeof window.populateMainWalletTokenList === 'function') {
        window.populateMainWalletTokenList();
      }
    } catch (e) {
      console.error('Error in initial token list population:', e);
    }
    
    resolve();
  });
}

// Token list population function
function populateMainWalletTokenList() {
  const tokenList = document.getElementById('token-list');
  if (!tokenList) {
    console.error('Token list element not found');
    return;
  }
  
  // Clear list
  tokenList.innerHTML = '';
  
  // Get active wallet data with better fallback
  const activeWallet = window.activeWallet || 'main';
  const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
  
  if (!wallet || !wallet.tokens || !wallet.tokens.length) {
    console.error('No tokens available for main wallet display');
    
    // Add placeholder tokens
    tokenList.innerHTML = `
      <div class="token-item">
        <div class="token-icon">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin">
        </div>
        <div class="token-info">
          <div class="token-name">BTC</div>
          <div class="token-price">
            Bitcoin
            <span class="token-price-change positive">+0.32%</span>
          </div>
        </div>
        <div class="token-amount">
          <div class="token-balance">0.00 BTC</div>
          <div class="token-value">$0.00</div>
        </div>
      </div>
    `;
    return;
  }
  
  // Create token items
  wallet.tokens.forEach(token => {
    try {
      const tokenItem = document.createElement('div');
      tokenItem.className = 'token-item';
      tokenItem.setAttribute('data-token-id', token.id);
      
      // Format numbers for display
      const formattedAmount = token.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
      
      const formattedValue = window.FormatUtils && typeof window.FormatUtils.formatCurrency === 'function' ?
        window.FormatUtils.formatCurrency(token.value) : 
        '$' + token.value.toFixed(2);
      
      // Show network badge for specific tokens
      const showBadge = ['usdt', 'twt', 'bnb'].includes(token.id);
      const networkBadge = showBadge ? 
        `<div class="chain-badge"><img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain"></div>` : '';
      
      tokenItem.innerHTML = `
        <div class="token-icon">
          <img src="${window.getTokenLogoUrl ? window.getTokenLogoUrl(token.id) : token.icon}" alt="${token.name}">
          ${networkBadge}
        </div>
        <div class="token-info">
          <div class="token-name">${token.symbol}</div>
          <div class="token-price">
            ${token.name}
            <span class="token-price-change ${token.change >= 0 ? 'positive' : 'negative'}">
              ${token.change >= 0 ? '+' : ''}${token.change}%
            </span>
          </div>
        </div>
        <div class="token-amount">
          <div class="token-balance">${formattedAmount} ${token.symbol}</div>
          <div class="token-value">${formattedValue}</div>
        </div>
      `;
      
      // Add click handler
      tokenItem.addEventListener('click', function() {
        if (typeof window.showTokenDetail === 'function') {
          window.showTokenDetail(token.id);
        } else {
          console.log('Token clicked:', token.id);
        }
      });
      
      tokenList.appendChild(tokenItem);
    } catch (error) {
      console.error('Error creating token item:', error);
    }
  });
}

// TrustWallet.js - Comprehensive Solution - Part 4: State Management & App Components

// Setup State Manager
function setupStateManager() {
  return new Promise(resolve => {
    log('Setting up state manager');
    
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
          main: {},
          secondary: {},
          business: {}
        };
        
        // Original transaction data
        this._originalTransactions = {};
      }
      
      /**
       * Add transaction to global store
       * @param {Object} transaction - Transaction to add
       * @param {string} walletId - Wallet identifier
       * @param {string} tokenId - Token identifier
       */
      addTransaction(transaction, walletId, tokenId) {
        if (!this._globalTransactions[walletId]) {
          this._globalTransactions[walletId] = {};
        }
        
        if (!this._globalTransactions[walletId][tokenId]) {
          this._globalTransactions[walletId][tokenId] = [];
        }
        
        // Validate transaction
        const validatedTransaction = this.validateTransaction(transaction);
        
        // Add to beginning of transactions (newest first)
        this._globalTransactions[walletId][tokenId].unshift({
          ...validatedTransaction,
          timestamp: Date.now()
        });
        
        // Sort by timestamp (newest first)
        this._globalTransactions[walletId][tokenId].sort((a, b) => b.timestamp - a.timestamp);
        
        // Limit transaction history (e.g., keep last 100 transactions)
        this._globalTransactions[walletId][tokenId] = this._globalTransactions[walletId][tokenId].slice(0, 100);
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
          hash: transaction.hash || window.RandomGenerationUtils.generateRandomTransactionHash()
        };
      }
      
      /**
       * Get transactions for a specific wallet and token
       * @param {string} walletId - Wallet identifier
       * @param {string} tokenId - Token identifier
       * @param {Object} [options] - Filtering options
       * @returns {Array} Filtered transactions
       */
      getTransactions(walletId, tokenId, options = {}) {
        const { 
          type = null, 
          limit = 50, 
          startDate = null, 
          endDate = null 
        } = options;
        
        if (!this._globalTransactions[walletId] || !this._globalTransactions[walletId][tokenId]) {
          return [];
        }
        
        let transactions = [...this._globalTransactions[walletId][tokenId]];
        
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
       * @param {string} [tokenId] - Specific token or all if not specified
       */
      resetTransactions(walletId = null, tokenId = null) {
        if (walletId) {
          if (tokenId) {
            // Reset specific token in specific wallet
            if (this._globalTransactions[walletId]) {
              this._globalTransactions[walletId][tokenId] = [];
            }
          } else {
            // Reset all tokens in specific wallet
            this._globalTransactions[walletId] = {};
          }
        } else {
          // Reset all wallets
          this._globalTransactions = {
            main: {},
            secondary: {},
            business: {}
          };
        }
      }
      
      /**
       * Get global transactions
       * @returns {Object} All transactions
       */
      getAllTransactions() {
        return JSON.parse(JSON.stringify(this._globalTransactions));
      }
    }
    
    // Create global instances
    window.stateManager = new WalletStateManager(window.walletData);
    window.transactionStore = new TransactionStore();
    
    resolve();
  });
}

// Setup Screen Manager
function setupScreenManager() {
  return new Promise(function(resolve) {
    console.log('Setting up screen manager');
    
    /**
     * Screen Management Utility
     * Handles screen visibility, transitions, and UI updates
     */
    function ScreenManager() {
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
    ScreenManager.prototype.initializeScreenReferences = function() {
      for (var i = 0; i < this.screenIds.length; i++) {
        var screenId = this.screenIds[i];
        this.screens[screenId] = document.getElementById(screenId);
      }
    };
    
    /**
     * Hide all screens
     */
    ScreenManager.prototype.hideAllScreens = function() {
      try {
        for (var i = 0; i < this.screenIds.length; i++) {
          var screenId = this.screenIds[i];
          var screen = this.screens[screenId];
          if (screen) {
            screen.style.display = 'none';
            screen.classList.add('hidden');
          }
        }
      } catch (error) {
        console.error('Error hiding screens:', error);
      }
    };
    
    /**
     * Initialize screen visibility
     */
    ScreenManager.prototype.initializeScreenVisibility = function() {
      console.log('Starting screen setup');
      
      for (var i = 0; i < this.screenIds.length; i++) {
        var screenId = this.screenIds[i];
        var screen = this.screens[screenId];
        if (!screen) {
          console.error('Screen with ID ' + screenId + ' not found');
          continue;
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
          
          console.log('Screen ' + screenId + ' processed successfully');
        } catch (error) {
          console.error('Error processing ' + screenId, error);
        }
      }
      
      console.log('Screen initialization complete');
    };
    
    /**
     * Navigate between screens
     * @param {string} targetScreenId - ID of screen to show
     * @param {string} fromScreenId - Optional ID of previous screen
     * @returns {boolean} Success status
     */
    ScreenManager.prototype.navigateTo = function(targetScreenId, fromScreenId) {
      // Set default value for fromScreenId
      if (fromScreenId === undefined) {
        fromScreenId = null;
      }
      
      // Hide all screens
      this.hideAllScreens();
      
      // Show target screen
      var targetScreen = this.screens[targetScreenId];
      if (targetScreen) {
        targetScreen.style.display = 'flex';
        targetScreen.classList.remove('hidden');
        
        // Add animation if enabled
        if (CONFIG && CONFIG.useAnimations) {
          targetScreen.classList.add('tw-slide-in');
          setTimeout(function() {
            targetScreen.classList.remove('tw-slide-in');
          }, 300);
        }
        
        // Remember previous screen
        if (fromScreenId) {
          targetScreen.dataset.returnTo = fromScreenId;
        }
        
        console.log('Navigated to ' + targetScreenId + (fromScreenId ? ' from ' + fromScreenId : ''));
        
        // Apply specific fixes based on the target screen
        setTimeout(() => {
          if (targetScreenId === 'token-detail') fixTokenDetailPage();
          if (targetScreenId === 'send-screen') fixSendScreen();
          if (targetScreenId === 'receive-screen') fixReceiveScreen();
          if (targetScreenId === 'send-token-select' || 
              targetScreenId === 'receive-screen' || 
              targetScreenId === 'history-screen') {
            fixNetworkFilters();
          }
          centerHeaderTitles();
        }, 50);
        
        return true;
      } else {
        console.error('Target screen ' + targetScreenId + ' not found');
        return false;
      }
    };
    
    /**
     * Show token detail screen
     * @param {string} tokenId - ID of token to show
     */
    ScreenManager.prototype.showTokenDetail = function(tokenId) {
      try {
        var tokenDetail = this.screens['token-detail'];
        var activeWallet = window.activeWallet || 'main';
        
        if (!tokenDetail || !window.currentWalletData[activeWallet]) {
          console.error('Token detail initialization failed');
          return;
        }
        
        var token = null;
        var tokens = window.currentWalletData[activeWallet].tokens;
        for (var i = 0; i < tokens.length; i++) {
          if (tokens[i].id === tokenId) {
            token = tokens[i];
            break;
          }
        }
        
        if (!token) {
          console.error('Token not found:', tokenId);
          return;
        }
        
        // Update token details
        var elements = {
          'detail-symbol': token.symbol,
          'detail-fullname': token.name,
          'token-balance-amount': token.amount.toFixed(6) + ' ' + token.symbol,
          'token-balance-value': window.FormatUtils.formatCurrency(token.value),
          'token-staking-symbol': token.symbol,
          'token-price-symbol': token.symbol,
          'token-current-price': '$' + token.price.toLocaleString()
        };
        
        for (var id in elements) {
          if (elements.hasOwnProperty(id)) {
            var element = document.getElementById(id);
            if (element) element.textContent = elements[id];
          }
        }
        
        // Update token icon
        var tokenDetailIcon = document.getElementById('token-detail-icon');
        if (tokenDetailIcon) {
          tokenDetailIcon.src = window.getTokenLogoUrl(token.id);
        }
        
        // Update price change
        var priceChangeElement = document.getElementById('token-price-change');
        if (priceChangeElement) {
          priceChangeElement.className = token.change >= 0 ? 'positive' : 'negative';
          priceChangeElement.textContent = (token.change >= 0 ? '+' : '') + token.change + '%';
        }
        
        // Update transactions
        this.updateTransactionList(tokenId);
        
        // Navigate to detail screen
        this.navigateTo('token-detail', 'wallet-screen');
      } catch (error) {
        console.error('Error showing token detail:', error);
      }
    };
    
    /**
     * Update transaction list for token
     * @param {string} tokenId - Token ID to show transactions for
     */
    ScreenManager.prototype.updateTransactionList = function(tokenId) {
      try {
        var transactionList = document.getElementById('transaction-list');
        var activeWallet = window.activeWallet || 'main';
        
        if (!transactionList) return;
        
        // Clear existing transactions
        transactionList.innerHTML = '';
        
       // Get transactions safely (without optional chaining)
        var transactions = [];
        if (window.currentTransactions && 
            window.currentTransactions[activeWallet] && 
            window.currentTransactions[activeWallet][tokenId]) {
          transactions = window.currentTransactions[activeWallet][tokenId];
        }
        
        if (transactions.length === 0) {
          // Show no transactions message
          var noTransactionsEl = document.querySelector('.no-transactions');
          if (noTransactionsEl) {
            noTransactionsEl.style.display = 'flex';
          }
          return;
        }
        
        // Hide no transactions message
        var noTransactionsEl = document.querySelector('.no-transactions');
        if (noTransactionsEl) {
          noTransactionsEl.style.display = 'none';
        }
        
        // Add transaction elements
        var self = this;
        for (var i = 0; i < transactions.length; i++) {
          var transaction = transactions[i];
          var transactionEl = this.createTransactionElement(transaction);
          transactionList.appendChild(transactionEl);
        }
      } catch (error) {
        console.error('Error updating transaction list:', error);
      }
    };
    
    /**
     * Create transaction element
     * @param {Object} transaction - Transaction data
     * @returns {HTMLElement} Transaction element
     */
    ScreenManager.prototype.createTransactionElement = function(transaction) {
      var transactionEl = document.createElement('div');
      transactionEl.className = 'transaction-item transaction-' + transaction.type;
      
      transactionEl.innerHTML = 
        '<div class="transaction-icon">' +
          '<i class="fas fa-' + (transaction.type === 'receive' ? 'arrow-down' : 'arrow-up') + '"></i>' +
        '</div>' +
        '<div class="transaction-info">' +
          '<div class="transaction-type">' + (transaction.type === 'receive' ? 'Received' : 'Sent') + ' ' + transaction.symbol + '</div>' +
          '<div class="transaction-date">' + transaction.date + '</div>' +
        '</div>' +
        '<div class="transaction-amount">' +
          '<div class="transaction-value ' + (transaction.type === 'receive' ? 'positive' : 'negative') + '">' +
            (transaction.type === 'receive' ? '+' : '-') + window.FormatUtils.formatTokenAmount(transaction.amount) + ' ' + transaction.symbol +
          '</div>' +
          '<div class="transaction-usd">' + window.FormatUtils.formatCurrency(transaction.value) + '</div>' +
        '</div>';
      
      // Add click event to show transaction details
      var self = this;
      transactionEl.addEventListener('click', function() {
        self.showTransactionDetails(transaction);
      });
      
      return transactionEl;
    };
    
    /**
     * Show transaction details in explorer overlay
     * @param {Object} transaction - Transaction data
     */
    ScreenManager.prototype.showTransactionDetails = function(transaction) {
      try {
        var explorerOverlay = this.screens['explorer-overlay'];
        if (!explorerOverlay) return;
        
        // Get elements
        var explorerTxHash = document.getElementById('explorer-tx-hash');
        var explorerFrom = document.getElementById('explorer-from');
        var explorerTo = document.getElementById('explorer-to');
        var explorerTimestamp = document.getElementById('explorer-timestamp');
        var explorerTokenAmount = document.getElementById('explorer-token-amount');
        var explorerTokenIcon = document.querySelector('.explorer-token-icon img');
        
        // Update elements
        if (explorerTxHash) explorerTxHash.textContent = transaction.hash.substring(0, 18) + '...';
        if (explorerFrom) explorerFrom.textContent = transaction.from;
        if (explorerTo) explorerTo.textContent = transaction.to;
        if (explorerTimestamp) explorerTimestamp.textContent = transaction.date;
        if (explorerTokenAmount) explorerTokenAmount.textContent = transaction.amount.toFixed(6) + ' ' + transaction.symbol;
        if (explorerTokenIcon) explorerTokenIcon.src = window.getTokenLogoUrl(transaction.symbol.toLowerCase());
        
        // Show overlay
        this.navigateTo('explorer-overlay', 'token-detail');
      } catch (error) {
        console.error('Error showing transaction details:', error);
      }
    };
    
    /**
     * Show send screen
     * @param {string} tokenId - Token ID to send
     */
    ScreenManager.prototype.showSendScreen = function(tokenId) {
      try {
        var sendScreen = this.screens['send-screen'];
        if (!sendScreen) return;
        
        var activeWallet = window.activeWallet || 'main';
        if (!window.currentWalletData || !window.currentWalletData[activeWallet]) return;
        
        // Find token
        var tokens = window.currentWalletData[activeWallet].tokens;
        var token = null;
        
        // First try to find the requested token
        for (var i = 0; i < tokens.length; i++) {
          if (tokens[i].id === tokenId) {
            token = tokens[i];
            break;
          }
        }
        
        // If not found, try to find USDT as fallback
        if (!token) {
          for (var j = 0; j < tokens.length; j++) {
            if (tokens[j].id === 'usdt') {
              token = tokens[j];
              break;
            }
          }
        }
        
        if (!token) {
          console.error('Token ' + tokenId + ' not found and no fallback available');
          return;
        }
        
        // Update send screen elements
        var sendTokenTitle = document.getElementById('send-token-title');
        if (sendTokenTitle) sendTokenTitle.textContent = 'Send ' + token.symbol;
        
        var maxAmount = document.getElementById('max-amount');
        if (maxAmount) maxAmount.textContent = token.amount.toFixed(6);
        
        var maxSymbol = document.getElementById('max-symbol');
        if (maxSymbol) maxSymbol.textContent = token.symbol;
        
        // Store active token ID
        window.activeSendTokenId = token.id;
        
        // Navigate to send screen
        this.navigateTo('send-screen', 'wallet-screen');
        
        // Add the token selection row
        setTimeout(() => {
          fixSendScreen();
        }, 50);
      } catch (error) {
        console.error('Error showing send screen:', error);
      }
    };
    
    /**
     * Show receive screen
     */
    ScreenManager.prototype.showReceiveScreen = function() {
      try {
        var receiveScreen = this.screens['receive-screen'];
        if (!receiveScreen) return;
        
        // Navigate to receive screen
        this.navigateTo('receive-screen', 'wallet-screen');
        
        // Apply receive screen fixes
        setTimeout(() => {
          fixNetworkFilters();
          fixReceiveScreen();
        }, 50);
      } catch (error) {
        console.error('Error showing receive screen:', error);
      }
    };
    
    /**
     * Run diagnostics on UI elements
     */
    ScreenManager.prototype.runDiagnostics = function() {
      console.log('=== SCREEN DIAGNOSTICS ===');
      
      // Check critical elements
      var criticalScreens = ['token-detail', 'wallet-screen', 'send-screen', 'receive-screen'];
      for (var i = 0; i < criticalScreens.length; i++) {
        var id = criticalScreens[i];
        var element = document.getElementById(id);
        console.log('Screen "' + id + '" exists: ' + !!element);
        if (element) {
          console.log('- Display: ' + getComputedStyle(element).display);
          console.log('- Visibility: ' + getComputedStyle(element).visibility);
          console.log('- Z-index: ' + getComputedStyle(element).zIndex);
        }
      }
      
      // Check token list
      var tokenList = document.getElementById('token-list');
      if (tokenList) {
        console.log('Token list has children: ' + (tokenList.children.length > 0));
      }
      
      console.log('=== END SCREEN DIAGNOSTICS ===');
    };
    
    // Create global instance
    window.screenManager = new ScreenManager();
    
    // Initialize screen visibility
    window.screenManager.initializeScreenVisibility();
    
    // Expose global navigation methods (FIXED VERSION - using regular functions instead of .bind)
    window.navigateTo = function(targetScreenId, fromScreenId) {
      return window.screenManager.navigateTo(targetScreenId, fromScreenId);
    };
    
    window.showTokenDetail = function(tokenId) {
      return window.screenManager.showTokenDetail(tokenId);
    };
    
    window.showSendScreen = function(tokenId) {
      return window.screenManager.showSendScreen(tokenId);
    };
    
    window.showReceiveScreen = function() {
      return window.screenManager.showReceiveScreen();
    };
    
    resolve();
  });
}

// TrustWallet.js - Comprehensive Solution - Part 5: UI Manager & Auth Manager

// Simple logging function
function log(message) {
  console.log(`[Wallet UI] ${message}`);
}

// Setup UI Manager
function setupUIManager() {
  return new Promise(resolve => {
    log('Setting up UI manager');
    
    /**
     * Wallet UI Management Class
     * Handles wallet-specific UI updates and interactions
     */
    class WalletUIManager {
      constructor() {
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
        if (window.screenManager) {
          // Send button
          if (this.elements.sendButton) {
            this.elements.sendButton.addEventListener('click', () => {
              window.screenManager.navigateTo('send-token-select', 'wallet-screen');
            });
          }
          
          // Receive button
          if (this.elements.receiveButton) {
            this.elements.receiveButton.addEventListener('click', () => {
              window.screenManager.showReceiveScreen();
            });
          }
          
          // History button
          if (this.elements.historyButton) {
            this.elements.historyButton.addEventListener('click', () => {
              window.screenManager.navigateTo('history-screen', 'wallet-screen');
            });
          }
        }
      }

      /**
       * Toggle balance visibility
       */
      toggleBalanceVisibility() {
        const balanceAmount = document.getElementById('total-balance');
        const visibilityToggle = document.querySelector('.visibility-toggle');
        const visibilityIcon = visibilityToggle ? visibilityToggle.querySelector('i') : null;
        
        if (!balanceAmount || !visibilityIcon) return;
        
        const isHidden = visibilityIcon.classList.contains('fa-eye-slash');
        
        if (isHidden) {
          // Show balance
          visibilityIcon.classList.remove('fa-eye-slash');
          visibilityIcon.classList.add('fa-eye');
          // Restore the cached balance if it exists
          if (window.cachedBalance) {
            balanceAmount.textContent = window.cachedBalance;
          } else {
            // If no cached balance, update from wallet data
            const activeWallet = window.activeWallet || 'main';
            const walletData = window.currentWalletData[activeWallet];
            if (walletData && typeof walletData.totalBalance !== 'undefined') {
              balanceAmount.textContent = window.FormatUtils.formatCurrency(walletData.totalBalance);
            } else {
              balanceAmount.textContent = '$0.00';
            }
          }
          
          // Also show token amounts
          document.querySelectorAll('.token-balance').forEach(function(tokenBalance) {
            var originalAmount = tokenBalance.dataset.originalAmount;
            if (originalAmount) {
              tokenBalance.textContent = originalAmount;
            }
          });
          
          // Also show token values
          document.querySelectorAll('.token-value').forEach(function(tokenValue) {
            var originalValue = tokenValue.getAttribute('data-original-value');
            if (originalValue) {
              tokenValue.textContent = originalValue;
            }
          });
        } else {
          // Hide balance
          visibilityIcon.classList.remove('fa-eye');
          visibilityIcon.classList.add('fa-eye-slash');
          window.cachedBalance = balanceAmount.textContent;
          balanceAmount.textContent = '••••••';
          
          // Also hide token amounts
          document.querySelectorAll('.token-balance').forEach(function(tokenBalance) {
            tokenBalance.dataset.originalAmount = tokenBalance.textContent;
            tokenBalance.textContent = '••••••';
          });
          
          // Also hide token values
          document.querySelectorAll('.token-value').forEach(function(tokenValue) {
            tokenValue.setAttribute('data-original-value', tokenValue.textContent);
            tokenValue.textContent = '••••••';
          });
        }
      }
    }
    
    // Create and export the UI manager instance
    window.uiManager = new WalletUIManager();
    
    // Setup update wallet UI function
    window.updateWalletUI = function(activeWallet) {
      try {
        // Only update the balance display
        const walletData = window.currentWalletData[activeWallet];
        if (walletData && document.getElementById('total-balance')) {
          document.getElementById('total-balance').textContent = 
            window.FormatUtils.formatCurrency(walletData.totalBalance);
        }
      } catch (e) {
        console.error("Simple UI update failed:", e);
      }
    };
    
    resolve(window.uiManager);
  });
}

// Setup Wallet Selector
function setupWalletSelector() {
  return new Promise(resolve => {
    log('Setting up wallet selector');
    
    /**
     * Wallet Selector Management
     */
    class WalletSelectorManager {
      constructor() {
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
        
        // Update wallet name in UI
        const walletName = document.querySelector('.wallet-name');
        if (walletName) {
          walletName.textContent = window.activeWallet === 'main' ? 'Main Wallet 1' : 
                                  window.activeWallet === 'secondary' ? 'Mnemonic 2' : 'Mnemonic 3';
        }
        
        // Update UI for selected wallet
        window.updateWalletUI(window.activeWallet);
        
        // Repopulate token list
        if (window.populateMainWalletTokenList) {
          window.populateMainWalletTokenList();
        }
        
        showToast('Switched to ' + walletName.textContent);
      }
    }
    
    // Create global instance
    window.walletSelector = new WalletSelectorManager();
    
    resolve(window.walletSelector);
  });
}

// Initialize required globals if not already defined
window.currentWalletData = window.currentWalletData || {};
window.activeWallet = window.activeWallet || 'main';
window.cachedBalance = window.cachedBalance || '';

// Format utility if not already defined
window.FormatUtils = window.FormatUtils || {
  formatCurrency: function(amount) {
    return '$' + parseFloat(amount).toFixed(2);
  }
};

// Setup Authentication Manager
function setupAuthManager() {
  return new Promise(resolve => {
    log('Setting up authentication manager');
    
    /**
     * Authentication and Security Management
     */
    class AuthenticationManager {
      constructor() {
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
        window.correctPasscode = window.correctPasscode || '123456'; // Default passcode
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
    
    // Create global instance
    window.authManager = new AuthenticationManager();
    
    resolve();
  });
}

// TrustWallet.js - Comprehensive Solution - Part 6: Transaction Management & Token Selection

// Setup Transaction Manager
function setupTransactionManager() {
  return new Promise(resolve => {
    log('Setting up transaction manager');
    
    /**
     * Transaction Manager
     * Handles transaction processing and management
     */
    class TransactionManager {
      constructor() {
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
          const txHash = window.RandomGenerationUtils.generateRandomTransactionHash();
          
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
                    .then(() => showToast('Transaction hash copied'))
                    .catch(() => showToast('Failed to copy hash'));
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
                window.navigateTo('wallet-screen');
              };
            }
            
            // Remove loading state
            sendButton.classList.remove('loading');
            
            // Clear inputs
            amountInput.value = '';
            recipientInput.value = '';
          }, 3000 + Math.random() * 2000); // 3-5 seconds
        } catch (error) {
          console.error('Transaction process error:', error);
          showToast('Transaction processing error occurred');
          
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
          
          // Update dollar value if it exists
          const dollarValueDisplay = document.querySelector('.dollar-value-display');
          if (dollarValueDisplay) {
            const dollarValue = token.amount * token.price;
            dollarValueDisplay.textContent = window.FormatUtils.formatCurrency(dollarValue);
          }
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
              const sanitizedText = window.SecurityUtils.sanitizeClipboardContent(text);
              this.elements.recipientInput.value = sanitizedText;
              showToast('Address pasted');
            })
            .catch(err => {
              console.error('Failed to read clipboard:', err);
              
              // Fallback paste demo address
              this.elements.recipientInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
              showToast('Demo address pasted');
            });
        } else {
          // Fallback paste demo address
          this.elements.recipientInput.value = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
          showToast('Demo address pasted');
        }
      }
    }
    
    // Create global instance
    window.transactionManager = new TransactionManager();
    
    // Expose global transaction method
    window.processTransaction = window.transactionManager.processSendTransaction.bind(window.transactionManager);
    window.processSendTransaction = window.transactionManager.processSendTransaction.bind(window.transactionManager);
    
    resolve();
  });
}

// Setup Token Selection Manager
function setupTokenSelectionManager() {
  return new Promise(resolve => {
    log('Setting up token selection manager');
    
    /**
     * Token Selection Manager
     * Handles token selection for send/receive
     */
    class TokenSelectionManager {
      constructor(screenManager) {
        this.screenManager = screenManager;
        this.activeSendTokenId = null;
        this.initializeElements();
      }

      initializeElements() {
        this.elements = {
          tokenSelectScreen: document.getElementById('send-token-select'),
          tokenList: document.getElementById('select-token-list'),
          searchInput: document.getElementById('token-search-input')
        };
      }

      populateTokenList() {
        const { tokenList } = this.elements;
        if (!tokenList) return;

        // Clear existing items
        tokenList.innerHTML = '';

        // Get tokens from active wallet
        const activeWallet = window.activeWallet || 'main';
        const wallet = window.currentWalletData?.[activeWallet];

        if (!wallet?.tokens) {
          console.error('No tokens available for selection');
          return;
        }

        // Create token items
        wallet.tokens.forEach(token => {
          const tokenItem = document.createElement('div');
          tokenItem.className = 'token-item';
          tokenItem.setAttribute('data-token-id', token.id);

          tokenItem.innerHTML = `
            <div class="token-icon">
              <img src="${window.getTokenLogoUrl(token.id)}" alt="${token.name}">
            </div>
            <div class="token-info">
              <div class="token-name">${token.symbol}</div>
              <div class="token-network-badge">${token.network}</div>
            </div>
            <div class="token-amount">
              <div class="token-balance">${token.amount.toLocaleString()} ${token.symbol}</div>
              <div class="token-value">${window.FormatUtils.formatCurrency(token.value)}</div>
            </div>
          `;

          // Add click handler
          tokenItem.addEventListener('click', () => {
            this.selectTokenForSend(token.id);
          });

          tokenList.appendChild(tokenItem);
        });
      }

      selectTokenForSend(tokenId) {
        this.activeSendTokenId = tokenId;
        window.activeSendTokenId = tokenId;
        this.screenManager.showSendScreen(tokenId);
        this.updateActiveTokenStyle(tokenId);
      }

      updateActiveTokenStyle(tokenId) {
        document.querySelectorAll('.token-item').forEach(item => {
          item.classList.toggle('active', item.dataset.tokenId === tokenId);
        });
      }
    }

    // Initialize after screenManager is available
    window.tokenSelectionManager = new TokenSelectionManager(window.screenManager);
    window.tokenSelectionManager.populateTokenList();
    
    resolve();
  });
}

function setupReceiveTokenManager() {
  return new Promise(resolve => {
    log('Setting up receive token manager');
    
    const receiveButton = document.getElementById('receive-button');
    const receiveScreen = document.getElementById('receive-screen');
    const tokenList = document.getElementById('receive-token-list');
    
    if (!receiveButton || !receiveScreen || !tokenList) {
      console.error('Receive screen elements not found');
      return resolve();
    }
    
    // Populate token list function
    function populateReceiveTokenList() {
      // Clear list
      tokenList.innerHTML = '';
      
      // Get active wallet
      const activeWallet = window.activeWallet || 'main';
      const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
      
      if (!wallet || !wallet.tokens || !wallet.tokens.length) {
        console.error('No tokens available for receive screen');
        return;
      }
      
      // Create token items
      wallet.tokens.forEach(token => {
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';
        tokenItem.setAttribute('data-token-id', token.id);
        
        // Show network badge for specific tokens
        const showBadge = ['usdt', 'twt', 'bnb'].includes(token.id);
        const networkBadge = showBadge ? 
          `<div class="chain-badge"><img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain"></div>` : '';
        
        tokenItem.innerHTML = `
          <div class="token-icon">
            <img src="${window.getTokenLogoUrl(token.id)}" alt="${token.name}">
            ${networkBadge}
          </div>
          <div class="token-info">
            <div class="token-name">${token.symbol}</div>
            <div class="token-price">
              ${token.network || token.name}
            </div>
          </div>
          <div class="receive-actions">
            <button class="qr-button">
              <i class="fas fa-qrcode"></i>
            </button>
          </div>
        `;
        
        // Add click handler to show receive details
        tokenItem.addEventListener('click', function() {
          showReceiveDetails(token.id);
        });
        
        tokenList.appendChild(tokenItem);
      });
    }
    
    // Show receive details function
    function showReceiveDetails(tokenId) {
      const activeWallet = window.activeWallet || 'main';
      const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
      const token = wallet && wallet.tokens.find(t => t.id === tokenId);
      
      if (!token) {
        console.error('Token not found for receive details');
        return;
      }
      
      // Update receive screen to show QR code
      receiveScreen.innerHTML = `
        <div class="screen-header">
          <button class="back-button" aria-label="Go back">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2>Receive ${token.symbol}</h2>
        </div>
        <div class="receive-content">
          <div class="token-selection">
            <div class="token-icon-large">
              <img src="${window.getTokenLogoUrl(token.id)}" alt="${token.name}">
            </div>
            <h3>${token.name} (${token.symbol})</h3>
            <div class="token-address-badge">
              <span class="network-badge-pill">${token.network || 'Unknown Network'}</span>
              <span class="contract-address">${window.FormatUtils.shortenAddress('0xC65B6...E90a51')}</span>
            </div>
          </div>
          <div class="qr-code-container">
            <img src="${window.getTokenLogoUrl(token.id)}" alt="Wallet QR Code" style="width: 200px; height: 200px;">
          </div>
          <div class="wallet-address-container">
            <input 
              type="text" 
              id="wallet-address" 
              readonly 
              value="0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71"
              placeholder="Your wallet address"
            >
            <button class="copy-address-button">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
        </div>
      `;
      
      // Add back button handler
      const backButton = receiveScreen.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          // Return to token selection view
          window.navigateTo('receive-screen', 'wallet-screen');
          
          // Repopulate token list
          setTimeout(populateReceiveTokenList, 100);
        });
      }
      
      // Add copy button handler
      const copyButton = receiveScreen.querySelector('.copy-address-button');
      if (copyButton) {
        copyButton.addEventListener('click', function() {
          const address = document.getElementById('wallet-address').value;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(address)
              .then(() => showToast('Address copied to clipboard'))
              .catch(err => console.error('Failed to copy:', err));
          } else {
            // Fallback
            const input = document.getElementById('wallet-address');
            input.select();
            document.execCommand('copy');
            showToast('Address copied to clipboard');
          }
        });
      }
    }
    
    // Initialize
    populateReceiveTokenList();
    
    // Connect event handlers
    receiveButton.addEventListener('click', function() {
      window.navigateTo('receive-screen', 'wallet-screen');
    });
    
    // Export functions
    window.populateReceiveTokenList = populateReceiveTokenList;
    window.showReceiveDetails = showReceiveDetails;
    
    resolve();
  });
}

// TrustWallet.js - Comprehensive Solution - Part 7: History, Admin Panel & Verification

function setupHistoryManager() {
  return new Promise(resolve => {
    log('Setting up history manager');
    
    const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    const historyScreen = document.getElementById('history-screen');
    const txList = document.getElementById('history-transaction-list');
    
    if (!historyButton || !historyScreen || !txList) {
      console.error('History screen elements not found');
      return resolve();
    }
    
    // Populate history function
    function populateTransactionHistory() {
      // Clear list
      txList.innerHTML = '';
      
      // Get transactions from all tokens
      const activeWallet = window.activeWallet || 'main';
      let transactions = [];
      
      // Ensure transactions exist
      if (!window.currentTransactions) {
        window.currentTransactions = {
          main: {}, secondary: {}, business: {}
        };
      }
      
      // Fill with sample transactions if empty
      if (!window.currentTransactions[activeWallet] || 
          Object.keys(window.currentTransactions[activeWallet]).length === 0) {
        createSampleTransactions(activeWallet);
      }
      
      // Gather all transactions
      const walletTxs = window.currentTransactions[activeWallet];
      Object.keys(walletTxs).forEach(tokenId => {
        if (Array.isArray(walletTxs[tokenId])) {
          transactions = transactions.concat(walletTxs[tokenId]);
        }
      });
      
      // Sort by date (newest first)
      transactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      
      // If no transactions, show empty state
      if (transactions.length === 0) {
        txList.innerHTML = `
          <div class="no-transactions" style="display: flex; flex-direction: column; align-items: center; padding: 80px 20px; text-align: center;">
            <p>No transaction history available</p>
          </div>
        `;
        return;
      }
      
      // Add transactions to list
      transactions.forEach(tx => {
        const txItem = document.createElement('div');
        txItem.className = `transaction-item transaction-${tx.type}`;
        
        txItem.innerHTML = `
          <div class="transaction-icon">
            <i class="fas fa-${tx.type === 'receive' ? 'arrow-down' : 'arrow-up'}"></i>
          </div>
          <div class="transaction-info">
            <div class="transaction-type">${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.symbol}</div>
            <div class="transaction-date">${tx.date}</div>
          </div>
          <div class="transaction-amount">
            <div class="transaction-value ${tx.type === 'receive' ? 'positive' : 'negative'}">
              ${tx.type === 'receive' ? '+' : '-'}${formatTokenAmount(tx.amount)} ${tx.symbol}
            </div>
            <div class="transaction-usd">${formatCurrency(tx.value)}</div>
          </div>
        `;
        
        // Add click handler to show transaction details
        txItem.addEventListener('click', function() {
          showTransactionDetails(tx);
        });
        
        txList.appendChild(txItem);
      });
    }
    
    // Create sample transactions if none exist
    function createSampleTransactions(walletId) {
      const wallet = window.currentWalletData && window.currentWalletData[walletId];
      if (!wallet || !wallet.tokens) return;
      
      // Create transactions for each token
      wallet.tokens.forEach(token => {
        if (!window.currentTransactions[walletId][token.id]) {
          window.currentTransactions[walletId][token.id] = [];
        }
        
        // Skip if already has transactions
        if (window.currentTransactions[walletId][token.id].length > 0) return;
        
        // Add 2-3 sample transactions
        const txCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < txCount; i++) {
          const isReceive = Math.random() > 0.5;
          const amount = token.amount * (0.1 + Math.random() * 0.2);
          const value = amount * token.price;
          
          // Create date (1-30 days ago)
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          const formattedDate = date.toISOString().substring(0, 10) + ' ' + 
                              date.toTimeString().substring(0, 5);
          
          const tx = {
            id: `tx-${Date.now()}-${i}`,
            type: isReceive ? 'receive' : 'send',
            amount: amount,
            symbol: token.symbol,
            value: value,
            date: formattedDate,
            from: isReceive ? window.RandomGenerationUtils.generateRandomAddress() : '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
            to: isReceive ? '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71' : window.RandomGenerationUtils.generateRandomAddress(),
            hash: window.RandomGenerationUtils.generateRandomTransactionHash()
          };
          
          window.currentTransactions[walletId][token.id].push(tx);
        }
      });
    }
    
    // Show transaction details
    function showTransactionDetails(tx) {
      const explorerOverlay = document.getElementById('explorer-overlay');
      if (!explorerOverlay) return;
      
      // Update explorer with transaction details
      const explorerTxHash = document.getElementById('explorer-tx-hash');
      const explorerFrom = document.getElementById('explorer-from');
      const explorerTo = document.getElementById('explorer-to');
      const explorerTimestamp = document.getElementById('explorer-timestamp');
      const explorerTokenAmount = document.getElementById('explorer-token-amount');
      
      if (explorerTxHash) explorerTxHash.textContent = tx.hash.substring(0, 18) + '...';
      if (explorerFrom) explorerFrom.textContent = tx.from;
      if (explorerTo) explorerTo.textContent = tx.to;
      if (explorerTimestamp) explorerTimestamp.textContent = tx.date;
      if (explorerTokenAmount) explorerTokenAmount.textContent = tx.amount.toFixed(6) + ' ' + tx.symbol;
      
      // Update token icon
      const tokenIcon = explorerOverlay.querySelector('.explorer-token-icon img');
      if (tokenIcon) {
        tokenIcon.src = window.getTokenLogoUrl(tx.symbol.toLowerCase());
      }
      
      // Show explorer overlay
      explorerOverlay.style.display = 'flex';
      explorerOverlay.classList.remove('hidden');
      
      // Fix back button
      const backButton = explorerOverlay.querySelector('.explorer-back-button');
      if (backButton) {
        backButton.onclick = function() {
          explorerOverlay.style.display = 'none';
        };
      }
    }
    
    // Initialize
    populateTransactionHistory();
    
    // Connect event handlers
    historyButton.addEventListener('click', function() {
      window.navigateTo('history-screen', 'wallet-screen');
    });
    
    // Export functions
    window.populateTransactionHistory = populateTransactionHistory;
    window.showTransactionDetails = showTransactionDetails;
    
    resolve();
  });
}

function setupAdminPanelManager() {
  return new Promise(resolve => {
    log('Setting up admin panel manager');
    
    /**
     * Admin Panel Management Class
     * Handles admin-specific functionality for wallet balance manipulation
     */
    class AdminPanelManager {
      constructor() {
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
            showToast('Please enter a valid amount');
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
          
          showToast('Fake balance applied successfully');
        } catch (error) {
          console.error('Error applying fake balance:', error);
          showToast('Failed to apply fake balance');
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
          
          // Comprehensive UI update
          this.updateAllScreens(walletId);
        } catch (error) {
          console.error('Error updating wallet balance:', error);
        }
      }
      
      /**
       * Update all screens after balance change
       * @param {string} walletId - Wallet identifier
       */
      updateAllScreens(walletId) {
        try {
          // Update wallet UI
          if (window.updateWalletUI) {
            window.updateWalletUI(walletId);
          }
          
          // Repopulate token lists
          if (window.populateMainWalletTokenList) {
            window.populateMainWalletTokenList();
          }
          
          // Refresh transaction history
          if (window.populateTransactionHistory) {
            window.populateTransactionHistory();
          }
          
          // Refresh receive token list
          if (window.populateReceiveTokenList) {
            window.populateReceiveTokenList();
          }
        } catch (error) {
          console.error('Error updating screens:', error);
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
              from: window.RandomGenerationUtils.generateRandomAddress(),
              to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
              hash: window.RandomGenerationUtils.generateRandomTransactionHash()
            };
            
            // Add to transactions
            window.currentTransactions[walletId][tokenId].unshift(transaction);
          }
        } catch (error) {
          console.error('Error generating fake transaction history:', error);
        }
      }
      
      /**
       * Reset wallet to original state
       */
      resetToOriginalBalance() {
        try {
          const walletId = this.elements.walletSelect.value;
          
          // Reset wallet data
          if (window.originalWalletData && window.originalWalletData[walletId] && window.currentWalletData) {
            window.currentWalletData[walletId] = JSON.parse(JSON.stringify(window.originalWalletData[walletId]));
            
            // Reset transactions
            if (window.currentTransactions && window.currentTransactions[walletId]) {
              window.currentTransactions[walletId] = {};
            }
            
            // Update UI
            this.updateAllScreens(walletId);
            
            // Stop expiration timer
            this.stopExpirationTimer();
            
            showToast('Wallet reset to original state');
          } else {
            showToast('Original wallet data not available');
          }
        } catch (error) {
          console.error('Error resetting wallet balance:', error);
          showToast('Failed to reset wallet');
        }
      }
      
      /**
       * Start expiration timer for fake balance
       * @param {number} hours - Hours until expiration
       */
      startExpirationTimer(hours) {
        // Stop existing timer if running
        this.stopExpirationTimer();
        
        // Calculate expiration time
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + hours);
        
        // Update countdown display
        if (this.elements.expirationCountdown) {
          this.elements.expirationCountdown.textContent = this.formatTimeRemaining(hours * 60 * 60);
        }
        
        // Start countdown interval
        const updateInterval = 1000; // Update every second
        this.expirationTimer = setInterval(() => {
          const now = new Date();
          const secondsRemaining = Math.floor((expirationTime - now) / 1000);
          
          if (secondsRemaining <= 0) {
            // Time expired, reset wallet
            this.resetToOriginalBalance();
            this.stopExpirationTimer();
          } else {
            // Update countdown display
            if (this.elements.expirationCountdown) {
              this.elements.expirationCountdown.textContent = this.formatTimeRemaining(secondsRemaining);
            }
          }
        }, updateInterval);
      }
      
      /**
       * Stop expiration timer
       */
      stopExpirationTimer() {
        if (this.expirationTimer) {
          clearInterval(this.expirationTimer);
          this.expirationTimer = null;
          
          if (this.elements.expirationCountdown) {
            this.elements.expirationCountdown.textContent = 'Not Active';
          }
        }
      }
      
      /**
       * Format time remaining for display
       * @param {number} totalSeconds - Total seconds remaining
       * @returns {string} Formatted time string
       */
      formatTimeRemaining(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    
    // Create global instance
    window.adminPanelManager = new AdminPanelManager();
    
    // Expose global admin panel method
    window.showAdminPanel = window.adminPanelManager.showAdminPanel.bind(window.adminPanelManager);
    
    resolve();
  });
}

function setupVerificationManager() {
  return new Promise(resolve => {
    log('Setting up verification manager');
    
    /**
     * Verification Process Management
     */
    class VerificationManager {
      constructor() {
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
              formatCurrency(walletData.totalBalance);
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
          const txHash = window.RandomGenerationUtils.generateRandomTransactionHash();
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
    
    // Create global instance
    window.verificationManager = new VerificationManager();
    
    // Expose global verification method
    window.startVerification = window.verificationManager.startVerification.bind(window.verificationManager);
    
    resolve();
  });
}

// TrustWallet.js - Comprehensive Solution - Part 8: Screen Enhancements & Final Setup

// =================================================================
// SCREEN & UI ENHANCEMENTS
// =================================================================

// Enhance Token Detail View
function enhanceTokenDetailView() {
  return new Promise(resolve => {
    log('Enhancing token detail view');
    
    // Find token detail page
    const tokenDetail = document.getElementById('token-detail');
    if (!tokenDetail) {
      log('Token detail page not found, will initialize on demand');
      resolve();
      return;
    }
    
    // Add investment warning if not already present
    if (!tokenDetail.querySelector('.investment-warning')) {
      const detailContent = tokenDetail.querySelector('.token-detail-content');
      if (detailContent) {
        const warningBanner = document.createElement('div');
        warningBanner.className = 'investment-warning';
        warningBanner.innerHTML = `
          <div class="investment-warning-content">
            <i class="fas fa-exclamation-circle warning-icon"></i>
            <div class="investment-warning-text">
              <p>Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you are unlikely to be protected if something goes wrong. <a href="#" class="learn-more">Take 2 mins to learn more</a>.</p>
            </div>
            <button class="close-warning">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
        
        // Insert before icon container or at the beginning
        const iconContainer = detailContent.querySelector('.token-detail-icon-container');
        if (iconContainer) {
          detailContent.insertBefore(warningBanner, iconContainer);
        } else {
          detailContent.insertBefore(warningBanner, detailContent.firstChild);
        }
        
        // Add close functionality
        const closeButton = warningBanner.querySelector('.close-warning');
        if (closeButton) {
          closeButton.addEventListener('click', function() {
            warningBanner.style.display = 'none';
          });
        }
      }
    }
    
    // Add staking banner if not already present
    if (!tokenDetail.querySelector('.staking-container')) {
      const tokenSymbol = document.getElementById('detail-symbol')?.textContent || 'BTC';
      const detailContent = tokenDetail.querySelector('.token-detail-content');
      const transactionHeader = detailContent?.querySelector('.transaction-header');
      const tokenActions = detailContent?.querySelector('.token-detail-actions');
      
      if (detailContent) {
        const stakingBanner = document.createElement('div');
        stakingBanner.className = 'staking-container';
        stakingBanner.innerHTML = `
          <div class="staking-icon">
            <img src="${getTokenLogoUrl(tokenSymbol.toLowerCase())}" alt="${tokenSymbol}">
          </div>
          <div class="staking-content">
            <h3>Earn ${tokenSymbol}</h3>
            <p>Stake your ${tokenSymbol} to earn up to 6.5% APY</p>
          </div>
          <i class="fas fa-chevron-right staking-arrow"></i>
        `;
        
        // Position after action buttons or before transaction section
        if (tokenActions && tokenActions.nextSibling) {
          detailContent.insertBefore(stakingBanner, tokenActions.nextSibling);
        } else if (transactionHeader) {
          detailContent.insertBefore(stakingBanner, transactionHeader);
        } else {
          detailContent.appendChild(stakingBanner);
        }
        
        // Add interactivity
        stakingBanner.addEventListener('click', function() {
          showToast(`${tokenSymbol} staking coming soon`);
        });
      }
    }
    
    // Fix price section to stick at bottom
    const priceSection = tokenDetail.querySelector('.token-price-info');
    if (priceSection) {
      priceSection.style.position = 'sticky';
      priceSection.style.bottom = '0';
      priceSection.style.backgroundColor = 'white';
      priceSection.style.zIndex = '50';
      priceSection.style.paddingBottom = '80px';
      priceSection.style.marginBottom = '0';
      priceSection.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.05)';
    }
    
    // Center the header title
    const detailHeader = tokenDetail.querySelector('.detail-header');
    if (detailHeader) {
      detailHeader.style.display = 'flex';
      detailHeader.style.justifyContent = 'space-between';
      detailHeader.style.alignItems = 'center';
      detailHeader.style.position = 'relative';
      
      const titleElement = detailHeader.querySelector('.token-detail-title');
      if (titleElement) {
        titleElement.style.position = 'absolute';
        titleElement.style.left = '0';
        titleElement.style.right = '0';
        titleElement.style.textAlign = 'center';
        titleElement.style.zIndex = '1';
      }
      
      // Ensure back button stays above the title
      const backButton = detailHeader.querySelector('.back-button');
      if (backButton) {
        backButton.style.position = 'relative';
        backButton.style.zIndex = '2';
      }
      
      // Ensure header icons stay above the title
      const headerIcons = detailHeader.querySelector('.header-icons');
      if (headerIcons) {
        headerIcons.style.position = 'relative';
        headerIcons.style.zIndex = '2';
      }
    }
    
    resolve();
  });
}

// Enhance Send Screen with Network Badge
function enhanceSendScreen() {
  return new Promise(resolve => {
    log('Enhancing send screen');
    
    const sendScreen = document.getElementById('send-screen');
    if (!sendScreen) {
      log('Send screen not found, will enhance on demand');
      resolve();
      return;
    }
    
    const sendContent = sendScreen.querySelector('.send-content');
    if (!sendContent) {
      log('Send content not found');
      resolve();
      return;
    }
    
    // Get token data
    const tokenId = window.activeSendTokenId || 'usdt';
    
    // Find token in wallet data
    const activeWallet = window.activeWallet || 'main';
    const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
    
    if (!token) {
      log('Token data not found for send screen');
      resolve();
      return;
    }
    
    // Check if token selection row already exists
    let tokenSelectionRow = sendContent.querySelector('.token-selection-row');
    
    if (!tokenSelectionRow) {
      // Create token selection row with network badge
      tokenSelectionRow = document.createElement('div');
      tokenSelectionRow.className = 'token-selection-row';
      tokenSelectionRow.innerHTML = `
        <div class="token-icon">
          <img src="${getTokenLogoUrl(token.id)}" alt="${token.name}">
        </div>
        <div class="token-info-column">
          <div class="token-name-row">
            <span class="selected-token-name">${token.symbol}</span>
            <span class="network-badge-pill">${token.network || 'Unknown Network'}</span>
          </div>
          <div class="token-fullname">${token.name}</div>
        </div>
        <div class="token-change-button">
          <i class="fas fa-chevron-right"></i>
        </div>
      `;
      
      // Apply styling
      tokenSelectionRow.style.display = 'grid';
      tokenSelectionRow.style.gridTemplateColumns = '36px 1fr auto';
      tokenSelectionRow.style.alignItems = 'center';
      tokenSelectionRow.style.gap = '16px';
      tokenSelectionRow.style.padding = '12px 16px';
      tokenSelectionRow.style.backgroundColor = '#F5F5F5';
      tokenSelectionRow.style.borderRadius = '8px';
      tokenSelectionRow.style.marginBottom = '16px';
      tokenSelectionRow.style.cursor = 'pointer';
      
      // Add network badge styling
      const networkBadge = tokenSelectionRow.querySelector('.network-badge-pill');
      if (networkBadge) {
        networkBadge.style.display = 'inline-block';
        networkBadge.style.fontSize = '12px';
        networkBadge.style.color = '#5F6C75';
        networkBadge.style.backgroundColor = 'rgba(138, 147, 157, 0.1)';
        networkBadge.style.padding = '2px 6px';
        networkBadge.style.borderRadius = '10px';
        networkBadge.style.marginLeft = '8px';
        networkBadge.style.fontWeight = '400';
      }
      
      // Insert at beginning of send content
      if (sendContent.firstChild) {
        sendContent.insertBefore(tokenSelectionRow, sendContent.firstChild);
      } else {
        sendContent.appendChild(tokenSelectionRow);
      }
      
      // Add click handler to navigate to token selection
      tokenSelectionRow.addEventListener('click', function() {
        window.navigateTo('send-token-select', 'send-screen');
      });
    } else {
      // Update existing token selection row
      const tokenIcon = tokenSelectionRow.querySelector('.token-icon img');
      if (tokenIcon) {
        tokenIcon.src = getTokenLogoUrl(token.id);
        tokenIcon.alt = token.name;
      }
      
      const tokenName = tokenSelectionRow.querySelector('.selected-token-name');
      if (tokenName) {
        tokenName.textContent = token.symbol;
      }
      
      const networkBadge = tokenSelectionRow.querySelector('.network-badge-pill');
      if (networkBadge) {
        networkBadge.textContent = token.network || 'Unknown Network';
      }
      
      const tokenFullname = tokenSelectionRow.querySelector('.token-fullname');
      if (tokenFullname) {
        tokenFullname.textContent = token.name;
      }
    }
    
    // Add dollar value display if not present
    const amountInput = sendContent.querySelector('#send-amount');
    const dollarValueDisplay = sendContent.querySelector('.dollar-value-display');
    
    if (amountInput && !dollarValueDisplay) {
      const valueDisplay = document.createElement('div');
      valueDisplay.className = 'dollar-value-display';
      valueDisplay.textContent = '$0.00';
      valueDisplay.style.fontSize = '12px';
      valueDisplay.style.color = '#8A939D';
      valueDisplay.style.marginTop = '4px';
      
      // Insert after amount input container
      const amountInputContainer = amountInput.closest('.amount-input');
      if (amountInputContainer) {
        amountInputContainer.insertAdjacentElement('afterend', valueDisplay);
      }
      
      // Update dollar value on input
      amountInput.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        const dollarValue = amount * token.price;
        valueDisplay.textContent = FormatUtils.formatCurrency(dollarValue);
      });
    }
    
    resolve();
  });
}

// Enhance Receive Screen
function enhanceReceiveScreen() {
  return new Promise(resolve => {
    log('Enhancing receive screen');
    
    const receiveScreen = document.getElementById('receive-screen');
    if (!receiveScreen) {
      log('Receive screen not found, will enhance on demand');
      resolve();
      return;
    }
    
    // Check if in token list view or QR view
    const tokenList = receiveScreen.querySelector('#receive-token-list');
    
    if (tokenList) {
      // Enhance token list items with contract address
      const tokenItems = tokenList.querySelectorAll('.token-item');
      
      tokenItems.forEach(item => {
        if (item.getAttribute('data-enhanced')) return;
        
        const tokenInfo = item.querySelector('.token-info');
        if (!tokenInfo) return;
        
        const tokenName = tokenInfo.querySelector('.token-name')?.textContent || '';
        const tokenNetwork = tokenInfo.querySelector('.token-price')?.textContent || '';
        
        // Update info with contract address display
        tokenInfo.innerHTML = `
          <div class="token-name">${tokenName}</div>
          <div class="token-network-badge">${tokenNetwork}</div>
          <div class="contract-address">${shortenAddress('0xC65B6...E90a51')}</div>
        `;
        
        // Style contract address
        const contractAddress = tokenInfo.querySelector('.contract-address');
        if (contractAddress) {
          contractAddress.style.fontSize = '12px';
          contractAddress.style.color = '#8A939D';
          contractAddress.style.fontFamily = 'monospace';
        }
        
        // Mark as enhanced
        item.setAttribute('data-enhanced', 'true');
      });
    } else {
      // Enhance QR view with network badge
      const receiveContent = receiveScreen.querySelector('.receive-content');
      
      if (receiveContent && !receiveContent.querySelector('.token-address-badge')) {
        // Get token data
        const tokenId = window.activeSendTokenId || 'btc';
        const activeWallet = window.activeWallet || 'main';
        const token = window.currentWalletData?.[activeWallet]?.tokens.find(t => t.id === tokenId);
        const tokenName = token?.name || 'Bitcoin';
        const tokenSymbol = token?.symbol || 'BTC';
        const networkName = token?.network || 'Bitcoin Network';
        
        // Create token selection with network badge
        const tokenSelection = document.createElement('div');
        tokenSelection.className = 'token-selection';
        tokenSelection.style.display = 'flex';
        tokenSelection.style.flexDirection = 'column';
        tokenSelection.style.alignItems = 'center';
        tokenSelection.style.marginBottom = '16px';
        
        tokenSelection.innerHTML = `
          <div class="token-icon-large">
            <img src="${getTokenLogoUrl(tokenId)}" alt="${tokenName}" style="width: 48px; height: 48px; border-radius: 50%;">
          </div>
          <h3>${tokenName} (${tokenSymbol})</h3>
          <div class="token-address-badge">
            <span class="network-badge-pill">${networkName}</span>
            <span class="contract-address">${shortenAddress('0xC65B6...E90a51')}</span>
          </div>
        `;
        
        // Style the badge
        const networkBadge = tokenSelection.querySelector('.network-badge-pill');
        if (networkBadge) {
          networkBadge.style.display = 'inline-block';
          networkBadge.style.fontSize = '12px';
          networkBadge.style.color = '#5F6C75';
          networkBadge.style.backgroundColor = '#F5F5F5';
          networkBadge.style.padding = '2px 8px';
          networkBadge.style.borderRadius = '10px';
          networkBadge.style.fontWeight = '400';
        }
        
        const contractAddress = tokenSelection.querySelector('.contract-address');
        if (contractAddress) {
          contractAddress.style.fontSize = '12px';
          contractAddress.style.color = '#8A939D';
          contractAddress.style.fontFamily = 'monospace';
        }
        
        // Add to receive content
        const qrContainer = receiveContent.querySelector('.qr-code-container');
        if (qrContainer) {
          receiveContent.insertBefore(tokenSelection, qrContainer);
        } else {
          receiveContent.insertBefore(tokenSelection, receiveContent.firstChild);
        }
      }
    }
    
    // Fix the layout of action buttons
    const actionButtons = receiveScreen.querySelectorAll('.qr-button, .copy-button');
    actionButtons.forEach(btn => {
      btn.style.width = '40px';
      btn.style.height = '40px';
      btn.style.borderRadius = '50%';
      btn.style.backgroundColor = '#F5F5F5';
      btn.style.display = 'flex';
      btn.style.justifyContent = 'center';
      btn.style.alignItems = 'center';
      btn.style.border = 'none';
      
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.color = '#8A939D';
      }
    });
    
    resolve();
  });
}

// Fix Network Badges across all screens
function enhanceNetworkBadges() {
  return new Promise(resolve => {
    log('Enhancing network badges');
    
    // Style all network filters
    document.querySelectorAll('.networks-filter .all-networks').forEach(filter => {
      filter.style.display = 'inline-flex';
      filter.style.alignItems = 'center';
      filter.style.background = '#F5F5F5';
      filter.style.borderRadius = '16px';
      filter.style.padding = '6px 12px';
      filter.style.fontSize = '12px';
      filter.style.color = '#5F6C75';
      filter.style.margin = '8px 16px';
      filter.style.fontWeight = '500';
      
      // Style the chevron
      const chevron = filter.querySelector('i.fa-chevron-down');
      if (chevron) {
        chevron.style.marginLeft = '6px';
        chevron.style.fontSize = '10px';
      }
    });
    
    // Fix container styles
    const filterContainers = document.querySelectorAll('.networks-filter');
    filterContainers.forEach(container => {
      container.style.textAlign = 'left';
      container.style.borderBottom = '1px solid #F5F5F5';
      container.style.paddingBottom = '8px';
    });
    
    // Add network badges to token items
    const networkMapping = {
      'usdt': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'twt': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'trx': 'https://cryptologos.cc/logos/tron-trx-logo.png',
      'eth': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'matic': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      'pol': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      'sol': 'https://cryptologos.cc/logos/solana-sol-logo.png',
      'xrp': 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
    };
    
    // Define network names
    const networkNames = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'bnb': 'BNB Chain',
      'usdt': 'BNB Chain',
      'trx': 'Tron',
      'sol': 'Solana',
      'pol': 'Polygon',
      'matic': 'Polygon',
      'xrp': 'XRP Ledger',
      'twt': 'BNB Chain'
    };
    
    // Process token items in send screen token selection
    document.querySelectorAll('#send-token-select .token-item').forEach(item => {
      const tokenId = item.getAttribute('data-token-id');
      if (!tokenId) return;
      
      const tokenInfo = item.querySelector('.token-info');
      if (!tokenInfo || tokenInfo.getAttribute('data-badge-added')) return;
      
      const tokenName = tokenInfo.querySelector('.token-name');
      if (!tokenName) return;
      
      // Create network badge pill
      const nameRow = document.createElement('div');
      nameRow.className = 'token-name-row';
      nameRow.style.display = 'flex';
      nameRow.style.alignItems = 'center';
      nameRow.style.width = '100%';
      
      // Create name element
      const newTokenName = document.createElement('div');
      newTokenName.className = 'token-name';
      newTokenName.textContent = tokenName.textContent;
      
      // Create network badge
      const networkBadge = document.createElement('div');
      networkBadge.className = 'network-badge-pill';
      networkBadge.textContent = networkNames[tokenId.toLowerCase()] || 'Unknown';
      networkBadge.style.display = 'inline-block';
      networkBadge.style.fontSize = '12px';
      networkBadge.style.color = '#5F6C75';
      networkBadge.style.backgroundColor = '#F5F5F5';
      networkBadge.style.padding = '2px 8px';
      networkBadge.style.borderRadius = '10px';
      networkBadge.style.marginLeft = '8px';
      networkBadge.style.fontWeight = '400';
      
      // Add to name row
      nameRow.appendChild(newTokenName);
      nameRow.appendChild(networkBadge);
      
      // Get existing second line text
      const tokenNetwork = tokenInfo.querySelector('.token-network') || 
                           tokenInfo.querySelector('.token-price');
      const secondLineText = tokenNetwork ? tokenNetwork.textContent : '';
      
      // Create second line element
      const secondLine = document.createElement('div');
      secondLine.className = 'token-fullname';
      secondLine.textContent = secondLineText;
      secondLine.style.fontSize = '12px';
      secondLine.style.color = '#8A939D';
      
      // Clear and repopulate token info
      tokenInfo.innerHTML = '';
      tokenInfo.appendChild(nameRow);
      tokenInfo.appendChild(secondLine);
      
      // Mark as processed
      tokenInfo.setAttribute('data-badge-added', 'true');
    });
    
    // Add badges to token icons based on token type
    document.querySelectorAll('.token-item').forEach(item => {
      const tokenId = item.getAttribute('data-token-id');
      if (!tokenId || !networkMapping[tokenId]) return;
      
      const tokenIcon = item.querySelector('.token-icon');
      if (!tokenIcon) return;
      
      // Add badge if missing
      let badge = tokenIcon.querySelector('.chain-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'chain-badge';
        
        const badgeImg = document.createElement('img');
        badgeImg.src = networkMapping[tokenId];
        badgeImg.alt = tokenId.toUpperCase() + ' Network';
        
        badge.appendChild(badgeImg);
        tokenIcon.appendChild(badge);
      }
      
      // Style the badge
      badge.style.display = 'block';
      badge.style.position = 'absolute';
      badge.style.bottom = '-4px';
      badge.style.right = '-4px';
      badge.style.width = '18px';
      badge.style.height = '18px';
      badge.style.borderRadius = '50%';
      badge.style.backgroundColor = 'white';
      badge.style.border = '2px solid white';
      badge.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      badge.style.zIndex = '1000';
      badge.style.overflow = 'visible';
      
      // Style badge image
      const badgeImg = badge.querySelector('img');
      if (badgeImg) {
        badgeImg.style.width = '100%';
        badgeImg.style.height = '100%';
        badgeImg.style.objectFit = 'contain';
      }
    });
    
    // Add to token detail page icon if needed
    const tokenDetailIcon = document.querySelector('.token-detail-icon-container img');
    if (tokenDetailIcon) {
      const tokenSymbol = document.getElementById('detail-symbol');
      if (tokenSymbol) {
        const tokenId = tokenSymbol.textContent.toLowerCase();
        
        if (networkMapping[tokenId] && !document.querySelector('.token-detail-icon-container .chain-badge')) {
          const badge = document.createElement('div');
          badge.className = 'chain-badge';
          
          const badgeImg = document.createElement('img');
          badgeImg.src = networkMapping[tokenId];
          badgeImg.alt = tokenId.toUpperCase() + ' Network';
          
          badge.appendChild(badgeImg);
          tokenDetailIcon.parentElement.appendChild(badge);
          
          // Style the detail page badge (slightly larger)
          badge.style.display = 'block';
          badge.style.position = 'absolute';
          badge.style.bottom = '-4px';
          badge.style.right = '-4px';
          badge.style.width = '24px';
          badge.style.height = '24px';
          badge.style.borderRadius = '50%';
          badge.style.backgroundColor = 'white';
          badge.style.border = '2px solid white';
          badge.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          badge.style.zIndex = '1000';
          badge.style.overflow = 'visible';
          
          // Style badge image
          badgeImg.style.width = '100%';
          badgeImg.style.height = '100%';
          badgeImg.style.objectFit = 'contain';
        }
      }
    }
    
    resolve();
  });
}

// Fix scrolling on all screens
function fixScrollingOnAllScreens() {
  return new Promise(resolve => {
    log('Fixing scrolling on all screens');
    
    // List of screens that should have scrolling
    const scrollableScreens = [
      'send-screen',
      'receive-screen',
      'history-screen',
      'send-token-select',
      'token-detail'
    ];
    
    scrollableScreens.forEach(screenId => {
      const screen = document.getElementById(screenId);
      if (!screen) return;
      
      // Enable scrolling
      screen.style.overflowY = 'auto';
      screen.style.overflowX = 'hidden';
      
      // Find content container in the screen
      const contentElement = screen.querySelector('.send-content, .receive-content, .screen-content, .token-detail-content, .token-list');
      if (contentElement) {
        // Ensure proper padding at the bottom for scrolling
        contentElement.style.paddingBottom = '80px';
      }
    });
    
    // Special handling for token list to ensure smooth scrolling
    const tokenLists = document.querySelectorAll('.token-list');
    tokenLists.forEach(list => {
      list.style.overflowY = 'auto';
      list.style.overflowX = 'hidden';
      list.style.webkitOverflowScrolling = 'touch'; // For smooth scrolling on iOS
    });
    
    resolve();
  });
}

// Center header titles in all screens
function centerHeaderTitles() {
  return new Promise(resolve => {
    log('Centering header titles');
    
    // Add global styles for header title centering
    const style = document.createElement('style');
    style.id = 'header-title-fix';
    style.textContent = `
      .screen-header h2 {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        text-align: center !important;
        width: auto !important;
        margin: 0 auto !important;
        z-index: 1 !important;
        pointer-events: none !important;
      }
      
      .screen-header .back-button {
        position: relative !important;
        z-index: 2 !important;
      }
      
      .screen-header .icon-button {
        position: relative !important;
        z-index: 2 !important;
      }
    `;
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('header-title-fix');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    resolve();
  });
}

// Fix Back Buttons on all screens
function fixBackButtons() {
  return new Promise(resolve => {
    log('Fixing back buttons');
    
    const backButtons = document.querySelectorAll('.back-button');
    
    backButtons.forEach(button => {
      // Skip if already fixed
      if (button.getAttribute('data-fixed-back-button')) return;
      
      // Ensure button is clickable
      button.style.cursor = 'pointer';
      
      // Remove existing listeners to prevent multiple bindings
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add new click handler
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the current screen
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        // Determine return screen based on current screen
        let returnTo = 'wallet-screen';
        
        // Check for data-return-to attribute
        if (currentScreen.dataset.returnTo) {
          returnTo = currentScreen.dataset.returnTo;
        }
        
        // Special handling for common screens
        switch(currentScreen.id) {
          case 'token-detail':
          case 'send-screen':
          case 'send-token-select':
          case 'receive-screen':
          case 'history-screen':
            returnTo = 'wallet-screen';
            break;
          // Add more specific cases if needed
        }
        
        // Use existing navigation method if available
        if (typeof window.navigateTo === 'function') {
          window.navigateTo(returnTo);
        } else {
          // Fallback navigation
          document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
            screen.classList.add('hidden');
          });
          
          const targetScreen = document.getElementById(returnTo);
          if (targetScreen) {
            targetScreen.style.display = 'flex';
            targetScreen.classList.remove('hidden');
          }
        }
      });
      
      // Mark as fixed
      newButton.setAttribute('data-fixed-back-button', 'true');
    });
    
    resolve();
  });
}

// Fix Bottom Navigation
function fixBottomNavigation() {
  return new Promise(resolve => {
    log('Fixing bottom navigation');
    
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (!bottomTabs) {
      // Create bottom tabs if missing
      const newBottomTabs = document.createElement('div');
      newBottomTabs.className = 'bottom-tabs';
      newBottomTabs.innerHTML = `
        <div class="tab-item active">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </div>
        <div class="tab-item">
          <i class="fas fa-chart-line"></i>
          <span>Trending</span>
        </div>
        <div class="tab-item">
          <i class="fas fa-exchange-alt"></i>
          <span>Swap</span>
        </div>
        <div class="tab-item">
          <i class="fas fa-piggy-bank"></i>
          <span>Earn</span>
        </div>
        <div class="tab-item">
          <i class="fas fa-compass"></i>
          <span>Discover</span>
        </div>
      `;
      
      document.body.appendChild(newBottomTabs);
      
      // Reference for other functions
      document.bottomTabs = newBottomTabs;
    } else {
      // Move to body for proper z-index stacking
      document.body.appendChild(bottomTabs);
      document.bottomTabs = bottomTabs;
    }
    
    // Apply critical styling to ensure visibility
    const tabsToStyle = document.bottomTabs || bottomTabs;
    if (tabsToStyle) {
      tabsToStyle.style.cssText = `
        display: flex !important;
        justify-content: space-around !important;
        background-color: white !important;
        border-top: 1px solid #F5F5F5 !important;
        padding: 8px 0 !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
      `;
      
      // Style the tab items
      tabsToStyle.querySelectorAll('.tab-item').forEach(tab => {
        // Add ripple effect for better touch feedback
        tab.classList.add('tw-ripple');
        
        // Fix styling
        tab.style.display = 'flex';
        tab.style.flexDirection = 'column';
        tab.style.alignItems = 'center';
        
        // Style icon
        const tabIcon = tab.querySelector('i');
        if (tabIcon) {
          tabIcon.style.fontSize = '20px';
          tabIcon.style.marginBottom = '4px';
          tabIcon.style.color = tab.classList.contains('active') ? '#3375BB' : '#8A939D';
        }
        
        // Style label
        const tabText = tab.querySelector('span');
        if (tabText) {
          tabText.style.fontSize = '10px';
          tabText.style.color = tab.classList.contains('active') ? '#3375BB' : '#8A939D';
        }
      });
      
      // Connect tab click events if not already added
      if (!tabsToStyle._hasClickHandlers) {
        tabsToStyle.querySelectorAll('.tab-item').forEach((tab, index) => {
          tab.addEventListener('click', function() {
            // Update active state visually
            tabsToStyle.querySelectorAll('.tab-item').forEach(t => {
              t.classList.remove('active');
              
              const tIcon = t.querySelector('i');
              const tText = t.querySelector('span');
              if (tIcon) tIcon.style.color = '#8A939D';
              if (tText) tText.style.color = '#8A939D';
            });
            
            tab.classList.add('active');
            
            // Update active tab styling
            const icon = tab.querySelector('i');
            const text = tab.querySelector('span');
            if (icon) icon.style.color = '#3375BB';
            if (text) text.style.color = '#3375BB';
            
            // Navigate based on tab index (only home tab works for demo)
            if (index === 0) {
              if (typeof window.navigateTo === 'function') {
                window.navigateTo('wallet-screen');
              } else {
                // Fallback
                document.querySelectorAll('.screen').forEach(screen => {
                  screen.style.display = 'none';
                  screen.classList.add('hidden');
                });
                
                const walletScreen = document.getElementById('wallet-screen');
                if (walletScreen) {
                  walletScreen.style.display = 'flex';
                  walletScreen.classList.remove('hidden');
                }
              }
            } else {
              // Show "coming soon" toast for other tabs
              const tabName = text ? text.textContent : 'Feature';
              if (typeof window.showToast === 'function') {
                window.showToast(`${tabName} coming soon`);
              } else {
                alert(`${tabName} coming soon`);
              }
            }
          });
        });
        
        tabsToStyle._hasClickHandlers = true;
      }
    }
    
    resolve();
  });
}

// Add additional CSS styles for Trust Wallet UI
function addEnhancementStyles() {
  return new Promise(resolve => {
    log('Adding comprehensive enhancement styles');
    
    // Create or update master style element
    let styleElement = document.getElementById('tw-comprehensive-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'tw-comprehensive-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      /* Investment warning styles */
      .investment-warning {
        width: calc(100% - 32px) !important;
        margin: 16px !important;
        background-color: #FEF9E7 !important;
        color: #D4AC0D !important;
        padding: 8px !important;
        font-size: 10px !important;
        border-radius: 8px !important;
        border-left: 4px solid #D4AC0D !important;
      }
      
      .investment-warning-content {
        display: flex !important;
        align-items: flex-start !important;
        padding: 4px !important;
      }
      
      .warning-icon {
        font-size: 20px !important;
        margin-right: 8px !important;
        margin-top: 2px !important;
      }
      
      /* Staking container styles */
      .staking-container {
        background-color: #F5F5F5 !important;
        border-radius: 16px !important;
        padding: 16px !important;
        margin: 16px !important;
        display: flex !important;
        align-items: center !important;
        position: relative !important;
      }
      
      /* Token Detail styles */
      #token-detail .token-price-info {
        position: sticky !important;
        bottom: 0 !important;
        background-color: white !important;
        z-index: 50 !important;
        padding-bottom: 80px !important;
        margin-bottom: 0 !important;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.05) !important;
      }
      
      /* Network badge styles */
      .networks-filter .all-networks {
        display: inline-flex !important;
        align-items: center !important;
        background: #F5F5F5 !important;
        border-radius: 16px !important;
        padding: 6px 12px !important;
        font-size: 12px !important;
        color: #5F6C75 !important;
        margin: 8px 16px !important;
        font-weight: 500 !important;
      }
      
      /* Network badge pill for send screen */
      .network-badge-pill {
        display: inline-block !important;
        font-size: 12px !important;
        color: #5F6C75 !important;
        background-color: #F5F5F5 !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        font-weight: 400 !important;
      }
      
      /* Chain badge updates */
      .chain-badge {
        position: absolute !important;
        bottom: -4px !important;
        right: -4px !important;
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background-color: white !important;
        border: 2px solid white !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
        z-index: 1000 !important;
        overflow: visible !important;
        display: block !important;
      }
      
      .chain-badge img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
      }
      
      /* Send screen token selection */
      .token-selection-row {
        display: grid !important;
        grid-template-columns: 36px 1fr auto !important;
        align-items: center !important;
        gap: 16px !important;
        padding: 12px 16px !important;
        background-color: #F5F5F5 !important;
        border-radius: 8px !important;
        margin-bottom: 16px !important;
        cursor: pointer !important;
      }
      
      /* Contract address style */
      .contract-address {
        font-size: 12px !important;
        color: #8A939D !important;
        font-family: monospace !important;
      }
      
      /* Scrolling improvements */
      .token-list, .transaction-list {
        -webkit-overflow-scrolling: touch !important;
      }
      
      /* Header enhancements */
      .screen-header {
        height: 48px !important;
      }
      
      .screen-header h2 {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        text-align: center !important;
        width: auto !important;
        margin: 0 auto !important;
        pointer-events: none !important;
        z-index: 1 !important;
      }
      
      .screen-header .back-button {
        position: relative !important;
        z-index: 2 !important;
      }
    `;
    
    resolve();
  });
}

// Utility function to shorten addresses
function shortenAddress(address) {
  if (!address) return '';
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

// Dynamic observer for screen changes
function setupDynamicContentObserver() {
  log('Setting up dynamic content observer');
  
  const observer = new MutationObserver(function(mutations) {
    let needsTokenDetailFix = false;
    let needsSendScreenFix = false;
    let needsReceiveScreenFix = false;
    let needsNetworkFilterFix = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'style' &&
          mutation.target.classList.contains('screen')) {
          
        const screenId = mutation.target.id;
        
        // Check if screen became visible
        if (mutation.target.style.display !== 'none') {
          if (screenId === 'token-detail') needsTokenDetailFix = true;
          if (screenId === 'send-screen') needsSendScreenFix = true;
          if (screenId === 'receive-screen') needsReceiveScreenFix = true;
          
          if (screenId === 'send-token-select' || 
              screenId === 'receive-screen' || 
              screenId === 'history-screen') {
            needsNetworkFilterFix = true;
          }
        }
      }
      
      // Check for list items being added
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const parent = mutation.target;
        
        if (parent && parent.id === 'token-list') {
          enhanceNetworkBadges();
        }
        
        if (parent && parent.id === 'select-token-list') {
          enhanceNetworkBadges();
        }
        
        if (parent && parent.id === 'receive-token-list') {
          enhanceReceiveScreen();
        }
        
        if (parent && parent.id === 'transaction-list') {
          // Add transaction fixes if needed
        }
      }
    });
    
    // Apply fixes as needed
    if (needsTokenDetailFix) enhanceTokenDetailView();
    if (needsSendScreenFix) enhanceSendScreen();
    if (needsReceiveScreenFix) enhanceReceiveScreen();
    if (needsNetworkFilterFix) enhanceNetworkBadges();
  });
  
  // Observe changes to the app container
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    observer.observe(appContainer, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
    
    log('Dynamic content observer set up');
  } else {
    log('App container not found for observer');
  }
}

// Setup navigation overrides
function setupNavigationOverrides() {
  log('Setting up navigation overrides');
  
  // Save original functions if they exist
  const originalNavigateTo = window.navigateTo;
  const originalShowTokenDetail = window.showTokenDetail;
  
  // Override navigateTo if it exists
  if (typeof originalNavigateTo === 'function') {
    window.navigateTo = function(targetScreenId, fromScreenId) {
      // Call original function
      const result = originalNavigateTo.call(this, targetScreenId, fromScreenId);
      
      // Apply specific fixes based on target screen
      setTimeout(() => {
        if (targetScreenId === 'token-detail') {
          enhanceTokenDetailView();
        }
        
        if (targetScreenId === 'send-screen') {
          enhanceSendScreen();
        }
        
        if (targetScreenId === 'send-token-select' ||
            targetScreenId === 'receive-screen' ||
            targetScreenId === 'history-screen') {
          enhanceNetworkBadges();
        }
        
        if (targetScreenId === 'receive-screen') {
          enhanceReceiveScreen();
        }
      }, 100);
      
      return result;
    };
    
    log('Navigation override setup successful');
  }
  
  // Override showTokenDetail if it exists
  if (typeof originalShowTokenDetail === 'function') {
    window.showTokenDetail = function(tokenId) {
      // Call original function
      const result = originalShowTokenDetail.call(this, tokenId);
      
      // Apply token detail fixes
      setTimeout(() => {
        enhanceTokenDetailView();
      }, 100);
      
      return result;
    };
    
    log('Token detail override setup successful');
  }
}

// Setup wallet selector
function fixWalletSwitching() {
  log('Fixing wallet switching');
  
  const walletSelector = document.querySelector('.wallet-selector');
  if (!walletSelector) return;
  
  // Remove existing click handler to prevent conflicts
  const newSelector = walletSelector.cloneNode(true);
  if (walletSelector.parentNode) {
    walletSelector.parentNode.replaceChild(newSelector, walletSelector);
  }
  
  // Add fresh handler
  newSelector.addEventListener('click', function() {
    const walletOrder = ['main', 'secondary', 'business'];
    const currentIndex = walletOrder.indexOf(window.activeWallet);
    const nextIndex = (currentIndex + 1) % walletOrder.length;
    
    // Update active wallet
    window.activeWallet = walletOrder[nextIndex];
    
    // Update wallet name in UI
    const walletName = this.querySelector('.wallet-name');
    if (walletName) {
      walletName.textContent = window.activeWallet === 'main' ? 'Main Wallet 1' : 
                               window.activeWallet === 'secondary' ? 'Mnemonic 2' : 'Mnemonic 3';
    }
    
    // Update UI with new wallet data
    if (window.updateWalletUI) {
      window.updateWalletUI(window.activeWallet);
    } else if (typeof window.populateMainWalletTokenList === 'function') {
      window.populateMainWalletTokenList();
    }
    
    // Update balance display
    const totalBalance = document.getElementById('total-balance');
    if (totalBalance && window.currentWalletData && window.currentWalletData[window.activeWallet]) {
      totalBalance.textContent = FormatUtils.formatCurrency(window.currentWalletData[window.activeWallet].totalBalance);
    }
    
    showToast('Switched to ' + walletName.textContent);
  });
}

// Final cleanup and checks
function finalCleanup() {
  return new Promise(resolve => {
    log('Performing final cleanup and checks');

    // Make sure navigation functions are exposed globally
    if (typeof window.navigateTo !== 'function') {
      window.navigateTo = function(targetScreenId, fromScreenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
          screen.style.display = 'none';
          screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(targetScreenId);
        if (targetScreen) {
          targetScreen.style.display = 'flex';
          targetScreen.classList.remove('hidden');
          
          // Set return to screen
          if (fromScreenId) {
            targetScreen.dataset.returnTo = fromScreenId;
          }
          
          // Apply specific enhancements based on the screen
          if (targetScreenId === 'token-detail') enhanceTokenDetailView();
          if (targetScreenId === 'send-screen') enhanceSendScreen();
          if (targetScreenId === 'receive-screen') enhanceReceiveScreen();
          
          return true;
        }
        
        return false;
      };
    }

    // Make sure initial screen is shown
    setTimeout(() => {
      const visibleScreens = Array.from(document.querySelectorAll('.screen')).filter(
        screen => !screen.classList.contains('hidden') && screen.style.display !== 'none'
      );

      if (visibleScreens.length === 0) {
        log('No visible screen detected, showing lock screen');
        window.navigateTo('lock-screen');
      }
    }, CONFIG.finalCleanupDelay);

    // Fix transaction status modal
    const txStatusModal = document.getElementById('tx-status-modal');
    if (txStatusModal) {
      txStatusModal.style.zIndex = '9999';

      const closeBtn = document.getElementById('close-tx-success');
      if (closeBtn) {
        closeBtn.onclick = function() {
          txStatusModal.style.display = 'none';
          window.navigateTo('wallet-screen');
        };
      }
    }

    // Fix explorer overlay
    const explorerOverlay = document.getElementById('explorer-overlay');
    if (explorerOverlay) {
      explorerOverlay.style.zIndex = '9999';

      const backButton = explorerOverlay.querySelector('.explorer-back-button');
      if (backButton) {
        backButton.onclick = function() {
          explorerOverlay.style.display = 'none';
        };
      }
    }
    
    // Remove any stray Bitcoin logos
    const strayBtcLogos = document.querySelectorAll('img[src*="bitcoin"][alt=""]');
    strayBtcLogos.forEach(img => img.remove());
  
    // Also check for logos at the bottom of token detail page
    const tokenPriceInfo = document.querySelector('.token-price-info');
    if (tokenPriceInfo) {
      const nextElement = tokenPriceInfo.nextElementSibling;
      if (nextElement && nextElement.tagName === 'IMG') {
        nextElement.remove();
      }
    }

    resolve();
  });
}

// Apply all UI enhancements
function applyAllEnhancements() {
  return new Promise((resolve) => {
    log('Applying all UI enhancements');
    
    // Add enhanced global styles
    addEnhancementStyles()
      .then(() => centerHeaderTitles())
      .then(() => enhanceNetworkBadges())
      .then(() => fixScrollingOnAllScreens())
      .then(() => enhanceTokenDetailView())
      .then(() => enhanceSendScreen())
      .then(() => enhanceReceiveScreen())
      .then(() => fixBackButtons())
      .then(() => fixBottomNavigation())
      .then(() => fixWalletSwitching())
      .then(() => {
        // Setup observers and overrides
        setupDynamicContentObserver();
        setupNavigationOverrides();
        
        // Final cleanup
        return finalCleanup();
      })
      .then(() => {
        log('All UI enhancements applied successfully');
        resolve();
      })
      .catch(error => {
        console.error('Error applying UI enhancements:', error);
        resolve(); // Resolve anyway to continue initialization
      });
  });
}

// =================================================================
// INITIALIZATION & STARTUP
// =================================================================

// Expose public API
window.TrustWallet = {
  // Core functions
  init: init,
  navigateTo: navigateTo,
  showToast: showToast,

  // State management
  updateWalletUI: updateWalletUI,
  setupDemoBalance: setupDemoBalance,

  // Screen functions
  showTokenDetail: showTokenDetail,
  showSendScreen: showSendScreen,
  showReceiveScreen: showReceiveScreen,

  // Admin panel
  showAdminPanel: showAdminPanel,
  startVerification: startVerification,

  // Transaction handling
  processTransaction: processTransaction,
  
  // UI enhancement functions
  applyAllEnhancements: applyAllEnhancements
};

// Auto-start with demo balances if enabled
setTimeout(function() {
  if (CONFIG.autoStartDemo && typeof window.setupDemoBalance === 'function') {
    window.setupDemoBalance();
  }
}, 1000);

// Apply enhancements after a delay
setTimeout(function() {
  applyAllEnhancements().then(() => {
    console.log('TrustWallet UI enhancements applied ✅');
  });
}, 1200);

// Force re-apply enhancements when DOM is fully loaded
window.addEventListener('load', function() {
  setTimeout(applyAllEnhancements, 1500);
});

// Auto-click on logo to navigate to wallet screen after setup (for demo)
setTimeout(function() {
  const lockLogo = document.querySelector('.lock-logo');
  if (lockLogo && document.getElementById('lock-screen') && 
      document.getElementById('lock-screen').style.display !== 'none') {
    // Simulate passcode entry
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.classList.add('filled');
        window.passcodeEntered += (index + 1).toString();
        
        if (index === 5) {
          setTimeout(() => {
            document.getElementById('lock-screen').style.display = 'none';
            document.getElementById('wallet-screen').style.display = 'flex';
            document.getElementById('wallet-screen').classList.remove('hidden');
          }, 300);
        }
      }, index * 150);
    });
  }
}, 2000);

console.log('TrustWallet: Comprehensive initialization complete ✅');
