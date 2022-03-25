import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import NotFoundPage from './components/NotFoundPage';
import Dashboard from './components/Dashboard';

/*
const validAuth = () => {
  const { token } = WithUser();
  return token !== '';
};
*/

const RouterComponent = () => {
  if (false) {
    return <Login />;
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
};


export default RouterComponent