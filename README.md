# PlnX

> A mobile-first study planner built for BPKIHS VI Semester (2023 Batch) — Nothing OS aesthetic, fully offline, zero dependencies.

---

## What It Is

PlnX is a single-file HTML app designed to replace the chaos of scattered notes, WhatsApp reminders, and paper timetables during clinical rotations. It lives in one `.html` file, runs entirely in the browser, and persists everything to `localStorage` — no server, no login, no internet required after the first load.

The design follows the Nothing OS design language: dot-matrix textures, monochrome palette, Space Mono / DM Mono typography, and red accent used sparingly.

---

## Features

### Today (Day View)
The home screen. Switch between **Day**, **Week**, and **Month** views using the toggle at the top.

- **Day** — Scrollable timeline for the selected date. Shows both recurring timetable classes *and* one-off events merged together. Timetable entries are marked `WEEKLY` so you can tell them apart. A live "now" indicator shows your current position in the day.
- **Week** — Accordion view of the full current week. Each day collapses/expands. Today auto-expands. Shows class count or "Free" at a glance.
- **Month** — Calendar grid with colored dot indicators per day. Tap any date to preview that day's schedule below the grid. Navigate months with the arrow buttons.

Quick stats show class count and total focus time for the selected day. An exam countdown card ticks down to Internal Assessment (4th June 2026).

### Timetable (Week Grid)
Build your recurring weekly schedule. Tap any empty cell to add a class pre-filled with that time slot and day. Classes are color-coded by subject. Tapping an existing class prompts deletion. The timetable feeds directly into the Day, Week, and Month dashboards.

**Subjects:** Medicine · Surgery · Paediatrics · Obs & Gynae · FM / Forensic · SPH & CM

**Session types:** SIS · SGD · CBL · LIF · LABEX · Seminar · PMD · Self Study

### Rotations (Clinic)
Tracks the VI Semester clinical posting schedule. Pre-loaded with the Group A rotation dates (Medicine → Surgery → Paediatrics → OG). A semester progress bar and days-remaining counter sit at the top alongside the exam countdown.

Add custom rotations via the `+` button. The first custom rotation clears the defaults.

#### Research Project — RCT Tracker
A dedicated section for your research project work (1st–28th March 2026 posting period):

- **Project Details** — Input fields for study title, moderator name, and tutor/guide name. Saved automatically as you type.
- **RCT Timeline Checklist** — 18-step checklist covering the full lifecycle of a Randomised Controlled Trial:

  | Phase | Steps |
  |---|---|
  | Pre-protocol | Idea generation, literature review |
  | Protocol | Protocol writing, IEC submission, IEC approval, CTRI registration |
  | Pre-trial | Sample size calculation, randomization plan, CRF / data tools |
  | Recruitment | Enrollment begins, target met |
  | Intervention | Follow-up complete |
  | Analysis | Data entry & cleaning, statistical analysis |
  | Reporting | Results interpretation, manuscript draft, guide review, submission |

- **Progress bar** — Updates live as you tick off milestones.

### Focus (Pomodoro)
Minimalist focus timer with a dot-matrix orb display.

- Three preset modes: **25/5** (Focus), **50/10** (Deep), **90/20** (Flow)
- Tap the orb or the Start button to begin. Tap again to pause.
- Sessions auto-log with subject, duration, and timestamp
- Streak dots track completed sessions in the current block
- Break phases auto-start after a short delay
- Today's sessions and full history viewable via the log sheet

### Settings
- Light / Dark mode toggle (Nothing OS is always dark by default)
- Sound & haptics toggle for timer alerts
- Export all data as a JSON backup
- Clear all data (irreversible)

---

## Usage

1. Open `index.html` in any modern mobile or desktop browser.
2. **Add your timetable first** — go to the Week tab, tap empty cells to fill in your recurring classes. These will appear in every view automatically.
3. **Add one-off events** from the Today page using the `+` button in the header — lectures shifted, surprise SGDs, etc.
4. **Set up your research details** in the Clinic tab → Research Project section.
5. Use the Focus tab during study blocks to log your time per subject.

The app works best saved to your home screen as a PWA (Add to Home Screen in your browser).

---

## Data & Storage

All data is stored in `localStorage` under the key `plnx_v1`. Nothing leaves your device.

**State structure:**
```json
{
  "theme": "dark",
  "events": { "YYYY-MM-DD": [ { "id", "title", "start", "end", "subject", "type", "location" } ] },
  "classes": [ { "id", "title", "day", "start", "end", "subject" } ],
  "rotations": [ { "id", "dept", "start", "end", "group", "notes" } ],
  "focusLog": [ { "id", "date", "subject", "duration", "phase", "time" } ],
  "pomodoro": { "work": 25, "break": 5 },
  "research": { "title", "moderator", "tutor", "checklist": { "p1": true, ... } }
}
```

Use **Settings → Export Data** to download a JSON backup before clearing storage or switching devices.

---

## Tech Stack

| Thing | Detail |
|---|---|
| Runtime | Vanilla HTML/CSS/JS — no build step, no framework |
| Fonts | Space Mono (headings), DM Mono (body) via Google Fonts |
| Storage | `localStorage` |
| PWA | Inline service worker (basic fetch passthrough) |
| Size | ~85 KB single file |
| Dependencies | None |

---

## Semester Reference

**VI Semester · 2023 Batch · BPKIHS**
Jan 11 – Jun 2, 2026 · Internal Assessment starts Jun 4, 2026

Default rotation schedule (Group A):

| Department | Dates |
|---|---|
| Medicine | Jan 11 – Feb 4 |
| Surgery | Feb 5 – Feb 28 |
| Paediatrics | Mar 29 – Apr 22 |
| Obs & Gynae | Apr 23 – May 18 |

Research project posting: Mar 1 – Mar 28, 2026

---

*PlnX v1.0 — BPKIHS VI Sem 2023*
