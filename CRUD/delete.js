'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.MY_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // delete the todo from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },      
      body: JSON.stringify({}),
    };
    callback(null, response);
  });
};