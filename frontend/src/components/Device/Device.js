import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import Popup from "reactjs-popup";
import PodCarousel from "../Experiment/PodCarousel"
import ExperimentReading from "../Experiment/ExperimentReading"
import RecipeBar from '../Recipe/RecipeBar';
import "./device.css"

let today_date = new Date();
console.log("CURRENT DATE: ", today_date)
let year = today_date.getUTCFullYear();
let month = today_date.getUTCMonth() + 1;
month = month > 9 ? month : '0'+month;
let day = today_date.getUTCDate();
day = day > 9 ? day : '0'+day;

const Device = () => {
    const [loaded_devices, set_loaded_devices] = useState([]); // list of device objects
    const [available_devices, set_available_devices] = useState([]); // list of device objects
    const [selected_device_status, set_selected_device_status] = useState("all");
    const [device, set_device] = useState({
        add: true, 
        show: false, 
        id: -1, 
        experiment: -1, 
        recipe: -1,
        name: null, 
        mac_address: null
    });

    const [experiment, setExperiment] = useState({
        id: null,
        name: null,
        device: null,
        device_name:null,
        device_capacity: null,
        pods: [],
        pod_selection: {},
        start_date: year+"-"+month+"-"+day,
        recipe: null
      })

    const [command, set_command] = useState({
        show: false,
        id: 0,
        device: -1,
        hour: 0,
        minute: 0,
        cycle: 0,
        stage: 0,
        timezone: "Etc/GMT-7",
        response: {}
    });

    const [phase_list, set_phase_list] = useState([])
    const [recipe_list, set_recipe_list] = useState([])
    const [plant_list, setPlantList] = useState([]);


    async function fetch_loaded_devices() {
        const result = await axios(
          '/api/experiments/loaded_devices/',
        );
        set_loaded_devices(result.data)
    } 
    
    async function fetch_available_devices() {
        const result = await axios(
          '/api/experiments/available_devices/',
        );
        set_available_devices(result.data)
    } 

    async function fetch_phases() {
        const result = await axios(
          '/api/phases/',
        );
        set_phase_list(result.data)
    } 

    async function fetch_recipes() {
        const result = await axios(
          '/api/recipes/',
        );
        set_recipe_list(result.data)
    } 

    async function fetchPlants() {
        const result = await axios(
          '/api/plants/',
        );
        setPlantList(result.data)
      }

    function updateRecipeBar() {
        console.log("UPDATE RECIPE BAR");
    }
      
    async function concludeExperiment(id) {
        let today_date = new Date();
        let year = today_date.getUTCFullYear();
        let month = today_date.getUTCMonth() + 1;
        month = month > 9 ? month : '0'+month;
        let day = today_date.getUTCDate();
        day = day > 9 ? day : '0'+day;

        await axios.patch(`/api/experiments/${id}/`, { end_date: year+"-"+month+"-"+day });
        fetch_loaded_devices()
        fetch_available_devices()
    }

    useEffect(() => {
        fetch_available_devices();
        fetch_loaded_devices();
        fetch_phases();
        fetch_recipes();
        fetchPlants();
    }, []); // run once after start

    /*
    useEffect(() => {
    }, [loaded_devices, available_devices]);
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

    function check_devices_online(){
        axios
        
            .post(`/api/devices/check_devices_online/`)
            .then((res) => {

                // for each device, determine if online or offline
                res.data.forEach((device) => {
                    let index = loaded_devices.findIndex(d => d.device_id === device.id)
                    if(index === -1) {
                        index = available_devices.findIndex(d => d.id === device.id)
                        if (available_devices[index].is_online !== device.is_online){
                            let updated_device = available_devices[index]
                            updated_device.is_online = device.is_online
                            set_available_devices([
                            ...available_devices.slice(0, index),
                            updated_device,
                            ...available_devices.slice(index + 1)
                            ])
                        }
                    } else {
                        if (loaded_devices[index].is_online !== device.is_online){
                            let updated_device = loaded_devices[index]
                            updated_device.is_online = device.is_online
                            set_loaded_devices([
                            ...loaded_devices.slice(0, index),
                            updated_device,
                            ...loaded_devices.slice(index + 1)
                            ])
                        }
                    }
                })
            }).catch((err) => console.log("LD error: ", err))
    }

    useInterval(() => {
        check_devices_online()
    }, 60000);

    function renderNav() {
        return (
          <div className="nav" id="nav" style={{fontSize: "12px"}}>
            <span className={selected_device_status === "all" ? "nav-link active" : "nav-link"} onClick={() => set_selected_device_status("all")}>
              ALL
            </span>
            <span className={selected_device_status === "loaded" ? "nav-link active" : "nav-link"} onClick={() => set_selected_device_status("loaded")}>
              LOADED DEVICES
            </span>
            <span className={selected_device_status === "free" ? "nav-link active" : "nav-link"} onClick={() => set_selected_device_status("free")}>
              FREE DEVICES
            </span>
          </div>
        );
      };

    async function send_command(e){
        e.preventDefault()
        set_command({...command, response: {}})
        console.log(command.id, command)
        const result = await axios
          .post(`/api/devices/send_command/`, 
            { 
                id: command.id,
                parameters: command
            });
        
        /*
        let index = loaded_devices.findIndex(d => d.id === id)
        let updated_device = loaded_devices[index]
        updated_device['current_recipe'] = result.data.current_recipe
        updated_device['dailyStartTime'] = result.data.dailyStartTime

        set_loaded_devices([
            ...loaded_devices.slice(0, index),
            updated_device,
            ...loaded_devices.slice(index + 1)
        ])
        */
        set_command({...command, response: result.data})
    }

    /*
    async function mqtt_device_start_time(){
        const result = await axios
          .post(`/api/devices/set_device_start_time/`, 
            { 
                device: device.id,
                //hour: parseInt(device.hour),
                //minute: parseInt(device.minute),
            });
        fetch_loaded_devices();
    }
    */

    /* this calls the 'change_recipe()' function in the backend (views.py), which sends the recipe of an experiment to a device via MQTT */
    async function change_recipe(){
        const result = await axios
        .post(`/api/devices/change_recipe/`, 
          { 
              device_id: experiment.device,
              new_recipe_id: parseInt(experiment.recipe)

          });
        let index = loaded_devices.findIndex(d => d.id === device.id)
        if(index !== -1) {
            let updated_device = loaded_devices[index]
            updated_device['current_recipe'] = result.data.current_recipe
            updated_device['dailyStartTime'] = result.data.dailyStartTime
            set_loaded_devices([
                ...loaded_devices.slice(0, index),
                updated_device,
                ...loaded_devices.slice(index + 1)
            ])
        }
    }

    function renderDevices(){
        const device_list = []
        if (selected_device_status === 'loaded' || selected_device_status === 'all'){   

            loaded_devices.map((item) => {
                device_list.push(
                    <div key={'loaded_' + item.id} className="object_container">
                        <div className="object_top">
                            <div className="object_description">
                                <div className="object_name tooltip" data-tooltip={"DEVICE ID: "+item.device_id + " | MAC: " + item.mac_address.toUpperCase()}>
                                    {item.device_name + " | " + item.name} 
                                    <div className="blink_me" style={{ color: item.is_online ? 'green': 'red'}}>●</div>
                                </div>
                                {item.score !== null ? <div>Score: { item.score } </div>: <></>}
                            </div>
                            <div className="object_content">                          
                                <PodCarousel experimentID={item.id} deviceId={item.device}></PodCarousel>
                            </div>
                        </div>
                        <RecipeBar phase_list = {phase_list} recipe = {item.recipe_id} recipe_name = {item.current_recipe} experiment = {item}></RecipeBar>

                        <div className='object_actions'>
                            <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                            {/*<li key="edit"><button onClick={() => set_device({...device, show:true, name: item.device_name, device: item.device})}>EDIT</button></li> */}
                            {item.end_date === null && <li key="conclude"><button onClick={() => { if (window.confirm(`Conclude experiment "${item.name}"?`)) concludeExperiment(item.id) }}> CONCLUDE EXPERIMENT</button></li> }
                            <li key="add_reading"><ExperimentReading exp_id={item.id} exp_name={item.name} updateRecipeBar={updateRecipeBar()}></ExperimentReading></li>
                            {item.is_online ? <li key="send_command"><button onClick={() => set_command({...command, show: true, device: item.device_id})}>SEND COMMAND</button></li> : <></>}
                            {/*<li key="device_state"><button onClick={() => get_device_state(item.id)}>GET DEVICE STATE</button></li>*/}
                        </div>
                    </div>
                )
            })
        }

        if (selected_device_status === 'free' || selected_device_status === 'all'){
            available_devices.map((item) => {
                device_list.push(
                    <div key={'free_' + item.id}  className="object_container">
                        <div className="object_top">
                            <div className="object_description">
                            <div className="object_name tooltip" data-tooltip={"DEVICE ID: "+item.id + " | MAC: " + item.mac_address.toUpperCase()} >
                                { item.name }
                                <div className="blink_me" style={{ color: item.is_online ? 'green': 'red'}}>●</div>
                            </div>
                            

                            {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                            </div>
                        </div>
                        {item.is_online ?  <div className= "empty_object" onClick={() => {set_device({...device, show:true}); setExperiment({...experiment, device:item.id, device_name:item.name, device_capacity:item.capacity});}}>  ADD EXPERIMENT</div> : <div className= "empty_object">DEVICE OFFLINE</div>}
                       
                        <div className='object_actions'>
                            <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                            {/*<li key="device_state"><button onClick={() => get_device_state(item.id)}>GET DEVICE STATE</button></li>*/}
                            {item.is_online ? <li key="send_command"><button onClick={() => set_command({...command, show: true, device: item.id})}>SEND COMMAND</button></li>: <></>}
                        </div>
                    </div>
                )
            })
        }
        return device_list
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
        for(let i = 0; i < experiment.device_capacity; i++) {
            let curr_pod = experiment.pods.filter(pod => pod.position === (i+1))[0] ?? null
            let plant = null;      

            if (curr_pod !== null){
                plant = curr_pod['plant']
            }

            pod_container.push(
                <select className="pod" name={"pod_"+(i+1)} defaultValue={plant} onChange={(e) => setPod(e)}>
                    <option value={null}></option>
                    {plant_list.map(item => (
                        <option key={item.id} value={item.id}> {item.name} </option>
                    ))}
                </select>
            )
        }
        return pod_container
    }

    function renderRecipeSelection(){
        return (
            <select className="experiment_recipe_selection" name="experiment_recipe_selection" default_value="null" onChange={(e) => setRecipe(e)}>
                <option value={null}></option>
                {recipe_list.map(item => (
                    <option key={item.id} value={item.id}> {item.name} </option>
                ))}
            </select>
            /*
            <Popup open={device.show} onClose={() => set_device({...device, show: false, id: -1})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                        <div className="modal_content">
                            <div className="form_row">
                            { device.add === true 
                                // ? <input value={device.name} placeholder="Device Name" onChange={(e) => {set_device({...device, name: e.target.value})}} />
                                ? "IN PROGRESS OF CHANGING"
                                : ""
                            }
                            </div>
                            <button className='save' onClick={() => {
                                
                                if(device.add===true){
                                    addDevice()
                                } else {
                                    editDevice()
                                }

                                //mqtt_device_start_time();
                                close();
                            }}>Save</button>
                        </div>
                    </div>
                </div>
                )}
            </Popup>
            */
        )
    }

    function submitModal(close){
        if (experiment.name === null || experiment.name === ""){
          alert("Experiment name cannot be null.")
          return
        }
        console.log("EXPERIMENT: ", experiment);
    
        axios
        .post(`/api/experiments/`, 
          { 
            name: experiment.name,
            device: experiment.device,
            pod_selection: experiment.pod_selection,
            start_date: experiment.start_date,
            recipe: experiment.recipe
          })
        .then(res =>{
            change_recipe()
            fetch_available_devices();
            fetch_loaded_devices();
        })
        .catch((err) => console.log(err));
        
        close();

    }

    function renderModal(){
        return (
            <Popup open={device.show} onClose={() => {set_device({...device, show: false}); closeModal();} } modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                        <div className="modal_content">
                            <div> DEVICE {experiment.device_name} </div>
                            <div className="form_row">
                                <input name="name" value={experiment.name} placeholder = {"Experiment Name"} onChange={(e) => setExperiment({...experiment, name: e.target.value})} />
                            </div>
                            <div className="form_row">
                                <input className="date_selection" type="date" name="start_date" value={experiment.start_date} onChange={(e) => setExperiment({...experiment, start_date: e.target.value})} />
                            </div>
                            <div className="form_row">{renderPodSelection()}</div>
                            <div className="form_row">{renderRecipeSelection()}</div>

                            <button className='save' onClick={() => {
                                submitModal(close);
                            }}>Save</button>

                        </div>
                    </div>
                </div>
                )}
            </Popup>
        )
    }

    function closeModal(){
        setExperiment({name: null, device: null, device_name: null, pods: [], start_date: year+"-"+month+"-"+day, pod_selection: {}})
    }


    function renderCommandParameters(id){
        switch(true) {
            case id == 7:
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
            case id == 11:
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
            case id == 14:
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
        }
        return
    }

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
                                Device ID: {command.device}
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
                                send_command(e)
                                // close()
                            }}>Send Command</button>
                        </div>
                    </div>
                </div>
                )}
            </Popup>
        )
    }

    return (
        <div>
            {renderNav()}
            {renderDevices()}
            {/*<button onClick={() => set_device({device, show: true, add:true})}>+</button>*/}
            {renderModal()}
            {renderCommand()}
            {/*{renderChangeRecipe()}*/}
        </div>
      );
}

export default Device