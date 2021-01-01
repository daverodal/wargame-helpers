export const DR = {...window.PHP_INIT_VARS};
if(!window.legacy){
    window.legacy = {};
    console.log("Should not have to define window.legacy DR.js")
}
window.legacy.DR = DR;