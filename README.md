# Max Combo Hide

A tiny Chrome extension that hides the **"Max Combo"** product cards AliExpress pushes into search results and recommendations, so you stop clicking them by accident.

- Hides every product card captioned "Max Combo", including ones loaded while you scroll.
- On/off switch in the toolbar popup.
- The icon badge shows how many Max Combo cards were found on the page (grey when hiding is off).
- No tracking, no network requests. It only runs on AliExpress pages and only stores your on/off setting.

## Install

1. Download this repo (**Code → Download ZIP**) and unzip it, or `git clone` it.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick the `MaxComboHide` folder.
4. Open AliExpress. Max Combo cards are gone.

Works in any Chromium browser (Chrome, Edge, Brave, Opera).

## How it works

AliExpress class names are obfuscated and change often, so the extension doesn't rely on them. It looks for the text "Max Combo", then walks up the page to the product card that holds it (the element whose parent is the product grid) and hides that card.

If AliExpress changes its layout and cards come back, please [open an issue](../../issues).

## License

MIT
