import {FilesUpload} from "./FilesUpload.tsx";
//import {PdfTextOnly} from "./PdfTextOnly.tsx";
import React, {useEffect, useState} from "react";
import {Table} from "flowbite-react";
import "flowbite/dist/flowbite.css";
import Modal from 'react-modal';
import { FaSave, FaTimes } from "react-icons/fa";
//import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "./PopUpDeleteRowConformation.tsx";




export const FileProcessing = () => {

    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array[]>([]);
    const [pdfCategories, setPdfCategories] = useState<string[]>([]);

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
            window.electron.ipcRenderer.send('categorize-pdf', filePath);
        });
    }

    useEffect(() => {
        window.electron.ipcRenderer.on('pdf-processed', (event, data) => {
            console.log("response:" + data);
            //const parsedData = JSON.parse(data);
            setPdfTexts(prevTexts => [...prevTexts, data]);
        });

        window.electron.ipcRenderer.on('pdf-categorized', (event, data) => {
            setPdfCategories(prevCategories => [...prevCategories, data]);

            console.log("response new categories: "+ data);
        })

        // Clean up the listener on component unmount
        return () => {
            window.electron.ipcRenderer.removeAllListeners('pdf-processed');
            window.electron.ipcRenderer.removeAllListeners('pdf-categorized');
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
                <h3>{pdfIndex + 1} PDF name: {pdfCategories[pdfIndex]}</h3>
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

        <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onRequestClose={handleCancelDelete}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
        />

    </>
}

