import React from 'react';
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import DashBoard from './Components/DashBoard';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
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
