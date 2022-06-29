import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'react-qr-code';
import axios from "axios";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import Popup from "reactjs-popup";
import PodCarousel from "../Experiment/PodCarousel"
import ExperimentReading from "../Experiment/ExperimentReading"
import RecipeBar from '../Recipe/RecipeBar';

//ReactDOM.render(<QRCode value="hey" />, document.getElementById("nav"));

const Device = () => {
    const [loaded_devices, set_loaded_devices] = useState([]);
    const [free_devices, set_free_devices] = useState([]);
    const [selected_device_status, set_selected_device_status] = useState("all");
    const [available_experiments, set_available_experiments] = useState([]);
    const [modal, set_modal] = useState({show: false, device: -1, experiment: -1});
    const [phase_list, set_phase_list] = useState([])
    const [edit_device, set_edit_device] = useState({show: false, device: -1, hour: 12, minute: 59});
    const closeModal = () => set_modal(false);

    async function fetch_loaded_devices() {
        const result = await axios(
          '/api/experiments/loaded_devices/',
        );
        set_loaded_devices(result.data)
    } 

    async function fetch_phases() {
        const result = await axios(
          '/api/phases/',
        );
        set_phase_list(result.data)
    } 
    
    useEffect(() => {
        fetch_loaded_devices();
        fetch_phases();
    }, []);

    async function fetch_available_experiments() {
        const result = await axios(
          '/api/experiments/available_experiments/',
        );
        set_available_experiments(result.data)
    } 

    useEffect(() => {
        fetch_available_experiments();
    }, []);


    async function fetch_free_devices() {
        const result = await axios(
          '/api/experiments/available_devices/',
        );
        set_free_devices(result.data)
    } 

    useEffect(() => {
        fetch_free_devices();
    }, []);

    async function setExperiment(e) {
        const result = await axios
          .post(`/api/experiments/set_device/`, 
            { 
                exp_id: modal.experiment,
                device_id: modal.device
            });
        if (result.status === 200) {
            set_free_devices(free_devices.filter(device => device.id !== modal.device))
            fetch_loaded_devices()
        }
    };

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

    async function get_device_state(id){
        const result = await axios
          .post(`/api/devices/get_device_state/`, 
            { 
                device: id
            });
        let index = loaded_devices.findIndex(device => device.id === id)
        let updated_device = loaded_devices[index]
        updated_device['currentRecipe'] = result.data.currentRecipe
        updated_device['dailyStartTime'] = result.data.dailyStartTime

        set_loaded_devices([
            ...loaded_devices.slice(0, index),
            updated_device,
            ...loaded_devices.slice(index + 1)
        ])
    }

    async function mqtt_device_start_time(){
        const result = await axios
          .post(`/api/devices/set_device_start_time/`, 
            { 
                device: edit_device.device,
                hour: parseInt(edit_device.hour),
                minute: parseInt(edit_device.minute),
            });
        let index = loaded_devices.findIndex(device => device.id === edit_device.device)
        let updated_device = loaded_devices[index]
        updated_device['dailyStartTime'] = result.data.device_start_time

        set_loaded_devices([
            ...loaded_devices.slice(0, index),
            updated_device,
            ...loaded_devices.slice(index + 1)
        ])
    }

    function renderDevices(){
        const device_list = []
        if (selected_device_status === 'loaded' || selected_device_status === 'all'){   

            loaded_devices.map((item) => {
                device_list.push(
                    <div key={'loaded_' + item.id} className="object_container">
                        <div className="object_top">
                            <div className="object_description">
                                <div className="object_name">{ item.device_name }</div>
                                {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                                <div className="object_name">{ item.name }</div>
                                {/* <div>Date: {item.start_date} {"->"} {item.end_date}</div> */}
                                <div>Score: { item.score } </div>
                                <div>Current Recipe: { item.currentRecipe ? item.currentRecipe : "N/A"} </div>
                                <div>Daily Start Time: { item.dailyStartTime ? item.dailyStartTime : "N/A"} </div>
                            </div>
                            <div className="object_content">                          
                                <PodCarousel experimentID={item.id} deviceId={item.device}></PodCarousel>
                            </div>
                        </div>
                        <RecipeBar phase_list = {phase_list} recipe = {item.recipe_id} experiment = {item}></RecipeBar>

                        <div className='object_actions'>
                        <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                            <li key="edit"><button onClick={() => {}}>EDIT</button></li>
                            <li key="delete"><button onClick={() => {}}>DELETE</button></li>
                            <li key="add_reading"><ExperimentReading exp_id={item.id}></ExperimentReading></li>
                            <li key="device_state"><button onClick={() => get_device_state(item.id)}>GET DEVICE STATE</button></li>
                            <li key="device_start_time"><button onClick={() => set_edit_device({...edit_device, show: true, device: item.id})}>SET DEVICE START TIME</button></li>
                        </div>
                    </div>
                )
            })
        }

        if (selected_device_status === 'free' || selected_device_status === 'all'){
            free_devices.map((item) => {
                device_list.push(
                    <div key={'free_' + item.id}  className="object_container">
                        <div className="object_description">
                        <div className="object_name">{ item.name }</div>
                        <div>Device ID: { item.id }</div>
                        {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                        <div>Number of Pods: { item.capacity }</div>
                        </div>
                        <div className='object_actions'>
                            <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                            <li key="add"><button onClick={() => openModal(item.id)}>Add Experiment</button></li>
                        </div>
                    </div>
                )
            })
        }

        return device_list
    }

    function openModal(device){
        set_modal({...modal, show: true, device: device})
    }
    

    function renderModal(){
        return (
            <Popup open={modal.show} onClose={() => set_modal({...modal, show: false})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                    <div className="modal_type"> Device: {} </div>
                    <div className="modal_content">

                    
                    <div className="form_row">
                            <label> Experiment: </label> 
                            <select className="" defaultValue={modal.experiment} name="experiment" onChange={(e) => set_modal({...modal, experiment: e.target.value})}>
                                <option key={-1} value={-1}> SELECT EXPERIMENT </option>
                                {available_experiments.map(item => (
                                    <option key={item.id} value={item.id}> {item.name} </option>
                                ))}
                            </select> 
                    </div>
                        <button className='save' onClick={() => {
                        setExperiment()
                        close();
                    }}>Save</button>
                        </div>

                    </div>
                </div>
                )}
            </Popup>
        )
    }

    function renderDeviceEdit(){
        return (
            <Popup open={edit_device.show} onClose={() => set_edit_device({...edit_device, show: false})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                    <div className="modal_type"> Device: {edit_device.device} </div>
                    <div className="modal_content">

                    <div className="form_row">
                            <label> Hour:</label> 
                            <input type="number" value={edit_device.hour} min={1} max={23} onChange={(e) => {set_edit_device({...edit_device, hour: e.target.value})}} />
                    </div>
                    <div className="form_row">        
                            <label> Minute:</label> 
                            <input type="number" value={edit_device.minute} min={0} max={59} onChange={(e) => {set_edit_device({...edit_device, minute: e.target.value})}} />
                    </div>
                        <button className='save' onClick={() => {
                        mqtt_device_start_time()
                        close();
                    }}>Save</button>
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
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Unboxing & Putting Water Float Back into Place</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=d-p09zEge5g" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Putting Water Float Back into Place</div>
                <br></br>
                <QRCode value="https://www.youtube.com/clip/UgkxqKL_0N-7qb1ufg6ZFTUG-96uz5n2ZfQz" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Connecting to WIFI</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=8loSZ5RixKw" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Add A Pod Pack (Greens)</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=Faq64uvKT1Q&ab_channel=AVASmartIndoorGarden" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Add a Pod Pack (Tomatoes)</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=5WfZrKlQrPo" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Trellis Assembly</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=5VE1XkKvDwk" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Dome Removal</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=AMdcnrt_Oc8" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Adding Nutrients</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=l_zE1_wBRCo" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Pruning Technique (Herbs)</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=UrY4cWatDQ4&feature=youtu.be" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Filling Water Reservoir</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=V2GzstdmDvM&feature=youtu.be&ab_channel=AVASmartIndoorGarden" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to with AVA: Reconnect your Pump (orange flashing light)</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=PvQEg7PERgs&ab_channel=AVASmartIndoorGarden" /> 
            </div>
            <div style={{ background: 'white', padding: '16px' }}>
                <div>How to With AVA: Thinning Plants</div>
                <br></br>
                <QRCode value="https://www.youtube.com/watch?v=Ycn4C5_RyF0" /> 
            </div>
            {renderModal()}
            {renderDeviceEdit()}
        </div>
      );
}

export default Device