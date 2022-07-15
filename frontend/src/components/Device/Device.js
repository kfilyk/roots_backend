import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import axios from "axios";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import Popup from "reactjs-popup";
import PodCarousel from "../Experiment/PodCarousel"
import ExperimentReading from "../Experiment/ExperimentReading"
import RecipeBar from '../Recipe/RecipeBar';
import "./device.css"

const Device = () => {
    const [loaded_devices, set_loaded_devices] = useState([]);
    const [free_devices, set_free_devices] = useState([]);
    const [selected_device_status, set_selected_device_status] = useState("all");
    const [device, set_device] = useState({
        add: true, 
        show: false, 
        id: -1, 
        experiment_id: -1, 
        name: null, 
        token: null,
        mac_address: null

    });
    const [phase_list, set_phase_list] = useState([])

    async function fetch_loaded_devices() {
        const result = await axios(
          '/api/experiments/loaded_devices/',
        );
        set_loaded_devices(JSON.parse(JSON.stringify(result.data)))
    } 
    
    async function fetch_free_devices() {
        const result = await axios(
          '/api/experiments/available_devices/',
        );
        set_free_devices(result.data)
    } 

    async function fetch_phases() {
        const result = await axios(
          '/api/phases/',
        );
        set_phase_list(result.data)
    } 

    async function terminateExperiment(id) {
        let today_date = new Date();
        let year = today_date.getUTCFullYear();
        let month = today_date.getUTCMonth() + 1;
        month = month > 9 ? month : '0'+month;
        let day = today_date.getUTCDate();
        day = day > 9 ? day : '0'+day;

        await axios.patch(`/api/experiments/${id}/`, { end_date: year+"-"+month+"-"+day });
        fetch_loaded_devices()
        fetch_free_devices()
      }
    
    useEffect(() => {
        fetch_free_devices();
        fetch_loaded_devices();
        fetch_phases();
    }, []); // run once after start

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
        let device_ids = loaded_devices.map(device => device.device_id);
        // let device_ids = [1, 2, 4, 5, 6, 7]
        axios
            .post(`/api/devices/check_devices_online/`, 
                { 
                    devices: device_ids
                })
            .then((res) => {
                res.data.forEach((device) => {
                    let index = loaded_devices.findIndex(d => d.device_id === device.id)
                    if (loaded_devices[index].device_is_online !== device.device_is_online){
                        let updated_device = loaded_devices[index]
                        updated_device.device_is_online = device.device_is_online
                        set_loaded_devices([
                        ...loaded_devices.slice(0, index),
                        updated_device,
                        ...loaded_devices.slice(index + 1)
                        ])
                    }
                })
            }).catch((err) => console.log("LD error: ", err))
    }

    useInterval(() => {
        check_devices_online()
    }, 300000);

    async function addDevice() {
        await axios.post(`/api/devices/`, 
            { 
                name: device.name,
                mac_address: device.mac_address,
                token: device.token,
            });
        fetch_free_devices();
        fetch_loaded_devices();

    }

    async function deleteDevice(id) {
        await axios.delete(`/api/devices/${id}/`);
        fetch_free_devices();
        fetch_loaded_devices();
    }

    async function editDevice() {
        await axios.patch(`/api/devices/`, 
        { 
            name: device.name,
            mac_address: device.mac_address,
            token: device.token,
        });
        fetch_free_devices()
        fetch_loaded_devices();
    }

    async function setExperiment(e) {
        const result = await axios
          .post(`/api/experiments/set_device/`, 
            { 
                exp_id: device.experiment,
                device_id: device.id
            });
        if (result.status === 200) {
            set_free_devices(free_devices.filter(d => d.id !== device.id))
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
        let index = loaded_devices.findIndex(d => d.id === id)
        let updated_device = loaded_devices[index]
        updated_device['currentRecipe'] = result.data.currentRecipe
        updated_device['dailyStartTime'] = result.data.dailyStartTime

        set_loaded_devices([
            ...loaded_devices.slice(0, index),
            updated_device,
            ...loaded_devices.slice(index + 1)
        ])
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

    function renderDevices(){
        const device_list = []
        if (selected_device_status === 'loaded' || selected_device_status === 'all'){   

            loaded_devices.map((item) => {
                device_list.push(
                    <div key={'loaded_' + item.id} className="object_container">
                        <div className="object_top">
                            <div className="object_description">
                                <div className="object_name">
                                    { item.device_name } 
                                    <div className="blink_me" style={{ color: item.device_is_online ? 'green': 'red'}}>●</div>
                                    <div>{item.device_is_online}</div>
                                </div>
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
                            <li key="edit"><button onClick={() => set_device({...device, show:true, name: item.device_name, device: item.device, token: item.token})}>EDIT</button></li>
                            <li key="terminate"><button onClick={() => { if (window.confirm(`You are about to terminate experiment "${item.name}"`)) terminateExperiment(item.id) }}> TERMINATE EXPERIMENT</button></li>
                            <li key="add_reading"><ExperimentReading exp_id={item.id} exp_name={item.name}></ExperimentReading></li>
                            <li key="device_state"><button onClick={() => get_device_state(item.id)}>GET DEVICE STATE</button></li>
                            {/*<li key="device_start_time"><button onClick={() => set_device({...device, show: true, device: item.id})}>SET DEVICE START TIME</button></li> */}
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
                            <li key="edit"><button onClick={() => set_device({...device, show:true, name: item.device_name, device: item.device, token: item.token})}>EDIT</button></li>
                            <li key="add"><button onClick={() => set_device({...device, show:true})}>ADD EXPERIMENT</button></li>
                            <li key="delete"><button onClick={() => deleteDevice(item.id)}>DELETE</button></li>  
                            <li key="device_state"><button onClick={() => get_device_state(item.id)}>GET DEVICE STATE</button></li>
                            {/*<li key="device_start_time"><button onClick={() => set_device({...device, show: true, device: item.id})}>SET DEVICE START TIME</button></li> */}
                        </div>
                    </div>
                )
            })
        }
        return device_list
    }

    function renderModal(){
        return (
            <Popup open={device.show} onClose={() => set_device({...device, show: false, id: -1, token: null})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                        <div className="modal_content">
                            <div className="form_row">
                                <input value={device.name} placeholder="Device Name" onChange={(e) => {set_device({...device, name: e.target.value})}} />
                            </div>
                            <div className="form_row">
                                <input value={device.mac_address} placeholder="MAC Address" onChange={(e) => {set_device({...device, mac_address: e.target.value})}} />
                            </div>
                            <div className="form_row">        
                                <input value={device.token} placeholder="Token" onChange={(e) => {set_device({...device, token: e.target.value})}} />
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
        )
    }

    return (
        <div>
            {renderNav()}
            {renderDevices()}
            <div style={{display: "none"}}>
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
                    <div>How to with AVA: Adding Your Trellis</div>
                    <br></br>
                    <QRCode value="https://www.youtube.com/watch?v=Zce2NUfoj0w&ab_channel=AVASmartIndoorGarden" /> 
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
                <div style={{ background: 'white', padding: '16px' }}>
                    <div>How to With AVA: Enable Offline Mode</div>
                    <br></br>
                    <QRCode value="https://www.youtube.com/watch?v=jgvtICzs078&ab_channel=AVASmartIndoorGarden" /> 
                </div>
            </div>
            <button onClick={() => set_device({device, show: true, add:true})}>+</button>

            {renderModal()}
        </div>
      );
}

export default Device