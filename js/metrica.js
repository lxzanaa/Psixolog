const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxKnqArOiC2q1BdWL0bU1SssTpjO9YbaUgFPzoXE5lN1FIM63pjlW_Y4nsCo3jjtBfwZA/exec";

// Sana va vaqtni olish
function getFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`; // 11-08-2025
}

function getFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString("uz-UZ"); // 15:42:30
}

// Ma'lumot yuborish
function sendData(sheetName) {
  const date = getFormattedDate();
  const time = getFormattedTime();

  const formData = new FormData();
  formData.append("Kirish Sanasi", date);
  formData.append("Kirish vaqti", time);
  formData.append("Page", "A Site");
  formData.append("sheetName", sheetName);

  return fetch(SHEET_URL, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(`✅ ${sheetName} ma'lumot yuborildi:`, data);
    })
    .catch((err) => {
      console.error("❌ Xatolik:", err);
    });
}

// ✅ Faqat bir marta kuniga ishlaydigan funksiya
function shouldSendToday(key) {
  const today = getFormattedDate();
  const lastDate = localStorage.getItem(key);

  if (lastDate === today) {
    return false; // Allaqachon yuborilgan
  }

  localStorage.setItem(key, today);
  return true; // Yuborish mumkin
}

// Sahifa yuklanganda "Visit" yuborish
window.addEventListener("load", () => {
  if (shouldSendToday("visitSent")) {
    sendData("Visit");
  } else {
    console.log("⏩ Bugun 'Visit' ma'lumot allaqachon yuborilgan");
  }
});

// Tugma bosilganda "Button pressed" yuborish
const registerBtns = document.querySelectorAll(".registerBtn");
registerBtns.forEach((item) => {
  item.addEventListener("click", function () {
    if (shouldSendToday("buttonSent")) {
      sendData("Button pressed");
    } else {
      console.log("⏩ Bugun 'Button pressed' ma'lumot allaqachon yuborilgan");
    }
  });
});
