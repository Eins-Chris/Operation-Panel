const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific Node.js features without exposing the entire Node.js API
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});
