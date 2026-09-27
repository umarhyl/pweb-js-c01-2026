const form = document.querySelector("#login-form");
const button = document.querySelector("#login-button");
const errorMessage = document.querySelector("#error-message");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorMessage.textContent = "";
  button.disabled = true;
  button.textContent = "Memverifikasi...";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch("https://dummyjson.com/users?limit=0");

    if (!response.ok) {
      throw new Error("API tidak merespons dengan baik.");
    }

    const data = await response.json();
    let selectedUser = null;

    data.users.forEach((user) => {
      if (user.username === username && user.password === password) {
        selectedUser = user;
      }
    });

    if (!selectedUser) {
      throw new Error("Username atau password salah.");
    }

    localStorage.setItem("firstName", selectedUser.firstName);
    window.location.href = "index.html";
  } catch (error) {
    if (error.message === "Username atau password salah.") {
      errorMessage.textContent = error.message;
    } else {
      errorMessage.textContent = "Tidak dapat terhubung ke server. Silakan coba lagi.";
    }

    button.disabled = false;
    button.textContent = "Masuk";
  }
});