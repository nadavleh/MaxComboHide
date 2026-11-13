// Max Combo Hide: removes AliExpress product cards whose caption is "Max Combo".
// Class names on AliExpress are obfuscated and change, so we match the text
// and walk up the DOM to the card that is one item of the product grid.

const LABEL = /^max\s*combo\b/i;
const ITEM_LINK = 'a[href*="/item/"]';
const DONE = 'data-mch-hidden';

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

function scan(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const hits = [];
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (LABEL.test(t.nodeValue.trim())) hits.push(t.parentElement);
  }
  for (const el of hits) {
    const card = findCard(el);
    if (card && !card.hasAttribute(DONE)) {
      card.setAttribute(DONE, '');
      card.style.setProperty('display', 'none', 'important');
    }
  }
}

scan(document.body);

// Infinite scroll and page changes add cards later.
let pending = false;
new MutationObserver(() => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    scan(document.body);
  });
}).observe(document.body, { childList: true, subtree: true, characterData: true });
