import {FilesUpload} from "./FilesUpload.tsx";
//import {PdfTextOnly} from "./PdfTextOnly.tsx";
import {useEffect, useState} from "react";
//import {PDFViewer} from "./PDFViewer.tsx";

const { ipcRenderer } = window.require('electron');
//const { ipcRenderer } = require('electron');
//import {ipcRenderer} from 'electron'

export const FileProcessing = () => {

    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array[]>([]);

    const handleChangeOnFilesUpload = (filesUpload: File[])=> {
        console.log(filesUpload);

        //const newFiles = [...files, ...filesUpload];
        setFiles(prevFiles => [...prevFiles, ...filesUpload])

        filesUpload.forEach(file => {
            const filePath = file.path;
            ipcRenderer.send('process-pdf', filePath);
        });
    }

    useEffect(() => {
        ipcRenderer.on('pdf-processed', (event, data) => {

            console.log("response:" + data);
            //const parsedData = JSON.parse(data);
            setPdfTexts(prevTexts => [...prevTexts, data]);
        });

        // Clean up the listener on component unmount
        return () => {
            ipcRenderer.removeAllListeners('pdf-processed');
        };
    }, []);

    if (pdfTexts.length>0){
        console.log("TEST TEST");
        console.log(pdfTexts);
        console.log(files);
        console.log("array pdf tables: " + pdfTexts[0]);
        console.log(typeof pdfTexts[0]);

    }



    return <>
        <FilesUpload onAddFiles={handleChangeOnFilesUpload}/>

        {pdfTexts.map((file, index) => (
        <div key={index}>
            <br />

            {/*<h3>Uploaded File {index + 1}</h3>*/}
            {/*<PdfTextOnly file={file} />*/}


            <div>
                <h3>Extracted Text from File {index + 1}</h3>
                <pre>{pdfTexts[index]}</pre>
            </div>

            {/* preview od pdf
            <PDFViewer file={file}/>*/}

            <br/><br/><br/><br/>
        </div>
        ))}




        {pdfTexts.map((pdf, pdfIndex) => (
            <div key={pdfIndex}>
                <h3>Document {pdfIndex + 1}</h3>
                {pdf.map((table, tableIndex) => (
                    <div key={tableIndex}>
                        <h4>Table {tableIndex + 1}</h4>
                        {table.map((row, rowIndex) => (
                            <div key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <pre key={cellIndex}>{cell}</pre>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        ))}
    </>
}

