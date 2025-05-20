let activemarker = null;

function searchLocation() {
  let input = document.getElementById("searchInput").value;

  if (input) {
    let url =
      "https://campusguide-back.onrender.com/api/db-status?query=" + encodeURIComponent(input);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const places = data.places;
        console.log("Data : ", data);

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

        infoWindows.forEach((iw) => iw.close());
        infoWindows = [];

        if (window.innerWidth <= 768) {
          map.setLevel(4);
        } else {
          map.setLevel(3);
        }

        if (places && places.length > 0) {
          // if (data && data.latitude && data.longitude) {
          places.forEach((place) => {
            let placeLocation = new kakao.maps.LatLng(
              place.latitude,
              place.longitude
            );

            let isBusstop =
              place.alias === "BUS" || place.name === "버스정류장";
            
            let category =
              place.alias === "Cafe" || place.alias === "프린터" || place.alias === "편의점" || place.alias === "ATM" ||
              place.type === "카페" || place.type === "프린터" || place.type === "편의점" || place.type === "ATM";

            let searchMarker = new kakao.maps.Marker({
              // 새로운 마커 추가
              position: placeLocation,
              map: map,
              image: markerImage,
              clickable: true,
              zIndex: 1,
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
              userMarker.push({marker: searchMarker, infoWindow: null});
            } else if(category) {
              let content = `
                    <div class="info-window">
                        <h4 style="
                        font-size: ${mobile ? "12px" : "14px"};
                        ">${place.name}</h4>
                        <p style="
                        font-size: ${mobile ? "10px" : "12px"};
                        ">
                        운영시간 : ${place.hours} <br>
                        전화번호 : ${place.phone ? `<a href="tel:${place.phone.replace(/-/g, " ")}">
                        ${place.phone}</a>` : "정보 없음" }<br>
                        위치 : ${place.location} </p>
                    </div>`;
            } else {
              let content = `
                    <div class="info-window">
                        <h4 style="
                        font-size: ${mobile ? "12px" : "14px"};
                        ">${place.name}</h4>
                        <p style="
                        font-size: ${mobile ? "10px" : "12px"};
                        ">${place.etc}</p>
                    </div>`;
              // 마커 클릭 시 정보 창 띄움
              let infoWindow = new kakao.maps.InfoWindow({
                content: content, // 마커 클릭 시 표시할 내용
                zIndex: 1, // zIndex로 창의 순서를 설정
              });

              infoWindows.push(infoWindow);

              userMarker.push({
                marker: searchMarker,
                infoWindow: infoWindow,
              });

              kakao.maps.event.addListener(searchMarker, "click", function () {
                infoWindows.forEach((iw) => iw.close());
                infoWindow.open(map, searchMarker);
                
                if (activemarker) {
                  activemarker.setImage(markerImage);
                }
                // if (redmarkerImage) {
                //   marker.setImage(redmarkerImage);
                // }
                // activemarker = marker;
                searchMarker.setImage(redmarkerImage); // 마커 클릭 시 빨간색으로 변경
                activemarker = searchMarker;

                if (window.innerWidth <= 768) {
                  map.setLevel(3);
                } else {
                  map.setLevel(2);
                }
                map.panTo(placeLocation); // 지도 중심을 검색 장소로 이동
              });
            }
            map.panTo(placeLocation);
          });
          //지도 클릭 시 모든 마커를 파란색으로 변경
          kakao.maps.event.addListener(map, "click", function () {
            if (activemarker) {
              activemarker.setImage(markerImage);
              activemarker = null;
            }
            infoWindows.forEach((iw) => iw.close());
          });
        } else {
          alert("장소를 찾을 수 없습니다.");
        }
      })
      .catch((err) => {
        console.error("API 호출 오류", err);
      });
  } else {
    alert("장소를 입력하세요.");
  }
}

// 엔터키 입력 시 검색
function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchLocation();
  }
}
