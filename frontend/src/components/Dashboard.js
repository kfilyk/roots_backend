import React, { useState, useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import user_brown_icon from '../img/user_brown_icon.png';
import roots_logo from '../img/roots_logo_transparent_256.png';
import './dashboard.css';


/*
OVERALL FILE PURPOSE: 
Homepage of the application;
Contains navigation and logout logic
*/
const Dashboard = (props) => {
  //Active tab the user is on.
  const [selectedTab, setSelectedTab] = useState(''); // in the future: loading state shows a spinning wheel
  //Whether the user is logged in or not.

  //Upon page load, run this function once to verify user creds
  useEffect(() => {
    let path = window.location.pathname.split("/")
    setSelectedTab(path[2]);
  }, []);

  /*
  Input from: window.localStorage.getItem("token")
  Outputs to: window.localStorage
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: When user clicks logout, their token is deleted and they're redirected to the login page. 
  */
  function logout(){
    if (window.localStorage.getItem("token")) {
      axios
      .get('/auth/logout/')
      .then((res) => {
        console.log("FLAG")
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
        <Link to={"experiments"} className={selectedTab === "experiments" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("experiments" )}>
          EXPERIMENTS
        </Link>
        <Link to={"recipes"} className={selectedTab === "recipes" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("recipes" )}>
          RECIPES
        </Link>
        <Link to={"plants"} className={selectedTab === "plants" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("plants" )}>
          PLANTS
        </Link>
        {/*
        <Link to={"help"} className={selectedTab === "help" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("help" )}>
          HELP
        </Link>
        <Link to={"mqtt"} className={selectedTab === "mqtt" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("mqtt" )}>
          MQTT
        </Link>
        */}
        <Link to={"analysis"} className={selectedTab === "analysis" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("analysis" )}>
          ANALYSIS
        </Link>
      </div>
    );
  };

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
        <h1 className="title"><img src={roots_logo} style={{width:'25px', marginRight:'10px', marginBottom:'8px',verticalAlign:'middle'}} alt=""/>R.O.O.T.S.</h1>
        <div className="user_container">
          <button id="logout" title="Logout" onClick={logout}><span>{props.user}</span></button>
          <img style={{width:'25px', marginBottom:'8px',verticalAlign:'middle'}} className="user_img" src={user_brown_icon} alt=""/>
        </div>
      </div>
      
      <div className="dashboard">
        {renderNav()}
        <Outlet/>
      </div>

    </main>
  );
}

export default Dashboard;