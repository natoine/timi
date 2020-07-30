'use strict'

let onloadingmoment = Date.now();

let leftbtn = document.getElementById("leftbtn");
let rightbtn = document.getElementById("rightbtn");

function sendform(choice)
{
    let timing = Math.floor( (Date.now() - onloadingmoment - delay) ) ; // milliseconds
    let pathArray = window.location.pathname.split('/');
    let answer = {diapo: pathArray[2] , timing: timing, choice: choice}
    console.log("answer", answer)

    fetch('/answer', {
        method: 'POST',
        redirect: 'follow',
  		body: JSON.stringify(answer),
          headers: {
                'Content-Type': 'application/json'
          }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
    })
}

leftbtn.onclick = function()
{
    sendform("left");
}

rightbtn.onclick = function()
{
    sendform("right");
}
