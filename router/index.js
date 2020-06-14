var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./db/DBfunc');
var querystring = require('querystring');

app = express();

app.use(cookieParser());
app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({ extended: true })) // 인코딩된 url 형태로 받을때

router.use('/db', db);

// url routing
router.get('/', function (req, res) {
	console.log('접속 성공적')
	res.sendFile(path.join(__dirname + "/../public/main_page.html")) // html 파일을 보내는 것
});

router.post('/profile', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/profile.html")) // html 파일을 보내는 것
});

router.post('/profile_cookie', function (req, res) {
	res.cookie('cookie_name', req.body.cookie_name);
	res.cookie('cookie_age', req.body.cookie_age);
	res.cookie('cookie_gender', req.body.cookie_gender);
	res.cookie('cookie_job', req.body.cookie_job);
	res.redirect(307, '/user');
});

router.post('/item_cookie', function(req, res) {
	res.cookie('cookie_water', req.body.water);
	res.cookie('cookie_bathing', req.body.bathing);
	res.cookie('cookie_temperature', req.body.temperature);
	res.cookie('cookie_time', req.body.time);
	res.redirect(307, '/item');
})

router.post('/item', function(req, res) {
	res.sendFile(path.join(__dirname + "/../public/item_info.html")) // html 파일을 보내는 것
})

router.post('/online', function (req, res) {
    res.sendFile(path.join(__dirname+"/../public/online_mode.html"))
});

router.post('/online_mode', function (req, res) {
    res.cookie('cookie_avg_start', req.body.avg_start);
	res.cookie('cookie_avg_during', req.body.avg_during);
	res.cookie('cookie_avg_temp', req.body.avg_temp);
	res.cookie('cookie_avg_bath', req.body.avg_bath);
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

