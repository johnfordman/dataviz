export default class Point{
	constructor(xPos, yPos,value){
		this.value = value
		this.xPos = xPos;
		this.yPos = yPos;
	}	

	draw(ctx) {
		ctx.save()
		ctx.beginPath()
		ctx.globalAlpha = 0
		ctx.translate(this.xPos, this.yPos)
		ctx.arc(0, 0, 1, 0, Math.PI * 2)
		ctx.strokeStyle = "#56F7FD";
		ctx.stroke()
		ctx.closePath()
		ctx.restore()
	}
}