'use strict';

const ParamsHelper = require("./../lib/test-lib");

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URL;
var collection_name = process.env.MONGO_COLLECTION;
var database;

module.exports.get = (event, context, callback) => {

    console.log("COLLECTION NAME ", collection_name);

    var params = {
        filter: {
        },
        project: {},
        sort: {
            Date:-1,
            CreatedAt: -1
        },
        limit: 100,
        skip: 0
    };

    // Are there parameters ?
    if (event.queryStringParameters != null) {

        console.log("QUERY STRING PARAMS\n", JSON.stringify(event.queryStringParameters, null, 2));

        params = ParamsHelper.ceaCreatedAt(event.queryStringParameters, params);
        params = ParamsHelper.ceaSkip(event.queryStringParameters, params);
        params = ParamsHelper.ceaLimit(event.queryStringParameters, params);
        params = ParamsHelper.ceaDate(event.queryStringParameters, params);
        params = ParamsHelper.ceaStartingAltitude(event.queryStringParameters, params);
        params = ParamsHelper.ceaEndAltitude(event.queryStringParameters, params);
        params = ParamsHelper.ceaElevationGain(event.queryStringParameters, params);
        params = ParamsHelper.ceaGrade(event.queryStringParameters, params);
        params = ParamsHelper.ceaRegion(event.queryStringParameters, params);
        params = ParamsHelper.ceaUphillSide(event.queryStringParameters, params);
        params = ParamsHelper.ceaDownhillSide(event.queryStringParameters, params);
        params = ParamsHelper.ceaTripName(event.queryStringParameters, params);
        params = ParamsHelper.ceaUser(event.queryStringParameters, params);
        params = ParamsHelper.ceaTarget(event.queryStringParameters, params);
        params = ParamsHelper.ceaTripRate(event.queryStringParameters, params);
        params = ParamsHelper.ceaSnowRate(event.queryStringParameters, params);
        params = ParamsHelper.ceaStartingFrom(event.queryStringParameters, params);

        console.log("Querying with params", params);

    }
    else {
        console.log("no parameters");
    }
    dbQueryFromParams(params, callback);
};

function dbQueryFromParams(p, c) {

    console.log("trying", p);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(collection_name).find(p.filter, p.project).sort(p.sort).skip(p.skip).limit(p.limit).toArray(
            function (err, result) {
                if (err) throw err;
                console.log("success, size", result.length);
                db.close();

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
    });
}

function getTimestampFromDate(value) {
    value = value.match(/[0-9]*\/[0-9]*\/[0-9]*/gi)[0];
    value = value.split("\/");
    value = value[1] + "," + value[0] + "," + value[2];
    return new Date(value).getTime();
}
