// public/js/auth.js - TAM VE EKSİKSİZ VERSİYON

const auth = {
    API_URL: '/api', // Sunucu adresimiz
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,

    // --- KAYIT OL FONKSİYONU ---
    async register(userData) {
        try {
            const response = await fetch(`${this.API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const result = await response.json();

            // EĞER BAŞARILIYSA, OTOMATİK GİRİŞ YAP
            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(result.user));
            }

            return result;
        } catch (error) {
            console.error('Bağlantı Hatası:', error);
            return { success: false, message: 'Sunucuya ulaşılamadı!' };
        }
    },

    // --- GİRİŞ YAP FONKSİYONU ---
    async login(credentials) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                this.updateUI();
            }
            return result;
        } catch (error) {
            console.error('Giriş Hatası:', error);
            return { success: false, message: 'Sunucuya ulaşılamadı!' };
        }
    },

    // --- ÇIKIŞ YAP ---
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // --- ARAYÜZ GÜNCELLEME ---
    updateUI() {
        const userProfile = document.querySelector('.user-profile');
        const authButtons = document.querySelector('.auth-buttons');

        // Kullanıcı adını yazdırmak için gerekli alanlar
        const userNameElements = document.querySelectorAll('.user-name');
        const userInitialElements = document.querySelectorAll('.user-initial');

        if (this.currentUser) {
            // Giriş yapılmışsa
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.classList.remove('hidden');
            }
            // İsmi güncelle
            if (userNameElements) userNameElements.forEach(el => el.textContent = this.currentUser.name);
            if (userInitialElements) userInitialElements.forEach(el => el.textContent = this.currentUser.name.charAt(0).toUpperCase());
        } else {
            // Giriş yapılmamışsa
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.classList.remove('hidden');
            }
            if (userProfile) userProfile.style.display = 'none';
        }
    }
};

// Sayfa yüklendiğinde arayüzü kontrol et
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUI();
});

// --- HTML BUTONLARININ ÇAĞIRDIĞI FONKSİYONLAR ---

// Kayıt Ol Formu Gönderildiğinde
async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;

    const result = await auth.register({ name, email, phone, password });

    if (result.success) {
        // Sayfayı yenilemek yerine arayüzü güncelle ve modalı kapat
        showToast(`Kayıt başarılı! Hoş geldin, ${result.user.name}!`, 'success');
        auth.updateUI();
        closeAuthModal();
    } else {
        showToast(result.message, 'error');
    }
}

// Giriş Yap Formu Gönderildiğinde
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const result = await auth.login({ email, password });

    if (result.success) {
        showToast('Giriş Başarılı!', 'success');
        // Sayfanın yeniden yüklenmesi, güncel kullanıcı durumuyla her şeyin doğru bir şekilde görüntülenmesini sağlar.
        setTimeout(() => window.location.reload(), 1000);
    } else {
        showToast(result.message, 'error');
    }
}

// --- EKSİK OLAN PENCERE (MODAL) AÇMA KAPAMA KODLARI ---

function openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
        // Senin CSS yapına uygun olarak 'active' class'ı ekliyoruz
        modal.classList.add('active');

        // İstenilen sekmeyi aç
        if (tab === 'register') {
            switchToRegister();
        } else {
            switchToLogin();
        }
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login formunu gizle, Register formunu göster
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.add('active');
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Register formunu gizle, Login formunu göster
    if (registerForm) registerForm.classList.remove('active');
    if (loginForm) loginForm.classList.add('active');
}