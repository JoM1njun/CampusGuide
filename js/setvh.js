function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setPropert('--vh', `${vh}px`);
}

// DOM이 준비된 후 실행되도록!
window.addEventListener('load', () => {
  setVhUnit();
  window.addEventListener('resize', setVhUnit);
  window.addEventListener('orientationchange', setVhUnit);
});
