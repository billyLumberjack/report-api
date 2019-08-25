'use strict';

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URL;
var collection_name = process.env.MONGO_COLLECTION;
//////
const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const fileType = require('file-type');
const s3 = new AWS.S3();
const S3_BUCKET = process.env.IMAGES_BUCKET;

module.exports.postReport = (event, context, callback) => {

  var database;

  var report_to_insert = JSON.parse(event.body);
  var insertCallback = function (err, result) {
    if (err) throw err;
    database.close();

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.ops[0])
    };

    callback(null, response);
  };

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    database = db;
    db.collection(collection_name).insertOne(report_to_insert, insertCallback);
  });

};

module.exports.postImage = (event, context, callback) => {
  event.body = event.body.replace(/^data:([A-Za-z-+\/]+);base64,/, "");

  let buffer = new Buffer(event.body, 'base64');
  let fileMime = fileType(buffer);

  if (fileMime == null) {
    return context.fail('the string supplied is not a file type');
  }

  var params = {
    Bucket: S3_BUCKET,
    Key: uuid.v1() + "." + fileMime.ext,// + event.headers["Content-Type"].split("/")[1],
    Body: buffer,
    ContentType: fileMime.mime,
    ACL: "public-read"
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      return res.end();
    }
    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        signedRequest: data,
        url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
      }, null, 2)
    };

    callback(null, response);

  });




};