

# Hive - University Event Radar

A mobile-first real-time event discovery app for University of Southampton students, featuring a clean pastel aesthetic and smooth interactions.

---

## Design System

- **Clean, minimalist white background** with Slate-900 text
- **Inter font** for modern, readable typography
- **Pastel category tags** for quick scanning:
  - Workshop/Learning: Blue pastel
  - Social/Party: Pink pastel
  - Sports/Active: Emerald pastel
  - Meeting: Gray pastel
- **Text-first cards** with elegant whitespace - no large images

---

## Pages & Navigation

### Public Homepage (Event Feed)
- Simple "Hive" logo header with "Society Login" button
- Sticky horizontal filter bar: All, Today, Tomorrow, This Week, Socials, Workshops, Sports
- Time-Stream feed grouped by: "Happening Now", "Later Today", "Tomorrow", "This Week"
- Empty sections auto-hide
- Floating "+" button (only visible when logged in)

### Authentication Pages
- Society login page (email/password)
- Society registration page

### Society Dashboard (Protected)
- List of society's events with edit/delete options
- Create new event form
- Event status indicators (live, upcoming, expired)

---

## Core Features

### Event Card Component
- **Collapsed view**: Time | Title, Society, Location | Category tag
- **Click to expand**: Smooth accordion animation
- **Expanded view**: Full description + "Add to Calendar" + "Share" buttons

### Functional Actions
- **Add to Calendar**: Generate and download .ics file
- **Share**: Native Web Share API (with fallback for desktop)

### Smart Event Handling
- Real-time grouping by time periods
- Automatic hiding of past events from public feed
- Category and time-based filtering

---

## Backend (Supabase)

### Database Tables
- **societies**: Society accounts with name, logo, description
- **events**: Event details linked to societies (title, description, datetime, location, category)

### Authentication
- Email/password login for societies
- Protected routes for event management

### Security
- Row-level security: Societies can only manage their own events
- Public read access for all events

---

## Technical Additions
- **Framer Motion** for smooth expand/collapse animations
- **date-fns** for time grouping logic (already installed)
- **Mock data**: 8-10 diverse Southampton Uni events for demo

