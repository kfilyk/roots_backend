// App.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import Login from './components/Login';
import NotFoundPage from './components/NotFoundPage';
import Dashboard from './components/Dashboard';
import Experiment from './components/Experiment/Experiment';
import Recipe from './components/Recipe/Recipe';
import Plant from "./components/Plant/Plant";
import Help from './components/Help/Help';
import MQTT from './components/MQTT/MQTT';
import Analysis from './components/Analysis/Analysis';

/*
OVERALL FILE PURPOSE: 
Sets the axios base url then adds routing paths
*/
const App = () => {

  const [auth, setAuth] = useState("");

  /*
  Input from: None
  Outputs to: None
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: Sets the base axios url to be used in all axios calls
  */
  useEffect(() => {
    axios.defaults.baseURL = 'http://127.0.0.1:8000'; // use this to run locally
    //axios.defaults.baseURL = 'https://avaroots.io:8000'; // use this to run on EC2
    axios.defaults.timeout = 10000;
    authenicate_user()
  }, []);

  function logout(){
    if (window.localStorage.getItem("token")) {
      axios
      .get('/auth/logout/')
      .then((res) => {
        localStorage.removeItem('token');
        window.location.replace("/")
      })
      .catch(error =>  console.log(error)) 
    }
  }

  function authenicate_user() {
    if (window.localStorage.getItem("token")) {
      console.log("FLAG")

      // if a token is found, set the authorization and attempt to validate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem("token")}`;

      axios
        .post("/auth/token/")
        .then((res) => {
          console.log("FLAG: ", res.data.username)
          setAuth(res.data.username)
        })
        .catch(res => {
          return logout()
        });
    } else if(window.location.pathname !== "/"){
      //NO LOCAL STORAGE TOKEN?? BOOTED OUT.
      window.location.replace("/")
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"+auth} element={<Dashboard user = {auth}/>} >
          <Route path={"experiments"} element={<Experiment/>}/>
          <Route path={"recipes"} element={<Recipe/>}/>
          <Route path={"plants"} element={<Plant/>}/>
          <Route path={"help"} element={<Help/>}/>
          <Route path={"mqtt"} element={<MQTT/>}/>
          <Route path={"analysis"} element={<Analysis/>}/>


        </Route>
        <Route index element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  ); 
}

export default App;
