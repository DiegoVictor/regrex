# Regrex
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/regrex?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/regrex)
[![serverless](https://img.shields.io/badge/serverless-3.38.0-FD5750?style=flat-square&logo=serverless)](https://www.serverless.com/)
[![eslint](https://img.shields.io/badge/eslint-8.57.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![typescript](https://img.shields.io/badge/typescript-5.4.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/regrex?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/regrex)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/regrex/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Regrex&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fregrex%2Fmain%2FInsomnia_2024-11-22.json)

Regrex is a API that executes [grex](https://github.com/pemistahl/grex) (binary file) inside a lambda through an AWS Layer.

![Infrastructure Diagram](https://raw.githubusercontent.com/DiegoVictor/regrex/main/regrex.drawio.png)

#### Demo
![Demo](https://raw.githubusercontent.com/DiegoVictor/regrex/main/screenshots/demo.gif)

## Table of Contents
* [Requirements](#requirements)
* [Installing](#installing)
* [Configure](#configure)
* [Usage](#usage)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Requirements
* Node.js ^14.15.0
* Serveless Framework
* AWS Account
  * [API Gateway](https://aws.amazon.com/api-gateway/)
  * [Lambda](https://aws.amazon.com/lambda)

# Install
```
npm install
```
Or simply:
```
yarn
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

# Configure
Access [Grex](https://github.com/pemistahl/grex) repository page and download the linux distribution into `dependencies/bin`. Then zip the `dependencies` folder:
```sh
cd dependencies
zip -yr ../dependencies.zip .
cd ..
```
Or using 7zip:
```sh
cd dependencies
7z a ../dependencies.zip *
cd ..
```
> For those that for any reason are not able to download the binary or compact your own package this repository is shipped with one package ready for use.

Then, deploy the API:
```
$ sls deploy
```

# Usage
Refer to the [Grex](https://github.com/pemistahl/grex#51-the-command-line-tool) documentation, send the parameters and flags in the `body` of the request:
```json
{
  "terms": [
    "sample",
    "example",
    "simple"
  ],
  "flags": ["x"]
}
```
Output:
```
(?x)
^
  (?:
    exa
    |
    s[ai]
  )
  mple
$
```

There are only a few flags not available:

* -c, --colorize
* -h, --help
* -v, --version

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```
> Run the command in the root folder

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
