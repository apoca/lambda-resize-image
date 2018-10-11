import { getImage, checkKeyExists } from './lib/image';
import { getImageKey } from './lib/utils';
const ALLOWED_DIMENSIONS = {
  width: 1800,
  height: 1800
};

export function imageprocess(event, context, callback) {
  const queryParameters = event.queryStringParameters || {};

  if (!process.env.BUCKET || !process.env.URL) {
    return callback(null, {
      statusCode: 404,
      body: 'Error: Set environment variables BUCKET and URL.'
    });
  }

  const size = {
    width:
      queryParameters.width === 'AUTO' ? null : parseInt(queryParameters.width),
    height:
      queryParameters.height === 'AUTO'
        ? null
        : parseInt(queryParameters.height)
  };

  if (
    size.width > ALLOWED_DIMENSIONS.width ||
    size.height > ALLOWED_DIMENSIONS.height
  ) {
    return callback(null, {
      statusCode: 403,
      body: 'Error: Image size not permited.'
    });
  }

  const imageKey = getImageKey(event.path);

  if (!size.width && !size.height) {
    return getImage(imageKey).catch(err =>
      callback(null, {
        statusCode: err.statusCode || 404,
        body: JSON.stringify(err)
      })
    );
  } else {
    return checkKeyExists(imageKey, size).catch(err =>
      callback(null, {
        statusCode: err.statusCode || 404,
        body: JSON.stringify(err)
      })
    );
  }
}
