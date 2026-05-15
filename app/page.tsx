import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--rk-page)' }}>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f43f5e, #fb923c)' }} />
      <div className="pointer-events-none absolute top-1/2 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, #a855f7)' }} />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #fbbf24, #fb923c)' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center text-lg shadow-lg">
            💚
          </div>
          <span className="font-[var(--font-outfit)] font-black text-xl gradient-text-pastel">Boney.AI</span>
        </div>
        <Link href="/api/auth/google"
          className="rk-btn-primary px-5 py-2.5 text-sm font-bold rounded-full shadow-rk-btn-primary">
          Masuk →
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-12 pb-6 md:pt-20">

        {/* Character badge */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-rk-card mb-8 animate-fade-in-up">
          <span className="text-xl motion-safe:animate-bouncy">💚</span>
          <span className="text-sm font-bold text-rk-muted">AI Mood & Money Companion</span>
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="font-[var(--font-outfit)] font-black text-5xl md:text-7xl leading-[1.05] tracking-tight text-rk-ink max-w-3xl animate-fade-in-up stagger-1 mb-5">
          AI yang tahu kamu
          <br />
          <span className="relative inline-block">
            <span className="gradient-text-pastel">belanja</span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-pink opacity-40" />
          </span>
          {" "}karena luka 💔
        </h1>

        <p className="text-lg md:text-xl text-rk-muted font-medium max-w-xl mx-auto mb-10 animate-fade-in-up stagger-2 leading-relaxed">
          Track mood harian, scan email bank otomatis, dan dapatkan insight AI personal tentang pola
          emosi + pengeluaran kamu.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up stagger-3">
          <Link href="/api/auth/google"
            className="rk-btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-black rounded-2xl shadow-rk-btn-primary group">
            <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" aria-hidden>
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Mulai dengan Google
          </Link>
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-4 text-sm font-bold text-rk-muted hover:text-rk-ink transition-colors rounded-2xl hover:bg-white/60">
            Coba Demo →
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-2 mt-6 animate-fade-in-up stagger-4">
          <div className="flex -space-x-2">
            {['#f43f5e','#7c3aed','#14b8a6','#fbbf24'].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs"
                style={{ background: c }}>
                {['😊','😌','😴','😤'][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-rk-subtle font-medium">
            Gen Z Indonesia yang sudah paham pola mereka
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Card 1 — Mood */}
        <div className="bg-white rounded-3xl p-6 shadow-rk-card animate-fade-in-up stagger-2 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-peach flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
              😊
            </div>
            <div>
              <h3 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-lg mb-1">
                Mood Check-In Harian
              </h3>
              <p className="text-rk-muted text-sm leading-relaxed">
                30 detik setiap pagi. 8 pilihan mood. Dashboard langsung unlock setelah check-in.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {['😄','😌','😐','😔','😰','😤','😴','😡'].map((e, i) => (
              <span key={i} className="text-xl hover:scale-125 transition-transform cursor-default">{e}</span>
            ))}
          </div>
        </div>

        {/* Card 2 — Auto Scan */}
        <div className="bg-white rounded-3xl p-6 shadow-rk-card animate-fade-in-up stagger-3 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-mint flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
              📧
            </div>
            <div>
              <h3 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-lg mb-1">
                Auto Scan Email Bank
              </h3>
              <p className="text-rk-muted text-sm leading-relaxed">
                Setiap malam jam 22.00 AI scan email receipt kamu. BCA, Mandiri, GoPay, OVO, DANA — otomatis.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#f0fdf4] rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-bold text-[#059669]">Berjalan 22:00 WIB</span>
            </div>
          </div>
        </div>

        {/* Card 3 — Notif harian */}
        <div className="bg-white rounded-3xl p-6 shadow-rk-card animate-fade-in-up stagger-3 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-lavender flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
              🌙
            </div>
            <div>
              <h3 className="font-[var(--font-outfit)] font-extrabold text-rk-ink text-lg mb-1">
                Rekap Harian Otomatis
              </h3>
              <p className="text-rk-muted text-sm leading-relaxed">
                Dapat notifikasi malam: mood hari ini + total pengeluaran. Ditulis hangat, bukan laporan kering.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-[#fefaf5] rounded-2xl p-3 text-xs text-rk-muted font-medium border border-[var(--rk-border-soft)]">
            "Rekap hari ini, 15 Mei 🌙<br/>Mood: 😔 Sedih &nbsp;·&nbsp; Pengeluaran: Rp 187.000"
          </div>
        </div>

        {/* Card 4 — Boney */}
        <div className="bg-gradient-hero rounded-3xl p-6 text-white shadow-rk-btn-primary animate-fade-in-up stagger-4 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
              💬
            </div>
            <div>
              <h3 className="font-[var(--font-outfit)] font-extrabold text-white text-lg mb-1">
                Chat dengan Boney
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                AI companion dengan RAG — ambil referensi dari internet untuk kasih insight yang relevan sama situasi kamu.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2 relative z-10">
            {['Dengerin 👂','Humor 😄','Solusi 💡'].map(tag => (
              <span key={tag} className="text-xs font-bold bg-white/20 rounded-full px-3 py-1">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy strip */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3 shadow-rk-card border border-[var(--rk-border-soft)]">
          <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-lg flex-shrink-0">🔒</div>
          <p className="text-sm text-rk-muted font-medium">
            <span className="font-bold text-rk-ink">100% Privat.</span>{" "}
            Kami hanya baca email dari bank — tidak ada data yang keluar tanpa izin kamu.
          </p>
        </div>
      </div>
    </div>
  );
}
