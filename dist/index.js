/**
 * @license MIT https://github.com/omgaz/diffler
 * Author: Gary Chisholm @omgaz
 */
function diffler(f,o){var r,t,e={};for(r in f)if(f.hasOwnProperty(r)&&"function"!=typeof f[r]){if(typeof(n=f[r])!=typeof(i=o[r])){e[r]={from:n,to:i};break}r in o?"object"==typeof n?(t=diffler(n,i),0<Object.keys(t).length&&t&&(e[r]=t)):n!==i&&(e[r]={from:n,to:i}):e[r]={from:n,to:null}}for(r in o)if(o.hasOwnProperty(r)&&"function"!=typeof o[r]){if(null===f){e[r]={from:f,to:o[r]};break}var n=f[r],i=o[r];r in f||((e=e||{})[r]={from:null,to:i})}return e}module.exports=diffler;