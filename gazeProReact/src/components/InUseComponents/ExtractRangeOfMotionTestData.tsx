export const extractRangeOfMotionTestData = (tables: any[]): { result: any; errors: string[] } => {
    const result = {
      Sagital_f: [] as number[],
      Transverse_f: [] as number[],
      Frontal_f: [] as number[],
      Sagital_E: [] as number[],
      Transverse_E: [] as number[],
      Frontal_E: [] as number[],
      Sagital_Rot: [] as number[],
      Transverse_Rot: [] as number[],
      Frontal_Rot: [] as number[],
    };
  
    const errors: string[] = [];
  
    tables.forEach((table, tableIndex) => {
      if (!table || table.length === 0) {
        errors.push(`Table ${tableIndex + 1} has no data.`);
        console.error(`Table ${tableIndex + 1} has no data.`);
        return;
      }
  
      const headers = table[2];
      const tableName = headers[0] || `Table ${tableIndex + 1}`;
  
      if (!headers || headers.length === 0) {
        errors.push(`Table ${tableIndex + 1} has no headers.`);
        console.error(`Table ${tableIndex + 1} has no headers.`);
        return;
      }
  
      const sagittalIndex = headers.indexOf('Sagittal');
      const transverseIndex = headers.indexOf('Transverse');
      const frontalIndex = headers.indexOf('Frontal');
  
      if (sagittalIndex === -1 || transverseIndex === -1 || frontalIndex === -1) {
        console.log(`'Sagittal', 'Transverse', or 'Frontal' column not found in table ${tableIndex + 1}.`);
        return;
      }
  
      for (let rowIndex = 3; rowIndex < table.length; rowIndex++) { // Start from the 4th row (index 3)
        const row = table[rowIndex];
        if (!row || row.length === 0) {
          errors.push(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
          console.error(`Row ${rowIndex} in table ${tableIndex + 1} is empty.`);
          continue;
        }
  
        const category = row[0];
        if (!category) {
          errors.push(`Empty cell found in table '${tableName}', in row ${rowIndex + 1}. Please make sure that all cells have values before forwarding data to analysis`);
          console.error(`Empty cell found in table '${tableName}', in row ${rowIndex + 1}. Please make sure that all cells have values before forwarding data to analysis`);
          continue;
        }
  
        const sagittalValue = row[sagittalIndex] === '-' ? 0 : parseFloat(row[sagittalIndex]);
        const transverseValue = row[transverseIndex] === '-' ? 0 : parseFloat(row[transverseIndex]);
        const frontalValue = row[frontalIndex] === '-' ? 0 : parseFloat(row[frontalIndex]);
  
        if (isNaN(sagittalValue) || isNaN(transverseValue) || isNaN(frontalValue)) {
          errors.push(`Non-numeric value found in table '${tableName}', row ${rowIndex + 1}.`);
          console.error(`Non-numeric value found in table '${tableName}', row ${rowIndex + 1}.`);
          continue;
        }
  
        switch (category) {
            case 'Flexion':
              result.Sagital_f.push(sagittalValue);
              result.Transverse_f.push(transverseValue);
              result.Frontal_f.push(frontalValue);
              break;
            case 'ForwardBending':
              result.Sagital_f.push(sagittalValue);
              result.Transverse_f.push(transverseValue);
              result.Frontal_f.push(frontalValue);
              break;
            case 'Extension':
              result.Sagital_E.push(sagittalValue);
              result.Transverse_E.push(transverseValue);
              result.Frontal_E.push(frontalValue);
              break;
            case 'BackwardBending':
              result.Sagital_E.push(sagittalValue);
              result.Transverse_E.push(transverseValue);
              result.Frontal_E.push(frontalValue);
              break;            
            case 'Left rotation':
              result.Sagital_Rot.push(sagittalValue);
              result.Transverse_Rot.push(transverseValue);
              result.Frontal_Rot.push(frontalValue);
              break;
            case 'Left Rotation':
              result.Sagital_Rot.push(sagittalValue);
              result.Transverse_Rot.push(transverseValue);
              result.Frontal_Rot.push(frontalValue);
              break;
            case 'TurningLeft':
              result.Sagital_Rot.push(sagittalValue);
              result.Transverse_Rot.push(transverseValue);
              result.Frontal_Rot.push(frontalValue);
              break;            
            default:
              console.log(`Unknown category: ${category}`);
          }
        }
      });
  
    console.log('Extracted Range of Motion Data:', result);
    return { result, errors };
  };