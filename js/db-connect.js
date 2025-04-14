let map, marker;
let userMarker = [];
let currentLocationMarker = null;
let currentinfowindows = [];
let infoWindows = []; // etc 정보창
let locationFound = false;
const mobile = window.innerWidth <= 1024;

fetch("http://localhost:3000/config")
  .then((response) => response.json())
  .then((config) => {
    console.log(config);
    const apikey = config.apikey;
    console.log("API key : ", apikey);

    const script = document.createElement("script");
    script.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false`;
    script.onload = function () {
      // Kakao Maps API 로드가 완료된 후에 initMap을 호출
      kakao.maps.load(initMap);
    };
    // 오류 처리: script 로드 실패 시
    script.onerror = function () {
      console.error("Kakao Maps SDK 로딩 실패");
    };
    document.head.appendChild(script);
  })
  .catch((error) => {
    console.error("Error loading Kakao API key:", error);
  });

// 서버 연결 확인을 위한 부분 (없어도 됨)
window.onload = function () {
  fetch("http://localhost:3000/api/db-connect")
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
