import React, { useState, useEffect } from 'react';
import axios from "axios";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import PodCarouselTwo from "../Experiment/PodCarouselTwo"

const Device = () => {
    const [loaded_devices, set_loaded_devices] = useState([]);
    const [free_devices, set_free_devices] = useState([]);
    const [selected_device_status, set_selected_device_status] = useState("all");

    async function fetch_loaded_devices() {
        const result = await axios(
          '/api/experiments/loaded_devices/',
        );
    
        set_loaded_devices(result.data)
    } 
    
    useEffect(() => {
        fetch_loaded_devices();
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

                device_list.push(
                    <div key={item.id} className="object_container">
                        <div className="object_description">
                            <div className="object_name">{ item.device_name }</div>
                            {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                            <div className="object_name">{ item.name }</div>
                            <div>Date: {item.start_date} {"->"} {item.end_date}</div>
                            <div>Score: { item.score } </div>
                        </div>
                        <div className="object_content">                          
                            <PodCarouselTwo experimentID={item.id} deviceId={item.device}></PodCarouselTwo>
                        </div>
                        <div className='object_actions'>
                        <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                        <li key="edit"><button onClick={() => {}}>EDIT</button></li>
                        <li key="delete"><button onClick={() => {}}>DELETE</button></li>
                        </div>
                    </div>
                )
            })
        }

        if (selected_device_status === 'free' || selected_device_status === 'all'){
            free_devices.map((item) => {
                device_list.push(
                    <div key={item.id} className="object_container">
                        <div className="object_description">
                        <div className="object_name">{ item.name }</div>
                        <div>Device ID: { item.id }</div>
                        {/* <div>Registered: { item.registration_date.substring(0, 10) }</div> */}
                        <div>Number of Pods: { item.device_capacity }</div>
                        </div>
                        <div className='object_actions'>
                            <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                            <li key="edit"><button onClick={() => {}}>EDIT</button></li>
                            <li key="delete"><button onClick={() => {}}>DELETE</button></li>
                        </div>
                    </div>
                )
            })
        }

        return device_list
    }

    return (
        <div>
            {renderNav()}
            {renderDevices()}
        </div>
      );
}

export default Device