// ============================================
// CART PAGE - SEPET SAYFASI
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('sepet.html')) {
        initCartPage();
    }
});

function initCartPage() {
    renderCartItems();
    updateCartSummary();
    
    // Ödeme butonuna event listener ekle
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                showToast('Sepetiniz boş!', 'error');
                return;
            }
            window.location.href = 'odeme.html';
        });
    }
}

function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items-container');
    
    if (!cartContainer) return;
    
    if (cart.items.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-20">
                <span class="material-symbols-outlined text-6xl text-white/20 mb-4">shopping_cart</span>
                <h2 class="text-white text-2xl font-bold mb-2">Sepetiniz Boş</h2>
                <p class="text-[#90a4cb] mb-6">Eğitim paketlerimize göz atın ve hedeflerinize ulaşın!</p>
                <a href="egitimler.html" class="btn btn-primary px-6 py-3">Paketleri İncele</a>
            </div>
        `;
        return;
    }
    
    cartContainer.innerHTML = cart.items.map(item => `
        <div class="flex flex-col sm:flex-row gap-4 border-b border-[#222f49] pb-6 fade-in">
            <div class="w-full sm:w-32 h-32 flex-shrink-0 bg-center bg-cover rounded-lg" 
                 style="background-image: url('${item.image}')"></div>
            <div class="flex flex-col justify-between flex-1 gap-2">
                <div class="flex justify-between items-start flex-wrap gap-2">
                    <div>
                        <h2 class="text-white text-lg font-bold">${item.name}</h2>
                        <p class="text-[#90a4cb] text-sm">${item.period} Abonelik</p>
                    </div>
                    <p class="text-white font-semibold text-lg whitespace-nowrap">₺${item.price} / ay</p>
                </div>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2 rounded-lg bg-[#182234] border border-[#222f49] px-2">
                        <button class="quantity-btn text-white/50 hover:text-white transition-colors p-1" 
                                data-id="${item.id}" data-action="decrease">
                            <span class="material-symbols-outlined text-base">remove</span>
                        </button>
                        <span class="text-white font-medium w-8 text-center">${item.quantity}</span>
                        <button class="quantity-btn text-white/50 hover:text-white transition-colors p-1" 
                                data-id="${item.id}" data-action="increase">
                            <span class="material-symbols-outlined text-base">add</span>
                        </button>
                    </div>
                    <button class="remove-btn text-red-500 hover:text-red-400 transition-colors p-1" 
                            data-id="${item.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Event listeners
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

function handleQuantityChange(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    
    if (action === 'increase') {
        cart.updateQuantity(id, 1);
    } else {
        cart.updateQuantity(id, -1);
    }
    
    renderCartItems();
    updateCartSummary();
}

function handleRemoveItem(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    
    if (confirm('Bu ürünü sepetten kaldırmak istediğinize emin misiniz?')) {
        cart.removeItem(id);
        renderCartItems();
        updateCartSummary();
    }
}

function updateCartSummary() {
    const subtotal = cart.getTotal();
    const discount = 0;
    const total = subtotal - discount;
    
    const subtotalEl = document.querySelector('.cart-subtotal');
    const discountEl = document.querySelector('.cart-discount');
    const totalEl = document.querySelector('.cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `₺${subtotal}`;
    if (discountEl) discountEl.textContent = `-₺${discount}`;
    if (totalEl) totalEl.textContent = `₺${total}`;
}