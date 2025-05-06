let activemarker = null;

function searchLocation() {
  let input = document.getElementById("searchInput").value;

  if (input) {
    let url =
      "https://campusguide-back.onrender.com/api/db-status?query=" + encodeURIComponent(input);
    console.log("URL : ", url);

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

            const searchMarker = new kakao.maps.Marker({
              // 새로운 마커 추가
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
                console.log("Alias : ", place.alias);
              });
              userMarker.push({marker: searchMarker, infoWindows: null});
            } else {
              let content = `
                    <div class="info-window">
                        <h4 style="
                        font-size: ${mobile ? "12px" : "15px"};
                        ">${place.name}</h4>
                        <p style="
                        font-size: ${mobile ? "10px" : "13px"};
                        ">${place.etc} </p>
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
          // 지도 클릭 시 모든 마커를 파란색으로 변경
          kakao.maps.event.addListener(map, "click", function () {
            if (activemarker && activemarker !== searchMarker) {
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

// 🚍 버스 정류장 시간표 불러오기 함수
function fetchBusTimetable(stopId, marker, location, placeInfo) {
  console.log("Stop : ", stopId);
  fetch(`https://campusguide-back.onrender.com/api/bus-time?station=${stopId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Time : ", data.timetable);

      if (activemarker) {
        activemarker.setImage(markerImage);
      }
      if (redmarkerImage) {
        marker.setImage(redmarkerImage);
      }
      activemarker = marker;

      userMarker.forEach((obj) => {
        if (obj.infoWindow) {
          obj.infoWindow.close();
        }
        if (obj.marker && obj.marker !== marker) {
          obj.marker.setMap(null);
          return false;
        }
        return true;
      });

      infoWindows.forEach((iw) => iw.close());
      infoWindows = [];

      if (Array.isArray(data.timetable) && data.timetable.length > 0) {
        const container = document.createElement("div");
        container.className = "info-window";
        // container.style.width = mobile ? "150px" : "250px";
        // container.style.height = mobile ? "120px" : "150px";
        // container.style.padding = "10px";
        // container.style.fontSize = mobile ? "11px" : "14px";
        // container.style.backgroundColor = "white";
        // container.style.borderRadius = "10px";
        // container.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";

        const title = document.createElement("h4");
        title.textContent = `${placeInfo.name} ${placeInfo.alias}`;

        const label = document.createElement("strong");
        label.textContent = "🕒 612번 시간표 (배재대 > 동신과학고)";
        title.style.fontSize = mobile ? "11px" : "17px";

        const timetableContainer = document.createElement("div");
        timetableContainer.className = "timetable-container";

        container.appendChild(title);
        container.appendChild(label);
        container.appendChild(timetableContainer);

        let infoWindow = new kakao.maps.InfoWindow({
          content: container,
          position: location,
          zIndex: 3,
        });

        infoWindows.forEach((iw) => iw.close());
        infoWindows = [infoWindow];

        infoWindow.open(map, marker);

        displayTimetable(data.timetable, timetableContainer); // 시간표 UI 표시
      } else {
        console.error("시간표 데이터를 불러오지 못했습니다.");
      }
    })
    .catch((error) => console.error("API 요청 오류:", error));
}

function displayTimetable(timetable, container) {
  if (!container) {
    console.warn("❌ timetable-container를 찾을 수 없습니다.");
    return;
  }

  container.innerHTML = "";

  const timetableWrapper = document.createElement("div");
  timetableWrapper.className = "timetable";
  timetableWrapper.style.display = "flex";
  timetableWrapper.style.flexDirection = "column";
  timetableWrapper.style.gap = "6px";

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let closestDiff = Infinity;
  let closestElement = null;

  timetable.forEach((entry) => {
    const [hour, minute] = entry.departure_time.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;

    const timeElement = document.createElement("div");
    timeElement.className = "timetable-entry";
    timeElement.textContent = entry.departure_time;

    // 현재 시간보다 미래인 시간 중 가장 가까운 것 찾기
    if (totalMinutes >= nowMinutes && totalMinutes - nowMinutes < closestDiff) {
      closestDiff = totalMinutes - nowMinutes;
      closestElement = timeElement;
    }

    timetableWrapper.appendChild(timeElement);
  });

  container.appendChild(timetableWrapper);

  // 강조 + 스크롤
  if (closestElement) {
    closestElement.classList.add("highlight");
    setTimeout(() => {
      closestElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 200); // infoWindow 렌더링 이후 실행되도록
  }
}
