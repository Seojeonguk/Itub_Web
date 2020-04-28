var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router/index')

app.listen(3000, function() {
	console.log("start!! express server on port 3000");
});

// 이부분을 middleware 라고 한다.
app.use(express.static('public'))
app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({extended:true})) // 인코딩된 url 형태로 받을때
app.set('view engine', 'ejs') // view engine으로 ejs를 사용한다는 의미

app.use(router)