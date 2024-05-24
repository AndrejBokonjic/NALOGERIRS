import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { FaSave, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { FilesUpload } from "../InUseComponents/FilesUpload.tsx";

export const TestAddTableFileProcessing = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array<any>>([]);
    const [editingCell, setEditingCell] = useState<{ pdfIndex: number, tableIndex: number, rowIndex: number, cellIndex: number } | null>(null);
    const [cellValue, setCellValue] = useState<string>("");
    const [initialCellValues, setInitialCellValues] = useState<{ [key: string]: string }>({});

    const handleChangeOnFilesUpload = (filesUpload: File[]) => {
        console.log(filesUpload);
        setFiles(prevFiles => [...prevFiles, ...filesUpload]);
        filesUpload.forEach(file => {
            const filePath = file.path;
            window.electron.ipcRenderer.send('process-pdf', filePath);
        });
    }

    useEffect(() => {
        window.electron.ipcRenderer.on('pdf-processed', (event, data) => {
            console.log("response:" + data);
            setPdfTexts(prevTexts => [...prevTexts, data]);
        });
        return () => {
            window.electron.ipcRenderer.removeAllListeners('pdf-processed');
        };
    }, []);

    const handleCancelClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        setEditingCell(null);
        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = [...prevPdfTexts];
            const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${editingCell!.cellIndex}`;
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][editingCell!.cellIndex] = initialCellValues[key];
            return updatedPdfTexts;
        });
        setInitialCellValues({});
    };

    const handleCellClick = (pdfIndex: number, tableIndex: number, rowIndex: number, cellIndex: number, value: string) => {
        const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${cellIndex}`;
        if (!(key in initialCellValues)) {
            setInitialCellValues({
                ...initialCellValues,
                [key]: value
            });
        }
        setEditingCell({ pdfIndex, tableIndex, rowIndex, cellIndex });
        setCellValue(value);
    };

    const handleCellChange = (event: React.ChangeEvent<HTMLInputElement>, pdfIndex: number, tableIndex: number, rowIndex: number, cellIndex: number) => {
        const updatedValue = event.target.value;
        setCellValue(updatedValue);
        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = [...prevPdfTexts];
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][cellIndex] = updatedValue;
            return updatedPdfTexts;
        });
    };

    const handleDeleteClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = prevPdfTexts.map((pdf, pIndex) =>
                pIndex === pdfIndex ? pdf.map((table, tIndex) =>
                    tIndex === tableIndex ? table.filter((_, rIndex) => rIndex !== rowIndex) : table
                ) : pdf
            );
            return updatedPdfTexts;
        });
    };

    const handleAddRow = (pdfIndex: number, tableIndex: number, rowIndex: number, position: 'above' | 'below') => {
        const newRow = Array(pdfTexts[pdfIndex][tableIndex][0].length).fill('');
        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = [...prevPdfTexts];
            const updatedTable = [...updatedPdfTexts[pdfIndex][tableIndex]];
            const insertIndex = position === 'above' ? rowIndex : rowIndex + 1;
            updatedTable.splice(insertIndex, 0, newRow);
            updatedPdfTexts[pdfIndex][tableIndex] = updatedTable;
            return updatedPdfTexts;
        });
    };

    const handleAddTable = (pdfIndex: number) => {
        const newTable = [
            ["Header 1", "Header 2", "Header 3"],
            ["New Row", "New Data", "New Data"]
        ];
        setPdfTexts(prevPdfTexts => {
            const updatedPdfTexts = [...prevPdfTexts];
            updatedPdfTexts[pdfIndex] = [...updatedPdfTexts[pdfIndex], newTable];
            return updatedPdfTexts;
        });
    };

    return (
        <>

            <FilesUpload onAddFiles={handleChangeOnFilesUpload} />
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
                                            {row.map((cell: string, cellIndex: number) => (
                                                <Table.Cell
                                                    key={cellIndex}
                                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                                                    onClick={() => handleCellClick(pdfIndex, tableIndex, rowIndex + 1, cellIndex, cell)}
                                                >
                                                    {editingCell && editingCell.pdfIndex === pdfIndex && editingCell.tableIndex === tableIndex && editingCell.rowIndex === rowIndex + 1 && editingCell.cellIndex === cellIndex ? (
                                                        <input
                                                            type="text"
                                                            value={cellValue}
                                                            onChange={(e) => handleCellChange(e, pdfIndex, tableIndex, rowIndex + 1, cellIndex)}
                                                            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        />
                                                    ) : (
                                                        cell
                                                    )}
                                                </Table.Cell>
                                            ))}
                                            <Table.Cell>
                                                {editingCell && editingCell.pdfIndex === pdfIndex && editingCell.tableIndex === tableIndex && editingCell.rowIndex === rowIndex + 1 ? (
                                                    <>
                                                        <button onClick={() => handleCancelClick(pdfIndex, tableIndex, rowIndex + 1)} className="text-base">
                                                            <FaTimes className="text-red-600" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleDeleteClick(pdfIndex, tableIndex, rowIndex + 1)} className="bg-red-700 text-sm">
                                                            <MdDelete className="text-white" />
                                                        </button>
                                                        <button onClick={() => handleAddRow(pdfIndex, tableIndex, rowIndex + 1, 'above')} className="bg-green-700 text-sm">
                                                            Add Row Above
                                                        </button>
                                                        <button onClick={() => handleAddRow(pdfIndex, tableIndex, rowIndex + 1, 'below')} className="bg-blue-700 text-sm">
                                                            Add Row Below
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
                    <button onClick={() => handleAddTable(pdfIndex)} className="bg-blue-700 text-sm text-white py-1 px-2 rounded">
                        Add Table
                    </button>
                    <br />
                </div>
            ))}
        </>
    );
}
