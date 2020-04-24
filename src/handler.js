/**
 * Module dependencies.
 */

import { S3 as _S3 } from 'aws-sdk';
import { generateS3Key } from './lib/utils';
import { isNullOrUndefined } from 'util';
const sharp = require('sharp');

const S3 = new _S3({
  signatureVersion: 'v4',
});

const ALLOWED_DIMENSIONS = {
  width: 1800,
  height: 1800,
};

/**
 * Export `imageprocess` module.
 */

export function imageprocess(event, context, callback) {
  const queryParameters = event.queryStringParameters || {};
  const imageKey = decodeURIComponent(event.pathParameters.key);

  if (!process.env.BUCKET || !process.env.URL) {
    return callback(null, {
      statusCode: 404,
      body: 'Error: Set environment variables BUCKET and URL.',
    });
  }

  const size = {
    width: isNullOrUndefined(queryParameters.width)
      ? null
      : parseInt(queryParameters.width),
    height: isNullOrUndefined(queryParameters.height)
      ? null
      : parseInt(queryParameters.height),
  };

  if (
    size.width > ALLOWED_DIMENSIONS.width ||
    size.height > ALLOWED_DIMENSIONS.height
  ) {
    return callback(null, {
      statusCode: 403,
      body: 'Error: Image size not permited.',
    });
  }

  if (imageKey) {
    if (!size.width && !size.height) {
      S3.getObject({
        Bucket: process.env.BUCKET,
        Key: imageKey,
      })
        .promise()
        .then((data) => sharp(data.Body).jpeg({ quality: 70 }).toBuffer())
        .then((buffer) => {
          // generate a binary response with resized image
          return callback(null, {
            statusCode: 200,
            body: buffer.toString('base64'),
            bodyEncoding: 'base64',
            isBase64Encoded: true,
            headers: { 'Content-Type': 'image/jpeg' },
          });
        })
        .catch((err) =>
          callback(null, {
            statusCode: err.statusCode || 404,
            body: JSON.stringify(err),
          })
        );
    } else {
      S3.getObject({
        Bucket: process.env.BUCKET,
        Key: imageKey,
      })
        .promise()
        .then((data) =>
          sharp(data.Body)
            .resize(size.width, size.height)
            .jpeg({ quality: 70 })
            .toBuffer()
        )
        .then((buffer) => {
          S3.putObject({
            Body: buffer,
            Bucket: process.env.BUCKET,
            ContentType: 'image/jpeg',
            CacheControl: 'max-age=31536000',
            Key: generateS3Key(imageKey, size),
            ACL: 'public-read',
          })
            .promise()
            .catch((err) => {
              return callback(null, {
                statusCode: err.statusCode || 404,
                body: JSON.stringify(err),
              });
            });
          // generate a binary response with resized image
          return callback(null, {
            statusCode: 200,
            body: buffer.toString('base64'),
            bodyEncoding: 'base64',
            isBase64Encoded: true,
            headers: { 'Content-Type': 'image/jpeg' },
          });
        })
        .catch((err) =>
          callback(null, {
            statusCode: err.statusCode || 404,
            body: JSON.stringify(err),
          })
        );
    }
  } else {
    return callback(null, {
      statusCode: 404,
      body: 'Error: Image not found.',
    });
  }
}
