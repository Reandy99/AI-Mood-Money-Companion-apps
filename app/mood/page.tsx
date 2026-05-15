"use client";

import { useState } from "react";
import { MOOD_CONFIG, MoodType } from "@/lib/constants/mood";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function MoodCheckInPage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);

    console.log("Submitting mood:", { selectedMood, note });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    window.location.href = "/dashboard";
  };

  return (
    <div className="relative min-h-screen overflow-hidden p-4 pb-28 md:p-10 md:pb-10">
      <div className="decorative-circle bg-gradient-pink" style={{ top: "8%", right: "4%" }} />
      <div className="decorative-circle bg-gradient-mint" style={{ bottom: "12%", left: "6%" }} />
      <div className="decorative-circle bg-gradient-peach" style={{ top: "45%", right: "12%" }} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <PageHeader
          align="center"
          adornment={<span className="text-6xl motion-safe:animate-bouncy md:text-7xl">💚</span>}
          title="Gimana Rasamu Hari Ini?"
          subtitle="Pilih mood yang paling menggambarkan perasaan kamu sekarang"
        />

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {Object.entries(MOOD_CONFIG).map(([key, config], index) => {
            const isSelected = selectedMood === key;
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Pilih mood ${config.label}`}
                onClick={() => setSelectedMood(key as MoodType)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedMood(key as MoodType);
                  }
                }}
                className={`mood-card motion-safe:animate-fade-in-up ${isSelected ? "mood-card-selected" : ""}`}
                style={{
                  animationDelay: `${index * 0.08}s`,
                  background: isSelected ? `${config.color}30` : undefined,
                }}
              >
                <div
                  className="blob-character mb-3"
                  style={{
                    background: `${config.color}35`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  <span className="text-5xl">{config.emoji}</span>
                </div>

                <h3 className="mb-1 text-center text-lg font-bold text-rk-ink">{config.label}</h3>

                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: i < Math.ceil(config.score / 3) ? config.color : "#d1d5db",
                      }}
                    />
                  ))}
                </div>

                {isSelected ? (
                  <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-pink motion-safe:animate-pulse-soft">
                    <span className="text-xs text-white">✓</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {selectedMood ? (
          <Card padding="md" className="mb-6 motion-safe:animate-fade-in-up">
            <label htmlFor="mood-note" className="mb-3 block text-sm font-bold text-rk-ink">
              Mau cerita lebih? (opsional)
            </label>
            <div className="neo-card-inset p-4">
              <textarea
                id="mood-note"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 100))}
                placeholder="Tulis catatan singkat tentang perasaan kamu..."
                maxLength={100}
                rows={3}
                className="w-full resize-none border-none bg-transparent text-rk-ink outline-none placeholder:text-rk-subtle"
              />
            </div>
            <div className="mt-2 text-right text-xs text-rk-subtle">{note.length}/100 karakter</div>
          </Card>
        ) : null}

        {selectedMood ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="motion-safe:animate-fade-in-up w-full py-4 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <span
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden
                />
                Menyimpan...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span>Simpan Mood</span>
                <span className="text-2xl">✨</span>
              </span>
            )}
          </Button>
        ) : null}

        <Card padding="md" className="mt-6 motion-safe:animate-fade-in-up stagger-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden>
              💡
            </span>
            <p className="text-sm font-medium leading-relaxed text-rk-muted">
              <span className="font-bold text-rk-ink">Tips:</span> Check-in mood setiap hari membantu
              kamu lebih aware dengan pola emosi. Kamu bisa edit mood hingga 2x per hari.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
