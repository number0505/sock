document.getElementById('takePhoto').addEventListener('click', function() {
	const canvasElement = document.getElementById('canvasElement');
	const videoElement = document.getElementById('videoElement');
	const context = canvasElement.getContext('2d');
	
	// videoElement의 크기에 맞게 canvas 크기 설정
	canvasElement.width = videoElement.videoWidth;
	canvasElement.height = videoElement.videoHeight;
	
	// video에서 현재 프레임을 canvas에 그림
	context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
	
	// canvas에서 이미지로 변환 (예: PNG 형식)
	const imageDataUrl = canvasElement.toDataURL('image/png');
	
	// 이미지 데이터 URL을 사용해 이미지 표시 or 저장 등의 추가 작업을 할 수 있음
	// 예: 새 창에서 이미지를 열기
	window.open(imageDataUrl);
});