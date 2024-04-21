
function previewFile() {
	const preview = document.getElementById('preview');
	const file = document.getElementById('fileInput').files[0];
	const reader = new FileReader();

reader.onloadend = function() {
	if (file) {
		preview.src = reader.result; // 읽은 파일의 내용을 src로 설정
		preview.style.display = 'block'; // 이미지 표시
	} else {
		preview.style.display = 'none'; // 파일이 없으면 미리보기 숨김
	}
};

	if (file) {
			reader.readAsDataURL(file);
	} else {
			preview.src = "";
			preview.style.display = 'none';
	}
};

document.getElementById('fileInput').addEventListener('change', previewFile); // fileInput에 이벤트 리스너 추가
