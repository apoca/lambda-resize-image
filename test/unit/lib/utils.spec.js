import AWSMock from 'aws-sdk-mock';
import fs from 'fs';
import path from 'path';
import {
  generateS3Key,
  resizeCallback,
  getImageKey,
} from '../../../src/lib/utils';

describe('Test resizeCallback error', () => {
  const newKey = 'new_default_640x480.jpg';
  const newPathKey = `${process.env.URL}/${newKey}`;
  const defaultImage = path.resolve(
    __dirname + '../../../images/default_640x480.jpg'
  );
  const tmpPathImageName = `${__dirname}/images/${newKey}`;
  const tmpImageName = Buffer.from(tmpPathImageName);

  beforeAll(() => {
    fs.createReadStream(defaultImage).pipe(
      fs.createWriteStream(tmpPathImageName)
    );
    AWSMock.mock('S3', 'putObject', (params, callback) => {
      callback(true, null);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Sending a error param, must return an error', () => {
    expect.assertions(1);
    const error = {
      error: 'Something went Wrong!',
    };

    return expect(
      resizeCallback(error, 'image/jpg', newPathKey, newPathKey)
    ).rejects.toEqual({
      error: 'Something went Wrong!',
    });
  });

  test('Getting am error sending image to S3', () => {
    expect.assertions(1);
    const error = null;

    return expect(
      resizeCallback(error, 'image/jpg', newPathKey, tmpImageName)
    ).rejects.toBeTruthy();
  });
});

describe('Test resizeCallback success', () => {
  process.env.URL = 'localhost:3000';
  process.env.BUCKET = 'my-bucket-here';
  const newKey = 'new_default_640x480.jpg';
  const newPathKey = `${process.env.URL}/${newKey}`;
  const defaultImage = path.resolve(
    __dirname + '../../../images/default_640x480.jpg'
  );
  const tmpPathImageName = `${__dirname}/images/${newKey}`;
  const tmpImageName = Buffer.from(tmpPathImageName);

  beforeAll(() => {
    fs.createReadStream(defaultImage).pipe(
      fs.createWriteStream(tmpPathImageName)
    );
    AWSMock.mock('S3', 'putObject', (params, callback) => {
      const data = {
        Location: newPathKey,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Sending a successfull image to AWS S3', () => {
    const error = null;

    return resizeCallback(error, 'image/jpg', newKey, tmpImageName).then(
      (data) => {
        expect(data).toMatchObject({
          statusCode: 301,
          headers: {
            Location: newPathKey,
          },
        });
      }
    );
  });
});

describe('Test generateS3Key', () => {
  test('Require both sizes width and height', () => {
    const size = {
      width: 100,
      height: 100,
    };

    expect(generateS3Key('xpto/name_here.jpg', size)).toEqual(
      `xpto/${size.width}x${size.height}/name_here.jpg`
    );
  });

  test('Require only size width', () => {
    const size = {
      width: 100,
      height: null,
    };

    expect(generateS3Key('xpto/name_here.jpg', size)).toEqual(
      `xpto/${size.width}xAUTO/name_here.jpg`
    );
  });

  test('Without basename, must return a key only', () => {
    const size = {
      width: null,
      height: null,
    };

    expect(generateS3Key('name_here.jpg', size)).toEqual('name_here.jpg');
  });

  test('Both sizes empty', () => {
    const size = {
      width: null,
      height: null,
    };

    expect(generateS3Key('xpto/name_here.jpg', size)).toEqual(
      'xpto/name_here.jpg'
    );
  });
});
