'use strict';

var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {

  var params = {};
  params.TableName = process.env.MY_TABLE;
  var key = { "Id": event.pathParameters.id };
  params.Key = key;

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};

module.exports.getLastReports = (event, context, callback) => {

  let params = {
    TableName: process.env.MY_TABLE,
    IndexName: "MyGsi",
    KeyConditionExpression: "#key = :value",
    ExpressionAttributeNames: {
      "#key": "Type"
    },
    ExpressionAttributeValues: {
      ":value": "ski-mountaineering"
    },
    ScanIndexForward: false
  };

  console.log("ALMOST IN", event.queryStringParameters);

  if (event.queryStringParameters != null) {

    if (event.queryStringParameters.exclusiveStartKey != undefined)
      params["ExclusiveStartKey"] = JSON.parse(event.queryStringParameters.exclusiveStartKey);

    if (event.queryStringParameters.limit != undefined)
      params["Limit"] = parseInt(event.queryStringParameters.limit);
  }


  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: error,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result)
    };

    callback(null, response);
  });
};