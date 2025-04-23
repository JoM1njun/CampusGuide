const controller = new AbortController();
const timeout = setTimeout(() => {
  controller.abort(); // 3초 뒤에 요청을 취소하고 로딩 메시지 표시
  showLoadingMessage("서버가 잠에서 꺠어나는 중입니다. 잠시만 기다려 주세요.");
}, 3000); // 3초 대기

// 서버 요청
fetch('/api/places', { signal: controller.signal })
  .then(response => response.json())
  .then(data => {
    clearTimeout(timeout); // 요청 완료되면 타이머 제거
    hideLoadingMessage();  // 로딩 메시지 숨김
    renderMap(data);       // 받은 데이터로 맵에 마커 표시
  })
  .catch(err => {
    if (err.name === "AbortError") {
      console.warn("서버 응답 지연으로 메시지 표시됨");
    } else {
      alert("서버 오류: " + err.message);
    }
  });

// 로딩 메시지 표시 함수
function showLoadingMessage(message) {
  document.getElementById('loadingMessage').textContent = message;
  document.getElementById('loadingOverlay').style.visibility = 'visible';
}

// 로딩 메시지 숨기기 함수
function hideLoadingMessage() {
  document.getElementById('loadingOverlay').style.visibility = 'hidden';
}
