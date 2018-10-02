import { promisify } from 'util';
import { generateS3Key, resizeCallback } from '../../../src/lib/utils';

const resize = promisify(resizeCallback);

describe('Test generate S3 key', () => {
  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  test('With a error from resize, resize callback must expect an error', () => {
    expect.assertions(1);
    process.env.BUCKET = 'my-bucket-here';
    process.env.URL = 'localhost:3000';

    const error = {
      message: 'Something went wrong!'
    };
    const contentType = '';
    const newKey = '';
    const tmpImageName = '';

    return resizeCallback(error, contentType, newKey, tmpImageName).catch(e => {
      expect(e).toEqual({
        message: 'Something went wrong!'
      });
    });
  });

  test('Sending a successfull image to AWS S3', () => {
    process.env.BUCKET = 'esolidar-proto-uploads';
    process.env.URL = 'localhost:3000';
    const error = null;
    const contentType = 'image/jpg';
    const newKey = 'new_default_640x480.jpg';
    const tmpImageName = __dirname + '/images/default_640x480.jpg';

    return resizeCallback(error, contentType, newKey, tmpImageName).then(
      data => {
        expect(data).toMatchObject({
          statusCode: 301,
          headers: { Location: `${process.env.URL}/${newKey}` }
        });
      }
    );
  });

  test('Require both sizes width and height', () => {
    const size = {
      width: 100,
      height: 100
    };

    expect(generateS3Key('xpto/name_here.jpg', size)).toEqual(
      `xpto/${size.width}x${size.height}/name_here.jpg`
    );
  });

  test('Require only size width', () => {
    const size = {
      width: 100,
      height: null
    };

    expect(generateS3Key('xpto/name_here.jpg', size)).toEqual(
      `xpto/${size.width}xAUTO/name_here.jpg`
    );
  });

  test('Must return only old key', () => {
    const size = {
      width: null,
      height: null
    };

    expect(generateS3Key('xpto/name_here.jpg', size)).toEqual(
      'xpto/name_here.jpg'
    );
  });
});
