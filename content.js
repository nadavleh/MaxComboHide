// Max Combo Hide: removes AliExpress product cards whose caption is "Max Combo".
// Class names on AliExpress are obfuscated and change, so we match the text
// and walk up the DOM to the card that is one item of the product grid.

const LABEL = /^max\s*combo\b/i;
const ITEM_LINK = 'a[href*="/item/"]';
const MARK = 'data-mch-card';

let enabled = true;

// A node "holds a card" if it is, or contains, a link to a product page.
function holdsItem(el) {
  return el.matches?.(ITEM_LINK) || !!el.querySelector?.(ITEM_LINK);
}

// The card is the ancestor whose parent is the grid: a parent with
// 3+ children that each hold a product link.
function findCard(start) {
  let node = start;
  while (node && node.parentElement && node.parentElement !== document.body) {
    const parent = node.parentElement;
    let cards = 0;
    for (const child of parent.children) {
      if (holdsItem(child) && ++cards >= 3) return node;
    }
    node = parent;
  }
  return null;
}

// Find Max Combo cards and tag them (tagging is independent of on/off).
function scan(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (!LABEL.test(t.nodeValue.trim())) continue;
    const card = findCard(t.parentElement);
    if (card) card.setAttribute(MARK, '');
  }
}

let lastCount = -1;
function apply() {
  const cards = document.querySelectorAll(`[${MARK}]`);
  for (const card of cards) {
    if (enabled) card.style.setProperty('display', 'none', 'important');
    else card.style.removeProperty('display');
  }
  const count = cards.length;
  if (count !== lastCount) {
    lastCount = count;
    chrome.runtime.sendMessage({ type: 'count', count }).catch(() => {});
  }
}

function refresh() {
  scan(document.body);
  apply();
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === 'getCount') reply({ count: lastCount < 0 ? 0 : lastCount });
});

chrome.storage.onChanged.addListener((changes) => {
  if ('enabled' in changes) {
    enabled = changes.enabled.newValue !== false;
    apply();
  }
});

chrome.storage.local.get({ enabled: true }, (s) => {
  enabled = s.enabled;
  refresh();
});

// Infinite scroll and page changes add cards later.
let pending = false;
new MutationObserver(() => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    refresh();
  });
}).observe(document.body, { childList: true, subtree: true, characterData: true });
