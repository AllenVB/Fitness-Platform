/**
 * LOCALSTORAGE DEBUG UTILITIES
 * Tarayıcının console'unda bu fonksiyonları kullanabilirsiniz
 */

// Tüm localStorage verilerini göster
window.showStorage = function () {
    console.clear();
    console.log("%c=== FITNESS PLATFORM - LOCALSTORAGE ===", "color: #0d59f2; font-weight: bold; font-size: 14px");

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    console.log("%cKayıtlı Kullanıcılar:", "color: #10b981; font-weight: bold");
    console.table(users);

    console.log("%cOturum Açan Kullanıcı:", "color: #f59e0b; font-weight: bold");
    if (currentUser) {
        console.table(currentUser);
    } else {
        console.log("Hiçbir kullanıcı giriş yapmamış");
    }
};

// Belirli bir email ile giriş yap (test için)
window.testLogin = function (email = 'demo@example.com', password = 'demo123') {
    console.log(`Giriş yapılıyor: ${email}`);
    const result = auth.login({ email, password });
    console.log(result);
    window.showStorage();
};

// Çıkış yap
window.testLogout = function () {
    console.log("Çıkış yapılıyor...");
    auth.logout();
    window.showStorage();
};

// Yeni test kullanıcısı ekle
window.addTestUser = function (name = "Test User", email = "test@example.com", phone = "5551234567", password = "test123") {
    console.log(`Yeni kullanıcı ekleniyor: ${email}`);
    const result = auth.register({ name, email, phone, password });
    console.log(result);
    window.showStorage();
};

// localStorage'ı temizle
window.clearAllData = function () {
    if (confirm("TÜM VERİLERİ SILMEK İSTEDİĞİNİZE EMİN MİSİNİZ?")) {
        localStorage.clear();
        location.reload();
    }
};

// Demo kullanıcısını otomatik ekle
window.initDemo = function () {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.email === 'demo@example.com')) {
        const demoUser = {
            id: Date.now(),
            name: 'Demo Kullanıcı',
            email: 'demo@example.com',
            phone: '5551234567',
            password: 'demo123',
            createdAt: new Date().toISOString()
        };
        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log("Demo kullanıcısı eklendi!");
    }
    window.showStorage();
};

// Help menüsü
window.help = function () {
    console.clear();
    console.log(`
%c╔════════════════════════════════════════════════════════════════╗
║          FITNESS PLATFORM - CONSOLE DEBUG COMMANDS               ║
╚════════════════════════════════════════════════════════════════╝

%c📊 Veri Gösterme:
    showStorage()              - Tüm localStorage verilerini göster

%c🔐 Giriş/Çıkış:
    testLogin()                - Demo kullanıcı ile giriş yap
    testLogin(email, password) - Custom email/password ile giriş
    testLogout()               - Çıkış yap

%c👤 Kullanıcı Yönetimi:
    addTestUser()              - Yeni test kullanıcısı ekle
    addTestUser(name, email, phone, password) - Custom kullanıcı ekle
    initDemo()                 - Demo kullanıcısını ekle

%c⚠️  Tehlikeli:
    clearAllData()             - TÜM VERİLERİ SİL

%c📋 Örnekler:
    testLogin('demo@example.com', 'demo123')
    addTestUser('Ahmet Yılmaz', 'ahmet@example.com', '5551234567', 'sifre123')

    `,
        "color: #0d59f2; font-weight: bold; font-size: 14px",
        "color: #10b981; font-weight: bold",
        "color: #3b82f6; font-weight: bold",
        "color: #f59e0b; font-weight: bold",
        "color: #ef4444; font-weight: bold",
        "color: #8b5cf6; font-weight: bold"
    );
};

// Page load'da help göster
console.log("%c✨ Fitness Platform Auth System Loaded!", "color: #0d59f2; font-weight: bold; font-size: 14px");
console.log("%cYardım için console'a şunu yazın: help()", "color: #10b981; font-weight: bold");
