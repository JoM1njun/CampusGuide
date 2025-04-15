function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setPropert('--vh', `${vh}px`);
}
setVhUnit();
window.addEventListener('resize', setVhUnit);
