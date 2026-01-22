# Sense - Claude Code Context

## Project Overview
Sense is a React-based forecasting/prediction tracking app deployed on GitHub Pages.

## Tech Stack
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS v4 for styling
- React Router v7 for routing
- Recharts for data visualization
- framer-motion for animations
- Remotion for video generation
- GitHub Actions for CI/CD deployment

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production (runs tsc then vite build)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Remotion Video Commands
```bash
npm run remotion:studio   # Open Remotion Studio to preview/edit video
npm run remotion:render   # Render video to out/launch-video.mp4
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
  components/       # Reusable UI components (ForecastCard, ForecastForm, CloseModal, Navigation, Layout, LaunchVideo)
  pages/            # Page components (Landing, HowItWorks, ForecastLog, Dashboard, Settings, Onboarding)
  hooks/            # Custom hooks (useForecasts, useLocalStorage)
  utils/            # Utility functions (scoring, export, analytics)
  types/            # TypeScript type definitions
  remotion/         # Remotion entry point and composition registry
public/
  404.html          # SPA routing fallback for GitHub Pages
  favicon.svg       # App favicon
  music.mp3         # Background music for launch video
out/
  launch-video.mp4  # Rendered video output (not committed)
```

## Design System

### Theme
- **App**: Dark mode only (slate backgrounds with glass morphism)
- **Landing page**: Light theme (`#FAFAF9` background, `#1A1A1A` text)
- Theme color: `#4F46E5` (indigo)

### Card Design (Linear-inspired glass effect)
```tsx
style={{
  background: 'linear-gradient(to bottom right, rgba(51, 65, 85, 0.5), rgba(30, 41, 59, 0.5))',
  boxShadow: 'inset 0 1px 0 0 rgba(148, 163, 184, 0.1)',
}}
// With subtle border that lightens on hover
<div className="absolute inset-0 rounded-xl border border-slate-700/50 group-hover:border-slate-600/80" />
```

### Mobile Responsiveness
- Use `sm:` breakpoint for desktop-specific styles
- Buttons: Show abbreviated text on mobile (`<span className="sm:hidden">New</span>`)
- Filter tabs: `flex-1 sm:flex-none` for full-width on mobile

## Important Type Fields
When working with the `Forecast` type:
- Use `dateCreated` (not `createdAt`) for when the forecast was created
- Use `byWhen` for the due date
- Use `status: 'open' | 'closed'` for forecast state
- Use `brierScore` (optional) for closed forecasts

## Remotion Video Integration

### Architecture
- `src/components/LaunchVideo.tsx` - Video composition and scenes
- `src/remotion/Root.tsx` - Composition registry for Remotion CLI
- `src/remotion/index.ts` - Remotion entry point
- `remotion.config.ts` - Remotion CLI configuration

### Audio Path Differences (Vite vs Remotion CLI)
- **For Vite/web**: Use `/sense/music.mp3` (respects base path)
- **For Remotion CLI render**: Use `staticFile('music.mp3')`
- When rendering, temporarily change to `staticFile()`, render, then change back

### Remotion Player Props
- Use `renderPoster` for custom preview image before playback
- Use `showPosterWhenUnplayed` to show poster until user clicks play
- Audio requires user interaction due to browser autoplay policies
