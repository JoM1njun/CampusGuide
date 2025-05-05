function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function setVwUnit() {
  const vw = window.innerWidth * 0.01; // 너비를 기준으로 1% 계산
  document.documentElement.style.setProperty('--vw', `${vw}px`);
}

setVhUnit();
setVwUnit();

// DOM이 준비된 후 실행되도록!
window.addEventListener('load', () => {
  window.addEventListener('resize', setVhUnit);
  window.addEventListener('orientationchange', setVhUnit);
  window.addEventListener('resize', setVwUnit); // 화면 크기 변경 시 갱신
  window.addEventListener('orientationchange', setVwUnit); // 방향 전환 시 갱신
});
