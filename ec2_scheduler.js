'use strict';
/* variable declarations */
var AWS = require('aws-sdk');
var aws_config = {region: process.env.REGION};

var instances = {
    InstanceIds : [process.env.INSTANCE_ID] 
};

/* END variable declarations*/
/* exporting lambda functions*/

module.exports.start = (event, context) => {

    var ec2 = new AWS.EC2(aws_config);
    ec2.startInstances(
        instances,
        function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else
                console.log(data); // successful response
            
            context.done(err,data);
        }
    );

};

module.exports.stop = (event, context) => {
    var ec2 = new AWS.EC2(aws_config);
    ec2.stopInstances(
        instances,
        function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else
                console.log(data); // successful response
            
            context.done(err,data);
        }        
    );
};

/* END lambda functions */