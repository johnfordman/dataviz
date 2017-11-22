import utils from '../helpers/utils';
//import datas from '../datas/datas.json'
import datas from '../datas/datafinal.json'
import _ from 'underscore';
import numbersUtils from '../helpers/numbersUtils';
import apiUtils from '../helpers/apiUtils';

import Scene from './Scene.js'
import Timeline from './Timeline.js'


export default class App {

	constructor() {
		this.datas = []
    this.index = 0;
    this.container = document.querySelector('.container_data')
    this.overlay = document.querySelector('.overlay')
    this.overlayText = document.querySelector('.overlay_co2')
    this.overlayYear = document.querySelector('.overlay_year')
    this.barCo2Actif = 0
    this.barYearActif = 0
    this.isScrolling = false
    this.valueArr = []
    this.worldArr = []
    this.valueMax = 0
    this.valueMin = 0
    this.worldMax = 0
    this.worldMin = 0
    this.yearWithMaxValue = 0
    this.yearWithMinValue = 0
    //this.yearWithMaxValueWorld = 0
    //this.yearWithMinValueWorld = 0
    this.averrageValue = 0
    this.averrageWorld = 0

    this.lastValue = 0
    
    apiUtils.getCountryData()
    .then(data =>  this.datas = data) 
    .then(()=> {
       //console.log(this.datas.countryName)
       var worldArr = this.datas.World

       var itemArr = this.datas.World
       var elementW = 100 / (itemArr.length - 1);

       itemArr.map((item,index)=>{
        this.valueArr.push(parseInt(item.value));
      })

       worldArr.map((item,index)=>{
        this.worldArr.push(parseInt(item.value));
      })
       this.valueMax = Math.max.apply(Math, this.valueArr);
       this.valueMin = Math.min.apply(Math, this.valueArr);
       this.averrageValue = utils.arrAverage(this.valueArr)

       this.worldMax = Math.max.apply(Math, this.worldArr);
       this.worldMin = Math.min.apply(Math, this.worldArr);
       this.averrageWorld = utils.arrAverage(this.worldArr)

       console.log(this.valueArr)

       itemArr.map((item,index)=>{
        let barHeight  = numbersUtils.map(item.value, this.valueMin, this.valueMax, 10, this.container.clientHeight);

        var div	= document.createElement('div')
        div.classList.add('element_data')
        div.setAttribute('data-value', Math.floor(item.value));
        div.setAttribute('data-year', item.year);
        div.style.width = `${elementW}%`
        div.style.height = `${barHeight}px`

        if(index === 0){
         div.classList.add('is_active')
       }
       this.container.appendChild(div)

     })

       console.log('max co2 en France',this.valueMax)
       console.log('min co2 en france',this.valueMin)

       console.log('max co2 dans le monde ',this.worldMax)
       console.log('min co2 dans le monde ',this.worldMin)

       var minValWithQuote =  "'" + this.valueMin + "'";
       var maxValWithQuote =  "'" + this.valueMax + "'";

       var taux2009 = this.valueArr[this.valueArr.length -6]
       var taux2014 = this.valueArr[this.valueArr.length -1]

       var elementMin = document.querySelector("[data-value=" + minValWithQuote + "]");
       var elementMax = document.querySelector("[data-value=" + maxValWithQuote + "]");
       //console.log(elementMin)
       //console.log(elementMax)
       this.yearWithMaxValue = elementMax.dataset.year;
       this.yearWithMinValue = elementMin.dataset.year;

       console.log('année du co2 le plus haut en france : ',this.yearWithMaxValue)
       console.log('année du co2 le plus bas en france : ',this.yearWithMinValue)

       console.log('année du co2 le plus dans le monde : 2014')

       console.log('kt co2 global en France',Math.round(this.averrageValue))
       console.log('global increase  or decrease en france : ',numbersUtils.increasePercent(this.valueArr[0],this.valueArr[this.valueArr.length - 1]))

       console.log('kt co2 global dans le monde : ',Math.round(this.averrageWorld))
       console.log('global increase  or decrease dans le monde : ',numbersUtils.increasePercent(this.worldArr[0],this.worldArr[this.worldArr.length - 1]))
       console.log('en 2027 la valeur en kilotone sera de :', numbersUtils.previsionnalCalcul(taux2009,taux2014))
       console.log('en 2014 le pourcentage de  kilotone comparé au monde est de :', Math.floor(numbersUtils.calcPercent(this.valueArr[this.valueArr.length - 1],this.worldArr[this.worldArr.length - 1])))

      // let scene = new Scene();
      let timeline = new Timeline(this.valueArr.length,this.valueArr);

      this.lastValue = this.valueArr[0]
      this.slides = document.querySelectorAll('.element_data')
      this.scroll()
      this.scrollStop()
      this.hoverBar()
    })
  }

  scroll(){
    let i = 0;
    let self = this
    function callback(e) {
      if(e.wheelDelta > 0) {
        if(i === 0)
         return;
       self.overlay.classList.add('is_scrolling')

				//console.log('up');
				i--;
				self.slides[i+1].classList.remove('is_active');

        self.slides[i].classList.remove('is_previous');
        self.slides[i].classList.add('is_active');
        self.barCo2Actif = self.slides[i].dataset.value
        self.barYearActif = self.slides[i].dataset.year
        self.overlayText.innerText = self.barCo2Actif
        self.overlayYear.innerText = self.barYearActif
        console.log('global increase  or decrease en france depuis 1960 jusquen:', numbersUtils.increasePercent(self.valueArr[0],self.barCo2Actif))
        console.log('global increase  or decrease en france entre ancienne et currentValue:', numbersUtils.increasePercent(self.lastValue,self.barCo2Actif))

        //console.log(self.barCo2Actif)

      }
      else {
       self.overlay.classList.add('is_scrolling')

                //DOWN
                if(i === self.slides.length - 1)
                	return;

               //console.log('down');

               i++;
               self.slides[i-1].classList.remove('is_active');
               self.slides[i-1].classList.add('is_previous');
               self.slides[i].classList.add('is_active');
               self.barCo2Actif = self.slides[i].dataset.value
               self.barYearActif = self.slides[i].dataset.year
               self.overlayText.innerText = self.barCo2Actif
               self.overlayYear.innerText = self.barYearActif
               console.log('global increase  ojr decrease en france depuis 1960 jusquen:', numbersUtils.increasePercent(self.valueArr[0],self.barCo2Actif))
               console.log('global increase  or decrease en france entre ancienne et currentValue:', numbersUtils.increasePercent(self.lastValue,self.barCo2Actif))
               //console.log(self.barCo2Actif)
             }
           }
           document.body.addEventListener('mousewheel', _.throttle(callback, 80, true))

         }

         scrollStop() {
          var isScrolling;
          window.addEventListener('mousewheel', ( event ) => {

            window.clearTimeout( isScrolling );

            isScrolling = setTimeout(()=> {

              console.log( 'Scrolling has stopped.' );
              this.lastValue = this.barCo2Actif
              this.overlay.classList.remove('is_scrolling')


            }, 500);

          }, false);
        }


        hoverBar(){
          for(let i = 0;i < this.slides.length;i++){
            this.slides[i].addEventListener('mouseover',function(){
              this.classList.add('is-hover')
            })

            this.slides[i].addEventListener('mouseout',function(){
              this.classList.remove('is-hover')
            })
          }
        }
      }




