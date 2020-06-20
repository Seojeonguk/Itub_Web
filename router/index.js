var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./db/DBfunc');
let { PythonShell } = require('python-shell');

app = express();

app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({ extended: true })) // 인코딩된 url 형태로 받을때
app.use(cookieParser());


router.use('/db', db);


// url routing
router.get('/', function (req, res) {
	console.log('접속 성공적')
	res.sendFile(path.join(__dirname + "/../public/main_page.html")) // html 파일을 보내는 것
});

router.post('/profile', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/profile.html")) // html 파일을 보내는 것
});

router.post('/item_cookie', function (req, res) {
	res.cookie('cookie_water', req.body.water);
	res.cookie('cookie_bathing', req.body.bathing);
	res.cookie('cookie_temperature', req.body.temperature);
	res.cookie('cookie_time', req.body.time);

	res.redirect(307, '/item');
});

router.post('/item', function (req, res) {
	py_cookie = 1;
	console.log(py_cookie)
    alert(req.cookies);
    py_name = req.cookies.cookie_name;
	py_age = req.cookies.cookie_age;
	py_gender = req.cookies.cookie_gender;
	py_job = req.cookies.cookie_job;
	py_water = req.cookies.cookie_bathing;
	py_temperature = req.cookies.cookie_temperature;
	py_time = req.cookies.cookie_time;
	res.sendFile(path.join(__dirname + "/../public/item_info.html")) // html 파일을 보내는 것
	
});

router.post('/profile_cookie', function (req, res) {
	res.cookie('cookie_name', req.body.cookie_name);
	res.cookie('cookie_age', req.body.cookie_age);
	res.cookie('cookie_gender', req.body.cookie_gender);
	res.cookie('cookie_job', req.body.cookie_job);
	res.redirect(307, '/user');
});

router.post('/online', function (req, res) {

	var options = {
		// pythonPath: "C:\\Python34\\python.exe", //window path
		pythonPath: '',    //ubuntu path
		scriptPath: '',    // 실행할 py 파일 path. 현재 nodejs파일과 같은 경로에 있어 생략
		args: [req.cookies.cookie_age, req.cookies.cookie_gender, req.cookies.cookie_job]
	};

	PythonShell.run("predict.py", options, function (err, results) {
		if (err) {
			console.log('err msg : ', err);
			res.redirect(307, '/online');
		}

		var predict_Arr = results.toString().split('/');
		console.log('dddd')
		console.log(predict_Arr)

		if (predict_Arr[2] == 'cold') {
			predict_Arr[2] = '시원함';
		} else if (predict_Arr[2] == 'nomal') {
			predict_Arr[2] = '미지근함';
		} else predict_Arr[2] = '따뜻함';

		console.log(predict_Arr[0] + ' / ' + predict_Arr[1] + ' / ' + predict_Arr[2]);

		res.cookie('cookie_predict_start', predict_Arr[0]);
		res.cookie('cookie_predict_during', predict_Arr[1]);
		res.cookie('cookie_predict_temp', predict_Arr[2]);

		res.sendFile(path.join(__dirname + "/../public/online_mode.html")) // html 파일을 보내는 것
	});
});

router.post('/recommend', function (req, res) {
	res.sendFile(path.join(__dirname + "/../public/recommend_mode.html")) // html 파일을 보내는 것
});

router.post('/user', function (req, res) {
    console.log(res.cookie);
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

router.post('/py', function (req, res) {
	console.log(py_cookie)
	console.log(req.body.cookie_job)
	var py_data = {'msg':py_cookie, 'py_name':py_name, 'py_age':py_age, 'py_gender':py_gender, 'py_job':'직업_' + py_job.toString(), 'py_water':py_water, 'py_bathing':py_bathing, 'py_temperture':py_temperature, 'py_time':py_time}
	res.send(py_data)
});

app.use(express.static('public'));

module.exports = router;

// 이렇게 index.js가 컨트롤러 역할을 해준다.

