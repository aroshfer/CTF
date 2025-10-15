<<<<<<< HEAD
async function handleAuth(buttonId, action) {
  const btn = document.getElementById(buttonId);
  const msg = document.getElementById("msg");

  btn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      msg.style.color = "orange";
      msg.textContent = "⚠️ Please fill in both fields!";
      return;
    }

    try {
      const response = await fetch(`php/${action}.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.status === "success") {
        msg.style.color = "#00ff88";
        msg.textContent = action === "login" ? "✅ Logged in successfully!" : "✅ Registered successfully!";
        if (action === "login") {
          localStorage.setItem("user_id", data.user_id);
          setTimeout(() => window.location.href = "player_dashboard.html", 1000);
        } else {
          setTimeout(() => window.location.href = "index.html", 1500);
        }
      } else {
        msg.style.color = "red";
        msg.textContent = "❌ " + data.message;
      }
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "❌ Server error. Try again later.";
      console.error(error);
    }
  });
}
=======
async function handleAuth(buttonId, action) {
  const btn = document.getElementById(buttonId);
  const msg = document.getElementById("msg");

  btn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      msg.style.color = "orange";
      msg.textContent = "⚠️ Please fill in both fields!";
      return;
    }

    try {
      const response = await fetch(`php/${action}.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.status === "success") {
        msg.style.color = "#00ff88";
        msg.textContent = action === "login" ? "✅ Logged in successfully!" : "✅ Registered successfully!";
        if (action === "login") {
          localStorage.setItem("user_id", data.user_id);
          setTimeout(() => window.location.href = "player_dashboard.html", 1000);
        } else {
          setTimeout(() => window.location.href = "index.html", 1500);
        }
      } else {
        msg.style.color = "red";
        msg.textContent = "❌ " + data.message;
      }
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "❌ Server error. Try again later.";
      console.error(error);
    }
  });
}
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
