const { app, BrowserWindow } = require('electron');
const {format} = require("url");
const {join} = require("path");
const electronReload = require("electron-reload");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadURL('http://localhost:5173'); // Load your React app URL

    electronReload(__dirname, {});

    /*
    const startUrl = format({
        pathname: join(__dirname, 'gazeProReact', 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
    });

    win.loadURL(startUrl);*/
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
