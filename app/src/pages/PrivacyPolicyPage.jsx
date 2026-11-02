import { Link } from 'react-router-dom';
import styles from './PrivacyPolicyPage.module.css';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-up`}>
        <h1 className={styles.title}>Kebijakan Privasi & Ketentuan Penggunaan</h1>
        <p className={styles.subtitle}>Terakhir diperbarui: 2 November 2026</p>

        <section className={styles.section}>
          <h2>1. Pengenalan</h2>
          <p>
            Selamat datang di Quizzy. Kami menghargai privasi dan keamanan data psikologis serta informasi pribadi Anda. Dokumen ini menjelaskan bagaimana data Anda dikumpulkan, disimpan, dan digunakan sesuai dengan prinsip perlindungan data pribadi (UU PDP).
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Data yang Kami Kumpulkan</h2>
          <ul>
            <li><strong>Informasi Akun:</strong> Username, alamat email, nama tampilan, dan avatar yang Anda pilih saat mendaftar. Password Anda di-hash secara aman dan tidak pernah disimpan dalam format teks biasa (plaintext).</li>
            <li><strong>Hasil Kuis & Refleksi:</strong> Skor tes psikologi (MBTI, RIASEC, Big Five, Attachment, dsb.) dan preferensi mini games.</li>
            <li><strong>Hubungan Pertemanan:</strong> Daftar pertemanan yang saling disetujui untuk perbandingan kartu kepribadian.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Hak Kendali Pengguna</h2>
          <ul>
            <li>Anda berhak mengatur status visibilitas hasil kuis Anda (Publik atau Privat).</li>
            <li>Anda berhak menghapus akun dan seluruh data profil Anda kapan saja melalui pengaturan profil.</li>
            <li>Pada mode offline / browser lokal, data disimpan secara terenkripsi/ter-hash di penyimpanan lokal perangkat Anda.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Keamanan Data</h2>
          <p>
            Kami menerapkan kontrol otorisasi tingkat baris (Row Level Security / RLS), hashing kriptografis SHA-256, dan transmisi terenkripsi (HTTPS) untuk melindungi privasi setiap interaksi.
          </p>
        </section>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link to="/dashboard" className="btn btn-primary">
            Kembali ke Dashboard 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
