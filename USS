<!-- Send Screen -->
<div id="send-screen" class="screen hidden">
    <div class="screen-header">
        <button class="back-button" aria-label="Go back">
            <i class="fas fa-arrow-left"></i>
        </button>
        <h2 id="send-token-title">Send USDT</h2>
        <div class="placeholder-icon"></div>
    </div>
    
    <!-- Address input section -->
    <div class="send-address-section">
        <div class="section-label">Address or Domain Name</div>
        <div class="address-input-wrapper">
            <input type="text" 
                  id="recipient-address" 
                  placeholder="Search or Enter"
                  autocomplete="off">
            <div class="address-input-actions">
                <button class="paste-button">Paste</button>
                <button class="scan-button">
                    <i class="fas fa-qrcode"></i>
                </button>
                <button class="fullscreen-button">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Amount input section -->
    <div class="send-amount-section">
        <div class="section-label">Amount</div>
        <div class="amount-input-wrapper">
            <input type="text" 
                  id="send-amount" 
                  placeholder="USDT Amount"
                  autocomplete="off">
            <button class="max-button">Max</button>
        </div>
        <div class="fiat-value">
            $0.00
        </div>
    </div>
    
    <!-- Network display -->
    <div class="network-display">
        <div class="network-icon">
            <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Smart Chain">
        </div>
        <div class="network-info">
            <div class="network-name">BNB Smart Chain</div>
            <div class="network-fee">Network Fee: ~$0.05</div>
        </div>
    </div>
    
    <!-- Next button -->
    <div class="next-button-container">
        <button id="continue-send" class="next-button">Next</button>
    </div>
</div>

<style>
/* Send Screen Styles */
#send-screen {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    height: 100%;
}

#send-screen .screen-header {
    display: flex;
    align-items: center;
    padding: 16px;
    position: relative;
}

#send-screen .back-button {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1A2024;
    background: transparent;
    border: none;
    padding: 0;
}

#send-screen h2 {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #1A2024;
}

#send-screen .placeholder-icon {
    width: 32px;
}

.send-address-section,
.send-amount-section {
    padding: 16px;
    margin-bottom: 8px;
}

.section-label {
    font-size: 16px;
    font-weight: 500;
    color: #5F6C75;
    margin-bottom: 12px;
}

.address-input-wrapper,
.amount-input-wrapper {
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border: 1px solid #E8E8E8;
    border-radius: 8px;
    overflow: hidden;
    padding: 0 4px 0 16px;
    height: 56px;
}

.address-input-wrapper input,
.amount-input-wrapper input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #1A2024;
    background: transparent;
    height: 100%;
}

.address-input-wrapper input::placeholder,
.amount-input-wrapper input::placeholder {
    color: #8A939D;
}

.address-input-actions {
    display: flex;
    align-items: center;
}

.paste-button {
    color: #3375BB;
    font-weight: 500;
    font-size: 16px;
    border: none;
    background: transparent;
    padding: 0 10px;
}

.scan-button,
.fullscreen-button {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: transparent;
    color: #3375BB;
    font-size: 18px;
}

.max-button {
    color: #3375BB;
    font-weight: 500;
    font-size: 16px;
    border: none;
    background: transparent;
    padding: 0 16px;
}

.fiat-value {
    margin-top: 8px;
    text-align: right;
    font-size: 14px;
    color: #8A939D;
}

.network-display {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #F5F5F5;
    margin-top: auto; /* Push to bottom before button */
    margin-bottom: 16px;
}

.network-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: a6px;
}

.network-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.network-info {
    flex: 1;
}

.network-name {
    font-size: 16px;
    font-weight: 500;
    color: #1A2024;
}

.network-fee {
    font-size: 14px;
    color: #8A939D;
    margin-top: 2px;
}

.next-button-container {
    padding: 16px;
    margin-bottom: 16px;
}

.next-button {
    width: 100%;
    height: 56px;
    background-color: #3375BB;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.next-button:disabled {
    background-color: #E8E8E8;
    color: #8A939D;
    cursor: not-allowed;
}
</style>

<script>
// Script to make the Send Screen functional
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sendAmountInput = document.getElementById('send-amount');
    const recipientAddressInput = document.getElementById('recipient-address');
    const nextButton = document.getElementById('continue-send');
    const fiatValue = document.querySelector('.fiat-value');
    const pasteButton = document.querySelector('.paste-button');
    const maxButton = document.querySelector('.max-button');
    
    // Update fiat value when amount changes
    sendAmountInput.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        // Assuming 1 USDT = $1
        fiatValue.textContent = `$${amount.toFixed(2)}`;
    });
    
    // Paste button functionality
    pasteButton.addEventListener('click', async function() {
        try {
            const text = await navigator.clipboard.readText();
            recipientAddressInput.value = text;
        } catch (err) {
            alert('Failed to read clipboard: ' + err);
        }
    });
    
    // Max button functionality
    maxButton.addEventListener('click', function() {
        // Get max amount from available balance
        const maxAmount = document.getElementById('max-amount');
        if (maxAmount) {
            sendAmountInput.value = maxAmount.textContent;
            // Trigger input event to update fiat value
            sendAmountInput.dispatchEvent(new Event('input'));
        }
    });
    
    // Process transaction when Next is clicked
    nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate input
        const amount = parseFloat(sendAmountInput.value);
        const address = recipientAddressInput.value.trim();
        
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (!address) {
            alert('Please enter a valid recipient address');
            return;
        }
        
        // Call the existing processSendTransaction function
        if (typeof processSendTransaction === 'function') {
            processSendTransaction(e);
        } else {
            console.error('processSendTransaction function not found');
            alert('Transaction processing is not available');
        }
    });
});
</script>
