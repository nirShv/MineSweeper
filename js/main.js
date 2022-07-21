'use strict'

const EMPTY=' '
const MINE='🧨'
const FLAG='🚩'
const LIFE='❤'
const HINTS='💡'

var gBoerd
var gLevel = { size: 4, mines: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0,lives: 3,hints: 3,safeMove: 3 }
var gMinesCords=[] 
var gcounterIntervalId
var gTimerId
var gIsHintStatus=false
var glasMoveCords=[]
var gisManually=false
var gPlayingManuallyM=false

/*----------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------Building the game board-------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
function initGame(){
   gBoerd=createMat(gLevel.size)
   setImg(1)
   gGame.shownCount=0
   gGame.markedCount=0
   gisManually=false
   gPlayingManuallyM=false
   gGame.lives=3
   gGame.hints=3
   gGame.safeMove= 3 
   gGame.isOn=false
   setLifedisplay()
   setHintsdisplay()
   setRecordsTable()
   setStatus()
   printMat(gBoerd, '.board-container')
   clearInterval(gTimerId)
   initBtns()
  gMinesCords=[]
   console.table(gBoerd)
}

function initBtns(){
  const elTime=document.querySelector('.timer')
  elTime.innerHTML='Timer'
  const elbtn=document.querySelector(`.safe`)
  elbtn.innerText=`safe Click \n3 clicks available`
  const elbtnM=document.querySelector(`.Manually`)
  elbtnM.innerText=`Manually positioned mines`
  elbtnM.classList.remove('safeMove')
}

function choseLevel(level=4){
    gLevel.size=level
    switch(level) {
        case 4:
          gLevel.mines=2
          break
        case 8:
          gLevel.mines=12
          break
        case 12:
          gLevel.mines=30
         break
        default:
          gLevel.mines=2
      }
    initGame()
     return gLevel
}

function getMines(numOfMines,indxi,indxj){
    gMinesCords=[]
    const EmptyCells =getEmptyCells(gBoerd)
    for (var i=0;i<numOfMines;i++){
        var cordes=drawNumBetter(EmptyCells)
        if(cordes.i===indxi && cordes.j===indxj){
            i--
            continue
        }else{
        gBoerd[cordes.i][cordes.j].isMine=true
        gMinesCords.push({i: cordes.i,j: cordes.j})
        }
    }
}

function getNeighbors(){
  for (var i=0;i<gBoerd.length;i++){
    for(var j=0;j<gBoerd.length;j++){
         gBoerd[i][j].minesAroundCount=countNeighbors(i,j,gBoerd)
    }
  } 
}

function setImg(imgIndx=1){
  const elImg=document.querySelector('.img-continer')
  elImg.innerHTML=`<img onclick="initGame()" clss="smiley" src="img/${imgIndx}.jpg">`
}

function getTime(){
  var start=new Date()
  const elTime=document.querySelector('.timer')
  elTime.innerHTML=''
      gTimerId =setInterval(()=>{
      var now=(new Date()-start)/1000
      elTime.innerHTML=now
      gGame.secsPassed=now},100)
}

function setStatus(){
  const elStatus=document.querySelector(`.status`)
  elStatus.innerText=`Stage mines: ${gLevel.mines} \nMarked mines: ${gGame.markedCount}`
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------Clickes------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
function cellClicked(elCell, i, j){
    if(gIsHintStatus) {
      getHint(gBoerd, elCell, i, j)
      return
    }
    if(gisManually) {
      ManuallyPositioned(gBoerd, elCell, i, j)
      return
    }
    if(!gGame.isOn && !gGame.shownCount) firstClick(i,j)
  if(gGame.isOn){
    if(gBoerd[i][j].isMarked) return
    if(gBoerd[i][j].isMine) getStrike(elCell, i, j)
    if(gBoerd[i][j].isShown) return
    gGame.shownCount+=1
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

function rightClicked(elCell,i,j){
    //model
    gBoerd[i][j].isMarked=!gBoerd[i][j].isMarked
    //DOM
     if (gBoerd[i][j].isMarked){
        elCell.innerHTML =FLAG
        gGame.markedCount++
        }else{
        elCell.innerHTML= EMPTY
        gGame.markedCount--
        } 
    // elCell.classList.toggle('Shown')
    
    if(!gGame.isOn && !gGame.shownCount) firstClick(i,j)
    setStatus()
    checkGameOver()
    // if(checkGameOver()) alert('You Won 🏆')
}

function firstClick(i,j){
  // console.log('first click',i,j);
  gGame.isOn=true
  getTime()
  !gPlayingManuallyM? getMines(gLevel.mines,i,j):ManuallyMines()
  getNeighbors()
  printMat(gBoerd, '.board-container')
  return
}

function expandShown(board, elCell, i, j){
  showNeighbors(i, j, board,true)
  printMat(gBoerd, '.board-container')
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------Game outcome------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
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
    clearInterval(gTimerId)
    if(getRecords()) alert('Congratulations!!! \nYou enter the record table of this stage🏆')
    // alert('You Won 🏆')
}

function getLoss(elCell, i, j){
  for(var i=0;i<gLevel.mines;i++){
    var cords=gMinesCords[i]
    gBoerd[cords.i][cords.j].isShown=true
  }
  setImg(2)
  elCell.classList.toggle('loss')
  printMat(gBoerd, '.board-container')
  gGame.isOn=false
  clearInterval(gTimerId)
//   alert('You Lose 😥')
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------Lifes------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
function getStrike(elCell, indxi, indxj){
  gGame.lives-- 
  if(!gGame.lives) getLoss(elCell, indxi, indxj)
  gGame.markedCount++
  gGame.shownCount--
  const elLive=document.querySelector('.lives')
  elLive.style.transform='scale(1.3)'
  setLifedisplay()
  setStatus()
  const myTimeoutId =setTimeout(()=>{
      elLive.style.transform='scale(1)'
      clearTimeout(myTimeoutId)},800)
} 

function setLifedisplay(){
    const elLive=document.querySelector('.lives')
    elLive.innerHTML=''
    for(var i=0;i<gGame.lives;i++){
      elLive.innerHTML+= LIFE + ' '
    } 
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------HintS------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
function getHintStatus(elHint){
  if(!gGame.hints) return
  if(gIsHintStatus) return
  if(!gGame.isOn && !gGame.shownCount){
     alert("There is nothing to see yet \nbe patient 🤗")
     return
  }
  gIsHintStatus=true
}

function getHint(gBoerd, elCell, i, j){
  if(gBoerd[i][j].isShown) return
  glasMoveCords=[]
  showNeighbors(i, j, gBoerd, true)
  gBoerd[i][j].isShown=true
  printMat(gBoerd, '.board-container')
  var hintTimeoutId=setTimeout(()=>{
    getBackFromHint()
    gBoerd[i][j].isShown=false
    printMat(gBoerd, '.board-container')
    gGame.hints--
    setHintsdisplay()
    gIsHintStatus=false
    clearTimeout(hintTimeoutId)},1000)

}

function setHintsdisplay(){
  const elHint=document.querySelector('.hints')
  elHint.innerHTML=''
  for(var i=0;i<gGame.hints;i++){
    elHint.innerHTML+= HINTS + ' '
  } 
}

// function setHintsdisplay(){
//   if(gElHint) gElHint.innerHTML=ACTIVEHINT
//   const elHints=document.querySelector(".hints")
//   // elHint.innerHTML=''
//   console.log('gGame.hints',gGame.hints);
//   for(var i=0;i<gGame.hints;i++){
//     const elHint=elHints.querySelector(`.hint${i+1}`)
//     elHint.innerHTML+= HINTS
//   } 
// }
/*----------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------Best Score------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
function getScore(){
 return Math.round(gGame.hints*50+gGame.lives*35-gGame.secsPassed)
}

function getRecords(){
var score=getScore()
var level=gLevel.size

if (typeof(Storage) !== 'undefined') {
switch(level) {
    case 4:
      if (localStorage.bestScore4) {
        localStorage.bestScore4 = (+localStorage.bestScore4 > score)? localStorage.bestScore4 : score
      } else {
        localStorage.bestScore4 = score
        alert(`Congratulations!!! \nBreak record for stage: ${level} \nYour score: ${score}`)
        return true
      }
      break
    case 8:
      if (localStorage.bestScore8) {
        localStorage.bestScore8 = (+localStorage.bestScore8 > score)? localStorage.bestScore8 : score
      } else {
        localStorage.bestScore8 = score
        alert(`Congratulations!!! \nBreak record for stage: ${level} \nYour score: ${score}`)
        return true
      }
      break
    case 12:
      if (localStorage.bestScore12) {
        localStorage.bestScore12 = (+localStorage.bestScore12 > score)? localStorage.bestScore12 : score
      } else {
        localStorage.bestScore12 = score
        alert(`Congratulations!!! \nBreak record for stage: ${level} \nYour score: ${score}`)
        return true
      }
     break
  }
      const elRecorsd=document.querySelector('.records')
      elRecorsd.querySelector(`.records-level${level}`).innerHTML = `Leval ${level} 
                                                    best Score: ${localStorage.getItem(`bestScore${level}`)} <br/> <br/>`
    } else {
      document.querySelector('.records').innerHTML = 'Sorry, your browser does not support Web Storage...'
    }
    return false
}

function setRecordsTable(){
  const elRecorsd=document.querySelector('.records')
  if (localStorage.bestScore4) {
  elRecorsd.querySelector(`.records-level4`).innerHTML = `Leval 4 best Score: ${localStorage.getItem(`bestScore4`)} <br/> <br/>`
  }else{
  elRecorsd.querySelector(`.records-level4`).innerHTML = `Leval 4 best Score: TBD <br/> <br/>`
  }

  if (localStorage.bestScore8) {
  elRecorsd.querySelector(`.records-level8`).innerHTML = `Leval 8 best Score: ${localStorage.getItem(`bestScore8`)} <br/> <br/>`
}else{
  elRecorsd.querySelector(`.records-level8`).innerHTML = `Leval 8 best Score: TBD <br/> <br/>`
  }

  if (localStorage.bestScore12) {
  elRecorsd.querySelector(`.records-level12`).innerHTML = `\nLeval 12 best Score: ${localStorage.getItem(`bestScore12`)} <br/> <br/>`
  }else{
  elRecorsd.querySelector(`.records-level12`).innerHTML = `\nLeval 12 best Score: TBD <br/> <br/>` 
  }
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------Safe-Click-----------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/

function geySafeMove(){
  const safeMoveArr=getSafeMove(gBoerd)
  if(!gGame.isOn && !gGame.shownCount){
    alert("There is nothing to see yet \nbe patient 🤗")
    return
 }
  if (!safeMoveArr.length || !gGame.safeMove){
     alert('There are no more sefe moves')
     return
  }
  const randSafeMove=drawNumBetter(safeMoveArr)
  const elCell=document.querySelector(`.cell-${randSafeMove.i}-${randSafeMove.j}`)
  elCell.classList.add('safeMove')
  var safeTimeId=setTimeout(() => {
    elCell.classList.remove('safeMove')
    clearTimeout(safeTimeId)
  }, 2000);
  const elbtn=document.querySelector(`.safe`)
  elbtn.innerText=`safe Click \n${--gGame.safeMove} clicks available`
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------Manually positioned mines-------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------*/
function getManuallySratus(){
  const elbtnM=document.querySelector(`.Manually`)
  if(gisManually){
    gisManually=false
    gPlayingManuallyM=true
    elbtnM.classList.remove('safeMove')
    if(gMinesCords.length===gLevel.mines){
    firstClick()
    }else{
      alert(`You need to placed ${gLevel.mines-gMinesCords.length} more mines befor sarting the game`)
    }
  }else{
    gisManually=true
    elbtnM.classList.add('safeMove')
    elbtnM.innerHTML=`After placing the mines click again to Start to play`
  }

}

function ManuallyPositioned(gBoerd, elCell, i, j){
  if(gMinesCords.length!==gLevel.mines){
  const elCell=document.querySelector(`.cell-${i}-${j}`)
  elCell.classList.add('safeMove')
  gMinesCords.push({i,j})
  setManuallyStatus()
  }else{
    alert('You have placed all possible mines for this stage')
  }
}

function ManuallyMines(){
 for(var i=0;i<gMinesCords.length;i++){
  gBoerd[gMinesCords[i].i][gMinesCords[i].j].isMine=true
 }
}

function setManuallyStatus(){
  const elStatus=document.querySelector(`.status`)
  elStatus.innerText=`Stage mines: ${gLevel.mines} \nPlaced mines: ${gMinesCords.length}`
}