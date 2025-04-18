function normalizeNewlines(text) {
  if (!text || text.trim() === "" || text === "(null)") {
    return "정보 없음";
  }

  // 문자열에 포함된 \\n → 실제 줄바꿈 문자로
  let fixed = text.replace(/\\n/g, "\n");

  // 줄바꿈이 여러 번 있을 때는 하나로 정리
  fixed = fixed.replace(/\n{2,}/g, "\n");

  return fixed.trim(); // 혹시 앞뒤 공백이 있을 경우 제거
}

// 기존 코드에 적용
document.getElementById("floor-info").innerText = normalizeNewlines(place.floor);
document.getElementById("major-info").innerText = normalizeNewlines(place.major);
