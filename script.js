window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset;
  const page1 = document.querySelector('.page1');
  const page2 = document.querySelector('.page2');

  page1.style.transform = `translate(-50%, -50%) scale(${1 - scrollTop / 100})`;
  page2.style.transform = `translate(-50%, -50%) scale(${scrollTop / 100 + 1})`;
});
