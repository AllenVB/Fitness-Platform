# AllenFit - Full-Stack Fitness Platformu Mimarisi

[![Durum](https://img.shields.io/badge/Status-Geli%C5%9Ftirme_A%C5%9Famas%C4%B1nda-orange)](https://github.com/suleymanemre/fitness-platform)
[![Versiyon](https://img.shields.io/badge/Versiyon-1.5.0-blue)](https://github.com/suleymanemre/fitness-platform)
[![Lisans](https://img.shields.io/badge/Lisans-MIT-green)](./LICENSE)

Bu doküman, AllenFit projesinin teknik mimarisini, dosya yapısını ve temel işlevlerini açıklamaktadır. Proje, kullanıcıların fitness hedeflerine ulaşmalarını sağlayan modern bir full-stack web uygulamasıdır.

---

## 🏗️ Proje Mimarisi ve Yapısı

Proje, geleneksel bir **Monolith** mimariye sahiptir. Arka uç (Node.js) ve ön uç (statik HTML/CSS/JS dosyaları) aynı proje altında birleştirilmiştir.

```
fitness-platform/
│
├── server.js               # 📍 Ana sunucu dosyası (Express, API rotaları, DB bağlantısı)
│
├── package.json            # Proje bağımlılıkları (Express, pg, cors)
│
└── public/                 # Ön uç dosyalarının barındığı ana klasör
    │
    ├── index.html          # Ana sayfa (3D metin efekti burada yer alır)
    ├── egitimler.html      # Dinamik olarak oluşturulan eğitim paketleri sayfası
    ├── hakkimizda.html     # "Biz Kimiz?" ve "Vizyonumuz" kartlarını içeren sayfa
    ├── iletisim.html       # Sunucuya bağlanan iletişim formu
    ├── profilim.html       # Kullanıcı profili görüntüleme ve güncelleme sayfası
    │
    ├── css/
    │   └── style.css       # 🎨 Global stiller, animasyonlar ve `.card` bileşeni
    │
    └── js/
        ├── app.js          # Ana istemci tarafı script (Paket verileri, sepet mantığı, Toast bildirimleri)
        ├── auth.js         # Kullanıcı kayıt ve giriş API çağrıları
        └── cart.js         # Sepet yönetimi fonksiyonları
```

---

## ✨ Uygulama Katmanları ve Özellikleri

###  Backend (Sunucu Tarafı - `server.js`)

- **Web Sunucusu:** `Express.js` kullanılarak oluşturulmuş, statik dosyaları (`public` klasörü) sunan ve API isteklerini karşılayan bir sunucu.
- **Veritabanı Yönetimi:** `pg` (node-postgres) kütüphanesi ile PostgreSQL veritabanına bağlanır. Sunucu başlangıcında, `uyeler` ve `iletisim_mesajlari` tablolarının varlığını kontrol eder ve yoksa oluşturur.
- **REST API:**
  - `POST /api/register`: Yeni kullanıcıyı veritabanına ekler.
  - `POST /api/login`: Kullanıcı kimlik bilgilerini veritabanında doğrular.
  - `PUT /api/user/:id`: Kullanıcı profilini veritabanında günceller.
  - `POST /api/contact`: Gelen iletişim mesajlarını veritabanına yazar.

### Frontend (İstemci Tarafı - `public/` klasörü)

- **Kullanıcı Arayüzü (UI):**
  - **Dinamik Kartlar:** `egitimler.html` sayfasındaki eğitim paketleri, `app.js` içerisindeki `packages` dizisinden dinamik olarak oluşturulur. Her kartta "Detayları İncele" ve "Sepete Ekle" işlevleri bulunur.
  - **Modern Stil:** Proje genelinde `Tailwind CSS` ve özel CSS (`style.css`) kullanılmıştır. `.card` sınıfı, sayfalardaki temel kutu bileşenidir.
  - **Geri Bildirim:** Kullanıcı aksiyonları (sepete ekleme, form gönderme vb.) için sağ altta çıkan `Toast` bildirimleri kullanılır (`app.js` içinde `showToast` fonksiyonu).
- **İstemci Mantığı (JavaScript):**
  - **`app.js`:** Sepet (`Cart` sınıfı), paket verileri (`packages` dizisi) ve global yardımcı fonksiyonları (`showToast` vb.) içerir.
  - **`auth.js`:** Sunucudaki `/api/login` ve `/api/register` uç noktalarına `fetch` istekleri göndererek kullanıcı kimlik doğrulama işlemlerini yönetir.
  - **`profilim.html` (inline script):** Kullanıcının profil bilgilerini `/api/user/:id` uç noktasına `PUT` isteği ile göndererek günceller.
  - **`iletisim.html` (inline script):** İletişim formunu, başarılı gönderim sonrası formu gizleyip yerine bir başarı mesajı gösterecek şekilde yönetir.

---

## 🗄️ Veritabanı Şeması

Sunucu tarafından otomatik olarak iki ana tablo oluşturulur:

1.  **`uyeler` Tablosu:**
    - `id`: `SERIAL PRIMARY KEY` - Otomatik artan benzersiz kimlik.
    - `name`: `VARCHAR(100)` - Kullanıcının adı.
    - `email`: `VARCHAR(100) UNIQUE NOT NULL` - Benzersiz kullanıcı e-postası.
    - `phone`: `VARCHAR(20)` - Telefon numarası.
    - `password`: `VARCHAR(100)` - Kullanıcı şifresi (*Not: Hash'leme henüz eklenmemiştir*).
    - `created_at`: `TIMESTAMP` - Kayıt oluşturulma zamanı.

2.  **`iletisim_mesajlari` Tablosu:**
    - `id`: `SERIAL PRIMARY KEY` - Otomatik artan benzersiz kimlik.
    - `name`, `email`, `message`: Mesaj içeriği.
    - `phone`: Gönderenin telefon numarası.
    - `created_at`: `TIMESTAMP` - Mesajın oluşturulma zamanı.

---

## 🛠️ Teknik Yapı

- **Backend:** Node.js, Express.js
- **Veritabanı:** PostgreSQL (`pg` kütüphanesi ile)
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS
- **API Mimarisi:** RESTful

---

## 🚀 Hızlı Kurulum Notları

Projeyi çalıştırmak için `npm install` komutuyla bağımlılıkları yükledikten sonra `server.js` dosyasındaki `Pool` yapılandırmasını kendi PostgreSQL bilgilerinize göre düzenleyip `node server.js` komutunu çalıştırmanız yeterlidir.
