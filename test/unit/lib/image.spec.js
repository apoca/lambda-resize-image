var AWSMock = require('aws-sdk-mock');
import fs from 'fs';
import path from 'path';
import { getImage, checkKeyExists, resizeImage } from '../../../src/lib/image';

describe('Test getImage', () => {
  const defaultImage = path.resolve(
    __dirname + '../../../images/default_640x480.jpg'
  );

  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', Buffer.from(fs.readFileSync(defaultImage)));
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get image from aws getImage from local bucket', () => {
    process.env.BUCKET = 'example';
    process.env.URL = 'localhost:3001';
    const key = 'images/default_640x480.jpg';

    return getImage(key).then(data => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: {
          Location: `${process.env.URL}/images/default_640x480.jpg`
        }
      });
    });
  });
});

describe('Test checkKeyExists', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'headObject', (params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/image.jpg`
      };

      callback(null, data);
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get url from aws checkKeyExists width with and height', () => {
    process.env.BUCKET = 'example';
    process.env.URL = 'localhost:3001';
    const key = 'images/image.jpg';
    const size = {
      width: 500,
      height: 500
    };

    return checkKeyExists(key, size).then(data => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: { Location: `${process.env.URL}/images/500x500/image.jpg` }
      });
    });
  });

  test('Get url from aws checkKeyExists widthout height, should retuen auto', () => {
    process.env.BUCKET = 'example';
    process.env.URL = 'localhost:3001';
    const key = 'images/image.jpg';
    const size = {
      width: 500
    };

    return checkKeyExists(key, size).then(data => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: { Location: `${process.env.URL}/images/500xAUTO/image.jpg` }
      });
    });
  });
});

describe('Test resizeImage', () => {
  const defaultImage = path.resolve(
    __dirname + '../../../images/default_640x480.jpg'
  );

  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', Buffer.from(fs.readFileSync(defaultImage)));
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });
  /*
  test('Get url from aws resizeImage width with and height', () => {
    process.env.BUCKET = 'example';
    process.env.URL = 'localhost:3001';
    const key = 'images/default_640x480.jpg';
    const size = {
      width: 500,
      height: 500
    };

    return resizeImage(key, size).then(data => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: { Location: `${process.env.URL}/images/500x500/image.jpg` }
      });
    });
  });*/
});
