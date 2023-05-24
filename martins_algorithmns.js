/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: generation_algorithmns.js
Created:  2023-05-24T02:21:50.003Z
Modified: 2023-05-24T02:21:50.003Z

Description: description
*/


// const attemptToFixUndefinedValuesInGrid = (grid) => {
//     if (gridIsValid(grid) === false) return null;

//     const gridPositionsOfUndefinedValues = getGridPositionsOfUndefinedValuesInGrid(grid);

//     for (let i = 0; i < gridPositionsOfUndefinedValues.length; i++) {
//         const gridPosition = gridPositionsOfUndefinedValues[i];

//         const [row, cell] = gridPosition;

//         // Find missing number from this cell's row
//         const rowValues = grid[row];
//         const rowValuesSet = new Set(rowValues);
//         const missingNumberFromRow = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => rowValuesSet.has(number) === false)[0];

//         // Find missing number from this cell's column
//         const columnValues = [];
//         for (let row = 0; row < 9; row++) columnValues.push(grid[row][cell]);
//         const columnValuesSet = new Set(columnValues);
//         const missingNumberFromColumn = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => columnValuesSet.has(number) === false)[0];

//         // Find missing number from this cell's box
//         const boxValues = [];
//         const boxRow = Math.floor(row / 3);
//         const boxColumn = Math.floor(cell / 3);
//         for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
//             for (let cell = boxColumn * 3; cell < boxColumn * 3 + 3; cell++) boxValues.push(grid[row][cell]);
//         }
//         const boxValuesSet = new Set(boxValues);
//         const missingNumberFromBox = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => boxValuesSet.has(number) === false)[0];

//         let fixingRowOrColumn = null;
//         let missingNumber = null;

//         // If the missing number from this cell's row is the same as the missing number from this cell's box, this is the number we need to rearrange
//         if (missingNumberFromRow === missingNumberFromBox) {
//             fixingRowOrColumn = 'row';
//             missingNumber = missingNumberFromRow;
//         }
//         if (missingNumberFromColumn === missingNumberFromBox) {
//             fixingRowOrColumn = 'column';
//             missingNumber = missingNumberFromColumn;
//         }

//         if (fixingRowOrColumn === null) continue;

//         // Find the other cell in this row or column that has the same missing number
//         console.log('fixing', gridPosition, 'by rearranging', fixingRowOrColumn, 'to', missingNumber);

//     }

//     return grid;
// };  


const generateUniqueSolvedGrid = () => {
    let grid = generateEmptyGrid();
    
    grid = attemptToGenerateUniqueRowColumnBoxSolvedGrid(grid);
    // grid = attemptToFixUndefinedValuesInGrid(grid);


    return grid;
}

const attemptToGenerateUniqueRowColumnBoxSolvedGrid = (grid) => {

    // Row 1 numbers
    const row1Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    grid[0] = row1Numbers;

    // Row 2 numbers
    // while (grid[1].includes(null) === true || grid[1].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];
        
            // Exclude numbers from this cell's box's row 1
            excludedNumbers = [...excludedNumbers, ...grid[0].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's existing values from this row 2
            excludedNumbers = [...excludedNumbers, ...grid[1].slice(0, i - 1)];

            grid[1][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[1][i - 1], 1, i - 1)
        }
        console.log(grid[1].includes(null) === true, grid[1]);
    // }

    // Row 3 numbers
    // while (grid[2].includes(null) === true || grid[2].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's box's row 1
            excludedNumbers = [...excludedNumbers, ...grid[0].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's box's row 2
            excludedNumbers = [...excludedNumbers, ...grid[1].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's existing values from this row 3
            excludedNumbers = [...excludedNumbers, ...grid[2].slice(0, i - 1)];

            grid[2][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[2][i - 1], 2, i - 1)
        } 
    // }

    // Row 4 numbers
    // while (grid[3].includes(null) === true || grid[3].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's column
            excludedNumbers = [...excludedNumbers, ...grid.map((row) => row[i - 1])];
            console.log(grid);

            // Exclude numbers from this cell's existing values from this row 4
            excludedNumbers = [...excludedNumbers, ...grid[3].slice(0, i - 1)];

            grid[3][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[3][i - 1], 3, i - 1)
        }
    // }

    // Row 5 numbers
    // while (grid[4].includes(null) === true || grid[4].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's column
            excludedNumbers = [...excludedNumbers, ...grid.map((row) => row[i - 1])];
            console.log(grid);

            // Exclude numbers from this cell's box's row 4
            excludedNumbers = [...excludedNumbers, ...grid[3].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's existing values from this row 5
            excludedNumbers = [...excludedNumbers, ...grid[4].slice(0, i - 1)];

            grid[4][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[4][i - 1], 4, i - 1)
        }
    // }

    // Row 6 numbers    
    // while (grid[5].includes(null) === true || grid[5].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's column
            excludedNumbers = [...excludedNumbers, ...grid.map((row) => row[i - 1])];
            console.log(grid);

            // Exclude numbers from this cell's box's row 4
            excludedNumbers = [...excludedNumbers, ...grid[3].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's box's row 5
            excludedNumbers = [...excludedNumbers, ...grid[4].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's existing values from this row 6
            excludedNumbers = [...excludedNumbers, ...grid[5].slice(0, i - 1)];

            grid[5][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[5][i - 1], 5, i - 1)
        }
    // }

    // Row 7 numbers    
    // while (grid[6].includes(null) === true || grid[6].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's column
            excludedNumbers = [...excludedNumbers, ...grid.map((row) => row[i - 1])];
            console.log(grid);

            // Exclude numbers from this cell's existing values from this row 7
            excludedNumbers = [...excludedNumbers, ...grid[6].slice(0, i - 1)];

            grid[6][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[6][i - 1], 6, i - 1)
        }
    // }

    // Row 8 numbers    
    // while (grid[7].includes(null) === true || grid[7].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's column
            excludedNumbers = [...excludedNumbers, ...grid.map((row) => row[i - 1])];
            console.log(grid);

            // Exclude numbers from this cell's box's row 7
            excludedNumbers = [...excludedNumbers, ...grid[6].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's existing values from this row 8
            excludedNumbers = [...excludedNumbers, ...grid[7].slice(0, i - 1)];

            grid[7][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[7][i - 1], 7, i - 1)
        }
    // }

    // Row 9 numbers    
    // while (grid[8].includes(null) === true || grid[8].includes(undefined) === true){
        for (let i = 1; i <= 9; i++) {
            let excludedNumbers = [];

            // Exclude numbers from this cell's column
            excludedNumbers = [...excludedNumbers, ...grid.map((row) => row[i - 1])];
            console.log(grid);

            // Exclude numbers from this cell's box's row 7
            excludedNumbers = [...excludedNumbers, ...grid[6].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's box's row 8
            excludedNumbers = [...excludedNumbers, ...grid[7].slice(Math.floor((i - 1) / 3) * 3, Math.floor((i - 1) / 3) * 3 + 3)];

            // Exclude numbers from this cell's existing values from this row 9
            excludedNumbers = [...excludedNumbers, ...grid[8].slice(0, i - 1)];

            grid[8][i - 1] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => excludedNumbers.includes(number) === false).sort(() => Math.random() - 0.5)[0];

            console.log('excluded', excludedNumbers, 'row', i, grid[8][i - 1], 8, i - 1)
        }
    // }

    return grid;
};  

const getGridPositionsOfUndefinedValuesInGrid = (grid) => {
    if (gridIsValid(grid) === false) return null;

    const gridPositions = [];

    for (let row = 0; row < 9; row++) {
        const rowValues = grid[row];

        for (let cell = 0; cell < 9; cell++) {
            const cellValue = rowValues[cell];

            if (cellValue == null) gridPositions.push([row, cell]);
        }
    }

    return gridPositions;
};