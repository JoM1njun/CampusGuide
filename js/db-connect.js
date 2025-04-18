let map, marker;
let userMarker = [];
let currentLocationMarker = null;
let currentinfowindows = [];
let infoWindows = []; // etc 정보창
const mobile = window.innerWidth <= 1024;

// 서버 연결 확인을 위한 부분 (없어도 됨)
window.onload = function () {
  fetch("https://campusguide-back.onrender.com/api/db-connect")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("db-status").innerHTML = "DB Connected";
      } else {
        document.getElementById("db-status").innerHTML =
          "Connect Failed" + data.message;
      }
    })
    .catch((error) => {
      document.getElementById("db-status").innerHTML =
        "서버에 접근 할 수 없음" + error;
    });
};

kakao.maps.load(function () {
  initMap(); // 지도 로딩 후 호출
});
