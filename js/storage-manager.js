/**
 * LocalStorage Utility & Monitoring
 * Storage durumunu takip et ve optimize et
 */

class StorageManager {
    constructor() {
        this.maxSize = 5 * 1024 * 1024; // 5MB
    }

    /**
     * LocalStorage'daki verilerin toplam boyutunu hesapla
     */
    getStorageSize() {
        let totalSize = 0;

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }

        return totalSize;
    }

    /**
     * Boyutu MB cinsinden göster
     */
    getStorageSizeMB() {
        return (this.getStorageSize() / 1024 / 1024).toFixed(2);
    }

    /**
     * Storage kullanımını yüzde olarak göster
     */
    getStoragePercentage() {
        return ((this.getStorageSize() / this.maxSize) * 100).toFixed(2);
    }

    /**
     * Storage uyarısını kontrol et
     */
    checkStorageStatus() {
        const sizePercentage = parseFloat(this.getStoragePercentage());

        if (sizePercentage > 90) {
            console.warn(
                `%c⚠️  LocalStorage %90'dan fazla dolu! (${this.getStorageSizeMB()}MB)`,
                'color: red; font-weight: bold;'
            );
            return 'critical';
        } else if (sizePercentage > 70) {
            console.warn(
                `%c⚠️  LocalStorage %70'ten fazla dolu. (${this.getStorageSizeMB()}MB)`,
                'color: orange; font-weight: bold;'
            );
            return 'warning';
        }

        return 'ok';
    }

    /**
     * Storage'ı temizle (Test verilerini sil)
     */
    clearTestData() {
        const testKeys = ['testData', 'tempData'];
        testKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('Test verileri temizlendi');
    }

    /**
     * Storage'da ne var göster
     */
    listAllItems() {
        console.clear();
        console.log('%c📦 LocalStorage İçeriği', 'color: #0d59f2; font-weight: bold; font-size: 14px');
        console.log(`Kullanılan Alan: ${this.getStorageSizeMB()}MB / 5MB (${this.getStoragePercentage()}%)`);
        console.log('---');

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const value = localStorage[key];
                const size = ((value.length + key.length) / 1024).toFixed(2);
                console.log(`${key}: ${size}KB`);
            }
        }
    }

    /**
     * Browser LocalStorage'ı destekliyor mu?
     */
    static isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            window.localStorage.setItem(test, test);
            window.localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Browser'ın max storage'ını test et
     */
    static testMaxStorage() {
        const testKey = '__localStorage_size_test__';
        let size = 0;
        const testSize = 1024 * 100; // 100KB chunks

        try {
            for (let i = 0; i < 1000; i++) {
                localStorage.setItem(
                    testKey + i,
                    new Array(testSize).join('x')
                );
                size += testSize;
            }
            // Cleanup
            for (let i = 0; i < 1000; i++) {
                localStorage.removeItem(testKey + i);
            }
        } catch (e) {
            console.log(`Max localStorage size: ~${(size / 1024 / 1024).toFixed(2)}MB`);
        }
    }
}

// Global instance
window.storage = new StorageManager();

/**
 * Console komutları
 */
window.storageHelp = function () {
    console.clear();
    console.log(`
%c╔════════════════════════════════════════════════════════════════╗
║              LOCALSTORAGE MANAGEMENT COMMANDS                    ║
╚════════════════════════════════════════════════════════════════╝

%c📊 Storage İstatistikleri:
    storage.getStorageSize()           - Toplam boyut (bytes)
    storage.getStorageSizeMB()         - Toplam boyut (MB)
    storage.getStoragePercentage()     - Kullanım yüzdesi
    storage.checkStorageStatus()       - Durum kontrolü
    storage.listAllItems()             - Tüm öğeleri göster

%c🧹 Temizleme:
    storage.clearTestData()            - Test verilerini sil
    clearAllData()                     - TÜM VERİLERİ SİL

%c🔍 Browser Uyumluluğu:
    StorageManager.isLocalStorageAvailable()  - Support kontrolü
    StorageManager.testMaxStorage()           - Max size testi

    `,
        'color: #0d59f2; font-weight: bold; font-size: 14px',
        'color: #10b981; font-weight: bold',
        'color: #f59e0b; font-weight: bold',
        'color: #8b5cf6; font-weight: bold'
    );
};

/**
 * Page load'da kontrol et
 */
document.addEventListener('DOMContentLoaded', () => {
    if (!StorageManager.isLocalStorageAvailable()) {
        console.error('❌ Bu browser LocalStorage desteklemiyor!');
    }

    // Storage status'unu kontrol et
    const status = storage.checkStorageStatus();
    console.log(`%c✅ Storage Manager aktif (${status})`, 'color: #10b981; font-weight: bold;');
});

// Export
window.StorageManager = StorageManager;
