var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql')
var path = require('path') // 상대경로 사용하는 모듈

//mysql 접속 정보
var connection = mysql.createConnection({
	host: 'us-cdbr-iron-east-01.cleardb.net',
	user: 'bf1138ba34c820',
	password: '22ac05b88712768',
	database: 'heroku_6295f565c172990'
});

connection.connect(); // mysql 접속 명령어

router.post('/form', function(req,res){
	// getEx : req.param('email') 과 같이 사용
	console.log(req.body.email) // 서버에서 클라이언트로 데이터를 받음
	res.send("<h1>Welcome!! " + req.body.email + "</h1>")
	res.render('email.ejs', {'email': req.body.email}) 
	// email.ejs에다가 다음과 같은 형태로 섞어 치환하여 클라이언트에 응답
});

router.post('/ajax', function(req,res){
	console.log('잘되는중 ㅎㅎ')
	var email = req.body.email;
	var responseDate = {};
	console.log(email)
	
	var query = connection.query('select u_name from u_id where u_name="' + email + '"', function(err,rows){
		if(err) {
			console.log('error : ' + err)
			throw err;
		}
		if(rows[0]){
			//console.log(rows[0].name);
			responseDate.result = 'ok';
			responseDate.name = rows[0].name;
		} else{
			responseDate.result = 'none';
			responseDate.name = "";
			//console.log('none : ' + rows[0]);
		}

		console.log(responseDate.result + ' ' + responseDate.name)
		connection.release();
		res.json(responseDate); // 비동기이기 때문에 괄호안에 적어야함
	})
});

module.exports = router;