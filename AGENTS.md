# Plot Pilot Design System Skill

This document serves as the persistent design guidelines for the Plot Pilot application. All future modifications and new features should adhere to these specifications to maintain visual consistency.

## 1. Typography (Fonts)
- **Primary UI (Sans):** `Inter` - Used for buttons, navigation, and general interface elements.
- **Technical Data (Mono):** `JetBrains Mono` - Used for analytics, counters, and metadata.
- **Headings & Accents (Display):** `Oswald` - Used for step numbers and uppercase labels.
- **Calligraphy & Titles (Brush):** `Ma Shan Zheng` - Used for the main app title and section headers to provide a "Chinese Ink" aesthetic.
- **Reading Content (Serif):** `Noto Serif SC` - Used for the novel content and descriptive text to ensure a comfortable reading experience.

## 2. Color Palette

### Dark Mode (Default / "Ink" Theme)
- **App Background:** `#0F0F0F` (Deep charcoal/black)
- **Panel Background:** `#171717` (Slightly lighter for depth)
- **Borders:** `#262626` (Subtle separation)
- **Main Text:** `#FFFFFF` (Pure white)
- **Muted Text:** `#737373` (Medium gray)
- **Brand Primary:** `#DC2626` (Vibrant Red)

### Light Mode ("Paper" Theme)
- **App Background:** `#f4f1ea` (Warm paper/parchment white)
- **Panel Background:** `#ffffff` (Pure white)
- **Borders:** `#e2e2d5` (Warm gray/beige)
- **Main Text:** `#1a1a1a` (Deep charcoal)
- **Muted Text:** `#666655` (Olive-tinted gray)
- **Brand Primary:** `#991b1b` (Deep crimson)

## 3. Visual Components & Styles
- **HUD Panels:** Use `.hud-panel` class for glassmorphism effects (backdrop-blur-md).
- **Borders:** Use `.hud-border-red` for active or highlighted elements.
- **Glows:** Use `.hud-glow-red` for interactive feedback or status indicators.
- **Scrollbars:** Custom thin scrollbars that turn red on hover.
- **Transitions:** All theme changes and view switches should use `framer-motion` with an easing of `[0.23, 1, 0.32, 1]` and a duration between 0.5s to 0.8s.

## 4. Layout Principles
- **Spacing:** Maintain generous padding (pt-32 for headers) to ensure a "premium" and "uncluttered" feel.
- **Hierarchy:** 
  - Titles: Large, Brush font, tracking-widest.
  - Labels: Small, Display font, uppercase, tracking-[0.2em].
  - Body: Medium, Serif font, leading-relaxed.
- **Interactions:** Use `motion.div` for all page entries. Prefer "slide-in from right" for forward progression and "fade" for general UI changes.
