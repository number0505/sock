

window.addEventListener('scroll', () => {
	const scrollPosition = window.pageYOffset;
	const maxScroll = window.innerHeight;

	if(scrollPosition >= maxScroll) {
		window.scrollTo(0, maxScroll);
	
		if (document.getElementById('nextPageButton')) {
			document.getElementById('nextPageButton').style.display = 'block'; // 버튼 표시
		}
	} else {
		if (document.getElementById('nextPageButton')) {
			document.getElementById('nextPageButton').style.display = 'none'; // 스크롤 중 버튼 숨김
		}
	}

	const percentage = scrollPosition / maxScroll;
	// max(1... 은 축소했을 때 최대1 보다 작아지지 않도록 / 처음 200에서 100까지 축소
	const scaleDown = Math.max(1, 15 - 14 * percentage);	
	// min(1... 은 확대했을 때 최소 1 보다 작아지지 않도록 / 처음 50에서 100까지 확대??
	const scaleUp = Math.min(2, 1 + 1 * percentage);

	if (document.getElementById('page1')) {
		document.getElementById('page1').style.transform = `scale(${scaleDown})`;
	}
	
	if (document.getElementById('page2')) {
		document.getElementById('page2').style.transform = `scale(${scaleUp})`;
	}
});


document.getElementById('nextPageButton')?.addEventListener('click', () => {
	// 다음 페이지로 이동하는 로직 추가 (예: 새로운 URL로 리다이렉션)
	window.location.href = '/upload'; // 여기서 URL을 원하는 대상 페이지로 변경하세요.
});
