import utils from '../helpers/utils';
import numbersUtils from '../helpers/numbersUtils';
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
    this.stats.showPanel( 0 ); 
    document.body.appendChild( this.stats.dom );

    //Timeline test Drag
    this.isDrag = false;
    this.valueMax = Math.max.apply(Math, STORAGE.valueArray);
    this.valueMin = Math.min.apply(Math, STORAGE.valueArray);

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
    this.scene.fog = new THREE.Fog (0x96E0E2, 100, 800); 

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

    this.initSea()
    this.initSnow()
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
    console.log(this.snow.systemMaterial.uniforms.speedH.value)
    // this.snow.parameters.speedH = .4
    // this.snow.parameters.speedV = .4
    // this.snow.parameters.scale = 5.
    // this.snow.parameters.radiusX = 2.
    // this.snow.parameters.radiusZ = 2.
    // this.snow.parameters.size = 80.

    this.speedHarr = []
    this.speedVarr = []
    this.scaleArr = []
    this.radiusXArr = []
    this.radiusZArr = []
    this.sizeArr = []
    
    for (let i = 0;i < STORAGE.valueArray.length; i++) {
    let speedHValue = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 1.1, .2);
    this.speedHarr.push(speedHValue)
    
    let speedvValue = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 1.1, .2);
    this.speedVarr.push(speedvValue)

    let scaleValue = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 7.1, 5.1);
    this.scaleArr.push(scaleValue)

     let radiusX = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 2.1, 2.5);
    this.radiusXArr.push(radiusX)

    let radiusZ = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 2.1, 2.5);
    this.radiusZArr.push(radiusZ)

    let size = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 100, 80);
    this.sizeArr.push(size)


    }



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

    this.iceArr = this.icefloe.iceArr

    //initArrPosZ
    this.icePosZ2 = []
    this.icePosZ1 = []
    this.icePosX1 = []
    this.icePosZ3 = []
    this.icePosY3 = []
    this.icePosX3 = []

    this.icePosZ4 = []
    this.icePosY4 = []
    this.icePosX4 = []

    this.icePosZ5 = []
    this.icePosY5 = []
    this.icePosX5 = []

    this.icePosY6 = []
    this.icePosZ6 = []

    this.icePosY7 = []
    this.icePosX7 = []
    this.icePosZ7 = []

    for (let i = 0;i < STORAGE.valueArray.length; i++) {
      let scaleValue2  = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 0, -20);
      this.icePosZ2.push(scaleValue2)


      let scaleValue1  = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 0, -5);
      this.icePosZ1.push(scaleValue1)

      let posXvalue1  = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, -20, 0);
      this.icePosX1.push(posXvalue1)

      let scaleValue3  = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 0, -10);
      this.icePosZ3.push(scaleValue3)

      let posValue3 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 250, 200);
      this.icePosY3.push(posValue3)

      let posXvalue3 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 70, 40);
      this.icePosX3.push(posXvalue3)

      let scaleValue4  = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 0, -60);
      this.icePosZ4.push(scaleValue4)

      let posValue4 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 200, 210);
      this.icePosY4.push(posValue4)

      let posXvalue4 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, -60, -45);
      this.icePosX4.push(posXvalue4)

      let scaleValue5  = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 0, -1);
      this.icePosZ5.push(scaleValue5)

      let posValue5 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 280, 240);
      this.icePosY5.push(posValue5)

      let posXvalue5 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, -10, -35);
      this.icePosX5.push(posXvalue5)

      let posYvalue6 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 330, 300);
      this.icePosY6.push(posYvalue6)

      let posZvalue6 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 0, -40);
      this.icePosZ6.push(posZvalue6)

      let posYvalue7 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, 430, 390);
      this.icePosY7.push(posYvalue7)

      let posXvalue7 = numbersUtils.map(STORAGE.valueArray[i], this.valueMin, this.valueMax, -90, -70);
      this.icePosX7.push(posXvalue7)

    }
  }

  initTimeline(){
    let timeline = new Timeline(STORAGE.valuelength,STORAGE.valueArray,STORAGE.yearArray);

    timeline.on("drag", () =>{
        // console.log("drag")
        this.isDrag = true;
        TweenMax.to(this.camera,0.5,{fov:55,onUpdate:()=>{

          this.camera.updateProjectionMatrix();

        }});
        TweenMax.to(this.iceArr[1].position,1,{z:this.icePosZ1[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[1].position,1,{x:this.icePosX1[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[2].position,1,{z:this.icePosZ2[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[3].position,1,{z:this.icePosZ3[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[3].position,1,{y:this.icePosY3[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[3].position,1,{x:this.icePosX3[STORAGE.currentPos]});

        TweenMax.to(this.iceArr[4].position,2,{z:this.icePosZ4[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[4].position,1,{y:this.icePosY4[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[4].position,2,{x:this.icePosX4[STORAGE.currentPos]});

        TweenMax.to(this.iceArr[5].position,1.3,{z:this.icePosZ5[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[5].position,.7,{y:this.icePosY5[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[5].position,1,{x:this.icePosX5[STORAGE.currentPos]});
        
        TweenMax.to(this.iceArr[6].position,.6,{y:this.icePosY6[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[6].position,1,{z:this.icePosZ6[STORAGE.currentPos]});

        TweenMax.to(this.iceArr[7].position,1.5,{y:this.icePosY7[STORAGE.currentPos]});
        TweenMax.to(this.iceArr[7].position,1.5,{x:this.icePosX7[STORAGE.currentPos]});


        // this.snow.parameters.speedH = .4
        // this.snow.parameters.speedV = .4
        // this.snow.parameters.scale = 5.
        // this.snow.parameters.radiusX = 2.
        // this.snow.parameters.radiusZ = 2.
        // this.snow.parameters.size = 80.
        this.snow.systemMaterial.uniforms.speedH.value = this.speedHarr[STORAGE.currentPos]
        this.snow.systemMaterial.uniforms.speedV.value = this.speedVarr[STORAGE.currentPos]
        this.snow.systemMaterial.uniforms.scale.value = this.scaleArr[STORAGE.currentPos]
        this.snow.systemMaterial.uniforms.radiusX.value = this.radiusXArr[STORAGE.currentPos]
        this.snow.systemMaterial.uniforms.radiusZ.value = this.radiusZArr[STORAGE.currentPos]
        this.snow.systemMaterial.uniforms.size.value = this.sizeArr[STORAGE.currentPos]


        // this.snow.parameters.speedH = 
        // this.snow.parameters.speedV = this.speedVarr[STORAGE.currentPos]
        // this.snow.parameters.scale =  this.scaleArr[STORAGE.currentPos]
        // this.snow.parameters.radiusX = this.radiusXArr[STORAGE.currentPos]
        // this.snow.parameters.radiusZ = this.radiusZArr[STORAGE.currentPos]
        // this.snow.parameters.size = this.sizeArr[STORAGE.currentPos]
       // console.log(this.snow.parameters.speedH)


         //scene.timelineValue = this.current;
       })

    timeline.on("dragup", () =>{
      //console.log("dragup")
      this.isDrag = false
      TweenMax.to(this.camera,0.5,{fov:this.fov,onUpdate:()=>{

        this.camera.updateProjectionMatrix();

      }});
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
      //  this.iceArr[0].position.y = 1 * time
     // this.iceArr[1].position.y += .3
   }

  //  this.snow.needsUpdate = true;
    // console.log(this.timelineValue);
    
    // this.snow.numParticles = ...;


    this.direction_mouse.subVectors(this.mouse, this.cameraPosition_mouse)
    this.direction_mouse.multiplyScalar(.06)
    this.cameraPosition_mouse.addVectors(this.cameraPosition_mouse, this.direction_mouse)
    this.camera.position.x =  this.cameraPosition_mouse.x * this.cameraEasing_mouse * -1
    this.camera.position.y =  this.cameraPosition_mouse.y * this.cameraEasing_mouse * -1

    this.snow.update()
    this.icefloe.update()

    this.renderer.render( this.scene, this.camera );
  }
}

