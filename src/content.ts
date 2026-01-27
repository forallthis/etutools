// Content script for etutools
// Note: Content scripts should avoid complex imports

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeSelection') {
    const selection = window.getSelection()?.toString() || '';
    
    // Simple content type detection
    let contentType = 'text';
    
    if (selection.trim().startsWith('{') || selection.trim().startsWith('[')) {
      try {
        JSON.parse(selection);
        contentType = 'json';
      } catch {
        // Not valid JSON
      }
    } else if (/^https?:\/\//i.test(selection.trim())) {
      contentType = 'url';
    } else if (/^\d{10,13}$/.test(selection.trim())) {
      const num = parseInt(selection.trim());
      if (num > 1000000000 && num < 9999999999999) {
        contentType = 'timestamp';
      }
    }
    
    sendResponse({ selection, contentType });
  }
  return true;
});

console.log('etutools content script loaded');
