

window.addEventListener('scroll', () => {
	const scrollPosition = window.pageYOffset;
	const maxScroll = window.innerHeight;

	if(scrollPosition >= maxScroll) {
		window.scrollTo(0, maxScroll);
	}

	const percentage = scrollPosition / maxScroll;
	// max(1... 은 축소했을 때 최대1 보다 작아지지 않도록 / 처음 200에서 100까지 축소
	const scaleDown = Math.max(1, 15 - 14 * percentage);	// min(1... 은 확대했을 때 최소 1 보다 작아지지 않도록 / 처음 50에서 100까지 확대??
	const scaleUp = Math.min(2, 1 + 1 * percentage);

	document.getElementById('page1').style.transform = `scale(${scaleDown})`;
	document.getElementById('page2').style.transform = `scale(${scaleUp})`;
});



// 잼민이 버전
// window.addEventListener('scroll', function() {
//   const scrollTop = window.pageYOffset;
//   const page1 = document.querySelector('.title');
//   const page2 = document.querySelector('.sock_bg');

//   page1.style.transform = `translate(-50%, -50%) scale(${1 - scrollTop / 100})`;
//   page2.style.transform = `translate(-50%, -50%) scale(${scrollTop / 100 + 1})`;
// });