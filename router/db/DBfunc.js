var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql')
var path = require('path') // 상대경로 사용하는 모듈
var dbconfig = require('../../config.js')

//connection.connect(); // mysql 접속 명령어

router.post('/form', function(req,res){
	// getEx : req.param('email') 과 같이 사용
	console.log(req.body.data) // 서버에서 클라이언트로 데이터를 받음
	res.send("<h1>Welcome!! " + req.body.email + "</h1>")
	res.render('email.ejs', {'email': req.body.email}) 
	// email.ejs에다가 다음과 같은 형태로 섞어 치환하여 클라이언트에 응답
});

router.post('/reference', function(req,res){
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var data = req.body.data;
	var responseDate = {};
	var sql = 'SELECT u_name FROM u_id WHERE job=?';
	console.log(data)

	var query = connection.query(sql, [data], function(err,rows){

		if(err) {
			console.log("[mysql error]",err);
			connection.end();
		}

		if(rows[0]){
			responseDate.result = 'ok';
			responseDate.u_name = rows[0].u_name;
			console.log(rows[0]);
		} else{
			responseDate.result = 'none';
			responseDate.u_name = "";
			console.log('none : ' + data);
		}

		console.log(responseDate.result + ' ' + responseDate.u_name)
		res.json(responseDate); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});

router.post('/delete', function(req,res){
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var email = req.body.email;
	var responseDate = {};
	var sql = 'DELETE FROM u_id WHERE u_name=?';
	console.log(email)

	var query = connection.query(sql, [email], function(err,rows){

		if(err) {
			console.log("[mysql error]",err);
			connection.end();
		}

		if(rows[0]){
			responseDate.result = 'ok';
			responseDate.u_name = rows[0].u_name;
			console.log(rows[0]);
		} else{
			responseDate.result = 'none';
			responseDate.u_name = "";
			console.log('none : ' + email);
		}

		console.log(responseDate.result + ' ' + responseDate.u_name)
		res.json({'지웠어':'지웠다니까'}); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});

module.exports = router;
