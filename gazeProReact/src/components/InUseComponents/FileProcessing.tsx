import { FilesUpload } from "./FilesUpload.tsx";
import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { FaSave, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "./PopUpDeleteRowConformation.tsx";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {LoadingAnimation} from "./LoadingAnimation.tsx";

import {extractButterflyTestData} from "./ExtractButterflyTestData.tsx";
import {extractHeadNeckTestData} from "./ExtractHeadNeckTestData.tsx";


export const FileProcessing = () => {
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
    const [contextMenuVisible, setContextMenuVisible] = useState<{
        visible: boolean;
        pdfIndex: number | null;
        tableIndex: number | null;
        x: number;
        y: number;
    }>({ visible: false, pdfIndex: null, tableIndex: null, x: 0, y: 0 });

    const handleChangeOnFilesUpload = (filesUpload: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...filesUpload]);

        filesUpload.forEach((file) => {
            const filePath = file.path;
            window.electron.ipcRenderer.send("process-pdf", filePath);
            window.electron.ipcRenderer.send("categorize-pdf", filePath);
        });
    };

    useEffect(() => {
        //pridobimo tabele iz pdf
        window.electron.ipcRenderer.on("pdf-processed", (event, data) => {
            setPdfTexts((prevTexts) => [...prevTexts, data]);
        });
        // pridobimo imena pdf
        window.electron.ipcRenderer.on("pdf-categorized", (event, data) => {
            setPdfCategories((prevCategories) => [...prevCategories, data]);
        });
        // pridobimo rezultate (napoved) butterfly modela
        window.electron.ipcRenderer.on('butterfly-model-response', (event, data) => {
            // shranimo rezultat napoveda
        })
        window.electron.ipcRenderer.on('head-neck-model-response', (event, data) => {
            // shranimo rezultat napoveda
        })


        return () => {
            window.electron.ipcRenderer.removeAllListeners("pdf-processed");
            window.electron.ipcRenderer.removeAllListeners("pdf-categorized");
            window.electron.ipcRenderer.removeAllListeners('butterfly-model-response');
            window.electron.ipcRenderer.removeAllListeners('head-neck-model-response');
        };
    }, []);

    const handleCancelClick = (pdfIndex: number, tableIndex: number, rowIndex: number) => {
        setEditingCell(null);
        setPdfTexts((prevPdfTexts) => {
            const updatedPdfTexts = [...prevPdfTexts];
            const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${editingCell!.cellIndex}`;
            updatedPdfTexts[pdfIndex][tableIndex][rowIndex][editingCell!.cellIndex] =
                initialCellValues[key];
            return updatedPdfTexts;
        });
        setInitialCellValues({});
    };

    const handleCellClick = (
        pdfIndex: number,
        tableIndex: number,
        rowIndex: number,
        cellIndex: number,
        value: string
    ) => {
        const key = `${pdfIndex}-${tableIndex}-${rowIndex}-${cellIndex}`;
        if (!(key in initialCellValues)) {
            setInitialCellValues({
                [key]: value,
            });
        }
        setEditingCell({ pdfIndex, tableIndex, rowIndex, cellIndex });
        setCellValue(value);
    };

    const handleCellChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        pdfIndex: number,
        tableIndex: number,
        rowIndex: number,
        cellIndex: number
    ) => {
        const updatedValue = event.target.value;
        setCellValue(updatedValue);

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
                            tIndex === tableIndex
                                ? table.filter((_, rIndex) => rIndex !== rowIndex)
                                : table
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
        const newButterflyTestTable = [
            ["DIRECTIONALACCURACY", "", "","", "AMPLITUDE ACCURACY"],
            ["DifficultyLevel", "TimeonTarget", "Undershoots", "Overshoots", "Mean"],
            ["Easy", "", "", "", ""],
            ["Medium", "", "", "", ""],
            ["Difficult", "", "", "", ""],
        ];

        const newHeadNeckRelocationTestTable = [
            ["RELOCATION FROM", "ABSOLUTE ERROR°", "CONSTANT ERROR°", "VARIABLE ERROR°"],
            ["Turning Left","", "", ""],
            ["TurningRight" ,"", "", ""],
            ["Forward Bending", "", "", ""],
            ["BackwardBending","", "", ""],
        ];
        switch (pdfCategories[pdfIndex]){
            case "Butterfly test":
                setPdfTexts((prevPdfTexts) => {
                    const updatedPdfTexts = [...prevPdfTexts];
                    updatedPdfTexts[pdfIndex] = [...updatedPdfTexts[pdfIndex], newButterflyTestTable];
                    return updatedPdfTexts;
                });
                break;
            case "Head neck relocation test":
                setPdfTexts((prevPdfTexts) => {
                    const updatedPdfTexts = [...prevPdfTexts];
                    updatedPdfTexts[pdfIndex] = [...updatedPdfTexts[pdfIndex], newHeadNeckRelocationTestTable];
                    return updatedPdfTexts;
                });
                break;
        }
    };



    const handleRemoveTable = (pdfIndex, tableIndex) => {
        setPdfTexts((prevPdfTexts) => {
            const updatedPdfTexts = prevPdfTexts.map((pdf, pIndex) =>
                pIndex === pdfIndex
                    ? pdf.filter((_, tIndex) => tIndex !== tableIndex)
                    : pdf
            );
            return updatedPdfTexts;
        });
    }

    const handleContextMenu = (event, pdfIndex, tableIndex) => {
        event.preventDefault();
        setContextMenuVisible({
            visible: true,
            pdfIndex,
            tableIndex,
            x: event.clientX + window.scrollX,
            y: event.clientY + window.scrollY,
        });
        document.addEventListener('click', handleDocumentClick);
    };

    const handleDocumentClick = () => {
        closeContextMenu();
    };

    const closeContextMenu = () => {
        setContextMenuVisible({ visible: false, pdfIndex: null, tableIndex: null, x: 0, y: 0 });
        document.removeEventListener('click', handleDocumentClick);
    };

    const handleDeletePdf = (pdfIndex) => {
        setPdfTexts((prevPdfTexts) => prevPdfTexts.filter((_, pIndex) => pIndex !== pdfIndex));
        setPdfCategories((prevCategories) => prevCategories.filter((_, cIndex) => cIndex !== pdfIndex));

        setFiles((prevFiles) => prevFiles.filter((_, fIndex) => fIndex !== pdfIndex));
    };

    const [pdfErrors, setPdfErrors]
        = useState<Array<{pdfIndex: number, errors:string[]}>>([]);

    const handleDobiSporocilo = (pdfIndex) => {
        const tabele = pdfTexts[pdfIndex];
    
        switch (pdfCategories[pdfIndex]) {
            case 'Butterfly test':
                const {result, errors} = extractButterflyTestData(tabele);
                console.log('POSLJI V BUTTEFLY TEST', result);
                console.log("NAPAKE: ", errors);

                setPdfErrors(prevPdfErrors => {
                    const updatedPdfErrors =
                        prevPdfErrors.filter(errorObject => errorObject.pdfIndex !== pdfIndex);
                    if (errors.length >0){
                        updatedPdfErrors.push({pdfIndex, errors});
                    }
                    return updatedPdfErrors;
                })

                if (errors.length ===0 ){
                    window.electron.ipcRenderer.send('send-table-to-butterfly-model', result);
                }
                break;
            case 'Head neck relocation test':
                const extractedData2 = extractHeadNeckTestData(tabele);
                console.log('POSLJI V HEAD-NECK TEST', extractedData2);
                window.electron.ipcRenderer.send('send-table-to-head-neck-model', extractedData2);
                break;
            case 'Range of motion':
                console.log("posji range of motion");
                break;
        }
    };


    return (
        <>
            <FilesUpload onAddFiles={handleChangeOnFilesUpload} />


            {pdfTexts.map((file, index) => (
                <div key={index}></div>
            ))}



            {files.length !== pdfTexts.length ? (
                <LoadingAnimation/>
            ): (
            <div>
            {pdfTexts.map((pdf, pdfIndex) => (
                <div key={pdfIndex}>
                    <h3>
                        {pdfIndex + 1} PDF name: {pdfCategories[pdfIndex]}
                        <button onClick={() => handleDeletePdf(pdfIndex)} className="bg-red-700 text-sm ml-2">
                            <MdDelete className="text-white h-4 w-4"/>
                        </button>
                    </h3>
                    {pdf.map((table, tableIndex) => (
                        <div
                            key={tableIndex}
                            className="overflow-x-auto"
                            onContextMenu={(e) => handleContextMenu(e, pdfIndex, tableIndex)}
                        >
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
                                        <Table.Row
                                            key={rowIndex + 1}
                                            className="bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
                                        >
                                            {row.map((cell: string, cellIndex: number) => (
                                                <Table.Cell
                                                    key={cellIndex}
                                                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                                                    onClick={() =>
                                                        handleCellClick(
                                                            pdfIndex,
                                                            tableIndex,
                                                            rowIndex + 1,
                                                            cellIndex,
                                                            cell
                                                        )
                                                    }
                                                >
                                                    {editingCell &&
                                                    editingCell.pdfIndex === pdfIndex &&
                                                    editingCell.tableIndex === tableIndex &&
                                                    editingCell.rowIndex === rowIndex + 1 &&
                                                    editingCell.cellIndex === cellIndex ? (
                                                        <input
                                                            type="text"
                                                            value={cellValue}
                                                            onChange={(e) =>
                                                                handleCellChange(
                                                                    e,
                                                                    pdfIndex,
                                                                    tableIndex,
                                                                    rowIndex + 1,
                                                                    cellIndex
                                                                )
                                                            }
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
                                                            onClick={() =>
                                                                handleCancelClick(pdfIndex, tableIndex, rowIndex + 1)
                                                            }
                                                            className="text-base"
                                                        >
                                                            <FaTimes className="text-red-600 " />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteClick(pdfIndex, tableIndex, rowIndex + 1)
                                                            }
                                                            className="bg-red-700 text-sm"
                                                        >
                                                            <MdDelete className="text-white h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>

                            {contextMenuVisible.visible &&
                                contextMenuVisible.pdfIndex === pdfIndex &&
                                contextMenuVisible.tableIndex === tableIndex && (
                                    <div
                                        className="absolute  rounded  p-2"
                                        // *  bg-white border*/}
                                        style={{ top: contextMenuVisible.y, left: contextMenuVisible.x }}
                                        onClick={closeContextMenu}
                                    >
                                        <button
                                            onClick={() => handleRemoveTable(pdfIndex, tableIndex)}
                                            className="text-red-600 hover:text-white border
                                            border-red-500 hover:bg-red-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                            Zbrisi tabelo
                                        </button>
                                    </div>
                                )}

                            {tableIndex < pdf.length-1 && <br />}

                        </div>
                    ))}
                    <br/>

                    <div className="flex justify-between mb-2">
                    <button
                        onClick={() => handleCreateTableClick(pdfIndex)}
                        type="button"
                        className="text-gray-400  hover:text-white border border-gray-500 hover:bg-gray-900
                        font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-500
                         dark:hover:text-white dark:hover:bg-gray-600 "
                    >
                        Ustvari tabelo
                    </button>

                    <button type="button" onClick={() => handleDobiSporocilo(pdfIndex)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                             focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex
                              items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Dobi sporočilo
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>
                    </div>

                    {/*{pdfErrors[pdfIndex].pdfIndex == pdfIndex && (*/}
                    {/*    pdfErrors[pdfIndex].errors.map(error => {*/}
                    {/*        <p>{error}</p>*/}
                    {/*    })*/}
                    {/*)}*/}
                    {pdfErrors
                        .filter(errorObject => errorObject.pdfIndex === pdfIndex)
                        .map((errorObject, errorIndex) => (
                        <div key={errorIndex}>
                            <h2 className="font-bold text-red-500 text-lg mb-2">Popravite naslednje napake v tabeli, preden poskusite znova: </h2>
                            {errorObject.errors.map((error, errorIndex) => (
                                    <p key={errorIndex}>{error}</p>
                                ))}
                            <br/>
                        </div>

                    ))}



                </div>
            ))}

            </div>

            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onRequestClose={handleCancelDelete}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
            />
        </>
    );
};