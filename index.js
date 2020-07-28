'use strict'

var express = require('express');
var app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/main/:id', function (req, res) {
    var id = req.params.id ;
    res.render('main', {id: id})
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
