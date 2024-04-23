

window.addEventListener('scroll', () => {
	const scrollPosition = window.pageYOffset;
	const maxScroll = window.innerHeight;
	let screenSizeModifer;
	if (window.innerWidth <= 768) {
		screenSizeModifer = '_mobile'
	} else {
		screenSizeModifer = '_desktop'
	}
	const nextPageButton = document.getElementById('nextPageButton' + screenSizeModifer)

	if(scrollPosition >= maxScroll) {
		window.scrollTo(0, maxScroll);
		if (nextPageButton) {
			nextPageButton.style.display = 'block'; // 버튼 표시
			nextPageButton.classList.add('active');
		}
	} else {
		if (nextPageButton) {
			nextPageButton.style.display = 'none'; // 스크롤 중 버튼 숨김
			nextPageButton.classList.remove('active'); 
		}
	}

	const mainSockImg = document.getElementById('mainSockImg')

	if(scrollPosition >= maxScroll) {
		window.scrollTo(0, maxScroll);
		if (mainSockImg) {
			mainSockImg.style.display = 'block'; // 버튼 표시
			mainSockImg.classList.add('active');
		}
	} else {
		if (mainSockImg) {
			mainSockImg.style.display = 'none'; // 스크롤 중 버튼 숨김
			mainSockImg.classList.remove('active'); 
		}
	}

	const percentage = scrollPosition / maxScroll;
	// max(1... 은 축소했을 때 최대1 보다 작아지지 않도록 / 처음 350에서 100까지 축소
	const scaleDown = Math.max(1, 350 - 349 * percentage);	
	// min(1... 은 확대했을 때 최소 1 보다 작아지지 않도록 / 처음 50에서 100까지 확대??
	const scaleUp = Math.min(2.8, 1.2 + 1.5 * percentage);

	if (document.getElementById('page1' + screenSizeModifer)) {
		document.getElementById('page1' + screenSizeModifer).style.transform = `scale(${scaleDown})`;
	}
	
	if (document.getElementById('page2' + screenSizeModifer)) {
		document.getElementById('page2' + screenSizeModifer).style.transform = `scale(${scaleUp})`;
	}
});


document.getElementById('nextPageButton_desktop')?.addEventListener('click', () => {
	// 다음 페이지로 이동하는 로직 추가 (예: 새로운 URL로 리다이렉션)
	window.location.href = '/upload'; //원하는 페이지로 변경
});

document.getElementById('nextPageButton_mobile')?.addEventListener('click', () => {
	// 다음 페이지로 이동하는 로직 추가 (예: 새로운 URL로 리다이렉션)
	window.location.href = '/upload'; //원하는 페이지로 변경
});
// document.querySelector('.custom-file-input').addEventListener('click', function() {
//     document.getElementById('fileInput').click();
// });


