import json
import boto3
from boto3.dynamodb.conditions import Key


secret_name = "ses_secret"
region_name = "us-east-1"
client = boto3.client(service_name='secretsmanager',region_name=region_name)
get_secret_value_response = client.get_secret_value(SecretId=secret_name)
credentials = json.loads(get_secret_value_response["SecretString"])
ses_client = boto3.client('ses',
region_name=region_name,
aws_access_key_id=credentials["API_KEY"],
aws_secret_access_key=credentials["SECRET_API_KEY"])


dynamodb = boto3.resource('dynamodb', region_name=region_name)
dynamo_request_table = dynamodb.Table("RequestManagement")

def send_email(seller,buyer,title):
    send_email_response={}
    CHARSET = "UTF-8"
    try:
        response = ses_client.send_email(
            Destination={
                "ToAddresses":[ buyer,
                ]
            
            },
            Message={
                "Body": {
                    "Text": {
                        "Charset": CHARSET,
                        "Data": f"Hello, the seller of {title} accepted your request \n you can connect with them on {seller}",
                    }
                },
                "Subject": {
                    "Charset": CHARSET,
                    "Data": f"BlackHawk Marketplace Contact Information for {title}",
                },
            },
            Source="pooja.anandani@dal.ca",
        )
        send_email_response["status"]="Ok"
    except Exception as e:
        send_email_response["status"]="Error"
    return send_email_response
        


def lambda_handler(event, context):
    try:
        d_resonse = dynamo_request_table.update_item( Key={'ID': event.get("ID")},
            UpdateExpression="set R_STATUS = :r",
            ConditionExpression='attribute_exists(ID)',
            ExpressionAttributeValues={
                ':r': event["R_STATUS"],
            },
    
            )
        if event["R_STATUS"]=="Accepted":
            send_res = send_email(event["SELLER_EMAIL"], event["BUYER_EMAIL"],event["POST_TITLE"])
            if send_res["status"]=="Ok":
                return {
                    'statusCode': 200,
                    'message': "Request accepted and buyer have been notified"
                }
            else:
                return {
                    'statusCode': 502,
                    "message":"Error occured while sending an email"
                }
        else:
            return {
                "statusCode":200,
                "message":"Request decliend and status updated"
            }
    except:
        return {
                "statusCode":200,
                "message":"No such record found"
            }
        