import React, { useState, useEffect } from 'react';
import axios from "axios";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import Popup from "reactjs-popup";
import PodCarousel from "../Experiment/PodCarousel"
import ExperimentReading from "../Experiment/ExperimentReading"
import RecipeBar from '../Recipe/RecipeBar';

const Device = () => {
    const [loaded_devices, set_loaded_devices] = useState([]);
    const [free_devices, set_free_devices] = useState([]);
    const [selected_device_status, set_selected_device_status] = useState("all");
    const [available_experiments, set_available_experiments] = useState([]);
    const [modal, set_modal] = useState({show: false, device: -1, experiment: -1});
    const [phase_list, set_phase_list] = useState([])
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

    async function fetch_recipe() {
        const result = await axios(
          '/api/recipes/',
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
          <div className="nav" style={{fontSize: "12px"}}>
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

    function renderDevices(){
        const device_list = []
 
        if (selected_device_status === 'loaded' || selected_device_status === 'all'){   

            loaded_devices.map((item) => {
                let recipe = fetch_recipe(item.id)
                device_list.push(
                    <div key={'loaded_' + item.id} className="object_container">
                        <div className="object_top">
                            <div className="object_description">
                                <div className="object_name">{ item.device_name }</div>
                                {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                                <div className="object_name">{ item.name }</div>
                                <div>Date: {item.start_date} {"->"} {item.end_date}</div>
                                <div>Score: { item.score } </div>
                            </div>
                            <div className="object_content">                          
                                <PodCarousel experimentID={item.id} deviceId={item.device}></PodCarousel>
                            </div>
                        </div>
                        <div className="object_bottom">
                            {/*<RecipeBar phase_list = {phase_list} recipe = {item.} ></RecipeBar>*/}

                        </div>


                        <div className='object_actions'>
                        <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                        <li key="edit"><button onClick={() => {}}>EDIT</button></li>
                        <li key="delete"><button onClick={() => {}}>DELETE</button></li>
                        <li key="add_reading"><ExperimentReading exp_id={item.id}></ExperimentReading></li>
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

    return (
        <div>
            {renderNav()}
            {renderDevices()}
            {renderModal()}
        </div>
      );
}

export default Device