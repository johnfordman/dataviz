class Event {

 constructor() {
   this.events = {};
 }

 eventExist(event, callback){
   var exist = false;
   if( this.events[event] ) {
     for(var i=0; i<this.events[event].length; i++){
       if( this.events[event] == callback ){
         exist = true;
       }
     }
   }
   return exist;
 }




 dispatch(e){
   var list = e instanceof Array ? e : [e];
   for(var j=0; j<list.length; j++){
     if( this.events[list[j]] && this.events[list[j]].length ){
       for(var i=0; i<this.events[list[j]].length; i++ ){
       var callback = this.events[list[j]][i];
         callback.call(this);
       }
     }
   }
 }

 on(event, callback){
   if( typeof this.events[event] == "undefined" && parseInt(this.eventsList.indexOf(event)) >= 0 ) {
     this.events[ event ] = [];
   }
   if( this.events[event] && !this.eventExist(event, callback) ) {
     this.events[event].push(callback);
   }
 }


 off(event, callback){
   if( this.events[event] ){
     for(i=0; i<this.events[event].length; i++){
       if( this.events[event][i] == callback ){
         this.events[event].slice(i, 1);
       }
     }
   }
 }
}

export default Event;