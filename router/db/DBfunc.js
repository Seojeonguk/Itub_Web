var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql')
var path = require('path') // 상대경로 사용하는 모듈
var dbconfig = require('../../config.js')

router.post('/create', function (req, res) {
	var connection = mysql.createConnection(dbconfig);

	console.log('db 접속시도');
	var data = req.body.data;
	var responseData = {};
	var sql = 'INSERT INTO u_db(u_name, u_age, u_gender, u_job) VALUES (?, ?, ?, ?)';
	console.log(data)

	var query = connection.query(sql, [data.u_name, parseInt(data.u_age), parseInt(data.u_gender), data.u_job], function (err, rows) {

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
	var sql = 'SELECT * FROM u_db';
	console.log(data)

	var query = connection.query(sql, function (err, rows) {

		if (err) {
			console.log("[mysql error]", err);
			connection.end();
		}

		if (rows.length !== 0) {
			responseData.type = 'reference';
			responseData.result = 'ok';
			responseData.DB = rows;
		} else {
			responseData.result = 'none';
			responseData.type = 'reference';
			console.log('none');
			responseData.DB = {'':''};
			;
		}

		console.log(responseData.DB);
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

	var sql = 'SELECT * FROM u_db WHERE u_name=?';
	var query = connection.query(sql, [data], function (err, rows) {
		if (rows[0]) {
			responseData.result = 'ok';
			responseData.type = 'delete'
		} else {
			responseData.result = 'none';
			responseData.type = 'delete'
			console.log('none : ' + data);
			responseData.DB = {'':''};
		}
	});

	sql = 'DELETE FROM u_db WHERE u_num=?';
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
