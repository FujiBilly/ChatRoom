var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next){
	res.render('index', {title: 'NodeJS聊天室'});
});

router.get('/chat', function(req, res, next){
	res.render('chat', {title: 'NodeJS聊天室'});
});

router.get('/list', function(req, res, next){
	var nick = require('../bin/www');
	var arr = [];
	for(var i in nick){
		arr.push(i+','+nick[i]);
	}
	res.render('list', {
		title: "NodeJS聊天室",
		arr: arr
	});
});


module.exports = router;
