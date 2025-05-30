let isAutoCentering = true; // 지속적인 지도 중심 이동 막기 위한 용도
let buttonHideTimeout; // 드래그 멈추면 버튼을 숨기기 위한 용도 
let isTouchDragging = false; // 모바일에서 드래그 구분을 위한 용도
let isDragging = false; // 데스크탑에서 드래그 용도
let locationFound = false;
let followMode = true;
let currentLocationMarker = null;

window.getCurrentLocation = function () {
  console.log("위치 찾기 시작");
  var currentmarkersrc = "assets/marker/current-marker.svg";
  var imageSize = new kakao.maps.Size(60, 20); // 마커이미지의 크기
  var imageOffset = {
    offset: new kakao.maps.Point(35, 15),
  }; // 좌표에 맞게 이미지 출력
  var markerImage = new kakao.maps.MarkerImage(currentmarkersrc, imageSize, imageOffset);

  let userDirection = 0; // 사용자의 시선 방향 저장
  let errorCount = 0; // 오류 카운트
  let errorCooldown = false; // 중복 alert 방지

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      // 버튼 누르면 현재 위치 가져오기 (위치 권한 요청)
      function (position) {
        let lat = position.coords.latitude; // 현재 위도
        let lng = position.coords.longitude; // 현재 경도
        let userLocation = new kakao.maps.LatLng(lat, lng);

        if (!currentLocationMarker) {
          if (window.innerWidth <= 768) {
            map.setLevel(3);
          } else {
            map.setLevel(2);
          }
          
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

        // 지도 중심 이동
        if (followMode) {
          map.setCenter(userLocation);
        }

        if (!locationFound) {
          locationFound = true;
          map.setCenter(userLocation);
          alert("현재 위치를 찾았습니다!");
        }
      },
      function (err) {
        if (!errorCooldown) {
          console.warn("위치 정보를 가져올 수 없습니다.", err);
          errorCooldown = true;
          setTimeout(() => {
            errorCooldown = false;
          }, 10000); // 10초에 한 번만 경고 표시
        }
      },
      {
        enableHighAccuracy: true, // 더 정확한 위치 정보 사용
        maximumAge: 0, // 캐시된 위치를 사용하지 않음
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
  followMode = false;
});

mapContainer.addEventListener("touchmove", () => {
  isTouchDragging = true;
});

mapContainer.addEventListener("touchend", () => {
  if (isTouchDragging && locationFound) {
    console.log("드래그 감지됨!");

    recenterButton.style.display = "block"; 

    // 버튼은 예를 들어 3초 후에 숨기기
    clearTimeout(buttonHideTimeout);
    buttonHideTimeout = setTimeout(() => {
      recenterButton.style.display = "none";
    }, 1000);
  }
});

mapContainer.addEventListener("mousedown", () => {
  isDragging = false;
  followMode = false;
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

