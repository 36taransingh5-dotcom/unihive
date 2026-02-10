
# Cyberpunk Night Club Theme Overhaul

This plan transforms the dark mode from the current "navy + neon lime" look into a sleek "matte black + neon glow" cyberpunk aesthetic.

## What Changes

### 1. Global Theme: "The Void" Background
- Background shifts from navy (#0f172a) to near-black (#050505)
- A fixed, blurred ambient purple glow blob is added to the top-right corner of the page
- The grid pattern in dark mode becomes even more subtle
- All dark mode CSS variables updated: card becomes #121212, borders become gray-800, shadows become soft purple glows

### 2. Event Cards: "Matte Black" Style
- Card background changes to #121212 (matte black surface)
- Borders switch from neon lime to subtle dark grey (gray-800)
- A neon pink bottom-border accent (border-b-2 border-[#d946ef]) is added for that dashboard strip look
- Hard offset shadows replaced with a soft purple glow (0px 0px 20px rgba(217,70,239,0.15))

### 3. Interactive Elements: "Lit Up" Buttons
- Ask Hive bar and filter buttons get semi-transparent black backgrounds (bg-black/50) with backdrop blur
- Borders become thin purple (border-purple-500/50)
- Active/selected filter buttons glow cyan (shadow 0px 0px 10px #22d3ee)
- Header navbar also gets the frosted glass treatment in dark mode

### 4. Category Pills: Neon Tubes
- Keep transparent background, text becomes white
- Borders stay their category neon color (pink, green, blue, yellow)
- Add a subtle neon text glow via drop-shadow CSS

## Technical Details

### Files Modified

**`src/index.css`** (Dark mode CSS variables + utility classes)
- Update `.dark` variables: background to ~#050505 (HSL ~0 0% 2%), card to #121212, border to gray-800
- Replace dark `.brutal-shadow` classes with soft glow shadows
- Add `.dark .brutal-card` with soft purple glow instead of hard offset
- Add `.neon-text-glow` utility class for category pill text glow effect
- Update dark mode grid pattern to be extremely subtle

**`src/pages/Index.tsx`**
- Add a fixed ambient glow div (purple blob, blur-[120px]) that only renders in dark mode
- Uses `useTheme` hook to conditionally render

**`src/components/EventCard.tsx`**
- In dark mode: use matte black bg, gray-800 borders, neon pink bottom border accent
- Replace hard shadow with soft purple glow shadow
- Remove the existing `dark:border-[#bef264]` overrides

**`src/components/Header.tsx`**
- In dark mode: frosted glass effect (bg-black/50 backdrop-blur-md) instead of solid background

**`src/components/FilterBar.tsx`**
- Dark mode buttons: bg-black/50, backdrop-blur, border-purple-500/50
- Active state: cyan glow shadow

**`src/components/AdvancedFilters.tsx`**
- Same frosted glass treatment for dropdowns and Free Food button in dark mode
- Active Free Food button gets cyan glow

**`src/components/AskHive.tsx`**
- Update container: bg-black/50 backdrop-blur-md, thin purple border
- Remove the hard purple shadow in dark mode, replace with soft glow

**`src/components/CategoryPill.tsx`**
- Add `dark:text-white` and a neon text drop-shadow in dark mode

**`src/components/SmartTag.tsx`**
- Update border from black to dark:border-gray-700 so tags don't clash with matte black cards
