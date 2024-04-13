window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset;
  const page1 = document.querySelector('.sock_img');
  const page2 = document.querySelector('.title');

  page1.style.transform = `translate(-50%, -50%) scale(${1 - scrollTop / 100})`;
  page2.style.transform = `translate(-50%, -50%) scale(${scrollTop / 100 + 1})`;
});
