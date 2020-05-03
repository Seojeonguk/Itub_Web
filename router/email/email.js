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

// db 접속 종료시 재연결
function handleDisconnect(){
	// 연결 되어있을시
	connection.connect(function(err){
		if (err){
			console.log('db접속중', err)
			// 서버 연결시간이 30초라 29초로 설정
			setTimeout(handleDisconnect, 29000);
		}
	})

	// 연결 안되어있을시
	connection.on('error', function(err){
		console.log('db 에러', err);
		if (err.code == 'PROTOCOL_CONNECTION_LOST'){
			return handleDisconnect();
		} else{
			throw err;
		}
	})
}

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
	var sql = 'SELECT u_name FROM u_id WHERE job=?';
	console.log(email)

	var query = connection.query(sql, [String(email)], function(err,rows){
		if(err) {
			console.log("[mysql error]",err);
			connection.release();
			handleDisconnect();
		}

		if(rows[0]){
			responseDate.result = 'ok';
			responseDate.name = rows[0].name;
			console.log(rows[0].name);
		} else{
			responseDate.result = 'none';
			responseDate.name = "";
			console.log('none : ' + rows[0]);
		}

		console.log(responseDate.result + ' ' + responseDate.name)
		connection.release();
		res.json(responseDate); // 비동기이기 때문에 괄호안에 적어야함
	})
});

handleDisconnect();

module.exports = router;