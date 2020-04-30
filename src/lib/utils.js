/**
 * Module dependencies.
 */

import { S3 as _S3 } from 'aws-sdk';
import { unlink, readFileSync } from 'fs';
const PathReg = new RegExp('(.*)/(.*)');

/**
 * Export `resizeCallback` util.
 */

export function resizeCallback(error, contentType, newKey, tmpImageName) {
  return new Promise((resolve, reject) => {
    if (error) {
      reject(error);
    } else {
      const S3 = new _S3({
        signatureVersion: 'v4',
      });

      S3.putObject(
        {
          ACL: 'public-read',
          Bucket: process.env.BUCKET,
          Body: readFileSync(tmpImageName),
          ContentType: contentType,
          Key: newKey,
        },
        (err) => {
          if (err) return reject(err);

          unlink(tmpImageName, (err) => {
            if (err) throw err;
          });

          resolve({
            statusCode: 301,
            headers: {
              Location: `${process.env.URL}/${newKey}`,
            },
          });
        }
      );
    }
  });
}

/**
 * Export `generateS3Key` util.
 */

export function generateS3Key(key, size) {
  let parts = PathReg.exec(key);

  if (!parts) {
    return key;
  }

  let oldKey = parts[1];
  let filename = parts[2];
  let width = size.width || null;
  let height = size.height || 'AUTO';

  if (width) {
    return `${oldKey}/${width}x${height}/${filename}`;
  }

  return `${oldKey}/${filename}`;
}
