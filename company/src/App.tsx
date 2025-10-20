import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Admin, Resource, type DataProvider } from 'react-admin'

const customAuthProvider = {
  async login(params: { username: string; password: string }) {
    const request = new Request('api/auth/company/login', {
      method: 'POST',
      body: JSON.stringify({ username: params.username, password: params.password }),
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
    localStorage.setItem('auth', JSON.stringify(auth));
  },
  async checkError(error: { status: any }) {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      throw new Error('Unauthorized');
    }
  },
  async checkAuth() {
    if (!localStorage.getItem('auth')) {
      throw new Error('Unauthorized');
    }
  },
  async logout() {
    localStorage.removeItem('auth');
  }
}

const customDataProvider: DataProvider = {
    getList: (resource, params) => {
        // Implement your custom logic here
        return Promise.resolve({ data: [], total: 0 })
    },
    getOne: (resource, params) => {
        // Implement your custom logic here
        return Promise.resolve({ data: {} })
    },
}

const App = () => (
  <Admin authProvider={customAuthProvider} dataProvider={customDataProvider}>
    <Resource name="products" />
  </Admin>
);

export default App
