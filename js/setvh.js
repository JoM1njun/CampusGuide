function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhUnit();

// DOM이 준비된 후 실행되도록!
window.addEventListener('load', () => {
  window.addEventListener('resize', setVhUnit);
  window.addEventListener('orientationchange', setVhUnit);
});
