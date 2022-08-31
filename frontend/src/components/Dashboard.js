import React, { useState, useEffect } from 'react';
import Experiment from './Experiment/Experiment';
import Phase from './Phase/Phase';
import Recipe from './Recipe/Recipe';
import axios from "axios";
import user_brown_icon from '../img/user_brown_icon.png';
import Plant from "./Plant/Plant";
import './dashboard.css';
import Device from './Device/Device';
import Help from './Help/Help';
import MQTT from './MQTT/MQTT';

/*
OVERALL FILE PURPOSE: 
Homepage of the application;
Contains navigation and logout logic
*/
const Dashboard = () => {
  //Active tab the user is on.
  const [selectedTab, setSelectedTab] = useState('loading'); // in the future: loading state shows a spinning wheel
  //Whether the user is logged in or not.
  const [auth, setAuth] = useState({
    user: -1
  });

  //Upon page load, run this function once to verify user creds
  useEffect(authenicate_user, []);

  /*
  Input from: window.localStorage.getItem("token")
  Outputs to: auth, selectedTab
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: Gets user token from local storage and verifies it with an API call.
  If user creds are not valid, user is taken back to login page. 
  */
  function authenicate_user() {
    if (window.localStorage.getItem("token")) {

      // if a token is found, set the authorization and attempt to vlaidate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem("token")}`;

      axios
        .post("/auth/token/")
        .then((res) => {
          setAuth({...auth, user: res.data.username})
          //default tab
          setSelectedTab("device" )
        })
        .catch(res => {
          return logout()
        });
    } else {
      ////NO LOCAL STORAGE TOKEN?? BOOTED OUT.
      window.location.replace("/")
    }
  }


  /*
  Input from: window.localStorage.getItem("token")
  Outputs to: window.localStorage
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: When user clicks logout, their token is deleted and they're redirected to the login page. 
  */
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


  /*
  Input from: None
  Outputs to: return()
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: Determines the layout of the nav bar and the logic for changing the selected tab
  */
  function renderNav() {
    return (
      <div className="nav">
        <span className={selectedTab === "device" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("device" )}>
          DEVICES
        </span>
        <span className={selectedTab === "experiment" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("experiment" )}>
          EXPERIMENTS
        </span>
        <span className={selectedTab === "recipe" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("recipe" )}>
          RECIPES
        </span>
        <span className={selectedTab === "phase" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("phase" )}>
          PHASES
        </span>
        <span className={selectedTab === "plant" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("plant" )}>
          PLANTS
        </span>
        <span className={selectedTab === "help" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("help" )}>
          HELP
        </span>
        <span className={selectedTab === "mqtt" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("mqtt" )}>
          MQTT
        </span>
      </div>
    );
  };

  /*
  Input from: None
  Outputs to: return()
  Created by: Stella T 08/29/2022
  Last Edit: Stella T 08/29/2022
  Purpose: Creates a button in the bottom right corner that scrolls back to the top of the page.
  */
  function renderScrollUp(){
    return (
      <button className="scrollUp" onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>⬆</button>
    )
  }

  /*
  Input from: selectedTab
  Outputs to: return()
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: Upon selectedTab changing, a different page is loaded
  */
  function renderPage() {
    if(auth.user !== -1) {
      switch(selectedTab) {
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
        case 'help':
            return <Help></Help>
        case 'mqtt':
              return <MQTT></MQTT>
        default:
          return <></> // replace this with spinny wheel
      }
    }
  }

  /*
  Input from: renderNav(); renderScrollUp; renderPage();
  Outputs to: Screen
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: The container rendering all the components on the page. 
  */
  return (
    <main className="container">
      <div className="header">
        <h1 className="title">R.O.O.T.S.</h1>
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
          {renderScrollUp()}
          {renderPage()}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;