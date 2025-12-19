const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// --- VERİTABANI BAĞLANTISI ---
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // DBeaver'daki veritabanı adın
    password: '1',        // ŞİFREN (Hatalıysa burayı düzelt)
    port: 5432,
});

// Veritabanını Test Et ve Tabloları Oluştur
const setupDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log('✅ Veritabanına Bağlanıldı.');

        // "uyeler" tablosunu oluştur
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS uyeler (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await client.query(createUsersTableQuery);
        console.log('✅ "uyeler" tablosu hazır.');

        // "iletisim_mesajlari" tablosunu oluştur
        const createContactTableQuery = `
            CREATE TABLE IF NOT EXISTS iletisim_mesajlari (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await client.query(createContactTableQuery);
        console.log('✅ "iletisim_mesajlari" tablosu hazır.');

    } catch (err) {
        console.error('❌ KRİTİK HATA: Veritabanı kurulumu başarısız!', err.stack);
    } finally {
        // İstemciyi havuza geri bırak
        if (client) {
            client.release();
            console.log('ℹ️ Veritabanı istemcisi serbest bırakıldı.');
        }
    }
};

// Veritabanı kurulumunu başlat
setupDatabase();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- İLETİŞİM FORMU ROTASI ---
app.post('/api/contact', async (req, res) => {
    console.log("------------------------------------------------");
    console.log("📬 İletişim Formu İsteği Geldi:", req.body);

    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !message) {
        console.log("❌ Eksik iletişim bilgisi yollandı.");
        return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurun.' });
    }

    try {
        const sql = `INSERT INTO iletisim_mesajlari (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id`;
        const values = [fullName, email, phone, message];

        const result = await pool.query(sql, values);

        console.log("✅ MESAJ KAYDEDİLDİ! ID:", result.rows[0].id);
        res.json({ success: true, message: 'Mesajınız başarıyla alındı!' });

    } catch (err) {
        console.error("💥 İLETİŞİM FORMU SUNUCU HATASI:", err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası nedeniyle mesajınız gönderilemedi.' });
    }
});


// --- KAYIT ROTASI ---
app.post('/api/register', async (req, res) => {
    console.log("------------------------------------------------");
    console.log("📥 Kayıt İsteği Geldi:", req.body);

    const { name, email, phone, password } = req.body;

    // Basit Validasyon
    if (!name || !email || !password) {
        console.log("❌ Eksik bilgi yollandı.");
        return res.status(400).json({ success: false, message: 'Eksik bilgi!' });
    }

    try {
        // SQL Sorgusu (uyeler tablosuna)
        const sql = `INSERT INTO uyeler (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [name, email, phone, password];

        const result = await pool.query(sql, values);

        console.log("✅ KAYIT BAŞARILI! ID:", result.rows[0].id);
        res.json({ success: true, message: 'Kayıt başarılı!', user: result.rows[0] });

    } catch (err) {
        // HATA YAKALAMA MERKEZİ
        console.error("💥 SUNUCU HATASI:", err.message);

        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: 'Bu e-posta zaten kayıtlı!' });
        }
        if (err.code === '42P01') {
            return res.status(500).json({ success: false, message: 'Tablo bulunamadı hatası!' });
        }

        // Tarayıcıya hatayı söylemeyelim, sadece "Hata oluştu" diyelim
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
    }
});

// --- GİRİŞ ROTASI ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = `SELECT * FROM uyeler WHERE email = $1 AND password = $2`;
        const result = await pool.query(sql, [email, password]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Giriş başarılı', user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

// --- SERVER STATUS CHECK ---
app.head('/api/status', (req, res) => {
    res.status(200).end();
});


// --- PROFİL GÜNCELLEME ROTASI ---
app.put('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'İsim ve e-posta alanları zorunludur.' });
    }

    try {
        const sql = `
            UPDATE uyeler 
            SET name = $1, email = $2, phone = $3 
            WHERE id = $4 
            RETURNING *
        `;
        const values = [name, email, phone, id];
        const result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            console.log(`✅ Profil güncellendi: ID ${id}`);
            res.json({ success: true, message: 'Profil başarıyla güncellendi.', user: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Güncellenecek kullanıcı bulunamadı.' });
        }
    } catch (err) {
        console.error(`💥 Profil güncelleme hatası (ID: ${id}):`, err);
        // E-posta zaten varsa
        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.' });
        }
        res.status(500).json({ success: false, message: 'Sunucu hatası nedeniyle profil güncellenemedi.' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Sunucu Hazır: http://localhost:${PORT}`);
});