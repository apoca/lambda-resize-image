const { resizeImage, getImage } = require('./lib/image');
const AmazonS3URI = require('./lib/amazon-s3-uri');
const { BUCKET, URL } = process.env;

module.exports.imageprocess = event =>
  new Promise((resolve, reject) => {
    const queryParameters = event.queryStringParameters || {};
    const path = AmazonS3URI(event.path);
    const imageKey = path.key;

    if (!BUCKET || !URL) {
      return reject('Error: Set environment variables BUCKET and URL.');
    }

    const size = {
      width:
        queryParameters.width === 'AUTO'
          ? null
          : parseInt(queryParameters.width),
      height:
        queryParameters.height === 'AUTO'
          ? null
          : parseInt(queryParameters.height)
    };

    if (!queryParameters.width && !queryParameters.height) {
      return getImage(imageKey)
        .then(resolve)
        .catch(reject);
    }

    if (!size.width) {
      return reject('The parameter width is a required field to resize.');
    }

    return resizeImage(imageKey, size)
      .then(resolve)
      .catch(reject);
  });
