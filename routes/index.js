var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next){
	res.render('index', {title: 'NodeJS聊天室'});
});

router.get('/chat', function(req, res, next){
	res.render('chat', {title: 'NodeJS聊天室'});
});


module.exports = router;
