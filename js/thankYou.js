const SHEET_URL =
  "https://script.google.com/macros/s/AKfycby20ETOvTXxx-b3JEEaEGbD-aGhuapzDrttenpPWc7pVXggMPhWh-Aa1wyOZMVEBzEHoA/exec";

// ✅ Sana formatlash: 11-08-2025
function getFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

// ✅ Vaqt formatlash: 15:42:30
function getFormattedTime() {
  return new Date().toLocaleTimeString("uz-UZ");
}

// ✅ Kunlik cheklov funksiyasi
function shouldSendToday(key) {
  const today = getFormattedDate();
  const lastDate = localStorage.getItem(key);

  if (lastDate === today) {
    return false; // Allaqachon yuborilgan
  }

  localStorage.setItem(key, today);
  return true;
}

async function sendFormData() {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) {
    console.log("Ma'lumotlar yo‘q");
    return;
  }

  // Kunlik cheklov
  if (!shouldSendToday("DataSendDate")) {
    console.log("⏩ Bugun allaqachon yuborilgan");
    return;
  }

  const formDataObj = JSON.parse(formDataRaw);

  const date = getFormattedDate();
  const time = getFormattedTime();

  const formData = new FormData();
  formData.append("Ism", formDataObj.Ism);
  formData.append("Telefon raqam", formDataObj.TelefonRaqam);
  formData.append("Royhatdan o'tgan vaqti", `${date}-${time}`);

  try {
    const response = await fetch(SHEET_URL, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("✅ Ma'lumot yuborildi");
      localStorage.removeItem("formData");
    } else {
      throw new Error("API response was not ok");
    }
  } catch (error) {
    console.error("❌ Xatolik:", error);
    document.getElementById("errorMessage").style.display = "block";
  }
}

window.onload = sendFormData;