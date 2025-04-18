// 초기 지도 화면 설정 및 infoWindow 닫기
function initMap() {
  try {
    let container = document.getElementById("map");
    if (container) {
      let options = {
        center: new kakao.maps.LatLng(36.320430029704, 127.36680988956), // 배재대 중앙 위치 / 초기 위치
        level: window.innerWidth <= 768 ? 4 : 3, // 줌 레벨 (값이 낮을수록 확대)
        draggable: true,
      };
      map = new kakao.maps.Map(container, options);

      console.log(map);

      // 줌인/아웃 시에도 자동 중심 끔
      kakao.maps.event.addListener(map, "zoom_changed", function () {
        isAutoCentering = false;
        recenterButton.style.display = "block";

        clearTimeout(autoCenterTimeout);
        autoCenterTimeout = setTimeout(() => {
          isAutoCentering = true;
          recenterButton.style.display = "none";
        }, 10000);
      });

      window.markerImage = new kakao.maps.MarkerImage(
        "marker/marker.svg",
        new kakao.maps.Size(75, 30)
      );
      window.redmarkerImage = new kakao.maps.MarkerImage(
        "marker/red-marker.svg",
        new kakao.maps.Size(75, 30)
      );
    }
  } catch (error) {
    console.error("Error int initmap : ", error);
  }

  // 지도 클릭 시 모든 infoWindow 닫기
  kakao.maps.event.addListener(map, "click", function () {
    infoWindows.forEach((iw) => iw.close());
  });
}
