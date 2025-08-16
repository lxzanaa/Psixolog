document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const registerBtns = document.querySelectorAll(".registerBtn"); // Hamma buttonlar tanlanadi
  const registrationModal = document.getElementById("registrationModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOverlay = document.querySelector(".homeModalOverlay");
  const registrationForm = document.getElementById("registrationForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const submitBtn = document.getElementById("submitBtn");
  const selectedCountry = document.getElementById("selectedCountry");
  const selectedCountryCode = document.getElementById("selectedCountryCode");
  const countryDropdown = document.getElementById("countryDropdown");
  const dropdownIcon = document.getElementById("dropdownIcon");

  // Countries data
  const countries = [
    { name: "Uzbekistan", code: "+998" },
    { name: "AQSH", code: "+1" },
    { name: "Janubiy Koreya", code: "+82" },
    { name: "Qirg’iziston", code: "+996" },
    { name: "Qozog’iston", code: "+7" },
    { name: "Tojikiston", code: "+992" },
    { name: "Turkmaniston", code: "+993" },
    { name: "Polsha", code: "+48" },
  ];

  // Phone formats for different country codes
  const phoneFormats = {
    "+998": {
      // Uzbekistan
      placeholder: "88 888 88 88",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(5, digits.length));
        if (digits.length > 5)
          formatted += " " + digits.slice(5, Math.min(7, digits.length));
        if (digits.length > 7)
          formatted += " " + digits.slice(7, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{3} \d{2} \d{2}$/.test(value);
      },
    },
    "+1": {
      // USA
      placeholder: "555 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{4}$/.test(value);
      },
    },
    "+82": {
      // South Korea
      placeholder: "10 1234 5678",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{4} \d{4}$/.test(value);
      },
    },
    "+996": {
      // Kyrgyzstan
      placeholder: "555 123 456",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{3}$/.test(value);
      },
    },
    "+7": {
      // Kazakhstan
      placeholder: "700 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{4}$/.test(value);
      },
    },
    "+992": {
      // Tajikistan
      placeholder: "55 555 5555",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(5, digits.length));
        if (digits.length > 5)
          formatted += " " + digits.slice(5, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{3} \d{4}$/.test(value);
      },
    },
    "+993": {
      // Turkmenistan
      placeholder: "6 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(1, digits.length));
        if (digits.length > 1)
          formatted += " " + digits.slice(1, Math.min(4, digits.length));
        if (digits.length > 4)
          formatted += " " + digits.slice(4, Math.min(8, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{1} \d{3} \d{4}$/.test(value);
      },
    },
    "+48": {
      // Poland
      placeholder: "123 456 789",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{3}$/.test(value);
      },
    },
  };

  // Current selected country code
  let currentCountryCode = "+998";

  // Populate country dropdown
  function populateCountryDropdown() {
    countryDropdown.innerHTML = "";
    countries.forEach((country) => {
      const option = document.createElement("div");
      option.className = "country-option";
      if (country.code === currentCountryCode) {
        option.classList.add("selected");
      }

      option.innerHTML = `
        <span>${country.name}</span>
        <span class="country-code">${country.code}</span>
        ${
          country.code === currentCountryCode
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            : ""
        }
      `;

      option.addEventListener("click", function () {
        selectCountry(country);
      });

      countryDropdown.appendChild(option);
    });
  }

  // Format phone number based on country code
  function formatPhoneNumber(value, countryCode) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Get the format for the selected country or default to Uzbekistan
    const format = phoneFormats[countryCode] || phoneFormats["+998"];

    return format.format(digits);
  }

  // Validate phone number based on country code
  function validatePhoneNumber(value, countryCode) {
    const format = phoneFormats[countryCode] || phoneFormats["+998"];
    return format.validate(value);
  }

  // Select a country
  function selectCountry(country) {
    currentCountryCode = country.code;
    selectedCountryCode.textContent = country.code;
    countryDropdown.style.display = "none";

    // Update phone input placeholder
    const format = phoneFormats[country.code] || phoneFormats["+998"];
    phoneInput.placeholder = format.placeholder;

    // Clear phone input when country changes
    phoneInput.value = "";
    phoneError.style.display = "none";

    // Update dropdown icon
    dropdownIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
  }

  // Toggle country dropdown
  selectedCountry.addEventListener("click", function () {
    const isOpen = countryDropdown.style.display === "block";

    if (isOpen) {
      countryDropdown.style.display = "none";
      dropdownIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    } else {
      populateCountryDropdown();
      countryDropdown.style.display = "block";
      dropdownIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !selectedCountry.contains(event.target) &&
      !countryDropdown.contains(event.target)
    ) {
      countryDropdown.style.display = "none";
      dropdownIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
  });

  // Phone input formatting
  phoneInput.addEventListener("input", function (e) {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue, currentCountryCode);
    phoneInput.value = formatted;
    phoneError.style.display = "none";
  });

  // Name input validation
  nameInput.addEventListener("input", function () {
    nameError.style.display = "none";
  });

  // Open modal for all register buttons
  registerBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      registrationModal.style.display = "block";
      document.body.style.overflowY = "hidden";
    });
  });

  // Close modal
  function closeModal() {
    registrationModal.style.display = "none";
    document.body.style.overflowY = "scroll";
  }

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Form submission
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!nameInput.value.trim()) {
      nameError.style.display = "block";
      phoneError.style.display = "none";
      return;
    }

    nameError.style.display = "none";

    if (!validatePhoneNumber(phoneInput.value, currentCountryCode)) {
      phoneError.style.display = "block";
      return;
    }

    phoneError.style.display = "none";
    submitBtn.textContent = "YUBORILMOQDA...";
    submitBtn.disabled = true;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("uz-UZ");
    const formattedTime = now.toLocaleTimeString("uz-UZ");

    // Create form data object
    const formData = {
      Ism: nameInput.value,
      TelefonRaqam: `${currentCountryCode} ${phoneInput.value}`,
      SanaSoat: `${formattedDate} - ${formattedTime}`,
    };

    // Save to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));

    // Redirect to thankYou.html
    window.location.href = "/thankYou.html";

    // Reset form
    submitBtn.textContent = "DAVOM ETISH";
    submitBtn.disabled = false;
    nameInput.value = "";
    phoneInput.value = "";
    closeModal();
  });
});

function startTimer(duration, display) {
  let timer = duration,
    minutes,
    seconds;

  const interval = setInterval(() => {
    minutes = Math.floor(timer / 60);
    seconds = timer % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(interval);
      location.reload(); // sahifani yangilaydi
    }
  }, 1000);
}

const elements = document.querySelectorAll(".date__timer");
const duration = 2 * 60; // 2 daqiqa

elements.forEach((el) => {
  startTimer(duration, el);
});
