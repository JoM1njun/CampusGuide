// place button의 목록을 숨기고, 보이기 위함
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menu-button");
  const placeMenu = document.getElementById("place-buttons");
  const placeinfo = document.getElementById("place-info");

  placeMenu.classList.add("hidden");
  placeinfo.classList.add("hidden");

  menuButton.addEventListener("click", () => {
    if (placeMenu.style.display === "none" || placeMenu.style.display === "") {
        // 장소 목록 보이기
        placeMenu.style.display = "flex";
        placeinfo.style.display = "none"; // 정보창은 숨기기
        isInfoVisible = false;
      } else {
        // 장소 목록 숨기기
        placeMenu.style.display = "none";
      }
  });
  
  // 지도 클릭 시 장소 목록을 숨기기
  if (map) {
    kakao.maps.event.addListener(map, "click", function () {
      console.log("Map Click");
      // 장소 목록과 정보창을 숨깁니다.
      placeMenu.style.display = "none"; // 장소 목록 숨기기
      placeinfo.style.display = "none"; // 정보창 숨기기

      // 정보창 상태 업데이트
      isInfoVisible = false;
      showPlaceButtons(); // 장소 목록을 다시 보이게
      console.log("Hidden");
    });
  } else {
    console.error("Map is not initialized yet.");
  }
});

// 장소 정보창을 닫을 때 호출되는 함수
function closeInfo() {
  const placeInfo = document.getElementById("place-info");
  placeInfo.style.display = "none"; // 창을 숨깁니다.
  isInfoVisible = false; // 정보창이 닫혔으므로 상태를 false로 설정
  showPlaceButtons();
}

// 메뉴 버튼 클릭 시 장소 목록을 표시하고 정보창 상태 확인
function showPlaceButtons() {
  const placeButtons = document.getElementById("place-buttons");
  if (!isInfoVisible) {
    // 정보창이 보이지 않으면 장소 목록을 표시
    placeButtons.style.display = "flex";
  } else {
    // 정보창이 열려 있다면 장소 목록을 숨깁니다.
    placeButtons.style.display = "none";
  }
}

function setupMapClickEvent() {
  if (!map) {
    console.error("Map is not initialized yet.");
    return;
  }

  kakao.maps.event.addListener(map, "click", function () {
    console.log("Map Click");
    
    const placeMenu = document.getElementById("place-buttons");
    const placeInfo = document.getElementById("place-info");

    // 장소 목록과 정보창을 숨김
    placeMenu.style.display = "none";
    placeInfo.style.display = "none";

    isInfoVisible = false;
    console.log("Hidden");
  });
}
