import AWS from 'aws-sdk-mock';
import { promisify } from 'util';
import { imageprocess } from '../../src/handler';
import eventStub from './stubs/eventHttpApiGateway.json';
import maxWithRequired from './stubs/maxWithRequired.json';
import getImage from './stubs/getImage.json';

const handler = promisify(imageprocess);

describe('Service aws to Lambda Resize image', () => {
  beforeAll(() => {
    AWS.mock(
      'S3',
      'getObject',
      Buffer.from(require('fs').readFileSync('../images/brand-logo.jpg'))
    );
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  afterAll(() => {
    AWS.restore('S3');
  });

  test('Require environment variables', () => {
    const event = {
      path: 'image.png'
    };
    const context = {};

    const result = handler(event, context);
    result
      .then(data => {
        expect(data.statusCode).toBe(404);
      })
      .catch(e => {
        expect(e).toBe('Error: Set environment variables BUCKET and URL.');
      });
  });

  test('Require image size', () => {
    process.env.BUCKET = 'foo';
    process.env.URL = 'bar';
    const event = eventStub;
    const context = {};

    const result = handler(event, context);
    result.then(data => expect(data).toMatchSnapshot());
  });

  test('Image size not permited', () => {
    process.env.BUCKET = 'foo';
    process.env.URL = 'bar';
    const event = maxWithRequired;
    const context = {};

    const result = handler(event, context);
    result
      .then(data => {
        expect(data.statusCode).toBe(403);
      })
      .catch(e => {
        expect(e).toBe('Image size not permited.');
      });
  });

  test('get image', () => {
    process.env.BUCKET = 'esolidar-proto-uploads';
    process.env.URL =
      'https://esolidar-proto-uploads.s3-eu-west-1.amazonaws.com';
    const event = getImage;
    const context = {};

    const result = handler(event, context);
    result
      .then(data => {
        console.log('data', data);
        expect(data.statusCode).toBe(301);
      })
      .catch(e => {
        console.log('e', e);
        expect(e).toBe('Image size not permited.');
      });
  });
});
