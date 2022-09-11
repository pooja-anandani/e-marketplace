const AWS = require("aws-sdk");
require("dotenv").config();
const uuid = require("uuid");
console.log(process.env.AWS_ACCESS_KEY_ID);
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
exports.handler = async (event, context) => {
  var params = {
    TableName: "RequestManagement",
    Item: {
      ID: { S: uuid.v1() },
      BUYER_EMAIL: { S: event.BUYER_EMAIL },
      SELLER_EMAIL: { S: event.SELLER_EMAIL },
      BUYER_NAME: {S: event.BUYER_NAME},
      POST_TITLE:{S: event.POST_TITLE},
      POST_ID:{S: event.POST_ID},
      R_STATUS: { S: "Created" },
      MESSAGE: {S: event.MESSAGE}
    },
  };
  return ddb
    .putItem(params)
    .promise()
    .then(
      (data) => {
        if (data) {
          return { sucess: "Request Created" };
        }
      },
      (err) => {
        if (err) {
          return { err: err };
        }
      }
    );
};
