/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: game.js
Created:  2023-05-23T22:55:46.787Z
Modified: 2023-05-23T22:55:46.787Z

Description: description
*/

const GameState = {
    
    isPlaying: false,
    isPaused: false,
    isFinished: false,
    generatorDifficulty: 'easy',
    
    solvedGrid: null,
    currentGrids: [],
    conflictingCells: [],

    activeCellElement: null,

    hasAttachedEventListeners: false,
    
}


/**
 * Type Validation
 */

const gridPositionIsValid = (gridPosition) => {

    if (gridPosition === null) return false;
    if (gridPosition instanceof Array === false) return false;
    if (gridPosition.length !== 2) return false;
    
    const [row, cell] = gridPosition;

    if (row < 1 || row > 9) return false;
    if (cell < 1 || cell > 9) return false;

    return true;

}

const cellElementIsValid = (cellElement) => {

    if (cellElement === null) return false;
    if (cellElement instanceof HTMLDivElement === false) return false;
    if (cellElement.classList.contains('game__board__cell') === false) return false;

    if (cellElement.dataset.row == null || cellElement.dataset.cell == null) return false;

    const row = parseInt(cellElement.dataset.row);
    const cell = parseInt(cellElement.dataset.cell);

    if (row < 1 || row > 9) return false;
    if (cell < 1 || cell > 9) return false;

    return true;

}

const numberValueIsValid = (value) => {

    if (value == null) return false;
    if (isNaN(value)) return false;
    if (value < 1 || value > 9) return false;

    return true;

}

const gridIsValid = (grid) => {

    if (grid === null) return false;
    if (grid instanceof Array === false) return false;
    if (grid.length !== 9) return false;

    for (let row = 0; row < 9; row++) {
        if (grid[row] instanceof Array === false) return false;
        if (grid[row].length !== 9) return false;

        for (let cell = 0; cell < 9; cell++) {
            if (grid[row][cell] < 0 || grid[row][cell] > 9) return false;
        }
    }

    return true;

}


/**
 * Styling Functions
 */

const refreshBoardStyling = () => {

    Array.from(document.querySelectorAll('.game__board__cell')).forEach((cellElement) => {
        cellElement.classList.remove('game__board__cell--active');
        cellElement.classList.remove('game__board__cell--conflicting');
        cellElement.classList.remove('game__board__cell--finished');
    });

    document.querySelector('.game__buttons__row__action_button[data-action="clear"]').innerHTML =
        GameState.isFinished === true ? `Well Done!<br/>New Game ✨` : `Give Up 😔`;

    if (GameState.isFinished === true) {
        Array.from(document.querySelectorAll('.game__board__cell')).forEach((cellElement) => {
            cellElement.classList.add('game__board__cell--finished');
        });

        return;
    }

    if (GameState.activeCellElement !== null) {
        GameState.activeCellElement.classList.add('game__board__cell--active');
    }

    for (let i = 0; i < GameState.conflictingCells.length; i++) {
        const [type, index] = GameState.conflictingCells[i];

        if (type === 'row') {
            Array.from(document.querySelectorAll(`.game__board__cell[data-row="${index}"]`)).forEach((cellElement) => {
                cellElement.classList.add('game__board__cell--conflicting');
            });
        }

        if (type === 'column') {
            Array.from(document.querySelectorAll(`.game__board__cell[data-cell="${index}"]`)).forEach((cellElement) => {
                cellElement.classList.add('game__board__cell--conflicting');
            });
        }

        if (type === 'box') {
            const [boxRow, boxColumn] = index;

            Array.from(document.querySelectorAll(`.game__board__cell[data-row="${boxRow * 3 - 2}"][data-cell="${boxColumn * 3 - 2}"], .game__board__cell[data-row="${boxRow * 3 - 2}"][data-cell="${boxColumn * 3 - 1}"], .game__board__cell[data-row="${boxRow * 3 - 2}"][data-cell="${boxColumn * 3}"], .game__board__cell[data-row="${boxRow * 3 - 1}"][data-cell="${boxColumn * 3 - 2}"], .game__board__cell[data-row="${boxRow * 3 - 1}"][data-cell="${boxColumn * 3 - 1}"], .game__board__cell[data-row="${boxRow * 3 - 1}"][data-cell="${boxColumn * 3}"], .game__board__cell[data-row="${boxRow * 3}"][data-cell="${boxColumn * 3 - 2}"], .game__board__cell[data-row="${boxRow * 3}"][data-cell="${boxColumn * 3 - 1}"], .game__board__cell[data-row="${boxRow * 3}"][data-cell="${boxColumn * 3}"]`)).forEach((cellElement) => {
                cellElement.classList.add('game__board__cell--conflicting');
            });
        }
    }

}


/** 
 * Helper Functions
 */

const getGridPositionFromCellElement = (cellElement) => {

    if (cellElementIsValid(cellElement) === false) return null;

    return [ parseInt(cellElement.dataset.row), parseInt(cellElement.dataset.cell) ];

}

const getGridPositionFromActiveCellElement = () => {
    return getGridPositionFromCellElement(GameState.activeCellElement);
}

const getCellElementFromGridPosition = (gridPosition) => {

    if (gridPositionIsValid(gridPosition) === false) return null;

    const [row, cell] = gridPosition;
    return document.querySelector(`.game__board__cell[data-row="${row}"][data-cell="${cell}"]`);

}

const setActiveCellElement = (cellElement) => {

    if (cellElementIsValid(cellElement) === false) return false;

    GameState.activeCellElement = cellElement;

    refreshBoardStyling();
    
    return true;

};

const unsetActiveCellElement = () => {

    GameState.activeCellElement = null;

    refreshBoardStyling();

    return true;

}


/**
 * Element Event Handling
 */

const onCellElementClick = (event) => {

    const cellElement = event.target.tagName === 'SPAN' ? event.target.parentElement : event.target;

    if (GameState.isPlaying !== true) return;

    const gridPosition = getGridPositionFromCellElement(cellElement);

    if (gridPosition === null) return;

    setActiveCellElement(cellElement);

};

const onNumberButtonElementClick = (event) => {

    event.stopPropagation();

    if (GameState.isPlaying !== true) return;

    const numberButtonElement = event.target;
    const numberValue = parseInt(numberButtonElement.dataset.number);
    if (numberValueIsValid(numberValue) === false) return;

    const gridPosition = getGridPositionFromActiveCellElement();
    if (gridPositionIsValid(gridPosition) === false) return;

    commitChangeToLatestGridGridPosition(gridPosition, numberValue);

};

const onDocumentKeypress = (event) => {

    event.stopPropagation();
    event.preventDefault();

    if (GameState.isPlaying !== true) return;

    const gridPosition = getGridPositionFromActiveCellElement();
    if (gridPositionIsValid(gridPosition) === false) return;

    if (event.key === 'Backspace' || event.key === 'Delete') {
        return commitChangeToLatestGridGridPosition(gridPosition, null);
    }

    const numberValue = parseInt(event.key);
    if (numberValueIsValid(numberValue) === false) return;

    commitChangeToLatestGridGridPosition(gridPosition, numberValue);

}

const onDifficultyChange = (event) => {

    event.stopPropagation();

    const difficulty = event.target.value;
    if (difficulty == null) return;
    if (['easy', 'medium', 'hard', 'very-hard', 'insane', 'inhuman'].includes(difficulty) === false) return;

    GameState.generatorDifficulty = difficulty;

    newGame();

};

const addEventListeners = () => {

    if (GameState.hasAttachedEventListeners) return;

    Array.from(document.querySelectorAll('.game__board__cell')).forEach((cellElement) => {
        cellElement.addEventListener("click", onCellElementClick);
    });

    Array.from(document.querySelectorAll('.game__buttons__row__number_button')).forEach((numberButtonElement) => {
        numberButtonElement.addEventListener("click", onNumberButtonElementClick);
    });

    document.body.addEventListener("keyup", onDocumentKeypress);

    document.querySelector('button.game__buttons__row__action_button[data-action="clear"]')
        .addEventListener("click", () => newGame());

    document.querySelector('select.game__buttons__row__action_button[data-action="difficulty"]')
        .addEventListener("change", onDifficultyChange);

    GameState.hasAttachedEventListeners = true;

}


/**
 * Game Logic
 */

const drawLatestGridToCellElements = () => {

    const latestGrid = GameState.currentGrids[GameState.currentGrids.length - 1];
    if (gridIsValid(latestGrid) === false) return false;

    for (let row = 1; row <= 9; row++) {
        const rowValues = latestGrid[row - 1];

        for (let cell = 1; cell <= 9; cell++) {
            const cellValue = rowValues[cell - 1];

            const gridPosition = [row, cell];

            const cellElement = getCellElementFromGridPosition(gridPosition);
            if (cellElementIsValid(cellElement) === false) continue;

            const textValue = cellValue == null ? "&nbsp;" : cellValue;
            cellElement.innerHTML = `<span>${textValue}</span>`;
        }
    }

    refreshBoardStyling();

};

const cloneLatestGrid = () => {

    const latestGrid = GameState.currentGrids[GameState.currentGrids.length - 1];
    if (gridIsValid(latestGrid) === false) return false;

    const clonedGrid = [];

    for (let row = 0; row < 9; row++) {
        clonedGrid[row] = [];

        for (let cell = 0; cell < 9; cell++) {
            clonedGrid[row][cell] = latestGrid[row][cell];
        }
    }
    
    GameState.currentGrids.push(clonedGrid);

};

const commitChangeToLatestGridGridPosition = (gridPosition, value = null) => {

    if (gridPositionIsValid(gridPosition) === false) return false;
    if (numberValueIsValid(value) === false && value !== null) return false;

    const [row, cell] = gridPosition;

    cloneLatestGrid();

    GameState.currentGrids[GameState.currentGrids.length - 1][row - 1][cell - 1] = value;

    gridHasUniqueNumberValues(GameState.currentGrids[GameState.currentGrids.length - 1]);

    if (gridHasNoMissingNumberValues(GameState.currentGrids[GameState.currentGrids.length - 1])) {
        GameState.isPlaying = false;
        GameState.isFinished = true;
    }

    drawLatestGridToCellElements();

    refreshBoardStyling();

};

const generateUniqueSolvedGrid = () => {

    /**
     * @type string
     */
    const generatedString = sudoku.generate(GameState.generatorDifficulty);

    return generatedString.split('').reduce(
        (reduction, currentCharacter, index) => {
            const rowIndex = Math.floor(index / 9);

            if (reduction[rowIndex] == null) { 
                reduction[rowIndex] = [];
            }

            reduction[rowIndex].push(currentCharacter === '.' ? null : parseInt(currentCharacter));

            return reduction;
        },
        [],
    );

};

const gridHasUniqueNumberValues = (grid) => {

    if (gridIsValid(grid) === false) return false;

    GameState.conflictingCells = [];

    // check rows for duplicates
    for (let row = 0; row < 9; row++) {
        const duplicateRowValues = grid[row].filter((value, index, self) => self.indexOf(value) !== index && value != null);
        
        if (duplicateRowValues.length > 0) {
            GameState.conflictingCells.push(['row', row + 1]);
        }
    }

    // check columns for duplicates
    for (let column = 0; column < 9; column++) {
        const duplicateColumnValues = grid.map((row) => row[column]).filter((value, index, self) => self.indexOf(value) !== index && value != null);

        if (duplicateColumnValues.length > 0) {
            GameState.conflictingCells.push(['column', column + 1]);
        }
    }

    // check boxes for duplicates
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxColumn = 0; boxColumn < 3; boxColumn++) {
            let duplicateBoxValues = [];

            for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
                for (let column = boxColumn * 3; column < boxColumn * 3 + 3; column++) {
                    duplicateBoxValues.push(grid[row][column]);
                }
            }

            duplicateBoxValues = duplicateBoxValues.filter((value, index, self) => self.indexOf(value) !== index && value != null);

            if (duplicateBoxValues.length > 0) {
                GameState.conflictingCells.push(['box', [boxRow + 1, boxColumn + 1]]);
            }
        }
    }

    return true;

};

const gridHasNoMissingNumberValues = (grid) => {

    if (gridIsValid(grid) === false) return false;

    for (let row = 0; row < 9; row++) {
        if (grid[row].includes(null) || grid[row].includes(undefined)) return false;
    }

    return true;

};

const newGame = () => {

    GameState.isPlaying = true;
    GameState.isPaused = false;
    GameState.isFinished = false;

    GameState.solvedGrid = generateUniqueSolvedGrid();
    GameState.currentGrids = [GameState.solvedGrid];

    GameState.conflictingCells = [];

    unsetActiveCellElement(null);

    drawLatestGridToCellElements();

};


/**
 * Bootstrapping
 */

const run = () => {
    
    addEventListeners();

    newGame();

    setTimeout(() => { document.body.style.visibility = 'visible'; }, 100);

};

document.addEventListener("DOMContentLoaded", () => run());