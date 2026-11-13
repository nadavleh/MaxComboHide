const toggle = document.getElementById('toggle');
const countEl = document.getElementById('count');

chrome.storage.local.get({ enabled: true }, (s) => { toggle.checked = s.enabled; });
toggle.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: toggle.checked });
  showCount();
});

async function showCount() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    const { count } = await chrome.tabs.sendMessage(tab.id, { type: 'getCount' });
    const verb = toggle.checked ? 'hidden' : 'found (showing)';
    countEl.innerHTML = `<b>${count}</b> Max Combo card${count === 1 ? '' : 's'} ${verb} on this page`;
  } catch {
    countEl.textContent = 'Not an AliExpress page';
  }
}

showCount();
