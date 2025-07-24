function toggleMode() {
  document.body.classList.toggle("light-mode");
}

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
    const res = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      responseEl.textContent = "✅ Message sent successfully!";
      form.reset();
    } else {
      responseEl.textContent = "❌ " + result.error;
    }
  } catch (err) {
    responseEl.textContent = "❌ Failed to send message.";
    console.error(err);
  }
});
