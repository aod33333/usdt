// Fix script - must load BEFORE wallet-fix.js
window.processSendTransaction = function() {
  try {
    // Get active token
    const tokenId = window.activeSendTokenId || 'usdt';
    const wallet = window.currentWalletData?.[window.activeWallet];
    if (!wallet) return;
    
    const token = wallet.tokens?.find(t => t.id === tokenId);
    if (!token) return;
    
    // Get input values
    const recipientAddressEl = document.getElementById('recipient-address');
    const sendAmountEl = document.getElementById('send-amount');
    if (!recipientAddressEl || !sendAmountEl) return;
    
    const recipient = recipientAddressEl.value?.trim() || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const amount = parseFloat(sendAmountEl.value?.trim() || '0');
    
    // Validate
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount > token.amount) {
      alert('Insufficient balance');
      return;
    }
    
    // Hide screens
    document.querySelectorAll('.screen, .modal').forEach(screen => {
      screen.style.display = 'none';
      screen.classList.add('hidden');
    });
    
    // Show transaction modal
    const txStatusModal = document.getElementById('tx-status-modal');
    if (txStatusModal) {
      txStatusModal.style.display = 'flex';
      txStatusModal.classList.remove('hidden');
      
      // Generate TX hash
      const txHash = '0x' + Array.from({length:64}, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      
      // Update UI and complete transaction (rest of the function)
      // ...
    }
  } catch (error) {
    console.error('Transaction error:', error);
    alert('Transaction failed');
  }
};

// Fix for CryptoUtils
window.CryptoUtils = {
  hashSource: function(source) {
    let hash = 0;
    for (let i = 0; i < String(source).length; i++) {
      hash = ((hash << 5) - hash) + String(source).charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  },
  generateSecureTransactionHash: function(txData) {
    return '0x' + Array.from({length:64}, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
  }
};
