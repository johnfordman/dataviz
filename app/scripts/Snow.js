import snow from '../textures/snowParticle.png'
import vertShader from '../shaders/snow/shader.vert'
import fragShader from '../shaders/snow/shader.frag'

export default class Snow {
	
	constructor(scene) {

		this.scene = scene
		this.particleSystemHeight = 100.0
		this.numParticles = 7000,
		this.isLoad = false;
		this.clock = new THREE.Clock();
		this.width = 100
		this.height = this.particleSystemHeight
		this.depth = 100
		this.parameters = {
			color: 0xFFFFFF,
			height: this.particleSystemHeight,
			radiusX: 2.5,
			radiusZ: 2.5,
			size: 85,
			//size: 65,
			scale: 7.0,
			opacity: .7,
			speedH: 1.,
			speedV: 1.
		}

		this.init()
	}

	init() {
		function rand( v ) {
			return (v * (Math.random() - 0.5));
		}
		var textureLoader = new THREE.TextureLoader();

		this.uniforms = {
			color:  { type: 'c', value: new THREE.Color( this.parameters.color ) },
			height: { type: 'f', value: this.parameters.height },
			elapsedTime: { type: 'f', value: 0 },
			radiusX: { type: 'f', value: this.parameters.radiusX },
			radiusZ: { type: 'f', value: this.parameters.radiusZ },
			size: { type: 'f', value: this.parameters.size },
			scale: { type: 'f', value: this.parameters.scale },
			opacity: { type: 'f', value: this.parameters.opacity },
			texture: { type: 't', value: null },
			speedH: { type: 'f', value: this.parameters.speedH },
			speedV: { type: 'f', value: this.parameters.speedV }
		}

		this.systemMaterial = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: vertShader,
			fragmentShader: fragShader,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthTest: false
		});

		textureLoader.load(snow, (texture) => {
			this.uniforms.texture.value = texture
			this.isLoad = true
			this.textureSnow = texture
			this.systemGeometry = new THREE.Geometry()
	
			for( var i = 0; i < this.numParticles; i++ ) {
				var vertex = new THREE.Vector3(
					rand( this.width ),
					Math.random() * this.height,
					rand( this.depth )
					);

				this.systemGeometry.vertices.push( vertex );
			}

			this.particleSystem = new THREE.Points( this.systemGeometry, this.systemMaterial );

			this.particleSystem.position.x = 10;
			this.particleSystem.rotation.x = .5

			this.scene.add( this.particleSystem );

		});

	}

	update(){
		if(this.isLoad){
			if(this.needsUpdate) {
				var diff = this.systemGeometry.vertices.length - this.numParticles; 
				if( diff > 0){
					// Supprimer des vertices
				} else {
					// Ajouter des vertices
				}
				this.systemGeometry.vertices.needsUpdate = true;
				this.needsUpdate = false;
			}
			let delta = this.clock.getDelta()
			let elapsedTime = this.clock.getElapsedTime();
			this.particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 10;
		}
		
	}
}
