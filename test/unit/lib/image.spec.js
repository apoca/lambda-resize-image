import AWSMock from 'aws-sdk-mock';
import fs from 'fs';
import path from 'path';
import * as image from '../../../src/lib/image';
import * as utils from '../../../src/lib/utils';

describe('Test getImage with error rejects', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      callback(true, null);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get an error when retrieve an image', () => {
    expect.assertions(1);
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default_640x480.jpg';

    return expect(image.getImage(key)).rejects.toBeTruthy();
  });
});

describe('Test getImage success resolve', () => {
  const defaultImage = path.resolve(
    __dirname + '../../../images/default_640x480.jpg'
  );

  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      callback(null, Buffer.from(fs.readFileSync(defaultImage)));
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get image from aws getImage from local bucket', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default_640x480.jpg';

    return image.getImage(key).then((data) => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: {
          Location: `${process.env.URL}/images/default_640x480.jpg`,
        },
      });
    });
  });
});

describe('Test checkKeyExists on error', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'headObject', (params, callback) => {
      const error = {
        code: 'NotFound',
      };

      callback(error, null);
    });
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/default.jpg`,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
    jest.unmock(image.resizeImage);
  });

  test('Key does not exists, so return an error not found', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default_640x480.jpg';
    const size = {
      width: 150,
      height: 150,
    };

    return image.checkKeyExists(key, size).catch((e) => {
      expect(e).toBeTruthy();
    });
  });
});

describe('Test checkKeyExists on success', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'headObject', (_params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/image.jpg`,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get url from aws checkKeyExists width with and height', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/image.jpg';
    const size = {
      width: 500,
      height: 500,
    };

    return image.checkKeyExists(key, size).then((data) => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: { Location: `${process.env.URL}/images/500x500/image.jpg` },
      });
    });
  });

  test('Get url from aws checkKeyExists widthout height, should retuen auto', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/image.jpg';
    const size = {
      width: 500,
    };

    return image.checkKeyExists(key, size).then((data) => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: { Location: `${process.env.URL}/images/500xAUTO/image.jpg` },
      });
    });
  });
});

describe('Test resizeImage without with and height values', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/default.jpg`,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get original url if no size given', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.jpg';
    const size = {};

    return image.resizeImage(key, size).then((data) => {
      expect(data).toMatchObject({
        statusCode: 301,
        headers: { Location: `${process.env.URL}/images/default.jpg` },
      });
    });
  });
});

describe('Test resizeImage with an error', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      callback(true, null);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Get original url if no size given', () => {
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.jpg';
    const size = {};

    return expect(image.resizeImage(key, size)).rejects.toBeTruthy();
  });
});

describe('Test success resizeImage with size width only', () => {
  const defaultImage = path.resolve(
    __dirname + '../../../images/default_640x480.jpg'
  );
  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      const data = {
        Body: Buffer.from(fs.readFileSync(defaultImage)),
      };

      callback(null, data);
    });

    AWSMock.mock('S3', 'putObject', (_params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/150xAUTO/default.jpg`,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
    jest.unmock(utils.resizeCallback);
  });

  test('Get url images/150xAUTO/default.jpg', () => {
    expect.assertions(1);
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.jpg';
    const size = {
      width: 150,
      height: null,
    };

    const data = {
      statusCode: 301,
      headers: {
        Location: `${process.env.URL}/images/${size.width}xAUTO/default.jpg`,
      },
    };

    utils.resizeCallback = jest.fn(() => data);

    return image.resizeImage(key, size).then((result) => {
      expect(result).toMatchObject(data);
    });
  });

  test('Get error url images/150xAUTO/default.jpg', () => {
    expect.assertions(1);
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.jpg';
    const size = {
      width: 150,
      height: null,
    };

    const data = {
      statusCode: 301,
      headers: {
        Location: `${process.env.URL}/images/${size.width}xAUTO/default.jpg`,
      },
    };

    utils.resizeCallback = jest.fn(() => data);

    return image.resizeImage(key, size).then((result) => {
      expect(result).toMatchObject(data);
    });
  });

  test('Get url images/150x150/default.jpg', () => {
    expect.assertions(1);
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.jpg';
    const size = {
      width: 150,
      height: 150,
    };

    const data = {
      statusCode: 301,
      headers: {
        Location: `${process.env.URL}/images/${size.width}x${size.height}/default.jpg`,
      },
    };

    utils.resizeCallback = jest.fn(() => data);

    return image.resizeImage(key, size).then((result) => {
      expect(result).toMatchObject(data);
    });
  });
});

describe('Test error resizeImage with size width only', () => {
  const defaultImage = path.resolve(__dirname + '../../../images/default.txt');
  beforeAll(() => {
    AWSMock.mock('S3', 'getObject', (_params, callback) => {
      const data = {
        Body: Buffer.from(fs.readFileSync(defaultImage)),
      };

      callback(null, data);
    });

    AWSMock.mock('S3', 'putObject', (_params, callback) => {
      const data = {
        Location: `${process.env.URL}/images/150xAUTO/default.txt`,
      };

      callback(null, data);
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
    jest.unmock(utils.resizeCallback);
  });

  test('Get error when retrieve url images/150xAUTO/default.txt', () => {
    expect.assertions(1);
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.txt';
    const size = {
      width: 150,
      height: null,
    };

    const data = {
      statusCode: 301,
      headers: {
        Location: `${process.env.URL}/images/${size.width}xAUTO/default.txt'`,
      },
    };

    utils.resizeCallback = jest.fn(() => data);

    return expect(image.resizeImage(key, size)).rejects.toBeTruthy();
  });

  test('Get error when retrieve url images/150x150/default.txt', () => {
    expect.assertions(1);
    process.env.URL = 'localhost:3000';
    process.env.BUCKET = 'my-bucket-here';
    const key = 'images/default.txt';
    const size = {
      width: 150,
      height: 150,
    };

    const data = {
      statusCode: 301,
      headers: {
        Location: `${process.env.URL}/images/${size.width}x${size.height}/default.txt'`,
      },
    };

    utils.resizeCallback = jest.fn(() => data);

    return expect(image.resizeImage(key, size)).rejects.toBeTruthy();
  });
});
