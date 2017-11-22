import utils from '../helpers/utils';
//import datas from '../datas/datas.json'
import datas from '../datas/datafinal.json'
import _ from 'underscore';
import numbersUtils from '../helpers/numbersUtils';
import apiUtils from '../helpers/apiUtils';
import Point from './Point.js'
import * as d3 from "d3";
import TweenLite from 'gsap'
//import DrawSVG from '../libs/gsap/plugins/DrawSVGPlugin'


export default class Timeline {

	constructor(nbPoint,valueArr) {
    //Container canvas
    this.valueArr = valueArr
    this.valueMax = Math.max.apply(Math, this.valueArr);
    this.valueMin = Math.min.apply(Math, this.valueArr);
    this.nbPoint = nbPoint
    this.containerTimeline = document.querySelector('.container-ui')
    this.containerTimelineW = this.containerTimeline.clientWidth 
    this.containerTimelineH = this.containerTimeline.clientHeight
    
    //canvas timeline
    //this.canvasTimeline = this.containerTimeline.querySelector('#canvasTimeline')
    //this.canvasTimeline.width = this.containerTimelineW
    //this.canvasTimeline.height = this.containerTimelineH

    this.posX = 5;
    this.posY = 100-5

    this.pointEquidistance = this.containerTimelineW / this.nbPoint;
   //this.canvasTimeline.style.height = this.containerTimelineH
   //this.ctx = this.canvasTimeline.getContext('2d')

   this.pointArr = []
   this.dataCircleArr = []
   this.pathPosArr = []
   this.firstYear = 1961
  // this.drawPoint()
   //this.drawLines()
   this.createPosArr()
   this.drawline()

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

drawline(){
  console.log(this.posArr)
  var lineGenerator = d3.line()
  .curve(d3.curveCardinal);

  var points = [
  [0, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80]
  ];

  var pathData = lineGenerator(this.pathPosArr);

  d3.select('path')
  .attr('d', pathData);

// Also draw points for reference
d3.select('svg')
.selectAll('circle')
.data(this.dataCircleArr)
.enter()
.append('circle')
.attr('cx', function(d) {
  return d[0];
})
.attr('cy', function(d) {
  return d[1];
})
.attr('r', 3)
.attr('class', 'circle_value')
.attr('data-value', (d)=> {
 return d[2];
})
.attr('data-year', (d)=> {
 return d[3];
})
}

//  drawPoint(){
//   console.log('max value',this.valueMax)
//   console.log('min value',this.valueMin)
//   for(let i = 0;i < this.nbPoint; i++){
//     let pointY  = numbersUtils.map(this.valueArr[i], this.valueMin, this.valueMax, 100-5, 0+5);

//     let point = new Point(this.posX,pointY,this.valueArr[i]);

//     point.draw(this.ctx);
//     this.pointArr.push(point);
//     this.posX += this.pointEquidistance
//   }

//   console.log(this.pointArr)
// }

// drawLines(){
//   this.ctx.save()
//   this.ctx.beginPath()
//   console.log(this.pointArr[0].xPos)
//   console.log(this.pointArr[0].yPos)

//   this.ctx.moveTo(this.pointArr[0].xPos, this.pointArr[0].yPos)
//   for(var i = 0; i< this.pointArr.length - 2; i++){
//   //this.ctx.lineTo(this.pointArr[i].xPos, this.pointArr[i].yPos)

//   var xc = (this.pointArr[i].xPos + this.pointArr[i + 1].xPos) / 2;
//   var yc = (this.pointArr[i].yPos + this.pointArr[i + 1].yPos) / 2;
//   this.ctx.quadraticCurveTo(this.pointArr[i].xPos, this.pointArr[i].yPos, xc, yc);
// }
//   this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);

//  //this.ctx.closePath()
//  this.ctx.strokeStyle = "black";
//  this.ctx.stroke()
//  this.ctx.restore()
// }



}




