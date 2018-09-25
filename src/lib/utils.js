const AWS = require('aws-sdk');
const S3 = new AWS.S3({ signatureVersion: 'v4' });
const fs = require('fs');
const PathReg = new RegExp('(.*)/(.*)');
const { BUCKET, URL } = process.env;

exports.resizeCallback = (
  error,
  contentType,
  newKey,
  tmpImageName,
  resolve,
  reject
) => {
  if (error) {
    reject({
      statusCode: error.code,
      headers: {
        'X-Error': error || null
      },
      body: JSON.stringify(error)
    });
  } else {
    S3.putObject(
      {
        Bucket: BUCKET,
        Body: fs.readFileSync(tmpImageName),
        ContentType: contentType,
        Key: newKey
      },
      err => {
        if (err) return reject(err);

        fs.unlink(tmpImageName, () =>
          console.log('INFO: Resized file cleaned up')
        );

        resolve({
          statusCode: 301,
          headers: { Location: `${URL}/${newKey}` }
        });
      }
    );
  }
};

exports.generateS3Key = (key, size) => {
  let parts = PathReg.exec(key);
  let oldKey = parts[1] || '';
  let filename = parts[2];
  let width = size.width || 'AUTO';
  let height = size.height || 'AUTO';

  return `${oldKey}/${width}x${height}/${filename}`;
};
