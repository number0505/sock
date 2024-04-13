// document.getElementById('takePhoto').addEventListener('click', function() {
// 	const canvasElement = document.getElementById('canvasElement');
// 	const videoElement = document.getElementById('videoElement');
// 	const context = canvasElement.getContext('2d');
	
// 	// videoElement의 크기에 맞게 canvas 크기 설정
// 	canvasElement.width = videoElement.videoWidth;
// 	canvasElement.height = videoElement.videoHeight;
	
// 	// video에서 현재 프레임을 canvas에 그림
// 	context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
	
// 	// canvas에서 이미지로 변환 (예: PNG 형식)
// 	const imageDataUrl = canvasElement.toDataURL('image/png');
	
// 	// 이미지 데이터 URL을 사용해 이미지 표시 or 저장 등의 추가 작업을 할 수 있음
// 	// 예: 새 창에서 이미지를 열기
// 	window.open(imageDataUrl);
// });


document.addEventListener('DOMContentLoaded', (event) => {
	const video = document.getElementById('video');
	const canvas = document.getElementById('canvas');
	const photo = document.getElementById('photo');
	const captureButton = document.getElementById('capture');

	const constraints = {
			video: {
					width: 640, height: 480
			}
	};

	navigator.mediaDevices.getUserMedia(constraints)
	.then((stream) => {
			video.srcObject = stream;
	})
	.catch((error) => {
			console.error("Error accessing the camera: ", error);
	});

	captureButton.addEventListener('click', () => {
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		 
			photo.src = canvas.toDataURL('image/png');
			photo.style.display = 'block';
	});
});