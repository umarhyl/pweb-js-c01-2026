const firstName = localStorage.getItem("firstName");
const greetingEl = document.getElementById("greeting");
const logoutBtn = document.getElementById("logout-btn");

//Auth Guard
if (!firstName) {
  window.location.href = "login.html";
} else {

  if (greetingEl) {
    greetingEl.textContent = `Halo, ${firstName}`;
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("cart");
    window.location.href = "login.html";
  });
}
