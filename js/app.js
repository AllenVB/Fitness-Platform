// ============================================
// FITNESS PLATFORM - MAIN APP.JS
// ============================================

// Paket Verileri
const packages = [
    {
        id: 1,
        name: "Başlangıç Seviyesi Güç",
        price: 1200,
        period: "Aylık",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACUTRoEf95REailG1KadvFuZlUFINTi3WAgU8J8iy4J4k7UtcJu7DYqry2rv9_nxNfuXlNM-eAWc4ehUXnmt50E4kFtHAFM81zgxLQK9EuC5n8KmeCRiUq_lAsKVV0Asf13hhS6d3W8xTCkCgE_urgABUh03KtugxmyhOJu7DcEyFAS65TPdlfLCM13RQCvCzJVKOSJZJETg8Rw4nPgmjVZrgfKDQ3DqWyPd20c7R6sJAN6JvwkhnoJi49eJQy6R-xJxjgXUukq64",
        features: ["Kişiye Özel Antrenman Programı", "Beslenme Danışmanlığı", "Haftalık Takip"]
    },
    {
        id: 2,
        name: "Yağ Yakımı & Definasyon",
        price: 1500,
        period: "Aylık",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYuBRSj2rOp-eB1vOmnVoY9mVeZ17zwWvOcM384VpqJe52MZ0JunDnWHDlcTbw8sfd0Vpqw7N-CYAXq2B0uCIo-aFOi9fGUSXm1-1dewTxMHttihBZJg7ytfPBCyR-_G4ku4447qJysvT-eKPiyB-A5Ltrv4y1Mg_X5KvGoui3oUZIGO4cu0RIVOwtnHX6FRBl7DvEOY1TeT0I_8PJo9CafgwN1SJIGqh0rmO-bB0RzncphPpQqD0xcPtmuKj9a64caWvuWV7_N7c",
        features: ["Kardiyo Programları", "Düşük Kalorili Diyet Planı", "Aylık Değerlendirme"],
        popular: true
    },
    {
        id: 3,
        name: "İleri Seviye Hacim Kazanma",
        price: 1800,
        period: "Aylık",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLq2LP5RjNIdS99XlfVCKEOFgigEPFMzH101ZSe1Y1Z8hDFNgCcUu1oqMfOvpXUneQtPBRTGPnfdTz4tX4E7Zu6tkC2yxN11wZwWGkGvj6PvOz4DRLB68dkgu0rCFnDT99Qc9ihAxmxejQG7kKA2TVot2W9pDnjM3nCGt68D2Oc77wa24NhV7goBCHVmomigTH5ynReGd151wvyVF5HWIS1dXvAS9FFnaBHtnFDOeBuszBpKLl3SnqcKEqT8HZiDaY5c2awY9aFks",
        features: ["Yoğunlaştırılmış Ağırlık Programı", "Kas Geliştirme Odaklı Beslenme", "Sınırsız Soru-Cevap"]
    },
    {
        id: 4,
        name: "Kadınlara Özel Fitness",
        price: 1400,
        period: "Aylık",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYuBRSj2rOp-eB1vOmnVoY9mVeZ17zwWvOcM384VpqJe52MZ0JunDnWHDlcTbw8sfd0Vpqw7N-CYAXq2B0uCIo-aFOi9fGUSXm1-1dewTxMHttihBZJg7ytfPBCyR-_G4ku4447qJysvT-eKPiyB-A5Ltrv4y1Mg_X5KvGoui3oUZIGO4cu0RIVOwtnHX6FRBl7DvEOY1TeT0I_8PJo9CafgwN1SJIGqh0rmO-bB0RzncphPpQqD0xcPtmuKj9a64caWvuWV7_N7c",
        features: ["Vücut Şekillendirme Antrenmanları", "Kadınlara Özel Beslenme Planı", "Haftalık Motivasyon Görüşmesi"]
    },
    {
        id: 5,
        name: "Online Koçluk",
        price: 2000,
        period: "Aylık",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACUTRoEf95REailG1KadvFuZlUFINTi3WAgU8J8iy4J4k7UtcJu7DYqry2rv9_nxNfuXlNM-eAWc4ehUXnmt50E4kFtHAFM81zgxLQK9EuC5n8KmeCRiUq_lAsKVV0Asf13hhS6d3W8xTCkCgE_urgABUh03KtugxmyhOJu7DcEyFAS65TPdlfLCM13RQCvCzJVKOSJZJETg8Rw4nPgmjVZrgfKDQ3DqWyPd20c7R6sJAN6JvwkhnoJi49eJQy6R-xJxjgXUukq64",
        features: ["Birebir Video Görüşmeleri", "24/7 Whatsapp Desteği", "Hedef Belirleme Seansı"],
        badge: "En Kapsamlı"
    },
    {
        id: 6,
        name: "Esneklik ve Mobilite",
        price: 900,
        period: "Aylık",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKCV6CAK552vVHNLUIeTDvc0mbTdETkUONM4VFh4II_h41gpWZ9Fy_e0-1g6e4OEPN-MHKw7vXgV7Y1F-wWeyrrGx5GekqBWvf9rRPaNMYsAzNOXYbLr6HXhewurAfqOsdi3KjtwOG5cgR-2-ABFGMBFafKftcWfifDVoRJw_PxzglrgtZ2OztovFi_MBdOOmnxHTXd2kt_lIL6HKJPSZske7dmc7ktpA-IKHEdygPgt6GP0sqEu7Z77C254--DV-gQw8chpE52wo",
        features: ["Eklemler için Egzersizler", "Yoga ve Pilates Temelleri", "Sakatlık Önleme Teknikleri"]
    }
];

// ============================================
// CART MANAGEMENT
// ============================================
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartBadge();
    }

    loadCart() {
        const saved = localStorage.getItem('fitnessCart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('fitnessCart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    addItem(packageId) {
        const pkg = packages.find(p => p.id === packageId);
        if (!pkg) return;

        const existingItem = this.items.find(item => item.id === packageId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showToast('Miktar artırıldı!', 'success');
        } else {
            this.items.push({
                id: pkg.id,
                name: pkg.name,
                price: pkg.price,
                period: pkg.period,
                image: pkg.image,
                quantity: 1
            });
            showToast('Sepete eklendi!', 'success');
        }
        
        this.saveCart();
    }

    removeItem(packageId) {
        this.items = this.items.filter(item => item.id !== packageId);
        this.saveCart();
        showToast('Sepetten kaldırıldı', 'warning');
    }

    updateQuantity(packageId, change) {
        const item = this.items.find(i => i.id === packageId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeItem(packageId);
        } else {
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getItemCount();
        
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    clear() {
        this.items = [];
        this.saveCart();
    }
}

// Global cart instance
const cart = new Cart();

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check_circle' : 
                 type === 'error' ? 'error' : 'info';
    
    toast.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// LOADING OVERLAY
// ============================================
function showLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');
    
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// FORM VALIDATION
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Update cart badge
    cart.updateCartBadge();
    
    // Add fade-in animation to page content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// ============================================
// EXPORT FOR OTHER MODULES
// ============================================
window.fitnessApp = {
    cart,
    packages,
    showToast,
    showLoading,
    hideLoading,
    validateEmail,
    validatePhone
};