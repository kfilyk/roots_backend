// App.js

import axios from 'axios';
import React, { Component } from 'react';
import Router from './Router';

export default class App extends Component {
  render() {
    return (
        <Router />
    );
  }

  componentWillMount() {
    axios.defaults.baseURL = 'http://54.160.156.25:8000'; // use this to run on EC2
    //axios.defaults.baseURL = 'http://localhost:8000'; // use this to run locally
    axios.defaults.timeout = 10000;
  };
}
