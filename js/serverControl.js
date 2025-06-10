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

let isServerWaking = false;
let serverWakePromise = null;

async function wakeServerIfNeeded() {
    if (isServerWaking && serverWakePromise) {
        // 다른 요청이 깨우는 중이면 그 Promise를 그대로 기다림
        return serverWakePromise;
    }

    isServerWaking = true;
    serverWakePromise = (async () => {
        // 먼저 서버가 이미 깨어있는지 확인
        try {
            const res = await fetch("https://campusguide-back.onrender.com/ping");
            if (res.ok) {
                const result = await res.json();
                if (result.status === "alive") {
                    isServerWaking = false;
                    serverWakePromise = null;
                    return true;
                }
            }
        } catch (e) {
            // 네트워크 오류 발생 가능
        }

        // 서버가 자고 있다면 로딩 오버레이 표시 후 재시도
        showOverlay(true);
        const maxRetries = 10;
        let attempts = 0;

        while (attempts < maxRetries) {
            try {
                const res = await fetch("https://campusguide-back.onrender.com/ping");
                if (res.ok) {
                    const result = await res.json();
                    if (result.status === "alive") {
                        showOverlay(false);
                        isServerWaking = false;
                        serverWakePromise = null;
                        return true;
                    }
                }
            } catch (e) {
                // 실패시 무시하고 재시도
            }

            await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
            attempts++;
        }

        // 실패
        showOverlay(false);
        isServerWaking = false;
        serverWakePromise = null;
        return false;
    })();

    return serverWakePromise;
}

// 로딩 오버레이를 표시하거나 숨기는 함수
function showOverlay(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (show) {
        overlay.style.display = "flex";  // 오버레이 표시
    } else {
        overlay.style.display = "none";  // 오버레이 숨기기
    }
}

// 어떤 기능 버튼을 눌렀을 때
document.querySelectorAll(".category_place").forEach(button => {
    button.addEventListener("click", async () => {
        const isAwake = await wakeServerIfNeeded();
        if (!isAwake) {
            alert("서버가 응답하지 않습니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        try {
            const res = await fetch("https://campusguide-back.onrender.com/api/db-status");

            if (!res.ok) throw new Error("DB 상태 조회 실패");

            const data = await res.json();
            console.log("서버 응답 데이터:", data);
        } catch (e) {
            console.error("DB 상태 조회 실패:", e);
            alert("서버에서 데이터를 가져오는 데 실패했습니다.");
        }
    });
});

// 엔터 키 입력 시 처리
document.querySelector("#searchInput").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const isAwake = await wakeServerIfNeeded();
        if (!isAwake) {
            alert("서버가 응답하지 않습니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        try {
            const searchTerm = document.querySelector("#searchInput").value;
            const res = await fetch(`/api/db-status?query=${searchTerm}`);
            if (!res.ok) return;

            const data = await res.json();
            console.log("검색 결과:", data);
        } catch (e) {
            console.error("검색 실패:", e);
            if (!(e instanceof TypeError)) {
                alert("검색에 실패했습니다. 다시 시도해 주세요.");
            }
        }
    }
});
