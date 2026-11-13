# StudyTrack

An offline-first, installable study timer made with HTML, CSS and vanilla JavaScript.

## Features
- 8-hour daily goal countdown plus actual study-time tracking
- Start, stop and resume
- Sessions are split correctly across midnight
- Daily, Monday-to-date weekly, and month-to-date totals
- Select a date to view its total
- Local browser storage
- JSON export and import backup
- PWA installation and offline caching

## Run locally
Service workers require `localhost` or HTTPS. From this folder, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish it
Upload the contents of this folder to a static host such as GitHub Pages, Netlify or Cloudflare Pages. Open the HTTPS URL on your phone, then use the browser's **Install app** or **Add to Home Screen** option.

## Important notes
- Study records are stored separately on each device/browser. They do not automatically sync between phone and computer.
- Export a backup regularly. Clearing browser site data can erase local records.
- The timer calculates elapsed time from timestamps, so it can recover correctly after the browser is closed and reopened. Browser operating systems may suspend background pages; the displayed time catches up when the app is reopened.
- The Google Fonts import is optional decoration. The app remains usable offline with system fonts if the font has not been cached.
