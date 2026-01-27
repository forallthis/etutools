// Background Service Worker for etutools

// Setup context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'oktools-json',
    title: 'Format JSON',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'oktools-base64',
    title: 'Base64 Encode',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'oktools-url',
    title: 'URL Encode',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'oktools-qrcode',
    title: 'Generate QR Code',
    contexts: ['selection', 'link']
  });

  chrome.contextMenus.create({
    id: 'oktools-timestamp',
    title: 'Convert Timestamp',
    contexts: ['selection']
  });

  console.log('etutools context menus created');
  console.log('Side Panel API available:', !!chrome.sidePanel);
});

// Handle messages from popup and context menu
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);

  if (message.type === 'OPEN_TOOL') {
    // Open side panel and notify it to load the tool
    if (chrome.sidePanel) {
      chrome.sidePanel.open().then(() => {
        console.log('Side Panel opened, sending OPEN_TOOL message');
        // Send message to side panel to load the tool
        chrome.runtime.sendMessage({
          type: 'LOAD_TOOL',
          toolId: message.toolId,
          input: message.input
        });
      }).catch((error) => {
        console.error('Failed to open side panel:', error);
      });
    } else {
      console.error('chrome.sidePanel is not available!');
    }
    sendResponse({ success: true });
  }

  return true;
});

console.log('etutools background worker initialized');
