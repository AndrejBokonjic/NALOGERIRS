import React from "react";


export const ManualInputButton = ({pdfCategories, setPdfTexts, pdfIndex}) => {
    const handleCreateTableClick = (pdfIndex) => {
        //setShowInsertTable(true);
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
        const newRangeOfMotion = [
            ["GRAPHIC RESULTS", "", "", ""],
            ["Numeric Results", "", "", ""],
            ["Movement","Sagittal", "Transverse", "Frontal"],
            ["Flexion" ,"", "", ""],
            ["Extension", "", "", ""],
            ["Left Rotation","", "", ""],
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
            case "Range of motion":
                setPdfTexts((prevPdfTexts) => {
                    const updatedPdfTexts = [...prevPdfTexts];
                    updatedPdfTexts[pdfIndex] = [...updatedPdfTexts[pdfIndex], newRangeOfMotion];
                    return updatedPdfTexts;
                });
        }
    };


    return(
        <button
            onClick={() => handleCreateTableClick(pdfIndex)}
            type="button"
            className="text-gray-400  hover:text-white border border-gray-500 hover:bg-gray-900
                            font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-500
                            dark:hover:text-white dark:hover:bg-gray-600 ">
            Manual input
        </button>
    )
}