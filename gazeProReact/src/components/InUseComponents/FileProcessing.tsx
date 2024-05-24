import {FilesUpload} from "./FilesUpload.tsx";
//import {PdfTextOnly} from "./PdfTextOnly.tsx";
import React, {useEffect, useState} from "react";
import {Table} from "flowbite-react";
import "flowbite/dist/flowbite.css";
import Modal from 'react-modal';
import { FaSave, FaTimes } from "react-icons/fa";
//import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";




export const FileProcessing = () => {

    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array[]>([]);

    const [editingCell, setEditingCell] = useState<{pdfIndex:number, tableIndex: number; rowIndex: number; cellIndex: number } | null>(null);
    const [cellValue, setCellValue] = useState<string>("");
    //const [cellIndexClicked, setCellIndexClicked] = useState<number>();

    //const [initialCellValue, setInitialCellValue] = useState<string>("")
    const [initialCellValues, setInitialCellValues] = useState<{ [key: string]: string }>({});

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<{ pdfIndex: number, tableIndex: number, rowIndex: number } | null>(null);



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

    /*
    if (pdfTexts.length>0){
        console.log("TEST TEST");
        console.log(pdfTexts);
        console.log(files);
        console.log("array pdf tables: " + pdfTexts[0]);
        console.log(typeof pdfTexts[0]);
    }*/

    /*
    const handleEditClick = (tableIndex: number, rowIndex: number) => {
        setEditingRow({ tableIndex, rowIndex });
    };
    const handleSaveClick = () => {
        // Add logic to save the changes
        setEditingCell(null);
    };*/
    const handleCancelClick = (pdfIndex:number, tableIndex:number, rowIndex:number) => {
        setEditingCell(null);

        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = [...prevPdfTexts];
            const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${editingCell!.cellIndex}`;
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][editingCell!.cellIndex] = initialCellValues[key];
            return updatedPdfTexts;
        });
        console.log("editingCell!.cellIndex: "+ editingCell!.cellIndex);
        console.log("initial cell values: "+   initialCellValues[`${pdfIndex}-${tableIndex}-${rowIndex}-${editingCell!.cellIndex}`]);
        setInitialCellValues({});
    };

    const handleCellClick = (pdfIndex: number, tableIndex: number, rowIndex: number, cellIndex: number, value: string) => {
        const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${cellIndex}`;
        if (!(key in initialCellValues)) {
            setInitialCellValues({
                [key]: value
            });
            console.log("Updated initial cell values:", initialCellValues);
        }
        setEditingCell({pdfIndex, tableIndex, rowIndex, cellIndex });
        setCellValue(value);

        /*
        if (editingCell == null) {
            setInitialCellValue(value);
        }*/
    };

    console.log(JSON.stringify(initialCellValues, null, 2));

    const handleCellChange = (event: React.ChangeEvent<HTMLInputElement>, pdfIndex:number, tableIndex:number, rowIndex:number,cellIndex:number) => {
        const updatedValue = event.target.value;
        setCellValue(updatedValue);
        console.log("handleCellChange: "+ event.target.value);

        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = [...prevPdfTexts];
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][cellIndex] = updatedValue;
            return updatedPdfTexts;
        });
    };

    //const [deletedRows, setDeletedRows] = useState<Set<string>>(new Set());

    /*
    const handleDeleteClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        // const rowKey = `${pdfIndex}-${tableIndex}-${rowIndex}`;
        // if (deletedRows.has(rowKey)) {
        //     return;
        // }
        //
        // setDeletedRows(new Set());

        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = prevPdfTexts.map((pdf, pIndex) =>
                pIndex === pdfIndex ? pdf.map((table, tIndex) =>
                    tIndex === tableIndex ? table.filter((_, rIndex) => rIndex !== rowIndex) : table
                ) : pdf
            );

            return updatedPdfTexts;
        });
    };*/
    const handleDeleteClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        setRowToDelete({ pdfIndex, tableIndex, rowIndex });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (rowToDelete) {
            const { pdfIndex, tableIndex, rowIndex } = rowToDelete;
            setPdfTexts(prevPdfTexts => {
                const updatedPdfTexts = prevPdfTexts.map((pdf, pIndex) =>
                    pIndex === pdfIndex ? pdf.map((table, tIndex) =>
                        tIndex === tableIndex ? table.filter((_, rIndex) => rIndex !== rowIndex) : table
                    ) : pdf
                );
                return updatedPdfTexts;
            });
            setIsDeleteModalOpen(false);
            setRowToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setRowToDelete(null);
    };


    console.log(pdfTexts);

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



        {pdfTexts.map((pdf, pdfIndex) => (
            <div key={pdfIndex}>
                <h3>{pdfIndex + 1} PDF Document</h3>
                {pdf.map((table, tableIndex) => (
                    <div key={tableIndex} className="overflow-x-auto">
                        <h4>{tableIndex + 1} Table</h4>
                        <Table className="table-auto w-full border rounded-lg overflow-hidden">


                            <Table.Head>
                                {table[0].map((cell, cellIndex) => (
                                    <Table.HeadCell key={cellIndex} className="bg-blue-300">{cell}</Table.HeadCell>
                                ))}
                                <Table.HeadCell className="bg-blue-300">Actions</Table.HeadCell>
                            </Table.Head>


                            <Table.Body className="divide-y">
                                {table.slice(1).map((row, rowIndex) => (
                                    <Table.Row key={rowIndex + 1} className="bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                                        {row.map((cell:string, cellIndex:number) => (
                                            <Table.Cell
                                                key={cellIndex}
                                                className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                                                onClick={() => handleCellClick(pdfIndex,tableIndex, rowIndex + 1, cellIndex, cell)}
                                            >
                                                {editingCell && editingCell.pdfIndex===pdfIndex && editingCell.tableIndex === tableIndex && editingCell.rowIndex === rowIndex + 1 && editingCell.cellIndex === cellIndex ? (
                                                    <input
                                                        type="text"
                                                        value={cellValue}
                                                        onChange={(e) => handleCellChange(e, pdfIndex, tableIndex, rowIndex+1, cellIndex)}
                                                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                ) : (
                                                    cell
                                                )}
                                            </Table.Cell>
                                        ))}
                                        <Table.Cell>
                                            {editingCell && editingCell.pdfIndex === pdfIndex && editingCell.tableIndex === tableIndex && editingCell.rowIndex === rowIndex + 1  ? (
                                                <>
                                                    <button onClick={() => handleCancelClick(pdfIndex, tableIndex, rowIndex +1)} className="text-base">
                                                        <FaTimes className="text-red-600" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleDeleteClick(pdfIndex, tableIndex, rowIndex + 1)} className="bg-red-700 text-sm">
                                                        <MdDelete className="text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>


                        </Table>
                        <br />
                    </div>
                ))}
                <br />
            </div>
        ))}
        
        <Modal className="fixed inset-0 flex items-center justify-center" ariaHideApp={false} isOpen={isDeleteModalOpen} onRequestClose={handleCancelDelete} style={{
            content: {
                background: 'none',
                border: 'none',
                padding: 0,
            }
        }} >

            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={handleCancelDelete} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this row?</h3>
                        <button onClick={handleConfirmDelete} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                            Yes, I'm sure
                        </button>
                        <button onClick={handleCancelDelete} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                    </div>
                </div>
            </div>
        </Modal>

    </>
}

