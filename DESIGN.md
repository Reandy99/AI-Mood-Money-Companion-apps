# RasaKas Design System

## 🎨 Design Philosophy

**Theme:** Bento Grid + Soft Pastel Colors  
**Vibe:** Unique, Calming, Playful, Trustworthy  
**Target:** Gen Z Indonesia (Mental Health + Finance)  
**Inspiration:** Japanese Bento Box, Pastel Aesthetic, Modern Minimalism

---

## Color Palette

### Background Gradients
```css
Cream: #FFF8F0
Lavender: #F0E6FF
Mint: #E8F8F5
Peach: #FFE8E0
Sky: #E0F2FE

Gradient: linear-gradient(135deg, cream → lavender → mint)
```

### Pastel Accent Colors
```css
Pink: #FFB5D8 (Primary CTA, Happy vibes)
Purple: #D4BBFF (Secondary, Calm)
Mint: #B5F5EC (Success, Fresh)
Peach: #FFCDB2 (Warm, Friendly)
Blue: #B8E0FF (Trust, Finance)
Yellow: #FFF4B8 (Happy mood)
Coral: #FFB4A2 (Attention)
Lavender: #E4C1F9 (Soothing)
```

### Text Colors
```css
Dark: #2D3748 (Main text)
Medium: #4A5568 (Headings)
Light: #718096 (Descriptions)
```

---

## Typography

### Font Families
- **Display (Headings):** Outfit (Rounded, Friendly, Bold)
- **Body (Text):** Inter (Clean, Readable)
- **Mono (Numbers):** JetBrains Mono (Technical)

### Font Sizes
```css
Hero: 4rem (64px) - font-outfit font-black
H1: 3rem (48px) - font-outfit font-bold
H2: 2rem (32px) - font-outfit font-bold
H3: 1.5rem (24px) - font-outfit font-semibold
Body: 1rem (16px) - font-inter
Small: 0.875rem (14px) - font-inter
Tiny: 0.75rem (12px) - font-inter
```

---

## Bento Grid Layout

### What is Bento Grid?
Modular layout inspired by Japanese bento boxes — asymmetric cards of different sizes arranged in a grid.

### Grid Structure
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
```

### Card Sizes
- **Large:** 2x2 (Main CTA, Hero content)
- **Medium:** 1x2 or 2x1 (Featured content)
- **Small:** 1x1 (Features, Stats)

---

## Components

### Bento Card
```css
.bento-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
```

**Hover Effect:**
```css
transform: translateY(-4px) scale(1.02);
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
```

### Pastel Button
```css
.btn-pastel {
  background: linear-gradient(135deg, #FFB5D8 0%, #E4C1F9 100%);
  padding: 18px 36px;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 8px 24px rgba(255, 181, 216, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
```

### Gradient Backgrounds
```css
.bg-gradient-pink {
  background: linear-gradient(135deg, #FFB5D8 0%, #E4C1F9 100%);
}

.bg-gradient-mint {
  background: linear-gradient(135deg, #B5F5EC 0%, #B8E0FF 100%);
}

.bg-gradient-peach {
  background: linear-gradient(135deg, #FFCDB2 0%, #FFF4B8 100%);
}
```

---

## Animations

### Blob Animation
```css
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -20px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(20px, 20px) scale(1.05); }
}
Duration: 8s ease-in-out infinite
```

### Float Gentle
```css
@keyframes float-gentle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}
Duration: 4s ease-in-out infinite
```

### Bouncy Scale
```css
@keyframes bouncy-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
Duration: 2s ease-in-out infinite
```

### Fade In Up
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
Duration: 0.6s ease-out
```

### Stagger Delays
```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

---

## Mood Colors (Pastel)

```css
Happy: #FFF4B8 (Soft Yellow)
Calm: #B5F5EC (Mint Green)
Neutral: #E0E7FF (Lavender Gray)
Sad: #B8E0FF (Sky Blue)
Anxious: #E4C1F9 (Soft Purple)
Frustrated: #FFCDB2 (Peach)
Tired: #D4E4F7 (Pale Blue)
Angry: #FFB4A2 (Coral)
```

---

## Decorative Elements

### Blob Shapes
```css
.blob-shape {
  border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
}
```

### Emoji Float
```css
.emoji-float {
  font-size: 4rem;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}
```

---

## Spacing System

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

---

## Border Radius

```css
Small: 12px (badges, tags)
Medium: 24px (buttons, inputs)
Large: 32px (bento cards)
Full: 9999px (pills, avatars)
```

---

## Shadows

### Soft Shadow (Bento Cards)
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
```

### Inset Highlight
```css
inset 0 1px 0 rgba(255, 255, 255, 0.9);
```

### Button Shadow
```css
box-shadow: 0 8px 24px rgba(255, 181, 216, 0.3);
```

### Hover Shadow
```css
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
```

---

## Accessibility

### Focus States
```css
*:focus-visible {
  outline: 3px solid #D4BBFF;
  outline-offset: 3px;
  border-radius: 12px;
}
```

### Color Contrast
- All text meets WCAG AA standards
- Dark text (#2D3748) on light pastel backgrounds (7:1+)
- Medium text (#4A5568) on white backgrounds (4.5:1+)

### Touch Targets
- Minimum 44x44px for all interactive elements
- Bento cards have generous padding (24px+)

---

## Design Principles

1. **Soft & Calming** — Pastel colors, gentle animations, no harsh contrasts
2. **Playful & Unique** — Bento grid, blob shapes, bouncy animations
3. **Trust Signals** — Security badges, clear privacy messaging
4. **Minimal Friction** — Large touch targets, clear CTAs
5. **Emotional Connection** — Warm language, empathetic tone
6. **Modern & Fresh** — Trending 2026 design (bento grid)

---

## Implementation Notes

- Use `backdrop-filter: blur()` for frosted glass effect
- Animated pastel blobs for depth and movement
- Smooth transitions (0.3-0.4s cubic-bezier)
- Mobile-first responsive design
- Light theme (better for pastel colors)
- Stagger animations for delightful entrance

---

## Unique Differentiators

✨ **Bento Grid Layout** — Modular, asymmetric, trending 2026  
🎨 **Soft Pastel Palette** — Calming, Gen Z aesthetic  
🫧 **Organic Blob Shapes** — Playful, not corporate  
💫 **Bouncy Animations** — Delightful micro-interactions  
🌸 **Emotional Design** — Warm, empathetic, trustworthy

---

**Last Updated:** 2026-05-15  
**Status:** Implemented in Landing Page (Bento Grid + Pastel)
