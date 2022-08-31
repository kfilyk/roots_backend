import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import PodCarousel from "./PodCarousel"
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import ExperimentReading from "../Experiment/ExperimentReading"
import RecipeBar from '../Recipe/RecipeBar';

/*
Date Variables used in:
setExperiment()
*/
let today_date = new Date();
console.log("CURRENT DATE: ", today_date)
let year = today_date.getUTCFullYear();
let month = today_date.getUTCMonth() + 1;
month = month > 9 ? month : '0'+month;
let day = today_date.getUTCDate();
day = day > 9 ? day : '0'+day;


const ExperimentList = () => {

  // Store all experiments, plants, recipes, phases for future use by the Experiment tab
  const [experimentList, setExperimentList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [recipeList, setRecipeList] = useState([]);
  const [phaseList, setPhaseList] = useState([])
  const [modal, setModal] = useState({
    show: false,
    add: false
  })

  // store available devices able to be allocated an experiment
  const [available_devices, setAvailableDevices] = useState([])

  // store experiment currently being created/edited via pop-up modal 
  const [experiment, setExperiment] = useState({
    id: null,
    name: null,
    device: null,
    device_name: null,
    device_capacity: null,
    pods: [],
    pod_selection: {},
    start_date: year+"-"+month+"-"+day,
    recipe: null
  })

    /*
    Input from: None
    Outputs to: experimentList
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: Fetches all experiment objects (active or completed)
    */
  async function fetchExperiments() {
    const result = await axios(
      '/api/experiments/',
    );
    setExperimentList(result.data)
  } 

  /*
  Input from: None
  Outputs to: phaseList
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Fetches all phase objects
  */
  async function fetchPhases() {
    const result = await axios(
      '/api/phases/',
    );
    setPhaseList(result.data)
  } 

  /*
  Input from: None
  Outputs to: recipeList
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Fetches all recipe objects
  */
  async function fetchRecipes() {
    const result = await axios(
      '/api/recipes/',
    );
    setRecipeList(result.data)
  } 

  /*
  Input from: None
  Outputs to: plantList
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Fetches all plant objects
  */
  async function fetchPlants() {
    const result = await axios(
      '/api/plants/',
    );
    setPlantList(result.data)
  }
  
  /*
  Input from: None
  Outputs to: availableDevices
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Fetches all available devices without a currently running experiment
  */
  async function fetchAvailableDevices() {
    const result = await axios(
      '/api/experiments/available_devices/',
    );
    setAvailableDevices(result.data)
  }

  /*
  Input from: None
  Outputs to: None
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Runs once (denoted by '[]') at the start to load content by calling various fetch functions
  */
  useEffect(() => {
    fetchExperiments();
    fetchPhases();
    fetchPlants();
    fetchRecipes();
  }, []);

  /*
  Input from: React frontend (modal)
  Outputs to: Database (target experiment object)
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Concludes an experiment and updates it accordingly in the backend. 
  */
  async function concludeExperiment(id) {
    await axios.patch(`/api/experiments/${id}/`, { end_date: year+"-"+month+"-"+day});
    fetchExperiments()
  }

  /*
  Input from: Modal react object
  Outputs to: openModal()
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Passes the list of active pods from a given experiment to the frontend Modal editor
  */
  async function getPods(id) {
    let result = await axios(
      `/api/pods/?experiment=${id}`
      )
      .catch((err) => console.log(err)); 
    result = result.data.filter(pod => pod.end_date === null)
    return result
  }

  /*
  Input from: Modal react object
  Outputs to: openModal()
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Passes the device object associated with the experiment to the frontend Modal editor
  */
  async function getDevice(id){
    const device = await axios(
      `/api/devices/${id}/`
      )
      .catch((err) => console.log("ERROR: ", err));
    return device.data
  }

  /*
  Input from: Frontend button click (React)
  Outputs to: Frontend modal experiment editor
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Upon experiment add/edit button click, modal is opened for making changes to experiment form
  */
  function openModal(exp){
    if (exp === null ){
      fetchAvailableDevices()
      setModal({add: true, show: true})
    } else {

      // get pods first, then device
      getPods(exp.id).then(res1 => {
        getDevice(exp.device).then(res2 => {
          fetchAvailableDevices()
          setAvailableDevices([...available_devices, res2]) // add current editable device to available devices
          setExperiment({...experiment, id: exp.id, device: exp.device, device_name: res2.name, device_capacity:res2.capacity, name: exp.name, start_date: exp.start_date.substring(0,10), pods: res1})
          setModal({add: false, show: true})
        })
      })
    }
  }

  /*
  Input from: Frontend modal editor (react)
  Outputs to: addExperiment(), editExperiment()
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Verifies integrity of created/edited experiment object, closes modal editor
  Issues: Add more integrity checks
  */   
  function submitModal(close){
    if (experiment.name === null || experiment.name === ""){
      alert("Experiment name cannot be null.")
      return
    }

    if(modal.add){
      if(experiment.device === null){
        alert("Device cannot be null.")
        return
      }

      addExperiment()
    } else {
      editExperiment()
    }
    close();
  }

  /*
  Input from: submitModal()
  Outputs to: API -> database (backend)
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Pushes newly created 'experiment' object to backend
  */   
  async function addExperiment(e) {
    console.log("POD SELECTION: ", experiment.pod_selection)
    await axios
      .post(`/api/experiments/`, 
        { 
          name: experiment.name,
          device: experiment.device,
          pod_selection: experiment.pod_selection,
          start_date: experiment.start_date,
          recipe: experiment.recipe
        })
      .catch((err) => console.log(err));
    fetchExperiments();
  };

  /*
  Input from: submitModal()
  Outputs to: API -> database (backend)
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Pushes edited 'experiment' object changes to backend. Also patches pod changes
  */   
  async function editExperiment(e) {
    await axios
      .patch(`/api/experiments/${experiment.id}/`, 
      { 
        name: experiment.name,
        device: experiment.device,
        recipe: experiment.recipe
      })
      .then((res) => {
        fetchExperiments()
      })
      .catch((err) => console.log(err));

    for (const [key, value] of Object.entries(experiment.pod_selection)) {
      let pod_found = false;
      // pod 0: [{position: 1, ...}]
      // what if experiment.pods does not have all filled pods? what if only 4 pods in pod list, but not a fifth?
      for(let p = 0; p < experiment.pods.length; p++) {
        // found the pod to be replaced
        if(experiment.pods[p].position === parseInt(key)) {
          axios
            .patch(`/api/pods/${experiment.pods[p].id}/`, { end_date: experiment.start_date }) // end date set to today
            .catch((err) => console.log(err));
          
          // if a new pod was specified for replacement and it WASNT the empty pod option
          if(value !== '') {  
            axios
            .post(`/api/pods/`, { start_date: experiment.start_date, position: parseInt(key), plant: parseInt(value), experiment: experiment.id }) // end date set to today
            .catch((err) => console.log(err));
          }
          pod_found = true
          break
        }
      }

      // otherwise, if no replaceable pod is found, just create a new one
      if(!pod_found) {
        axios
          .post(`/api/pods/`, 
            { 
              start_date: experiment.start_date,
              position: parseInt(key),
              plant: parseInt(value), 
              experiment: experiment.id,
            })
          .catch((err) => console.log(err));
      }
    }
    fetchExperiments();
  };

  /*
  Input from: renderAvailableDevices()
  Outputs to: Experiment object
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Sets the device to be used during experiment selection in modal
  */   
  function setDevice(e){
    let selected_device = available_devices.find(device => device.id.toString() === e.target.value)
    //console.log("SELECTED DEVICE ID: ", selected_device)
    if(selected_device === undefined) {
      setExperiment({...experiment, device: null, device_capacity: null})
    } else {
      setExperiment({...experiment, device: selected_device.id, device_capacity: selected_device.capacity})
    }
  }

  /*
  Input from: renderModal()
  Outputs to: Experiment object
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Sets the device currently being used by a selected experiment object
  */   
  function renderAvailableDevices(){
    return (
      <select className="device_selection" defaultValue={experiment.device} name="device" onChange={(e) => setDevice(e)}>
        { modal.add ? <option key={null} value={null}>SELECT DEVICE</option> : <option key={experiment.device} value={experiment.device}> {experiment.device_name ?? null} </option>  }
        {available_devices.map(item => (
            <option key={item.id} value={item.id}> {item.name} </option>
        ))}
        
      </select>
    )
  }

  function setPod(e){
    let position = e.target.name.substring(4); 
    let temp = experiment.pod_selection
    temp[position] = e.target.value
    setExperiment({...experiment, pod_selection: temp})
    //console.log(experiment.pod_selection)
  }

  function setRecipe(e){
    setExperiment({...experiment, recipe: e.target.value})
    //console.log("RECIPE:", experiment.recipe)
  }

  function renderPodSelection(){
    let pod_container = []
    // so long as pods is loaded
    if (experiment.device !== null) {
      for(let i = 0; i < experiment.device_capacity; i++) {
        let curr_pod = experiment.pods.filter(pod => pod.position === (i+1))[0] ?? null
        let plant = null;      

        if (curr_pod !== null){
          plant = curr_pod['plant']
        }

        pod_container.push(
          <select className="pod" name={"pod_"+(i+1)} defaultValue={plant} onChange={(e) => setPod(e)}>
              <option value={null}></option>
              {plantList.map(item => (
                  <option key={item.id} value={item.id}> {item.name} </option>
              ))}
          </select>
        )
      }
    }
    return pod_container
  }

  function renderRecipeSelection(){
    return (
      <select className="experiment_recipe_selection" name="experiment_recipe_selection" default_value="null" onChange={(e) => setRecipe(e)}>
        <option value={null}></option>
        {recipeList.map(item => (
          <option key={item.id} value={item.id}> {item.name} </option>
        ))}
      </select>
    )
  }
 
  function renderModal(){
    return (
      <div>
          <div className="form_row">
            <input name="name" value={experiment.name} placeholder = {"Experiment Name"} onChange={(e) => setExperiment({...experiment, name: e.target.value})} />
          </div>
          <div className="form_row">
            {renderAvailableDevices()}
          </div>
          <div className="form_row">
            <input className="date_selection" type="date" name="start_date" value={experiment.start_date} onChange={(e) => setExperiment({...experiment, start_date: e.target.value})} />
          </div>
          <div className="form_row">{renderPodSelection()}</div>
          <div className="form_row">{renderRecipeSelection()}</div>

      </div>
    )
  }

  function closeModal(){
    setModal({...modal, show: false}) 
    setExperiment({name: null, device: null, device_name: null, pods: [], start_date: year+"-"+month+"-"+day, pod_selection: {}})
  }

  return (
    <div>
        <button onClick={() => openModal(null)}>+</button>
        {experimentList.map(item => (
            <div key={item.id} className="item">
                <div className="object_container">
                  <div className="object_top">

                    <div className="object_description">
                        <div className="bold_font">
                            {item.device_name} <span className="normal_font">{ " | " + item.name + ": "} </span>
                            <div style={{display:'inline', color: item.end_date === null ? 'gold':'green'}}>{item.end_date === null ? "ACTIVE":"CONCLUDED"}</div>
                        </div>
                        {item.score !== null ? <div>Score: { item.score } </div> : <></>}
                    </div>
                    <div className="object_content">                          
                        <PodCarousel experimentID={item.id} deviceId={item.device}></PodCarousel>
                    </div>
                    <div className='object_actions'>
                        <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                        {item.end_date === null ? <li key="edit"><button onClick={() => openModal(item)}>EDIT</button></li> : <></>}
                        {item.end_date === null ? <li key="conclude"><button onClick={() => { if (window.confirm(`You are about to conclude experiment ${item.id}, ${item.name}`)) concludeExperiment(item.id) }}>CONCLUDE EXPERIMENT</button></li>: <></> }
                        {item.end_date === null ? <li key="add_reading"><ExperimentReading exp_id={item.id}></ExperimentReading></li> : <></> }
                    </div>
                  </div>
                  <RecipeBar recipe={item.recipe} phaseList={phaseList} recipe_name = {item.recipe_name} experiment={item}></RecipeBar>
              </div>
            </div>
        ))}
        <div>
            <Popup open={modal.show} onClose={() => closeModal()} modal nested>
              {(close) => (
                <div className="modal" onClick={close}>
                  <div className="modal_body" onClick={e => e.stopPropagation()}>
                    <div className="modal_type"> { modal.add === true ? "Add Experiment" : "Edit Experiment" } </div>
                    <div className="modal_content">
                      { 
                        renderModal()
                      }

                      <button className='save' onClick={() => {
                        submitModal(close);
                      }}>Save</button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
        </div>
    </div>

  );
}

export default ExperimentList;