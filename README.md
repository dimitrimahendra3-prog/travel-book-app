# Jejak Nusantara

A frontend web application connecting travelers with local Indonesian Cultural Ambassadors.

## Local Development

Start the static server:
```bash
node server.js
```
Open `http://localhost:3000` in your browser.

## Testing

Run unit tests for business logic using the native Node.js test runner:
```bash
node --test tests/logic.test.js
```

## Deployment

The app uses Hash Routing and `localStorage`, so no backend is required. 
Deployment configurations are included:
- **Vercel**: Uses `vercel.json`
- **Netlify**: Uses `netlify.toml`
- **GitHub Pages**: You can serve directly from the root directory.
