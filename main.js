const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const {format} = require("url");

const electronReload = require("electron-reload");
const { spawn } = require('child_process');
const {join} = require("path");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js'),
        },
    });

    win.loadURL('http://localhost:5173');

    electronReload(__dirname, {});
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

});

ipcMain.on('categorize-pdf', (event, filePath) => {
    const pythonProcess = spawn('python', [join(__dirname, './python/pdfKategorizacija.py'), filePath]);

    pythonProcess.stdout.on('data', (data) => {
        event.reply('pdf-categorized', data.toString().trim());
    });
    pythonProcess.stderr.on('data', (data)=> {
        console.error(`stderror: ${data}`);
    });
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

ipcMain.on("send-table-to-butterfly-model", (event, dataToButterflyModel) => {

    const pythonProcess = spawn('python', [join(__dirname, './python/butterflyModel.py'),
        JSON.stringify(dataToButterflyModel.results), dataToButterflyModel.filePathToSave] );

    pythonProcess.stdout.on('data', (data) => {
        //console.log("prediction: "+ data, "type of data: ", typeof data);
        event.reply('butterfly-model-response', data.toString()); // mozebi i stringify kje treba
    });


    pythonProcess.stderr.on('data', (data) => {
       console.error('stderr: ', data.toString());
    });
    pythonProcess.on('close', (code) => {
        console.log('child process exited with code ', code);
    });
});

ipcMain.on("send-table-to-head-neck-model", (event, {tableData}) => {

    const pythonProcess = spawn('python', [join(__dirname, './python/headneckModel.py'), JSON.stringify(tableData)] );

    console.log("head-neck tabele: ", tableData);

    pythonProcess.stdout.on('data', (data) => {
        console.log("prediction: "+ data.toString());
        event.reply('head-neck-model-response', data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
       console.error('stderr: ', data.toString());
    });
    pythonProcess.on('close', (code) => {
        console.log('child process exited with code ', code);
    });
});

ipcMain.handle('show-save-dialog', async (event) => {
    const result = await dialog.showSaveDialog({
        title: 'Save PDF',
        defaultPath: 'results.pdf',
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });
    return result.filePath;
});

ipcMain.handle('open-folder', async (event, filePath) => {
    const folderPath = path.dirname(filePath);
    shell.openPath(folderPath);
})


