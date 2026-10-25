# Jejak Nusantara

A frontend web application connecting travelers with local Indonesian Cultural Ambassadors.

## Local Development

Start the static server:
```bash
node server.js
```
Open `http://localhost:3000` in your browser.

## Testing

Run unit and smoke tests (business logic, booking lifecycle, reviews, store, server) using the native Node.js test runner:
```bash
node --test tests/logic.test.js tests/booking.test.js tests/server.test.js
```

## Booking flow

`Pending` → guide **Accepts** / **Declines** → `Accepted` → guide **Marks as Completed** → traveler leaves a review (1–5 stars, 10–500 chars), which appears on the guide's profile.
Travelers can cancel while `Pending` or `Accepted`. Use *Profile → Login as Customer / Login as Guide* to switch roles.

## Deployment

The app uses Hash Routing and `localStorage`, so no backend is required. 
Deployment configurations are included:
- **Vercel**: Uses `vercel.json`
- **Netlify**: Uses `netlify.toml`
- **GitHub Pages**: You can serve directly from the root directory.
