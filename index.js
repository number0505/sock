//https://cloud.google.com/vision/docs/detecting-properties

//https://medium.com/google-cloud/using-the-google-cloud-vision-api-with-node-js-194e507afbd8

//https://www.npmjs.com/package/@google-cloud/vision


var express = require('express');
var fs = require('fs');
var util = require('util');
var mime = require('mime');
var multer = require('multer');

var upload = multer({dest: './uploaded'})

var sockDB = require('./resources/Sock DB.json');

//https://cloud.google.com/vision/docs/detecting-properties#vision_image_property_detection-nodejs
const vision = require('@google-cloud/vision');

var app = express();
