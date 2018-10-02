import fs from 'fs';
import { promisify } from 'util';
import { imageprocess } from '../../src/handler';
import eventStub from './stubs/eventHttpApiGateway.json';
import maxWithRequired from './stubs/maxWithRequired.json';

const handler = promisify(imageprocess);

describe('Service aws to Lambda Resize image', () => {
  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.URL;
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
});
