function getCurrentLocation() {
    var markersrc = "/public/marker/current-marker.png";
  var imageSize = new kakao.maps.Size(80, 40); // 마커이미지의 크기

  var markerImage = new kakao.maps.MarkerImage(markersrc, imageSize);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition( // 위치를 실시간으로 업데이트
            function (position) {
                let lat = position.coords.latitude; // 현재 위도
                let lng = position.coords.longitude; // 현재 경도
                let userLocation = new kakao.maps.LatLng(lat, lng);

                if (!currentLocationMarker) {
                    currentLocationMarker = new kakao.maps.Marker({
                        map: map,
                        position: userLocation,
                        image: markerImage,
                    });
                } else { // 기존 마커가 있다면 위치만 업데이트
                    currentLocationMarker.setPosition(userLocation);
                }

                let heading = position.coords.heading;

                if (heading !== null) {
                    currentLocationMarker.setRotation(heading);
                }

                // 지도 중심 이동
                map.setCenter(userLocation);

                if (!locationFound) {
                    alert("현재 위치를 찾았습니다!");
                    locationFound = true;
                }
            },
            function (error) {
                alert("위치 정보를 가져올 수 없습니다.", error);
            },
            {
                enableHighAccuracy: true, // 더 정확한 위치 정보 사용
                maximumAge: 60000, // 캐시된 위치를 사용하지 않음
                timeout: 5000 // 5초동안 위치 데이터 가져옴
            }
        );
    } else {
        alert("이 브라우저에서는 위치 찾기를 지원하지 않습니다.");
    }
}
