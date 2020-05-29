var express = require('express')
var app = express()
var path = require('path')
var router = express.Router();
var bodyParser = require('body-parser')
var index = require('./router/index')
var db = require('./router/db/DBfunc')

port = process.env.PORT || 8000;

app.listen(port, function(req, res) {
	console.log("Open I-Tub server!! congratulation");
});

app.use('/', index);
app.use('/profile', index);
app.use('/user', index);
app.use('/own', index);
app.use('/recommand', index);
app.use('/online', index);
app.use('/register', index);
app.use('/db', db);

// 이부분을 middleware 라고 한다.
app.use(express.static('public'))
app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({extended:true})) // 인코딩된 url 형태로 받을때

app.set('view engine', 'ejs') // view engine으로 ejs를 사용한다는 의미

