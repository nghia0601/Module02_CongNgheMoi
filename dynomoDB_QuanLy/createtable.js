var AWS = require("aws-sdk");

AWS.config.update({
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": "", "secretAccessKey": ""
  });

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Users",
    KeySchema: [       
        { AttributeName: "TenDN", KeyType: "HASH"},  //Partition key
        { AttributeName: "SDT", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "TenDN", AttributeType: "S" },
        { AttributeName: "SDT", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

var params = {
    TableName : "DanhBa",
    KeySchema: [       
        { AttributeName: "MaDanhBa", KeyType: "HASH"},  //Partition key
        { AttributeName: "TrangThai", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "MaDanhBa", AttributeType: "S" },
        { AttributeName: "TrangThai", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});