fetch("/api/kakao_key") // Render 서버에서 API 키 받아옴
  .then((res) => res.json())
  .then((data) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${data.apikey}&autoload=false&libraries=services`;
    script.onload = () => {
      kakao.maps.load(() => {
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

              window.markerImage = new kakao.maps.MarkerImage(
                "/public/marker/marker.svg",
                new kakao.maps.Size(75, 30)
              );
              window.redmarkerImage = new kakao.maps.MarkerImage(
                "/public/marker/red-marker.svg",
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
      });
    };
    document.head.appendChild(script);
  });
