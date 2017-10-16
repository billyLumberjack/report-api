'use strict';

var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {

  console.log("HEY YOU");
 
  // Are there parameters ?
  if(event.queryStringParameters != null){

    console.log("PARAMS FOUND ! ");

    var params = {
      TableName: process.env.MY_TABLE,
      FilterExpression:"",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    };       

    //Size limit
    if(event.queryStringParameters.limit != null){
      params["Limit"] = parseInt(event.queryStringParameters.limit);
    }    

    //Date interval
    if(event.queryStringParameters.fromDate != null && event.queryStringParameters.toDate != null){
      params.FilterExpression += "#Date BETWEEN :fromDate AND :toDate";

      params.ExpressionAttributeNames["#Date"] = "Date";

      params.ExpressionAttributeValues[":fromDate"] = parseInt(event.queryStringParameters.fromDate);
      params.ExpressionAttributeValues[":toDate"] = parseInt(event.queryStringParameters.toDate);
    }

    //Readable Date interval
    if(event.queryStringParameters.fromReadableDate != null && event.queryStringParameters.toReadableDate != null){
      params.FilterExpression += "#Date BETWEEN :fromDate AND :toDate";

      params.ExpressionAttributeNames["#Date"] = "Date";

      params.ExpressionAttributeValues[":fromDate"] = getTimestampFromDate(event.queryStringParameters.fromReadableDate);
      params.ExpressionAttributeValues[":toDate"] = getTimestampFromDate(event.queryStringParameters.toReadableDate);
    }    

    //Starting Altitude interval
    if(event.queryStringParameters.fromStartingAltitude != null && event.queryStringParameters.toStartingAltitude != null){

      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "#StartingAltitude BETWEEN :fromStartingAltitude AND :toStartingAltitude";

      params.ExpressionAttributeNames["#StartingAltitude"] = "StartingAltitude";

      params.ExpressionAttributeValues[":fromStartingAltitude"] = parseInt(event.queryStringParameters.fromStartingAltitude);
      params.ExpressionAttributeValues[":toStartingAltitude"] = parseInt(event.queryStringParameters.toStartingAltitude);      
    }
    
    //Elevation gain interval
    if(event.queryStringParameters.fromElevationGain != null && event.queryStringParameters.toElevationGain != null){
      
      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "#ElevationGain BETWEEN :fromElevationGain AND :toElevationGain";

      params.ExpressionAttributeNames["#ElevationGain"] = "ElevationGain";

      params.ExpressionAttributeValues[":fromElevationGain"] = parseInt(event.queryStringParameters.fromElevationGain);
      params.ExpressionAttributeValues[":toElevationGain"] = parseInt(event.queryStringParameters.toElevationGain);       
    }
    
    //Grade
    if(event.queryStringParameters.grade != null){
      
      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "#Grade = :Grade";

      params.ExpressionAttributeNames["#Grade"] = "Grade";

      params.ExpressionAttributeValues[":Grade"] = event.queryStringParameters.grade;
    }
    
    //Region
    if(event.queryStringParameters.region != null){
      
      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#Region, :Region)";

      params.ExpressionAttributeNames["#Region"] = "Region";

      params.ExpressionAttributeValues[":Region"] = event.queryStringParameters.region;      
    }
    
    //UphillSide
    if(event.queryStringParameters.uphillSide != null){
      
      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#UphillSide, :UphillSide)";

      params.ExpressionAttributeNames["#UphillSide"] = "UphillSide";

      params.ExpressionAttributeValues[":UphillSide"] = event.queryStringParameters.uphillSide;           
    }
    
    //DownhillSide
    if(event.queryStringParameters.downhillSide != null){
      
      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#DownhillSide, :DownhillSide)";

      params.ExpressionAttributeNames["#DownhillSide"] = "DownhillSide";

      params.ExpressionAttributeValues[":DownhillSide"] = event.queryStringParameters.downhillSide;          
    }
    
    //TripName
    if(event.queryStringParameters.tripName != null){
      
      if(params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#SearchTripName, :TripName)";

      params.ExpressionAttributeNames["#SearchTripName"] = "SearchTripName";

      params.ExpressionAttributeValues[":TripName"] = event.queryStringParameters.tripName;           
    }

  }
  else{
    console.log("NO PARAMS");
    var params = {
      TableName: process.env.MY_TABLE,
      Limit:3,
      ScanIndexForward: false
    };       
  }
  
  console.log("---------------------",params,"-------------------------");
  dbScanFromParams(params, callback);

};

function dbScanFromParams(p, c){
  dynamoDb.scan(p, (error, result) => {

    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
      });
      return;
    }

    var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.Items),
    };
    c(null, response);

  });    
}

function getTimestampFromDate(value){
  value = value.match(/[0-9]*\/[0-9]*\/[0-9]*/gi)[0];
  value = value.split("\/");
  value = value[1]+","+value[0]+","+value[2];
  return new Date(value).getTime();
}

