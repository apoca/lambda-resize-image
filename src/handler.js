const { resizeImage, getImage, checkKeyExists } = require('./lib/image');
const url = require('url');
const ALLOWED_DIMENSIONS = {
  width: 1800,
  height: 1800
};

module.exports.imageprocess = function(event, context, callback) {
  const queryParameters = event.queryStringParameters || {};
  const path = event.path;
  const imageKey = url.parse(path).pathname.replace(/^\//g, '');

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

  if (!size.width && !size.height) {
    console.log('imageKey', imageKey);
    return getImage(imageKey).catch(err =>
      callback(null, {
        statusCode: err.statusCode || 404,
        body: JSON.stringify(err)
      })
    );
  } else if (size.width) {
    return checkKeyExists(imageKey, size).catch(err =>
      callback(null, {
        statusCode: err.statusCode || 404,
        body: JSON.stringify(err)
      })
    );
  }

  return resizeImage(imageKey, size).catch(err =>
    callback(null, {
      statusCode: err.statusCode || 404,
      body: JSON.stringify(err)
    })
  );
};
