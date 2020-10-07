'use strict'

var express = require('express');
var session = require('express-session');
var app = express();
const port = process.env.PORT || 3000

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const csvStringifierAnswers = createCsvStringifier({
    header: [
        {id: 'diapo', title:"DIAPO"},
        {id: 'timing', title: "TEMPS DE REPONSE"},
        {id: 'choice', title: "CHOIX"},
        {id: 'value', title: "VALEUR"},
        {id: 'perf', title: "PERF"}
    ]
});
const csvStringifierUser = createCsvStringifier({
  header: [
    {id: 'codepatient', title:"CODEPATIENT"},
    {id: 'age', title:"AGE"},
    {id: 'sex', title:"SEXE"},
    {id: 'lat', title:"LATERALITE"},
    {id: 'csp1', title:"CSP1"},
    {id: 'csp2', title:"CSP2"},
    {id: 'useragent', title:"USERAGENT"},
    {id: 'goodanswers', title:"BONNES REPONSES"},
    {id: 'completetiming', title:"TEMPS COMPLET"},
    {id: 'avgtiming', title:"TEMPS DE REPONSE MOYEN"},
    {id: 'globalperf', title:"SCORE BAREME"},
    {id: 'indexperf', title:"INDEX DE PERF"}
  ]
});

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.json());
const sessionpass = process.env.SESSIONPASS || "fordevsessionpass"
app.use(session({secret: sessionpass, resave:true, saveUninitialized:true}));

const goodanswers = ['gauche','gauche','droite','gauche','droite','gauche','droite','gauche','droite','droite','gauche','droite','gauche','droite','droite','gauche','droite','droite','gauche',
  'droite','gauche','droite','droite','gauche','gauche','gauche','droite','droite','gauche','droite','gauche','gauche','droite','gauche','gauche','droite','droite','gauche','gauche','droite',
  'gauche','gauche','gauche','droite','droite','gauche','droite','droite'] ;

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/consignes', function (req, res) {
  if(!req.session.user) res.redirect(307,'/') //cannot get to consignes without a user
  else res.render('consignes')
})

app.get('/beforemain', function (req, res) {
  if(!req.session.user) res.redirect(307,'/') //cannot get to trial without a user
  else res.render('beforemain', {id: 21})
})

app.get('/beforemain2', function (req, res) {
  if(!req.session.user) res.redirect(307,'/') //cannot get to trial without a user
  else res.render('beforemain2', {id: 7})
})

app.get('/ready', function (req, res) {
  if(!req.session.user) res.redirect(307,'/') //cannot get to trial without a user
  else res.render('ready')
})

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
              res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
              res.set('Content-Type', 'application/json');
              res.json(user);
            },

            'application/csv': function () {
              res.setHeader('Content-disposition', 'attachment; filename=score.csv'); //do nothing
              res.set('Content-Type', 'text/csv');
              let csv ;
              //build a CSV string with csv-writer
              let users = [user];
              csv = csvStringifierUser.getHeaderString().concat(csvStringifierUser.stringifyRecords(users));
              csv = csv.concat(csvStringifierAnswers.getHeaderString()).concat(csvStringifierAnswers.stringifyRecords(user.answers));
              
              //console.log("csv", csv);              

              res.end(csv);

            }
          })
    }
  }
})

app.get('/consistancescore', function(req, res){
  let user = req.session.user ;
  if(!user) res.redirect(307, "/");
  else if(user.answers.length === 0) res.redirect(307, "/");
  else {
    let questioncount = user.answers.length ;
    if(questioncount < 48) res.redirect(307, '/main/' + questioncount)
    else {

      res.setHeader('Content-disposition', 'attachment; filename=consistancescore.csv'); //do nothing
      res.set('Content-Type', 'text/csv');
      let csv ;
      csv = "Code_Participant ;" ;
      for (var i=1; i<=48 ; i++)
      {
        csv = csv.concat("Score_Item_" + i + " ;")
      }
      csv = csv.concat("\n");
      csv = csv.concat("" + user.codepatient + ";");
      let answers = user.answers ;
      for (var i=0; i<questioncount ; i++)
      {
        csv = csv.concat("" + answers[i].perf + ";");
      }
      res.end(csv);
    }
  }
})

app.get('/consistancetiming', function(req, res){
  let user = req.session.user ;
  if(!user) res.redirect(307, "/");
  else if(user.answers.length === 0) res.redirect(307, "/");
  else {
    let questioncount = user.answers.length ;
    if(questioncount < 48) res.redirect(307, '/main/' + questioncount)
    else {

      res.setHeader('Content-disposition', 'attachment; filename=consistancetiming.csv'); //do nothing
      res.set('Content-Type', 'text/csv');
      let csv ;
      csv = "Code_Participant ;" ;
      for (var i=1; i<=48 ; i++)
      {
        csv = csv.concat("Temps_de_Reponse_Item_" + i + " ;")
      }
      csv = csv.concat("\n");
      csv = csv.concat("" + user.codepatient + ";");
      let answers = user.answers ;
      for (var i=0; i<questioncount ; i++)
      {
        csv = csv.concat("" + answers[i].timing + ";");
      }
      res.end(csv);
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
  res.redirect(301, 'consignes');
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
      answer.timing = Math.round(answer.timing / 10) / 100 ; // sec and no more ms only 2 dec
    })
    req.session.user.goodanswers = countgoodanswers ;
    req.session.user.completetiming = Math.round(completetiming / 10) / 100 ; // sec only 2 dec
    req.session.user.avgtiming = Math.round((completetiming / 48) / 10 ) / 100 ; //sec
    req.session.user.globalperf = performance ;
    req.session.user.indexperf = Math.round(req.session.user.avgtiming / countgoodanswers * 10000 )/10000; // only 4 dec

    //redircet to score
    res.redirect(301, '/score');
  }
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
