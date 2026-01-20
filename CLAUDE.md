# Sense - Claude Code Context

## Project Overview
Sense is a React-based forecasting/prediction tracking app deployed on GitHub Pages.

## Tech Stack
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS v4 for styling
- React Router v7 for routing
- Recharts for data visualization
- GitHub Actions for CI/CD deployment

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production (runs tsc then vite build)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Deployment
- Hosted on GitHub Pages at https://idamezhim.github.io/sense/
- Deployment is automated via `.github/workflows/deploy.yml` on push to main
- Build output goes to `dist/` directory

## GitHub Pages SPA Routing Fix
When deploying SPAs to GitHub Pages, client-side routing breaks on page refresh because GitHub looks for actual files at each route path.

**Solution implemented:**
1. `BrowserRouter` has `basename="/sense"` to match the repo name
2. `public/404.html` - GitHub serves this for unknown routes; it saves the URL to sessionStorage and redirects to root
3. `index.html` has a script that reads sessionStorage and restores the correct route via `history.replaceState`

**Important:** If the repo is made private and then public again, GitHub Pages gets disabled and must be manually re-enabled:
```bash
# Re-enable Pages with GitHub Actions
gh api repos/OWNER/REPO/pages -X POST -f build_type=workflow

# Or for static sites from a branch
gh api repos/OWNER/REPO/pages -X POST --input - <<< '{"source":{"branch":"main","path":"/"}}'
```

## Project Structure
```
src/
  App.tsx           # Main app with React Router setup
  main.tsx          # Entry point
  components/       # Reusable UI components
  pages/            # Page components (ForecastLog, Dashboard, Settings, Onboarding)
  hooks/            # Custom hooks (useForecasts, useLocalStorage)
  utils/            # Utility functions (scoring, export, analytics)
  types/            # TypeScript type definitions
public/
  404.html          # SPA routing fallback for GitHub Pages
```
