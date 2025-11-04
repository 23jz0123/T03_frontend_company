import './App.css'
import { Admin, Resource, type DataProvider, Login, useGetIdentity, useLogin, useNotify } from 'react-admin'
import { Link, useNavigate } from 'react-router-dom';
import { ProductShow } from './products'
import { Navigate } from 'react-router-dom';
import { UserList } from "./testList";
import { useState } from 'react';
import { AdvertisementShow } from './advertisements';
import { AdvertisementsList } from './advertisementsList';
import { RequirementShow } from './requirement';

const customAuthProvider = {
  async login({username, password}) {
    const request = new Request('api/auth/company/login', {
      method: 'POST',
      body: JSON.stringify({account_name : username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    let response;
    try {
      response = await fetch(request);
    } catch (error) {
      throw new Error('Network error');
    }
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
    const auth = await response.json();
    localStorage.setItem('auth_id', auth.id);
  },
  async checkError(error: { status: any }) {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_id');
      throw new Error('checkError Unauthorized');
    }
  },
  async checkAuth() {
    const publicPaths = ['/register', '/accounts']; // 認証をスキップするパス
    const currentPath = window.location.pathname;
  
    console.log('Current Path:', currentPath);
    console.log('Auth ID:', localStorage.getItem('auth_id'));
  
    if (publicPaths.some(path => currentPath.startsWith(path))) {
      console.log('Skipping auth check for:', currentPath);
      return Promise.resolve(); // 認証チェックをスキップ
    }
  
    if (!localStorage.getItem('auth_id')) {
      console.log('Auth check failed');
      throw new Error('checkAuth Unauthorized');
    }
  },
  async logout() {
    localStorage.removeItem('auth_id');
  },
  async getIdentity() {
    const id = localStorage.getItem('auth_id');
    if (!id) {
      throw new Error('getIdentity Unauthorized');
    }
    return { id: id, fullName: `User ${id}`, avatar: null };
  }
}

// カスタムログインページ
// const CustomLoginPage = () => (
//   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
//     <Login />
//     <Link to="/register" style={{ marginTop: '20px', textDecoration: 'none', color: 'blue' }}>
//       新規作成はこちら
//     </Link>
//   </div>
// );
const CustomLoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username, password });
      const id = localStorage.getItem('auth_id');
      if (id) {
        navigate(`/products/${id}/show`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      notify('ログインに失敗しました', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <label>ユーザー名</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <label style={{ marginTop: 8 }}>パスワード</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>{loading ? 'ログイン中...' : 'ログイン'}</button>
      </form>
      <Link to="/register" style={{ marginTop: '20px', textDecoration: 'none', color: 'blue' }}>
        新規作成はこちら
      </Link>
    </div>
  );
};

const customDataProvider: DataProvider = {
    getList: async (resource, params) => {
      let url = `/api/companies/1`;
      const authId = localStorage.getItem('auth_id');
  
      // リソース名に応じてエンドポイントを切り替える
      if (resource === "advertisements") {
        const year = params.filter?.year || new Date().getFullYear(); // 年号を取得（デフォルトは現在の年）
        url = `/api/companies/${authId}/advertisements`;
      } else if (resource === "products") {
        url = `/api/companies/${authId}`;
      }

      console.log('Fetching list for ${resource} from URL:', url);
    
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
      const total = response.headers.get("X-Total-Count");
      const data = await response.json();
    
      return {
        data: Array.isArray(data)
          ? data.map((item) => ({ ...item, id: item.id }))
          : [{ ...data, id: data.id }],
        total: total ? parseInt(total, 10) : Array.isArray(data) ? data.length : 1,
      };
    },
    getOne: async (resource, params) => {
        console.log('getOne called with resource:', resource, 'params:', params);
        let url;

        if (resource === "advertisements") {
          const { id } = params;
          if (!id) {
            throw new Error("ID is required for getOne operation");
          }
          url = `/api/companies/${localStorage.getItem('auth_id')}/advertisements/${id}`;
        } else {
          url = `/api/${resource}/${params.id}`;
        }

        const response = await fetch(url, {
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        return { data: data };
    },
}

const App = () => (
  <Admin dataProvider={customDataProvider} authProvider={customAuthProvider} loginPage={CustomLoginPage}> 
    <Resource name="products" show={ProductShow} list={ProductShow}/>
    <Resource name="advertisements" list={AdvertisementsList} show={AdvertisementShow} />
    <Resource name="requirements" show={RequirementShow} />
  </Admin>
);

export default App
