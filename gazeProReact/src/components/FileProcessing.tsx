import {FilesUpload} from "./FilesUpload.tsx";
//import {PdfTextOnly} from "./PdfTextOnly.tsx";
import {useEffect, useState} from "react";
import {Table} from "flowbite-react";
import "flowbite/dist/flowbite.css";

import { FaSave, FaTimes } from "react-icons/fa";

//import {PDFViewer} from "./PDFViewer.tsx";

//const { ipcRenderer } = window.require('electron');
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const { ipcRenderer } = require('electron');

//import {ipcRenderer} from 'electron'

//const ipcRenderer  =  window.electron.ipcRenderer;

export const FileProcessing = () => {

    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array[]>([]);

    const [editingRow, setEditingRow] = useState<{ tableIndex: number; rowIndex: number } | null>(null);


    const handleChangeOnFilesUpload = (filesUpload: File[])=> {
        console.log(filesUpload);

        //const newFiles = [...files, ...filesUpload];
        setFiles(prevFiles => [...prevFiles, ...filesUpload])

        filesUpload.forEach(file => {
            const filePath = file.path;
            window.electron.ipcRenderer.send('process-pdf', filePath);
        });
    }

    useEffect(() => {
        window.electron.ipcRenderer.on('pdf-processed', (event, data) => {

            console.log("response:" + data);
            //const parsedData = JSON.parse(data);
            setPdfTexts(prevTexts => [...prevTexts, data]);
        });

        // Clean up the listener on component unmount
        return () => {
            window.electron.ipcRenderer.removeAllListeners('pdf-processed');
        };
    }, []);

    if (pdfTexts.length>0){
        console.log("TEST TEST");
        console.log(pdfTexts);
        console.log(files);
        console.log("array pdf tables: " + pdfTexts[0]);
        console.log(typeof pdfTexts[0]);

    }

    const handleEditClick = (tableIndex: number, rowIndex: number) => {
        setEditingRow({ tableIndex, rowIndex });
    };

    const handleSaveClick = () => {
        // Add logic to save the changes
        setEditingRow(null);
    };

    const handleCancelClick = () => {
        setEditingRow(null);
    };


    const handleDeleteClick = (tableIndex: number, param2: any) => {

    }

    return <>
        <FilesUpload onAddFiles={handleChangeOnFilesUpload}/>

        {pdfTexts.map((file, index) => (
        <div key={index}>


            {/*<h3>Uploaded File {index + 1}</h3>*/}
            {/*<PdfTextOnly file={file} />*/}

            {/*
            <div>
                <h3>Extracted Text from File {index + 1}</h3>
                <pre>{pdfTexts[index]}</pre>
            </div>
            */}

            {/* preview od pdf
            <PDFViewer file={file}/>*/}


        </div>
        ))}



        {/*
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
        */}


        {pdfTexts.map((pdf, pdfIndex) => (
            <div  key={pdfIndex}>

                <h3>{pdfIndex+1} PDF Document</h3>
                {pdf.map((table, tableIndex) => (

                    <div key={tableIndex} className="overflow-x-auto">
                        <h4>{tableIndex+1} Table</h4>

                        <Table className="table-auto w-full border rounded-lg overflow-hidden">
                            <Table.Head >

                                {table[0].map((cell, cellIndex) => (
                                    <Table.HeadCell key={cellIndex} className="bg-blue-300">{cell}</Table.HeadCell>
                                ))}
                                <Table.HeadCell className="bg-blue-300">
                                    {/* <span className="sr-only">Edit</span>*/}
                                    {editingRow && editingRow.tableIndex === tableIndex && editingRow.rowIndex === 0 ? (
                                        <>
                                            <button onClick={handleSaveClick} className="mr-2">
                                                <FaSave className="text-blue-100" />
                                            </button>
                                            <button onClick={handleCancelClick}>
                                                <FaTimes className="text-red-600" />
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEditClick(tableIndex, 0)} className="font-medium text-sm text-white hover:underline dark:text-cyan-500 ">
                                            Edit
                                        </button>
                                    )}
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {/*Imamo rowIndex +1 ker delamo slice(1) in tako zgubimo prvo row od tabele, ki je dejansko gor prikazan*/}
                                {table.slice(1).map((row, rowIndex) => (


                                    <Table.Row key={rowIndex+1} className="bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                                        {row.map((cell, cellIndex) => (
                                            <Table.Cell key={cellIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {cell}
                                            </Table.Cell>
                                        ))}
                                        {/*
                                        <Table.Cell>
                                            <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                                Edit
                                            </a>
                                        </Table.Cell>*/}

                                        <Table.Cell>
                                            {editingRow && editingRow.tableIndex === tableIndex && editingRow.rowIndex === rowIndex +1 ? (
                                                <>
                                                    <button onClick={handleSaveClick} className="mr-2 ">
                                                        <FaSave className="text-blue-100" />
                                                    </button>
                                                    <button onClick={handleCancelClick}>
                                                        <FaTimes className="text-red-600" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleEditClick(tableIndex, rowIndex + 1)} className="font-medium text-white hover:underline dark:text-cyan-500 w-16 h-10">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(tableIndex, rowIndex + 1)} className="font-medium bg-red-700 text-white hover:underline dark:text-cyan-500">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <br/>
                    </div>

                ))}
                <br/>
            </div>
        ))}

    </>
}

