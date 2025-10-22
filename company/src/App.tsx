import './App.css'
import { Admin, Resource, type DataProvider, Login, useGetIdentity } from 'react-admin'
import { Link } from 'react-router-dom';
import { ProductShow } from './products'
import { Navigate } from 'react-router-dom';
import { UserList } from "./testList";

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
const CustomLoginPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
    <Login />
    <Link to="/register" style={{ marginTop: '20px', textDecoration: 'none', color: 'blue' }}>
      新規作成はこちら
    </Link>
  </div>
);

const customDataProvider: DataProvider = {
    getList: async (resource, params) => {
      let url = `/api/companies/1`;
  
      // リソース名に応じてエンドポイントを切り替える
      if (resource === "pendings") {
        url = "/api/admin/advertisements/pendings";
      } else if (resource === "advertisements") {
        const year = params.filter?.year || new Date().getFullYear(); // 年号を取得（デフォルトは現在の年）
        url = `/api/admin/advertisements?year=${year}`;
      }
    
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
        const url = `/api/${resource}/${params.id}`;

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

const Dashboard = () => {
    console.log("Dashboard redirected to /products/show");
    const { identity, isLoading: isIdentityLoading } = useGetIdentity();
    if (isIdentityLoading) {
      return <div>Loading...</div>; // ローディング中の表示
  }

  if (!identity || !identity.id) {
      return <div>ログイン情報が見つかりません</div>; // ログイン情報がない場合の表示
  }
    return <Navigate to={`/products/${identity.id}/show`} replace />;
};

const App = () => (
  <Admin dataProvider={customDataProvider} authProvider={customAuthProvider} loginPage={CustomLoginPage} dashboard={Dashboard}>
    <Resource name="products" show={ProductShow}/>
  </Admin>
);

export default App
