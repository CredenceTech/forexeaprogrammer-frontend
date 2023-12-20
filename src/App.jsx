import { useState } from 'react'
import {
  Routes,
  Route,
} from 'react-router-dom';
import Users from './Users';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} >
          {/* public Route */}

          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          {/* protected route */}
          <Route element={<RequireAuth />}>
            {/* <Route path='/' element={<Dashboard />}> */}
            <Route path='/' element={<Users />} />
            <Route path='/setting' element={<Dashboard />} />
            {/* </Route> */}

          </Route>


        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </>
  )
}

export default App
