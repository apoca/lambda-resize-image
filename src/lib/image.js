const AWS = require('aws-sdk');
const S3 = new AWS.S3({ signatureVersion: 'v4' });
const im = require('imagemagick');
const os = require('os');
const { resizeCallback, generateS3Key } = require('./utils');
const { BUCKET, URL } = process.env;

exports.getImage = key =>
  new Promise((resolve, reject) =>
    S3.getObject(
      {
        Bucket: BUCKET,
        Key: key
      },
      err => {
        if (err) return reject(err);

        resolve({
          statusCode: 301,
          headers: { Location: `${URL}/${key}` }
        });
      }
    )
  );

exports.checkKeyExists = (key, size) =>
  new Promise((resolve, reject) =>
    S3.headObject(
      {
        Bucket: BUCKET,
        Key: generateS3Key(key, size)
      },
      err => {
        if (err && err.code === 'NotFound')
          return this.resizeImage(key, size)
            .then(resolve)
            .catch(reject);

        resolve({
          statusCode: 301,
          headers: { Location: `${URL}/${generateS3Key(key, size)}` }
        });
      }
    )
  );

exports.resizeImage = (key, size) =>
  new Promise((resolve, reject) =>
    S3.getObject(
      {
        Bucket: BUCKET,
        Key: key
      },
      (err, data) => {
        if (err) return reject(err);

        const tmpImageName = `${os.tmpDir}/resized.${BUCKET}.${size.width}.${
          size.height
        }`;

        if (!isNaN(size.width) && !isNaN(size.height)) {
          im.crop(
            {
              width: size.width,
              height: size.height,
              srcData: data.Body,
              dstPath: tmpImageName,
              quality: 1,
              gravity: 'Center'
            },
            err => {
              if (err) return reject(err);

              resolve(
                resizeCallback(err, generateS3Key(key, size), tmpImageName)
              );
            }
          );
        } else if (size.width) {
          im.resize(
            {
              width: size.width,
              srcData: data.Body,
              dstPath: tmpImageName
            },
            err => {
              if (err) return reject(err);

              resolve(
                resizeCallback(err, generateS3Key(key, size), tmpImageName)
              );
            }
          );
        } else {
          resolve({
            statusCode: 301,
            headers: { Location: `${URL}/${generateS3Key(key, size)}` }
          });
        }
      }
    )
  );
