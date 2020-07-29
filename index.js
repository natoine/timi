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
    let id = req.params.id ;
    console.log("user session", req.session.user)
    res.render('main', {id: id})
})

//receives index form with patient data
//redirects to the first hand picture test
app.post('/main', function (req, res) {
  //console.log("post body", req.body)
  let user = req.body.user ;
  req.session.user = user ;

  res.redirect(301, '/main/1')
})

//receives answer
//redirects to the correct next question
app.post('/answer', function (req, res) {
  console.log("post body", req.body)
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
