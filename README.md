# Tehseen Hamid — Portfolio

Static site: no build step, no framework, no icon libraries. Always opens in light mode.

## Run locally
    npx serve .            # then open http://localhost:3000
    # or: python -m http.server 8000

## Real project screenshots (do this once)
Each project card shows `assets/shots/<name>.jpg`. Until those files exist, the card shows a
live preview of the real site instead. To create real screenshots of all 10 sites:

    npm i playwright
    npx playwright install chromium
    node scripts/capture-screenshots.js

## Edit content
Everything is in `index.html`. Colors and theme tokens are CSS variables at the top of
`assets/css/style.css`. Phone/WhatsApp number: search for `923276099669`.

## Run it (website + reviews database)
    cd server
    npm start            # http://localhost:3000   (Node.js 22.13+; nothing to install)

(or from this folder: `node --no-warnings server/server.js`)

The site is served by `server/server.js`. Reviews submitted through the form are saved in a local SQLite database
(`server/data/reviews.db`, created automatically) and appear on the page instantly.

Manage reviews from the terminal (inside `server/`):

    node --no-warnings admin.js list | hide <id> | show <id> | delete <id>

To approve each review yourself first, start with `AUTO_PUBLISH=false npm start`, then `node --no-warnings admin.js show <id>`.

## Putting it online
GitHub Pages and Vercel only host static files, so they cannot save new reviews on their own. Choose one:
1. Host everything on a Node host with a persistent disk (Render, Railway, Fly.io, a VPS): `npm install && npm start`.
2. Keep the site on GitHub/Vercel and run `server.js` on such a host; then set `apiBase` in `assets/js/config.js`
   to that server's address, and start it with `ALLOWED_ORIGIN=https://your-site.example`.
Without a server the form falls back to emailing you the review.

Reviews you add by hand live in `assets/js/reviews.js`.

## Design Studio
`studio.html` lets a client choose colours (colour map with 36,000+ shades, ten palettes, hex input), an animation
style, corner style and fonts, watch a live sample website update, and send the brief to you on WhatsApp or by email.
Their choices are also saved in the page link so they can share it.

## Quick jump
Press Ctrl K (Cmd K on Mac) anywhere on the main page to jump to a section, open a project, or start a game.

## Design Studio (studio.html)
Clients design a full sample website: palettes + 36,000 shades, 19 fonts, click any element to change colour, font, size, corners, shadow, border, animation and hover; reorder or hide sections; edit text; then send the brief on WhatsApp (+92 327 6099669) or email. The share link reopens the exact design.
