'use strict'
const MINE = '💣'
const SHOWN = '.'
const MARKED = '🚩'
var gCount
var gBoard
var gIsGameOn = true
var gShownCells = 0
//var gIsFirstClick = true
var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
}
function getDifficulty(elBtn) {
    var clearColor = document.querySelectorAll('.diff')
    for (var i = 0; i < clearColor.length; i++) {
        clearColor[i].style.backgroundColor = ''
    }
    var diff = elBtn.classList
    if (diff.contains('diff1')) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gBoard = createBoard(gLevel.SIZE)
    } else if (diff.contains('diff2')) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gBoard = createBoard(gLevel.SIZE)
    } else if (diff.contains('diff3')) {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gBoard = createBoard(gLevel.SIZE)
    }
    elBtn.style.backgroundColor = 'rgb(184, 236, 219)'
    gCount = 1
    renderBoard(gBoard)
}

function createBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                isMine: 0,
                isMarked: false,
                minesAroundCount: 0,
            }
            board[i][j] = cell
        }
    }
    //console.log(board)
    setMines(board)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
            //           console.log(board[i][j].minesAroundCount);
        }
    }
    //  console.log(board);

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var cellContent = ''



            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(gBoard, rowIdx, colIdx) {
    gCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gLevel.SIZE) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) gCount++
        }
    }
    // console.log(gCount)
    return gCount
}


function onCellClicked(elCell, i, j) {
    // if (gIsFirstClick) {
    //     setMines(gBoard[i][j])
    //     gIsFirstClick = false
    // }
    if (gIsGameOn) {
        const cell = gBoard[i][j]
        if (!cell.isMine) {
            elCell.style.backgroundColor = 'white'
            //showSafeNegs(i, j)
        }
        if (!cell.isMine && cell.minesAroundCount > 0) elCell.innerText = cell.minesAroundCount
        if (!cell.isMine && !cell.isShown) {
            cell.isShown = true
            gShownCells++
        }
        if (cell.isMine) {
            elCell.innerText = '💣'
            elCell.style.backgroundColor = 'rgb(157, 62, 62)'
            gameOver()
        }
        if (cell.isMarked) return
        detectWin()
    }
    //console.log(gBoard);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function markCell(elCell, i, j) {
    const cell = gBoard[i][j]
}


//bonus
// function showSafeNegs(rowIdx,colIdx){
//    var elCell = document.querySelectorAll('td')
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= gLevel.SIZE) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= gLevel.SIZE) continue
//             var currCell = gBoard[i][j]
//             if (!currCell.isMine) elCell.style.backgroundColor = 'white'
//         }
//     }
// }











/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function detectWin() {
    if (gShownCells === (gLevel.SIZE ** 2) - gLevel.MINES) {
        var elEmoji = document.querySelector('.emoji')
        elEmoji.innerText = '😎'
        gIsGameOn = false
    }
}

function gameOver() {
    gIsGameOn = false
    var elEmoji = document.querySelector('.emoji')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine) {

            }
        }
    }
    elEmoji.innerText = '🤯'
    //console.log('Game Over');
}

function onRestart() {
    gIsGameOn = true
    var elEmoji = document.querySelector('.emoji')
    elEmoji.innerText = '😀'
    gShownCells = 0
    onInit()
}



function setMines(board, row, col) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var row = Math.floor(Math.random() * gLevel.SIZE);
        var col = Math.floor(Math.random() * gLevel.SIZE);

        while (board[row][col].isMine) {
            row = Math.floor(Math.random() * gLevel.SIZE);
            col = Math.floor(Math.random() * gLevel.SIZE);
        }
        board[row][col].isMine = true;


    }
}





//function getRandomIntInclusive(min, max) {
  //  return Math.floor(Math.random() * (max - min + 1)) + min
//}


//predictable static mines
//isMine: i === (board.length) / 2 && j === (board[i].length) / 2  i === (board.length + 1) / 2 && j === (board[i].length) / 2,