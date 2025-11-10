# 🎉 Quick Start Guide — Inxora Countdown

Selamat! Project countdown Inxora Studio sudah siap digunakan! 🚀

## 📂 Struktur Project

```
inxora-countdown/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.tsx          # Badge component
│   │   │   └── Button.tsx         # Button component
│   │   ├── Countdown.tsx          # Main countdown component
│   │   ├── CustomCursor.tsx       # Custom cursor dengan animasi
│   │   └── TimeUnit.tsx           # Individual time unit (days/hours/etc)
│   ├── hooks/
│   │   ├── useCountdown.ts        # Countdown logic hook
│   │   └── usePrefersReducedMotion.ts  # Accessibility hook
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles & Tailwind
├── public/                        # Static assets
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── tailwind.config.ts            # Tailwind configuration
├── vite.config.ts                # Vite configuration
├── vercel.json                   # Vercel deployment config
├── netlify.toml                  # Netlify deployment config
├── README.md                     # Dokumentasi lengkap
├── DEVELOPMENT.md                # Development guide
└── PROJECT_SUMMARY.md            # Project summary
```

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Buka browser di `http://localhost:5173` (atau port lain jika 5173 terpakai)

### 3. Build untuk Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## ⚙️ Konfigurasi

### Mengubah Target Date

**Cara 1: Environment Variable** (Recommended)
```bash
# Edit .env
VITE_TARGET_DATE=2026-06-15T12:00:00
```

**Cara 2: Langsung di Component**
```tsx
// Edit src/App.tsx
<Countdown targetDate="2026-06-15T12:00:00" />
```

**Default:** 1 Januari tahun berikutnya, pukul 00:00 (timezone lokal pengguna)

### Toggle Custom Cursor

```bash
# Edit .env
VITE_SHOW_CURSOR=false  # Nonaktifkan custom cursor
```

### Kustomisasi Blob Cursor

Edit `src/App.tsx` untuk mengubah ukuran dan efek cursor:
```tsx
<CustomCursor 
  size={32}              // Ukuran cursor (default: 32px)
  blur={0}               // Blur effect (default: 0)
  hideDefaultCursor={true}  // Sembunyikan cursor default
  disabled={!showCursor}
/>
```

**Properti yang tersedia:**
- `size` — Ukuran blob cursor (px)
- `blur` — Backdrop blur effect (px)
- `hideDefaultCursor` — Sembunyikan cursor sistem
- `disabled` — Nonaktifkan cursor (auto-disabled di mobile)

### Ubah Warna Tema

Edit `src/index.css`:
```css
:root {
  --primary: 262.1 83.3% 57.8%;      /* Warna aksen utama */
  --background: 224 71.4% 4.1%;      /* Background gelap */
  --foreground: 210 20% 98%;         /* Warna teks */
}
```

## 🎨 Fitur Utama

✅ **Countdown Real-Time** — Update setiap detik, akurat lintas timezone
✅ **Animasi Smooth** — Framer Motion untuk transisi halus
✅ **Blob Custom Cursor** — Cursor interaktif dengan efek blend mode (desktop only)
✅ **Responsive Design** — Mobile-first, works di semua ukuran layar
✅ **Accessibility** — WCAG AA compliant, keyboard navigation
✅ **Dark Theme** — Professional dark mode dengan gradient effects
✅ **SEO Ready** — Meta tags, Open Graph, Twitter Cards
✅ **Performance** — Optimized build (~350KB JS gzipped)

## 🌐 Deployment

### Deploy ke Web Hosting

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Upload ke Hosting**
   - Upload semua file dari folder `dist/` ke hosting Anda
   - Pastikan document root mengarah ke folder yang berisi file `index.html`

3. **Konfigurasi Domain**
   - Setup DNS record untuk domain/subdomain Anda
   - Contoh: `launch.inxora.studio` → IP hosting Anda
   - Enable SSL/HTTPS melalui control panel hosting

4. **Optimasi Server (Opsional)**
   - Enable gzip compression untuk file `.js` dan `.css`
   - Set cache headers untuk asset statis
   - Konfigurasi redirect HTTP → HTTPS

### Custom Domain
Untuk subdomain `launch.inxora.studio`:
1. Login ke DNS management (Cloudflare, GoDaddy, dll)
2. Tambahkan A record atau CNAME:
   - Type: `A` atau `CNAME`
   - Name: `launch`
   - Value: IP hosting atau domain hosting
3. Tunggu propagasi DNS (5-30 menit)
4. Enable SSL di control panel hosting

## 📱 Testing Checklist

- [ ] Countdown berjalan dengan benar
- [ ] Angka berubah dengan animasi smooth
- [ ] Custom cursor follow mouse (desktop)
- [ ] Button hover effects bekerja
- [ ] Keyboard navigation (Tab, Enter)
- [ ] Mobile responsive (test di < 768px)
- [ ] Reduced motion dihormati
- [ ] Focus states visible
- [ ] Build production berhasil

## 🛠️ Customization

### Tambah Logo
1. Tambahkan file logo di `public/logo.svg`
2. Edit `src/App.tsx`:
```tsx
<img src="/logo.svg" alt="Inxora Studio" className="h-12 mb-4" />
```

### Tambah Email Capture
Edit Button "Notify Me" di `src/App.tsx`:
```tsx
<Button 
  size="lg" 
  onClick={() => window.open('https://forms.gle/your-form', '_blank')}
>
  <Mail className="w-5 h-5" />
  Notify Me
</Button>
```

### Update Link "Explore Studio"
```tsx
<Button 
  size="lg" 
  variant="outline"
  onClick={() => window.location.href = 'https://inxora.studio'}
>
  Explore Studio
  <ExternalLink className="w-5 h-5" />
</Button>
```

## 📚 Dokumentasi Lengkap

- **README.md** — Setup, deployment, troubleshooting
- **DEVELOPMENT.md** — Development guide, customization
- **PROJECT_SUMMARY.md** — Complete project overview

## 🆘 Troubleshooting

**Q: Custom cursor tidak muncul?**
A: Pastikan `VITE_SHOW_CURSOR=true` di `.env` dan tidak di mobile

**Q: Countdown menampilkan waktu yang salah?**
A: Countdown menggunakan timezone lokal browser. Untuk timezone spesifik, gunakan ISO 8601 format dengan timezone

**Q: Build gagal?**
A: Hapus cache: `rm -rf node_modules/.vite && npm run build`

**Q: Port 5173 sudah dipakai?**
A: Vite otomatis akan cari port lain (biasanya 5174)

## 📞 Support

Butuh bantuan? Buka:
- GitHub Issues
- Email: hello@inxora.studio
- Dokumentasi: Lihat README.md

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** November 10, 2025

Selamat launching! 🎊
