// ============================================
// CHECKOUT PAGE - ÖDEME SAYFASI
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('odeme.html')) {
        initCheckoutPage();
    }
});

function initCheckoutPage() {
    // Sepet boşsa anasayfaya yönlendir
    if (cart.items.length === 0) {
        showToast('Sepetiniz boş!', 'error');
        setTimeout(() => {
            window.location.href = 'egitimler.html';
        }, 1500);
        return;
    }
    
    renderCheckoutItems();
    updateCheckoutSummary();
    initPaymentForm();
}

function renderCheckoutItems() {
    const itemsContainer = document.querySelector('.checkout-items');
    
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = cart.items.map(item => `
        <div class="flex items-center gap-4 py-3 border-b border-[#222f49]">
            <div class="w-16 h-16 bg-center bg-cover rounded-lg flex-shrink-0" 
                 style="background-image: url('${item.image}')"></div>
            <div class="flex-1">
                <p class="text-white font-medium">${item.name}</p>
                <p class="text-[#90a4cb] text-sm">Miktar: ${item.quantity}</p>
            </div>
            <p class="text-white font-semibold">₺${item.price * item.quantity}</p>
        </div>
    `).join('');
}

function updateCheckoutSummary() {
    const total = cart.getTotal();
    
    const totalEl = document.querySelector('.checkout-total');
    if (totalEl) totalEl.textContent = `₺${total}`;
}

function initPaymentForm() {
    const form = document.getElementById('paymentForm');
    
    if (!form) return;
    
    // Kart numarası formatla
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/\D/g, '');
            value = value.substring(0, 16);
            
            // 4'lü gruplara ayır
            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
            
            // Validasyon
            if (value.length === 16) {
                e.target.classList.remove('error');
            }
        });
    }
    
    // CVV formatla
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.substring(0, 3);
            
            if (value.length === 3) {
                e.target.classList.remove('error');
            }
        });
    }
    
    // Son kullanma tarihi formatla
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
            
            if (value.length === 5) {
                e.target.classList.remove('error');
            }
        });
    }
    
    // Form submit
    form.addEventListener('submit', handlePaymentSubmit);
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const formData = {
        cardName: document.getElementById('cardName')?.value,
        cardNumber: document.getElementById('cardNumber')?.value.replace(/\s/g, ''),
        expiry: document.getElementById('expiry')?.value,
        cvv: document.getElementById('cvv')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value
    };
    
    // Validasyon
    const errors = validatePaymentForm(formData);
    
    if (errors.length > 0) {
        errors.forEach(error => {
            showToast(error, 'error');
        });
        return;
    }
    
    // Ödeme işlemi simülasyonu
    processPayment(formData);
}

function validatePaymentForm(data) {
    const errors = [];
    
    if (!data.cardName || data.cardName.trim().length < 3) {
        errors.push('Kart üzerindeki ismi eksiksiz girin');
        document.getElementById('cardName')?.classList.add('error');
    }
    
    if (!data.cardNumber || data.cardNumber.length !== 16) {
        errors.push('Geçerli bir kart numarası girin (16 hane)');
        document.getElementById('cardNumber')?.classList.add('error');
    }
    
    if (!data.expiry || data.expiry.length !== 5) {
        errors.push('Geçerli bir son kullanma tarihi girin (AA/YY)');
        document.getElementById('expiry')?.classList.add('error');
    } else {
        // Tarihi kontrol et
        const [month, year] = data.expiry.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
            errors.push('Geçersiz ay');
            document.getElementById('expiry')?.classList.add('error');
        } else if (parseInt(year) < currentYear || 
                   (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            errors.push('Kartınızın süresi dolmuş');
            document.getElementById('expiry')?.classList.add('error');
        }
    }
    
    if (!data.cvv || data.cvv.length !== 3) {
        errors.push('Geçerli bir CVV girin (3 hane)');
        document.getElementById('cvv')?.classList.add('error');
    }
    
    if (!data.email || !validateEmail(data.email)) {
        errors.push('Geçerli bir e-posta adresi girin');
        document.getElementById('email')?.classList.add('error');
    }
    
    if (!data.phone || !validatePhone(data.phone)) {
        errors.push('Geçerli bir telefon numarası girin');
        document.getElementById('phone')?.classList.add('error');
    }
    
    return errors;
}

function processPayment(data) {
    showLoading();
    
    // Ödeme işlemi simülasyonu (2 saniye)
    setTimeout(() => {
        hideLoading();
        
        // Sipariş numarası oluştur
        const orderNumber = generateOrderNumber();
        
        // Sipariş bilgilerini kaydet
        const orderData = {
            orderNumber,
            items: cart.items,
            total: cart.getTotal(),
            customerEmail: data.email,
            customerPhone: data.phone,
            orderDate: new Date().toISOString()
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Sepeti temizle
        cart.clear();
        
        // Başarı sayfasına yönlendir
        window.location.href = 'siparis-onay.html';
    }, 2000);
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}-${random}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}