'use strict';

var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.update({ region: 'eu-central-1' });


var dynamoDb = new AWS.DynamoDB.DocumentClient();

var params = {
	TableName: 'report-table',
	IndexName: 'MyGsi',
	//FilterExpression: '#Date >= :fromDate',
	KeyConditionExpression: '#key = :value AND #Date >= :fromDate',
	ExpressionAttributeNames: { '#key': 'Type', '#Date': 'Date' },
	ExpressionAttributeValues: { ':value': 'ski-mountaineering', ':fromDate': 1510185600000 },
	ScanIndexForward: false
}

dynamoDb.query(params, (error, result) => {
	// handle potential errors
	if (error) {
		console.error(error);
		return;
	}

	console.log(JSON.stringify(result, null, 2));
});