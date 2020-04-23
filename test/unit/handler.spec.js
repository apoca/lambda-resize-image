import fs from 'fs';
import path from 'path';
import AWSMock from 'aws-sdk-mock';
import * as image from '../../src/lib/image';
import * as utils from '../../src/lib/utils';
import { promisify } from 'util';
import { imageprocess } from '../../src/handler';
import eventStub from './stubs/eventHttpApiGateway.json';
import emptySize from './stubs/emptySizeEvent.json';
import eventSizeAuto from './stubs/eventSizeAuto.json';
import maxSizeEvent from './stubs/maxWithRequired.json';
import eventSizeWidth from './stubs/eventSizeWidthOnly.json';

const handler = promisify(imageprocess);

describe('Service aws to Lambda Resize image', () => {
  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  test('Require environment variable BUCKET', () => {
    process.env.URL = 'localhost:3000';
    const event = {
      path: 'image.png',
    };
    const context = {};

    handler(event, context).then((data) => {
      expect(data.statusCode).toBe(404);
      expect(data.body).toBe(
        'Error: Set environment variables BUCKET and URL.'
      );
    });
  });

  test('Require environment variable URL', () => {
    process.env.BUCKET = 'my-bucket-here';
    const event = {
      path: 'image.png',
    };
    const context = {};

    handler(event, context).then((data) => {
      expect(data.statusCode).toBe(404);
      expect(data.body).toBe(
        'Error: Set environment variables BUCKET and URL.'
      );
    });
  });

  test('Require image height with AUTO value', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = eventSizeAuto;
    const context = {};

    const result = handler(event, context);
    result.then((data) => expect(data).toMatchSnapshot());
  });

  test('Empty size image', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = emptySize;
    const context = {};

    const result = handler(event, context);
    result.then((data) => expect(data).toMatchSnapshot());
  });

  test('Require a request with both sizes', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = eventStub;
    const context = {};

    const result = handler(event, context);
    result.then((data) => expect(data).toMatchSnapshot());
  });

  test('Require size with allowed dimensions', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = maxSizeEvent;
    const context = {};

    handler(event, context).then((data) => {
      expect(data.statusCode).toBe(403);
      expect(data.body).toBe('Error: Image size not permited.');
    });
  });
});

describe('test getImageKey', () => {
  test('Return getImageKey', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = {
      path: 'localhost:3001/v1/image.png',
    };
    const context = {};
    utils.getImageKey = jest.fn();
    const result = handler(event, context);
  });
});

describe('Service aws testing and mocking library function', () => {
  const defaultImage = path.resolve(__dirname + '../images/default.txt');

  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (params, callback) => {
      callback(null, Buffer.from(fs.readFileSync(defaultImage)));
    });

    AWSMock.mock('S3', 'headObject', (_params, callback) => {
      callback(true, null);
    });

    AWSMock.mock('S3', 'putObject', (_params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/default.txt`,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
    jest.unmock(image.getImage);
    jest.unmock(image.checkKeyExists);
    jest.unmock(image.resizeImage);
  });

  test('Require both sizes empty to call getImage and catch error', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = emptySize;
    const context = {};
    const err = new Error();
    err.code = 404;
    err.body = 'Type of file not supported!';

    image.getImage = jest.fn(() => Promise.reject(err));

    handler(event, context);
  });

  test('Require only size width and catch error', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = eventSizeWidth;
    const context = {};
    const err = new Error();
    err.code = 404;
    err.body = 'NotFound';

    image.checkKeyExists = jest.fn(() => Promise.reject(err));

    handler(event, context);
  });

  test('Require both sizes and catch error', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const event = eventStub;
    const context = {};
    const err = new Error();
    err.code = 404;
    err.body = 'Something went wrong!';

    image.resizeImage = jest.fn(() => Promise.reject(err));

    handler(event, context);
  });
});
