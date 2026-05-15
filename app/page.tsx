import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-10">
      <div
        className="decorative-circle bg-gradient-cool"
        style={{ top: "8%", right: "6%" }}
      />
      <div
        className="decorative-circle bg-gradient-mint"
        style={{ bottom: "18%", left: "8%" }}
      />
      <div
        className="decorative-circle bg-gradient-peach"
        style={{ top: "48%", right: "18%" }}
      />

      <div className="absolute top-20 right-10 text-3xl opacity-50 motion-safe:animate-float-gentle md:right-24">
        ✨
      </div>
      <div className="absolute top-1/3 left-8 text-2xl opacity-40 motion-safe:animate-bouncy md:left-16">
        🌸
      </div>
      <div
        className="absolute bottom-1/4 right-8 text-4xl opacity-45 motion-safe:animate-float-gentle md:right-32"
        style={{ animationDelay: "1s" }}
      >
        💫
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="mb-10 text-center motion-safe:animate-fade-in-up">
          <div className="relative mb-4 inline-block">
            <div className="text-6xl motion-safe:animate-float-gentle md:text-7xl">💚</div>
            <div className="absolute -right-2 -top-2 text-2xl motion-safe:animate-bouncy">✨</div>
          </div>
          <h1 className="mb-4 font-[var(--font-outfit)] text-5xl font-black leading-[1.08] tracking-tight gradient-text-pastel md:text-6xl lg:text-7xl">
            RasaKas
          </h1>
          <p className="mx-auto max-w-3xl text-base font-semibold leading-snug text-rk-muted md:text-xl md:leading-snug">
            AI yang tahu kamu belanja karena{" "}
            <span className="mx-1 inline-block rounded-full bg-gradient-pink px-2.5 py-0.5 text-sm text-white shadow-rk-btn-primary">
              lapar
            </span>{" "}
            — atau karena{" "}
            <span className="mx-1 inline-block rounded-full bg-gradient-cool px-2.5 py-0.5 text-sm text-white shadow-rk-btn-primary">
              luka
            </span>{" "}
            🌸
          </p>
        </div>

        <Card padding="lg" className="mb-8 motion-safe:animate-fade-in-up stagger-1">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex gap-2.5">
              <span className="text-4xl motion-safe:animate-bouncy md:text-5xl">✨</span>
              <span
                className="text-3xl motion-safe:animate-float-gentle md:text-4xl"
                style={{ animationDelay: "0.5s" }}
              >
                🚀
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-2 font-[var(--font-outfit)] text-xl font-extrabold tracking-tight text-rk-ink md:text-2xl">
                Mulai Perjalanan Kamu
              </h2>
              <p className="mb-5 text-sm font-medium leading-snug text-rk-muted md:text-[15px] md:leading-snug">
                Track mood harian, scan email bank otomatis, dan dapatkan insight AI tentang pola
                pengeluaran kamu.
              </p>
              <Button
                href="/api/auth/google"
                className="w-full md:inline-flex md:w-auto"
              >
                <svg
                  className="h-6 w-6 motion-safe:transition-transform motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Masuk dengan Google</span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card
            padding="md"
            className="motion-safe:animate-fade-in-up stagger-2 motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-peach text-3xl motion-safe:animate-bouncy">
              😊
            </div>
            <h3 className="mb-1.5 text-center font-[var(--font-outfit)] text-lg font-extrabold text-rk-ink">
              Mood Check-In
            </h3>
            <p className="text-center text-sm font-medium leading-relaxed text-rk-muted">
              30 detik setiap pagi untuk pahami pola emosi kamu
            </p>
          </Card>

          <Card
            padding="md"
            className="motion-safe:animate-fade-in-up stagger-2 motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-mint text-3xl motion-safe:animate-float-gentle">
              📧
            </div>
            <h3 className="mb-1.5 text-center font-[var(--font-outfit)] text-lg font-extrabold text-rk-ink">
              Auto Scan
            </h3>
            <p className="text-center text-sm font-medium leading-relaxed text-rk-muted">
              Email bank di-scan otomatis setiap malam
            </p>
          </Card>

          <Card
            padding="md"
            className="motion-safe:animate-fade-in-up stagger-3 motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
          >
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-cool text-3xl motion-safe:animate-bouncy"
              style={{ animationDelay: "0.5s" }}
            >
              📊
            </div>
            <h3 className="mb-1.5 text-center font-[var(--font-outfit)] text-lg font-extrabold text-rk-ink">
              AI Analysis
            </h3>
            <p className="text-center text-sm font-medium leading-relaxed text-rk-muted">
              Korelasi mood vs pengeluaran
            </p>
          </Card>

          <Card
            padding="md"
            className="motion-safe:animate-fade-in-up stagger-3 motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
          >
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-pink text-3xl motion-safe:animate-float-gentle"
              style={{ animationDelay: "1s" }}
            >
              💬
            </div>
            <h3 className="mb-1.5 text-center font-[var(--font-outfit)] text-lg font-extrabold text-rk-ink">
              Chat Boney
            </h3>
            <p className="text-center text-sm font-medium leading-relaxed text-rk-muted">
              AI companion yang memahami konteks kamu
            </p>
          </Card>
        </div>

        <Card
          padding="md"
          className="flex flex-col items-center gap-3 motion-safe:animate-fade-in-up stagger-4 sm:flex-row sm:items-start"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-mint motion-safe:animate-bouncy">
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="mb-0.5 text-base font-extrabold text-rk-ink">🔒 100% Aman & Privat</p>
            <p className="text-sm font-medium leading-snug text-rk-muted">
              Kami hanya membaca email dari bank untuk tracking pengeluaran. Data kamu terenkripsi
              end-to-end dan tidak pernah dibagikan.
            </p>
          </div>
        </Card>

        <div className="mt-8 space-y-3 text-center motion-safe:animate-fade-in-up stagger-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-gradient-pink" />
            <span className="text-base font-bold text-rk-muted">OpenClaw Agenthon 2026</span>
            <div
              className="h-3 w-3 animate-pulse rounded-full bg-gradient-cool"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl motion-safe:animate-bouncy">🏆</span>
            <p className="text-sm font-semibold text-rk-muted">RISTEK x Build Club</p>
            <span className="text-xl motion-safe:animate-bouncy" style={{ animationDelay: "0.3s" }}>
              ✨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
