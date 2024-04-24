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
  res.write(`
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="assets/reset.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="/assets/style.css">
  <link rel="stylesheet" type="text/css" href="/assets/result.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Oswald:wght@200..700&display=swap" rel="stylesheet">
  </head>
  <body>`);

  // res.write(`<a href='/upload' class='btn'>Back</a>`);
  // res.write(`<img src="${imageUrl}" width="200"></img>`); //업로드한 이미지
  
  if (sockFound) {
    const rgb = `rgb(${sockFound.r} ${sockFound.g} ${sockFound.b})`;
    res.write(`
      <main>
        <section>
          <img class="icon_img" src="content/icon_analysis.svg">
          <h1 class="section_title">Your sock’s profile</h1>
          <div class="sock_illustration whitebox">
            <svg width="186" height="302" viewBox="0 0 208 320" xmlns="http://www.w3.org/2000/svg">
            <path d="M117.857 0.0620117L90.6561 151.03L80.781 170.146L8.89683 246.326L0.756836 270.803L10.9759 297.038L34.578 301.967L59.4596 292.968L131.988 236.955L151.867 224.525L162.937 209.3L165.541 183.017L159.557 157.04L185.244 11.9001L117.857 0.0620117Z" fill="${rgb}" stroke="#4142F4" stroke-width="5"/>
            </svg>
          </div>
          <div class="sock_profile whitebox">
            <div class="color-container">
              <span class="rgb">R</span>
              <span>${sockFound.r}</span>
              <span class="rgb">G</span>
              <span>${sockFound.g}</span>
              <span class="rgb">B</span>
              <span>${sockFound.b}</span>
            </div>
            <div class="tag-container">
              <span class="tag"> ${sockFound.tag1}</span>
              <span class="tag"> ${sockFound.tag2}</span> 
              <span class="tag"> ${sockFound.tag3}</span>
            </div>
          </div>
        </section>


        <section>
          <img class="icon_img" src="content/icon_matching.svg">
          <h1 class="section_title">The perfect match for your sock</h1>
          <img class="whitebox" width=200 src="resources/${sockFound.file}"></img>
          <p class="description whitebox">${sockFound.description}</p>
        </section>

        <section>
          <div class="btn">
          <a href='/upload'>Try again</a>
          </div>
          <div class="btn">
          <a href='/'>Match Your Sock</a>
        </section>

      </div>
      </main>
      
      <footer id="gradient"></footer>

      <script>
      window.addEventListener('scroll', () => {
          var footer = document.getElementById('gradient');
          var windowHeight = window.innerHeight;
          var bodyHeight = document.body.offsetHeight;
          var scrolledFromTop = window.scrollY;
          var scrollableHeight = bodyHeight - windowHeight;
      
          if (scrolledFromTop >= scrollableHeight) {
              footer.style.display = 'none';
          } else {
              footer.style.display = 'block';
          }
      });
      </script>
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
