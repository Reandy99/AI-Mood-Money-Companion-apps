"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MOOD_CONFIG, type MoodType } from "@/lib/constants/mood";

type TodayMoodSnapshot = {
  mood_type: MoodType;
  mood_label: string;
  logged_at: string;
};

type WeeklyMoodSnapshot = {
  mood_type: MoodType;
  logged_at: string;
};
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<TodayMoodSnapshot | null>(null);
  const [weeklyMoods, setWeeklyMoods] = useState<WeeklyMoodSnapshot[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setTodayMood({
        mood_type: "happy",
        mood_label: "Bahagia",
        logged_at: new Date().toISOString().split("T")[0],
      });
      setWeeklyMoods([
        { mood_type: "happy", logged_at: "2026-05-15" },
        { mood_type: "calm", logged_at: "2026-05-14" },
        { mood_type: "neutral", logged_at: "2026-05-13" },
        { mood_type: "anxious", logged_at: "2026-05-12" },
        { mood_type: "happy", logged_at: "2026-05-11" },
        { mood_type: "calm", logged_at: "2026-05-10" },
        { mood_type: "tired", logged_at: "2026-05-09" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="neo-spinner mx-auto mb-4" />
          <p className="font-medium text-rk-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden p-4 md:p-10">
      <div className="decorative-circle bg-gradient-pink" style={{ top: "4%", right: "8%" }} />
      <div className="decorative-circle bg-gradient-mint" style={{ bottom: "8%", left: "4%" }} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <PageHeader
          title="Halo! 👋"
          subtitle={new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />

        {todayMood ? (
          <Card padding="md" className="mb-6 motion-safe:animate-fade-in-up stagger-1">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-4xl"
                style={{
                  background: `${MOOD_CONFIG[todayMood.mood_type as keyof typeof MOOD_CONFIG]?.color}35`,
                }}
              >
                {MOOD_CONFIG[todayMood.mood_type as keyof typeof MOOD_CONFIG]?.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-rk-muted">Mood Hari Ini</p>
                <p className="font-[var(--font-outfit)] text-2xl font-bold text-rk-ink">
                  {todayMood.mood_label}
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        <Card padding="md" className="mb-6 motion-safe:animate-fade-in-up stagger-2">
          <h2 className="mb-4 font-[var(--font-outfit)] text-xl font-bold text-rk-ink">
            Mood 7 Hari Terakhir
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {weeklyMoods.map((mood, index) => {
              const config = MOOD_CONFIG[mood.mood_type as keyof typeof MOOD_CONFIG];
              const date = new Date(mood.logged_at);
              return (
                <div
                  key={index}
                  className="rk-card min-w-[5.5rem] flex-shrink-0 rounded-rk-xl border border-white/70 bg-white/90 p-4 text-center shadow-rk-card"
                  style={{ backgroundColor: `${config?.color}22` }}
                >
                  <div className="mb-2 text-3xl">{config?.emoji}</div>
                  <p className="text-xs font-semibold text-rk-muted">
                    {date.toLocaleDateString("id-ID", { weekday: "short" })}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card padding="md" className="motion-safe:animate-fade-in-up stagger-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-peach text-2xl">
                💰
              </div>
              <p className="text-sm font-semibold text-rk-muted">Total Pengeluaran</p>
            </div>
            <p className="font-[var(--font-mono)] text-3xl font-bold text-rk-ink">Rp 0</p>
            <p className="mt-1 text-xs text-rk-subtle">Minggu ini</p>
          </Card>

          <Card padding="md" className="motion-safe:animate-fade-in-up stagger-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-mint text-2xl">
                😊
              </div>
              <p className="text-sm font-semibold text-rk-muted">Mood Dominan</p>
            </div>
            <p className="font-[var(--font-outfit)] text-3xl font-bold text-rk-ink">Bahagia</p>
            <p className="mt-1 text-xs text-rk-subtle">7 hari terakhir</p>
          </Card>

          <Card padding="md" className="motion-safe:animate-fade-in-up stagger-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-cool text-2xl">
                🔥
              </div>
              <p className="text-sm font-semibold text-rk-muted">Streak Check-In</p>
            </div>
            <p className="font-[var(--font-mono)] text-3xl font-bold text-rk-ink">7 hari</p>
            <p className="mt-1 text-xs text-rk-subtle">Pertahankan!</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Link
            href="/chat"
            className="block motion-safe:animate-fade-in-up stagger-4 motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
          >
            <Card padding="md" className="h-full cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-pink text-3xl">
                  💬
                </div>
                <div>
                  <h3 className="mb-1 font-[var(--font-outfit)] text-xl font-bold text-rk-ink">
                    Chat dengan Boney
                  </h3>
                  <p className="text-sm font-medium text-rk-muted">
                    Curhat atau minta insight tentang pola pengeluaran kamu
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link
            href="/report"
            className="block motion-safe:animate-fade-in-up stagger-4 motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
          >
            <Card padding="md" className="h-full cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-mint text-3xl">
                  📊
                </div>
                <div>
                  <h3 className="mb-1 font-[var(--font-outfit)] text-xl font-bold text-rk-ink">
                    Weekly Report
                  </h3>
                  <p className="text-sm font-medium text-rk-muted">
                    Analisis korelasi mood vs pengeluaran minggu ini
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
