'use strict'

var delay = 2000 ;

function switchvisibility(){
    document.getElementById("waitcontent").style.visibility = "hidden" ;
    document.getElementById("maincontent").style.visibility = "visible" ;
}

document.addEventListener("DOMContentLoaded", function() {

    setTimeout(switchvisibility, delay);
})

window.onload=function(){ 
    setTimeout(function(){ 		
        console.log("scroll");
        window.scrollTo(0, 1); 	
    }, delay); 
}