var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var index = require('./router/index')
var db = require('./router/db/DBfunc')
var app = express()

port = process.env.PORT || 8000;

app.listen(port, function(req, res) {
	console.log("Open I-Tub server!! congratulation");
});

// 이부분을 middleware 라고 한다.
app.use(cookieParser());
app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({extended:true})) // 인코딩된 url 형태로 받을때

app.set('view engine', 'ejs') // view engine으로 ejs를 사용한다는 의미

app.use('/db', db)
app.use('/', index);
app.use('/py', index);
app.use('/profile', index);
app.use('/user', index);
app.use('/own', index);
app.use('/recommand', index);
app.use('/online', index);
app.use('/item', index);
app.use('/register', index);
app.use('/profile_cookie', index);
app.use('/item_cookie', index);

app.use(express.static('public'))