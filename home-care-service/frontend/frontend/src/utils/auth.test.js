import { getRole, getToken, getUser, logout, setAuth } from "./auth";

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("setAuth saves token, role and user to localStorage", () => {
    const user = { id: "u1", fullName: "Test User" };
    setAuth("token-123", "CUSTOMER", user);

    expect(getToken()).toBe("token-123");
    expect(getRole()).toBe("CUSTOMER");
    expect(getUser()).toEqual(user);
  });

  test("getUser returns null when user json is invalid", () => {
    localStorage.setItem("user", "{invalid-json");
    expect(getUser()).toBeNull();
  });

  test("logout removes all auth data", () => {
    setAuth("token-123", "HELPER", { id: "h1" });
    logout();

    expect(getToken()).toBeNull();
    expect(getRole()).toBeNull();
    expect(getUser()).toBeNull();
  });
});
