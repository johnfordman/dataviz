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
import Timeline from './Timeline.js'
import Icefloe from  './Icefloe'
import Snow from './Snow'

export default class Scene {

	constructor() {
		this.stats =  new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );

        //Timeline test Drag
        this.isDrag = false;
        
        //Mouse
        this.mouse = new THREE.Vector3(0,0,0);
        this.direction_mouse    = new THREE.Vector3(0, 0, 0);
        this.cameraPosition_mouse = new THREE.Vector3(0, 0, 0)
        this.cameraEasing_mouse = 10

        //camera
        this.fov = 45;
        this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 1, 4000 );
        //this.camera.position.z =2000;
        this.camera.position.z = 50;
        this.camera.position.y =  -200;
        this.camera.lookAt(new THREE.Vector3(0,0,0))

		//contrlos
		//this.controls = new OrbitControls(this.camera)

    	//Lights
      this.hemisphereLight = new THREE.HemisphereLight(0xffffff,0x000000, 1)

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
        this.initTimeline()
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

      }

      init(){
       this.container = document.querySelector( '#main' );
       document.body.appendChild( this.container );
       this.scene.add(this.hemisphereLight);  
       this.scene.background = this.color;

       this.geometry = new THREE.SphereGeometry( 5, 7, 7 );
       this.material = new THREE.MeshPhongMaterial({ color: 0x000000});

       this.sphere = new THREE.Mesh( this.geometry, this.material );

		//this.scene.add(this.sphere)

    this.initSea()
       // this.initSnow()
       this.initIceFloe()


       this.renderer = new THREE.WebGLRenderer( { antialias: true } );
       this.renderer.setPixelRatio( window.devicePixelRatio );
       this.renderer.setSize( window.innerWidth, window.innerHeight );
       this.container.appendChild( this.renderer.domElement );
       this.renderer.shadowMap.enabled = true; 
       this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
       this.renderer.animate( this.render.bind(this) );
     }

     initSea(){
      this.meshSea = new THREE.Object3D();

      let geomWaves = new THREE.PlaneBufferGeometry(2000, 2000, 1, 1);

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
        transparent:true,
        defines         : {
         USE_MAP: false
       }
     });
      this.material2 = new THREE.MeshPhongMaterial({ color: 0x307ddd});

      var textureLoader = new THREE.TextureLoader();
      textureLoader.load(textureWater, (texture) => {
        this.shaderSea.uniforms.uMap.value = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      });

      this.meshSea = new THREE.Mesh(geomWaves, this.shaderSea);

      var geomSeaBed = new THREE.PlaneBufferGeometry(2000, 2000, 1, 1);
      var matWaves = new THREE.MeshPhongMaterial( {
        color:0x00000,
        flatShading:true
      });
      var seaBed = new THREE.Mesh(geomSeaBed, this.material2);
      seaBed.position.set(0,0,-10);
      seaBed.castShadow = false;
      seaBed.receiveShadow = true;
      this.meshSea.add(seaBed);
      this.scene.add(this.meshSea)

    }

    initSnow(){
      this.snow = new Snow(this.scene)
    }

    initIceFloe(){
      this.icefloe = new Icefloe(this.scene)

        //ordre plus proche (deuxieme parametre le Z)
        this.icefloe.init(-20,150,6.5,4.5,4.5,0)
        this.icefloe.init(40,180,3.5,6,4,1)
        this.icefloe.init(70,250,6,4,4,0)
        this.icefloe.init(-60,200,3.5,6,4,3.9)
        this.icefloe.init(-10,280,8.5,5.5,6.5,0)
        this.icefloe.init(60,330,2.5,6,4,3.5)
        this.icefloe.init(-90,430,5.5,4.5,6.5,0)
      }

      initTimeline(){
        let timeline = new Timeline(STORAGE.valuelength,STORAGE.valueArray,STORAGE.yearArray);

        timeline.on("drag", () =>{
         console.log("drag")
         this.isDrag = true
         //scene.timelineValue = this.current;
       })

        timeline.on("dragup", () =>{
         console.log("dragup")
         this.isDrag = false
         //scene.timelineValue = this.current;
       })
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
      this.stats.update();
      var time = performance.now() * 0.0005;
      this.shaderSea.uniforms.uTime.value = time;

      if(this.isDrag){
       this.icefloe.update()
     }

  //  this.snow.needsUpdate = true;
    // console.log(this.timelineValue);
    
    // this.snow.numParticles = ...;


    this.direction_mouse.subVectors(this.mouse, this.cameraPosition_mouse)
    this.direction_mouse.multiplyScalar(.06)
    this.cameraPosition_mouse.addVectors(this.cameraPosition_mouse, this.direction_mouse)
    this.camera.position.x =  this.cameraPosition_mouse.x * this.cameraEasing_mouse * -1
    this.camera.position.y =  this.cameraPosition_mouse.y * this.cameraEasing_mouse * -1

  //  this.snow.update()
    //this.icefloe.update()

    this.renderer.render( this.scene, this.camera );
  }
}

