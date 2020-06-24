var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
//const session = require('express-session');
//const FileStore = require('session-file-store')(session);
var db = require('./db/DBfunc');
let {
    PythonShell
} = require('python-shell');

var app = express();

app.use(bodyParser.json()) // json의 형태로 받을때
app.use(bodyParser.urlencoded({
    extended: true
})) // 인코딩된 url 형태로 받을때
app.use(cookieParser());
/*app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store:new FilesStore()
}));*/

router.use('/db', db);

/*let user = {
    py_cookie:"0",
    py_name:"0",
    py_gender="0",
    py_job="0",
    py_water="0",
    py_bathing="0",
    py_temperature='0',
    py_time='0'
};*/
/*global.py_cookie = 0;
global.py_name = 0;
global.py_age = 0;
global.py_gender = 0;
global.py_job = 0;
global.py_water = 0;
global.py_bathing = 0;
global.py_temperature = 0;
global.py_time = 0;*/

// url routing
router.get('/', function (req, res) {
    console.log('get');

    /*res.cookie('py_cookie','1', {
        maxAge:60*60*1000*1000,
    });
    
    
    res.cookie('cookie_gender','1');
    res.cookie('py_name',req.cookies.py_name, {
        maxAge:60*60*1000*1000
    });
    console.log("req.cookies");
    console.log(req.cookies);
    res.cookie('py_bathing',req.cookies.cookie_bathing);
    res.cookie('py_age',req.cookies.cookie_age);
    res.cookie('py_gender',req.cookies.cookie_gender);
    res.cookie('py_job',req.cookies.cookie_job);
    res.cookie('py_water',req.cookies.cookie_water);
    res.cookie('py_temperature',req.cookies.cookie_temperature);
    res.cookie('py_time','1');*/
    /*py_cookie = 0;
	py_name = 0;
	py_age = 0;
	py_gender = 0;
	py_job = 0;
	py_water = 0;
	py_bathing = 0;
	py_temperature = 0;
	py_time = 0;*/
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
    var date = new Date();
    var year = date.getFullYear();
    var month = new String(date.getMonth() + 1);
    var day = new String(date.getDate());
    // 한자리수일 경우 0을 채워준다. 
    if (month.length == 1) month = "0" + month;
    if (day.length == 1) day = "0" + day;
    date = year + "-" + month + "-" + day;
    var gender = (req.cookies.cookie_gender == '남성' ? '남' : '여');
    var age = req.cookies.cookie_age;
    var temp = req.cookies.cookie_temperature;
    var start = 11;
    var during = req.cookies.cookie_time;
    var end = 12;
    var perfume = (req.cookies.cookie_bathing == '없음' ? '무' : '유');
    var job = req.cookies.cookie_job;
    var weather = 20;
    var text = date + "," + gender + "," + age + "," + temp + "," + start + "," + during + "," + end + "," + perfume + "," + job+"," + weather;
    console.log(text)
    var options = {
        // pythonPath: "C:\\Python34\\python.exe", //window path
        pythonPath: '', //ubuntu path
        scriptPath: '', // 실행할 py 파일 path. 현재 nodejs파일과 같은 경로에 있어 생략
        args: [date, gender, age,temp,start,during,end,perfume,job,weather]
    };
    PythonShell.run("csvmodify.py", options, function (err, results) {
        console.log("csvmodify run");
        if (err) {
            console.log('err msg : ', err);
            res.redirect(307, '/online');
        }
    });
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
        pythonPath: '', //ubuntu path
        scriptPath: '', // 실행할 py 파일 path. 현재 nodejs파일과 같은 경로에 있어 생략
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
    var py_data = {
        'msg': 1,
        'py_name': py_name,
        'py_age': py_age,
        'py_gender': py_gender,
        'py_job': '직업_' + py_job,
        'py_water': py_water,
        'py_bathing': py_bathing,
        'py_temperature': py_temperature,
        'py_time': py_time
    }
    res.send(py_data)
});

app.use(express.static('public'));

module.exports = router;

// 이렇게 index.js가 컨트롤러 역할을 해준다.