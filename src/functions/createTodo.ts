import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '@libs/dynamoDBClient';
import { v4 as uuidV4 } from 'uuid';
interface ICreateUser {
  title: string;
  done: boolean;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, done, deadline } = JSON.parse(event.body) as ICreateUser;

  const id = uuidV4();

  await document
    .put({
      TableName: 'todos',
      Item: {
        id,
        user_id,
        title,
        done,
        deadline,
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: 'todos',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
