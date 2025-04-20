let isAutoCentering = true; // 지속적인 지도 중심 이동 막기 위한 용도
let buttonHideTimeout;
let isTouchDragging = false;
let isDragging = false;
let locationFound = false;
let currentLocationMarker = null;

window.getCurrentLocation = function () {
  console.log("위치 찾기 시작");
  var markersrc = "marker/current-marker.svg";
  var imageSize = new kakao.maps.Size(70, 30); // 마커이미지의 크기
  var markerImage = new kakao.maps.MarkerImage(markersrc, imageSize);

  let userDirection = 0; // 사용자의 시선 방향 저장
  let errorCount = 0; // 오류 카운트
  let errorCooldown = false; // 중복 alert 방지

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
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
          locationFound = true;
          alert("현재 위치를 찾았습니다!");
        }
      },
      function () {
        alert("위치 정보를 가져올 수 없습니다.");
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

// "현재 위치로 돌아가기" 버튼 숨김/보임 제어
const recenterButton = document.getElementById("recent-button");
const mapContainer = document.getElementById("map");

mapContainer.addEventListener("touchstart", () => {
  isTouchDragging = false;
});

mapContainer.addEventListener("touchmove", () => {
  isTouchDragging = true;
});

mapContainer.addEventListener("touchend", () => {
  if (isTouchDragging && locationFound) {
    console.log("드래그 감지됨!");

    recenterButton.style.display = "block"; 

    // clearTimeout(autoCenterTimeout);
    // autoCenterTimeout = setTimeout(() => {
    //   isAutoCentering = true;
    //   recenterButton.style.display = "none";
    // }, 10000);

    // 버튼은 예를 들어 3초 후에 숨기기
    clearTimeout(buttonHideTimeout);
    buttonHideTimeout = setTimeout(() => {
      recenterButton.style.display = "none";
    }, 1000);
  }
});

mapContainer.addEventListener("mousedown", () => {
  isDragging = false;
});

mapContainer.addEventListener("mousemove", () => {
  isDragging = true;
});

mapContainer.addEventListener("mouseup", () => {
  if (isDragging && locationFound) {
    console.log("PC 드래그 감지됨!");

    isAutoCentering = false;
    recenterButton.style.display = "block";

    // 버튼은 예를 들어 3초 후에 숨기기
    clearTimeout(buttonHideTimeout);
    buttonHideTimeout = setTimeout(() => {
      recenterButton.style.display = "none";
    }, 1500);
  }
});

// "현재 위치로 돌아가기" 버튼 클릭 이벤트
document.getElementById("recent-button").addEventListener("click", function () {
  if (currentLocationMarker) {
    isAutoCentering = true; // 자동 중심 이동 활성화
    map.setCenter(currentLocationMarker.getPosition()); // 현재 위치로 지도 중심 이동
  }
});

