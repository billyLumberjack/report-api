'use strict';
let https = require ('https');

//curl 'https://api.qwant.com/api/search/images?count=50&q=montagne&t=images&safesearch=1&locale=en_US' -H 'DNT: 1' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Connection: keep-alive' --compressed

let request_params = {
	hostname : "api.qwant.com",
	path : "/api/search/images?count=50&q=montagne&t=images&safesearch=1&locale=en_US",
	headers : {
		"Connection": "keep-alive",
		"Accept": "application/json",
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0"
	}
};

https.get(request_params, function (response) {
	var body = '';

	response.on('error', function (err) {
		console.log("ERROR", err);
	});

	response.on('data', function (d) {
		body += d;
	});

	response.on('end', function () {
		var manna = JSON.parse (body)
		callback(null, body);//manna.data.result.items);
	});
});