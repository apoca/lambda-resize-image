# lambdaResizeImage

[![Build Status](https://travis-ci.org/apoca/lambda-resize-image.svg?branch=master)](https://travis-ci.org/apoca/lambda-resize-image)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/174785b0f3a249e2a2f8482542e8f557)](https://app.codacy.com/app/apoca/lambda-resize-image?utm_source=github.com&utm_medium=referral&utm_content=apoca/lambda-resize-image&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/apoca/lambda-resize-image/branch/master/graph/badge.svg)](https://codecov.io/gh/apoca/lambda-resize-image)
[![npm version](https://badge.fury.io/js/lambda-resize-image.svg)](https://badge.fury.io/js/lambda-resize-image)
[![dependencies Status](https://david-dm.org/apoca/lambda-resize-image/status.svg)](https://david-dm.org/apoca/lambda-resize-image)
[![devDependencies Status](https://david-dm.org/apoca/lambda-resize-image/dev-status.svg)](https://david-dm.org/apoca/lambda-resize-image?type=dev)

## Description

The combination of API Gateway and Lambda is very powerful. It allows you to build some complex functionalities without maintaining any virtual machines yourself. Lambda can be hooked up to many other (AWS) Services including S3. That's why I decide build an AWS Lambda Function to resize images automatically with API Gateway and S3 for imagemagick tasks. When an image is called on AWS S3 bucket (via API Gateway), this package will resize it and put to S3 before redirect you to the new path of this image (aws bucket url or CDN).

## License

Completely MIT Licensed. Including ALL dependencies.

## Author

Miguel Vieira
<vieira@miguelvieira.com.pt>
