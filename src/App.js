import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import DashBoard from './Components/DashBoard';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Register/>
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/dashboard',
      element: <DashBoard/>
    },
    {
      path: 'shelve/:id',
      element: <Home/>
    }
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>

        

  );
}

export default App;
