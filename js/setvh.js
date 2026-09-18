function updateViewportUnits() {
  const viewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  document.documentElement.style.setProperty(
    '--vh',
    `${viewportHeight * 0.01}px`
  );

  document.documentElement.style.setProperty(
    '--vw',
    `${window.innerWidth * 0.01}px`
  );
}

updateViewportUnits();

window.addEventListener('resize', updateViewportUnits);
window.addEventListener('orientationchange', updateViewportUnits);

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateViewportUnits);
}