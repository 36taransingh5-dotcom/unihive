
# Complete EventCard Rewrite and Navbar Fix

## Overview
This plan addresses the user's request to completely rewrite the EventCard component with a new layout structure and ensure the Navbar logo displays correctly. The Smart Tag system is already properly implemented and will be retained.

## Current State Analysis
- **Header.tsx**: Already correctly imports and displays the Hive logo from `src/assets/hive-logo.png` with proper styling (`h-8 w-auto`). The glassmorphism effect is applied via the `glass` class.
- **EventCard.tsx**: Has a 3-column layout (Time | Content | Badges) that doesn't match the requested vertical structure.
- **Smart Tag System**: Fully implemented in `tagColors.ts` and `SmartTag.tsx` with correct color logic.

## Implementation Plan

### 1. Header Component Verification
The Header already uses the correct logo. If needed, I can add `object-contain` to ensure proper scaling:
```tsx
<img 
  src={hiveLogo} 
  alt="Hive Logo" 
  className="h-8 w-auto object-contain"
/>
```

### 2. EventCard Complete Rewrite
Replace the current layout with a new vertical structure:

**New Card Structure:**
```text
+------------------------------------------+
| [Title (ExtraBold text-lg)]    [LIVE] ● |
| [Smart Pills Row - tags]                 |
| [Description - 2 line clamp]             |
+------------------------------------------+
| [Avatar] Society Name        Time (6:30pm)|
+------------------------------------------+
```

**Key Changes:**
- Remove the current 3-column layout
- Place Title at top-left with LIVE indicator at top-right
- Smart Tags row immediately below title
- Description truncated to 2 lines (using `line-clamp-2`)
- Footer row: Society avatar (circle, w-8 h-8) + name on left, time (12h format) on right
- Card styling: `bg-white`, `border border-slate-100`, `shadow-sm hover:shadow-md`
- Maintain expandable functionality with hero image, map, and action buttons

**Component Structure:**
```tsx
<motion.div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all">
  {/* Top Row: Title + LIVE */}
  <div className="flex items-start justify-between">
    <h3 className="font-extrabold text-lg">{title}</h3>
    {isLive && <LiveIndicator />}
  </div>
  
  {/* Smart Pills Row */}
  <SmartTagList tags={tags} className="mt-2" />
  
  {/* Description */}
  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
  
  {/* Footer: Avatar + Society | Time */}
  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
    <div className="flex items-center gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src={logo_url} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-sm text-slate-600">{societyName}</span>
    </div>
    <span className="text-sm text-slate-500">{formattedTime}</span>
  </div>
  
  {/* Expanded Content (existing logic) */}
</motion.div>
```

### 3. Smart Tag System
Already correctly implemented with:
- Food keywords (pizza, food, snack) returning orange
- Party keywords (party, drink, alcohol) returning purple  
- Chill keywords (sober, coffee, study) returning blue
- "Free" returning green
- Deterministic hash fallback for consistent pastel colors

### 4. Files to Modify
| File | Action |
|------|--------|
| `src/components/EventCard.tsx` | Complete rewrite with new layout |
| `src/components/Header.tsx` | Add `object-contain` class (minor fix) |

### Technical Notes
- Uses existing Avatar components from `@/components/ui/avatar`
- Maintains Framer Motion animations for staggered entrance and expand/collapse
- Time format uses existing `format(date, 'h:mm a')` for 12-hour display
- Society logo comes from `event.societies?.logo_url` (already in Event type)
- Uses `line-clamp-2` utility for description truncation
