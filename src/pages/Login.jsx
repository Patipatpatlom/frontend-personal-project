const handleLogin = async () => {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    // เก็บ token
    localStorage.setItem("token", data.token);

    // 🔥 เช็ค role
    if (data.user.role === "user") {
      navigate("/select-datetime");
    } else if (data.user.role === "admin") {
      navigate("/admin");
    }
  }
};