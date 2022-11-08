// App.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Redirect } from "react-router-dom";
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

  const [auth, setAuth] = useState("-1");

  /*
  Input from: None
  Outputs to: None
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: Sets the base axios url to be used in all axios calls
  */
  useEffect(() => {
    //axios.defaults.baseURL = 'http://127.0.0.1:8000'; // use this to run locally
    axios.defaults.baseURL = 'https://avaroots.io:8000'; // use this to run on EC2
    axios.defaults.timeout = 10000;
    authenticate_user()
  }, []);

  function authenticate_user() {
    if (window.localStorage.getItem("token")) {
      // if a token is found, set the authorization and attempt to validate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem("token")}`;

      axios
        .post("/auth/token/")
        .then((res) => {
          console.log("USERNAME: ", res.data.username)
          if(typeof(res.data.username) !== "undefined") {
            setAuth(res.data.username)
          } else { // if for some reason the user is undefined
            localStorage.removeItem('token');
            window.location.replace("/roots/")
          }
        })
        .catch(res => { // if token no longer valid
          localStorage.removeItem('token');
          window.location.replace("/roots/") 
        });
    } else if(window.location.pathname !== "/roots/"){ // if user tries any pathname and there is no token for that user, redirect to main
      //NO LOCAL STORAGE TOKEN?? BOOTED OUT.
      window.location.replace("/roots/")
    }
  }

  return (
    <Router>
      <Routes>
        <Route path={"roots"} element={<Login />}/>
        <Route path={"roots/"+auth} element={<Dashboard user = {auth}/>} >
          <Route path={"experiments"} element={<Experiment/>}/>
          <Route path={"recipes"} element={<Recipe/>}/>
          <Route path={"plants"} element={<Plant/>}/>
          <Route path={"help"} element={<Help/>}/>
          <Route path={"mqtt"} element={<MQTT/>}/>
          <Route path={"analysis"} element={<Analysis/>}/>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  ); 
}

export default App;
