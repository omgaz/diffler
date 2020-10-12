/**
 * @license MIT https://github.com/omgaz/diffler
 * Author: Gary Chisholm @omgaz
 */
function diffler(o,f){var n,r,t,e,i={};for(n in o){o.hasOwnProperty(n)&&"function"!=typeof o[n]&&(t=o[n],e=f[n],n in f?"object"==typeof t?(r=diffler(t,e),0<Object.keys(r).length&&r&&(i[n]=r)):t!==e&&(i[n]={from:t,to:e}):i[n]={from:t,to:null})}for(n in f){f.hasOwnProperty(n)&&"function"!=typeof f[n]&&(t=o[n],e=f[n],n in o||((i=i||{})[n]={from:null,to:e}))}return i}module.exports=diffler;