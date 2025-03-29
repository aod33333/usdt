<!-- Receive Screen -->
<div id="receive-screen" class="screen hidden">
    <div class="screen-header">
        <button class="back-button" aria-label="Go back">
            <i class="fas fa-arrow-left"></i>
        </button>
        <h2>Receive</h2>
        <div class="placeholder-icon"></div>
    </div>
    
    <!-- Search bar -->
    <div class="search-container">
        <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" 
                id="receive-search-input" 
                placeholder="Search" 
                aria-label="Search">
        </div>
    </div>
    
    <!-- Network filter -->
    <div class="networks-filter">
        <div class="all-networks">
            All Networks <i class="fas fa-chevron-down"></i>
        </div>
    </div>
    
    <!-- Popular coins section -->
    <div class="coins-section">
        <h3 class="section-title">Popular</h3>
        <div class="coins-list">
            <!-- Bitcoin -->
            <div class="coin-item" data-coin="btc">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin">
                </div>
                <div class="coin-info">
                    <div class="coin-name">BTC <span class="network-label">Bitcoin</span></div>
                    <div class="coin-address">bc1qltf...fsxp4p</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- Ethereum -->
            <div class="coin-item" data-coin="eth">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum">
                </div>
                <div class="coin-info">
                    <div class="coin-name">ETH <span class="network-label">Ethereum</span></div>
                    <div class="coin-address">0xC65B6...E90a51</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- Solana -->
            <div class="coin-item" data-coin="sol">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="Solana">
                </div>
                <div class="coin-info">
                    <div class="coin-name">SOL <span class="network-label">Solana</span></div>
                    <div class="coin-address">B8WVMQL...rCs4jB</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- BNB -->
            <div class="coin-item" data-coin="bnb">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB">
                </div>
                <div class="coin-info">
                    <div class="coin-name">BNB <span class="network-label">BNB Smart Chain</span></div>
                    <div class="coin-address">0xC65B6...E90a51</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- All crypto section -->
    <div class="coins-section">
        <h3 class="section-title">All crypto</h3>
        <div class="coins-list">
            <!-- USDT -->
            <div class="coin-item" data-coin="usdt">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT">
                    <div class="network-badge">
                        <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain">
                    </div>
                </div>
                <div class="coin-info">
                    <div class="coin-name">USDT <span class="network-label">BNB Smart Chain</span></div>
                    <div class="coin-address">0xC65B6...E90a51</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- TRX -->
            <div class="coin-item" data-coin="trx">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/tron-trx-logo.png" alt="TRON">
                </div>
                <div class="coin-info">
                    <div class="coin-name">TRX <span class="network-label">Tron</span></div>
                    <div class="coin-address">TZ3gtUo...xghKtX</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- POL -->
            <div class="coin-item" data-coin="pol">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/polygon-matic-logo.png" alt="Polygon">
                </div>
                <div class="coin-info">
                    <div class="coin-name">POL <span class="network-label">Polygon</span></div>
                    <div class="coin-address">0xC65B6...E90a51</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- UNI -->
            <div class="coin-item" data-coin="uni">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/uniswap-uni-logo.png" alt="Uniswap">
                    <div class="network-badge">
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum">
                    </div>
                </div>
                <div class="coin-info">
                    <div class="coin-name">UNI <span class="network-label">Ethereum</span></div>
                    <div class="coin-address">0xC65B6...E90a51</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
            
            <!-- XRP -->
            <div class="coin-item" data-coin="xrp">
                <div class="coin-icon">
                    <img src="https://cryptologos.cc/logos/xrp-xrp-logo.png" alt="XRP">
                </div>
                <div class="coin-info">
                    <div class="coin-name">XRP <span class="network-label">XRP</span></div>
                    <div class="coin-address">rsSmpFn...hiBWxT</div>
                </div>
                <div class="coin-actions">
                    <button class="action-qr">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="action-copy">
                        <i class="far fa-clone"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- QR Code Modal for showing single coin address -->
<div id="qr-modal" class="modal hidden">
    <div class="qr-modal-content">
        <div class="qr-header">
            <button class="qr-close-button">
                <i class="fas fa-times"></i>
            </button>
            <div class="qr-title">
                <span id="qr-coin-name">BTC</span>
                <span id="qr-network-name">Bitcoin</span>
            </div>
            <div class="placeholder-icon"></div>
        </div>
        
        <div class="qr-content">
            <div class="qr-code-container">
                <!-- QR Code will be generated here -->
                <div id="qr-code"></div>
            </div>
            <div class="qr-address-container">
                <div id="qr-address" class="qr-address">bc1qltfhpkgqw6ug6vtw76z2uftwy7jtmr6vfsxp4p</div>
            </div>
            <div class="qr-actions">
                <button class="qr-action-button copy-button">
                    <i class="far fa-copy"></i>
                    <span>Copy</span>
                </button>
                <button class="qr-action-button share-button">
                    <i class="fas fa-share-alt"></i>
                    <span>Share</span>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
/* Receive Screen Styles */
#receive-screen {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    height: 100%;
}

#receive-screen .screen-header {
    display: flex;
    align-items: center;
    padding: 16px;
}

#receive-screen .back-button {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1A2024;
    background: transparent;
    border: none;
}

#receive-screen h2 {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #1A2024;
}

#receive-screen .placeholder-icon {
    width: 32px;
}

#receive-screen .search-container {
    padding: 0 16px 16px;
}

#receive-screen .search-bar {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 30px;
    padding: 8px 16px;
}

#receive-screen .search-bar i {
    color: #8A939D;
    margin-right: 8px;
}

#receive-screen .search-bar input {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    color: #1A2024;
    font-size: 14px;
}

.networks-filter {
    padding: 8px 16px;
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.all-networks {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 12px;
    color: #1A2024;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.all-networks i {
    margin-left: 4px;
    font-size: 10px;
    color: #8A939D;
}

.section-title {
    font-size: 16px;
    font-weight: 500;
    padding: 8px 16px;
    margin: 0;
    color: #5F6C75;
}

.coins-section {
    margin-bottom: 16px;
}

.coins-list {
    background-color: #FFFFFF;
}

.coin-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #F5F5F5;
}

.coin-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: visible;
    margin-right: 16px;
    position: relative;
}

.coin-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.network-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    border: 1px solid #FFFFFF;
}

.network-badge img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.coin-info {
    flex: 1;
}

.coin-name {
    font-size: 16px;
    font-weight: 500;
    color: #1A2024;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
}

.network-label {
    font-size: 13px;
    font-weight: 400;
    color: #8A939D;
    margin-left: 8px;
}

.coin-address {
    font-size: 13px;
    color: #8A939D;
}

.coin-actions {
    display: flex;
    gap: 16px;
}

.action-qr,
.action-copy {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 50%;
    border: none;
    color: #5F6C75;
    font-size: 16px;
    cursor: pointer;
}

/* QR Code Modal */
#qr-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.qr-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.qr-header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #F5F5F5;
}

.qr-close-button {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1A2024;
    background: transparent;
    border: none;
    font-size: 18px;
}

.qr-title {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#qr-coin-name {
    font-size: 18px;
    font-weight: 600;
    color: #1A2024;
}

#qr-network-name {
    font-size: 14px;
    color: #8A939D;
}

.qr-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.qr-code-container {
    width: 280px;
    height: 280px;
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 32px;
}

#qr-code {
    width: 100%;
    height: 100%;
}

.qr-address-container {
    width: 100%;
    max-width: 320px;
    margin-bottom: 32px;
}

.qr-address {
    text-align: center;
    word-break: break-all;
    font-size: 14px;
    line-height: 1.5;
    color: #1A2024;
    background-color: #F5F5F5;
    padding: 16px;
    border-radius: 8px;
}

.qr-actions {
    display: flex;
    gap: 24px;
}

.qr-action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
}

.qr-action-button i {
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 50%;
    font-size: 20px;
    color: #1A2024;
    margin-bottom: 8px;
}

.qr-action-button span {
    font-size: 14px;
    color: #1A2024;
}

.hidden {
    display: none !important;
}
</style>

<script>
// Script to make the Receive Screen functional
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('receive-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase();
            const coinItems = document.querySelectorAll('.coin-item');
            
            coinItems.forEach(item => {
                const coinName = item.querySelector('.coin-name').textContent.toLowerCase();
                const coinAddress = item.querySelector('.coin-address').textContent.toLowerCase();
                
                if (coinName.includes(searchText) || coinAddress.includes(searchText)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // QR code modal
    const qrButtons = document.querySelectorAll('.action-qr');
    const qrModal = document.getElementById('qr-modal');
    const qrCloseButton = document.querySelector('.qr-close-button');
    
    qrButtons.forEach(button => {
        button.addEventListener('click', function() {
            const coinItem = this.closest('.coin-item');
            const coinId = coinItem.getAttribute('data-coin');
            const coinName = coinItem.querySelector('.coin-name').textContent.split(' ')[0];
            const networkName = coinItem.querySelector('.network-label').textContent;
            const address = coinItem.querySelector('.coin-address').textContent;
            
            // Update QR modal with coin details
            document.getElementById('qr-coin-name').textContent = coinName;
            document.getElementById('qr-network-name').textContent = networkName;
            document.getElementById('qr-address').textContent = address;
            
            // Generate QR code (using a simple placeholder in this case)
            // In a real app, you would use a library like qrcode.js
            const qrCodeElement = document.getElementById('qr-code');
            qrCodeElement.innerHTML = createPlaceholderQRCode(address);
            
            // Show the modal
            qrModal.classList.remove('hidden');
        });
    });
    
    // Close QR modal
    if (qrCloseButton) {
        qrCloseButton.addEventListener('click', function() {
            qrModal.classList.add('hidden');
        });
    }
    
    // Copy address functionality
    const copyButtons = document.querySelectorAll('.action-copy, .copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            let address;
            
            // Get address based on which button was clicked
            if (this.classList.contains('action-copy')) {
                address = this.closest('.coin-item').querySelector('.coin-address').textContent;
            } else {
                address = document.getElementById('qr-address').textContent;
            }
            
            // Copy to clipboard
            navigator.clipboard.writeText(address)
                .then(() => {
                    alert('Address copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy address');
                });
        });
    });
    
    // Simple function to create a placeholder QR code
    function createPlaceholderQRCode(data) {
        // This creates a simple visual placeholder for a QR code
        // In a real app, use a proper QR code library
        const size = 240;
        const cellSize = 8;
        const rows = size / cellSize;
        const cols = size / cellSize;
        
        let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect width="${size}" height="${size}" fill="white"/>`;
        
        // Add position marker squares (corners)
        svg += `<rect x="0" y="0" width="${cellSize * 7}" height="${cellSize * 7}" fill="black"/>`;
        svg += `<rect x="${size - cellSize * 7}" y="0" width="${cellSize * 7}" height="${cellSize * 7}" fill="black"/>`;
        svg += `<rect x="0" y="${size - cellSize * 7}" width="${cellSize * 7}" height="${cellSize * 7}" fill="black"/>`;
        
        // Add inner white squares for position markers
        svg += `<rect x="${cellSize}" y="${cellSize}" width="${cellSize * 5}" height="${cellSize * 5}" fill="white"/>`;
        svg += `<rect x="${size - cellSize * 6}" y="${cellSize}" width="${cellSize * 5}" height="${cellSize * 5}" fill="white"/>`;
        svg += `<rect x="${cellSize}" y="${size - cellSize * 6}" width="${cellSize * 5}" height="${cellSize * 5}" fill="white"/>`;
        
        // Add inner black squares for position markers
        svg += `<rect x="${cellSize * 2}" y="${cellSize * 2}" width="${cellSize * 3}" height="${cellSize * 3}" fill="black"/>`;
        svg += `<rect x="${size - cellSize * 5}" y="${cellSize * 2}" width="${cellSize * 3}" height="${cellSize * 3}" fill="black"/>`;
        svg += `<rect x="${cellSize * 2}" y="${size - cellSize * 5}" width="${cellSize * 3}" height="${cellSize * 3}" fill="black"/>`;
        
        // Generate random QR pattern based on address (simple hash)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash = hash & hash;
        }
        
        // Seed random generator with hash
        const random = (seed) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        
        // Draw random squares for QR code effect
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // Skip the position marker areas
                if ((i < 7 && j < 7) || (i < 7 && j > cols - 8) || (i > rows - 8 && j < 7)) {
                    continue;
                }
                
                // Add some random squares
                if (random(hash + i * cols + j) > 0.75) {
                    svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
                }
            }
        }
        
        svg += '</svg>';
        return svg;
    }
});
