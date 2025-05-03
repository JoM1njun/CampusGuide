const menuButton = document.getElementById("menu-button");
const placeInfo = document.getElementById("place-info");
const toggleBtn = document.getElementById("toggle-button");
const placeButtons = document.getElementById("place-buttons");
let isOpen = false;

function closeMenu() {
  placeButtons.classList.remove("active");
  toggleBtn.classList.remove("active");
  toggleBtn.style.right = "0";
  toggleBtn.innerHTML = "&lt;";
  isOpen = false; // 메뉴가 닫히므로 상태 false로 설정
  
  if (isInfoVisible) {
    // 정보창이 열려 있으면 닫히면서 메뉴 다시 보이게
    closeInfo();
    // placeButtons.classList.add("active");
    //placeButtons.classList.remove("hidden-by-info");
  }
}

function openMenu() {
  placeButtons.style.display = "block";
  placeButtons.classList.add("active");
  toggleBtn.classList.add("active");
  toggleBtn.innerHTML = "&gt;"; // 토글 버튼 방향
  // 화면 너비가 768px 이하이면 모바일로 간주
  if (window.innerWidth <= 768) {
    toggleBtn.style.right = "57vw"; // 모바일용 위치
  } else {
    toggleBtn.style.right = "26.5vw"; // 데스크탑용 위치
  }
  isOpen = true; // 메뉴 열림 상태
}

function setupMapClickEvent() {
  if (!map) {
    console.error("Map is not initialized yet.");
    return;
  }

  kakao.maps.event.addListener(map, "click", function () {
    console.log("✅ 지도 클릭됨!");
    closeMenu();
    if (isInfoVisible) {
      closeInfo();
    }
  });
}
  
toggleBtn.addEventListener("click", () => {
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

setupMapClickEvent();

function openInfo() {
  placeInfo.style.display = "block";
  placeInfo.classList.add("active");
  isInfoVisible = true;

  // 메뉴는 숨기기
  placeButtons.classList.remove("active");
  //placeButtons.classList.add("hidden-by-info");
}

// 장소 정보창을 닫을 때 호출되는 함수
function closeInfo() {
  placeInfo.classList.remove("active"); // 창을 숨깁니다.
  isInfoVisible = false; // 정보창이 닫혔으므로 상태를 false로 설정
  
  if (!isOpen || placeButtons.style.display === "none") {
    // 메뉴가 열려 있지 않으면 다시 보여줌
    openMenu();
  }
  // openMenu();
  // 메뉴 목록 다시 보이게
  //placeButtons.style.display = "block";
  //placeButtons.classList.remove("hidden-by-info");
}

// place-buttons의 각 버튼 클릭 시 정보창 열기
placeButtons.addEventListener("click", (event) => {
  const placeId = event.target.dataset.placeId; // 버튼에 데이터 속성에 장소 ID를 추가했다고 가정
  if (placeId) {
    openInfo(placeId);
  }
});

// 문서 클릭 시 외부 클릭 감지 → 메뉴/정보창 닫기
document.addEventListener("click", function (event) {
  const isClickInsideMenu = placeButtons.contains(event.target);
  const isClickInsideInfo = placeInfo.contains(event.target);
  const isClickInsideButton = toggleBtn.contains(event.target);

  if (!isClickInsideMenu && !isClickInsideInfo && !isClickInsideButton) {
    closeMenu();
  }
});

// 메뉴 버튼 클릭 시 장소 목록을 표시하고 정보창 상태 확인
// function showPlaceButtons() {
//   if (!isInfoVisible) {
//     // 정보창이 보이지 않으면 장소 목록을 표시
//     placeButtons.classList.add("active");
//   } else {
//     // 정보창이 열려 있다면 장소 목록을 숨깁니다.
//     placeButtons.classList.remove("active");
//     //placeButtons.classList.remove("hidden-by-info");
//   }
// }
  
  // 지도 클릭 시 장소 목록을 숨기기
  // if (map) {
  //   kakao.maps.event.addListener(map, "click", function () {
  //     console.log("Map Click");
  //     // 장소 목록과 정보창을 숨깁니다.
  //     placeMenu.style.display = "none"; // 장소 목록 숨기기
  //     placeinfo.style.display = "none"; // 정보창 숨기기

  //     // 정보창 상태 업데이트
  //     isInfoVisible = false;
  //     showPlaceButtons(); // 장소 목록을 다시 보이게
  //     console.log("Hidden");
  //   });
  // } else {
  //   console.error("Map is not initialized yet.");
  // }
  // });

// function setupMapClickEvent() {
//   if (!map) {
//     console.error("Map is not initialized yet.");
//     return;
//   }

//   kakao.maps.event.addListener(map, "click", function () {
//     console.log("Map Click");
    
//     const placeMenu = document.getElementById("place-buttons");
//     const placeInfo = document.getElementById("place-info");

//     // 장소 목록과 정보창을 숨김
//     placeMenu.style.display = "none";
//     placeInfo.style.display = "none";

//     isInfoVisible = false;
//     console.log("Hidden");
//   });
// }
