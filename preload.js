const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
        removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel), // Add this line to expose removeAllListeners

        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
    },
});


