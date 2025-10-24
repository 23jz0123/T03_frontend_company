// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Admin, CustomRoutes } from "react-admin";
import { Resource, type DataProvider } from "react-admin";
import { companyCreate } from './companyCreate'
import { Account } from './accountCreate'
import './App.css'
import { UserList } from "./testList";
import { Navigate, Route } from 'react-router-dom';

const registerDataProvider: DataProvider = { 
  create: async (resource, { data }) => {
      try {
        const response = await fetch(`/api/admin/companies/accounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          const errorText = await response.text(); // サーバーからのエラーメッセージを取得
          console.error("CREATE Error Response:", errorText);
    
          throw new Error();
        }
    
        const responseData = await response.json();
        console.log("CREATE Success Response:", responseData);
    
        return { data: responseData };
      } catch (error) {
        console.error("CREATE Request Failed:", error);
        throw error; // エラーを再スローして呼び出し元で処理
      }
    },
}
//const Dashboard = () => <Navigate to="/register/account/create" replace />;

const Register = () => (
  console.log("Register component rendered"),
  console.log("Current URL:", window.location.href),
  <Admin
    basename="/register"
    dataProvider={registerDataProvider}
    // Dashboard を渡さず、カスタムルートでルートアクセスを作成ページへリダイレクト
    
  >
    <Resource name="account" create={Account}/>
    <Resource name="company" create={companyCreate}/>
    <CustomRoutes>
      <Route path="/" element={<Navigate to="/register/account/create" replace />} />
    </CustomRoutes>
  </Admin>
);

export default Register;

// const Register = () => {
//   const [formData, setFormData] = useState({ account_name: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/admin/companies/accounts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setMessage('アカウントが正常に作成されました！');
//         setFormData({ account_name: '', password: '' }); // フォームをリセット
//         navigate('/company/create');
//       } else {
//         const errorData = await response.json();
//         console.error('サーバーエラー:', errorData);
//         setMessage(`エラー: ${errorData.message || '登録に失敗しました'}`);
//       }
//     } catch (error) {
//       setMessage('ネットワークエラーが発生しました。');
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px' }}>
//       <h1>新規作成ページ</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>アカウント名: </label>
//           <input
//             type="text"
//             name="account_name"
//             value={formData.account_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>パスワード: </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">登録</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Register;
