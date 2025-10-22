import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { companyCreate } from './company'
import './App.css'
import { Admin, Resource, type DataProvider, Login } from 'react-admin'
import { Link } from 'react-router-dom';
import { productsList } from './products'

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
      throw new Error('Unauthorized');
    }
  },
  async checkAuth() {
    if (!localStorage.getItem('auth_id')) {
      throw new Error('Unauthorized');
    }
  },
  async logout() {
    localStorage.removeItem('auth_id');
  },
  async getIdentity() {
    const id = localStorage.getItem('auth_id');
    if (!id) {
      throw new Error('Unauthorized');
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
    getList: (resource, params) => {
        // Implement your custom logic here
        return Promise.resolve({ data: [], total: 0 })
    },
    getOne: async (resource, params) => {
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

const App = () => (
  <Admin dataProvider={customDataProvider} authProvider={customAuthProvider} loginPage={CustomLoginPage}>
    <Resource name="company" create={companyCreate}/>
    <Resource name="products" list={productsList}/>
  </Admin>
);

export default App
