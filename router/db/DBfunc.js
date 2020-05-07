var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql')
var path = require('path') // 상대경로 사용하는 모듈
var dbconfig = require('../../config.js')

//connection.connect(); // mysql 접속 명령어

router.post('/form', function (req, res) {
	// getEx : req.param('email') 과 같이 사용
	console.log(req.body.data) // 서버에서 클라이언트로 데이터를 받음
	res.send("<h1>Welcome!! " + req.body.email + "</h1>")
	res.render('email.ejs', { 'email': req.body.email })
	// email.ejs에다가 다음과 같은 형태로 섞어 치환하여 클라이언트에 응답
});

router.post('/create', function (req, res) {
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var data = req.body.data;
	var responseData = {};
	var sql = 'INSERT INTO u_id(u_num, u_name, age, gender, job) VALUES (?, ?, ?, ?, ?)';
	console.log(data)

	var query = connection.query(sql, [100, data.u_name, parseInt(data.u_age), parseInt(data.u_gender), data.u_job], function (err, rows) {

		if (err) {
			console.log("[mysql error]", err);
			responseData.result = 'none'
			responseData.type = 'create'
			connection.end();
		} else {
			responseData.result = 'ok'
			responseData.type = 'create'
		}

		console.log(responseData)
		res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});


router.post('/reference', function (req, res) {
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var data = req.body.data;
	var responseData = {};
	var sql = 'SELECT * FROM u_id';
	console.log(data)

	var query = connection.query(sql, function (err, rows) {

		if (err) {
			console.log("[mysql error]", err);
			connection.end();
		}

		if (rows[0]) {
			responseData.type = 'reference';
			responseData.result = 'ok';
			for (var i = 0; i < rows.length; i++) {
				responseData.u_num = rows[i].u_num;
				responseData.age = rows[i].age;
				responseData.gender = rows[i].gender;
				responseData.job = rows[i].job;
				console.log(rows[i].u_num + ' ' + rows[i].u_age + ' ' + rows[i].u_gender + ' ' + rows[i].u_job + ' ');
			}
		} else {
			responseData.result = 'none';
			responseData.type = 'reference';
			console.log('none');
		}

		console.log(responseData)
		res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});

router.post('/delete', function (req, res) {
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var data = req.body.data;
	var responseData = {};
	console.log(data)

	var sql = 'SELECT * FROM u_id WHERE u_name=?';
	var query = connection.query(sql, [data], function (err, rows) {
		if (rows[0]) {
			responseData.result = 'ok';
			responseData.type = 'delete'
		} else {
			responseData.result = 'none';
			responseData.type = 'delete'
			console.log('none : ' + data);
		}
	});

	sql = 'DELETE FROM u_id WHERE u_name=?';
	var query = connection.query(sql, [data], function (err, rows) {

		if (err) {
			console.log("[mysql error]", err);
			connection.end();
		}

		console.log(responseData)
		res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
		connection.end();
	})
});

module.exports = router;
