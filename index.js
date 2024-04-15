//https://cloud.google.com/vision/docs/detecting-properties

//https://medium.com/google-cloud/using-the-google-cloud-vision-api-with-node-js-194e507afbd8

//https://www.npmjs.com/package/@google-cloud/vision

//

const express = require('express');
const fs = require('fs');
const util = require('util');
const mime = require('mime');
const multer = require('multer');

var upload = multer({dest: './uploaded'})

var sockDB = require('./resources/Sock DB.json');
