# lambda-resize-image

[![Build Status](https://travis-ci.org/apoca/lambda-resize-image.svg?branch=master)](https://travis-ci.org/apoca/lambda-resize-image)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/174785b0f3a249e2a2f8482542e8f557)](https://app.codacy.com/app/apoca/lambda-resize-image?utm_source=github.com&utm_medium=referral&utm_content=apoca/lambda-resize-image&utm_campaign=Badge_Grade_Dashboard)
[![Maintainability](https://api.codeclimate.com/v1/badges/c0bcf34c657a91f453e6/maintainability)](https://codeclimate.com/github/apoca/lambda-resize-image/maintainability)
[![npm version](https://badge.fury.io/js/lambda-resize-image.svg)](https://badge.fury.io/js/lambda-resize-image)
[![dependencies Status](https://david-dm.org/apoca/lambda-resize-image/status.svg)](https://david-dm.org/apoca/lambda-resize-image)
[![devDependencies Status](https://david-dm.org/apoca/lambda-resize-image/dev-status.svg)](https://david-dm.org/apoca/lambda-resize-image?type=dev)
[![npm](https://img.shields.io/npm/l/lambda-images-resizer.svg)]()

An AWS Lambda Function to resize images automatically with API Gateway and S3 for imagemagick tasks. When an image is called on AWS Api Gateway, this package will resize it and send it to the S3.

## Contents

- [lambda-resize-image](#lambda-resize-image)
  - [Contents](#contents)
  - [Requirements](#requirements)
  - [What is it?](#what-is-it)
  - [Description](#description)
  - [Features](#features)
  - [Instalation](#instalation)
    - [AWS credentials](#aws-credentials)
    - [Deploy to Amazon AWS](#deploy-to-amazon-aws)
  - [Usage (image restrictions resize)](#usage-image-restrictions-resize)
    - [Example URL usage](#example-url-usage)
  - [Environment variables](#environment-variables)
    - [Environment variables for serverless](#environment-variables-for-serverless)
  - [Local development](#local-development)
    - [Example request](#example-request)
      - [Configuration Parameters](#configuration-parameters)
  - [Feedback](#feedback)
  - [Contributing](#contributing)
  - [License](#license)
  - [Author](#author)

## Requirements

- Node.js - AWS Lambda supports versions of **10.20.1** or above (Recommended: **12.X**).

## New version 2.0

We've changed our approache to remove redirects from our responses. Then, we are returning a binary file base 64 image file.

### Steps to version 2.0

You must have AWS CLI installed to execute a command from your console:

`aws apigateway update-integration-response --rest-api-id <API_ID> --resource-id <RESOURCE_ID> --http-method GET  --status-code 200  --patch-operations '[{"op" : "replace", "path" : "/contentHandling", "value" : "CONVERT_TO_BINARY"}]'`

In API GW -> Settings -> Binary Media Types and add:

`*/*`

## What is it?

It's AWS Lambda, which is a compute service that lets you run code without provisioning or managing servers.

> _[Read more about AWS Lambda.](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html)_

## Description

The combination of API Gateway and Lambda is very powerful. It allows you to build some complex functionalities without maintaining any virtual machines yourself. Lambda can be hooked up to many other (AWS) Services including S3. That's why I decided to build an AWS Lambda Function to resize images automatically with API Gateway and S3 for imagemagick tasks. When an image is called on AWS S3 bucket (via API Gateway), this package will resize it and send it to the S3 before redirecting you to the new path of the image (aws bucket url or CDN).

## Features

- Use [Serverless Framework](https://github.com/serverless/serverless#features)
- Use [Serverless Webpack](https://github.com/serverless-heaven/serverless-webpack)
- Use [Serverless Offline](https://github.com/dherault/serverless-offline)
- The image conversion endpoint by API Gateway or cloudfront URL.

## Instalation

First, add Serverless globally:

`npm install -g serverless`

Then, clone the repository into your local environment:

```bash
git clone https://github.com/apoca/lambda-resize-image
cd lambda-resize-image
npm install
```

Modify and set the .env.example to env.yml with your data. (You are supposed to have already configured your [local variables](#environment-variables)).

### AWS credentials

To run [local development](#local-development) you also might need to configure you [aws credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/installing-jssdk.html), or you can set them to what I've shown below.

### Deploy to Amazon AWS

You can also check if you have everything installed in the correct way:

`$ serverless`

To deploy from your environment to Amazon AWS, you must:

`$ serverless deploy --stage dev` or `$ serverless deploy --stage prod` for production configurations.

Then, serverless will package, validate and upload your stack to Amazon AWS. It will probably look like this:

```bash
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (1.52 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............
Serverless: Stack update finished...
Service Information
service: resizeS3Image
stage: development
region: eu-west-1
stack: resizeS3Image-development
api keys:
  None
endpoints:
  GET - https://<api_key_here>.execute-api.eu-west-1.amazonaws.com/dev/{key+}
functions:
  handler: resize-dev-image
Serverless: Removing old service artifacts from S3...
```

When upload to AWS Lambda, the project will bundle only needed files - no dev dependencies will be included.

## Usage (image restrictions resize)

To restrict the dimensions, we put a `const var` in the `handle.js`:

```javascript
const ALLOWED_DIMENSIONS = {
  width: 1800,
  height: 1800
};
```

You can also change the url endpoint `https://<api_key_here>.execute-api.eu-west-1.amazonaws.com/dev/{key+}` to another one more tiny and cachable (cloudfront), you can also configure in you Api Gateway (lambda service) a **Custom Domain Name**.

### Example URL usage

`https://<api_key_here>.execute-api.eu-west-1.amazonaws.com/dev/<KEY_S3_IMAGE_HERE>?width=<WIDTH>&height=<HEIGHT>`

or with you own Custom Domain Names:

`https://api.yourdomain.com/<KEY_S3_IMAGE_HERE>?width=<WIDTH>&height=<HEIGHT>`

![Example usage of lambda resize image](https://s3-eu-west-1.amazonaws.com/lambda-resize-image/example-usage-lambda-resize-image.png)

## Environment variables

- URL - AWS URL S3 bucket or your CDN url to the BUCKET. (not required in version 2.0)
- BUCKET - AWS S3 bucket. (required)

### Environment variables for serverless

- AWS_ACCESS_KEY_ID - AWS key
- AWS_SECRET_ACCESS_KEY - AWS Secret

## Local development

1. `$ npm i -g serverless`
2. `$ npm i`
3. `$ brew install imagemagick`
4. `$ serverless offline start`

Note that you will need to be into the root repository. The last command (4.) will spin up an [serverless-offline](https://github.com/dherault/serverless-offline) version of an API Gateway, that will simulate the real one. Once it is running, you can see all the requests on your command line.

### Example request

`http://localhost:3000<YOUR_KEYNAME_TO_IMAGE>?width=<WIDTH>&height=<HEIGHT>`

#### Configuration Parameters

| Parameter |  type   | description                                        |
| :-------: | :-----: | -------------------------------------------------- |
|   width   | Integer | Required. Will resize image via imagemagic resize. |
|  height   | Integer | Optional. Will resize image via imagemagic crop.   |

## Feedback

We'd love to get feedback on how you're using lambda-resize-image and things we could add to make this tool better. Feel free to contact us at vieira@miguelvieira.com.pt

## Contributing

If you'd like to contribute to the project, feel free to submit a PR. See more: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Author

- **Miguel Vieira** - _Initial work_ - [apoca](https://github.com/apoca)

See also the list of [contributors](https://github.com/apoca/lambda-resize-image/contributors) who participated in this project.
