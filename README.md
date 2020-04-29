# Serverless REST API
## Hot to deploy in TEST
set serverless.yml : 23 as `stage: dev` and then run:
```sh
serverless deploy
```
## Hot to deploy in PROD
set serverless.yml : 23 as `stage: prod` and then run:
```sh
serverless deploy
```
## Improvement
To compute day of the year in mongo use
```js
db["test-report-collection"].aggregate(
        [{
            $addFields:
            {
                dayOfYear: { $dayOfYear: {$toDate : "$Date"} }
            }
        },

        {
            $match:{
                "dayOfYear" : i
            }
        }
        ]
    )
```

The check this report use
```js
 db["test-report-collection"].find({
    "_id" : ObjectId("5a34740b47c0cb3a636a829f")
  }).pretty()
```