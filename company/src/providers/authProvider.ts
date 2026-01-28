import type { AuthProvider } from "react-admin";

export const customAuthProvider: AuthProvider = {
  async login({ username, password }) {
    const request = new Request("api/auth/company/login", {
      method: "POST",
      body: JSON.stringify({ account_name: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    let response;
    try {
      response = await fetch(request);
    } catch {
      throw new Error("Network error");
    }
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
    const auth = await response.json();
    sessionStorage.setItem("auth_id", auth.id);
  },
  async checkError(error: { status?: number }) {
    const status = error.status;
    if (status === 401 || status === 403) {
      sessionStorage.removeItem("auth_id");
      throw new Error("checkError Unauthorized");
    }
  },
  async checkAuth() {
    const publicPaths = ["/register", "/accounts"]; // 認証をスキップするパス
    const currentPath = window.location.pathname;

    console.log("Current Path:", currentPath);
    console.log("Auth ID:", sessionStorage.getItem("auth_id"));

    if (publicPaths.some((path) => currentPath.startsWith(path))) {
      console.log("Skipping auth check for:", currentPath);
      return Promise.resolve(); // 認証チェックをスキップ
    }

    if (!sessionStorage.getItem("auth_id")) {
      console.log("Auth check failed");
      throw new Error("checkAuth Unauthorized");
    }
  },
  async logout() {
    sessionStorage.removeItem("auth_id");
    sessionStorage.removeItem("latestAdvertisementId");
    return Promise.resolve(); // logout must return a Promise<string | false | void>
  },
  async getIdentity() {
    const id = sessionStorage.getItem("auth_id");
    if (!id) {
      throw new Error("getIdentity Unauthorized");
    }
    // avatar must be string or undefined, not null
    return { id: id, fullName: `User ${id}` };
  },
};
