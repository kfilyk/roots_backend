import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import PodCarousel from "./PodCarousel"
import vertical_menu_icon from "../../img/vertical_menu_icon.png"


let today_date = new Date();
let year = today_date.getUTCFullYear();
let month = today_date.getUTCMonth() + 1;
month = month > 9 ? month : '0'+month;
let day = today_date.getUTCDate();
day = day > 9 ? day : '0'+day;

const ExperimentList = () => {
  const [experiment_list, setExperimentList] = useState([]);
  const [plant_list, setPlantList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })

  const [available_devices, set_available_devices] = useState([])

  const [experiment, setExperiment] = useState({
    name: null,
    device: null,
    device_name: null,
    capacity: null,
    plants: [],
    start_date: year+"-"+month+"-"+day,
  })

  async function fetchData() {
    const result = await axios(
      '/api/experiments/',
    );
    setExperimentList(result.data)
  } 

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchPlants() {
    const result = await axios(
      '/api/plants/',
    );
    setPlantList(result.data)
  }
  
  async function fetchAvailableDevices() {
    const result = await axios(
      '/api/experiments/available_devices/',
    );
    set_available_devices(result.data)
  }

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    fetchAvailableDevices();
  }, []);


  async function deleteEntry(id) {
    await axios.delete(`/api/experiments/${id}/`);
    setExperimentList(experiment_list.filter(experiment => experiment.id !== id))
    fetchAvailableDevices()
  }

  function openModal(exp){
    if (exp === null ){
      setModal({add: true, show: true})
    } else {
      getDevice(exp.device).then(res => {
        // after passing in the experiment from the button click -> 
        console.log("DEVICE NAME: ", res)
        setExperiment({id: exp.id, device: exp.device, device_name: res.name, capacity:res.capacity, name: exp.name, start_date: exp.start_date.substring(0,10)})
        setModal({add: false, show: true})
      })
    }
  }

  function submitModal(){
    if(modal.add){
      addEntry()
    } else {
      editEntry()
    }
  }

  async function addEntry(e) {
    const result = await axios
      .post(`/api/experiments/`, 
        { 
          name: experiment.name,
          device: experiment.device,
          plants: experiment.plants,
          start_date: experiment.start_date,
        })
      .catch((err) => console.log(err));
    console.log("RESULT 2:", result)
    setExperimentList(experiment_list => [...experiment_list, result.data]);
  };

  async function editEntry(e) {
    const result = await axios
        .patch(`/api/experiments/${experiment.id}/`, 
        { 
            name: experiment.name,
            device: experiment.device

          }).catch((err) => console.log(err));
    const index = experiment_list.findIndex(exp => exp.id === experiment.id);
    const updatedItem = result.data
    setPlantList([
      ...experiment_list.slice(0, index),
      updatedItem,
      ...experiment_list.slice(index + 1)
    ])
  };

  function setDevice(e){
    console.log(e)
    let selected_device = available_devices.find(device => device.id === e.target.value)
    setExperiment({...experiment, device: selected_device.id, capacity: selected_device['capacity'] /*, plants:Array(5).fill(null) */})
  }

  async function getDevice(device_id){
    const device = await axios(
      `/api/devices/${device_id}/`
      )
      .catch((err) => console.log("ERROR: ", err));
    return device.data
  }

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
    let plant = e.target.value
    let position = e.target.name.substring(4); 
    let temp = experiment.plants
    temp[position] = plant
    setExperiment({...experiment, plants: temp})
  }

  function renderPodSelection(){
    console.log("EXPERIMENT: ", experiment)
    let pod_container = []
    if (experiment.device !== null){
      for(let i = 0; i < experiment.capacity; i++) {
        pod_container.push(
          <select className="pod_selection" name={"pod_"+(i)} defaultValue={null} onChange={(e) => setPod(e)}>
              <option key={null} value={null}> Empty </option>
              {plant_list.map(item => (
                  <option key={item.id} value={item.id}> {item.name} </option>
              ))}
          </select>
        )
      }
    }
    return pod_container
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
      </div>
    )
  }

  function closeModal(){
    setModal({...modal, show: false}) 
    setExperiment({name: null, device: null, device_name: null, plants: [], start_date: year+"-"+month+"-"+day})
  }

  return (
    <div>
        {experiment_list.map(item => (
            <div key={item.id} className="item">
                <div className="object_container">
                <div className="object_description">
                    <div className="object_name">{ item.name }</div>
                    <div>Device Name: { item.device }</div>
                    <div>Date: {item.start_date} {"->"} {item.end_date}</div>
                    <div>Score: { item.score } </div>
                </div>
                <div className="object_content">                          
                    <PodCarousel experimentID={item.id} deviceId={item.device}></PodCarousel>
                </div>
                <div className='object_actions'>
                    <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                    <li key="edit"><button onClick={() => openModal(item)}>EDIT</button></li>
                    <li key="delete"><button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button></li>
                </div>
                </div>
            </div>
        ))}
        <div>
            <button onClick={() => openModal(null)}>+</button>
            <Popup open={modal.show} onClose={() => closeModal()} modal nested>
              {(close) => (
                <div className="modal" onClick={close}>
                  <div className="modal_body" onClick={e => e.stopPropagation()}>
                    <div className="modal_type"> { modal.add === true ? "Add Experiment" : "Edit Experiment" } </div>
                    <div className="modal_content">
                      { 
                        renderModal(experiment)
                      }

                      <button className='save' onClick={() => {
                        submitModal();
                          close();
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