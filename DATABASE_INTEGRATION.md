# Fitness Platform - Database Integration Rehberi

## 🎯 Mevcut Durum

Auth sistemi şu anda **localStorage** kullanarak çalışmaktadır. Sekme kapanmadan ve tarayıcı verileri silinmediği sürece kullanıcı verisi kalıcıdır.

### LocalStorage Yapısı

```javascript
// Kaydedilen kullanıcılar
localStorage.users = [
  {
    id: 1234567890,
    name: "Kullanıcı Adı",
    email: "ornek@example.com",
    phone: "5551234567",
    password: "sifre123",      // ⚠️ Hash'lenmelidir!
    createdAt: "2025-12-09T10:30:00.000Z"
  }
]

// Giriş yapan kullanıcı (session)
localStorage.currentUser = {
  id: 1234567890,
  name: "Kullanıcı Adı",
  email: "ornek@example.com",
  phone: "5551234567",
  password: "sifre123",
  createdAt: "2025-12-09T10:30:00.000Z"
}
```

## 🔄 Database'e Geçiş Adımları

### 1. Backend API Oluşturma

**Node.js + Express örneği:**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu email zaten kayıtlı!' 
      });
    }
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Kullanıcıyı kaydet
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword
    });
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Kayıt başarılı!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kullanıcı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email veya şifre hatalı!' 
      });
    }
    
    // Şifreyi doğrula
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email veya şifre hatalı!' 
      });
    }
    
    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Giriş başarılı!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
```

### 2. Frontend'de API Çağrıları

**js/auth.js'de yapılacak değişiklikler:**

```javascript
// Mevcut register fonksiyonu yerine:
async register(userData) {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Token'ı localStorage'a kaydet
      localStorage.setItem('authToken', result.token);
      this.saveUser(result.user);
      return { success: true, message: 'Kayıt başarılı!' };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    return { success: false, message: 'Bağlantı hatası: ' + error.message };
  }
}

// Mevcut login fonksiyonu yerine:
async login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Token'ı localStorage'a kaydet
      localStorage.setItem('authToken', result.token);
      this.saveUser(result.user);
      return { success: true, message: 'Giriş başarılı!' };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    return { success: false, message: 'Bağlantı hatası: ' + error.message };
  }
}
```

### 3. JWT Token ile Protected Routes

```javascript
// API çağrılarında token gönderme
async fetchUserData() {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch('http://localhost:3000/api/user-profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Veri çekme hatası:', error);
  }
}
```

## 📦 Önerilen Tech Stack

### Backend Seçenekleri

1. **Node.js + Express** (JavaScript)
   - Kolayca öğrenilir
   - JavaScript ile senkron çalışma
   - npm paketi desteği geniş

2. **Python + Flask/Django** (Python)
   - Hızlı development
   - Güvenlik kütüphaneleri iyi
   - Machine learning entegrasyonuna uygun

3. **Firebase** (Cloud)
   - Backend yazmanıza gerek yok
   - Hızlı deploy
   - Küçük projeler için ideal

### Database Seçenekleri

1. **MongoDB** (NoSQL)
   - JavaScript objesi gibi
   - Esnek schema
   - JSON formatında veri

2. **PostgreSQL** (SQL)
   - İlişkisel veri için ideal
   - Güçlü query sistemi
   - Daha sağlam

3. **Firebase Firestore** (Cloud)
   - Realtime database
   - Backend yazmanıza gerek yok

## 🔐 Güvenlik Kontrol Listesi

- [ ] Şifreler bcrypt/argon2 ile hash'lenmiş
- [ ] API'nin https kullanması
- [ ] CORS düzgün yapılandırılmış
- [ ] JWT token'lar secure flag'i ile ayarlanmış
- [ ] Rate limiting eklenmiş
- [ ] Input validasyonu sunucu tarafında yapılmış
- [ ] SQL injection koruması
- [ ] CSRF token'ları

## 🧪 Test Komutları

```bash
# Register testi
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "5551234567",
    "password": "password123"
  }'

# Login testi
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📝 Mevcut Kod Referansları

- **Authentication Logic**: `js/auth.js`
- **HTML Forms**: `index.html`, `egitimler.html`, vb.
- **Debug Tools**: `js/debug.js`, `storage-debug.html`

## 🔗 Yararlı Kütüphaneler

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
```

## ⚠️ Mevcut Kısıtlamalar

1. **LocalStorage Limiti**: ~5-10MB
2. **Veritabanı Yok**: Veriler tarayıcıda saklanıyor
3. **Şifre Güvenliği**: Hash'lenmemiş (Test amaçlı)
4. **Bağlantı Yok**: Diğer veritabanları ile senkronizasyon yok
