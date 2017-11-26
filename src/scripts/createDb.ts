/* tslint:disable */
/**
 * Credentials are detected by the AWS SDK
 * AWS_ACCESS_KEY_ID
 * AWS_SECRET_ACCESS_KEY
 * AWS_SESSION_TOKEN (optional)
 * http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
 */
/* tslint:enable */
/* tslint:disable no-console */
import * as dynogels from 'dynogels';
import * as util from 'util';
import StandupConfiguration from '../models/StandupConfiguration';
import StandupResponse from '../models/StandupResponse';

// Reference needed to avoid import being optimized out by TypeScript compiler
// imports are doing the model definition. Will not work without it.
const models = [StandupConfiguration, StandupResponse];

const AWS = dynogels.AWS;
AWS.config.update({ region: process.env.AWS_DYNAMODB_REGION });
// Run against local if set
if (process.env.AWS_DYNAMODB_ENDPOINT) {
  const opts = { endpoint: process.env.AWS_DYNAMODB_ENDPOINT };
  dynogels.dynamoDriver(new AWS.DynamoDB(opts));
}

dynogels.createTables((err) => {
  // console.log (a);
  console.log(err);
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Tables have been created');
    console.log(util.inspect(dynogels.models));
    models.forEach((model) => {
      console.log(`Created model ${model.name} as:`);
      model.describeTable((describeError, data) => {
        console.log(util.inspect(data, { depth: 4 }));
      });
    });
  }
});
