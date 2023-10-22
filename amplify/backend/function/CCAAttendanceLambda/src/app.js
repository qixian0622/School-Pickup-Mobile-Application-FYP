/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand,  } = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "CCAAttendance";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "ChildID";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/ccaAttendance";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

// CCA Teacher Check Absentees Yesterday
app.get(path + '/getAbsent', function (req, res) {
  var params = {
    TableName: tableName,
    FilterExpression: "Date1 = :AttendanceDate and Attendance = :Status and CCASubject = :Subject",
    ExpressionAttributeValues: {
      ":AttendanceDate":req.query.Date1,
      ":Status":req.query.Attendance,
      ":Subject":req.query.Subject
    },

  };
  docClient.scan(params, (err, data) => {
    if (err) {
      //res.json({ error: 'Could not load items: ' + err});
      console.log(err,err.stack)
    }
    res.json({
      data: data.Items.map(item => {
        return item;
      })
    });
  });
})


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path + '/updateAttendance', async function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'put call succeed!', url: req.url, data: data ,message:"Success"})
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body});
  }
});


app.post(path + '/markAttendance', function (req, res) {
  games = [];
  temp = parseInt(req.body.ID)
  temp++;
  req.body.ccalist.map((e) => {
    games.push({
      PutRequest: {
        Item: {
          ID:parseInt(temp),
          ChildID:e.ChildID,
          CName: e.CName,
          CCASubject: req.body.CCASubject,
          Date1:req.body.Date,
          Attendance: req.body.attendancelist[e.ChildID]
        }
      }
    });
    console.log(temp)
    temp++;
  })
  games.sort((a, b) => { return a.ID - b.ID;})
  let params = {
    RequestItems: {
      [tableName]: games
    }
};
docClient.batchWrite(params, function(err, data) {
  if (err) {
      res.json({error: '' + err});
  } else {
      res.json({message:"Success"})
  }
});
})

app.get(path + '/gethighestid', function (req, res) {
  var params = {
    TableName: tableName,
    ProjectionExpression:"ID"
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      //res.json({ error: 'Could not load items: ' + err});
      console.log(err,err.stack)
    }
    res.json({
      data: data.Items.map(item => {
        return item;
      })
    });
  });
})

app.get(path + '/getAllRecords', function (req, res) {
  var params = {
    TableName: tableName,
    FilterExpression:"CCASubject =:CCA and Date1 = :Date1",
    ExpressionAttributeValues:{
      ":CCA":req.query.CCA,
      ":Date1":req.query.Date1,
    }
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      res.json({ error: 'Could not load items: ' + err.message });
    }
    res.json({
      data: data.Items.map(item => {
        return item;
      })
    });
  });
})

app.get(path + '/generate', function (req, res) {
  var params = {
    TableName: tableName,
    FilterExpression: "Date1 = :AttendanceDate and CCASubject =:CCA",
    ExpressionAttributeValues: {
      ":AttendanceDate":req.query.Date1,
      ":CCA":req.query.CCA,
    },

  };
  docClient.scan(params, (err, data) => {
    if (err) {
      //res.json({ error: 'Could not load items: ' + err});
      console.log(err,err.stack)
    }
    res.json({
      data: data.Items.map(item => {
        return item;
      })
    });
  });
})

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
