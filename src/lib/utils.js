import { S3 as _S3 } from 'aws-sdk';
import { createReadStream, unlink } from 'fs';
const PathReg = new RegExp('(.*)/(.*)');

export function resizeCallback(error, newKey, tmpImageName) {
  return new Promise((resolve, reject) => {
    if (error) {
      reject(error);
    } else {
      const S3 = new _S3({ signatureVersion: 'v4' });
      S3.upload(
        {
          Bucket: process.env.BUCKET,
          Body: createReadStream(tmpImageName),
          Key: newKey
        },
        (err, data) => {
          if (err) return reject(err);

          unlink(tmpImageName);

          resolve({
            statusCode: 301,
            headers: { Location: data.Location }
          });
        }
      );
    }
  });
}

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
