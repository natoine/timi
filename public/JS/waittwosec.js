'use strict'

var delay = 2000 ;

function switchvisibility(){
    var wait = document.getElementById("waitcontent") ;
    wait.remove();
    document.getElementById("maincontent").style.visibility = "visible" ;
}

document.addEventListener("DOMContentLoaded", function() {

    setTimeout(switchvisibility, delay);
})