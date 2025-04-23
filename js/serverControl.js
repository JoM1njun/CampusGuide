let loadingTimeout;

function showLoadingMessage(message) {
  document.querySelector("#loadingMessage").textContent = message;
  document.querySelector("#loadingMessage").style.display = "block";
}

function hideLoadingMessage() {
  document.querySelector("#loadingMessage").style.display = "none";
}

function loadAPI(endpoint) {
  const controller = new AbortController();
  clearTimeout(loadingTimeout); // 기존 타이머가 있으면 제거

  loadingTimeout = setTimeout(() => {
    showLoadingMessage("서버가 잠들어 있거나 느려요. 잠시만 기다려 주세요.");
  }, 3000); // 3초 후 메시지 표시

  fetch(endpoint, { signal: controller.signal })
    .then(response => response.json())
    .then(data => {
      clearTimeout(loadingTimeout); // 요청이 3초 이내면 타이머 제거
      hideLoadingMessage();  // 로딩 메시지 숨김
      renderData(data);      // 받은 데이터로 화면 업데이트
    })
    .catch(err => {
      if (err.name === "AbortError") {
        console.warn("응답 지연으로 메시지 표시됨");
      } else {
        alert("서버 오류: " + err.message);
      }
    });
}

// 각 기능 버튼에 따른 API 호출
document.querySelector("#openMapButton").addEventListener("click", () => {
  loadAPI('/api/places');
});

document.querySelector("#searchButton").addEventListener("click", function() {
  const query = document.querySelector("#searchInput").value;
  loadAPI(`/api/search?q=${query}`);
});
