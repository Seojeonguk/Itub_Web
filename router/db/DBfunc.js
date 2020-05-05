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
	var responseData = {};
	var sql = 'SELECT * FROM u_id WHERE u_name=?';
	console.log(data)

	var query = connection.query(sql, [data], function(err,rows){

		if(err) {
			console.log("[mysql error]",err);
			connection.end();
		}

		if(rows[0]){
			responseData.type = 'reference';
			responseData.result = 'ok';
			responseData.u_num = rows[0].u_num;
			responseData.age = rows[0].age;
			responseData.gender = rows[0].gender;
			responseData.job = rows[0].job;
			console.log(rows[0]);
		} else{
			responseData.result = 'none';
			console.log('none');
		}

		console.log(responseData)
		res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});

router.post('/delete', function(req,res){
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var data = req.body.data;
	var responseData = {};
	var sql = 'SELECT * FROM u_id WHERE u_name=?';
	console.log(data)

	var query = connection.query(sql, [data], function(err,rows){

		if(err) {
			console.log("[mysql error]",err);
			connection.end();
		}

		if(rows[0]){
			responseData.result = 'ok';
			responseData.u_num = rows[0].u_num;
			responseData.age = rows[0].age;
			responseData.gender = rows[0].gender;
			responseData.job = rows[0].job;
			console.log(rows[0]);
		} else{
			responseData.result = 'none';
			responseData.data = "";
			console.log('none : ' + data);
		}

		console.log(responseData)
		res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});

module.exports = router;
