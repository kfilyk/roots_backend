// App.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Router from './Router';


/*
OVERALL FILE PURPOSE: 
Sets the axios base url then adds routing paths
*/
const App = () => {
  
  /*
  Input from: None
  Outputs to: None
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: Sets the base axios url to be used in all axios calls
  */
  useEffect(() => {
    axios.defaults.baseURL = 'http://0.0.0.0:8000'; // use this to run locally
    //axios.defaults.baseURL = 'https://avaroots.io:8000'; // use this to run on EC2

    axios.defaults.timeout = 10000;
  }, []);

  return (
    <Router />
  ); 
}

export default App;
