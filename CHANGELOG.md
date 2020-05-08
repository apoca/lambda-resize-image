# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2020-05-09

    ### Changed

    - Improved image cache-control to 1y

## [2.1.0] - 2020-05-08

    ### Changed

    - Improved image quality returned

## [2.0.0] - 2020-04-30

    ### Changed

    - Fixed a lot of vulnerabilities
    - Updated handler.js to return binary images not redirects
    - Updated webpack.config.js to better "bundle" the package to Lambda AWS amazon
    - Improved serverless.yml

## [1.3.3] - 2019-04-24

    ### Changed

    - Fixed 2 vulnerabilities
    - Updated puObject IAM AWS to putObjectAcl

## [1.3.2] - 2018-10-13

     ### Changed

     - Updated fs unlink callback function

## [1.3.1] - 2018-10-13

    ### Changed

    - Fixed 12 vulnerabilities

## [1.3.0] - 2018-09-12

    ### Added

    - Add missing yarn.lock
    - Add CHANGELOG.md

    ### Changed

    - Improving information about the image output
    - Added some other new keywords and improved readme file.
    - Update image module
    - Update handler module
    - Update utils module
    - Update version package.json
    - Improved cors serverless api gateway

## [1.2.2] - 2018-09-10

    ### Changed

    - Improved some unit test
    - Improved serverless configuration

    ### Removed

    - Removed unnecessary API_URL envirenment variable

## [1.2.1] - 2018-09-09

    ### Added

    - Created a new environment variable for API_URL into serverless (env.yml)
    - Created a new function getImageKey

    ### Changed

    - Improved the text of API_URL in README.md
    - Improved the contributors obkect inside package.json

## [1.2.0] - 2018-09-04

    ### Added

    - Starting develop unit test with jest

[unreleased]: https://github.com/apoca/lambda-resize-image/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/apoca/lambda-resize-image/compare/v2.1.0..v2.2.0
[2.1.0]: https://github.com/apoca/lambda-resize-image/compare/v2.0.1..v2.1.0
[2.0.1]: https://github.com/apoca/lambda-resize-image/compare/v2.0.0..v2.0.1
[2.0.0]: https://github.com/apoca/lambda-resize-image/compare/v1.3.3..v2.0.0
[1.3.3]: https://github.com/apoca/lambda-resize-image/compare/v1.3.2..v1.3.3
[1.3.2]: https://github.com/apoca/lambda-resize-image/compare/v1.3.1..v1.3.2
[1.3.1]: https://github.com/apoca/lambda-resize-image/compare/v1.3.0..v1.3.1
[1.3.0]: https://github.com/apoca/lambda-resize-image/compare/v1.2.2..v1.3.0
[1.2.2]: https://github.com/apoca/lambda-resize-image/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/apoca/lambda-resize-image/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/apoca/lambda-resize-image/compare/v1.1.0...v1.2.0
