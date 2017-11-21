const NumberUtils = {

  map( num, min1, max1, min2, max2 ) {

    let num1 = ( num - min1 ) / ( max1 - min1 );
    let num2 = ( num1 * ( max2 - min2 ) ) + min2;

    return num2;

  },

  hex2rgb( hex ) {
    hex = (hex.substr(0,1)=="#") ? hex.substr(1) : hex;
    return [parseInt(hex.substr(0,2), 16), parseInt(hex.substr(2,2), 16), parseInt(hex.substr(4,2), 16)];
  },

  toRadians( degree ) {

    return degree * ( Math.PI / 180 );

  },

  toDegree( radians ) {

    return radians * ( 180 / Math.PI );

  },

  increasePercent (from,to) {
    let diff = to - from
    let divide = diff / from
    return divide * 100
  },
  previsionnalCalcul(taux2009,taux2014){
    return taux2009 + ( ( taux2014 - taux2009 ) / 5 ) * ( 2027 - 2009 )
  },
  calcPercent(val1,val2){
    return (val1 / val2) * 100
  }

};

export default NumberUtils; 