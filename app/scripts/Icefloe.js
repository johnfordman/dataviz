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

}