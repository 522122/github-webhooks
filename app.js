var http = require('http');
var git = require('simple-git');
var createHandler = require('node-github-webhook');
var projects = require('./projects');

// var projects = [
// 	{
// 			path: '/webhooks/...',
// 			secret: '...',
// 			local: '/home/.../code/..'
// 	}
// ];

var handler = createHandler(projects.reduce(function(a,b) {
	a.push({ path: b.path, secret: b.secret })
	return a;
}, []));

http.createServer(function (req, res) {
	handler(req, res, function (err) {
		res.statusCode = 404
		res.end('no such location')
	});
}).listen(8181);

// handler
handler.on('error', function (err) {
	console.error('Error:', err.message)
});

handler.on('push', function (event) {
	var path = event.path
	var project = projects.filter(function(p) {
		return p.path === path;
  	})[0];

  	git(project.local).pull();
  	console.log(event.path);
});
