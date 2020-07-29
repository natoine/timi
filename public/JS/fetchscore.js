'use strict'

function fetchscore(type){
    fetch('/score', {
        method: 'GET',
        redirect: 'follow',
          headers: {
                'Accept': 'application/' + type,
                'Content-Disposition': "attachment; filename='score." + type +"'"
          }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
        else {
                response.blob().then(function(blob){
                    let file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                })
        }
    })
}

document.getElementById("csvbtn").onclick = function(){fetchscore("csv")};

document.getElementById("jsonbtn").onclick = function(){fetchscore("json")};