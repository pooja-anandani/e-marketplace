import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
dynamo_request_table = dynamodb.Table("RequestManagement")

def lambda_handler(event, context):
    seller_email = event.get("SELLER_EMAIL")
    status_details = dynamo_request_table.scan(
                FilterExpression=Key('SELLER_EMAIL').eq(seller_email)
            )
    return {
         "Items":status_details["Items"]
    }