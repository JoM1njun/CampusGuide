let loadingTimeout;

// 각 기능 버튼에 따른 API 호출
document.querySelector("#searchInput").addEventListener("click", () => {
  button.addEventListener("click", () => {
    const searchQuery = document.querySelector("#searchInput").value;  // 검색창에서 입력된 값
    const apiEndpoint = "/api/db-status";  // data-api 속성에서 API 경로 가져오기
    
    if (searchQuery.trim()) {  // 검색어가 비어 있지 않으면
      loadAPI(`${apiEndpoint}?q=${encodeURIComponent(searchQuery)}`);  // 검색어를 API에 쿼리로 전송
    } else {
      alert("검색어를 입력해주세요.");
    }
  });
});

document.querySelectorAll(".category_place").forEach(button => {
  button.addEventListener("click", () => {
    const apiEndpoint = "/api/db-status";
    const query = button.dataset.query; // 버튼별로 설정된 추가 데이터 추출
    loadAPI(`${apiEndpoint}?q=${query}`); // API 호출 시 파라미터 포함
  });
});

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
