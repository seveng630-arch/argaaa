// Catalog Data (5 Laptops as requested)
const products = [
    {
        id: 1,
        name: "ASUS ROG Zephyrus G14",
        category: "ROG",
        price: 25000000,
        rating: 4.9,
        specs: "AMD Ryzen 9 | RTX 4060 | 16GB RAM | 1TB SSD",
        image: "https://placehold.co/600x400/12141c/00f0ff?text=ROG+Zephyrus+G14"
    },
    {
        id: 2,
        name: "ASUS TUF Gaming F15",
        category: "TUF",
        price: 15000000,
        rating: 4.7,
        specs: "Intel Core i7 | RTX 4050 | 16GB RAM | 512GB SSD",
        image: "https://placehold.co/600x400/12141c/ff003c?text=TUF+Gaming+F15"
    },
    {
        id: 3,
        name: "ASUS ZenBook 14 OLED",
        category: "ZenBook",
        price: 18000000,
        rating: 4.8,
        specs: "Intel Core Ultra 7 | Intel Arc | 16GB RAM | 1TB SSD",
        image: "https://placehold.co/600x400/12141c/00f0ff?text=ZenBook+14+OLED"
    },
    {
        id: 4,
        name: "ASUS VivoBook Pro 15",
        category: "VivoBook",
        price: 12000000,
        rating: 4.6,
        specs: "AMD Ryzen 7 | RTX 2050 | 16GB RAM | 512GB SSD",
        image: "https://placehold.co/600x400/12141c/ff003c?text=VivoBook+Pro+15"
    },
    {
        id: 5,
        name: "ASUS ROG Strix SCAR 16",
        category: "ROG",
        price: 35000000,
        rating: 5.0,
        specs: "Intel Core i9 | RTX 4080 | 32GB RAM | 1TB SSD",
        image: "https://placehold.co/600x400/12141c/00f0ff?text=ROG+Strix+SCAR+16"
    }
];

let cart = [];
let currentFilter = 'all';
let searchQuery = '';
let currentPaymentMethod = 'Tunai';
let lastTransactionData = null;

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    handlePaymentMethodChange('Tunai');
});

// Format Currency to IDR
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// Render Products Grid
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if (items.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16 text-slate-500">
                <i class="fa-solid fa-face-sad-tear text-4xl mb-3"></i>
                <p class="text-base font-semibold">Tidak ada laptop yang sesuai dengan pencarian Anda.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map(product => `
        <div class="product-card glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group">
            <div>
                <div class="relative overflow-hidden aspect-video bg-[#0a0b0e]">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/600x400/12141c/ffffff?text=ASUS+Laptop'">
                    <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center space-x-1 text-xs text-amber-400 font-bold">
                        <i class="fa-solid fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                    <div class="absolute top-3 right-3 bg-cyan-500/20 text-rogCyan border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        ${product.category}
                    </div>
                </div>
                <div class="p-6">
                    <h4 class="font-bold text-lg text-white mb-2 group-hover:text-rogCyan transition-colors">${product.name}</h4>
                    <p class="text-xs text-slate-400 mb-4 h-8">${product.specs}</p>
                    <div class="text-lg font-extrabold text-white">${formatRupiah(product.price)}</div>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="addToCart(${product.id})" class="w-full py-3 rounded-xl bg-[#1a1d28] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-black text-white font-bold text-xs border border-white/10 hover:border-transparent transition-all flex items-center justify-center space-x-2 shadow-md">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Tambah ke Keranjang</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Products by Category
function filterProducts(category) {
    currentFilter = category;
    
    ['all', 'ROG', 'TUF', 'ZenBook', 'VivoBook'].forEach(cat => {
        const btn = document.getElementById(`filter-${cat}`);
        if (cat === category) {
            btn.className = "px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black transition-all whitespace-nowrap shadow-lg shadow-cyan-500/20";
        } else {
            btn.className = "px-4 py-2 rounded-xl text-xs font-semibold bg-[#12141c] text-slate-300 border border-white/10 hover:border-rogCyan transition-all whitespace-nowrap";
        }
    });

    applyFilters();
}

// Search Filter handler
function handleSearch() {
    searchQuery = document.getElementById('searchInput').value.toLowerCase();
    applyFilters();
}

// Combine filter and search
function applyFilters() {
    let filtered = products;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }
    if (searchQuery.trim() !== '') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery) || p.specs.toLowerCase().includes(searchQuery));
    }
    renderProducts(filtered);
}

// Reset to Catalog main view
function resetToCatalog() {
    currentFilter = 'all';
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    filterProducts('all');
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`Berhasil menambahkan ${product.name}`);
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItemsCount > 0) {
        badge.innerText = totalItemsCount;
        badge.classList.remove('scale-0');
        badge.classList.add('scale-100');
        checkoutBtn.removeAttribute('disabled');
    } else {
        badge.classList.remove('scale-100');
        badge.classList.add('scale-0');
        checkoutBtn.setAttribute('disabled', 'true');
    }

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-20 text-slate-500">
                <i class="fa-solid fa-cart-shopping text-4xl mb-3 opacity-30"></i>
                <p class="text-sm">Keranjang Anda masih kosong</p>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between p-4 rounded-2xl bg-[#0a0b0e] border border-white/5">
                <div class="flex-1 pr-3">
                    <h5 class="text-xs font-bold text-white mb-1">${item.name}</h5>
                    <div class="text-xs text-rogCyan font-semibold">${formatRupiah(item.price)}</div>
                </div>
                <div class="flex items-center space-x-2 bg-[#12141c] px-3 py-1.5 rounded-xl border border-white/10">
                    <button onclick="updateQuantity(${item.id}, -1)" class="text-slate-400 hover:text-white px-1"><i class="fa-solid fa-minus text-xs"></i></button>
                    <span class="text-xs font-bold text-white w-4 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="text-slate-400 hover:text-white px-1"><i class="fa-solid fa-plus text-xs"></i></button>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.innerText = formatRupiah(subtotal);
    totalEl.innerText = formatRupiah(subtotal);
}

// Cart Drawer Toggles
function toggleCartDrawer(open) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (open) {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        drawer.classList.remove('translate-x-full');
    } else {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        drawer.classList.add('translate-x-full');
    }
}

// Checkout Modal Toggles
function openCheckoutModal() {
    toggleCartDrawer(false);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutTotalDisplay').innerText = formatRupiah(total);
    
    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutModalContent');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutModalContent');
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
}

// Payment Method Handler & Dynamic Input
function handlePaymentMethodChange(method) {
    currentPaymentMethod = method;
    const container = document.getElementById('dynamicPaymentSection');

    if (method === 'Tunai') {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        container.innerHTML = `
            <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Jumlah Uang Pembayaran (Tunai)</label>
                <div class="relative">
                    <span class="absolute left-4 top-3.5 text-xs text-slate-400 font-bold">Rp</span>
                    <input type="number" id="cashInput" placeholder="${total}" class="w-full bg-[#0a0b0e] border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:border-rogCyan outline-none transition-all">
                </div>
            </div>
        `;
    } else if (method === 'Transfer BCA') {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-[#0a0b0e] border border-white/10 text-xs space-y-2">
                <div class="font-bold text-white mb-1"><i class="fa-solid fa-circle-info text-rogCyan mr-1"></i> Instruksi Transfer BCA</div>
                <p class="text-slate-400">Silakan transfer total tagihan ke rekening BCA:</p>
                <div class="text-rogCyan font-mono font-bold text-sm tracking-wider">8830192831 (a.n PT Arga Store Indonesia)</div>
                <p class="text-slate-400">Pesanan akan otomatis diverifikasi sistem setelah klik selesai.</p>
            </div>
        `;
    } else if (method === 'QRIS') {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-[#0a0b0e] border border-white/10 text-center space-y-3">
                <div class="font-bold text-white text-xs">Scan QRIS untuk Pembayaran Instant</div>
                <div class="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                    <i class="fa-solid fa-qrcode text-7xl text-black"></i>
                </div>
                <p class="text-[11px] text-slate-400">Mendukung GoPay, OVO, Dana, ShopeePay, m-BCA</p>
            </div>
        `;
    }
}

// Process Payment & Generate Receipt matching exact requested text format
function processPayment() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let cashPaid = total;

    if (currentPaymentMethod === 'Tunai') {
        const cashInputEl = document.getElementById('cashInput');
        cashPaid = cashInputEl ? parseFloat(cashInputEl.value) || 0 : 0;

        if (cashPaid < total) {
            showToast("Jumlah uang tunai kurang dari total belanja!");
            return;
        }
    }

    const change = cashPaid - total;

    let receiptLines = [];
    receiptLines.push("Uraian pembelian");
    
    cart.forEach(item => {
        const itemTotalStr = formatRupiah(item.price * item.quantity);
        const lineName = item.quantity > 1 ? `${item.name} (${item.quantity}x)` : item.name;
        receiptLines.push(`${lineName.padEnd(24, ' ')} ${itemTotalStr}`);
    });

    receiptLines.push("----------------------------------------");
    receiptLines.push(`${"Total".padEnd(24, ' ')} ${formatRupiah(total)}`);
    receiptLines.push(`${"Uang".padEnd(24, ' ')} ${formatRupiah(cashPaid)}`);
    receiptLines.push(`${"Kembalian".padEnd(24, ' ')} ${formatRupiah(change)}`);

    lastTransactionData = receiptLines.join('\n');

    closeCheckoutModal();
    
    document.getElementById('receiptOutputBox').innerText = lastTransactionData;
    
    const receiptModal = document.getElementById('receiptModal');
    const receiptContent = document.getElementById('receiptModalContent');
    receiptModal.classList.remove('opacity-0', 'pointer-events-none');
    receiptContent.classList.remove('scale-95');
    receiptContent.classList.add('scale-100');
}

function printReceipt() {
    window.print();
}

function finishTransaction() {
    cart = [];
    updateCartUI();
    
    const receiptModal = document.getElementById('receiptModal');
    const receiptContent = document.getElementById('receiptModalContent');
    receiptModal.classList.add('opacity-0', 'pointer-events-none');
    receiptContent.classList.remove('scale-100');
    receiptContent.classList.add('scale-95');

    showToast("Transaksi selesai. Terima kasih telah berbelanja!");
}

// Toast Notification Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}