'use strict'

var express = require('express');
var app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));
var bodyParser = require('body-parser')
app.use(bodyParser())

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/main/:id', function (req, res) {
    var id = req.params.id ;
    res.render('main', {id: id})
})

//receives index form with patient data
//redirects to the first hand picture test
app.post('/main', function (req, res) {
  console.log("post body", req.body)
  var user = {};
  user.codepatient = req.body.codepatient ;
  user.age = req.body.age ;
  user.sex = req.body.sex ;
  user.lat = req.body.lat ;
  user.csp1 = req.body.csp1 ;
  user.csp2 = req.body.csp2 ;

  console.log("user", user)
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
