import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import NotFoundPage from './components/NotFoundPage';
import Dashboard from './components/Dashboard';

/*
OVERALL FILE PURPOSE: Lists the url paths. 
This is the highest level of url paths for the FRONTEND.
*/

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={"/"} element={<Login />} />
        <Route exact path={"/dashboard"} element={<Dashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};


export default RouterComponent