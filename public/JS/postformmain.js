'use strict'

let onloadingmoment = Date.now();

let leftbtn = document.getElementById("leftbtn");
let rightbtn = document.getElementById("rightbtn");

function sendform(choice)
{
    let timing = Math.floor( (Date.now() - onloadingmoment) / 1000 ) ; // seconds
    let pathArray = window.location.pathname.split('/');
    let answer = {count:pathArray[2] , timing: timing, choice: choice}
    console.log("answer", answer)
}

leftbtn.onclick = function()
{
    sendform("left");
}

rightbtn.onclick = function()
{
    sendform("right");
}
