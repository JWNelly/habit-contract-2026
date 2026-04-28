# Habit Contract Tracker

A personal mobile-friendly web app to track the Habit Contract between Jack Nelson (habiter) and Billy Holtz (enforcer), running **April 28 – July 31, 2026**.

## Features

- **Today tab** — check off daily habits with a progress bar. Navigate to any past day with ‹ › arrows to retroactively log or fix entries.
- **Week tab** — track weekly fitness goals (run/bike, climbing, gym), guitar recording, and cooking. Navigate to past weeks the same way.
- **History tab** — month-by-month calendar color-coded by day status (all done / partial / missed / waived). Tap any day to edit.
- **Fines tab** — running total at $1/missed habit, with breakdown by habit and week. Record payments to Billy to track your outstanding balance.

## Habits Tracked

| Habit | Frequency | Notes |
|-------|-----------|-------|
| Guitar practice (20 min) | Daily | Waived on travel |
| Wake-up within 10 min of alarm | Daily | Waived on travel |
| French practice | Daily | **Never** waived for travel |
| Physics study (2 hrs) | Weekdays | 30 min on travel days |
| Run / bike ride | Weekly | |
| Climbing session | Weekly | |
| Gym session | Weekly | Travel workout substitutes all 3 |
| Guitar recording * | Weekly | Waived if 3+ waiver days in the week |
| Cooking challenge * | Weekly | Waived if 3+ waiver days in the week |

**Day types:** Normal · Travel · Illness · Vacation · Holiday · Emergency — each affects which habits apply and whether fines are waived.

## Tech Stack

- React 19 + Vite 8 + TypeScript
- Tailwind CSS v4
- date-fns
- localStorage (no backend needed)

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Add to iPhone home screen via Safari → Share → Add to Home Screen for a native-feeling experience.

## Build

```bash
npm run build   # outputs to dist/
```

The `dist/` folder can be deployed to any static host (Netlify, GitHub Pages, etc.).
