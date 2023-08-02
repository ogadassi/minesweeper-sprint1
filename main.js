'use strict'
const MINE = '💣'
const SHOWN = '.'
const MARKED = '🚩'
var gCount
var gBoard
var lvl = 4
function onInit() {
    gBoard = createBoard(lvl)
    renderBoard(gBoard)
    // console.log('loaded');
}

function createBoard() {
    const board = []
    for (var i = 0; i < lvl; i++) {
        board[i] = []
        for (var j = 0; j < lvl; j++) {
            var cell = {

                isMine: i === (board.length) / 2 && j === (board[i].length) / 2 || i === (board.length + 1) / 2 && j === (board[i].length) / 2,
                isShown: false,
                isMarked: false,
                minesAroundCount: 0,
            }
            board[i][j] = cell
        }
    }
    //console.log(board)
    for (var i = 0; i < lvl; i++) {
        for (var j = 0; j < lvl; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
    //console.log(board);
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var cellContent = ''
            if (cell.isMine) cellContent += MINE
            if (cell.isShown) cellContent += SHOWN
            if (cell.isMarked) cellContent += MARKED


            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}
;
function setMinesNegsCount(board, rowIdx, colIdx) {
    gCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) gCount++
        }
    }
    // console.log(gCount)
    return gCount
}


function onCellClicked(elCell, i, j) {
    var elCell = document.querySelector('table td')
    if(elCell.isMine) console.log('boom');
    console.log(elCell, i,j);
}