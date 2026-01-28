import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import { Link, useNavigate } from "react-router-dom";

export const CustomLoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Attempting login with", { username, password });
      await login({ username, password });
      const id = sessionStorage.getItem("auth_id");
      if (id) {
        navigate(`/products/${id}/show`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      notify("ユーザー名かパスワードが間違っています", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <img src="/path/to/logo.png" alt="Logo" className="login-logo" />

          <h1 className="login-title">Bloom Career</h1>
          <p className="login-subtitle">アカウントにサインインしてください。</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <i className="bx bxs-user login-input-icon" />
              <input
                className="login-input"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="login-input-group">
              <i className="bx bxs-lock-alt login-input-icon" />
              <input
                className="login-input"
                placeholder="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "ログイン中…" : "ログイン"}
            </button>
          </form>

          <p className="login-register-text">
            アカウントをお持ちでない方は{" "}
            <Link to="/register" className="register-link">
              新規作成はこちら
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
