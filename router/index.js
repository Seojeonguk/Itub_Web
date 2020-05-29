var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var router = express.Router();
var db = require('./db/DBfunc');
app = express();

app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({ extended: true })) // 인코딩된 url 형태로 받을때

router.use('/db', db);

// url routing
router.get('/', function (req, res) {
	console.log('접속 성공적')
	res.sendFile(path.join(__dirname + "/../public/main_page.html")) // html 파일을 보내는 것
});

router.post('/profile', function (req, res) {
	console.log(req.headers.referer)
	res.sendFile(path.join(__dirname + "/../public/profile.html")) // html 파일을 보내는 것
});

router.post('/online', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/online_test_mode.html")) // html 파일을 보내는 것
});

router.post('/recommend', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/recommend_mode.html")) // html 파일을 보내는 것
});

router.post('/user', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/user_choice.html")) // html 파일을 보내는 것
});

router.post('/own', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/own_setting.html")) // html 파일을 보내는 것
});

router.post('/register', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/register.html")) // html 파일을 보내는 것
});

// URL 직접 접근 막기
router.get('/*.html', function (req, res) {
	console.log('직접 접근하지 마라 ㅡㅡ')
	res.sendFile(path.join(__dirname + "/../public/main_page.html")) // html 파일을 보내는 것
});

module.exports = router;

// 이렇게 index.js가 컨트롤러 역할을 해준다.

