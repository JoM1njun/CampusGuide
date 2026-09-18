const themeToggle = document.getElementById("theme-toggle");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("campus-guide-theme", isDark ? "dark" : "light");

    const icon = themeToggle.querySelector("img");

    if (icon) {
        icon.src = isDark
            ? "assets/etc/sun.svg"
            : "assets/etc/moon.svg";
        icon.alt = isDark ? "라이트모드" : "다크모드";
    }

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "라이트모드 전환" : "다크모드 전환"
    );
}

const savedTheme = localStorage.getItem("campus-guide-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
});