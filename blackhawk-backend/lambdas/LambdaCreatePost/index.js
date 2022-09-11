const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});
var uuid = require("uuid");
const s3 = new AWS.S3();
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var params = {
  TableName: "Posts",
  Item: {
    ID: { S: uuid.v1() },
    SELLER_NAME: { S: "Richard Roe" },
    POST_TITLE: { S: " TITLE" },
    DESCRIPTION: { S: "THE DESCRIPTION" },
    CATEGORY: { S: " SOME CATEGORY" },
    PRICE: { N: "999" },
    IMAGE: { S: "/uri/url" },
    SELLER_EMAIL:{S:"test@mail.com"},
    DEL_FLAG:{S:"N"},
    TIMESTAMP:{S: new Date().toUTCString()}
  },
};

exports.handler = async (event, context) => {
  var file = event.fileName.split(".");
  var name = file[0] + Date.now().toString() + ".jpeg";
  const fileName = name;
  var buf = Buffer.from(
    event.fileData.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const upload_params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };
  return s3
    .upload(upload_params)
    .promise()
    .then(
      function (data) {
        params.Item.ID = { S: uuid.v1() }
        params.Item.IMAGE = { S: "di8tu6v4qzzc8.cloudfront.net/" + fileName };
        params.Item.POST_TITLE = { S: event.title };
        params.Item.DESCRIPTION = { S: event.description };
        params.Item.CATEGORY = { S: event.category };
        params.Item.PRICE = { N: event.price };
        params.Item.SELLER_EMAIL = { S: event.sellerEmail };
        params.Item.SELLER_NAME = { S: event.sellerName };
        console.log(params);
        return ddb
          .putItem(params)
          .promise()
          .then(
            (data) => {
              if (data) {
                return { sucess: "Post Created" };
              }
            },
            (err) => {
              if (err) {
                return { err: err };
              }
            }
          );
      },
      function (err) {
        return "Upload failed", err;
      }
    );
};
