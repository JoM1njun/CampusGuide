// 🚍 버스 정류장 시간표 불러오기 함수
function fetchBusTimetable(stopId, marker, location, placeInfo) {
  fetch(`https://campusguide-back.onrender.com/api/bus-time?station=${stopId}`)
    .then((response) => response.json())
    .then((data) => {
      if (activemarker) {
        activemarker.setImage(markerImage);
      }
      marker.setImage(redmarkerImage);
      activemarker = marker;
      
      userMarker.forEach((obj) => {
        if (obj.infoWindow) {
          obj.infoWindow.close();
        }
        if (obj.marker && obj.marker !== marker) {
          obj.marker.setMap(null);
        }
      });

      infoWindows.forEach((iw) => iw.close());
      infoWindows = [];

      if (Array.isArray(data.timetable) && data.timetable.length > 0) {
        const container = document.createElement("div");
        container.className = "info-window";

        const title = document.createElement("h4");
        title.textContent = `${placeInfo.name} ${placeInfo.alias}`;

        const label = document.createElement("strong");
        label.textContent = "🕒 612번 시간표 (배재대 > 동신과학고)";

        const timetableContainer = document.createElement("div");
        timetableContainer.className = "timetable-container";

        container.appendChild(title);
        container.appendChild(label);
        container.appendChild(timetableContainer);

        let infoWindow = new kakao.maps.InfoWindow({
          content: container,
          // position: marker.getPosition(),
          zIndex: 3,
        });

        // const now = new Date();
        // const nowMinutes = now.getHours() * 60 + now.getMinutes();

        // let highlightTime = null;
        // let closestDiff = Infinity;

        // data.timetable.forEach((t) => {
        //   const [h, m] = t.departure_time.split(":").map(Number);
        //   const totalMinutes = h * 60 + m;
        //   const diff = totalMinutes - nowMinutes;

        //   if (diff >= 0 && diff < closestDiff) {
        //     closestDiff = diff;
        //     highlightTime = t.departure_time;
        //   }
        // });

        // const timetableHTML = data.timetable
        //   .map((t) => {
        //     const isHighlight = t.departure_time === highlightTime;
        //     return `<div class="timetable-entry${isHighlight ? " highlight" : ""}" ${
        //       isHighlight ? 'id="highlight-time"' : ""
        //     }>${t.departure_time}</div>`;
        //   })
        //   .join("");

        // const content = `
        // <div class="info-window">
        // <h4 style="font-size: ${mobile ? "11px" : "17px"};">${placeInfo.name} ${placeInfo.alias}</h4>
        // <strong>🕒 612번 시간표 (배재대 > 동신과학고)</strong>
        // <div class="timetable-container" style="display: flex; flex-direction: column; gap: 6px;">${timetableHTML}
        // </div>
        // </div>
        // `;

        // const infoWindow = new kakao.maps.InfoWindow({
        //   content: content,
        //   position: location,
        //   zIndex: 3,
        // });

        infoWindows.forEach((iw) => iw.close());
        infoWindows = [infoWindow];
        
        infoWindow.open(map, marker);

        displayTimetable(data.timetable, timetableContainer); // 시간표 UI 표시
        infoWindow.setContent(container); 
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
