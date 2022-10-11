import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import menu_icon from "../../img/menu_icon.png"
import Popup from "reactjs-popup";
import PodCarousel from "../Experiment/PodCarousel"

import RecipeBar from '../Recipe/RecipeBar';
import "./experiment.css"

/*
Date Variables used in:
terminateExperiment()
*/
let todayDate = new Date();

const Experiment = () => {
    /*
    TWO DEVICE STATES:
        Active - Active devices with a experiment loaded
        Available - Devices not running an experiment at the moment
        All - Both active and available
    */
    const [activeExperiments, setActiveExperiments] = useState([]); // list of device objects
    const [availableDevices, setAvailableDevices] = useState([]); // list of device objects
    const [completedExperiments, setCompletedExperiments] = useState([]);
    const [selectedDeviceStatus, setSelectedDeviceStatus] = useState("active");

    const [search, setSearch] = useState("");
    
    //LISTS OF ALL PHASES, RECIPES, PLANTS, EXPERIMENT READINGS, PODS
    const [podList, setPodList] = useState([])
    const [phaseList, setPhaseList] = useState([])
    const [recipeList, setRecipeList] = useState([])
    const [plantList, setPlantList] = useState([]);
    const [experimentReadingList, setExperimentReadingList] = useState([])
    const [podReadingList, setPodReadingList] = useState([])


    //USED FOR ADDING A NEW DEVICE & EDITING A CURRENT ONE
    const [device, setDevice] = useState({
        add: true, 
        show: false, 
        id: -1, 
        experiment: -1, 
        recipe: -1,
        name: null, 
        mac_address: null
    });

    //USED FOR ADDING A NEW EXP
    const [experiment, setExperiment] = useState({
        id: null,
        name: null,
        device: null,
        device_name:null,
        pods: [],
        pod_selection: {},
        start_date: todayDate,
        end_date: null,
        recipe: null,
        phase: null
      })

    /*
        Saves parameter details for sending mqtt commands,
        See sendCommand() function below
        and renderCommand()
    */
    const [command, set_command] = useState({
        show: false,
        id: 0,
        device: -1,
        device_name: null,
        hour: 0,
        minute: 0,
        cycle: 0,
        stage: 0,
        timezone: "Etc/GMT-7",
        response: {}
    });

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
    Input from: renderDevices
    Outputs to: activeExperiments, availableDevices
    Created by: Kelvin F 08/26/2022
    Last Edit: Kelvin F 08/26/2022
    Purpose: Terminates an experiment by pushing end date, status=1 to DB object
    */
    async function terminateExperiment(id) {
        await axios.post(`/api/experiments/terminate/`, {id: id});
        getActiveExperiments()
        getAvailableDevices()
        getCompletedExperiments()
    }

    /*
    Input from: renderDevices
    Outputs to: activeExperiments, availableDevices
    Created by: Kelvin F 08/26/2022
    Last Edit: Kelvin F 08/26/2022
    Purpose: Deletes an experiment object and all associated readings and pods
    */
    async function deleteExperiment(id) {
      await axios.post(`/api/experiments/delete/`, {id: id});
      getCompletedExperiments()
  }
    /*
    Input from: None
    Outputs to: activeExperiments, availableDevices, phaseList, recipeList, plantList
    Created by: Kelvin F 08/26/2022
    Last Edit: Kelvin F 08/26/2022
    Purpose: Upon page load, it runs once and gets available + active devices; phases; recipes; and plants
    */
    useEffect(() => {
        getAvailableDevices();
        getActiveExperiments();
        getCompletedExperiments();
        getPhases();
        getRecipes();
        getPlants();
        getPods();
        getExperimentReadings();
        getPodReadings();

    }, []); // run once after start

    useEffect(() => {
        let ed = new Date(experiment.start_date)
        const recipe = recipeList?.filter(recipe => recipe?.id === parseInt(experiment?.recipe))[0]
        ed = new Date(ed.setDate(ed.getDate() + recipe?.days))
        setExperiment({...experiment, end_date: ed, phase: recipe?.phase1})
    }, [experiment.recipe, experiment.start_date])

    /*
    Input from: None
    Outputs to: None
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Given a function X and a time interval Y,
    This function will wait Y then call X over and over.
    In other words, a frontend cronjob.
    See useInterval() in use below for an example
    */
    function useInterval(callback, delay) {
        const savedCallback = useRef();
      
        // Remember the latest function.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
      }

    /*
    Input from: None
    Outputs to: activeExperiments
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Checks if devices are online according to the DATABASE. NOT THE INDIVIDUAL DEVICES.
    To check if an individual device is offline, send a command to it to verify.
    */
    function checkDevicesOnline(){
        axios
            .post(`/api/devices/check_devices_online/`)
            .then((res) => {

                // for each device, determine if online or offline
                res.data.forEach((device) => {
                    let index = activeExperiments.findIndex(d => d.device_id === device.id)
                    if(index === -1) {
                        index = availableDevices.findIndex(d => d.id === device.id)
                        if (availableDevices[index].is_online !== device.is_online){
                            let updated_device = availableDevices[index]
                            updated_device.is_online = device.is_online
                            setAvailableDevices([
                            ...availableDevices.slice(0, index),
                            updated_device,
                            ...availableDevices.slice(index + 1)
                            ])
                        }
                    } else {
                        if (activeExperiments[index].is_online !== device.is_online){
                            let updated_device = activeExperiments[index]
                            updated_device.is_online = device.is_online
                            setActiveExperiments([
                            ...activeExperiments.slice(0, index),
                            updated_device,
                            ...activeExperiments.slice(index + 1)
                            ])
                        }
                    }
                })
            }).catch((err) => console.log("LD error: ", err))
    }

    /*
    Input from: None
    Outputs to: activeExperiments, see checkDevicesOnline()
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose:     Checks if devices are offline every minute
    It is 60000 because time in Javascript is done via milliseconds. 
    */
    useInterval(() => {
        checkDevicesOnline()
    }, 60000);

    /*
    Input from: None
    Outputs to: selectedDeviceStatus
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Renders experiment status nav bar; experiment states include: active, completed,  free
    */
    function renderSubNav() {
        return (
          <div className="nav sub-nav" style={{fontSize: "12px"}}>
            <span className={selectedDeviceStatus === "active" ? "nav-link active" : "nav-link"} onClick={() => {setSelectedDeviceStatus("active"); setSearch("")}}>
              ACTIVE
            </span>
            <span className={selectedDeviceStatus === "completed" ? "nav-link active" : "nav-link"} onClick={() => {setSelectedDeviceStatus("completed"); setSearch("")}}>
              COMPLETED
            </span>
            <span className={selectedDeviceStatus === "free" ? "nav-link active" : "nav-link"} onClick={() => {setSelectedDeviceStatus("free"); setSearch("")}}>
              FREE DEVICES
            </span>
            <input type="text" size="8" value={search} placeholder='SEARCH' className={"nav-link"} onChange={(e) => {setSearch(e.target.value)}}/>
          </div>
        );
      };

    /*
    Input from: renderCommand() & renderCommandParameters()
    Outputs to: command
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: MakesAPI Call that sends a command to an individual device
    */
    async function sendCommand(e){
        e.preventDefault()
        set_command({...command, response: {}})
        const result = await axios
          .post(`/api/devices/send_command/`, 
            { 
                id: command.id,
                parameters: command
            });
        
        set_command({...command, response: result.data})
    }

    /*
    Input from: experiment & renderRecipeSelection()
    Outputs to: activeExperiments
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Makes API Call that sends the recipe of an experiment to a device via MQTT
    */
    async function updateDevice(){
        const result = await axios
        .post(`/api/devices/update_device/`, 
          { 
              device_id: experiment.device,
              new_recipe_id: parseInt(experiment.recipe)

          });
        
    }

    /*
    Input from: selectedDeviceStatus, activeExperiments, availableDevices
    Outputs to: renderExperimentModal
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Renders device modules to screen 
    */
    function renderDevices(){
        const deviceList = []
        if (selectedDeviceStatus === 'active'){   
            activeExperiments.map((item) => {
                if (item.name.includes(search) || item.device_name.includes(search) || item.device_id.includes(search) || item.current_recipe.includes(search)) {         
                    deviceList.push(
                        <div key={'active_' + item.id} className="object_container" onClick={() => {if(selectedExperiment !== item.id) {setSelectedExperiment(item.id); setSelectedPod(-1); }}}>
                            <div className="object_top">
                                <div className="object_description">
                                    <div className="bold_font">{item.device_name} <span className="blink_me" style={{ color: item.is_online ? 'green': 'red'}}>{"\u00a0"}●{"\u00a0"}</span> <span className="normal_font">{item.name}</span> 
                                        <div className="object_hidden">
                                            <div className="bold_font">ID: <span className="normal_font">{item.device_id}</span></div>
                                            <div className="bold_font">MAC: <span className="normal_font">{item.mac_address.toUpperCase()}</span></div>
                                        </div>
                                    </div>
                                    {item.score !== null ? <div>Score: { item.score } </div>: <></>}
                                </div>
                                <div className="object_content">     
                                    <PodCarousel experimentID={item.id} deviceId={item.device} status={item.status} podList = {podList.filter(pod => (pod.status === item.status && pod.experiment === item.id))} selectedPod = {selectedPod} setSelectedPod={setSelectedPod} selectedExperiment={selectedExperiment}></PodCarousel>
                                </div>
                            </div>
                            <RecipeBar experimentReadingList = {experimentReadingList.filter(er => er.experiment === item.id)} podReadingList = {podReadingList.filter(pr => pr.experiment === item.id)} phaseList = {phaseList.filter(phase => phase.recipe === item.recipe_id)} recipe = {recipeList?.filter(obj => obj.id === item.recipe_id)[0]} recipe_name = {item.current_recipe} experiment = {item} getExperimentReadings={getExperimentReadings} getPodReadings={getPodReadings} podList = {podList.filter(pod => (pod.status === item.status && pod.experiment === item.id))} selectedPod = {selectedPod} setSelectedPod = {setSelectedPod} selectedExperiment= {selectedExperiment} setSelectedExperiment = {setSelectedExperiment} selectedExperimentReading = {selectedExperimentReading} setSelectedExperimentReading={setSelectedExperimentReading}></RecipeBar>

                            <div className='object_actions'>
                                <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
                                {item.status === 0 && <li key="terminate"><button onClick={() => { if (window.confirm(`Terminate experiment "${item.name}"?`)) terminateExperiment(item.id) }}>TERMINATE</button></li> }
                                <li key="sendCommand"><button onClick={() => set_command({...command, show: true, device: item.device_id, device_name: item.device_name})}>SEND COMMAND</button></li>
                            </div>
                        </div>
                    )
                }
            })
        } else if  (selectedDeviceStatus === 'completed'){
            completedExperiments.map((item) => {
                if (item.name.includes(search) || item.device_name.includes(search) || item.device_id.includes(search) || item.current_recipe.includes(search)) {         
                    deviceList.push(
                        <div key={'completed_' + item.id} className="object_container" onClick={() => {setSelectedExperiment(item.id)}}>
                            <div className="object_top">
                                <div className="object_description">
                                    <div className="bold_font tooltip" data-tooltip={"DEVICE ID: "+item.device_id + "\nMAC: " + item.mac_address.toUpperCase()}>
                                        {item.device_name+ " | "}{item.status === 1 ? <span style={{color:"red"}}>TERMINATED</span>:<span style={{color:"green"}}>CONCLUDED</span>}<span className="normal_font">{" | "+item.name}</span> 
                                    </div>
                                    {item.score !== null ? <div>Score: { item.score } </div>: <></>}
                                </div>
                                <div className="object_content">                          
                                    <PodCarousel experimentID={item.id} deviceId={item.device} status={item.status} podList = {podList.filter(pod => (pod.status === item.status && pod.experiment === item.id))} selectedPod = {selectedPod} setSelectedPod={setSelectedPod} selectedExperiment={selectedExperiment}></PodCarousel>
                                </div>
                            </div>
                            <RecipeBar experimentReadingList = {experimentReadingList.filter(er => er.experiment === item.id)} podReadingList = {podReadingList.filter(pr => pr.experiment === item.id)} phaseList = {phaseList.filter(phase => phase.recipe === item.recipe_id)} recipe = {recipeList?.filter(obj => obj.id === item.recipe_id)[0]} recipe_name = {item.current_recipe} experiment = {item} getExperimentReadings={getExperimentReadings} getPodReadings={getPodReadings} podList = {podList.filter(pod => (pod.status === item.status && pod.experiment === item.id))} selectedPod = {selectedPod} setSelectedPod = {setSelectedPod} selectedExperiment= {selectedExperiment} setSelectedExperiment = {setSelectedExperiment} selectedExperimentReading = {selectedExperimentReading} setSelectedExperimentReading={setSelectedExperimentReading}></RecipeBar>
                            <div className='object_actions'>
                                <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
                                {<li key="delete"><button onClick={() => { if (window.confirm(`Delete experiment "${item.name}"?`)) deleteExperiment(item.id) }}>DELETE EXPERIMENT</button></li> }
                            </div>
                        </div>
                    )
                }
            })
        } else if  (selectedDeviceStatus === 'free'){
            availableDevices.map((item) => {
                if (item.name.includes(search) || item.id.includes(search)) {
                    deviceList.push(
                        <div key={'free_' + item.id}  className="object_container">
                            <div className="object_top">
                                <div className="object_description">
                                  <div className="bold_font tooltip" data-tooltip={"DEVICE ID: "+item.id + " | MAC: " + item.mac_address.toUpperCase()} >
                                      {item.name}<span className="blink_me" style={{ color: item.is_online ? 'green': 'red'}}>{"\u00a0"}●{"\u00a0"}</span>
                                  </div>
                                  {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                                </div>
                            </div>
                            {item.is_online ? <div className= "empty_object" onClick={() => {setDevice({...device, show:true}); setExperiment({...experiment, device:item.id, device_name:item.name, start_date:todayDate});}}>  ADD EXPERIMENT</div> : <div className= "empty_object">DEVICE OFFLINE</div>}
                           
                            <div className='object_actions'>
                                <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
                                <li key="sendCommand"><button onClick={() => set_command({...command, show: true, device: item.id, device_name: item.name})}>SEND COMMAND</button></li>
                            </div>
                        </div>
                    )
                }
            })
        } 
        return deviceList
    }

    /*
    Input from: renderPodSelection
    Outputs to: experiment
    Created by: Kelvin F 08/26/2022
    Last Edit: Kelvin F 08/26/2022
    Purpose: Sets the plant selected for a given pod of an experiment
    */
    function setPod(e){
        let position = e.target.name.substring(4); 
        let temp = experiment.pod_selection
        temp[position] = e.target.value
        setExperiment({...experiment, pod_selection: temp})
    }
    

    /*
    Input from: experiment
    Outputs to: renderExperimentModal()
    Created by: Kelvin F 08/26/2022
    Last Edit: Kelvin F 08/26/2022
    Purpose: Sets the plant selected for a given pod of an experiment
    */
    function renderPodSelection(){
        let podContainer = []
        // so long as pods are loaded
        for(let i = 0; i < 5; i++) {
            let currPod = experiment.pods.filter(pod => pod.position === (i+1))[0] ?? null
            let plant = null;      

            if (currPod !== null){
                plant = currPod['plant']
            }

            podContainer.push(
                <select className="pod" name={"pod_"+(i+1)} defaultValue={plant} onChange={(e) => setPod(e)}>
                    <option value={null}></option>
                    {plantList.map(item => (
                        <option key={item.id} value={item.id}> {item.name} </option>
                    ))}
                </select>
            )
        }
        return podContainer
    }

    /*
    Input from: recipeList
    Outputs to: renderExperimentModal()
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Renders a dropdown of recipes, used to change the recipe on a device
    */
    function renderRecipeSelection(){
        return (
            <select className="experiment_recipe_selection" name="experiment_recipe_selection" default_value="null" onChange={(e) => setExperiment({...experiment, recipe: e.target.value})}>
                <option value={null}></option>
                {recipeList.map(item => (
                    <option key={item.id} value={item.id}> {item.name} </option>
                ))}
            </select>
        )
    }

    /*
    Input from: experiment
    Outputs to: availableDevices, activeExperiments, experiment
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Makes API call to create an experiment and change the recipe on the device running the experiment
    */
    function submitExperimentModal(close){
        if (experiment.name === null || experiment.name === ""){
          alert("Experiment name cannot be null.")
          return
        }
        console.log(experiment)
        
        axios.post(`/api/experiments/`, 
          { 
            name: experiment.name,
            device: experiment.device,
            phase: experiment.phase,
            pod_selection: experiment.pod_selection,
            start_date: experiment.start_date,
            end_date: experiment.end_date,
            recipe: experiment.recipe
          })
        .then(res => {
            updateDevice();
            getAvailableDevices();
            getActiveExperiments();
        })
        .catch((err) => console.log(err));
        
        close();
    }

    /*
    Input from: device
    Outputs to: experiment & submitExperimentModal()
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Renders modal where you can create an experiment on a given device
    */
    function renderExperimentModal(){
        return (
            <Popup open={device.show} onClose={() => {setDevice({...device, show: false}); closeExperimentModal();} } modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                        <div className="modal_content">
                            <div> DEVICE {experiment.device_name} </div>
                            <div className="form_row">
                                <input name="name" value={experiment.name} placeholder = {"Experiment Name"} onChange={(e) => setExperiment({...experiment, name: e.target.value})} />
                            </div>
                            <div className="form_row">
                                <input className="date_selection" type="date" name="start_date" value={experiment.start_date.toISOString().substring(0,10)} onChange={(e) => setExperiment({...experiment, start_date: e.target.value})} />
                            </div>
                            <div className="form_row">{renderPodSelection()}</div>
                            <div className="form_row">{renderRecipeSelection()}</div>

                            <button className='save' onClick={() => {
                                submitExperimentModal(close);
                            }}>Save</button>

                        </div>
                    </div>
                </div>
                )}
            </Popup>
        )
    }

    /*
    Input from: renderExperimentModal()
    Outputs to: experiment
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Resets experiment's state upon closing the add experiment module (renderExperimentModal())
    */
    function closeExperimentModal(){
        setExperiment({name: null, device: null, device_name: null, pods: [], start_date: todayDate, pod_selection: {}})
    }


    /*
    Input from: renderCommand()
    Outputs to: renderCommand()
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Based on the command to be sent to a device, loads the parameters that needed to be filled out. 
    */
    function renderCommandParameters(id){
        switch(true) {
            case id === '7':
                return(
                    <div>
                        <div>
                            Select Timezone
                            <select value={command.timezone} onChange={(e) => set_command({...command, timezone: e.target.value})} >
                                <option value="Etc/GMT-12">Etc/GMT+12</option>
                                <option value="Etc/GMT-11">Etc/GMT+11</option>
                                <option value="Etc/GMT-10">Etc/GMT+10</option>
                                <option value="Etc/GMT-9">Etc/GMT+9</option>
                                <option value="Etc/GMT-8">Etc/GMT+8</option>
                                <option value="Etc/GMT-7">Etc/GMT+7</option>
                                <option value="Etc/GMT-6">Etc/GMT+6</option>
                                <option value="Etc/GMT-5">Etc/GMT+5</option>
                                <option value="Etc/GMT-4">Etc/GMT+4</option>
                                <option value="Etc/GMT-3">Etc/GMT+3</option>
                                <option value="Etc/GMT-2">Etc/GMT+2</option>
                                <option value="Etc/GMT-1">Etc/GMT+1</option>
                                <option value="Etc/GMT">Etc/GMT</option>
                                <option value="Etc/GMT+1">Etc/GMT-1</option>
                                <option value="Etc/GMT+2">Etc/GMT-2</option>
                                <option value="Etc/GMT+3">Etc/GMT-3</option>
                                <option value="Etc/GMT+4">Etc/GMT-4</option>
                                <option value="Etc/GMT+5">Etc/GMT-5</option>
                                <option value="Etc/GMT+6">Etc/GMT-6</option>
                                <option value="Etc/GMT+7">Etc/GMT-7</option>
                                <option value="Etc/GMT+8">Etc/GMT-8</option>
                                <option value="Etc/GMT+9">Etc/GMT-9</option>
                                <option value="Etc/GMT+10">Etc/GMT-10</option>
                                <option value="Etc/GMT+11">Etc/GMT-11</option>
                                <option value="Etc/GMT+12">Etc/GMT-12</option>
                            </select>
                        </div>
                        <div>
                        </div>
                    </div>
                )
            case id === '11':
                return(
                    <div>
                        <div>
                            Hour (0 to 23):
                            <input type="number" value={command.hour} min={0} max={23} onChange={(e) => {set_command({...command, hour: e.target.value})}} />
                        </div>
                        <div>
                            Minute (0 to 59):
                            <input type="number" value={command.minute} min={0} max={59} onChange={(e) => {set_command({...command, minute: e.target.value})}} />
                        </div>
                    </div>
                )
            case id === '14':
                return(
                    <div>
                        <div>
                            Stage:
                            <input type="number" value={command.stage} min={0} onChange={(e) => {set_command({...command, stage: e.target.value})}} />
                        </div>
                        <div>
                            Cycle:
                            <input type="number" value={command.cycle} min={0} onChange={(e) => {set_command({...command, cycle: e.target.value})}} />
                        </div>
                    </div>
            )
            default:
                return(<></>)
        } 
    }

    /*
    Input from: command
    Outputs to: sendCommand()
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Renders the module to send MQTT commands to a given device. 
    */
    function renderCommand(){
        return (
            <Popup open={command.show} onClose={() => set_command({...command, response: {}, show: false})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                        <div className="modal_content">
                            <div style={{width: 'max-content'}}>     
                                
                            </div>
                            <div className="form_row">
                                Device ID: {command.device + " | "+ command.device_name}
                            </div>
                            <div className="form_row">
                                <select value={command.id} onChange={(e) => set_command({...command, id: e.target.value})} >
                                    <option value="0">Get Device State</option>
                                    {/* <option value="1">Get Device Logs</option> */}
                                    <option value="7">Change Timezone</option>
                                    <option value="11">Change Start Time</option>
                                    <option value="12">Trigger OTA</option>
                                    <option value="14">Change Stage and Cycle</option>
                                </select>
                            </div>
                            {renderCommandParameters(command.id)}
                            <div className='form-row'>
                                Response: 
                                <pre>{JSON.stringify(command.response, null, 2) }</pre>
                                {/* <button className='save' onClick={() => {navigator.clipboard.writeText(JSON.stringify(command.response))}}>COPY RESPONSE</button> */}
                            </div>
                            <button className='save' onClick={(e) => {
                                sendCommand(e)
                                // close()
                            }}>Send Command</button>
                        </div>
                    </div>
                </div>
                )}
            </Popup>
        )
    }

    /*
    Input from: None
    Outputs to: None
    Created by: Stella T 08/26/2022
    Last Edit: Stella T 08/26/2022
    Purpose: Renders the container that renders everything on the page. 
    Determines the order of the other modules on the page
    */
    return (
        <div>
            {renderSubNav()}
            {renderDevices()}
            {renderExperimentModal()}
            {renderCommand()}
        </div>
      );
}

export default Experiment