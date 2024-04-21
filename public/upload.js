document.getElementById('fileInput').addEventListener('change', function() {
	const preview = document.getElementById('preview');
	const file = document.getElementById('fileInput').files[0];
	if (!file) {
			resetForm(); // 파일 선택 안됏으면 리셋
			return; // Exit the function 
	}

	const reader = new FileReader();
	reader.onload = function(e) {
		// 프리뷰 보이고말고
		preview.src = e.target.result;
		preview.style.display = 'block';

		// 요소들 보이고말고 
		document.querySelector('.description').style.display = 'none';
		document.querySelector('.confirmation').style.display = 'block';
		document.querySelector('.custom-file-input').style.display = 'none';
		document.querySelector('.active_submit').style.display = 'inline-block';
	};
	reader.readAsDataURL(file);
});

function resetForm() {
	const preview = document.getElementById('preview');
	preview.src = "";
	preview.style.display = 'none';
	document.querySelector('.description').style.display = 'block';
	document.querySelector('.confirmation').style.display = 'none';
	document.querySelector('.custom-file-input').style.display = 'inline-block';
	document.querySelector('.active_submit').style.display = 'none';
}
