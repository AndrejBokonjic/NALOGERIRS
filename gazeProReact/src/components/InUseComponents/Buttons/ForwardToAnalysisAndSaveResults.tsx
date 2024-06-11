import {extractButterflyTestData} from "../ExtractButterflyTestData.tsx";
import {extractButterflyTestDataPdfTwo} from "../ExtractButterflyTestDataPdfTwo.tsx";
import {extractHeadNeckTestData} from "../ExtractHeadNeckTestData.tsx";
import {extractRangeOfMotionTestData} from "../ExtractRangeOfMotionTestData.tsx";
import React from "react";


export const ForwardToAnalysisAndSaveResultsButton = ({pdfTexts, pdfCategories, setPdfErrors,
                                                    handleSavePDF, patientName, sendToPythonScript, pdfIndex}) => {
    const handleDobiSporocilo = async (pdfIndex) => {
        const tabele = pdfTexts[pdfIndex];
        let result, errors;

        switch (pdfCategories[pdfIndex]) {
            case 'Butterfly test':
                console.log(tabele);

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

                if (containsMean(tabele)) {
                    console.log('Mean found in table data.');
                    ({ result, errors } = extractButterflyTestData(tabele));
                } else {
                    console.log('Mean not found in table data.');
                    ({ result, errors } = extractButterflyTestDataPdfTwo(tabele));
                }

                setPdfErrors(prevPdfErrors => {
                    const updatedPdfErrors = prevPdfErrors.filter(errorObject => errorObject.pdfIndex !== pdfIndex);
                    if (errors.length > 0) {
                        updatedPdfErrors.push({ pdfIndex, errors });
                    }
                    return updatedPdfErrors;
                });

                if (errors.length === 0) {
                    const filePathToSave = await handleSavePDF(pdfIndex);
                    const dataToButterflyModel = {
                        "results": result,
                        "patient_name": patientName[pdfIndex],
                        "filePathToSave": filePathToSave
                    };
                    sendToPythonScript(dataToButterflyModel);
                    window.electron.ipcRenderer.send('send-table-to-butterfly-model', dataToButterflyModel);
                }
                break;

            case 'Head neck relocation test':
                console.log('Tabele za head neck test: ', tabele);
                ({ result, errors } = extractHeadNeckTestData(tabele));
                console.log('Ekstrahovani rezultati za head neck test: ', result);
                console.log('Greške za head neck test: ', errors);

                // Dodajemo proveru da li su podaci ispravno izdvojeni
                if (result && Object.keys(result).length > 0) {
                    console.log('Podaci su uspešno izdvojeni za head neck test.');
                } else {
                    console.error('Greška prilikom izdvajanja podataka za head neck test.');
                }

                setPdfErrors(prevPdfErrors => {
                    const updatedPdfErrors = prevPdfErrors.filter(errorObject => errorObject.pdfIndex !== pdfIndex);
                    if (errors.length > 0) {
                        updatedPdfErrors.push({ pdfIndex, errors });
                    }
                    return updatedPdfErrors;
                });

                if (errors.length === 0) {
                    const filePathToSave = await handleSavePDF(pdfIndex);
                    const dataToHeadNeckRelocationModel = {
                        "results": result,
                        "patient_name": patientName[pdfIndex],
                        "filePathToSave": filePathToSave
                    };
                    console.log('filePathToSave head neck : ', filePathToSave);
                    console.log('POSLJI V HEAD-NECK TEST', result);
                    sendToPythonScript(dataToHeadNeckRelocationModel);
                    window.electron.ipcRenderer.send('send-table-to-head-neck-model', dataToHeadNeckRelocationModel);
                }
                break;


            case 'Range of motion':
                console.log('Tabele za range of motion test: ', tabele);
                ({ result, errors } = extractRangeOfMotionTestData(tabele));

                setPdfErrors(prevPdfErrors => {
                    const updatedPdfErrors = prevPdfErrors.filter(errorObject => errorObject.pdfIndex !== pdfIndex);
                    if (errors.length > 0) {
                        updatedPdfErrors.push({ pdfIndex, errors });
                    }
                    return updatedPdfErrors;
                });

                if (errors.length === 0) {
                    const filePathToSave = await handleSavePDF(pdfIndex);
                    const dataToRangeOfMotion = {
                        "results": result,
                        "patient_name": patientName[pdfIndex],
                        "filePathToSave": filePathToSave
                    };
                    console.log('filePathToSave range of motion: ', filePathToSave);
                    console.log('POSLJI V RangeOFMotion TEST', result);
                    sendToPythonScript(dataToRangeOfMotion);
                    window.electron.ipcRenderer.send('send-table-to-range-of-motion', dataToRangeOfMotion);
                }
                break;
        }
    };


    return(
        <button
            type="button"
            onClick={() => handleDobiSporocilo(pdfIndex)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
        focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex
        items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Forward to analysis & save results
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
    )
}