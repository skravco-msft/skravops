let translations = {}; // Store loaded translations

function toggleMode() {
  document.body.classList.toggle("light-mode");
}

async function loadLanguage(lang) {
  try {
    const res = await fetch(`i18n/${lang}.json`);
    translations = await res.json();

    // Replace text content for elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Update placeholders and button text
    const form = document.getElementById("contact-form");
    if (form) {
      form.name.placeholder = translations.form_name || form.name.placeholder;
      form.email.placeholder = translations.form_email || form.email.placeholder;
      form.message.placeholder = translations.form_message || form.message.placeholder;
      form.querySelector("button[type='submit']").textContent = translations.form_submit || "Send Message";
    }

    localStorage.setItem("lang", lang);
  } catch (err) {
    console.error("Failed to load language:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  const langSelect = document.getElementById("language-select");
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener("change", (e) => {
      loadLanguage(e.target.value);
    });
  }

  loadLanguage(savedLang);
});

document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const responseEl = document.getElementById("form-response");

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  };

  try {
    const res = await fetch("/api/send_email", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      responseEl.textContent = translations.form_success || "✅ Message sent successfully!";
      form.reset();
    } else {
      responseEl.textContent = "❌ " + (result.error || translations.form_error || "Failed to send message.");
    }
  } catch (err) {
    responseEl.textContent = translations.form_error || "❌ Failed to send message.";
    console.error(err);
  }
});

