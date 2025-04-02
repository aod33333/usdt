// Trust Wallet Comprehensive Patch
 
 document.addEventListener('DOMContentLoaded', function() {
   // Comprehensive Fixes Function
   function applyComprehensiveFixes() {
     // 1. Fix Token Detail Header Alignment
     function fixTokenDetailHeaderAlignment() {
       const detailHeader = document.querySelector('#token-detail .detail-header');
       if (!detailHeader) return;
       
       // Center the title element
       const titleElement = detailHeader.querySelector('.token-detail-title');
       if (titleElement) {
         detailHeader.style.position = 'relative';
         titleElement.style.position = 'absolute';
         titleElement.style.top = '50%';
         titleElement.style.left = '50%';
         titleElement.style.transform = 'translate(-50%, -50%)';
         titleElement.style.width = '100%';
         titleElement.style.textAlign = 'center';
         
         // Ensure back button stays above title
         const backButton = detailHeader.querySelector('.back-button');
         if (backButton) {
           backButton.style.position = 'relative';
           backButton.style.zIndex = '2';
         }
         
         // Ensure header icons stay above title
         const headerIcons = detailHeader.querySelector('.header-icons');
         if (headerIcons) {
           headerIcons.style.position = 'relative';
           headerIcons.style.zIndex = '2';
         }
       }
     }
 
     // 2. Fix Scrolling and Price Section
     function fixTokenDetailScrolling() {
       const tokenDetailContent = document.querySelector('.token-detail-content');
       const tokenPriceInfo = document.querySelector('.token-price-info');
       
       if (tokenDetailContent && tokenPriceInfo) {
         // Make content scrollable
         tokenDetailContent.style.overflowY = 'auto';
         tokenDetailContent.style.height = 'calc(100% - 48px)';
         
         // Fix price section
         tokenPriceInfo.style.position = 'sticky';
         tokenPriceInfo.style.bottom = '0';
         tokenPriceInfo.style.backgroundColor = 'white';
         tokenPriceInfo.style.zIndex = '50';
         tokenPriceInfo.style.marginBottom = '0';
         tokenPriceInfo.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
         
         // Ensure transaction list is scrollable
         const transactionList = tokenDetailContent.querySelector('.transaction-list');
         if (transactionList) {
           transactionList.style.maxHeight = 'calc(100% - 250px)';
           transactionList.style.overflowY = 'auto';
         }
       }
     }
 
     // 3. Network Badges Fix (from previous patch)
     function fixNetworkBadges() {
       const networkBadgeMap = {
         'usdt': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
         'twt': 'https://i.ibb.co/NdQ4xthx/Screenshot-2025-03-25-031716.png',
         'bnb': 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
       };
 
       const tokenItems = document.querySelectorAll('.token-item');
       tokenItems.forEach(item => {
         const tokenId = item.getAttribute('data-token-id');
         const tokenIcon = item.querySelector('.token-icon');
         
         if (tokenId && networkBadgeMap[tokenId] && tokenIcon) {
           // Remove existing badge
           const existingBadge = tokenIcon.querySelector('.chain-badge');
           if (existingBadge) existingBadge.remove();
 
           // Create new badge
           const badge = document.createElement('div');
           badge.className = 'chain-badge';
           const badgeImg = document.createElement('img');
           badgeImg.src = networkBadgeMap[tokenId];
           badgeImg.alt = tokenId.toUpperCase() + ' Network';
           badge.appendChild(badgeImg);
           
           tokenIcon.appendChild(badge);
         }
       });
 
       // Remove badge from ETH
       const ethTokenItems = document.querySelectorAll('.token-item[data-token-id="eth"] .chain-badge');
       ethTokenItems.forEach(badge => badge.remove());
     }
 
     // 4. Staking Banner Improvements
     function updateStakingBanner() {
       const stakingBanners = document.querySelectorAll('.staking-container');
       stakingBanners.forEach(banner => {
         const tokenSymbol = document.getElementById('detail-symbol')?.textContent.toUpperCase() || 'USDT';
         
         const stakingTitle = banner.querySelector('h3');
         const stakingDesc = banner.querySelector('p');
         
         if (stakingTitle) {
           stakingTitle.textContent = `Earn ${tokenSymbol}`;
         }
         
         if (stakingDesc) {
           stakingDesc.textContent = `Stake your ${tokenSymbol} to earn up to 6.5% APY`;
         }
       });
     }
 
     // 5. Re-add TWT Token
     function ensureTWTToken() {
       const activeWallet = window.activeWallet || 'main';
       const wallet = window.currentWalletData && window.currentWalletData[activeWallet];
       
       if (wallet && wallet.tokens) {
         // Check if TWT exists
         const hasTWT = wallet.tokens.some(t => t.id === 'twt');
         
         if (!hasTWT) {
           // Add TWT token
           wallet.tokens.push({
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
           });
           
           // Repopulate token list
           if (typeof window.populateMainWalletTokenList === 'function') {
             window.populateMainWalletTokenList();
           }
         }
       }
     }
 
     // 6. Improve Admin Panel Functionality
     function enhanceAdminPanel() {
       const applyButton = document.getElementById('apply-fake');
       const resetButton = document.getElementById('reset-wallet');
       const walletSelect = document.getElementById('admin-wallet-select');
       const tokenSelect = document.getElementById('admin-token-select');
       const balanceInput = document.getElementById('fake-balance');
       const generateHistoryCheckbox = document.getElementById('generate-history');
       const modifyAllCheckbox = document.getElementById('modify-all-wallets');
 
       if (applyButton) {
         applyButton.addEventListener('click', function() {
           const walletId = walletSelect.value;
           const tokenId = tokenSelect.value;
           const amount = parseFloat(balanceInput.value);
           const generateHistory = generateHistoryCheckbox.checked;
           const modifyAll = modifyAllCheckbox.checked;
 
           if (isNaN(amount)) {
             alert('Please enter a valid amount');
             return;
           }
 
           const walletsToModify = modifyAll 
             ? Object.keys(window.currentWalletData || {})
             : [walletId];
           
           walletsToModify.forEach(wId => {
             const wallet = window.currentWalletData[wId];
             const token = wallet.tokens.find(t => t.id === tokenId);
 
             if (token) {
               // Update token balance
               token.amount = amount / token.price;
               token.value = amount;
               
               // Update total wallet balance
               wallet.totalBalance = wallet.tokens.reduce((total, t) => total + t.value, 0);
 
               // Generate transaction history if enabled
               if (generateHistory) {
                 if (!window.currentTransactions) window.currentTransactions = {};
                 if (!window.currentTransactions[wId]) window.currentTransactions[wId] = {};
                 if (!window.currentTransactions[wId][tokenId]) window.currentTransactions[wId][tokenId] = [];
 
                 const transaction = {
                   id: `tx-${Date.now()}`,
                   type: 'receive',
                   amount: token.amount,
                   symbol: token.symbol,
                   value: token.value,
                   date: new Date().toISOString().split('T')[0],
                   from: '0x' + Math.random().toString(36).substring(2, 15),
                   to: '0x9B3a54D092f6B4b3d2eC676cd589f124E9921E71',
                   hash: '0x' + Math.random().toString(36).substring(2, 15)
                 };
 
                 window.currentTransactions[wId][tokenId].unshift(transaction);
               }
 
               // Update UI
               if (window.updateWalletUI) {
                 window.updateWalletUI(wId);
               }
             }
           });
 
           // Repopulate token list
           if (window.populateMainWalletTokenList) {
             window.populateMainWalletTokenList();
           }
 
           alert('Balance updated successfully');
         });
       }
     }
 
     // 7. Receive Screen Improvements
     function improveReceiveScreen() {
       const receiveScreen = document.getElementById('receive-screen');
       if (!receiveScreen) return;
 
       // Target both direct action buttons and ones in token list
       const actionButtons = receiveScreen.querySelectorAll('.action-button, .qr-button, .copy-button');
       
       actionButtons.forEach(button => {
         // Make perfect circles with proper color
         button.style.width = '40px';
         button.style.height = '40px';
         button.style.borderRadius = '50%';
         button.style.backgroundColor = '#F5F5F5';
         button.style.display = 'flex';
         button.style.justifyContent = 'center';
         button.style.alignItems = 'center';
         button.style.border = 'none';
         
         // Fix icon color
         const icon = button.querySelector('i');
         if (icon) {
           icon.style.color = '#5F6C75';
         }
       });
 
       // Fix copy address button specifically
       const copyAddressButton = receiveScreen.querySelector('.copy-address-button');
       if (copyAddressButton) {
         copyAddressButton.style.backgroundColor = '#3375BB';
         
         const copyIcon = copyAddressButton.querySelector('i');
         if (copyIcon) {
           copyIcon.style.color = 'white';
         }
       }
     }
 
     // Run all fixes
     fixTokenDetailHeaderAlignment();
     fixTokenDetailScrolling();
     fixNetworkBadges();
     updateStakingBanner();
     ensureTWTToken();
     enhanceAdminPanel();
     improveReceiveScreen();
   }
 
   // Initial application of fixes
   applyComprehensiveFixes();
 
   // Mutation observer to reapply fixes dynamically
   const observer = new MutationObserver(function(mutations) {
     mutations.forEach(function(mutation) {
       if (mutation.type === 'attributes' && 
           mutation.attributeName === 'style' &&
           mutation.target.classList.contains('screen') &&
           mutation.target.style.display !== 'none') {
         
         applyComprehensiveFixes();
       }
     });
   });
 
   const appContainer = document.querySelector('.app-container');
   if (appContainer) {
     observer.observe(appContainer, {
       attributes: true,
       subtree: true,
       attributeFilter: ['style', 'class']
     });
   }
 });
