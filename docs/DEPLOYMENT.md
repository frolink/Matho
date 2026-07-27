# MATHO — Panduan Deploy untuk Pemula

Dokumen ini menjelaskan cara menjalankan MATHO **tanpa perlu jadi ahli DevOps**.
Ada dua jalur, pilih sesuai kebutuhanmu:

| Jalur | Cocok untuk | Tingkat kesulitan |
| ----- | ----------- | ------------------ |
| **A. Docker Compose** | Coba-coba di laptop sendiri, atau di satu server/VPS yang kamu kelola sendiri | ⭐ Paling mudah |
| **B. Vercel + Render + Neon + Upstash** | Aplikasi benar-benar online untuk publik, tanpa mengurus server sama sekali, 100% gratis | ⭐⭐ Sedikit lebih banyak klik, tapi tidak perlu ilmu server |

Jika baru pertama kali coba, **mulai dari Jalur A dulu** di laptop kamu untuk
memastikan semuanya berjalan, baru lanjut ke Jalur B kalau ingin online beneran.

---

## Jalur A — Jalankan di laptop/VPS sendiri dengan Docker Compose

### Yang perlu diinstal dulu

1. **Docker Desktop** — download di https://www.docker.com/products/docker-desktop
   dan install seperti aplikasi biasa. Setelah install, buka aplikasinya dan
   tunggu sampai ikon Docker di taskbar/menu bar berwarna hijau/stabil (artinya
   Docker sudah "hidup").

Itu saja. Kamu **tidak perlu install Node.js, PostgreSQL, atau Redis** secara
terpisah — semuanya sudah dibungkus rapi di dalam Docker.

### Langkah-langkah

1. Buka Terminal (Mac/Linux) atau Command Prompt/PowerShell (Windows), lalu
   masuk ke folder project:
   ```bash
   cd matho
   ```

2. Jalankan script setup otomatis:
   ```bash
   ./scripts/setup.sh
   ```
   Script ini otomatis akan:
   - Membuat file `.env` (konfigurasi rahasia) dari contohnya
   - Membuatkan kunci rahasia (`JWT_SECRET`) yang acak dan aman
   - Membangun dan menyalakan semua bagian aplikasi: database, cache, API
     backend, aplikasi web, dan aplikasi admin
   - Menjalankan migrasi database secara otomatis

   > Kalau kamu pakai Windows dan `./scripts/setup.sh` tidak bisa dijalankan
   > langsung, jalankan lewat Git Bash, atau jalankan manual — lihat bagian
   > [Menjalankan manual (tanpa script)](#menjalankan-manual-tanpa-script) di bawah.

3. Tunggu sampai muncul tulisan:
   ```
   🎉 MATHO is running!
      Web app:        http://localhost:3000
      Admin app:       http://localhost:3002
      API + Swagger:  http://localhost:4000/api/docs
   ```
   Proses pertama kali bisa memakan waktu 3–10 menit (download & build image).
   Percobaan berikutnya jauh lebih cepat.

4. Buka browser, kunjungi `http://localhost:3000` — aplikasi MATHO sudah jalan!

### Perintah sehari-hari yang berguna

```bash
docker compose logs -f          # lihat log semua service (Ctrl+C untuk keluar)
docker compose logs -f api      # lihat log backend saja
docker compose ps               # lihat status semua service
docker compose down             # matikan semua, data database tetap tersimpan
docker compose down -v          # matikan semua DAN hapus data database
docker compose up --build -d    # jalankan ulang setelah kamu mengubah kode
```

### Menjalankan manual (tanpa script)

Kalau `scripts/setup.sh` tidak bisa dijalankan di sistemmu, lakukan ini secara
manual — hasilnya sama persis:

```bash
cp .env.example .env
# buka file .env dengan text editor, ganti nilai JWT_SECRET dengan
# teks acak yang panjang (minimal 32 karakter)

docker compose up --build
```

### Menjalankan di VPS (server sungguhan)

Kalau ingin di server (misalnya DigitalOcean, AWS EC2, dsb), langkahnya sama:

1. Install Docker di server tersebut (biasanya: `curl -fsSL https://get.docker.com | sh`).
2. Upload/clone folder project ini ke server.
3. Jalankan `./scripts/setup.sh` seperti di atas.
4. Buka `http://ALAMAT-IP-SERVER-MU:3000` di browser.
5. **Untuk penggunaan publik sungguhan**, tambahkan reverse proxy dengan HTTPS
   (misalnya [Caddy](https://caddyserver.com/) — otomatis mengurus sertifikat
   SSL gratis) di depan port 3000/3002/4000, dan arahkan domainmu ke situ.
   Ini di luar cakupan panduan ini — kalau butuh, tanyakan lagi nanti.

---

## Jalur B — Online publik tanpa mengelola server, 100% gratis

Kombinasi ini dipilih khusus supaya **benar-benar gratis untuk percobaan**,
tanpa batas waktu, dan sebagian besar **tidak perlu kartu kredit**:

| Bagian | Layanan | Kenapa dipilih |
| --- | --- | --- |
| `apps/web` + `apps/admin` (Next.js) | **Vercel** (paket Hobby) | Gratis selamanya, tanpa kartu kredit, cocok untuk penggunaan non-komersial/percobaan |
| `apps/api` (NestJS) | **Render** (paket Free) | Gratis, tanpa kartu kredit — tapi "tidur" setelah 15 menit tidak ada trafik (loading ~30-60 detik saat dibangunkan lagi, wajar untuk percobaan) |
| PostgreSQL | **Neon** | Gratis selamanya, tanpa kartu kredit, **tidak ada batas waktu/kedaluwarsa** (beda dengan database gratis Render yang otomatis terhapus setelah 30 hari) |
| Redis | **Upstash** | Gratis selamanya, tanpa kartu kredit, 500rb command/bulan — lebih dari cukup untuk percobaan |

> ⚠️ **Kenapa bukan Railway?** Railway dulu terkenal karena gratis, tapi sejak
> 2026 wajib isi kartu kredit sejak awal, dan setelah masa coba 30 hari
> ($5 kredit) habis, jatahnya cuma $1/bulan — tidak cukup untuk menjalankan
> API + Postgres + Redis sekaligus. Kombinasi di atas jauh lebih awet untuk
> sekadar percobaan.

### Bagian 1 — Buat database di Neon (PostgreSQL)

1. Buat akun di https://neon.com (bisa login pakai GitHub, tanpa kartu kredit).
2. Klik **Create a project**, kasih nama misalnya `matho`, pilih region
   terdekat (misalnya Singapore).
3. Setelah project dibuat, buka tab **Connection Details** dan salin
   **Connection string** yang formatnya seperti:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   Simpan ini — nanti dipakai sebagai `DATABASE_URL`.

### Bagian 2 — Buat Redis di Upstash

1. Buat akun di https://upstash.com (bisa login pakai GitHub, tanpa kartu kredit).
2. Klik **Create database**, kasih nama misalnya `matho`, pilih region yang
   sama/terdekat dengan Neon di atas.
3. Buka tab database yang baru dibuat, salin nilai **Redis URL** (format
   `rediss://default:xxxx@xxxx.upstash.io:6379`). Simpan sebagai `REDIS_URL`.

### Bagian 3 — Deploy backend (apps/api) di Render

1. Push folder project ini ke sebuah repository GitHub (kalau belum, buat
   repo baru di GitHub lalu `git push` project ini ke sana).
2. Buat akun di https://render.com (bisa login pakai GitHub).
3. Klik **New → Web Service**, pilih repository MATHO kamu.
4. Render akan menanyakan cara build. Pilih **Docker**, lalu di kolom
   **Dockerfile Path** isi: `apps/api/Dockerfile`, dan **Docker Build
   Context Directory** isi: `.` (titik, artinya folder root repo) — ini
   penting karena Dockerfile-nya butuh akses ke seluruh monorepo, bukan
   cuma folder `apps/api`.
5. Pilih paket **Free**.
6. Di bagian **Environment Variables**, isi:
   | Nama | Isi |
   | --- | --- |
   | `DATABASE_URL` | connection string dari Neon (Bagian 1) |
   | `REDIS_URL` | Redis URL dari Upstash (Bagian 2) |
   | `JWT_SECRET` | teks acak panjang, misalnya hasil dari `openssl rand -hex 32` |
   | `JWT_ACCESS_TTL` | `15m` |
   | `JWT_REFRESH_TTL` | `30d` |
   | `PI_API_BASE_URL` | `https://api.minepi.com/v2` |
   | `CORS_ORIGINS` | isi nanti setelah Vercel selesai (langkah di bawah) |
   | `PORT` | `4000` |
7. Klik **Create Web Service** dan tunggu build selesai (5–10 menit untuk
   percobaan pertama).
8. Setelah deploy sukses, sinkronkan skema ke Neon lewat tab **Shell** di
   Render — repo ini belum punya riwayat migrasi Prisma, jadi pakai
   `db push`, bukan `migrate`:
   ```bash
   npm run db:push
   npm run db:seed
   ```
9. Catat URL publik API-mu, contoh: `https://matho-api.onrender.com`.

### Bagian 4 — Deploy web & admin di Vercel

1. Buat akun di https://vercel.com (login pakai GitHub juga bisa).
2. Klik **Add New → Project**, pilih repository GitHub yang sama.
3. Vercel akan bertanya folder mana yang jadi root project. Pilih
   **`apps/web`** untuk aplikasi utama (buyer/creator/merchant).
4. Di bagian **Environment Variables**, isi:
   | Nama | Isi |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | URL Render dari langkah sebelumnya, misalnya `https://matho-api.onrender.com` |
   | `NEXT_PUBLIC_PI_SANDBOX` | `true` untuk uji coba, `false` untuk produksi sungguhan |
5. Klik **Deploy**. Setelah selesai, kamu dapat URL seperti
   `https://matho-web.vercel.app`.
6. Ulangi langkah 2–5 sekali lagi untuk **`apps/admin`** (root directory
   `apps/admin`), sehingga kamu punya URL kedua, misalnya
   `https://matho-admin.vercel.app`.

> Paket Hobby Vercel memang gratis selamanya, tapi **hanya untuk pemakaian
> non-komersial** (percobaan, belajar, portofolio) — bukan untuk aplikasi
> yang sudah menghasilkan uang. Untuk percobaan MATHO ini, aturan itu pas.

### Bagian 5 — Sambungkan kembali ke backend

1. Kembali ke Render, buka **Environment** service API, isi `CORS_ORIGINS`
   dengan kedua URL Vercel di atas, dipisah koma:
   ```
   https://matho-web.vercel.app,https://matho-admin.vercel.app
   ```
2. Render otomatis redeploy setelah environment variable disimpan.
3. Buka `https://matho-web.vercel.app` di browser — aplikasi sudah online!

> **Kenapa dua URL API berbeda (publik vs internal)?** Karena `apps/web`
> berjalan sebagai server Next.js sendiri (bukan cuma di browser), ia perlu
> tahu alamat API. Untuk deploy Vercel + Render ini tidak jadi masalah karena
> keduanya sama-sama alamat publik — beda dengan Docker Compose (Jalur A) di
> mana container saling bicara lewat jaringan privat. Kalau penasaran detail
> teknisnya, lihat komentar di `apps/web/src/lib/session.ts`.

> **Soal Render "tidur"**: layanan gratis Render mati sendiri kalau tidak ada
> yang mengakses selama 15 menit, lalu perlu ~30-60 detik untuk "bangun"
> lagi saat ada request pertama. Ini normal untuk percobaan gratis — kalau
> nanti butuh selalu aktif tanpa delay, baru upgrade ke paket berbayar Render
> ($7/bulan) atau pindah ke Railway Hobby.

---

## Checklist sebelum benar-benar online ke publik

- [ ] `JWT_SECRET` sudah diganti dengan nilai acak, **bukan** nilai contoh di `.env.example`
- [ ] `NEXT_PUBLIC_PI_SANDBOX` sudah `false` (bukan sandbox lagi)
- [ ] `CORS_ORIGINS` di backend hanya berisi domain yang benar-benar kamu pakai
- [ ] Database di-backup secara berkala (Neon punya fitur point-in-time restore mulai dari paket berbayarnya)
- [ ] Kamu sudah mendaftarkan aplikasi di [Pi Developer Portal](https://develop.pi) dan domainmu sudah terverifikasi di sana

## Kalau ada yang error

- **"Cannot connect to the Docker daemon"** → Docker Desktop belum dibuka/belum selesai loading. Buka aplikasinya, tunggu sampai stabil, coba lagi.
- **Halaman web muncul tapi tombol "Sign in with Pi" error** → wajar jika dibuka di browser biasa (bukan Pi Browser). Fitur ini memang hanya berfungsi penuh di dalam Pi Browser.
- **`docker compose up` gagal di langkah migrate** → cek `docker compose logs migrate` untuk detail errornya; biasanya karena `DATABASE_URL` di `.env` salah format.
- Masih bingung? Salin pesan error lengkapnya dan tanyakan — jangan tebak-tebak sendiri, error di deployment biasanya sangat spesifik dan mudah dicari sumbernya kalau pesannya lengkap.
