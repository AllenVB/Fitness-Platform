// ============================================
// AUTHENTICATION SYSTEM - KAYIT VE GİRİŞ
// ============================================

class AuthSystem {
    constructor() {
        this.currentUser = this.loadUser();
        this.users = this.getUsers();
        this.updateUI();
        this.initializeDefaultUsers();
    }

    // Demo kullanıcıları ekle (test için)
    initializeDefaultUsers() {
        if (this.users.length === 0) {
            const demoUsers = [
                {
                    id: 1,
                    name: 'Demo Kullanıcı',
                    email: 'demo@example.com',
                    phone: '5551234567',
                    password: 'demo123',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(demoUsers));
            this.users = demoUsers;
        }
    }

    loadUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    saveUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateUI();
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Email validasyonu
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Şifre gücü kontrolü
    validatePassword(password) {
        return password.length >= 6;
    }

    register(userData) {
        // Validasyon kontrolleri
        if (!userData.name || userData.name.trim().length < 2) {
            return { success: false, message: 'Ad en az 2 karakter olmalı!' };
        }

        if (!this.validateEmail(userData.email)) {
            return { success: false, message: 'Lütfen geçerli bir e-posta adresi girin!' };
        }

        if (!userData.phone || userData.phone.trim().length < 10) {
            return { success: false, message: 'Telefon numarası en az 10 karakter olmalı!' };
        }

        if (!this.validatePassword(userData.password)) {
            return { success: false, message: 'Şifre en az 6 karakter olmalı!' };
        }

        const users = this.getUsers();

        // E-posta kontrolü
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Bu e-posta adresi zaten kayıtlı!' };
        }

        const newUser = {
            id: Date.now(),
            name: userData.name.trim(),
            email: userData.email.toLowerCase().trim(),
            phone: userData.phone.trim(),
            password: userData.password, // Gerçek uygulamada hash'lenmeli!
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        this.users = users;

        // Otomatik giriş yap
        this.saveUser(newUser);

        return { success: true, message: 'Kayıt başarılı! Hoş geldiniz.' };
    }

    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'E-posta ve şifre gereklidir!' };
        }

        const users = this.getUsers();
        const user = users.find(u =>
            u.email === email.toLowerCase().trim() &&
            u.password === password
        );

        if (user) {
            this.saveUser(user);
            return { success: true, message: 'Giriş başarılı!' };
        }

        return { success: false, message: 'E-posta veya şifre hatalı!' };
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUI();
        showToast('Çıkış yapıldı', 'success');

        // Anasayfaya yönlendir (başka sayfadaysak)
        if (!window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    updateUI() {
        // Kayıt/Giriş butonlarını güncelle
        const authButtons = document.querySelectorAll('.auth-buttons');
        const userProfile = document.querySelectorAll('.user-profile');

        authButtons.forEach(container => {
            if (this.isLoggedIn()) {
                container.style.display = 'none';
            } else {
                container.style.display = 'flex';
            }
        });

        userProfile.forEach(profile => {
            if (this.isLoggedIn()) {
                profile.style.display = 'flex';
                const userName = profile.querySelector('.user-name');
                const userInitial = profile.querySelector('.user-initial');
                if (userName) {
                    userName.textContent = this.currentUser.name.split(' ')[0];
                }
                if (userInitial) {
                    userInitial.textContent = this.currentUser.name.charAt(0).toUpperCase();
                }
            } else {
                profile.style.display = 'none';
            }
        });

        // Tüm sayfadaki user-name ve user-initial elementlerini güncelle
        if (this.isLoggedIn()) {
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = this.currentUser.name.split(' ')[0];
            });
            document.querySelectorAll('.user-initial').forEach(el => {
                el.textContent = this.currentUser.name.charAt(0).toUpperCase();
            });
        }
    }

    requireAuth(redirectToCheckout = false) {
        if (!this.isLoggedIn()) {
            showToast('Bu işlem için giriş yapmanız gerekiyor', 'warning');

            // Modal açma sinyali
            const modal = document.getElementById('authModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            return false;
        }

        // Kullanıcı giriş yapmışsa ve sepette ürün varsa ödeme sayfasına yönlendir
        if (redirectToCheckout && typeof cart !== 'undefined' && cart.items && cart.items.length > 0) {
            window.location.href = 'odeme.html';
        }

        return true;
    }
}

// Global auth instance
const auth = new AuthSystem();

// ============================================
// MODAL FUNCTIONS
// ============================================

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Formlara erişme
    const loginFormEl = loginForm.querySelector('form');
    const registerFormEl = registerForm.querySelector('form');

    if (mode === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        // Login formunu temizle
        if (loginFormEl) loginFormEl.reset();
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        // Register formunu temizle
        if (registerFormEl) registerFormEl.reset();
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus'u ilk input'a ver
    setTimeout(() => {
        const firstInput = (mode === 'login' ? loginForm : registerForm).querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Formlara erişme ve temizle
    const loginFormEl = loginForm.querySelector('form');
    const registerFormEl = registerForm.querySelector('form');

    if (loginFormEl) loginFormEl.reset();
    if (registerFormEl) registerFormEl.reset();
}

function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerFormEl = registerForm.querySelector('form');

    loginForm.classList.remove('active');
    registerForm.classList.add('active');

    // Register formunu temizle
    if (registerFormEl) registerFormEl.reset();

    // Focus'u ilk input'a ver
    setTimeout(() => {
        const firstInput = registerForm.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginFormEl = loginForm.querySelector('form');

    registerForm.classList.remove('active');
    loginForm.classList.add('active');

    // Login formunu temizle
    if (loginFormEl) loginFormEl.reset();

    // Focus'u ilk input'a ver
    setTimeout(() => {
        const firstInput = loginForm.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

// ============================================
// FORM HANDLERS
// ============================================

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Button loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Giriş yapılıyor...';

    // Küçük delay (UX iyileştirmesi için)
    setTimeout(() => {
        const result = auth.login(email, password);

        if (result.success) {
            showToast(result.message, 'success');

            // Formu temizle
            e.target.reset();

            // UI'yi güncelle
            auth.updateUI();

            // 500ms sonra modal kapat
            setTimeout(() => {
                closeAuthModal();

                // Sepette ürün varsa ödeme sayfasına yönlendir
                if (typeof cart !== 'undefined' && cart.items && cart.items.length > 0) {
                    setTimeout(() => {
                        window.location.href = 'odeme.html';
                    }, 500);
                }
            }, 500);
        } else {
            showToast(result.message, 'error');
        }

        // Button'ı eski haline getir
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 500);
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Validasyon
    if (password !== confirmPassword) {
        showToast('Şifreler eşleşmiyor!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Şifre en az 6 karakter olmalı!', 'error');
        return;
    }

    // Button loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Kayıt yapılıyor...';

    // Küçük delay (UX iyileştirmesi için)
    setTimeout(() => {
        const result = auth.register({ name, email, phone, password });

        if (result.success) {
            showToast(result.message, 'success');

            // Formu temizle
            e.target.reset();

            // UI'yi güncelle
            auth.updateUI();

            // 500ms sonra modal kapat
            setTimeout(() => {
                closeAuthModal();

                // Sepette ürün varsa ödeme sayfasına yönlendir
                if (typeof cart !== 'undefined' && cart.items && cart.items.length > 0) {
                    setTimeout(() => {
                        window.location.href = 'odeme.html';
                    }, 500);
                }
            }, 500);
        } else {
            showToast(result.message, 'error');
        }

        // Button'ı eski haline getir
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 500);
}// ============================================
// SEPETE EKLE - AUTH KONTROLÜ
// ============================================

function handleAddToCartWithAuth(packageId) {
    // Önce giriş kontrolü
    if (!auth.isLoggedIn()) {
        showToast('Sepete ürün eklemek için giriş yapmalısınız!', 'warning');
        openAuthModal('login');
        return;
    }

    // Giriş yapılmışsa sepete ekle
    cart.addItem(packageId);
}

// ============================================
// CHECKOUT - AUTH KONTROLÜ
// ============================================

function handleCheckoutWithAuth() {
    if (cart.items.length === 0) {
        showToast('Sepetiniz boş!', 'error');
        return;
    }

    // Giriş kontrolü
    if (!auth.requireAuth(true)) {
        return;
    }

    // Giriş yapılmışsa ödeme sayfasına git
    window.location.href = 'odeme.html';
}

// ============================================
// PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Auth sistemini başlat
    auth.updateUI();

    // Modal dışına tıklanınca kapat
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAuthModal();
            }
        });
    }

    // Escape tuşu ile modal'ı kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeAuthModal();
        }
    });
});

// Global export
window.authSystem = {
    auth,
    openAuthModal,
    closeAuthModal,
    switchToRegister,
    switchToLogin,
    handleLogin,
    handleRegister,
    handleAddToCartWithAuth,
    handleCheckoutWithAuth
};