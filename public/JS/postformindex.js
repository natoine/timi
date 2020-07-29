'use strict'

let submitbuttn = document.getElementById("submitbutton");

submitbuttn.onclick = function(){
    let user = {};
    user.codepatient = document.getElementById("codepatient").value ;
    user.age = document.getElementById("age").value ;
    user.sex = document.getElementById("sex").value ;
    user.lat = document.getElementById("lat").value ;
    user.csp1 = document.getElementById("csp1").value ;
    user.csp2 = document.getElementById("csp2").value ;
    
    fetch('/main', {
        method: 'POST',
        redirect: 'follow',
  		body: JSON.stringify(user),
          headers: {
                'Content-Type': 'application/json'
          }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
    })
}