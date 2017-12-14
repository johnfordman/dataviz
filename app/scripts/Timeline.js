import utils from '../helpers/utils';
import numbersUtils from '../helpers/numbersUtils';
import apiUtils from '../helpers/apiUtils';
import Point from './Point.js'
import Event from './Event.js'
import TweenMax from 'gsap'


export default class Timeline extends Event {

	constructor(nbPoint,valueArr,yearArr) {
    //console.log(window.STORAGE)
    //iceFloe from storage
    super()
    this.iceArr = window.STORAGE.icefloe
    //overlay year
    this.overlay = document.querySelector('.overlay')
    this.overlayText = document.querySelector('.overlay_co2')
    this.overlayYear = document.querySelector('.overlay_year')

    //fixDAta 
    this.fixDataContainer = document.querySelector('.fix_data-container')

    //Container canvas
    this.yearArr = yearArr
    this.valueArr = valueArr
    this.valueMax = Math.max.apply(Math, this.valueArr);
    this.valueMin = Math.min.apply(Math, this.valueArr);
    this.nbPoint = nbPoint
    this.containerTimeline = document.querySelector('.container-ui')
    this.containerTimelineW = this.containerTimeline.clientWidth 
    this.containerTimelineH = this.containerTimeline.clientHeight
    
    //canvas timeline
    this.canvasTimeline = this.containerTimeline.querySelector('#canvasTimeline')
    this.canvasTimeline.width = this.containerTimelineW
    this.canvasTimeline.height = this.containerTimelineH

    this.posX = 5;
    this.posY = 100-5

    this.pointEquidistance = this.containerTimelineW / this.nbPoint;
    this.canvasTimeline.style.height = this.containerTimelineH
    this.ctx = this.canvasTimeline.getContext('2d')
    this.cursor = document.querySelector('.cursor')
    this.cursorBar = document.querySelector('.cursor-line-move')

    this.eventsList = ["drag","dragup"]

    this.pointArr = []
    this.dataCircleArr = []
    this.pathPosArr = []
    this.firstYear = 1961
    this.drawPoint()
    this.drawLines()
    this.drag()

   // this.createPosArr()
   // this.drawline()

 }

 createPosArr(){
  for(let i = 0;i < this.nbPoint; i++){
    var posPath = []
    var dataCircle = []
    let pointY  = numbersUtils.map(this.valueArr[i], this.valueMin, this.valueMax, 100-5, 5);
    posPath.push(this.posX,pointY)
    dataCircle.push(this.posX,pointY,this.valueArr[i],this.firstYear)
    this.posX += this.pointEquidistance
    this.firstYear++
    this.pathPosArr.push(posPath)
    this.dataCircleArr.push(dataCircle)
  }
}



drawPoint(){
  // console.log('max value',this.valueMax)
  // console.log('min value',this.valueMin)
  // console.log(this.valueArr)

  for(let i = 0;i < this.nbPoint; i++){
    let pointY  = numbersUtils.map(this.valueArr[i], this.valueMin, this.valueMax, 100-5, 5);
    let point = new Point(this.posX,pointY,this.valueArr[i]);
    point.draw(this.ctx);
    this.pointArr.push(point);
    this.posX += this.pointEquidistance
  }
}

drawLines(){
  this.ctx.save()
  this.ctx.beginPath()
  // console.log(this.pointArr[0].xPos)
  // console.log(this.pointArr[0].yPos)

  this.ctx.moveTo(this.pointArr[0].xPos, this.pointArr[0].yPos)
  for(var i = 0; i< this.pointArr.length; i++){
    this.ctx.lineTo(this.pointArr[i].xPos, this.pointArr[i].yPos)

  }

  this.ctx.strokeStyle = "#56F7FD";
  this.ctx.lineWidth=3;
  this.ctx.stroke()
  this.ctx.restore()
}

drag(){
  var mouseup, mousemove;
  this.cursor.addEventListener('mousedown',(e)=>{
    this.activeDrag = true;
  })
  window.addEventListener('mouseup',(e) =>{
    this.fixDataContainer.classList.remove('is_hidden')
    this.containerTimeline.classList.remove('is-grabbing')
    this.activeDrag = false;
    document.querySelector('body').classList.remove('is-grabbing')
    this.overlay.classList.remove('is_scrolling')
    this.dispatch("dragup")
  })
  window.addEventListener('mousemove',(e) =>{
    if(this.activeDrag) {    
      this.fixDataContainer.classList.add('is_hidden')
      document.querySelector('body').classList.add('is-grabbing')

      this.containerTimeline.classList.add('is-grabbing')
      this.overlay.classList.add('is_scrolling')

      var left = e.clientX - window.innerWidth/8;
      var aR = Math.floor(left / this.pointEquidistance); 
      this.current = aR;
      STORAGE.currentPos = this.current
      if(aR >= 0 && aR < this.valueArr.length - 1){
        this.overlayText.innerText = `${numberWithSpaces(this.valueArr[aR])} kt` 
        this.overlayYear.innerText = this.yearArr[aR]
        var a = this.pointArr[aR]
        var b = this.pointArr[aR + 1]

        var alpha = (b.yPos - a.yPos) / (b.xPos - a.xPos);
        var beta = b.yPos - alpha*b.xPos;

        this.cursor.setAttribute("data-value",  `${numberWithSpaces(this.valueArr[aR])}`)
        this.cursor.setAttribute("style", `top:${alpha*left + beta}; transform:translateX(${left}px);`)
        this.cursorBar.setAttribute("style", `transform:translateX(${left}px);`)
        this.dispatch("drag")
      }

    }
  }); 

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

}


}




