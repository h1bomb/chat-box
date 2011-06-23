var http = require('http');

var server = http.createServer(function (req, res) {
var options = {
	host: 'api.twitter.com',
	port: 80,
	path: '/statuses/public_timeline.json'//,
	//data: {'screen_name': 'timonwang' , 'count': '100'}
};
http.get(options, function(response) {
	console.log("Got response: " + response.statusCode);
	response.on('data', function(chunk) {
		res.writeHead(200, {'Content-Type': 'text/javascript'});
		res.end(chunk);
	})
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});
});
 
server.listen(process.env.PORT || 8001);

