const AWS = require("aws-sdk");
require("dotenv").config();
console.log(process.env.AWS_ACCESS_KEY_ID)
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
}); 
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const params = {
        TableName: 'Posts',
        Key: {
          ID: event.ID,
        },
        UpdateExpression: 'set POST_TITLE = :t, DESCRIPTION = :d, PRICE = :p',
        ExpressionAttributeValues: {
          ':t': event.POST_TITLE,
          ':d' : event.DESCRIPTION,
          ':p': event.PRICE
        },
    };
    return docClient.update(params).promise().then((data) => {
        if(data){
            return({'data':" Post Modified Successfully"})
        }
        else
        {
            return({'err':data})
        }
    });
}