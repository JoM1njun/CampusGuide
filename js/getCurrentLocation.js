let isAutoCentering = true;

map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT);

// 사용자가 지도를 드래그하면 자동 중심 이동 해제
kakao.maps.event.addListener(map, 'dragstart', function () {
  isAutoCentering = false;
});

// 줌인/아웃 시에도 자동 중심 끔
kakao.maps.event.addListener(map, 'zoom_changed', function () {
  isAutoCentering = false;
});

function getCurrentLocation() {
  var markersrc = "marker/current-marker.svg";
  var imageSize = new kakao.maps.Size(70, 30); // 마커이미지의 크기
  var markerImage = new kakao.maps.MarkerImage(markersrc, imageSize);

  let currentLocationMarker = null;
  let userDirection = 0; // 사용자의 시선 방향 저장
  let errorCount = 0; // 오류 카운트
  let errorCooldown = false; // 중복 alert 방지
  let locationFound = false;

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      // 위치를 실시간으로 업데이트
      function (position) {
        let lat = position.coords.latitude; // 현재 위도
        let lng = position.coords.longitude; // 현재 경도
        let userLocation = new kakao.maps.LatLng(lat, lng);

        if (!currentLocationMarker) {
          const markerContent = document.createElement("div");
          markerContent.className = "custom-marker";
          markerContent.style.transform = `rotate(${userDirection}deg)`;

          currentLocationMarker = new kakao.maps.Marker({
            map: map,
            position: userLocation,
            image: markerImage,
          });
        } else {
          // 기존 마커가 있다면 위치만 업데이트
          currentLocationMarker.setPosition(userLocation);
        }

        let heading = position.coords.heading;

        if (heading !== null) {
          currentLocationMarker.setRotation(heading);
        }

        if (window.innerWidth <= 768) {
          map.setLevel(3);
        } else {
          map.setLevel(2);
        }
        // 지도 중심 이동
        if (isAutoCentering) {
          map.setCenter(userLocation);
        }

        if (!locationFound) {
          alert("현재 위치를 찾았습니다!");
          locationFound = true;
        }
        errorCount = 0;
        errorCooldown = false;
      },
      function (error) {
        if (!errorCooldown) {
          alert("위치 정보를 가져올 수 없습니다.");
          errorCooldown = true;

          // 10초 뒤에 다시 오류 알림 허용
          setTimeout(() => {
            errorCooldown = false;
          }, 10000);
        }

        errorCount++;
        if (errorCount >= 5) {
          console.warn("지속적인 위치 오류 발생. 위치 추적 중단.");
          navigator.geolocation.clearWatch(); // 위치 추적 중지
        }
      },
      {
        enableHighAccuracy: true, // 더 정확한 위치 정보 사용
        maximumAge: 60000, // 캐시된 위치를 사용하지 않음
        timeout: 5000, // 5초동안 위치 데이터 가져옴
      }
    );
  } else {
    alert("이 브라우저에서는 위치 찾기를 지원하지 않습니다.");
  }
}
