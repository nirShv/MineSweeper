// creates a board and returns it - data model
function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            const cell= {
                minesAroundCount: 0, 
                isShown: false, 
                isMine: false, 
                isMarked: false
            }
            row.push(cell)
        }
        mat.push(row)
    }
    return mat
}

//print mat to the DOM
function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody class="board">'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j]
            var className = `cell cell-${i}-${j}`
            className += mat[i][j].isShown? ' Shown':' hidden'
            strHTML +=`<td oncontextmenu="javascript:rigutClicked(this,${i}, ${j});return false;" 
                        onclick="cellClicked(event, this, ${i}, ${j})" 
                        class="${className}">`
            if(mat[i][j].isShown){
            strHTML += mat[i][j].isMine?  `${MINE}` : `${mat[i][j].minesAroundCount}`
            }else{
            strHTML += mat[i][j].isMarked?  `${FLAG}`:`${EMPTY}`
            }
        }
        strHTML += '</td></tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// // location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

//get the game board and return an array of empty location{i,j}
function getEmptyCells(board){
    var emptyCellsCords=[]
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var  cell=board[i][j];
            if (cell.isMine===false) emptyCellsCords.push({i,j})
        }
    }
    return emptyCellsCords
}

function drawNumBetter(arr) {
    var Idx = getRandomInt(0,arr.length)
        return arr.splice(Idx,1)[0]
}


//Random Integer NOT Inclusive
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min )) + min
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine === true) neighborsCount++
            // showOrCount(mat[i][j])
        }
    }
    return neighborsCount;
}

function showNeighbors(cellI, cellJ, mat) {
    // var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if(mat[i][j].isShown) continue // if combine 
            mat[i][j].isShown=true
            gGame.shownCount+=1
            // console.log('gGame.shownCount',gGame.shownCount)
        }
    }
    return mat;
}

function showOrCount(cell,i,j){
    if (cell.isMine === true){
        return neighborsCount++
    }else{
        if (!mat[i][j].isShown) gGame.shownCount+=1
        mat[i][j].isShown=true
        return
    }

}