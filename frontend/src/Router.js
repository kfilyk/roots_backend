import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import NotFoundPage from './components/NotFoundPage';
import Dashboard from './components/Dashboard';
import Hook_Dashboard from './components/Hook_Dashboard';
import axios from "axios";

const RouterComponent = () => {
  // replace false statement with _is_logged_in token statement
  // console.log("ROUTER: " + localStorage.getItem("token"))
  // console.log("AXIOS: " + axios.defaults.headers.common.Authorization)

  // everytime a person refreshes this page, check their preexisting token to see if its the same as in the db
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={"/"} element={<Login />} />
        <Route exact path={"/dashboard"} element={<Hook_Dashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};


export default RouterComponent