// Handle login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch("php/login.php", { method: "POST", body: formData })
    .then(res => res.text())
    .then(data => {
      if (data === "success") {
        window.location.href = "player_dashboard.html";
      } else {
        alert("Invalid username or password");
      }
    });
  });
}

// Handle signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch("php/register.php", { method: "POST", body: formData })
    .then(res => res.text())
    .then(data => {
      if (data === "success") {
        alert("Account created successfully!");
        window.location.href = "index.html";
      } else {
        alert("Error creating account. Try again.");
      }
    });
  });
}
