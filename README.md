# My Todos App
Demo Todos App based on this template: https://github.com/marketlytics/grunt-init-basic-html

## Dependencies:

- MustacheJS
- Jquery
- Bootstrap
- parse js sdk (i.e., apiKey)

Change with your parse api key in `js/TodoService` line#1

i.e., `Parse.initialize( A, B );`

## Setup (install dependencies)

It requires `node & npm` and `grunt-cli` installed on your machine..

type command `$ npm install -g grunt-cli` to install grunt on your machine globally..

then run command: `$ npm install`

## Runing the app:

- `$ grunt` : for watching live changes on your browser by hitting url: `localhost:3000`
- `$ grunt test` : for runing all tests..
- `$ grunt prepare` : for generating deploy version of your app code..
- `$ grunt lint` : checking linting via command line..
- `$ grunt deploy` : deploy your code to ftp server (provide your ftp server `host`, `port`, `src` and `dest` in GruntFile.js line# 157)


Enjoy...
