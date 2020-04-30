/**
 * @license MIT https://github.com/omgaz/diffler
 * Author: Gary Chisholm @omgaz
 */
function diffler(f,e){var o={};for(var r in f)if(f.hasOwnProperty(r)&&"function"!=typeof f[r]){var n=f[r],t=e[r];if(r in e)if("object"==typeof n){var i=diffler(n,t);0<Object.keys(i).length&&i&&(o[r]=i)}else n!==t&&(o[r]={from:n,to:t});else o[r]={from:n,to:null}}for(r in e)if(e.hasOwnProperty(r)&&"function"!=typeof e[r]){n=f[r],t=e[r];r in f||((o=o||{})[r]={from:null,to:t})}return o}module.exports=diffler;