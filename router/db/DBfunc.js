var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql')
var dbconfig = require('../../config.js')

router.post('/create', function (req, res) {
    var connection = mysql.createConnection(dbconfig);

    console.log('create db 접속시도');
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

        sql = 'SELECT * FROM u_db';
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                console.log("[mysql error]", err);
                connection.end();
            } else {
                for (var i = 0; i < rows.length; i++)
                    console.log(rows[i].u_name + " : " + rows[i].u_num);
            }
        })

        connection.end();
    })

});

router.post('/reference', function (req, res) {
    var connection = mysql.createConnection(dbconfig);

    console.log('reference db 접속시도');
    //var data = req.body.data;
    var responseData = {};
    var sql = 'SELECT * FROM u_db';

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
        }

        console.log(responseData.DB);
        res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
        connection.end();
    })
});

router.post('/delete', function (req, res) {
    var connection = mysql.createConnection(dbconfig);

    console.log('delete db 접속시도');
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
            return;
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


router.post('/update', function (req, res) {
    var connection = mysql.createConnection(dbconfig);

    console.log('update db 접속시도');
    var data = req.cookies.u_num;
    var responseData = {};
    console.log(data)

    var sql = 'SELECT * FROM u_db WHERE u_num=?';
    var query = connection.query(sql, [data], function (err, rows) {
        if (rows[0]) {
            responseData.result = 'ok';
            responseData.type = 'delete'

        } else {
            responseData.result = 'none';
            responseData.type = 'delete'
            console.log('none : ' + data);
            return;
        }
    });

    sql = 'UPDATE u_db set u_last = 2 where u_num=?';
    var query = connection.query(sql, [data], function (err, rows) {

        if (err) {
            responseData.result = 'none';
            responseData.type = 'update';
            console.log("[mysql error]", err);
            connection.end();

        }
        responseData.result = 'ok';
        responseData.type = 'update';
        console.log(responseData)
        res.json(responseData); // 비동기이기 때문에 괄호안에 적어야함
        connection.end();
    })
});

router.post('/user_start', function (req, res) {

    console.log('user_start db 접속시도');
    var connection = mysql.createConnection(dbconfig);
    var data = req.body;
    var responseData = {};

    var sql = 'SELECT * FROM u_db WHERE u_name=? AND u_age=? AND u_gender=? AND u_job=?';
    console.log(data);
    var query = connection.query(sql, [data.name, data.age, (data.gender == '남성' ? 0 : 1), data.job], function (err, rows) {
        res.cookie('u_num', rows[0].u_num);
        console.log(rows[0].u_num);
        if (err) {
            responseData.result = 'none';
            responseData.type = 'user_start';
            console.log("user_start error ", err);
            connection.end();
        }
        var update = 'UPDATE u_db set u_last =1 where u_num=?'
        var update_query = connection.query(update, [rows[0].u_num], function (err, rows) {
            if (err) {
                responseData.result = 'none';
                responseData.type = 'user_start';
                console.log("user_start error ", err);
                connection.end();
            }
            responseData.result = 'ok';
            responseData.type = 'user_start';
            res.json(responseData);
            connection.end();
        })
        responseData.result = 'ok';
        responseData.type = 'user_start';
        res.json(responseData);
        connection.end();
    })

});


module.exports = router;