'use strict'

const EMPTY=' '
const MINE='🧨'
const FLAG='🚩'
const LIFE='❤'
var gBoerd
var gLevel = { size: 4, mines: 2 };
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0,lives: 3 }
var gMinesCords
var gcounterIntervalId
var gTimerId

function initGame(){
   gBoerd=createMat(gLevel.size)
   setImg(1)
   gGame.shownCount=0
   gGame.markedCount=0
   gGame.lives=3
   gGame.isOn=false
   setLifedisplay()
   printMat(gBoerd, ".board-container")
   clearInterval(gTimerId)
   
   console.table(gBoerd)
}

function choseLevel(level=4){
    gLevel.size=level
    switch(level) {
        case 4:
          gLevel.mines=2
          break;
        case 8:
          gLevel.mines=12
          break;
        case 12:
          gLevel.mines=30
         break;
        default:
          gLevel.mines=2
      }
    initGame()
     return gLevel
   }


function getMines(numOfMines,indxi,indxj){
    gMinesCords=[]
    const EmptyCells =getEmptyCells(gBoerd)
    console.log('EmptyCells',EmptyCells)
    for (var i=0;i<numOfMines;i++){
        var cordes=drawNumBetter(EmptyCells)
        // console.log('cordes',cordes);
        // console.log('i',cordes.i,indxi);
        // console.log('j',cordes.j,indxj);
        if(cordes.i===indxi && cordes.j===indxj){
            i--
            continue
        }else{
        gBoerd[cordes.i][cordes.j].isMine=true
        gMinesCords.push({i: cordes.i,j: cordes.j})
        }
    }
    console.log('gMinesCords', gMinesCords);
}

function getNeighbors(){
  for (var i=0;i<gBoerd.length;i++){
    for(var j=0;j<gBoerd.length;j++){
         gBoerd[i][j].minesAroundCount=countNeighbors(i,j,gBoerd)
    }
  } 
}

function firstClick(i,j){
    console.log('first click',i,j);
    gGame.isOn=true
    getTime()
    getMines(gLevel.mines,i,j)
    getNeighbors()
    printMat(gBoerd, ".board-container")
    return
}

function cellClicked(ev,elCell, i, j){
    // console.log('ev',ev)
    // console.log('elCell',elCell)

    if(!gGame.isOn && !gGame.shownCount) firstClick(i,j)
  if(gGame.isOn){
    if(gBoerd[i][j].isMine) getStrike(elCell, i, j)
    if(gBoerd[i][j].isMarked) return
    if(gBoerd[i][j].isShown) return
    gGame.shownCount+=1
    // console.log('gGame.shownCount',gGame.shownCount);
    if(!gBoerd[i][j].minesAroundCount && !gBoerd[i][j].isMine) expandShown(gBoerd, elCell, i, j)

    //model
    gBoerd[i][j].isShown=true
    //DOM
    elCell.classList.toggle('Shown')
    printMat(gBoerd, ".board-container")
    checkGameOver()
    // if(checkGameOver()) alert('You Won 🏆')
 }///if(gGame.isOn)
}

function expandShown(board, elCell, i, j){
    showNeighbors(i, j, board)
    printMat(gBoerd, ".board-container")
}

function rigutClicked(elCell,i,j){
    //model
    gBoerd[i][j].isMarked=!gBoerd[i][j].isMarked
    //DOM
    elCell.innerHTML = (gBoerd[i][j].isMarked)? FLAG:EMPTY
    // elCell.classList.toggle('Shown')
    gGame.markedCount+=1
    checkGameOver()
    // if(checkGameOver()) alert('You Won 🏆')
    // console.log('gGame.markedCount',gGame.markedCount);
}

function checkGameOver(){
    const toShown=gLevel.size**2-gLevel.mines
    const Shown=gGame.shownCount
    const  marked=gGame.markedCount
    if(Shown===toShown && marked===gLevel.mines) getWin()
    return false
}

function getWin(){
    setImg(3)
    gGame.isOn=false
    alert('You Won 🏆')
}

function getLoss(elCell, i, j){
  for(var i=0;i<gLevel.mines;i++){
    var cords=gMinesCords[i]
    gBoerd[cords.i][cords.j].isShown=true
  }
  setImg(2)
  elCell.classList.toggle('loss')
  printMat(gBoerd, ".board-container")
  gGame.isOn=false
  clearInterval(gTimerId)
//   alert('You Lose 😥')
}

function getStrike(elCell, indxi, indxj){
    gGame.lives-- 
    if(!gGame.lives) getLoss(elCell, indxi, indxj)
    const elLive=document.querySelector(".lives")
    elLive.style.transform='scale(1.3)'
    setLifedisplay()
    const myTimeoutId =setTimeout(()=>{
        elLive.style.transform='scale(1)'
        clearTimeout(myTimeoutId)},800)
} 

function setImg(imgIndx=1){
    const elImg=document.querySelector(".img-continer")
    elImg.innerHTML=`<img onclick="initGame()" clss="smiley" src="img/${imgIndx}.jpg">`
}

function getTime(){
    var start=new Date()
    const elTime=document.querySelector(".timer")
    elTime.innerHTML=''
        gTimerId =setInterval(()=>{
        var now=new Date()-start
        elTime.innerHTML=now
        gGame.secsPassed=now},300)
}

function setLifedisplay(){
    const elLive=document.querySelector(".lives")
    elLive.innerHTML=''
    for(var i=0;i<gGame.lives;i++){
      console.log('elLive',elLive);
      elLive.innerHTML+= LIFE + ' '
    } 
}

