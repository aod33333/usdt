// TrustWalletLoader.js - Universal component and initialization system
(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    debug: true,
    loadDelay: 100,
    initDelay: 300,
    checkInterval: 250,
    maxRetries: 20,
    loadOrder: [
      'combined.js',    // Core functionality first
      'screens',        // Screen content second
      'finalfix.js'     // Enhancements and fixes last
    ]
  };
  
  // Global state
  const state = {
    initialized: false,
    screensLoaded: {
      'history-screen': false,
      'receive-screen': false,
      'send-screen': false
    },
    retries: 0
  };
  
  // Logging helper
  function log(message) {
    if (CONFIG.debug) {
      console.log(`TrustWallet Loader: ${message}`);
    }
  }
  
  // Main initialization function
  function init() {
    log('Starting initialization sequence');
    
    // Ensure the app container exists
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
      console.error('App container not found!');
      return;
    }
    
    // First initialize global variables
    initGlobalVariables();
    
    // Then create needed screen containers
    createScreenContainers(appContainer);
    
    // Then load screens content
    loadScreensContent();
    
    // Finally connect event handlers after everything is loaded
    setTimeout(connectEventHandlers, CONFIG.initDelay * 3);
    
    state.initialized = true;
    log('Initialization sequence complete');
  }
  
  // Initialize essential global variables
  function initGlobalVariables() {
    window.originalWalletData = window.originalWalletData || null;
    window.currentWalletData = window.currentWalletData || null;
    window.activeWallet = window.activeWallet || 'main';
    window.correctPasscode = window.correctPasscode || '123456';
    
    log('Global variables initialized');
  }
  
  // Create screen containers if they don't exist
  function createScreenContainers(appContainer) {
    log('Creating screen containers');
    
    // List of required screens
    const requiredScreens = [
      'history-screen',
      'receive-screen',
      'send-screen',
      'send-token-select',
      'token-detail',
      'wallet-screen',
      'lock-screen'
    ];
    
    // Create missing screens
    requiredScreens.forEach(screenId => {
      if (!document.getElementById(screenId)) {
        const screen = document.createElement('div');
        screen.id = screenId;
        screen.className = 'screen hidden';
        appContainer.appendChild(screen);
        log(`Created container for ${screenId}`);
      } else {
        log(`Container for ${screenId} already exists`);
      }
    });
  }
  
  // Load screen content from document sources
  function loadScreensContent() {
    log('Loading screen content');
    
    // Map of screen IDs to document sources
    const screenSources = {
      'history-screen': 'UHS.js',
      'receive-screen': 'URS.js',
      'send-screen': 'USS.js'
    };
    
    // Find document sources in the DOM
    Object.entries(screenSources).forEach(([screenId, sourceFile]) => {
      const screen = document.getElementById(screenId);
      if (!screen) {
        log(`Screen ${screenId} not found`);
        return;
      }
      
      // Try to find the content in document elements
      const docSource = Array.from(document.querySelectorAll('document'))
        .find(doc => doc.querySelector('source')?.textContent.trim() === sourceFile);
      
      if (docSource) {
        const content = docSource.querySelector('document_content')?.textContent;
        if (content && screen.innerHTML.trim() === '') {
          screen.innerHTML = content;
          
          // Execute any scripts in the content
          const scriptContent = screen.querySelector('script');
          if (scriptContent) {
            const newScript = document.createElement('script');
            newScript.textContent = scriptContent.textContent;
            document.body.appendChild(newScript);
          }
          
          // Add styles from the content
          const styleContent = screen.querySelector('style');
          if (styleContent) {
            document.head.appendChild(styleContent.cloneNode(true));
          }
          
          log(`Loaded content for ${screenId} from ${sourceFile}`);
          state.screensLoaded[screenId] = true;
        } else if (!content) {
          log(`No content found for ${screenId} in ${sourceFile}`);
        } else {
          log(`Screen ${screenId} already has content`);
        }
      } else {
        log(`Source file ${sourceFile} not found in document elements`);
      }
    });
    
    // Create token selection screen if needed
    initTokenSelectionScreen();
  }
  
  // Initialize token selection screen
  function initTokenSelectionScreen() {
    const tokenSelectScreen = document.getElementById('send-token-select');
    if (!tokenSelectScreen || tokenSelectScreen.innerHTML.trim() !== '') return;
    
    tokenSelectScreen.innerHTML = `
      <div class="screen-header">
        <button class="back-button" aria-label="Go back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2>Send</h2>
        <div class="placeholder-icon"></div>
      </div>
      
      <div class="search-container">
        <div class="search-bar token-search">
          <i class="fas fa-search"></i>
          <input type="text" id="token-search-input" placeholder="Search" aria-label="Search tokens">
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
    `;
    
    log('Created token selection screen');
  }
  
  // Connect all event handlers
  function connectEventHandlers() {
    log('Connecting event handlers');
    
    // Connect back buttons
    document.querySelectorAll('.back-button').forEach(button => {
      button.addEventListener('click', function() {
        const currentScreen = this.closest('.screen');
        if (!currentScreen) return;
        
        const returnTo = currentScreen.dataset.returnTo || 'wallet-screen';
        navigateToScreen(returnTo);
      });
    });
    
    // Connect main screen buttons
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        navigateToScreen('send-token-select', 'wallet-screen');
      });
    }
    
    const receiveButton = document.getElementById('receive-button');
    if (receiveButton) {
      receiveButton.addEventListener('click', function() {
        navigateToScreen('receive-screen', 'wallet-screen');
      });
    }
    
    const historyButton = document.querySelector('.quick-actions .action-circle:nth-child(5)');
    if (historyButton) {
      historyButton.addEventListener('click', function() {
        navigateToScreen('history-screen', 'wallet-screen');
      });
    }
    
    // Make sure tokens in the list are clickable
    document.querySelectorAll('.token-item').forEach(item => {
      item.addEventListener('click', function() {
        const tokenId = this.getAttribute('data-token-id');
        if (tokenId) {
          if (typeof window.showTokenDetail === 'function') {
            window.showTokenDetail(tokenId);
          } else {
            navigateToScreen('token-detail');
          }
        }
      });
    });
    
    log('Event handlers connected');
  }
  
  // Safe navigation function that works even with combined.js
  function navigateToScreen(screenId, fromScreenId) {
    log(`Navigating to ${screenId}${fromScreenId ? ' from ' + fromScreenId : ''}`);
    
    // Use the existing navigateTo function if it exists
    if (typeof window.navigateTo === 'function') {
      return window.navigateTo(screenId, fromScreenId);
    }
    
    // Otherwise implement our own navigation logic
    document.querySelectorAll('.screen').forEach(screen => {
      screen.style.display = 'none';
      screen.classList.add('hidden');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.style.display = 'flex';
      targetScreen.classList.remove('hidden');
      
      // Remember where we came from
      if (fromScreenId) {
        targetScreen.dataset.returnTo = fromScreenId;
      }
      
      return true;
    } else {
      console.error(`Target screen ${screenId} not found`);
      return false;
    }
  }
  
  // Make navigateToScreen available globally
  window.navigateToScreen = navigateToScreen;
  
  // Harmony function to ensure all scripts work together
  function ensureHarmony() {
    log('Ensuring harmony between scripts');
    
    // Fix network badges that might be reinserted dynamically
    setInterval(function() {
      document.querySelectorAll('#send-screen, #receive-screen').forEach(screen => {
        if (!screen) return;
        
        const badges = screen.querySelectorAll('.chain-badge, .chain-badge-fixed, .network-badge');
        badges.forEach(badge => {
          badge.style.display = 'none';
        });
      });
    }, 500);
    
    // Fix bottom tabs to ensure they're always visible at bottom
    const bottomTabs = document.querySelector('.bottom-tabs');
    if (bottomTabs) {
      // Move to body for proper stacking
      document.body.appendChild(bottomTabs);
      
      // Ensure proper styling
      bottomTabs.style.cssText = `
        display: flex !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        background-color: white !important;
        border-top: 1px solid #F5F5F5 !important;
        padding: 8px 0 !important;
      `;
    }
    
    // If the combined.js contains a function we need to override or enhance
    if (typeof window.showSendScreen === 'function') {
      const originalShowSendScreen = window.showSendScreen;
      window.showSendScreen = function(tokenId) {
        log('Enhanced showSendScreen called with: ' + tokenId);
        return originalShowSendScreen(tokenId);
      };
    }
    
    log('Harmony ensured');
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, CONFIG.loadDelay);
  }
  
  // Ensure harmony after a delay to let other scripts initialize
  setTimeout(ensureHarmony, CONFIG.initDelay * 2);
  
})();
