document.addEventListener("DOMContentLoaded", () => {
  const usernameSpan = document.getElementById("username");
  const pointsSpan = document.getElementById("points");

  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

  if (!userId) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  usernameSpan.textContent = username;

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    window.location.href = "index.html";
  });

  // Fetch points from server
  fetch(`php/get_player_points.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
      pointsSpan.textContent = data.points || 0;
    })
    .catch(err => console.error("Error fetching points:", err));

  // Load challenges from DB
  fetch("php/get_challenges.php")
    .then((response) => response.json())
    .then((challenges) => {
      const list = document.getElementById("active-list");
      list.innerHTML = "";

      if (challenges.length === 0) {
        list.textContent = "No active challenges yet!";
        return;
      }

      challenges.forEach((ch) => {
        const div = document.createElement("div");
        div.classList.add("challenge");
        div.innerHTML = `
          <h3>${ch.title} (${ch.points} pts)</h3>
          <p><strong>Category:</strong> ${ch.category}</p>
          <p>${ch.description}</p>
          <input type="text" placeholder="Enter flag..." id="flag_${ch.id}">
          <button onclick="submitFlag(${ch.id}, ${ch.points})">Submit</button>
        `;
        list.appendChild(div);
      });
    })
    .catch((err) => console.error("Error loading challenges:", err));
});

// Submit flag
function submitFlag(id, pts) {
  const flag = document.getElementById(`flag_${id}`).value;
  if (!flag.trim()) return alert("Enter a flag first!");

  fetch("php/submit_flag.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `challenge_id=${id}&flag=${encodeURIComponent(flag)}`
  })
    .then((r) => r.text())
    .then((res) => {
      alert(res);
      if (res.includes("Correct")) {
        // Update local points
        let points = parseInt(localStorage.getItem("points") || "0");
        points += pts;
        localStorage.setItem("points", points);
        document.getElementById("points").textContent = points;
      }
    })
    .catch((err) => console.error("Flag submission error:", err));
}

activeList.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("submit-flag-btn")) return;

  const challengeId = e.target.dataset.id;
  const input = document.querySelector(`.flag-input[data-id='${challengeId}']`);
  const flag = input.value.trim();

  if (!flag) {
    alert("Please enter a flag.");
    return;
  }

  try {
    const res = await fetch("php/submit_flag.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, challenge_id: challengeId, flag })
    });
    const data = await res.json();
    if (data.status === "correct") {
      alert("✅ Correct flag!");
      pointsSpan.textContent = parseInt(pointsSpan.textContent) + 10; // Add points
      input.parentElement.innerHTML = "<strong>Solved ✅</strong>";
    } else if (data.status === "incorrect") {
      alert("❌ Incorrect flag. Try again!");
    } else if (data.status === "already") {
      alert(data.message);
      input.parentElement.innerHTML = "<strong>Solved ✅</strong>";
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting flag.");
  }
});
