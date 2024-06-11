import { TableRow } from "flowbite-react";

export const extractButterflyTestDataPdfTwo = (tabele) => {
    const result = {
        ToT_e_m: [],
        ToT_m_m: [],
        ToT_d_m: [],
        Und_e_m: [],
        Und_m_m: [],
        Und_d_m: [],
        Over_e_m: [],
        Over_m_m: [],
        Over_d_m: [],
        AA_e_m: [],
        AA_m_m: [],
        AA_d_m: []
    };

    const errors = [];

    tabele.forEach((table, tableIndex) => {
        if (!table || table.length === 0) {
            errors.push(`Table ${tableIndex + 1} has no data.`);
            console.error(`Table ${tableIndex + 1} has no data.`);
            return;
        }

        const headers = table[0];
        console.log("HEADERS: ", headers);
        const tableName = headers[0] || `Table ${tableIndex + 1}`;
        console.log(`Table ${tableIndex + 1} (${tableName}) headers:`, headers);
        if (!headers || headers.length === 0) {
            errors.push(`Table ${tableIndex + 1} (${tableName}) has no headers.`);
            console.error(`Table ${tableIndex + 1} (${tableName}) has no headers.`);
            return;
        }

        // //Check if the table header matches "Amplitude accuracy"
        // if (!headers.includes("Amplitude accuracy","Amplitude Accuracy" ) ) {
        //     console.log(`Table ${tableIndex + 1} (${tableName}) does not contain 'Amplitude accuracy' header.`);
        //     return;
        // }

        if (!headers.some(header => header === "Amplitude accuracy" || header === "Amplitude Accuracy")) {
            console.log(`Table ${tableIndex + 1} (${tableName}) does not contain 'Amplitude accuracy' header.`);
            return;
        }

        /*
        if (!headers.includes("Amplitude Accuracy") ) {
            console.log(`Table ${tableIndex + 1} (${tableName}) does not contain 'Amplitude Accuracy' header.`);
            return;
        }*/


        const secondRow = table[1];
        console.log("Second row:", secondRow);
        if (!secondRow || secondRow.length === 0) {
            errors.push(`Table ${tableIndex + 1} (${tableName}) has no second row.`);
            console.error(`Table ${tableIndex + 1} (${tableName}) has no second row.`);
            return;
        }

        // Finding indices for Easy, Medium, and Difficult in the second row
        const easyIndex = secondRow.indexOf('Easy');
        const mediumIndex = secondRow.indexOf('Medium');
        const difficultIndex = secondRow.indexOf('Difficult');

        if (easyIndex === -1 || mediumIndex === -1 || difficultIndex === -1) {
            console.log(`'Easy', 'Medium', or 'Difficult' column not found in table ${tableIndex + 1} (${tableName}).`);
            return;
        }

        for (let rowIndex = 2; rowIndex < table.length; rowIndex++) {  // Start from the 3rd row (index 2)
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) is empty.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) is empty.`);
                continue;
            }

            const easyValue = row[easyIndex];
            const mediumValue = row[mediumIndex];
            const difficultValue = row[difficultIndex];

            if (!easyValue || !mediumValue || !difficultValue) {
                const columnName = `Easy/Medium/Difficult`;
                errors.push(`Empty cell found in table '${tableName}', in column '${columnName}' and row ${rowIndex + 1}. Please make sure that all cells have values before forwarding data to analysis`);
                console.error(`Empty cell found in table '${tableName}', in column '${columnName}' and row ${rowIndex + 1}. Please make sure that all cells have values before forwarding data to analysis`);
                continue;
            }

            console.log(`Cell Value for Amplitude: Easy=${easyValue}, Medium=${mediumValue}, Difficult=${difficultValue}`);

            result.AA_e_m.push(easyValue);
            result.AA_m_m.push(mediumValue);
            result.AA_d_m.push(difficultValue);
        }
    });
    
    tabele.forEach((table, tableIndex) => {
        if (!table || table.length === 0) {
            errors.push(`Table ${tableIndex + 1} has no data.`);
            return;
        }

        const headers = table[0];
        const tableName = headers[0] || `Table ${tableIndex + 1}`;
        if (!headers || headers.length === 0) {
            errors.push(`Table ${tableIndex + 1} (${tableName}) has no headers.`);
            return;
        }

        const secondRow = table[1];
        if (!secondRow || secondRow.length === 0) {
            errors.push(`Table ${tableIndex + 1} (${tableName}) has no second row.`);
            return;
        }

        // Check if the table header matches "Directional accuracy"
        if (!headers.some(header => header === "Directional accuracy" || header === "Directional Accuracy")) {
            return;
        }
        // if (!headers.includes("Directional accuracy")) {
        //     return;
        // }

        // Finding indices for Easy, Medium, and Difficult
        const easyIndex = secondRow.indexOf('Easy');
        const mediumIndex = secondRow.indexOf('Medium');
        const difficultIndex = secondRow.indexOf('Difficult');

        if (easyIndex === -1 || mediumIndex === -1 || difficultIndex === -1) {
            return;
        }

        // Extract values from relevant rows
        for (let rowIndex = 2; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) is empty.`);
                continue;
            }

            const easyValue = row[easyIndex];
            const mediumValue = row[mediumIndex];
            const difficultValue = row[difficultIndex];

            // Check and extract only numeric values for DA
            const numericEasyValue = parseFloat(easyValue);
            const numericMediumValue = parseFloat(mediumValue);
            const numericDifficultValue = parseFloat(difficultValue);

            const nonNumericValues = ["Undershoot"];  // Add expected non-numeric values here

            if (
                (!isNaN(numericEasyValue) || nonNumericValues.includes(easyValue)) &&
                (!isNaN(numericMediumValue) || nonNumericValues.includes(mediumValue)) &&
                (!isNaN(numericDifficultValue) || nonNumericValues.includes(difficultValue))
            ) {
                if (!isNaN(numericEasyValue)) {
                    result.Und_e_m.push(numericEasyValue);
                }
                if (!isNaN(numericMediumValue)) {
                    result.Und_m_m.push(numericMediumValue);
                }
                if (!isNaN(numericDifficultValue)) {
                    result.Und_d_m.push(numericDifficultValue);
                }
            } else {
                const columnName = `Easy/Medium/Difficult`;
                errors.push(`Unexpected non-numeric cell found in table '${tableName}', in column '${columnName}' and row ${rowIndex + 1}. Please make sure that all cells have numeric values before forwarding data to analysis`);
                continue;
            }

            // Locate corresponding Overshoot and On target cells
            let overshootIndices = [];
            let onTargetIndices = [];

            let thirdRow=table[2]
            // Searching for the next "Overshoot" and "On target" columns to the right of the current column
            for (let i = easyIndex + 1; i < secondRow.length; i++) {
                if (thirdRow[i] === 'Overshoot') {
                    overshootIndices.push(i);
                } else if (thirdRow[i] === 'On target' || thirdRow[i] === 'On Target') {
                    onTargetIndices.push(i);
                }
                if (overshootIndices.length === 3 && onTargetIndices.length === 3) break;
            }

            // Ensure we have found enough columns
            if (overshootIndices.length < 3 || onTargetIndices.length < 3) {
                errors.push(`Not enough Overshoot or On target columns found in table '${tableName}' for row ${rowIndex + 1}.`);
                continue;
            }

            // Extract Overshoot and On target values
            const extractValues = (indices, row) => indices.map(index => parseFloat(row[index])).filter(value => !isNaN(value));

            const overshootValues = extractValues(overshootIndices, row);
            const onTargetValues = extractValues(onTargetIndices, row);

            if (overshootValues.length === 3 && onTargetValues.length === 3) {
                result.Over_e_m.push(overshootValues[0]);
                result.Over_m_m.push(overshootValues[1]);
                result.Over_d_m.push(overshootValues[2]);
                result.ToT_e_m.push(onTargetValues[0]);
                result.ToT_m_m.push(onTargetValues[1]);
                result.ToT_d_m.push(onTargetValues[2]);
            }
        }
    });
        console.log('Extracted Directional Accuracy Data:', result);
        return { result, errors };
    };
