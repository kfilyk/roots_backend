import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import NotFoundPage from './components/NotFoundPage';
import Dashboard from './components/Dashboard';
import axios from "axios";

const RouterComponent = () => {
  // replace false statement with _is_logged_in token statement
  console.log("ROUTER: " + localStorage.getItem("token"))
  console.log("AXIOS: " + axios.defaults.headers.common.Authorization)

  // everytime a person refreshes this page, check their preexisting token to see if its the same as in the db
  if (localStorage.getItem("token") === null){
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    );
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