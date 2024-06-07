import { FilesUpload } from "./FilesUpload.tsx";
import React, { useEffect, useState } from "react";
import { Table, TableHead } from "flowbite-react";
import "flowbite/dist/flowbite.css";
import { FaSave, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "./PopUpDeleteRowConformation.tsx";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {LoadingAnimation} from "./LoadingAnimation.tsx";

import {extractButterflyTestData} from "./ExtractButterflyTestData.tsx";
import {extractButterflyTestDataPdfTwo} from "./ExtractButterflyTestDataPdfTwo.tsx";
import {extractHeadNeckTestData} from "./ExtractHeadNeckTestData.tsx";


interface CustomFile extends File{
    path: string,
}


export const FileProcessing = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [pdfTexts, setPdfTexts] = useState<Array<Array<Array<Array<string>>>>>([]);

    const [pdfCategories, setPdfCategories] = useState<string[]>([]);
    const [patientName, setPatientName] = useState<string[]>([]);

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
            const filePath = (file as CustomFile).path;
            window.electron.ipcRenderer.send("process-pdf", filePath);
            window.electron.ipcRenderer.send("pdf-model-type-and-patient-name", filePath);
        });
    };


    //const [pdfData, setPdfData] = useState(null);
    useEffect(() => {
        //pridobimo tabele iz pdf
        window.electron.ipcRenderer.on("pdf-processed", (event, data) => {

            console.log(data);

            setPdfTexts((prevTexts) => [...prevTexts, data]);
        });
        // pridobimo imena pdf
        window.electron.ipcRenderer.on("pdf-categorized-and-patient-name", (event, data) => {

            const {category, patient_name} = data;

            setPdfCategories((prevCategories) => [...prevCategories, category]);
            setPatientName(prevPatientName => [...prevPatientName, patient_name]);
        });


        return () => {
            window.electron.ipcRenderer.removeAllListeners("pdf-processed");
            window.electron.ipcRenderer.removeAllListeners("pdf-categorized-and-patient-name");
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

        setPatientName((prevPatientName) => prevPatientName.filter((_, pIndex) => pIndex !== pdfIndex));

        setFiles((prevFiles) => prevFiles.filter((_, fIndex) => fIndex !== pdfIndex));
    };

    const [pdfErrors, setPdfErrors]
        = useState<Array<{pdfIndex: number, errors:string[]}>>([]);

    const handleSavePDF = async (pdfIndex) => {
        const filePathToSave = await window.electron.ipcRenderer.invoke('show-save-dialog');

        console.log("Pot kje se naj shrani pdf: "+ filePathToSave);

        if (filePathToSave) {
            // handleDobiSporocilo(pdfIndex, filePathToSave);

            await window.electron.ipcRenderer.invoke('open-folder', filePathToSave);

            return filePathToSave
        }
        return null;
    };
    const handleDobiSporocilo = async (pdfIndex) => {
        const tabele = pdfTexts[pdfIndex];

        let result, errors:string[];

        switch (pdfCategories[pdfIndex]) {
            case 'Butterfly test':
                console.log(tabele);
        
                // Function to check if 'Mean' is present in any cell
                const containsMean = (tabele) => {
                    for (const table of tabele) {
                        for (const row of table) {
                            if (row.includes('Mean')) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
        
                // Check if 'Mean' is present and call the appropriate function
                if (containsMean(tabele)) {
                    console.log('Mean found in table data.');
                    ({ result, errors } = extractButterflyTestData(tabele));
                } else {
                    console.log('Mean not found in table data.');
                    ({ result, errors } = extractButterflyTestDataPdfTwo(tabele));
                }
                console.log('POSLJI V BUTTEFLY TEST', result);
                console.log("NAPAKE: ", errors);

                setPdfErrors(prevPdfErrors => {
                    const updatedPdfErrors =
                        prevPdfErrors.filter(errorObject => errorObject.pdfIndex !== pdfIndex);
                    if (errors.length >0){
                        updatedPdfErrors.push({pdfIndex, errors});
                    }
                    return updatedPdfErrors;
                });

                if (errors.length ===0 ){
                    const filePathToSave = await handleSavePDF(pdfIndex)
                    const dataToButterflyModel ={
                        "results": result,
                        "patient_name": patientName[pdfIndex],
                        "filePathToSave": filePathToSave
                    }
                    window.electron.ipcRenderer.send('send-table-to-butterfly-model', dataToButterflyModel);
                }
                break;

            case 'Head neck relocation test':

                console.log('Tabele za heand neck test: ', tabele );
                ({result, errors} = extractHeadNeckTestData(tabele));
                setPdfErrors(prevPdfErrors => {
                    const updatedPdfErrors =
                        prevPdfErrors.filter(errorObject => errorObject.pdfIndex !== pdfIndex);
                    if (errors.length >0){
                        updatedPdfErrors.push({pdfIndex, errors});
                    }
                    return updatedPdfErrors;
                });
                if (errors.length === 0){

                    const filePathToSave = await handleSavePDF(pdfIndex)
                    const dataToHeadNeckRelocationModel = {
                        "results": result,
                        "patient_name": patientName[pdfIndex],
                        "filePathToSave": filePathToSave
                    }

                    console.log('filePathToSave head neck : ', filePathToSave)

                    console.log('POSLJI V HEAD-NECK TEST', result);
                    window.electron.ipcRenderer.send('send-table-to-head-neck-model', dataToHeadNeckRelocationModel);
                }
                break;

            case 'Range of motion':
                console.log("posji range of motion");
                break;
        }
    };

    return (
        <>
            <FilesUpload onAddFiles={handleChangeOnFilesUpload} />

            {files.length !== pdfTexts.length ? (
                <LoadingAnimation/>
            ): (
            <div>
            {pdfTexts.map((pdf, pdfIndex) => (
                <div key={pdfIndex}>
                    <h3 className="font-bold">

                        {pdfIndex + 1} PDF name: {pdfCategories[pdfIndex]}
                        <button onClick={() => handleDeletePdf(pdfIndex)} className="bg-red-700 text-sm ml-2">
                            <MdDelete className="text-white h-4 w-4"/>
                        </button>
                    </h3>
                    <h4>Patient name: {patientName[pdfIndex]}</h4>

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
                                            Remove table
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
                        Manual input
                    </button>

                    <button type="button" onClick={() => handleDobiSporocilo(pdfIndex)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                             focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex
                              items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Forward to analysis & save results
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>
                    </div>

                    {pdfErrors
                        .filter(errorObject => errorObject.pdfIndex === pdfIndex)
                        .map((errorObject, errorIndex) => (
                        <div key={errorIndex}>
                            <h2 className="font-bold text-red-500 text-lg mb-2">Please fix the following errors before trying again: </h2>
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