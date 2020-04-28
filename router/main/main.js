var express = require('express')
var app = express()
var router = express.Router();
var path = require('path') // 상대경로 사용하는 모듈

router.get('/', function(req, res){
    console.log('main js loaded')
	res.sendFile(path.join(__dirname, "../public/main.html")) // html 파일을 보내는 것
});

module.exports = router;