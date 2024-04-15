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


// 홉페이지를 간단히 만든 html
var homePage = 
  `
    <!DOCTYPE HTML>
    <html>
      <body>
        <form method='post' action='/upload' enctype='multipart/form-data'>
          <input type='file' name='image'/>
          <input type='submit' />
        </form>
      </body>
    </html>
  `;

// 홈페이지를 들어가면 어떤 html써야하는지  
app.get('/', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(homePage);
});

// 웹사이트 호스킹하기
app.listen(8080);

console.log('Server Started on http://localhost:8080');

app.post('/upload', upload.single('image'), async function(req, res, next) {
  const sockFound = await visionExample(req.file.path);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`<!DOCTYPE HTML><html><body>`);

  res.write(`<a href='/' class='btn'>My applications</a>`);
  
  if (sockFound) {
    // Base64 the image so we can display it on the page
    res.write('<img width=200 src="' + base64Image(`./resources/${sockFound.file}`) + '"><br>');
    res.write(JSON.stringify(sockFound.description, null, 4));
  } else {
    res.write(`<p>No sock found</p>`);
  }

  // Delete file (optional)
  fs.unlinkSync(req.file.path);
  
  res.end(`</body></html>`);
});

async function visionExample(path) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // 사진의 테그가 뭔지 구글에 물어보는거
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

// Turn image into Base64 so we can display it easily

function base64Image(src) {
  var data = fs.readFileSync(src).toString('base64');
  return util.format('data:%s;base64,%s', mime.lookup(src), data);
}