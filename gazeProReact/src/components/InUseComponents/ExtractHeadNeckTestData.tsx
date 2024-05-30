export const extractHeadNeckTestData = (tabele) => {
    const result = {
        HNRT_Aerr_l: [],
        HNRT_Cerr_l: [],
        HNRT_Verr_l: [],
        HNRT_Aerr_r: [],
        HNRT_Cerr_r: [],
        HNRT_Verr_r: [],
        HNRT_Aerr_f: [],
        HNRT_Cerr_f: [],
        HNRT_Verr_f: [],
        HNRT_Aerr_b: [],
        HNRT_Cerr_b: [],
        HNRT_Verr_b: []
    };

    console.log("HNRTCERRB pre punjenja", result.HNRT_Cerr_b);

    tabele.forEach((table, tableIndex) => {
        if (!table || table.length === 0) {
            console.error(`Table ${tableIndex + 1} has no data.`);
            return;
        }

        const headers = table[0];
        console.log("headers prva provera", headers);
        if (!headers || headers.length === 0) {
            console.error(`Table ${tableIndex + 1} has no headers.`);
            return;
        }

        const absoluteIndex = headers.indexOf('AbsoluteError°');
        console.log("headers:", headers);

        if (absoluteIndex === -1) {
            console.log(`'Absolute error' column not found in table ${tableIndex + 1}.`);
            return;
        }

        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                continue;
            }

            const category = row[0];
            if (!category) {
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                continue;
            }

            const absoluteCellValue = row[absoluteIndex];
            if (absoluteCellValue === undefined || absoluteCellValue === null) {
                console.error(`No value found for 'Absolute error' in row ${rowIndex} of table ${tableIndex + 1}.`);
                continue;
            }

            console.log(`Cell Value for Absolute error, ${category}:`, absoluteCellValue);

            switch (category) {
                case 'TurningLeft':
                    result.HNRT_Aerr_l.push(absoluteCellValue);
                    break;
                case 'TurningRight':
                    result.HNRT_Aerr_r.push(absoluteCellValue);
                    break;
                case 'ForwardBending':
                    result.HNRT_Aerr_f.push(absoluteCellValue);
                    break;
                case 'BackwardBending':
                    result.HNRT_Aerr_b.push(absoluteCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }
    });

    tabele.forEach((table, tableIndex) => {
        if (!table || table.length === 0) {
            console.error(`Table ${tableIndex + 1} has no data.`);
            return;
        }

        const headers = table[0];
        console.log("headers prva provera",headers)
        if (!headers || headers.length === 0) {
            console.error(`Table ${tableIndex + 1} has no headers.`);
            return;
        }

        let constantIndex = headers.indexOf('ConstantError°');

        if (constantIndex === -1 && table.length > 1) {
            const nextRowHeaders = table[1];
            constantIndex = nextRowHeaders.indexOf('ConstantError°');
        }

        if (constantIndex === -1) {
            console.log(`'Constant error' column not found in table ${tableIndex + 1}.`);
            return;
        }

        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                continue;
            }

            const category = row[0];
            if (!category) {
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                continue;
            }

            const constantCellValue = row[constantIndex];
            if (!constantCellValue) {
                console.error(`No value found for 'Constant error' in row ${rowIndex} of table ${tableIndex + 1}.`);
                continue;
            }

            console.log(`Cell Value for Constant error, ${category}:`, constantCellValue);

            switch (category) {
                case 'TurningLeft':
                    result.HNRT_Cerr_l.push(constantCellValue);
                    break;
                case 'TurningRight':
                    result.HNRT_Cerr_r.push(constantCellValue);
                    break;
                case 'ForwardBending':
                    result.HNRT_Cerr_f.push(constantCellValue);
                    break;
                case 'BackwardBending':
                    result.HNRT_Cerr_b.push(constantCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }
        let variableIndex = headers.indexOf('VariableError°');

        if (variableIndex === -1 && table.length > 1) {
            const nextRowHeaders = table[1];
            variableIndex = nextRowHeaders.indexOf('VariableError°');
        }

        if (variableIndex === -1) {
            console.log(`'Overshoots' column not found in table ${tableIndex + 1}.`);
            return;
        }

        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                continue;
            }

            const category = row[0];
            if (!category) {
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                continue;
            }

            const variableCellValue = row[variableIndex];
            if (!variableCellValue) {
                console.error(`No value found for 'Variable Error' in row ${rowIndex} of table ${tableIndex + 1}.`);
                continue;
            }

            console.log(`Cell Value for Variable Error, ${category}:`, variableCellValue);

            switch (category) {
                case 'TurningLeft':
                    result.HNRT_Verr_l.push(variableCellValue);
                    break;
                case 'TurningRight':
                    result.HNRT_Verr_r.push(variableCellValue);
                    break;
                case 'ForwardBending':
                    result.HNRT_Verr_f.push(variableCellValue);
                    break;
                case 'BackwardBending':
                    result.HNRT_Verr_b.push(variableCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }
    });

    console.log("HNRTCERRB posle punjenja",result.HNRT_Cerr_b)

    console.log('Extracted Butterfly Test Data:', result);
    return result;
};