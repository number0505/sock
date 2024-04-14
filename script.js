// window.addEventListener('scroll', function() {
//   const scrollTop = window.pageYOffset;
//   const page1 = document.querySelector('.title');
//   const page2 = document.querySelector('.sock_bg');

//   page1.style.transform = `translate(-50%, -50%) scale(${1 - scrollTop / 100})`;
//   page2.style.transform = `translate(-50%, -50%) scale(${scrollTop / 100 + 1})`;
// });

window.addEventListener('scroll', () => {
	const scrollPosition = window.pageYOffset;
	const maxScroll = window.innerHeight;

	const scaleUp = Math.min(1, 0.5 + scrollPosition / maxScroll * 0.5);
	const scaleDown = Math.max(0.5, 1 - scrollPosition / maxScroll * 0.5);

	document.getElementById('page2').style.transform = `scale(${scaleUp})`;
	document.getElementById('page1').style.transform = `scale(${scaleDown})`;
});
