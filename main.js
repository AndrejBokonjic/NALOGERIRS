const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const {format} = require("url");

//const electronReload = require("electron-reload");
const { spawn } = require('child_process');
const {join} = require("path");
const path = require("path");
const url = require("url");

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

    // win.loadURL('http://localhost:5173');
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        console.log("tuka sme")
        win.loadURL(url.format({

            pathname: join(__dirname, '/gazeProReact/dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    
     //electronReload(__dirname, {});
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


//const pythonExecutable = join(__dirname,'./python_embedded/python_embedded/python'); //, 'python'

ipcMain.on('process-pdf', (event, filePath) => {

    const pythonProcess = spawn('python', [join(__dirname, './python/pdfReadPlumber.py'), filePath]);
    let dataBuffer = '';
    pythonProcess.stdout.on('data', (data) => {
        dataBuffer += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const tables = JSON.parse(dataBuffer);

            console.log(tables);

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

ipcMain.on('pdf-model-type-and-patient-name', (event, filePath) => {
    const pythonProcess = spawn('python',
        [join(__dirname, './python/ImeModelaIzPDF in ImePacientaIzPDF/KategorijaPdfInImePacientaMAIN.py'), filePath]);

    pythonProcess.stdout.on('data', (data) => {

        const result = JSON.parse(data.toString().trim());
        console.log("RESULT IME I KATEGORIJA: "+ result);

        //console.log("kategorija in ime pacienta: "+ result.category + " " + result.pacient_name);

        event.reply('pdf-categorized-and-patient-name', result); //data.toString().trim()
    });
    pythonProcess.stderr.on('data', (data)=> {
        console.error(`stderror: ${data}`);
    });
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    pythonProcess.on('error', (error) => {
        console.error('Error starting Python process:', error);
        event.reply('error', 'Error processing the PDF');
    });

});

ipcMain.on("send-table-to-butterfly-model", (event, dataToButterflyModel) => {

    const pythonProcess = spawn('python', [join(__dirname, './python/butterflyModel.py'),
        JSON.stringify(dataToButterflyModel.results), dataToButterflyModel.patient_name, dataToButterflyModel.filePathToSave] );

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

ipcMain.on("send-table-to-range-of-motion", (event, dataToRangeOfMotion) => {

    const pythonProcess = spawn('python', [join(__dirname, './python/rangemotionModel.py'),
        JSON.stringify(dataToRangeOfMotion.results),dataToRangeOfMotion.patient_name,
        dataToRangeOfMotion.filePathToSave] );

    console.log("range-of-motion tabele: ", JSON.stringify(dataToRangeOfMotion.result));

    pythonProcess.stdout.on('data', (data) => {
        console.log("prediction: "+ data.toString());
        event.reply('range-of-motion-model-response', data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
       console.error('stderr: ', data.toString());
    });
    pythonProcess.on('close', (code) => {
        console.log('child process exited with code ', code);
    });
});


ipcMain.on("send-table-to-head-neck-model", (event, dataToHeadNeckRelocationModel) => {

    const pythonProcess = spawn('python', [join(__dirname, './python/headneckModel.py'),
        JSON.stringify(dataToHeadNeckRelocationModel.results),dataToHeadNeckRelocationModel.patient_name,
        dataToHeadNeckRelocationModel.filePathToSave] );

    console.log("head-neck tabele: ", JSON.stringify(dataToHeadNeckRelocationModel.result));

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

ipcMain.on('create-excel', (event) => {
    const pythonProcess = spawn('python', [path.join(__dirname, 'python/Eksel/generateExcel.py')]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

// Handler for saving data to an Excel file
ipcMain.on('save-data-to-excel', (event, data) => {
    const pythonProcess = spawn('python', [path.join(__dirname, 'python/Eksel/saveExcelData.py'), JSON.stringify(data)]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        event.reply('save-data-to-excel-response', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        event.reply('save-data-to-excel-response', `stderr: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});


