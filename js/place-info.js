let isInfoVisible = false;

// place button 클릭 시 정보 표시
function getLocation(place) {
  var redmarkersrc = "assest/marker/red-marker.svg";
  var imageSize = new kakao.maps.Size(75, 30); // 마커이미지의 크기
  var redmarkerImage = new kakao.maps.MarkerImage(redmarkersrc, imageSize);

  // 기존 마커와 infoWindow 제거
  userMarker.forEach((obj) => {
    if (obj.infoWindow) {
      obj.infoWindow.close();
    }
    if (obj.marker) {
      obj.marker.setMap(null); // 마커를 지도에서 제거
    }
  });
  userMarker = [];

  infoWindows.forEach((iw) => iw.close());
  infoWindows = [];

  console.log(place);
  
  if (place) {
    fetch(
      `https://campusguide-back.onrender.com/api/place-info?alias=` + encodeURIComponent(place)
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Received : ", data);
        const places = data.places;
        console.log("Places : ", places);

        if (data.error) {
          alert(data.error);
        } else {
          if (places && places.length > 0) {
            places.forEach((place, index) => {
              document.getElementById("place-name").textContent = `${place.name} ${place.alias}`;
              document.getElementById("floor-info").textContent = `${place.floor}`;
              document.getElementById("major-info").textContent = `${place.major}`;

              // === 이미지 표시 ===
              const aliasLower = place.alias.toLowerCase(); // 예: P → p
              const imagePath = `assest/place/${aliasLower}.jpg`;
              const img = document.getElementById("place-image");
              img.src = imagePath;
              img.style.display = "block";
              img.onerror = () => {
                img.style.display = "none"; // 이미지 없을 경우 숨김
              };

              document.getElementById("place-info").style.display = "block";
              document.getElementById("place-buttons").style.display = "none";

              let placeLocation = new kakao.maps.LatLng(
                place.latitude,
                place.longitude
              );

              let marker = new kakao.maps.Marker({
                position: placeLocation,
                map: map,
                image: redmarkerImage,
              });

              map.panTo(placeLocation);

              userMarker.push({
                marker: marker,
              });
            });
            isInfoVisible = true;
            showPlaceButtons();
          }
        }
      })
      .catch((err) => {
        console.error(`[${place}] API 호출 오류`, err);
      });
  }
}
