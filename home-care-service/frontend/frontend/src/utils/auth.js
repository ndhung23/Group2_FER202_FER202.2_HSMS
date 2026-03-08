export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
}

export function setAuth(token, role, user = null) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}