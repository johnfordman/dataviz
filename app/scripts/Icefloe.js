export default class Icefloe {
	constructor(scene){
		this.scene = scene
		this.init()
	}	

	init(){
		var cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(1, 2, 1),new THREE.MeshLambertMaterial());
		
		this.scene.add(cubeMesh);
		
		//change vertex positions
		cubeMesh.geometry.vertices[1].y += 1;
		cubeMesh.geometry.vertices[4].y += 1;

		//indicate that the vertices need update
		cubeMesh.geometry.verticesNeedUpdate = true;
	}

}