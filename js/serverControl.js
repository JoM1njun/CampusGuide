// let loadingTimeout;

// // 각 기능 버튼에 따른 API 호출
// document.querySelector("#searchInput").addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     const searchQuery = event.target.value;
//     const apiEndpoint = "/api/db-status"; // 필요 시 data-api로 받아도 됨

//     if (searchQuery.trim()) {
//       loadAPI(`${apiEndpoint}?q=${encodeURIComponent(searchQuery)}`);
//     } else {
//       alert("검색어를 입력해주세요.");
//     }
//   }
// });

// document.querySelectorAll(".category_place").forEach(button => {
//   button.addEventListener("click", () => {
//     const apiEndpoint = "/api/db-status";
//     const query = button.dataset.query; // 버튼별로 설정된 추가 데이터 추출
//     loadAPI(`${apiEndpoint}?q=${query}`); // API 호출 시 파라미터 포함
//   });
// });

// function showLoadingMessage(message) {
//   document.querySelector("#loadingMessage").textContent = message;
//   document.querySelector("#loadingMessage").style.display = "block";
// }

// function hideLoadingMessage() {
//   document.querySelector("#loadingMessage").style.display = "none";
// }

// function loadAPI(endpoint) {
//   const controller = new AbortController();
//   clearTimeout(loadingTimeout); // 기존 타이머가 있으면 제거

//   loadingTimeout = setTimeout(() => {
//     showLoadingMessage("서버가 잠들어 있거나 느려요. 잠시만 기다려 주세요.");
//   }, 3000); // 3초 후 메시지 표시

//   fetch(endpoint, { signal: controller.signal })
//     .then(response => response.json())
//     .then(data => {
//       clearTimeout(loadingTimeout); // 요청이 3초 이내면 타이머 제거
//       hideLoadingMessage();  // 로딩 메시지 숨김
//       renderData(data);      // 받은 데이터로 화면 업데이트
//     })
//     .catch(err => {
//       if (err.name === "AbortError") {
//         console.warn("응답 지연으로 메시지 표시됨");
//       } else {
//         alert("서버 오류: " + err.message);
//       }
//     });
// }

async function wakeServerIfNeeded() {
    const maxRetries = 10;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const res = await fetch("https://campusguide-back.onrender.com/ping");

            if (res.ok) {
                const result = await res.json();
                if (result.status === "alive") {
                    // 서버가 깨어있으면 종료
                    return true;
                }
            }
        } catch (e) {
            // 실패할 경우 무시하고 retry
        }

        if (attempts === 0) {
            alert("잠 들어있던 서버가 깨어나는 중입니다. 잠시만 기다려주세요.");
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
        attempts++;
    }

    return false;
}

// 어떤 기능 버튼을 눌렀을 때
document.querySelectorAll(".category_place").forEach(button => {
    button.addEventListener("click", async () => {
        const isAwake = await wakeServerIfNeeded();
        if (!isAwake) return;

        // 서버가 깨어났다면 이 아래에서 원하는 기능 호출
        fetch("https://campusguide-back.onrender.com/api/db-status")
            .then(res => res.json())
            .then(data => {
                console.log("데이터 응답:", data);
                // 원하는 처리
            });
    });
});
