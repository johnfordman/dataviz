export default class Icefloe {
	constructor(scene){
		this.scene = scene
		this.iceArr = []
		this.init()
		this.posX
	}	

	init(posX,posY,scaleX,scaleY,scaleZ,rotationY){
		var geometry = new THREE.CylinderGeometry( 5, 5, 2, 5,1,false,0,6.3);
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var iceMesh = new THREE.Mesh( geometry, material );
		iceMesh.position.set(posX,posY,0)
		iceMesh.scale.set(scaleX,scaleY,scaleZ)
		iceMesh.rotation.x = 1.5
		iceMesh.rotation.y = rotationY
			//iceMesh.scale.set(6,4,4)
			this.iceArr.push(iceMesh)
			this.scene.add(iceMesh)
		}
		

		update(){
			var min = 0.01;
			var max = 0.005;
			var offset = Math.random() * (max - min) + min;

			for(let i = 0; i < this.iceArr.length; i++){
				this.iceArr[i].rotation.z = Math.sin(Date.now() * 0.0008)  * Math.PI * 0.02 ;
				this.iceArr[i].rotation.x = 1.5 +(Math.sin(Date.now() * 0.001 + offset)  * Math.PI * 0.01);
			}

		}

	}