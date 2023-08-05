'use strict'
const MINE = '💣'
const SHOWN = '.'
const MARKED = '🚩'
var gCount
var gLives = 3
var gBoard
var gIsGameOn = true
var gShownCells = 0
var gIsFirstClick = true
var gMarkedBombs = 0
var gClickedBombs = 0
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
        onRestart()
    } else if (diff.contains('diff2')) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gBoard = createBoard(gLevel.SIZE)
        onRestart()
    } else if (diff.contains('diff3')) {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gBoard = createBoard(gLevel.SIZE)
        onRestart()
    }
    elBtn.style.backgroundColor = 'rgb(184, 236, 219)'
    gCount = 1
    renderBoard(gBoard)
    onInit()
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
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cellContent = ''
            strHTML += `<td class='row${i}-col${j}' oncontextmenu="onMarkCell(event, this, ${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`
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

    if (gIsGameOn) {
        const cell = gBoard[i][j]
        if (gIsFirstClick) {
            setMines(gBoard)
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
                    //           console.log(board[i][j].minesAroundCount);
                }
            }
            gIsFirstClick = false
        }

        if (cell.isShown) return

        if (cell.isMarked) return

        if (!cell.isMine) {
            elCell.style.backgroundColor = 'white'
            //showSafeNegs(i, j)
        }
        if (!cell.isMine && cell.minesAroundCount > 0) elCell.innerText = cell.minesAroundCount
        if (!cell.isMine && !cell.isShown) {
            cell.isShown = true
            gShownCells++
        }
        if (cell.isMine && cell.isShown) return
        if (cell.isMine) {
            cell.isShown = true
            elCell.innerText = '💣'
            if (gLives > 0) { elCell.style.backgroundColor = 'rgb(242, 231, 105)' }
            else { elCell.style.backgroundColor = 'rgb(157, 62, 62)' }
            gLives--
            gClickedBombs++
            document.querySelector('.lives').innerText = 'Lives:' + gLives
            //console.log(gLives);
            if (gLives === 0) gameOver()
        }

        detectWin()
        console.log(gMarkedBombs, gClickedBombs, gShownCells,);
    }
    //console.log(gBoard);
}

function onMarkCell(event, elCell, i, j) {
    event.preventDefault();
    const cell = gBoard[i][j]
    if (cell.isShown) return
    if (cell.isMarked) {
        elCell.innerText = ''
        cell.isMarked = false
        if (cell.isMine) gMarkedBombs--
    } else {
        elCell.innerText = MARKED
        cell.isMarked = true
        if (cell.isMine) gMarkedBombs++
    }
    detectWin()
    console.log(gMarkedBombs, gClickedBombs, gShownCells,);
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

function revealBombs(lost) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector('.row' + i + '-col' + j)
                elCell.innerText = '💣'
                if (lost) elCell.style.backgroundColor = 'rgb(157, 62, 62)'
            }
        }
    }
}




function detectWin() {
    if ((gShownCells === (gLevel.SIZE ** 2) - gLevel.MINES && gMarkedBombs === (gLevel.MINES - gClickedBombs))) {
        var elEmoji = document.querySelector('.emoji')
        elEmoji.innerText = '😎'
        gIsGameOn = false
        revealBombs(false)
        console.log(gShownCells);
    }
}

function gameOver() {
    gIsGameOn = false
    var elEmoji = document.querySelector('.emoji')
    elEmoji.innerText = '🤯'
    revealBombs(true)
    //console.log('Game Over');
}






function onRestart() {
    gIsGameOn = true
    var elEmoji = document.querySelector('.emoji')
    elEmoji.innerText = '😀'
    gMarkedBombs = 0
    gShownCells = 0
    gClickedBombs = 0
    gLives = 3
    document.querySelector('.lives').innerText = 'Lives:' + gLives
    gIsFirstClick = true
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