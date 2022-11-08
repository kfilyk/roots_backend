import React, { useState, useEffect, createContext} from 'react'
import { Link, Outlet } from "react-router-dom"
import axios from "axios"
import user_brown_icon from '../img/user_brown_icon.png'
import roots_logo from '../img/roots_logo_transparent_256.png'
import './dashboard.css'
import MQTT from './MQTT/MQTT'

const UserContext = createContext({"test":-1});

/*
OVERALL FILE PURPOSE: 
Homepage of the application;
Contains navigation, logout, and pre-loaded API resources
*/
const Dashboard = (props) => {

  //Active tab the user is on.
  const [selectedTab, setSelectedTab] = useState(''); // in the future: loading state shows a spinning wheel

  /*
  TWO DEVICE STATES:
      Active - Active devices with a experiment loaded
      Available - Devices not running an experiment at the moment
      All - Both active and available
  */
  const [activeExperiments, setActiveExperiments] = useState([]); // list of device objects
  const [availableDevices, setAvailableDevices] = useState([]); // list of device objects
  const [completedExperiments, setCompletedExperiments] = useState([]);
      
  //LISTS OF ALL PHASES, RECIPES, PLANTS, EXPERIMENT READINGS, PODS
  const [podList, setPodList] = useState([])
  const [phaseList, setPhaseList] = useState([])
  const [recipeList, setRecipeList] = useState([])
  const [plantList, setPlantList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [experimentReadingList, setExperimentReadingList] = useState([])
  const [podReadingList, setPodReadingList] = useState([])

  // CURRENTLY SELECTED ITEMS
  const [selectedPod, setSelectedPod] = useState(-1)
  const [selectedExperiment, setSelectedExperiment] = useState(-1)
  const [selectedExperimentReading, setSelectedExperimentReading] = useState(-1);
    
    /*
    Input from: None
    Outputs to: activeExperiments
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Gets all the active devices from DB
    */
    async function getActiveExperiments() {
      const result = await axios(
        '/api/experiments/active/',
      );
      setActiveExperiments(result.data)
  } 
  
  /*
  Input from: None
  Outputs to: availableDevices
  Created by: Stella T 08/26/2022
  Last Edit: Stella T 08/26/2022
  Purpose: getes all the available devices from DB
  */
  async function getAvailableDevices() {
      const result = await axios(
        '/api/experiments/free_devices/',
      );
      setAvailableDevices(result.data)
  } 

   /*
  Input from: None
  Outputs to: completedExperiments
  Created by: Kelvin F 09/10/2022
  Last Edit: Kelvin F 09/10/2022
  Purpose: getes all completed experiments from DB
  */
  async function getCompletedExperiments() {
      const result = await axios(
        '/api/experiments/completed/',
      );
      setCompletedExperiments(result.data)
  } 

      /*
  Input from: None
  Outputs to: podList
  Created by: Stella T 08/26/2022
  Last Edit: Stella T 08/26/2022
  Purpose: getes all the pods from DB
  */
  async function getPods() {
      const result = await axios(
        '/api/pods/',
      );
      setPodList(result.data)
  } 

  /*
  Input from: None
  Outputs to: phaseList
  Created by: Stella T 08/26/2022
  Last Edit: Stella T 08/26/2022
  Purpose: getes all the phases from DB
  */
  async function getPhases() {
      const result = await axios(
        '/api/phases/',
      );
      setPhaseList(result.data)
  } 

  /*
  Input from: None
  Outputs to: recipeList
  Created by: Stella T 08/26/2022
  Last Edit: Stella T 08/26/2022
  Purpose: getes all the recipes from DB
  */
  async function getRecipes() {
      const result = await axios(
        '/api/recipes/',
      );
      setRecipeList(result.data)
    } 

  /*
  Input from: None
  Outputs to: plantList
  Created by: Stella T 08/26/2022
  Last Edit: Stella T 08/26/2022
  Purpose: getes all the plants from DB
  */
  async function getPlants() {
      const result = await axios('/api/plants/').catch((err) => console.log(err))
      if (result?.status === 200){
          setPlantList(result?.data)
      }
    }

  /*
  Input from: None
  Outputs to: experimentReadingList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: get all experiment readings
  */
  async function getExperimentReadings() {
      const result = await axios(`/api/experimentreadings/`).catch((err) => console.log(err))
      if (result?.status === 200){
          setExperimentReadingList(result?.data)
      }
  }

  /*
  Input from: None
  Outputs to: podReadingList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: get all pods readings
  */
  async function getPodReadings() {
      const result = await axios(`/api/podreadings/`).catch((err) => console.log(err))
      if (result?.status === 200){
          setPodReadingList(result?.data)
      }
  }

  /*
  Input from: None
  Outputs to: tagList
  Created by: Kelvin F @ 10/19/2022
  Last Edit: Kelvin F @ 10/19/2022
  Purpose: get all tags
  */
  async function getTags() {
      const result = await axios(`/api/tags/`).catch((err) => console.log(err))
      if (result?.status === 200){
          setTagList(result?.data)
      }
  }
  
  

 
  //Upon page load, pull all relevant resources from API
  useEffect(() => {
    let path = window.location.pathname.split("/")
    setSelectedTab(path[2]);
    getAvailableDevices();
    getActiveExperiments();
    getCompletedExperiments();
    getPhases();
    getRecipes();
    getPlants();
    getPods();
    getExperimentReadings();
    getPodReadings();
    getTags();
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
        window.location.replace("/roots/") // NEEDS to be "/xyz"
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
        */}
        <Link to={"analysis"} className={selectedTab === "analysis" ? "nav-link active" : "nav-link"} onClick={() => setSelectedTab("analysis" )}>
          ANALYSIS
        </Link>
      </div>
    );
  };

  /*
  Input from: renderNav(); renderPage();
  Outputs to: Screen
  Created by: Kelvin F 08/29/2022
  Last Edit: Kelvin F 08/29/2022
  Purpose: The container rendering all the components on the page. 
  */
  return (
    <UserContext.Provider value = {{ selectedTab, activeExperiments,}}>
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
        
        <MQTT/>

      </main>
    </UserContext.Provider>
  );
}

export default Dashboard;