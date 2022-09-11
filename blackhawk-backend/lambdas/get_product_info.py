import json
import boto3
from boto3.dynamodb.conditions import Key

post_table="Posts"
dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
dynamo_post_table = dynamodb.Table(post_table)

def lambda_handler(event, context):
    post_details = dynamo_post_table.scan(
                FilterExpression=Key('SELLER_EMAIL').eq(event.get("SELLER_EMAIL")) & Key("DEL_FLAG").eq("N")
            )
 
    return {
         "Items":post_details["Items"]
    }