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
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Remove previous errors
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    const formData = {
        cardName: document.getElementById('cardName')?.value,
        cardNumber: document.getElementById('cardNumber')?.value.replace(/\s/g, ''),
        expiry: document.getElementById('expiry')?.value,
        cvv: document.getElementById('cvv')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        terms: document.getElementById('terms')?.checked
    };
    
    const errors = validatePaymentForm(formData);
    
    if (errors.length > 0) {
        errors.forEach(error => {
            showToast(error.message, 'error');
            document.getElementById(error.field)?.classList.add('error');
        });
        return;
    }
    
    // Add processing state to button
    submitButton.classList.add('processing');
    submitButton.disabled = true;

    processPayment(formData, () => {
        // Remove processing state on completion
        submitButton.classList.remove('processing');
        submitButton.disabled = false;
    });
}

function validatePaymentForm(data) {
    const errors = [];
    
    if (!data.cardName || data.cardName.trim().length < 3) {
        errors.push({ field: 'cardName', message: 'Kart üzerindeki ismi eksiksiz girin' });
    }
    
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
        errors.push({ field: 'cardNumber', message: 'Geçerli bir kart numarası girin (16 hane)' });
    }
    
    if (!data.expiry || !/^\d{2}\/\d{2}$/.test(data.expiry)) {
        errors.push({ field: 'expiry', message: 'Geçerli bir son kullanma tarihi girin (AA/YY)' });
    } else {
        const [month, year] = data.expiry.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
            errors.push({ field: 'expiry', message: 'Geçersiz ay' });
        } else if (parseInt(year) < currentYear || 
                   (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            errors.push({ field: 'expiry', message: 'Kartınızın süresi dolmuş' });
        }
    }
    
    if (!data.cvv || !/^\d{3}$/.test(data.cvv)) {
        errors.push({ field: 'cvv', message: 'Geçerli bir CVV girin (3 hane)' });
    }
    
    if (!data.email || !validateEmail(data.email)) {
        errors.push({ field: 'email', message: 'Geçerli bir e-posta adresi girin' });
    }
    
    if (!data.phone || !validatePhone(data.phone)) {
        errors.push({ field: 'phone', message: 'Geçerli bir telefon numarası girin' });
    }

    if (!data.terms) {
        errors.push({ field: 'terms', message: 'Kullanım şartlarını kabul etmelisiniz.' });
    }
    
    return errors;
}

function processPayment(data, onComplete) {
    showToast('Ödeme işleminiz doğrulanıyor...', 'info');
    
    setTimeout(() => {
        // Simulate API call success/failure
        const isSuccess = Math.random() > 0.1; // 90% success rate

        if (isSuccess) {
            const orderNumber = generateOrderNumber();
            const orderData = {
                orderNumber,
                items: cart.items,
                total: cart.getTotal(),
                customerEmail: data.email,
                orderDate: new Date().toISOString()
            };
            
            // Save order and clear cart
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
            const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
            allOrders.push(orderData);
            localStorage.setItem('allOrders', JSON.stringify(allOrders));
            
            cart.clear();
            
            showToast('Ödeme başarılı! Onay sayfasına yönlendiriliyorsunuz.', 'success');
            
            setTimeout(() => {
                window.location.href = 'siparis-onay.html';
            }, 1500);

        } else {
            // Simulate payment failure
            showToast('Ödeme başarısız. Bankanızla iletişime geçin.', 'error');
            onComplete(); // Restore button state
        }
        
    }, 2500); // Increased delay for realism
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