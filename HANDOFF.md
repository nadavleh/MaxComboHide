# Max Combo Hide — handoff

## Goal
A Chrome extension (Manifest V3) that hides AliExpress product cards whose caption reads **"Max Combo"**.
The user keeps clicking them by mistake and never wants to see them.

## What a card looks like (from the user's screenshot)
- Product image, "Choice" + "11.11 Sale" badges, title, price, stars, "x sold", "Save US $..", "Top selling on AliExpress".
- Last line of the card: **"Max Combo >"** (small grey text).

## Plan
1. `manifest.json` — MV3, content script on `*://*.aliexpress.com/*` (and regional domains like `aliexpress.us`, `aliexpress.ru`).
2. `content.js`:
   - Find text nodes / elements whose trimmed text is exactly "Max Combo".
   - Walk up to the product card root (the nearest ancestor that is one grid item — likely an `<a>` or a div that is a direct child of the grid). Do NOT hide a container that holds many cards.
   - Hide it (`display:none`), mark it so it isn't processed twice.
   - `MutationObserver` for infinite scroll / SPA navigation.
3. Optional: popup with an on/off toggle and a hidden-count badge.
4. Load via `chrome://extensions` → Developer mode → Load unpacked → this folder.

## Open question — needed before writing the card-finding logic
- The real DOM of a card. Ask the user: right-click a "Max Combo" card → Inspect → screenshot (or copy outerHTML of the card).
- AliExpress class names are obfuscated and change, so prefer matching on the "Max Combo" text + structural walk-up rather than class names.

## Status
- v0.1: manifest.json + content.js written (text match "Max Combo" -> walk up to grid item: parent with 3+ children holding /item/ links). Confirmed working on the live site by the user (2026-11-13).
- DOM seen so far: card = div > a[href*="/item/"] + div.us--findWrapper ("Similar items"). The "Max Combo" element itself not seen yet.
- v0.2: popup on/off toggle (chrome.storage.local `enabled`) + count of Max Combo cards on the page (popup text + icon badge, grey when off). Cards are tagged `data-mch-card` regardless of on/off; toggling just shows/hides them. Needs user test on the live site.
