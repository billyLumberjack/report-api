/*
r = requests.get("https://api.qwant.com/api/search/images",
    params={
        'count': 50,
        'q': query,
        't': 'images',
        'safesearch': 0,
        'locale': 'en_US'
    },
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
)
*/

'use strict';
var https = require('https');
var querystring = require('querystring');

module.exports.getImagesFromQuery = function(event, context, callback) {

    var queryObject = {
        count : 3,
        q : "figa",
        t : "images",
        safesearch : 1,
        locale : "it_IT"
    }    

    var qstr = querystring.stringify(queryObject);

    let request_params = {
        hostname : "api.qwant.com",
        path : "/api/search/images?" + qstr,//?count=3&q=montagne&t=images&safesearch=1&locale=en_US",
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
            var qwantObj = JSON.parse (body);
            //console.log("DONE", qwantObj.data.result.items);

            var response = {
                statusCode: 200,
                headers: {
                  "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                  "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(qwantObj.data.result.items)
              };

            callback(null, response);
        });
    });

};