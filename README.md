# Signal (frontend)

React + TypeScript UI for the Signal social inbox: auth, conversations, leads, and Meta/Instagram account linking.

## Development

1. Start the API ([signal-core](https://github.com/)) on `http://localhost:8080`.
2. Install and run the dev server:

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080`, so the app calls the backend on the same origin and avoids CORS issues.

## Production API URL

Set `VITE_API_BASE_URL` to your deployed API origin (no trailing slash). See [.env.example](.env.example).

## Meta / Instagram OAuth

Register these **exact** redirect URLs in your Meta app:

- `http://localhost:5173/oauth/callback/META`
- `http://localhost:5173/oauth/callback/INSTAGRAM`

(Use your production origin when deployed.)

Users must be logged in before starting OAuth; the callback exchanges the code with the backend using their JWT.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Vite dev server + HMR    |
| `npm run build` | Typecheck + production build |
| `npm run lint`  | ESLint                   |
| `npm run preview` | Serve `dist/` locally |
