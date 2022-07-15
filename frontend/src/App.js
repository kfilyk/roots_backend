// App.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Router from './Router';

const App = () => {
    
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8000'; // use this to run locally
    axios.defaults.timeout = 10000;
  }, []);

  return (
    <Router />
  ); 
}

export default App;
