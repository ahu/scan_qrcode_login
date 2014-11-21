var clients = [],
	http = require('http'), 
	url = require('url'), 
	fs = require('fs'), 
	querystring = require('querystring'),
	qrcode = require('qrcode'), 
	UUID = require('uuid-js'), 
	sha1 = require('sha1'), 
	redis = require('redis'), 
	redisClient = redis.createClient(), 
	redisKey = 'QRCODE_LOGIN_TOKEN';

function generateIndex(sessionID, req, res) {
	fs.readFile('./index.html', 'UTF-8', function(err, data) {
		data = data.replace(/SESSIONID/g, sessionID);
		res.writeHead(200, {
			'Content-Type' : 'text/html; charset=UTF-8'
		});
		res.end(data);
	});
}

function generateQRCode(sessionID, req, res) {
	res.writeHead(200, {
		'Content-Type' : 'image/png'
	});
	qrcode.draw(sessionID, function(err, canvas) {
		res.end(canvas.toBuffer());
	});
} 

function handleScanned(res, token, sessionID) {
	var success = false;
	if (typeof(token) != 'undefined') {
		var userName;
		redisClient.hget(redisKey, token, function(err, reply) {
			userName = reply;
			if (typeof(userName) != 'undefined') {
				for (var int = 0; int < clients.length; int++) {
					var clientobj = clients[int];
					var savedSession = clientobj.sessionID;
					var client = clientobj.res;
					if (savedSession == sessionID) {
						client.end(JSON.stringify({
							cmd : 'scanned'
						}));
						clients.splice(int, 1);
						success = true;
						break;
					}
				}
			}
			res.writeHead(200, {
				'Content-Type' : 'text/html; charset=UTF-8'
			});
			if (success) {
				res.end('scanned');
			} else {
				res.end('error');
			}
		});
	}
}

function handleConfirmed(res, token, sessionID) {
	var success = false;
	if (typeof(token) != 'undefined') {
		var userName;
		redisClient.hget(redisKey, token, function(err, reply) {
			userName = reply;
			if (typeof(userName) != 'undefined') {
				for (var int = 0; int < clients.length; int++) {
					var clientobj = clients[int];
					var savedSession = clientobj.sessionID;
					var client = clientobj.res;
					if (savedSession == sessionID) {
						client.end(JSON.stringify({
							cmd : 'pclogin',
							username : userName
						}));
						clients.splice(int, 1);
						success = true;
						break;
					}
				}
			}
			res.writeHead(200, {
				'Content-Type' : 'text/html; charset=UTF-8'
			});
			if (success) {
				res.end('confirmed');
			} else {
				res.end('error');
			}
		});
	}
}

http.createServer(function(req, res) {
	var url_parts = url.parse(req.url);
	var path = url_parts.pathname;
	var uuid4 = UUID.create();
	var _sessionID = uuid4.toString();
	if (path == '/') {
		var sessionID = url_parts.query;

		if (typeof(sessionID) == 'undefined' || sessionID == '' || sessionID === null) {
			res.writeHead(200, {
				'Refresh' : '0; url=/?' + _sessionID,
				'Content-Type' : 'text/html; charset=UTF-8'
			});
			res.end();
		} else {
			console.log(sessionID);

			generateIndex(sessionID, req, res);
		}
	} else if (path == '/poll') {
		var sessionID = url_parts.query;

		if (typeof(sessionID) != 'undefined') {
			var sessionObj = {
				'sessionID' : sessionID,
				'res' : res
			};
			clients.push(sessionObj);

			console.log('client added : ' + sessionObj.sessionID);
		} else {
			console.log('no sessionID');
		}
	} else if (path == '/qrcodeimage') {
		var sessionID = url_parts.query;

		if (typeof(sessionID) != 'undefined') {
			generateQRCode(sessionID, req, res);

			console.log('QRCode generated');
		} else {
			console.log('no sessionID');
		}
	} else if (path == '/moblogin') {
		var userName = url_parts.query;

		if (typeof(userName) != 'undefined') {
			var token = sha1(userName);

			redisClient.hset(redisKey, token, userName);
			res.writeHead(200, {
				'Content-Type' : 'text/html; charset=UTF-8'
			});
			res.end(token);

			console.log('mobile logined');
		} else {
			console.log('no userName');
		}
	} else if (path == '/scanned') {
		var objQuery = querystring.parse(url_parts.query);
		var sessionID = objQuery.sessionid;
		var token = objQuery.token;

		if (typeof(sessionID) != 'undefined' && typeof(token) != 'undefined') {
			handleScanned(res, token, sessionID);

			console.log('scanned');
		} else {
			console.log('no sessionID or no token');
		}
	} else if (path == '/confirmed') {
		var objQuery = querystring.parse(url_parts.query);
		var sessionID = objQuery.sessionid;
		var token = objQuery.token;

		if (typeof(sessionID) != 'undefined' && typeof(token) != 'undefined') {
			handleConfirmed(res, token, sessionID); 

			console.log('confirmed');
		} else {
			console.log('no sessionID or no token');
		}
	} else {
		res.writeHead(200, {
			'Content-Type' : 'text/html; charset=UTF-8'
		});
		res.end();
	}
}).listen(9999, '114.113.159.141');
console.log('Running at port: 9999.');