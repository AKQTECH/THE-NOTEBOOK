# The Notebook — rebuilt desktop and PWA

Approved design: pale blush #FAEAF3, lime #E0ED83, pure black Anton titles, white writing area, DM Sans controls. Links remain bold and never underlined. No marketing banners.

## Open and deploy

The desktop release is in `dist/desktop/index.html`; the separate mobile/PWA release is in `dist/pwa/index.html`. Each release contains exactly index.html, manifest.json, service-worker.js, and icon.jpg. Fonts and editor code are bundled, with no CDN dependency. The original notebook files have not been overwritten.

For reliable storage, serve the releases at stable URLs. Upload the desktop package to its own directory and the PWA package to a different directory, preserving the four filenames. Use HTTPS for PWA installation and Dropbox authorization. On iPhone, open the PWA URL in Safari and choose Share → Add to Home Screen. Open online once before using it offline. The desktop file also opens locally; browser file-URL storage varies, so keep JSON backups and use a stable hosted URL for daily work.

This is a browser-based desktop release, not a signed macOS application. Deployment layout: the PWA is served at the repository root; the desktop release is served at /desktop/.

## Editing

Create, rename, search, star, pin, categorize, archive/restore, duplicate, and delete notes. Switch the library between board and list layouts. Archived notes stay searchable and become editable when restored.

Body fonts: DM Sans, Lora, Georgia, Arial, monospace; sizes 14–24. Titles remain Anton. Formatting includes bold, italic, ordinary-text underline, headings, links, checklists, numbered/bulleted lists, quotes, dividers, images, and tables. On the PWA, tap Aa to expand formatting tools. Table controls appear when the caret is inside a table; Exit Table or Command/Ctrl+Enter creates a paragraph after it. Tab moves between cells. Table content scrolls inside the note on narrow screens.

Edits save on the device as you type; Save becomes available if a local write fails. Save errors remain visible. Undo/redo applies to editor document transactions. Export TXT, formatted HTML, or use Print / Save PDF. Export JSON from Settings for a complete backup including images, metadata, tables, and archived notes.

Images are embedded after resizing to a maximum dimension of 1600px. GIF imports become still images. Device storage has a finite quota; a failed write is not labeled saved. Export pending edits and free space if the failure banner appears.

## Existing notes and sync

The rebuilt app uses `akq_notebook_v3`. On the same origin, it imports the old `akq_notebook_v2` store if no v3 store exists, retaining the old store and original note content. On another URL/origin, import an old JSON backup, or connect Dropbox in Settings and choose Import Old Dropbox Notes. Migration preserves IDs, rich text, checklist completion, tables, and note metadata where supplied.

Desktop and PWA on the same origin share local notes. Different devices/origins require Dropbox sync or JSON import/export. Dropbox writes a separate `/The Notebook/notebook-v3.json`; it does not overwrite the old `/The Notebook/notebook.json`. Concurrent divergent versions are retained as conflict copies. Deletions retain synchronization tombstones; they are not a user-facing trash folder.

The existing Dropbox public app key is reused. The exact deployed desktop and PWA redirect URLs must be allowed in that Dropbox app's settings. Connect each device from Settings. Sync failures are shown in Settings; offline edits remain local until sync succeeds. JSON backups are independent of Dropbox.

## Verification — November 12, 2026

25 automated tests passed; one PWA-only offline case was skipped in the desktop project. Tested with Chromium at desktop size and WebKit with an iPhone 13 viewport:

- Repeated Enter/blank lines, subsequent typing, refresh, and independent notes.
- Checklist splitting, independent completion, undo/redo, stable IDs, retained bold and links.
- Table insertion, row addition, Tab navigation, exiting the table, and refresh persistence.
- Archive/restore, font persistence, black Anton titles, bold non-underlined links.
- Old-data migration without modifying the original store.
- Embedded image backup/export and restore.
- Storage quota failure/retry and malformed-storage recovery export.
- Mocked Dropbox conflict/retry transport and preservation of the legacy file path.
- PWA initial installation, offline startup/edit/reload, and bundled fonts.
- Desktop/mobile screenshots and page overflow checks.

The exact original freeze was not reproduced in the old app; the rebuilt editor passes the reported interaction sequence. Live Dropbox OAuth and actual phone/home-screen/soft-keyboard installation have not been tested. Printed PDF appearance was not manually verified. These limits are not equivalent to complete real-device validation.

## Development

Source is in `src/`; rebuild with `npm ci` then `npm run build`. Start `npm run serve` and run `npm test` in another terminal. Install Playwright WebKit and Chromium first. Playwright uses its installed Chromium by default. Set CHROMIUM_EXECUTABLE_PATH to use another executable. Every build creates a fresh service-worker cache version. Deploy all four files together.

The editor uses Tiptap document transactions rather than the previous hand-mutated contenteditable/execCommand implementation. Sanitized migration/import and validated document JSON are shared across releases. Test report: `test-report/index.html`. Final screenshots: `previews/desktop.png` and `previews/pwa.png`.

## Additional safety verification

November 13: 36 tests passed, 2 PWA-only desktop skips, zero npm audit vulnerabilities. See SAFETY_CHECKS_20261113.md for the expanded checks and limits.

## Approved board update — November 16, 2026

The library uses square cards with uniform #DEEC82 top edges. THE NOTEBOOK uses black Anton at 96px on desktop (double the 48px mockup), scaled to fit mobile. New Note is lime. Category and formatting dropdown arrows have additional inset space. Archive browsing and the persistent include-archived preference are in Settings. The original blue favicon is embedded for browser tabs/bookmarks, never displayed beside the app name. Existing notes and editor data are unchanged.

## Editor refinements — November 16, 2026

Category picker text is 16px. Empty-title placeholder is 24px with interior padding; entered titles retain their Anton style. The note action bar starts collapsed behind Note Actions and remembers the local toggle. Save failures remain visible and expose the retry controls. Settings opens as a separate full-screen view. Show word count is off by default and persists when changed. 40 tests passed, with two PWA-only desktop skips, including hide/show controls, word-count persistence, storage failure recovery, editing, and offline behavior.

## Note-click race repair

Reproduced a dropped click when a background storage/sync update replaced the board between pointer-down and pointer-up. The new regression failed on desktop Chromium and WebKit before the change and passed after it. Board updates now preserve existing card elements and defer rendering until the current pointer interaction completes. No note data is changed by this repair. Fresh live-site sessions opened notes normally before the repair; the specific reported user session could not be inspected, so this is a verified contributing bug rather than proof of that session’s sole cause.
