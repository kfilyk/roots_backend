import React, { useState, useEffect } from 'react';
import Experiment from './Experiment/Experiment';
import Phase from './Phase/Phase';
import Recipe from './Recipe/Recipe';
import axios from "axios";
import user_brown_icon from '../img/user_brown_icon.png';
import Plant from "./Plant/Plant";
import './dashboard.css';
import Device from './Device/Device';

const Dashboard = () => {
  const [selected_tab, set_selected_tab] = useState('loading'); // in the future: loading state shows a spinning wheel
  const [auth, set_auth] = useState({
    user: -1
  });

  useEffect(authenicate_user, []);

  function authenicate_user() {
    if (window.localStorage.getItem("token")) {

      // if a token is found, set the authorization and attempt to vlaidate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem("token")}`;

      axios
        .post("/auth/token/")
        .then((res) => {
          set_auth({...auth, user: res.data.username})
          //default tab
          set_selected_tab("device" )
          // set_selected_tab("device" )

        })
        .catch(res => {
          return logout()
        });
    } else {
      ////NO LOCAL STORAGE TOKEN?? BOOTED OUT.
      window.location.replace("/")
    }
  }

  function logout(){
    console.log("LOGOUT FLAG1")

    if (window.localStorage.getItem("token")) {
      console.log("LOGOUT FLAG2")
      axios
      .get('/auth/logout/')
      .then((res) => {
        localStorage.removeItem('token');
        window.location.replace("/")
      })
      .catch(error =>  console.log(error)) 
    }
  }

  function renderNav() {
    return (
      <div className="nav">
        <span className={selected_tab === "device" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("device" )}>
          DEVICES
        </span>
        <span className={selected_tab === "experiment" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("experiment" )}>
          EXPERIMENTS
        </span>
        <span className={selected_tab === "recipe" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("recipe" )}>
          RECIPES
        </span>
        <span className={selected_tab === "phase" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("phase" )}>
          PHASES
        </span>
        <span className={selected_tab === "plant" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("plant" )}>
          PLANTS
        </span>
      </div>
    );
  };

  function renderPage() {
    if(auth.user !== -1) {
      switch(selected_tab) {
        case 'device':
          return <Device></Device>
        case 'experiment':
          return <Experiment></Experiment>
        case 'recipe':
          return <Recipe></Recipe>
        case 'phase':
          return <Phase></Phase>
        case 'plant':
          return <Plant></Plant>
        default:
          return <></> // replace this with spinny wheel
      }
    }
  }

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">R.O.O.T.S</h1>
        <div className="user_container">
          <button id="logout" title="Logout" onClick={logout}>
            <span>{ auth.user }</span>
          </button>
          <div className="user_img_frame">
            <img className="user_img" src={user_brown_icon} alt="NO IMG!"/>
          </div>
        </div>
      </div>

      <div className="dashboard">
        {renderNav()}
        <div className="list-group list-group-flush border-top-0">
          {renderPage()}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;