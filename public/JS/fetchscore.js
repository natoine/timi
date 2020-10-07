'use strict'

function fetchscore(type){
    fetch('/score', {
        method: 'GET',
        redirect: 'follow',
          headers: {
                'Accept': 'application/' + type
          }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
        else 
        {
                response.blob().then(function(blob){
                    let file = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    link.href = file ;
                    link.download = "score." + type ;
                    link.click() ;
                })
        }
    })
}

document.getElementById("csvbtn").onclick = function(){fetchscore("csv")};

document.getElementById("jsonbtn").onclick = function(){fetchscore("json")};

function fetchconsistancescore(){
    fetch('/consistancescore',{
        method:'GET',
        redircet: 'follow',
        headers: {
            'Accept': 'application/csv'
        }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
        else 
        {
                response.blob().then(function(blob){
                    let file = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    link.href = file ;
                    link.download = "consistancescore.csv" ;
                    link.click() ;
                })
        }
    })
}

document.getElementById("consistance_scorebtn").onclick = function(){fetchconsistancescore()};

function fetchconsistancetiming(){
    fetch('/consistancetiming',{
        method:'GET',
        redircet: 'follow',
        headers: {
            'Accept': 'application/csv'
        }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
        else 
        {
                response.blob().then(function(blob){
                    let file = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    link.href = file ;
                    link.download = "consistancetiming.csv" ;
                    link.click() ;
                })
        }
    })
}

document.getElementById("consistance_timingbtn").onclick = function(){fetchconsistancetiming()};

function fetchvariablesdgpdhb(){
    fetch('/variablesdgpdhb',{
        method:'GET',
        redircet: 'follow',
        headers: {
            'Accept': 'application/csv'
        }
    }).then(function(response){
        if (response.redirected) window.location.href = response.url;
        else 
        {
                response.blob().then(function(blob){
                    let file = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    link.href = file ;
                    link.download = "variablesdgpdhb.csv" ;
                    link.click() ;
                })
        }
    })
}

document.getElementById("variables_dgpdhb_btn").onclick = function(){fetchvariablesdgpdhb()};
