import { TableRow } from "flowbite-react";

export const extractButterflyTestData = (tabele) => {
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
        const tableName = headers[0] || `Table ${tableIndex + 1}`;
        console.log("headers prva provera", headers);
        if (!headers || headers.length === 0) {
            errors.push(`Table ${tableIndex + 1} (${tableName}) has no headers.`);
            console.error(`Table ${tableIndex + 1} (${tableName}) has no headers.`);
            return;
        }

        let amplitudeIndex = headers.indexOf('Mean');
        const secondRow = table[1];
        console.log("headers:", headers);
        if (amplitudeIndex === -1 && table.length > 1) {
            amplitudeIndex = secondRow.indexOf('Mean');
        }

        if (amplitudeIndex === -1) {
            console.log(`'TimeonTarget' column not found in table ${tableIndex + 1} (${tableName}).`);
            return;
        }

        const columnName = secondRow[amplitudeIndex];

        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) is empty.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) is empty.`);
                continue;
            }
            const category = row[0];
            if (!category) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) does not have a category.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} (${tableName}) does not have a category.`);
                continue;
            }

            const amplitudeCellValue = row[amplitudeIndex];
            if (!amplitudeCellValue) {
                errors.push(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                console.error(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                continue;
            }

            console.log(`Cell Value for Amplitude, ${category}:`, amplitudeCellValue);

            switch (category) {
                case 'Easy':
                    result.AA_e_m.push(amplitudeCellValue);
                    break;
                case 'Medium':
                    result.AA_m_m.push(amplitudeCellValue);
                    break;
                case 'Difficult':
                    result.AA_d_m.push(amplitudeCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }
    });

    tabele.forEach((table, tableIndex) => {
        if (!table || table.length === 0) {
            errors.push(`Table ${tableIndex + 1} has no data.`);
            console.error(`Table ${tableIndex + 1} has no data.`);
            return;
        }
        const secondRow = table[1];
        const headers = table[0];
        const tableName = headers[0] || `Table ${tableIndex + 1}`;
        console.log("headers prva provera",headers)
        if (!headers || headers.length === 0) {
            errors.push(`Table ${tableIndex + 1} has no headers.`);
            console.error(`Table ${tableIndex + 1} has no headers.`);
            return;
        }

        let undershootsIndex = headers.indexOf('Undershoots');

        if (undershootsIndex === -1 && table.length > 1) {
            const nextRowHeaders = table[1];
            undershootsIndex = nextRowHeaders.indexOf('Undershoots');
        }

        if (undershootsIndex === -1) {
            //errors.push(`'Undershoots' column not found in table ${tableIndex + 1}.`);
            console.log(`'Undershoots' column not found in table ${tableIndex + 1}.`);
            return;
        }
        const columnName = secondRow[undershootsIndex];
        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                continue;
            }

            const category = row[0];
            if (!category) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                continue;
            }

            const undershootsCellValue = row[undershootsIndex];
            if (!undershootsCellValue) {
                errors.push(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                console.error(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
            continue;
            }

            console.log(`Cell Value for Undershoots, ${category}:`, undershootsCellValue);

            switch (category) {
                case 'Easy':
                    result.Und_e_m.push(undershootsCellValue);
                    break;
                case 'Medium':
                    result.Und_m_m.push(undershootsCellValue);
                    break;
                case 'Difficult':
                    result.Und_d_m.push(undershootsCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }

        let overshootsIndex = headers.indexOf('Overshoots');

        if (overshootsIndex === -1 && table.length > 1) {
            const nextRowHeaders = table[1];
            overshootsIndex = nextRowHeaders.indexOf('Overshoots');
        }

        if (overshootsIndex === -1) {
            //errors.push(`'Overshoots' column not found in table ${tableIndex + 1}.`);
            console.log(`'Overshoots' column not found in table ${tableIndex + 1}.`);
            return;
        }

        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                continue;
            }

            const category = row[0];
            const columnName = secondRow[overshootsIndex];
            if (!category) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                continue;
            }

            const overshootsCellValue = row[overshootsIndex];
            if (!overshootsCellValue) {
                errors.push(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                console.error(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                 continue;
            }

            console.log(`Cell Value for Overshoots, ${category}:`, overshootsCellValue);

            switch (category) {
                case 'Easy':
                    result.Over_e_m.push(overshootsCellValue);
                    break;
                case 'Medium':
                    result.Over_m_m.push(overshootsCellValue);
                    break;
                case 'Difficult':
                    result.Over_d_m.push(overshootsCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }

        let ToTIndex = headers.indexOf('TimeonTarget');

        if (ToTIndex === -1 && table.length > 1) {
            const nextRowHeaders = table[1];
            ToTIndex = nextRowHeaders.indexOf('TimeonTarget');
        }

        if (ToTIndex === -1) {
            //errors.push(`'TimeonTarget' column not found in table ${tableIndex + 1}.`);
            console.log(`'TimeonTarget' column not found in table ${tableIndex + 1}.`);
            return;
        }

        for (let rowIndex = 1; rowIndex < table.length; rowIndex++) {
            const row = table[rowIndex];
            if (!row || row.length === 0) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
                continue;
            }

            const category = row[0];
            if (!category) {
                errors.push(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                console.error(`Row ${rowIndex} in table ${tableIndex + 1} does not have a category.`);
                continue;
            }

            const ToTCellValue = row[ToTIndex];
            const columnName = secondRow[ToTIndex];
            if (!ToTCellValue) {
                errors.push(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                console.error(`Empty cell found in table '${tableName}', in column '${columnName}' and row '${category}'. Please make sure that all cells have values before forwarding data to analysis`);
                continue;
            }

            console.log(`Cell Value for ToT, ${category}:`, ToTCellValue);

            switch (category) {
                case 'Easy':
                    result.ToT_e_m.push(ToTCellValue);
                    break;
                case 'Medium':
                    result.ToT_m_m.push(ToTCellValue);
                    break;
                case 'Difficult':
                    result.ToT_d_m.push(ToTCellValue);
                    break;
                default:
                    console.log(`Unknown category: ${category}`);
            }
        }
    });

    console.log("TOTEM posle punjenja",result.ToT_e_m)

    console.log('Extracted Butterfly Test Data:', result);
    return {result, errors};
};