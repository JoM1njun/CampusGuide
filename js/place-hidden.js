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
  kakao.maps.event.addListener(map, "click", function () {
    console.log("Map Click");
    // 장소 목록과 정보창을 숨깁니다.
    placeMenu.style.display = "none";
    placeinfo.style.display = "none";

    // 정보창 상태 업데이트
    isInfoVisible = false;
    showPlaceButtons();
    console.log("Hidden");
  });
});
