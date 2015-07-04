var express = require('express');
var router = express.Router();
var ModelProxy = require('../lib/modelproxy.js')

ModelProxy.init('interfaces.json');

var User = new ModelProxy('User.*');
var Test = new ModelProxy('Test.*');

/* GET home page. */
router.get('/', function(req, res, next) {
	var cookie = req.headers.cookie;
	User.get_info()
		.post_test({'data':'Post data set.'})
		.withCookie(cookie)
		.done(function(data1, data2, setCookies){
			if (data1.status == 200 && data2.status == 200) {
				res.setHeader('Set-Cookie', setCookies);
				res.render('index', { User: data1.user_info, Cookies: data1.cookies, Post: data2.post_data });
			}
			else
				res.send('Internal error.' + data1 + data2);
		});
});

/* Proxy of REST API*/
router.get('/api/sum', function(req, res, next){
	Test.sum({
		'a' : req.query.a?req.query.a:0,
		'b' : req.query.b?req.query.b:0
	}).done(function(data){
		res.json(data);
	})
});


module.exports = router;
