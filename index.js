'use strict'

var express = require('express');
var session = require('express-session');
var app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.json());
const sessionpass = process.env.SESSIONPASS || "fordevsessionpass"
app.use(session({secret: sessionpass, resave:true, saveUninitialized:true}));

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/main/:id', function (req, res) {
    if(!req.session.user) res.redirect(307,'/') //cannot start test without a user
    else { //verifies coherency
      let id = parseInt(req.params.id) ;
      let answerslength = req.session.user.answers.length ;
      if(answerslength === 0 && id === 1) res.render('main', {id: id});
      else
      {
        if(answerslength === 0 ) res.redirect(307, '/main/1');
        else {
          let latestdiapo = parseInt( req.session.user.answers[answerslength - 1].diapo ) ;
          if(latestdiapo + 1 === id) res.render('main', {id: id});
          else {
            let goodid = latestdiapo + 1;
            res.redirect(307, '/main/' + goodid);
          }
        }
      }
    }
})

//scores to the end
app.get('/score', function(req, res){
  let user = req.session.user ;
  if(!user) res.redirect(307, "/");
  else if(user.answers.length === 0) res.redirect(307, "/");
  else {
    let questioncount = user.answers.length ;
    if(questioncount < 48) res.redirect(307, '/main/' + questioncount)
    else {
      res.render('score', {user: user});
    }
  }
})

//receives index form with patient data
//redirects to the first hand picture test
app.post('/main', function (req, res) {
  //console.log("post body", req.body)
  let user = req.body.user ;
  req.session.user = user ;
  req.session.user.answers = [];
  res.redirect(301, '/main/1');
})

//receives answer
//redirects to the correct next question
app.post('/answer', function (req, res) {
  //console.log("post body", req.body)
  let answer = req.body ;
  req.session.user.answers.push(answer);
  console.log("user", req.session.user);
  let next = parseInt(answer.diapo) + 1;
  if(next <= 48) res.redirect(301, '/main/'+next);
  else res.redirect(301, '/score');
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
