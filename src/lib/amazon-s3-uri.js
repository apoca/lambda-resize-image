'use strict';

const url = require('url');
const { REGION } = process.env;

const ENDPOINT_PATTERN = /^(.+\.)?s3[.-]([a-z0-9-]+)\./;
const DEFAULT_REGION = REGION || 'eu-west-1';

// TODO: support versionId
// TODO: encode uri before testing
// TODO: support dualstack http://docs.aws.amazon.com/AmazonS3/latest/dev/dual-stack-endpoints.html

/**
 * A URI wrapper that can parse out information about an S3 URI
 *
 * Directly adapted from https://github.com/aws/aws-sdk-java/blob/master/aws-java-sdk-s3/src/main/java/com/amazonaws/services/s3/AmazonS3URI.java
 *
 * @param {String} uri - the URI to parse
 * @throws {TypeError|Error}
 */
function AmazonS3URI(uri) {
  if (!new.target) {
    return new AmazonS3URI(uri);
  }
  this.uri = url.parse(uri);

  if (this.uri.protocol === 's3:') {
    this.region = DEFAULT_REGION;
    this.isPathStyle = false;
    this.bucket = this.uri.host;

    if (!this.bucket) {
      throw new Error(`Invalid S3 URI: no bucket: ${uri}`);
    }

    if (!this.uri.path || this.uri.path.length <= 1) {
      // s3://bucket or s3://bucket/
      this.key = null;
    } else {
      // s3://bucket/key
      // Remove the leading '/'.
      this.key = this.uri.path.substring(1);
    }
    if (this.key !== null) {
      this.key = decodeURIComponent(this.key);
    }
    return;
  }

  if (!this.uri.host) {
    throw new Error(`Invalid S3 URI: no hostname: ${uri}`);
  }

  const matches = this.uri.host.match(ENDPOINT_PATTERN);
  if (!matches) {
    throw new Error(
      `Invalid S3 URI: hostname does not appear to be a valid S3 endpoint: ${uri}`
    );
  }

  const prefix = matches[1];
  if (!prefix) {
    // No bucket name in the host; parse it from the path.
    this.isPathStyle = true;

    if (this.uri.path === '/') {
      this.bucket = null;
      this.key = null;
    } else {
      const index = this.uri.path.indexOf('/', 1);
      if (index === -1) {
        // https://s3.amazonaws.com/bucket
        this.bucket = this.uri.path.substring(1);
        this.key = null;
      } else if (index === this.uri.path.length - 1) {
        // https://s3.amazonaws.com/bucket/
        this.bucket = this.uri.path.substring(1, index);
        this.key = null;
      } else {
        // https://s3.amazonaws.com/bucket/key
        this.bucket = this.uri.path.substring(1, index);
        this.key = this.uri.path.substring(index + 1);
      }
    }
  } else {
    // Bucket name was found in the host; path is the key.
    this.isPathStyle = false;

    // Remove the trailing '.' from the prefix to get the bucket.
    this.bucket = prefix.substring(0, prefix.length - 1);

    if (!this.uri.path || this.uri.path === '/') {
      this.key = null;
    } else {
      // Remove the leading '/'.
      this.key = this.uri.path.substring(1);
    }
  }

  if (matches[2] !== 'amazonaws') {
    this.region = matches[2];
  } else {
    this.region = REGION;
  }

  if (this.key !== null) {
    this.key = decodeURIComponent(this.key);
  }
}

AmazonS3URI.prototype.DEFAULT_REGION = REGION;

module.exports = AmazonS3URI;
