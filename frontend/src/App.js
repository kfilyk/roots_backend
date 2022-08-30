// App.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Router from './Router';

const App = () => {
    
  useEffect(() => {
    //axios.defaults.baseURL = 'http://0.0.0.0:8000'; // use this to run locally
    axios.defaults.baseURL = 'https://avaroots.io:8000'; // use this to run on EC2

    axios.defaults.timeout = 10000;
  }, []);

  return (
    <Router />
  ); 
}

export default App;
