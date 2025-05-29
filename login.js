document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (email === "" || password === "") {
      alert("Por favor completa ambos campos.");
      return;
    }


    window.location.href = "index.html";
  });
});
