import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
AWSMock.setSDKInstance(AWS);
import { promisify } from 'util';
import { imageprocess } from '../../src/handler';

const handler = promisify(imageprocess);

describe('Service aws to Lambda Resize image', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'putObject', function(params, callback) {
      console.log('MOCK WORKS!');
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Require environment variables', done => {
    process.env.BUCKET = null;
    process.env.URL = null;

    const context = {};
    const event = {
      path: 'image.png'
    };
    const callback = (err, res) => {
      expect(res.statusCode).toBe(404);
      done();
    };

    return handler(event, context, callback);
  });

  test('Require image size', done => {
    process.env.BUCKET = 'my-bucket-here';
    process.env.URL = 'localhost:3000';
    const event = {
      path: 'image.png',
      queryParameters: {
        width: 330,
        height: 330
      }
    };
    const context = {};

    const callback = (err, res) => {
      done();
    };

    handler(event, context, callback);
  });
});
