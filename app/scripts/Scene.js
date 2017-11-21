import utils from '../helpers/utils';
import _ from 'underscore';
import numbersUtils from '../helpers/numbersUtils';
import apiUtils from '../helpers/apiUtils';
import TweenMax from "gsap";
import Stats from '../libs/stats.min.js'
import datGui from '../../node_modules/dat.gui/build/dat.gui.min'
import vertShader from '../shaders/plane/shader.vert'
import fragShader from '../shaders/plane/shader.frag'

import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' // eslint-disable-line import/no-webpack-loader-syntax


import textureWater from '../textures/water-zelda.png'

export default class Scene {

	constructor() {
		this.stats =  new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
        
        //Mouse
        this.mouse = new THREE.Vector3(0,0,0);
        this.direction_mouse    = new THREE.Vector3(0, 0, 0);
        this.cameraPosition_mouse = new THREE.Vector3(0, 0, 0)
        this.cameraEasing_mouse = 10

        //camera
        this.fov = 55;
        this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 1, 4000 );
        //this.camera.position.z =2000;
        this.camera.position.z = 50;
        this.camera.position.y =  -200;
        this.camera.lookAt(new THREE.Vector3(0,0,0))

		//contrlos
		//this.controls = new OrbitControls(this.camera)

    	//Lights
    	this.ambientLight = new THREE.AmbientLight(0xffffff);

        //color
        this.color =  new THREE.Color( '#C2F1F2' )
        this.colorDark =  new THREE.Color( '#3468a2' )
        this.sceneW = window.innerWidth
        this.sceneH =  window.innerHeight

        this.scene = new THREE.Scene();

        //fog
        this.scene.fog = new THREE.Fog (0x96E0E2, 400, 800); 

        this.init()
        this.initEvent()
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

    }

    init(){
    	this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );
    	this.scene.add(this.ambientLight)
    	this.scene.background = this.color;


    	this.geometry = new THREE.SphereGeometry( 5, 7, 7 );
    	this.material = new THREE.MeshPhongMaterial({ color: 0x000000});

    	this.sphere = new THREE.Mesh( this.geometry, this.material );

		//this.scene.add(this.sphere)

		this.initSea()


		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.container.appendChild( this.renderer.domElement );
		this.renderer.animate( this.render.bind(this) );
	}


	initSea(){
		this.meshSea = new THREE.Object3D();

		let geomWaves = new THREE.PlaneBufferGeometry(2000, 2000, 500, 500);
    	//geomWaves.rotateX(-Math.PI / 2);

    	// let uniforms = {
    	// 	uMap: {type: 't', value: null},
    	// 	uTime: {type: 'f', value: 0},
    	// 	uColor: {type: 'f', value: new THREE.Color('#307ddd')},
    	// 	fogColor:    { type: "c", value: scene.fog.color },
    	// 	fogNear:     { type: "f", value: scene.fog.near },
    	// 	fogFar:      { type: "f", value: scene.fog.far }
    	// };

    	this.shaderSea = new THREE.ShaderMaterial({

    		uniforms: THREE.UniformsUtils.merge( [
    			THREE.UniformsLib.common,
    			THREE.UniformsLib.specularmap,
    			THREE.UniformsLib.envmap,
    			THREE.UniformsLib.aomap,
    			THREE.UniformsLib.lightmap,
    			THREE.UniformsLib[ "ambient" ],
    			THREE.UniformsLib[ "lights" ],
    			THREE.UniformsLib.fog, {
    				uTime: {type: 'f', value: 0},
    				diffuse: { value: new THREE.Color(0x2EBBBF) },
    				uMap: {type: 't', value: null},
    			}
    			] ),
    		vertexShader: vertShader,
    		fragmentShader: fragShader,
    		side: THREE.DoubleSide,
    		fog: true,
    		lights: true,
    		//transparent:true,
    		defines         : {
    			USE_MAP: false
    		}
    	});
    	this.material2 = new THREE.MeshPhongMaterial({ color: 0x307ddd});


    	var textureLoader = new THREE.TextureLoader();
    	textureLoader.load(textureWater, (texture) => {
    		console.log(texture)
    		this.shaderSea.uniforms.uMap.value = texture;
    		texture.wrapS = THREE.RepeatWrapping;
    		texture.wrapT = THREE.RepeatWrapping;
    	});

    	this.meshSea = new THREE.Mesh(geomWaves, this.shaderSea);
    	console.log(this.meshSea)
    	//this.meshSea.position.set(0,0,0);
    	//this.meshSea.rotation.x = 1.5

    	this.scene.add(this.meshSea)

    // var geomSeaBed = new THREE.PlaneBufferGeometry(2000, 2000, 5, 5);
    // geomSeaBed.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    // var matWaves = new THREE.MeshPhongMaterial( {
    //   color:0xff0000,
    //   shading:THREE.SmoothShading,
    // });
    // var seaBed = new THREE.Mesh(geomSeaBed, matWaves);
    // seaBed.position.set(0,-10,0);
    // seaBed.castShadow = false;
    // seaBed.receiveShadow = true;
    // this.mesh.add(seaBed);
}

onWindowResize() {

	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( window.innerWidth, window.innerHeight );

}

initEvent(){
	window.addEventListener('mousemove', (event) =>{
		event.preventDefault()
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	},false);
}

render() {
   //this.stats.update();
   var time = performance.now() * 0.0005;
   this.shaderSea.uniforms.uTime.value = time;

   this.direction_mouse.subVectors(this.mouse, this.cameraPosition_mouse)
   this.direction_mouse.multiplyScalar(.06)
   this.cameraPosition_mouse.addVectors(this.cameraPosition_mouse, this.direction_mouse)
   this.camera.position.x =  this.cameraPosition_mouse.x * this.cameraEasing_mouse * -1
   this.camera.position.y =  this.cameraPosition_mouse.y * this.cameraEasing_mouse * -1

   this.renderer.render( this.scene, this.camera );
}
}

