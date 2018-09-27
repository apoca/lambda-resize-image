const { resizeImage, getImage, checkKeyExists } = require('./lib/image');
const url = require('url');
const { BUCKET, URL } = process.env;
const ALLOWED_DIMENSIONS = {
  width: 1800,
  height: 1800
};

module.exports.imageprocess = function(event, context, callback) {
  const queryParameters = event.queryStringParameters || {};
  const path = event.path;
  const imageKey = url.parse(path).pathname.replace(/^\//g, '');

  if (!BUCKET || !URL) {
    return callback(null, {
      statusCode: 404,
      headers: {},
      body: 'Error: Set environment variables BUCKET and URL.',
      isBase64Encoded: false
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
      headers: {},
      body: 'Error: Image size not permited.',
      isBase64Encoded: false
    });
  }

  if (!queryParameters.width && !queryParameters.height) {
    return getImage(imageKey).catch(err => callback(err));
  } else if (size.width) {
    return checkKeyExists(imageKey, size);
  }

  if (!size.width) {
    return callback(null, {
      statusCode: 403,
      headers: {},
      body: 'The parameter width is a required field to resize.',
      isBase64Encoded: false
    });
  }

  return resizeImage(imageKey, size).catch(err => callback(err));
};
