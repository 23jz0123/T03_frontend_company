import './App.css'
import { Admin, Resource, type DataProvider, Login, useGetIdentity, useLogin, useNotify } from 'react-admin'
import { Link, useNavigate } from 'react-router-dom';
import { ProductShow } from './products';
import { useState } from 'react';
import { AdvertisementShow } from './advertisements';
import { AdvertisementsList } from './AdvertisementsList';
import { RequirementShow } from './requirement';
import { AdvertisementCreate } from './advertisementCreate';
import { RequirementCreate } from './RequirementCreate';
import { AdvertisementEdit } from './AdvertisementEdit';

const logDP = (...args: any[]) => console.debug("[DP]", ...args);

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
      const companyId = authId;
  
      // リソース名に応じてエンドポイントを切り替える
      if (resource === "advertisements") {
        const year = params.filter?.year || new Date().getFullYear(); // 年号を取得（デフォルトは現在の年）
        url = `/api/companies/${authId}/advertisements`;
      } else if (resource === "products") {
        url = `/api/companies/${authId}`;
      } else if (resource === "tags") {
        url = `/api/list/tags`;
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

      if (resource === "advertisements" && Array.isArray(data) && companyId) {
        data.forEach((adv: any) => {
          sessionStorage.setItem(`advCompany:${adv.id}`, String(companyId));
          logDP('Saved advCompany', { id: adv.id, companyId})
        });
      }
    
      return {
        data: Array.isArray(data)
          ? data.map((item) => ({ ...item, id: item.id }))
          : [{ ...data, id: data.id }],
        total: total ? parseInt(total, 10) : Array.isArray(data) ? data.length : 1,
      };
    },
    getOne: async (resource, params) => {
        logDP('getOne called with resource:', resource, 'params:', params);
        let url;
        const authId = localStorage.getItem('auth_id');

        if (resource === "advertisements") {
          const { id } = params;
          if (!id) {
            throw new Error("ID is required for getOne operation");
          }
          url = `/api/companies/${authId}/advertisements/${id}`;
        } else if (resource === "requirements") {
          const { id } = params as any;
          if (!id) throw new Error("id is required");

          const advId = sessionStorage.getItem(`reqAdv:${id}`);
          let companyId =
          sessionStorage.getItem(`reqCompany:${id}`) ||
          (advId ? sessionStorage.getItem(`advCompany:${advId}`) : null);
          if (!companyId) {
            companyId = authId;
          }

          logDP("getOne requirements", { id, advId, companyId });

          if (!advId || !companyId) {
            throw new Error("参照情報が不足しています。求人票から募集要項を開いてください。");
          }

          url = `/api/companies/${companyId}/advertisements/${advId}/requirements/${id}`;
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

        return { data: { ...data, _full: true } };
    },

getManyReference: async (resource, params) => {
  if (resource === "requirements") {
    const advertisementId =
      (params as any).id ?? (params as any).targetId ?? (params as any).filter?.advertisement_id;

    logDP("getManyReference requirements params", params, { advertisementId });

    if (!advertisementId) throw new Error("advertisement_id が指定されていません");

    const companyId = localStorage.getItem('auth_id');
    logDP("sessionStorage advCompany", { [`advCompany:${advertisementId}`]: companyId });

    if (!companyId) throw new Error("company_id が不明です。広告一覧からレコードを開いてください。");

    const url = `/api/companies/${companyId}/advertisements/${advertisementId}/requirements`;
    logDP("GET", url);

    const response = await fetch(url, { headers: { Accept: "application/json" } });
    logDP("resp", response.status, response.statusText);

    if (!response.ok) throw new Error(`Failed to fetch requirements: ${response.statusText}`);
    const data = await response.json();
    logDP("data len", Array.isArray(data) ? data.length : 0);

    if (Array.isArray(data)) {
      data.forEach((req: any) => {
        if (req?.id != null) {
          sessionStorage.setItem(`reqAdv:${req.id}`, String(advertisementId));
          sessionStorage.setItem(`reqCompany:${req.id}`, String(companyId));
        }
      });
    }

    return { data, total: Array.isArray(data) ? data.length : 0 };
  }
  return customDataProvider.getManyReference(resource, params);
},

  create: async (resource, params) => {
    let url;
    let dataToSubmit;
    const authId = localStorage.getItem('auth_id');
    if (!authId) throw new Error("Unauthorized: No auth_id found");

    if (resource === "advertisements") {
      url = `/api/companies/${authId}/advertisements`;

      dataToSubmit = {
        ...params.data,
        //デフォルト値(company_id, pending, updated_at, created_at)の設定
        company_id: Number(authId),
        pending: params.data.pending !== undefined ? Boolean(params.data.pending) : false,
        tag_ids: Array.isArray(params.data.tag_ids) ? params.data.tag_ids.map(Number) : [],
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
    } else if (resource === "requirements") {
      const advId = params.data.advertisement_id;
      if (!advId) throw new Error("advertisement_idが見つかりません");

      url = `/api/companies/${authId}/advertisements/${advId}/requirements`;

      dataToSubmit = {
        advertisement_id: advId,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    } else {
      throw new Error(`リソース ${resource} の作成はサポートされていません。`);
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
            const errorText = await response.text();
            console.error(`CREATE Error (${resource}):`, errorText);
            throw new Error(`作成に失敗しました: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      return { data: { ...responseData, id: responseData.id } };
    } catch (error) {
      console.error("Create Request error:", error);
      throw error;
    }
  },

  update: async (resource, params) => { // updateしたときのレスポンスにidがないのでエラーが出る
    let url;
    let dataToSubmit;
    const authId = localStorage.getItem('auth_id');
    if (!authId) throw new Error("Unauthorized: No auth_id found");

    const { id } = params;
    if (!id) throw new Error("ID is required for update operation");

    if (resource === "advertisements") {
      url = `/api/companies/${authId}/advertisements/${id}`;

      dataToSubmit = {
        ...params.data,
        tag_ids: Array.isArray(params.data.tag_ids) ? params.data.tag_ids.map(Number) : (params.data.tag_ids || []),
        updated_at: new Date().toISOString(),
      };
      delete dataToSubmit.company_id;
      delete dataToSubmit.created_at;
    } else {
      throw new Error(`リソース ${resource} の更新はサポートされていません。`);
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`UPDATE Error (${resource}):`, errorText);
        throw new Error(`更新に失敗しました: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Update Request error:", error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    const authId = localStorage.getItem('auth_id');
    if (!authId) throw new Error("Unauthorized: No auth_id found");

    if (resource === "advertisements") {
      const { id } = params;
      const url = `/api/companies/${authId}/advertisements/${id}`;
    }
  },
}

const App = () => (
  <Admin dataProvider={customDataProvider} authProvider={customAuthProvider} loginPage={CustomLoginPage}> 
    <Resource name="products" show={ProductShow} list={ProductShow}/>
    <Resource name="advertisements" list={AdvertisementsList} show={AdvertisementShow} create={AdvertisementCreate} edit={AdvertisementEdit} />
    <Resource name="requirements" show={RequirementShow} create={RequirementCreate} />
    <Resource name="tags" />
  </Admin>
);

export default App
