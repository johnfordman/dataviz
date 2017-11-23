export default class Icefloe {
	constructor(scene){
		this.scene = scene
		this.iceArr = []
		this.init()
	}	

	init(){
		var geometry = new THREE.CylinderGeometry( 5, 5, 2, 5,1,false,0,6.3);
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var cylinder = new THREE.Mesh( geometry, material );
		this.iceArr.push(cylinder)

		this.scene.add(cylinder)
	}

	update(){
		var min = 0.005;
		var max = 0.01;
		var offset = Math.random() * (max - min) + min;

		for(let i = 0; i < this.iceArr.length; i++){
			this.iceArr[i].rotation.z = Math.sin(Date.now() * 0.0008)  * Math.PI * 0.05 ;
			this.iceArr[i].rotation.x = 1.5 +(Math.sin(Date.now() * 0.001 + offset)  * Math.PI * 0.01);
			this.iceArr[i].position.z = Math.sin(Date.now() * 0.001 + offset)  * -1 ;
		}
		
	}

}