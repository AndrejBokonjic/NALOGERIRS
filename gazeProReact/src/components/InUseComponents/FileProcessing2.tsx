import { FilesUpload } from "./FilesUpload.tsx";
import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { FaSave, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "./PopUpDeleteRowConformation.tsx";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {content} from "flowbite-react/dist/types/tailwind";

export const FileProcessing2 = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array[]>([]);
    const [pdfCategories, setPdfCategories] = useState<string[]>([]);
    const [editingCell, setEditingCell] = useState<{
        pdfIndex: number;
        tableIndex: number;
        rowIndex: number;
        cellIndex: number;
    } | null>(null);
    const [cellValue, setCellValue] = useState<string>("");
    const [initialCellValues, setInitialCellValues] = useState<{
        [key: string]: string;
    }>({});

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<{
        pdfIndex: number;
        tableIndex: number;
        rowIndex: number;
    } | null>(null);

    const [showInsertTable, setShowInsertTable] = useState(false);

    const handleChangeOnFilesUpload = (filesUpload: File[]) => {
        console.log(filesUpload);
        setFiles((prevFiles) => [...prevFiles, ...filesUpload]);

        filesUpload.forEach((file) => {
            const filePath = file.path;
            window.electron.ipcRenderer.send("process-pdf", filePath);
            window.electron.ipcRenderer.send("categorize-pdf", filePath);
        });
    };

    useEffect(() => {
        window.electron.ipcRenderer.on("pdf-processed", (event, data) => {
            console.log("response:" + data);
            setPdfTexts((prevTexts) => [...prevTexts, data]);
        });

        window.electron.ipcRenderer.on("pdf-categorized", (event, data) => {
            setPdfCategories((prevCategories) => [...prevCategories, data]);
            console.log("response new categories: " + data);
        });

        return () => {
            window.electron.ipcRenderer.removeAllListeners("pdf-processed");
            window.electron.ipcRenderer.removeAllListeners("pdf-categorized");
        };
    }, []);

    const handleCancelClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        setEditingCell(null);

        setPdfTexts((prevPdfTexts) => {
            const updatedPdfTexts = [...prevPdfTexts];
            const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${editingCell!.cellIndex}`;
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][editingCell!.cellIndex] = initialCellValues[key];
            return updatedPdfTexts;
        });
        console.log("editingCell!.cellIndex: " + editingCell!.cellIndex);
        console.log("initial cell values: " + initialCellValues[`${pdfIndex}-${tableIndex}-${rowIndex}-${editingCell!.cellIndex}`]);
        setInitialCellValues({});
    };

    const handleCellClick = (pdfIndex: number, tableIndex: number, rowIndex: number, cellIndex: number, value: string) => {
        const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${cellIndex}`;
        if (!(key in initialCellValues)) {
            setInitialCellValues({
                [key]: value,
            });
            console.log("Updated initial cell values:", initialCellValues);
        }
        setEditingCell({ pdfIndex, tableIndex, rowIndex, cellIndex });
        setCellValue(value);
    };

    console.log(JSON.stringify(initialCellValues, null, 2));

    const handleCellChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        pdfIndex: number,
        tableIndex: number,
        rowIndex: number,
        cellIndex: number
    ) => {
        const updatedValue = event.target.value;
        setCellValue(updatedValue);
        console.log("handleCellChange: " + event.target.value);

        setPdfTexts((prevPdfTexts) => {
            const updatedPdfTexts = [...prevPdfTexts];
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][cellIndex] = updatedValue;
            return updatedPdfTexts;
        });
    };

    const handleDeleteClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        setRowToDelete({ pdfIndex, tableIndex, rowIndex });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (rowToDelete) {
            const { pdfIndex, tableIndex, rowIndex } = rowToDelete;
            setPdfTexts((prevPdfTexts) => {
                const updatedPdfTexts = prevPdfTexts.map((pdf, pIndex) =>
                    pIndex === pdfIndex
                        ? pdf.map((table, tIndex) =>
                            tIndex === tableIndex ? table.filter((_, rIndex) => rIndex !== rowIndex) : table
                        )
                        : pdf
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

    const handleCreateTableClick = (pdfIndex) => {
        setShowInsertTable(true);
        const newTable = [
            ["DIFFICULTY", "TIME ON TARGET", "UNDERSHOOT", "OVERSHOOTS", "AMPLITUDE ACCURACY"],
            ["Easy", "", "", "", ""],
            ["Medium", "", "", "", ""],
            ["Difficult", "", "", "", ""],
        ];
        setPdfTexts((prevPdfTexts) => {
            const updatedPdfTexts = [...prevPdfTexts];
            updatedPdfTexts[pdfIndex] = [...updatedPdfTexts[pdfIndex], newTable];
            return updatedPdfTexts;
        });
    };

    const handleRemoveTable = (pdfIndex, tableIndex) => {
        setPdfTexts((prevPdfTexts) => {
            const updatedPdfTexts = [...prevPdfTexts];
            updatedPdfTexts[pdfIndex].splice(tableIndex, 1);
            return updatedPdfTexts;
        });
    };

    const handleDeletePdf = (pdfIndex) => {
        setPdfTexts((prevPdfTexts) => prevPdfTexts.filter((_, pIndex) => pIndex !== pdfIndex));
        setPdfCategories((prevCategories) => prevCategories.filter((_, cIndex) => cIndex !== pdfIndex));
    };

    return (
        <>
            <FilesUpload onAddFiles={handleChangeOnFilesUpload} />

            {pdfTexts.map((file, index) => (
                <div key={index}></div>
            ))}

            {pdfTexts.map((pdf, pdfIndex) => (
                <div key={pdfIndex}>
                    <h3>
                        {pdfIndex + 1} PDF name: {pdfCategories[pdfIndex]}
                        <button onClick={() => handleDeletePdf(pdfIndex)} className="bg-red-700 text-sm ml-2">
                            <MdDelete className="text-white h-4 w-4"/>
                        </button>
                    </h3>
                    {pdf.map((table, tableIndex) => (
                        <div key={tableIndex} className="overflow-x-auto">
                            <Popup
                                trigger={
                                    <div>
                                        <h4>{tableIndex + 1} Table</h4>
                                        <Table className="table-auto w-full border rounded-lg overflow-hidden">
                                            <Table.Head>
                                                {table[0].map((cell, cellIndex) => (
                                                    <Table.HeadCell key={cellIndex} className="bg-blue-300">
                                                        {cell}
                                                    </Table.HeadCell>
                                                ))}
                                                <Table.HeadCell className="bg-blue-300">Actions</Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                {table.slice(1).map((row, rowIndex) => (
                                                    <Table.Row key={rowIndex + 1}
                                                               className="bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                                                        {row.map((cell: string, cellIndex: number) => (
                                                            <Table.Cell
                                                                key={cellIndex}
                                                                className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                                                                onClick={() => handleCellClick(pdfIndex, tableIndex, rowIndex + 1, cellIndex, cell)}
                                                            >
                                                                {editingCell &&
                                                                editingCell.pdfIndex === pdfIndex &&
                                                                editingCell.tableIndex === tableIndex &&
                                                                editingCell.rowIndex === rowIndex + 1 &&
                                                                editingCell.cellIndex === cellIndex ? (
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
                                                            {editingCell &&
                                                            editingCell.pdfIndex === pdfIndex &&
                                                            editingCell.tableIndex === tableIndex &&
                                                            editingCell.rowIndex === rowIndex + 1 ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleCancelClick(pdfIndex, tableIndex, rowIndex + 1)}
                                                                        className="text-base">
                                                                        <FaTimes className="text-red-600 "/>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleDeleteClick(pdfIndex, tableIndex, rowIndex + 1)}
                                                                        className="bg-red-700 text-sm">
                                                                        <MdDelete className="text-white h-4 w-4"/>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                }
                                position="right center"
                                closeOnDocumentClick
                                contentStyle={{
                                    margin: "auto",
                                    background: "transparent",
                                    width: "50%",
                                    padding: "1px",
                                    border: "none"
                                }}

                            >
                                <div>
                                    <button
                                        onClick={() => handleRemoveTable(pdfIndex, tableIndex)}
                                        className="text-red-600 hover:text-white border border-red-500 hover:bg-red-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    >
                                        Odstrani tabelo
                                    </button>
                                </div>
                            </Popup>
                            <br/>
                        </div>
                    ))}

                    <button
                        onClick={() => handleCreateTableClick(pdfIndex)}
                        type="button"
                        className="text-gray-300 hover:text-white border border-gray-500 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                    >
                        Ustvari tabelo
                    </button>
                </div>
            ))}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onRequestClose={handleCancelDelete}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
            />
        </>
    );
};
