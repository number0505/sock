document.getElementById('startCamera').addEventListener('click', function() {
	const videoElement = document.getElementById('videoElement');

	if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
			.then(function (stream) {
					videoElement.srcObject = stream;
			})
			.catch(function (error) {
					console.log("Cannot access camera.",error);
			});
	}
}