const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const setAuth = (token, role) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

