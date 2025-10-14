document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch("php/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.status === "success") {
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("username", data.username);
            window.location.href = "player_challenges.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Error connecting to server.");
        console.error(error);
    }
});
