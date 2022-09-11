const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

exports.handler = async (event) => {
    
    var params = {
      TableName: "Posts",
      FilterExpression : 'DEL_FLAG = :flag',
      ExpressionAttributeValues : {':flag' : "N"}
    };
    
    var documentClient = new AWS.DynamoDB.DocumentClient();
    
    let response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    
    return documentClient.scan(params).promise().then((data)=>{
        return data;
    }).catch((err)=>{
        return JSON.stringify("Error");
    })
    
};
