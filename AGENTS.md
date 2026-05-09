# Plot Pilot Design System Skill

This document serves as the persistent design guidelines for the Plot Pilot application. All future modifications and new features should adhere to these specifications to maintain visual consistency.

## 1. Typography (Fonts)
- **Primary UI (Sans):** `Inter` - Used for buttons, navigation, and general interface elements.
- **Technical Data (Mono):** `JetBrains Mono` - Used for analytics, counters, and metadata.
- **Headings & Accents (Display):** `Oswald` - Used for step numbers and uppercase labels.
- **Calligraphy & Titles (Brush):** `Ma Shan Zheng` - Used primarily for the logo and brand identity. Do not use automatically for UI elements unless explicitly requested.
- **Reading Content (Serif):** `Noto Serif SC` - Reserved for specific long-form reading contexts. Do not use proactively as a default font.

## 2. Color Palette (Triple Theme Mode)

The application supports three distinct aesthetic modes. All UI components must respect these palette variables.

### A. Dark Mode ("Ink" Theme - Standard Dark)
- **Concept:** Chinese Ink / Deep Night. High contrast for focus.
- **App Background:** `#0F0F0F` (Base layer)
- **Panel Background:** `#171717` (HUDs, sidebars)
- **Borders:** `#262626` (Subtle UI separation)
- **Main Text:** `#FFFFFF` (Pure white)
- **Muted Text:** `#737373` (Medium gray)
- **Brand Primary:** `#DC2626` (Vibrant "Qin" Red)

### B. Warm Light Mode ("Paper" Theme - Traditional)
- **Concept:** Traditional Parchment / Xuan Paper. Reading-optimized.
- **App Background:** `#ece9e0` (Warm beige base)
- **Panel Background:** `#e2dfd4` (Slightly deeper for depth)
- **Borders:** `#d2cfc4` (Warm grey borders)
- **Main Text:** `#1a1a1a` (Deep charcoal, avoids pure black)
- **Muted Text:** `#555544` (Olive-tinted grey)
- **Brand Primary:** `#991b1b` (Deep Crimson)

### C. Cool Light Mode ("Modern/Classic" Theme - Tech/Clean)
- **Concept:** Technical Slate / Swiss Modern. No yellow tints, no pure white glare.
- **App Background:** `#f5f5f5` (Cool neutral grey base)
- **Panel Background:** `#ebebeb` (Deeper panel layer)
- **Borders:** `#d6d6d6` (Clean neutral borders)
- **Main Text:** `#171717` (Near-black)
- **Muted Text:** `#6b7280` (Cool grey)
- **Brand Primary:** `#da2525` (Neutral UI red)

## 3. Visual Components & Styles
- **HUD Panels:** Use `.hud-panel` class for glassmorphism effects (backdrop-blur-md).
- **Borders:** Use `.hud-border-red` for active or highlighted elements.
- **Glows:** Use `.hud-glow-red` for interactive feedback or status indicators.
- **Scrollbars:** Custom thin scrollbars that turn red on hover.
- **Transitions:** All theme changes and view switches should use `framer-motion` with an easing of `[0.23, 1, 0.32, 1]` and a duration between 0.5s to 0.8s.

## 4. Layout Principles
- **Spacing:** Maintain generous padding (pt-32 for headers) to ensure a "premium" and "uncluttered" feel.
- **Hierarchy:** 
  - Titles (Logo/Brand): Large, Brush font, tracking-widest.
  - Section Headers: Large, Sans/Display font, medium weight.
  - Labels: Small, Display font, uppercase, tracking-[0.2em].
  - Body: Medium, Sans font, leading-relaxed. (Serif font only when strictly for reading content).
- **Interactions:** Use `motion.div` for all page entries. Prefer "slide-in from right" for forward progression and "fade" for general UI changes.
