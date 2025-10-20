import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ account_name: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/companies/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('アカウントが正常に作成されました！');
        setFormData({ account_name: '', password: '' }); // フォームをリセット
        navigate('/company/create');
      } else {
        const errorData = await response.json();
        console.error('サーバーエラー:', errorData);
        setMessage(`エラー: ${errorData.message || '登録に失敗しました'}`);
      }
    } catch (error) {
      setMessage('ネットワークエラーが発生しました。');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>新規作成ページ</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アカウント名: </label>
          <input
            type="text"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>パスワード: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;