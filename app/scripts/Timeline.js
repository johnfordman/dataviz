import utils from '../helpers/utils';
//import datas from '../datas/datas.json'
import datas from '../datas/datafinal.json'
import _ from 'underscore';
import numbersUtils from '../helpers/numbersUtils';
import apiUtils from '../helpers/apiUtils';
import Point from './Point.js'
import TweenLite from 'gsap'
//import DrawSVG from '../libs/gsap/plugins/DrawSVGPlugin'


export default class Timeline {

	constructor(nbPoint,valueArr,yearArr) {
    //overlay year
    this.overlay = document.querySelector('.overlay')
    this.overlayText = document.querySelector('.overlay_co2')
    this.overlayYear = document.querySelector('.overlay_year')

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
    let pointY  = numbersUtils.map(this.valueArr[i], this.valueMin, this.valueMax, 100-5, 0+5);

    posPath.push(this.posX,pointY)
    dataCircle.push(this.posX,pointY,this.valueArr[i],this.firstYear)
    this.posX += this.pointEquidistance
    this.firstYear++
    this.pathPosArr.push(posPath)
    this.dataCircleArr.push(dataCircle)
  }
}



drawPoint(){
  console.log('max value',this.valueMax)
  console.log('min value',this.valueMin)
  for(let i = 0;i < this.nbPoint; i++){
    let pointY  = numbersUtils.map(this.valueArr[i], this.valueMin, this.valueMax, 100-5, 0+5);

    let point = new Point(this.posX,pointY,this.valueArr[i]);

    point.draw(this.ctx);
    this.pointArr.push(point);
    this.posX += this.pointEquidistance
  }

  console.log(this.pointArr)
}

drawLines(){
  this.ctx.save()
  this.ctx.beginPath()
  console.log(this.pointArr[0].xPos)
  console.log(this.pointArr[0].yPos)

  this.ctx.moveTo(this.pointArr[0].xPos, this.pointArr[0].yPos)
  for(var i = 0; i< this.pointArr.length; i++){
    this.ctx.lineTo(this.pointArr[i].xPos, this.pointArr[i].yPos)

  // var xc = (this.pointArr[i].xPos + this.pointArr[i + 1].xPos) / 2;
  // var yc = (this.pointArr[i].yPos + this.pointArr[i + 1].yPos) / 2;
  // this.ctx.quadraticCurveTo(this.pointArr[i].xPos, this.pointArr[i].yPos, xc, yc);
}

  // this.ctx.quadraticCurveTo(this.pointArr.points[i].x, this.pointArr[i].y, this.pointArr[i+1].x,this.pointArr[i+1].y);

 //this.ctx.closePath()
 this.ctx.strokeStyle = "#56F7FD";
 this.ctx.lineWidth=3;
 this.ctx.stroke()
 this.ctx.restore()
}

drag(){
  var mouseup, mousemove;
  var self = this;
  this.cursor.addEventListener('mousedown',function(e){
    self.activeDrag = true;
  })
  window.addEventListener('mouseup',function(e){
    self.containerTimeline.classList.remove('is-grabbing')
    self.activeDrag = false;
    self.overlay.classList.remove('is_scrolling')

  })
  window.addEventListener('mousemove', function(e){
    if(self.activeDrag) {    
     self.containerTimeline.classList.add('is-grabbing')
     self.overlay.classList.add('is_scrolling')

     var left = e.clientX - window.innerWidth/8;
     var aR = Math.floor(left / self.pointEquidistance); 

     if(aR >= 0 && aR < self.valueArr.length - 1){
      self.overlayText.innerText = self.valueArr[aR] 
      self.overlayYear.innerText = self.yearArr[aR] 
      var a = self.pointArr[aR]
      var b = self.pointArr[aR + 1]

      var alpha = (b.yPos - a.yPos) / (b.xPos - a.xPos);
      var beta = b.yPos - alpha*b.xPos;
      self.cursor.setAttribute("style", `top:${alpha*left + beta}; transform:translateX(${left}px);`)
      self.cursorBar.setAttribute("style", `transform:translateX(${left}px);`)

    }

  }
}); 

}


}




