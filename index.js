'use strict'

var express = require('express');
var session = require('express-session');
var app = express();
var Json2csvparser = require('json2csv').Parser;
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.json());
const sessionpass = process.env.SESSIONPASS || "fordevsessionpass"
app.use(session({secret: sessionpass, resave:true, saveUninitialized:true}));

const goodanswers = ['left','left','right','left','right','left','right','left','right','right','left','right','left','right','right','left','right','right','left',
  'right','left','right','right','left','left','left','right','right','left','right','left','left','right','left','left','right','right','left','left','right',
  'left','left','left','right','right','left','right','right'] ;

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


//sends html, JSON or CSV depending on content negociation
app.get('/score', function(req, res){
  let user = req.session.user ;
  if(!user) res.redirect(307, "/");
  else if(user.answers.length === 0) res.redirect(307, "/");
  else {
    let questioncount = user.answers.length ;
    if(questioncount < 48) res.redirect(307, '/main/' + questioncount)
    else {
          res.format({
            'text/html': function () {
              res.render('score', {user: user});
            },
            'application/json': function () {
                res.json(user);
            },

            'application/csv': function () {
                let fields = ["age","sex","lat","csp1","csp2","useragent","answers"];
                let json2csvParser = new Json2csvparser({ fields })
                let csv = json2csvParser.parse(user)
                //res.setHeader('Content-disposition', 'attachment; filename=score.csv'); //do nothing
                res.set('Content-Type', 'text/csv');
                res.status(200).send(csv);
            }
          })
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
  //verify coherency
  let answerslength = req.session.user.answers.length ;
  let index = parseInt(req.body.diapo) - 1 ;
  if(answerslength === index)
  {
    //test if the answer is good or not
    answer.value = answer.choice === goodanswers[index];
    //compute performance (if good answer and timing < 2sec 4pts, if good answer and 2 < timing < 3sec 3pts, if good answer and 3 < timing < 4 2pts, if good answer and timing > 4 1pt)
    if(! answer.value) answer.perf = 0 ;
    else {
      if(answer.timing > 4000) answer.perf = 1 ;
      else if(answer.timing > 3000) answer.perf = 2 ;
      else if(answer.timing > 2000) answer.perf = 3 ;
      else answer.perf = 4 ;
    }
    //add the answer
    req.session.user.answers.push(answer);
  }
  console.log("user", req.session.user);
  let next = parseInt(answer.diapo) + 1;
  if(next <= 48) res.redirect(301, '/main/'+next);
  else 
  {
    //compute stats
    let answers = req.session.user.answers ;
    let countgoodanswers = 0 ;
    let completetiming = 0 ;
    let performance = 0 ;
    answers.map(answer => {
      if(answer.value) countgoodanswers++ ;
      completetiming = completetiming + answer.timing ;
      performance = performance + answer.perf ;
    })
    req.session.user.goodanswers = countgoodanswers ;
    req.session.usercompletetiming = completetiming ;
    req.session.avgtiming = completetiming / 48 ;
    req.session.globalperf = performance ;
    req.session.indexperf = req.session.avgtiming / countgoodanswers ;


    //redircet to score
    res.redirect(301, '/score');
  }
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
