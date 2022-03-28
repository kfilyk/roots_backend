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
    axios.defaults.baseURL = 'http://localhost:8000';
    axios.defaults.timeout = 10000;
  };
}
