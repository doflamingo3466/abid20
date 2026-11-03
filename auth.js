// Customer registration and login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.onsubmit = function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const users = getUsers();
    const found = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (found) {
      sessionStorage.setItem("formeCurrentUser", JSON.stringify(found));
      window.location.href = "index.html";
    } else {
      document.getElementById("message").textContent =
        "Email or password is incorrect.";
    }
  };
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const users = getUsers();

    if (password !== confirmPassword) {
      document.getElementById("message").textContent =
        "Passwords do not match.";
      return;
    }
    if (users.some((user) => user.email === email)) {
      document.getElementById("message").textContent =
        "This email already has an account.";
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
    };
    users.push(newUser);
    localStorage.setItem("formeUsers", JSON.stringify(users));
    sessionStorage.setItem("formeCurrentUser", JSON.stringify(newUser));
    window.location.href = "index.html";
  };
}
