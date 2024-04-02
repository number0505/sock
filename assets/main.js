const videoElement = document.getElementById('videoElement');

if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
		.then(function (stream) {
				videoElement.srcObject = stream;
		})
		.catch(function (err0r) {
				console.log("카메라에 접근할 수 없습니다.");
		});
}