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
var upload = multer({dest: './public/uploaded'});

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
  const imageUrl = `uploaded/${req.file.filename}`; // 이미지 URL을 정의


  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" type="text/css" href="/assets/result.css"><link rel="stylesheet" type="text/css" href="/assets/style.css"></head><body>`);

  res.write(`<a href='/upload' class='btn'>Back</a>`);
  res.write(`<img src="${imageUrl}" width="200"></img>`);
  
  if (sockFound) {
    const rgb = `rgb(${sockFound.r} ${sockFound.g} ${sockFound.b})`;
    res.write(`
      <svg width="230" height="378" viewBox="0 0 230 378" xmlns="http://www.w3.org/2000/svg">
        <path d="M145.989 0L112.077 188.911L99.7662 212.831L10.1481 308.157L0 338.786L12.7401 371.615L42.1648 377.782L73.1848 366.521L163.606 296.431L188.39 280.877L202.191 261.826L205.437 228.937L197.976 196.431L230 14.8134L145.989 0Z" fill="${rgb}" stroke="#4142F4" stroke-width="3"/>
      </svg>
      <p>${sockFound.description}</p>
      <p>Tag1: ${sockFound.tag1} Tag2: ${sockFound.tag2} Tag3: ${sockFound.tag3}</p>
      <p>color: ${sockFound.r} ${sockFound.g} ${sockFound.b}</p>
      <img width=200 src="resources/${sockFound.file}"></img>
    `)
  } else {
    res.write(`<p>No sock found</p>`);
  }

  // Delete file 
  // fs.unlinkSync(req.file.path);
  
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
