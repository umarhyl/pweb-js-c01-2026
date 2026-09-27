const form = document.querySelector("#login-form");
const button = document.querySelector("#login-button");
const errorMessage = document.querySelector("#error-message");
const findUser = (users, username, password) =>
  users.find((user) => user.username === username && user.password === password);

if (new URLSearchParams(window.location.search).has("test")) {
  console.assert(findUser([{ username: "demo", password: "123" }], "demo", "123"));
  console.assert(!findUser([{ username: "demo", password: "123" }], "demo", "salah"));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  button.disabled = true;
  button.textContent = "Memverifikasi...";

  const data = new FormData(form);
  const username = data.get("username").trim();
  const password = data.get("password");

  try {
    const response = await fetch("https://dummyjson.com/users?limit=0");
    if (!response.ok) throw new Error("API tidak merespons dengan baik.");

    const { users } = await response.json();
    const user = findUser(users, username, password);
    if (!user) throw new Error("Username atau password salah.");

    localStorage.setItem("firstName", user.firstName);
    window.location.href = "index.html";
  } catch (error) {
    errorMessage.textContent = error.message === "Username atau password salah."
      ? error.message
      : "Tidak dapat terhubung ke server. Silakan coba lagi.";
  } finally {
    button.disabled = false;
    button.textContent = "Masuk";
  }
});
