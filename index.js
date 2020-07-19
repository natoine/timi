'use strict'

var express = require('express');
var app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/main', function (req, res) {
    res.render('main')
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
