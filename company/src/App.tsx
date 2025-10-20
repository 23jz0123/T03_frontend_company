import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Admin, Resource, type DataProvider } from 'react-admin'

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

function App() => (
  <Admin dataProvider={customDataProvider}>
         <Resource name="" />
  </Admin>
)

export default App
