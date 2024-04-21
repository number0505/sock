'use strict';

//https://cloud.google.com/vision/docs/detecting-properties

//https://medium.com/google-cloud/using-the-google-cloud-vision-api-with-node-js-194e507afbd8

//https://www.npmjs.com/package/@google-cloud/vision


// express 이라고, 웹사이트 호스팅하는 패키지
var express = require('express');
// ㅍㅏㅇㅣㄹ ㄷㅣㄹㅔㄱㅌㅗㄹㅣ 
var path = require('path');
// fs 파일 읽는 페키지
var fs = require('fs');
// 바이너리에서 사진으로 변환해주는 패키지
var util = require('util');
// 사진을 업로드할때, 도와주는 패키지
var multer = require('multer');

// multer로 경로를 지정해주는거
var upload = multer({dest: './uploaded'});

// google sheet json 읽기
var sockDB = require('./public/resources/Sock DB.json');

// google cloud vision 패키지 들어오기
const vision = require('@google-cloud/vision');

// express를 app정의
var app = express();
//https://cloud.google.com/vision/docs/detecting-properties#vision_image_property_detection-nodejs

app.use(express.static(path.join(__dirname, 'public')))

// 홈페이지를 들어가면 어떤 html써야하는지  
app.get('/', function(req, res) {
	res.sendFile('public/index.html', {root: __dirname});
});

app.get('/upload', function(req, res) {
	res.sendFile('public/upload.html', {root: __dirname});
});

// 웹사이트 호스팅하기
app.listen(8081);

console.log('Server Started on http://localhost:8081');

app.post('/result', upload.single('image'), async function(req, res, next) {
  const sockFound = await visionExample(req.file.path);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`<!DOCTYPE HTML><html><head><link rel="stylesheet" type="text/css" href="/assets/result.css"></head><body>`);

  res.write(`<a href='/upload' class='btn'>Back</a>`);
  res.write(`<img src="${imageUrl}" width="200">`);
  
  if (sockFound) {
    // Base64 the image so we can display it on the page
		res.write(`<img width=200 src="resources/${sockFound.file}"></img>`);
    res.write(JSON.stringify(sockFound.description, null, 4));
  } else {
    res.write(`<p>No sock found</p>`);
  }

  // Delete file 
  fs.unlinkSync(req.file.path);
  
  res.end(`</body></html>`);
});

async function visionExample(path) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // 사진의 태그가 뭔지 구글에 물어보는거
  const [tagResult] = await client.webDetection(path);
  console.log(`Tag1: ${tagResult.webDetection.webEntities?.at(0)?.description}`);
  console.log(`Tag2: ${tagResult.webDetection.webEntities?.at(1)?.description}`);
  console.log(`Tag3: ${tagResult.webDetection.webEntities?.at(2)?.description}`);
  const tag1 = tagResult.webDetection.webEntities?.at(0)?.description;
  const tag2 = tagResult.webDetection.webEntities?.at(1)?.description;
  const tag3 = tagResult.webDetection.webEntities?.at(2)?.description;

  // 사진의 색깔이 뭔지 구글에 물어보기
  const [colorResult] = await client.imageProperties(path);
  console.log(`r: ${colorResult.imagePropertiesAnnotation.dominantColors.colors?.at(0)?.color?.red}`);
  console.log(`g: ${colorResult.imagePropertiesAnnotation.dominantColors.colors?.at(0)?.color?.green}`);
  console.log(`b: ${colorResult.imagePropertiesAnnotation.dominantColors.colors?.at(0)?.color?.blue}`);
  const r = colorResult.imagePropertiesAnnotation.dominantColors.colors?.at(0).color?.red;
  const g = colorResult.imagePropertiesAnnotation.dominantColors.colors?.at(0).color?.green;
  const b = colorResult.imagePropertiesAnnotation.dominantColors.colors?.at(0).color?.blue;

  // 구글 시트에 있던 데이터와 비교해서 맞는거 찾기
  for (const sock of sockDB) {
    if (sock.r === r.toString() && sock.g === g.toString() && sock.b === b.toString() && sock.tag1 === tag1 && sock.tag2 === tag2 && sock.tag3 === tag3) {
      return sock;
    }
  }

  // no sock found
  return null;
}
