// Shows the number of Max Combo cards found on each tab as the icon badge.
// Grey when hiding is off.

async function paintBadge(tabId, count) {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  chrome.action.setBadgeText({ tabId, text: count ? String(count) : '' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: enabled ? '#e5383b' : '#8a8a8a' });
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'count' && sender.tab) paintBadge(sender.tab.id, msg.count);
});

chrome.storage.onChanged.addListener(async (changes) => {
  if (!('enabled' in changes)) return;
  const color = changes.enabled.newValue !== false ? '#e5383b' : '#8a8a8a';
  for (const tab of await chrome.tabs.query({})) {
    chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color }).catch(() => {});
  }
});
