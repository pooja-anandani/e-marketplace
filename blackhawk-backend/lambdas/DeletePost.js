const AWS=require('aws-sdk')
exports.handler = async (event) => {
    // TODO implement
    
    var params = {
      TableName : 'Posts',
      Key: {
        "ID":event.ID
      },
        UpdateExpression: "set DEL_FLAG = :x",
        ConditionExpression: 'attribute_exists(ID)',
        ExpressionAttributeValues: {
            ':x': 'Y'
        }
    };
    
    var documentClient = new AWS.DynamoDB.DocumentClient();
    
    var response = {};
    
    return documentClient.update(params).promise().then((data)=>{
        response = {
            statusCode: 200,
            body: {"message":"Post deleted successfully!"},
        }
      
      return response;
    }).catch(()=>{
        response = {
            statusCode: 400,
            body: {"message":"Failed to delete post!"},
        }
        return response;
    });
    
}