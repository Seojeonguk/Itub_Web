var express = require('express')
var app = express()
var router = express.Router();
var path = require('path') // 상대경로 사용하는 모듈
var main = require('./main/main')
var email = require('./email/email')

// url routing
router.get('/', function(req, res){
	console.log('indexjs / path loaded')
	res.sendFile(path.join(__dirname + "../public/main.html")) // html 파일을 보내는 것
});

router.use('/main', main)
router.use('/email', email)

module.exports = router;

// 이렇게 index.js가 컨트롤러 역할을 해준다.