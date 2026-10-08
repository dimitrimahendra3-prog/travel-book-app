# Jejak Nusantara App — Progress & Handoff

> If you are an AI model continuing this work: read this file first, then `README.md`.
> Update the checklist below whenever you finish a step.

## Goal (from user)
Build the Jejak Nusantara prototype until it is **deployable, testable, and every feature works**.
UI style: **modern minimalism + glassmorphism**.
Language of the user: Indonesian. UI copy: English (international travelers are primary market).

## Business context (from pitch deck `JEJAK NUSANTARA by Group 4...pdf`)
- Marketplace connecting travelers with curated, verified local Indonesian guides ("Cultural Ambassadors").
- Key pains: unprofessional guides, hard to find trusted guide, scam risk, rigid packages.
- Key gains: personal/flexible trips, authentic experience, safety, transparent price.
- Revenue: commission 15–25% per booking (we show a 10% service fee to traveler), premium guide subscription, add-ons.
- **User requirement (2026-10-07):** destinations are chosen freely by the CUSTOMER, not fixed by the guide.
  Guide ready-made packages are optional.

## Architecture
- Location: `CET/jejak-nusantara-app/`
- No build step. Vanilla HTML + CSS + ES modules. Hash router (`#/explore`, `#/guide/1`, ...).
- Persistence: `localStorage` (bookings, user session, wishlist, reviews, guide listings).
- `js/logic.js` = pure functions (pricing, filtering, validation). Unit-tested with `node --test`.
- `server.js` = tiny zero-dependency static server for local run + smoke test.
- Deploy: static hosting (Vercel `vercel.json`, Netlify `netlify.toml`, or GitHub Pages). No backend.

## Files
| File | Purpose |
|---|---|
| `index.html` | App shell |
| `css/styles.css` | Glassmorphism design system |
| `js/data.js` | Guides, destinations catalog, seed data |
| `js/logic.js` | Pure business logic (tested) |
| `js/store.js` | localStorage wrapper |
| `js/app.js` | Router + views |
| `server.js` | Local static server |
| `tests/*.test.js` | Unit + smoke tests |

## Checklist
- [x] Scaffold + PROGRESS.md
- [x] data.js
- [x] logic.js + tests
- [x] store.js
- [x] styles.css (glass UI)
- [x] index.html + app.js views: home, explore (filters), guide profile, trip builder (custom destinations), checkout (payment methods, promo), confirmation, my bookings (cancel, review), profile/login, guide dashboard (accept/decline, listings)
- [x] server.js + smoke test
- [x] README with run/test/deploy steps
- [x] Run tests green
- [x] Manual browser check
- [x] Deploy config (vercel.json / netlify.toml)

## Log
- 2026-10-07: Started. Old single-file prototypes remain at `CET/jejak_nusantara_web.html` and `CET/jejak_nusantara_mobile.html` (reference only).
