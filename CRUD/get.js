'use strict';

var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {

  var arr = [""];

  var params = {
    TableName: process.env.MY_TABLE,
    IndexName: "MyGsi",
    FilterExpression: "",
    KeyConditionExpression: "#key = :value",
    ExpressionAttributeNames: {
      "#key": "Type"
    },
    ExpressionAttributeValues: {
      ":value": "ski-mountaineering"
    },
    ScanIndexForward: false
  };

  // Are there parameters ?
  if (event.queryStringParameters != null) {

    console.log("STRING PARAMS", JSON.stringify(event.queryStringParameters, null, 2));

    //Define exclusiveStartKey
    if (event.queryStringParameters.exclusiveStartKey != undefined)
      params["ExclusiveStartKey"] = JSON.parse(event.queryStringParameters.exclusiveStartKey);

    //Define eventually limit
    if (event.queryStringParameters.limit != undefined)
      params["Limit"] = parseInt(event.queryStringParameters.limit);

    //Date interval
    if (event.queryStringParameters.fromDate != null || event.queryStringParameters.toDate != null) {
      
      params.ExpressionAttributeNames["#Date"] = "Date";

      if(event.queryStringParameters.fromDate != null){
        params.KeyConditionExpression += " AND ";
        //from Date set
        params.KeyConditionExpression += "#Date >= :fromDate";
        params.ExpressionAttributeValues[":fromDate"] = parseInt(event.queryStringParameters.fromDate);
      }
      
      if(event.queryStringParameters.toDate != null){
        params.KeyConditionExpression += " AND ";
        //toDate set
        params.KeyConditionExpression += "#Date <= :toDate";
        params.ExpressionAttributeValues[":toDate"] = parseInt(event.queryStringParameters.toDate);
      }
    }
    

    //Readable Date interval
    if (event.queryStringParameters.fromReadableDate != null && event.queryStringParameters.toReadableDate != null) {
      params.FilterExpression += "#Date BETWEEN :fromDate AND :toDate";

      params.ExpressionAttributeNames["#Date"] = "Date";

      params.ExpressionAttributeValues[":fromDate"] = getTimestampFromDate(event.queryStringParameters.fromReadableDate);
      params.ExpressionAttributeValues[":toDate"] = getTimestampFromDate(event.queryStringParameters.toReadableDate);
    }

    //Starting Altitude interval
    if (event.queryStringParameters.fromStartingAltitude != null || event.queryStringParameters.toStartingAltitude != null) {

      params.ExpressionAttributeNames["#StartingAltitude"] = "StartingAltitude";
      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      if (event.queryStringParameters.fromStartingAltitude != null) {
        //from set
        if (event.queryStringParameters.toStartingAltitude != null) {
          //to set
          params.FilterExpression += "#StartingAltitude BETWEEN :fromStartingAltitude AND :toStartingAltitude";
          params.ExpressionAttributeValues[":fromStartingAltitude"] = parseInt(event.queryStringParameters.fromStartingAltitude);
          params.ExpressionAttributeValues[":toStartingAltitude"] = parseInt(event.queryStringParameters.toStartingAltitude);
        } else {
          //to NOT set
          params.FilterExpression += "#StartingAltitude >= :fromStartingAltitude";
          params.ExpressionAttributeValues[":fromStartingAltitude"] = parseInt(event.queryStringParameters.fromStartingAltitude);
        }
      } else if (event.queryStringParameters.toStartingAltitude != null) {
        //from NOT set && to set
        params.FilterExpression += "#StartingAltitude <= :toStartingAltitude";
        params.ExpressionAttributeValues[":toStartingAltitude"] = parseInt(event.queryStringParameters.toStartingAltitude);
      }


    }

    //End Altitude interval
    if (event.queryStringParameters.fromEndAltitude != null || event.queryStringParameters.toEndAltitude != null) {

      params.ExpressionAttributeNames["#EndAltitude"] = "EndAltitude";
      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      if (event.queryStringParameters.fromEndAltitude != null) {
        //from set
        if (event.queryStringParameters.toEndAltitude != null) {
          //to set
          params.FilterExpression += "#EndAltitude BETWEEN :fromEndAltitude AND :toEndAltitude";
          params.ExpressionAttributeValues[":fromEndAltitude"] = parseInt(event.queryStringParameters.fromEndAltitude);
          params.ExpressionAttributeValues[":toEndAltitude"] = parseInt(event.queryStringParameters.toEndAltitude);
        } else {
          //to NOT set
          params.FilterExpression += "#EndAltitude >= :fromEndAltitude";
          params.ExpressionAttributeValues[":fromEndAltitude"] = parseInt(event.queryStringParameters.fromEndAltitude);
        }
      } else if (event.queryStringParameters.toEndAltitude != null) {
        //from NOT set && to set
        params.FilterExpression += "#EndAltitude <= :toEndAltitude";
        params.ExpressionAttributeValues[":toEndAltitude"] = parseInt(event.queryStringParameters.toEndAltitude);
      }


    }

    //Elevation gain interval
    if (event.queryStringParameters.fromElevationGain != null || event.queryStringParameters.toElevationGain != null) {

      params.ExpressionAttributeNames["#ElevationGain"] = "ElevationGain";
      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      if (event.queryStringParameters.fromElevationGain != null) {
        //from set
        if (event.queryStringParameters.toElevationGain != null) {
          //to set
          params.FilterExpression += "#ElevationGain BETWEEN :fromElevationGain AND :toElevationGain";
          params.ExpressionAttributeValues[":fromElevationGain"] = parseInt(event.queryStringParameters.fromElevationGain);
          params.ExpressionAttributeValues[":toElevationGain"] = parseInt(event.queryStringParameters.toElevationGain);
        } else {
          //to NOT set
          params.FilterExpression += "#ElevationGain >= :fromElevationGain";
          params.ExpressionAttributeValues[":fromElevationGain"] = parseInt(event.queryStringParameters.fromElevationGain);
        }
      } else if (event.queryStringParameters.toElevationGain != null) {
        //from NOT set && to set
        params.FilterExpression += "#ElevationGain <= :toElevationGain";
        params.ExpressionAttributeValues[":toElevationGain"] = parseInt(event.queryStringParameters.toElevationGain);
      }


    }

    //Grade
    if (event.queryStringParameters.grade != null) {

      arr = event.queryStringParameters.grade.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#Grade"] = "Grade";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "#Grade = :Grade" + c;
        params.ExpressionAttributeValues[":Grade" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }

    //Region
    if (event.queryStringParameters.region != null) {

      arr = event.queryStringParameters.region.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#Region"] = "Region";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "contains(#Region, :Region" + c + ")";
        params.ExpressionAttributeValues[":Region" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }

    //UphillSide
    if (event.queryStringParameters.uphillSide != null) {

      arr = event.queryStringParameters.uphillSide.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#UphillSide"] = "UphillSide";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "contains(#UphillSide, :UphillSide" + c + ")";
        params.ExpressionAttributeValues[":UphillSide" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }

    //DownhillSide
    if (event.queryStringParameters.downhillSide != null) {

      arr = event.queryStringParameters.downhillSide.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#DownhillSide"] = "DownhillSide";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "contains(#DownhillSide, :DownhillSide" + c + ")";
        params.ExpressionAttributeValues[":DownhillSide" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }

    //TripName
    if (event.queryStringParameters.tripName != null) {

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#SearchTripName, :TripName)";

      params.ExpressionAttributeNames["#SearchTripName"] = "SearchTripName";

      params.ExpressionAttributeValues[":TripName"] = event.queryStringParameters.tripName;
    }
    //User
    if (event.queryStringParameters.user != null) {

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#User, :User)";

      params.ExpressionAttributeNames["#User"] = "User";

      params.ExpressionAttributeValues[":User"] = event.queryStringParameters.user;
    }
    //Target
    if (event.queryStringParameters.target != null) {

      arr = event.queryStringParameters.target.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#Target"] = "Target";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "#Target = :Target" + c;
        params.ExpressionAttributeValues[":Target" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }
    //tripRate
    if (event.queryStringParameters.tripRate != null) {

      arr = event.queryStringParameters.tripRate.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#TripRate"] = "TripRate";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "#TripRate = :TripRate" + c;
        params.ExpressionAttributeValues[":TripRate" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }
    //snowRate
    if (event.queryStringParameters.snowRate != null) {

      arr = event.queryStringParameters.snowRate.split(",");

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.ExpressionAttributeNames["#SnowRate"] = "SnowRate";

      for (var c = 0; c < arr.length; c++) {

        params.FilterExpression += "#SnowRate = :SnowRate" + c;
        params.ExpressionAttributeValues[":SnowRate" + c] = arr[c];

        if (c + 1 in arr)
          params.FilterExpression += " OR "
      }
    }
    //startingFrom
    if (event.queryStringParameters.startingFrom != null) {

      if (params.FilterExpression != "")
        params.FilterExpression += " AND ";

      params.FilterExpression += "contains(#StartingFrom, :StartingFrom)";

      params.ExpressionAttributeNames["#StartingFrom"] = "StartingFrom";

      params.ExpressionAttributeValues[":StartingFrom"] = event.queryStringParameters.startingFrom;
    }

  }

  //if none set filterExpressions remove the field
  if (params.FilterExpression === "")
    delete params.FilterExpression

  //console.log("PARAMS", JSON.stringify(params, null, 2));

  dbQueryFromParams(params, callback);
};

module.exports.getLastReports = (event, context, callback) => {
  // I parametri di default della query indicano solamente di usare MyGsi come indice secondario globale
  // vengono quindi richiesti i report in ordine di data discendente
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

  // se vengono trovati query parameters vengono utilizzati nella query
  // altrimenti usa quelli di default indicati da Amazon
  if (event.queryStringParameters != null) {

    if (event.queryStringParameters.exclusiveStartKey != undefined)
      params["ExclusiveStartKey"] = JSON.parse(event.queryStringParameters.exclusiveStartKey);

    if (event.queryStringParameters.limit != undefined)
      params["Limit"] = parseInt(event.queryStringParameters.limit);

  }

  dbQueryFromParams(params, callback);
};



function dbQueryFromParams(p, c) {

  console.log("QUERY PARAMS", p);

  // fetch todo from the database
  dynamoDb.query(p, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      c(null, {
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

    c(null, response);
  });
}

function getTimestampFromDate(value) {
  value = value.match(/[0-9]*\/[0-9]*\/[0-9]*/gi)[0];
  value = value.split("\/");
  value = value[1] + "," + value[0] + "," + value[2];
  return new Date(value).getTime();
}