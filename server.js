var http = require('http');
 
 /**
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello world!\n");
});
 
server.listen(process.env.PORT || 8001);
*/
var options = {
	host: 'api.twitter.com',
	port: 80,
	path: '/1/statuses/user_timeline.json',
	data: {'screen_name': 'timonwang' , 'count': '100'}
};
http.get(options, function(response) {
	console.log("Got response: " + response.statusCode);
	response.on('data', function(chunk) {
		response.writeHead(200, {'Content-Type': 'text/javascript'});
		response.end(chunk);
	})
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});