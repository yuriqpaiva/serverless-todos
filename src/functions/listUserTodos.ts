import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '@libs/dynamoDBClient';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: 'todos',
      IndexName: 'user_id',
      KeyConditionExpression: 'user_id = :user_id',
      ExpressionAttributeValues: {
        ':user_id': user_id,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  };
};
