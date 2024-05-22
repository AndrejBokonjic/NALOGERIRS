const { app, BrowserWindow, ipcMain } = require('electron');
const {format} = require("url");

const electronReload = require("electron-reload");
const { spawn } = require('child_process');
const {join} = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js'),


            //preload:  'preload.js',
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
ipcMain.on('process-pdf', (event, filePath) => {
    const pythonProcess = spawn('python', [join(__dirname, './python/pdfReadPlumber.py'), filePath]);

    let dataBuffer = '';

    /*
    pythonProcess.stdout.on('data', (data) => {
        // vratimo podatke nazaj
        event.reply('pdf-processed', data.toString());
    });*/
    pythonProcess.stdout.on('data', (data) => {
        dataBuffer += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const tables = JSON.parse(dataBuffer);
            event.reply('pdf-processed', tables);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    /*
    let dataBuffer = '';

    pythonProcess.stdout.on('data', (data) => {
        dataBuffer += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        const tables = JSON.parse(dataBuffer);
        event.reply('pdf-processed', tables);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });*/
});
