'use strict';
var AWS = require('aws-sdk');

module.exports.start = (event, context) => {

    var ec2 = new AWS.EC2({
        region: process.env.REGION
    });
    
    ec2.startInstances({
        InstanceIds : [process.env.INSTANCE_ID] 
    },
    function (err, data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            console.log(data); // successful response
        
        context.done(err,data);
    });
};

module.exports.stop = (event, context) => {
    var ec2 = new AWS.EC2({
        region: process.env.REGION
    });
    
    ec2.stopInstances({
        InstanceIds : [process.env.INSTANCE_ID] 
    },
    function (err, data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            console.log(data); // successful response
        
        context.done(err,data);
    });
};