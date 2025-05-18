function searchPlaces(category) {
  var activemarker = null;

  if (category) {
    fetch(
      `https://campusguide-back.onrender.com/api/db-status?query=` +
        encodeURIComponent(category)
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Received : ", data);
        const places = data.places; // places로 수정
        console.log("Places : ", places);

        // 기존 마커와 infoWindow 제거
        userMarker.forEach((obj) => {
          if (obj.infoWindow) {
            obj.infoWindow.close();
          }
          if (obj.marker) {
            obj.marker.setMap(null);
          }
        });
        userMarker = [];

        // 기존 infoWindows도 초기화
        infoWindows.forEach((iw) => iw.close());
        infoWindows = [];

        if (window.innerWidth <= 768) {
          map.setLevel(4);
        } else {
          map.setLevel(3);
        }

        if (places && places.length > 0) {
          places.forEach((place, index) => {
            console.log("위치 : ", place.latitude, place.longitude);
            let placeLocation = new kakao.maps.LatLng(
              place.latitude,
              place.longitude
            );

            let isBusstop =
              place.alias === "BUS" || place.name === "버스정류장";

            let Marker = new kakao.maps.Marker({
              position: placeLocation,
              map: map,
              image: markerImage,
              clickable: true,
            });

            if (isBusstop) {
              kakao.maps.event.addListener(searchMarker, "click", function () {
                fetchBusTimetable(
                  place.alias,
                  searchMarker,
                  placeLocation,
                  place
                ); // 정류장 ID로 시간표 가져오기
                // console.log("Alias : ", place.alias);
              });
              userMarker.push({ marker: searchMarker, infoWindow: null });
            } else {
              let content = `
                    <div class="info-window">
                        <h4 style="
                        font-size: ${mobile ? "12px" : "14px"};
                        ">${place.name}</h4>
                        <p style="
                        font-size: ${mobile ? "10px" : "12px"};
                        ">
                        운영시간 : ${place.hours} <br>
                        전화번호 : ${
                          place.phone
                            ? `<a href="tel:${place.phone.replace(
                                /-/g,
                                " "
                              )}">${place.phone}</a>`
                            : "정보 없음"
                        }<br>
                        위치 : ${place.location} </p>
                    </div>`;

              let infoWindow = new kakao.maps.InfoWindow({
                content: content,
                zIndex: 1,
              });

              Marker.infoWindow = infoWindow;
              infoWindows.push(infoWindow);

              userMarker.push({
                marker: Marker,
                infoWindow: infoWindow,
              });

              // 마커 클릭 시 기존 열린 창 닫고 해당 창 열기
              kakao.maps.event.addListener(Marker, "click", function () {
                // 모든 마커의 infoWindow 닫기
                infoWindows.forEach((iw) => iw.close());

                // 클릭한 마커의 infoWindow 열기
                infoWindow.open(map, Marker);

                if (activemarker) {
                  activemarker.setImage(markerImage);
                }
                Marker.setImage(redmarkerImage);
                activemarker = Marker;

                if (window.innerWidth <= 768) {
                  map.setLevel(3);
                } else {
                  map.setLevel(2);
                }
                map.panTo(Marker.getPosition());
              });
            }
            map.panTo(Marker.getPosition());
          });
          // 지도 클릭 시 모든 마커를 파란색으로 변경
          kakao.maps.event.addListener(map, "click", function () {
            if (activemarker) {
              activemarker.setImage(markerImage);
              activemarker = null;
            }
            infoWindows.forEach((iw) => iw.close());
          });
        } else {
          alert(`[${category}] 카테고리에서 찾을 수 있는 장소가 없습니다.`);
        }
      })
      .catch((err) => {
        console.error(`[${category}] API 호출 오류`, err);
      });
  } else {
    alert("카테고리를 선택하세요.");
  }
}
