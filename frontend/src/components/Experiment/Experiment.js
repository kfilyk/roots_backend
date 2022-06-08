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

  const [addExperiment, setAddExperiment] = useState({
    name: null,
    device_capacity: -1,
    device: -1,
    plants: [],
    start_date: year+"-"+month+"-"+day,
    end_date: null, 
  })

  const [editExperiment, setEditExperiment] = useState({
    id: 2,
    name: null,
    plants: [],
    start_date: year+"-"+month+"-"+day,
    end_date: null,
    // start_date: new Date(),
    // device: -1, 
    // day: -1,
    // phase_day: -1,
    // current_phase: -1
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

  function openModal(experiment){
    if (experiment === null ){
      setModal({add: true, show: true})
    } else {
      // setEditExperiment()
      setEditExperiment({id: experiment.id, name: experiment.name, start_date: experiment.start_date.substring(0,10), end_date: experiment.end_date.substring(0,10)})
      // setEditExperiment({id: experiment.id, name: experiment.name, plants: [], start_date: experiment.start_date.substring(0,10), end_date: experiment.end_date.substring(0,10)})
      // setEditExperiment({id: 2, name: 'unknown', plants: [], start_date: '', end_date: '',})
      console.log("DD: ", editExperiment)
      setModal({add: false, show: true})
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
          name: addExperiment.name,
          device: addExperiment.device,
          plants: addExperiment.plants,
          start_date: addExperiment.start_date,
        })
      .catch((err) => console.log(err));
    console.log("RESULT 2:", result)
    setExperimentList(experiment_list => [...experiment_list, result.data]);
  };

  async function editEntry(e) {
    const result = await axios
        .patch(`/api/experiments/${editExperiment.id}/`, 
        { 
            id: editExperiment.id,
            name: editExperiment.name,
            start_date: editExperiment.start_date,
            end_date: editExperiment.end_date
        }).catch((err) => console.log(err));
    const index = experiment_list.findIndex(experiment => experiment.id === editExperiment.id);
    const updatedItem = result.data
    setPlantList([
      ...experiment_list.slice(0, index),
      updatedItem,
      ...experiment_list.slice(index + 1)
    ])
  };

  function setDevice(e){
    let selected_device = available_devices.find(device => device.id == e.target.value)
    setAddExperiment({...addExperiment, device: selected_device['id'], device_capacity: selected_device['device_capacity'], plants:Array(5).fill(-1)})
  }

  function renderAvailableDevices(){
    return (
      <select className="device_selection" defaultValue={addExperiment.device} name="device" onChange={(e) => setDevice(e)}>
          <option key={-1} value={-1}> SELECT DEVICE </option>
          {available_devices.map(item => (
              <option key={item.id} value={item.id}> {item.name} </option>
          ))}
      </select>
    )
  }

  function setPod(e){
    let plant = e.target.value
    let position = e.target.name.substring(4); 
    let temp = addExperiment.plants
    temp[position] = plant
    setAddExperiment({...addExperiment, plants: temp})
  }

  function renderPodSelection(experiment){
    let pod_container = []
    if (experiment.device !== -1){
      for(let i = 0; i < experiment.device_capacity; i++) {
        pod_container.push(
          <select className="pod_selection" name={"pod_"+(i)} defaultValue={-1} onChange={(e) => setPod(e)}>
              <option key={-1} value={-1}> Empty </option>
              {plant_list.map(item => (
                  <option key={item.id} value={item.id}> {item.name} </option>
              ))}
          </select>
        )
      }
    }
    return pod_container
  }
 
  function renderAddModal(){
    console.log(addExperiment.start_date)
    return (
      <div>
          <div className="form_row">
            <input name="name" value={addExperiment.name} placeholder = {"Experiment Name"} onChange={(e) => setAddExperiment({...addExperiment, name: e.target.value})} />
          </div>
          <div className="form_row">
            {renderAvailableDevices()}
          </div>
          <div className="form_row">
            <input className="date_selection" type="date" name="start_date" value={addExperiment.start_date} onChange={(e) => setAddExperiment({...addExperiment, start_date: e.target.value})} />
          </div>
          <div className="form_row">{renderPodSelection(addExperiment)}</div>
      </div>
    )
  }


  function renderEditModal(editExperiment){
    // console.log("DD: ", editExperiment)

    return (
      <div>
        <div className="form_row">
          <label> Name: </label> 
              <input name="name" value={editExperiment.name} onChange={(e) => setEditExperiment({...editExperiment, name: e.target.value})} />
        </div>
        { editExperiment.start_date.substring(0, 10) > new Date().toISOString()
          ? <div>
              <div className="form_row">
                  <label> Start Date: </label> 
                  <input type="date" name="start_date" value={editExperiment.start_date.substring(0,10)} defaultValue={editExperiment.start_date.substring(0,10)} onChange={(e) => setEditExperiment({...editExperiment, start_date: e.target.value})} />
              </div>
              <div className="form_row">
                <label> End Date: </label> 
                <input type="date" name="end_date" value={editExperiment.end_date.substring(0,10)} defaultValue={editExperiment.end_date.substring(0,10)} onChange={(e) => setEditExperiment({...editExperiment, end_date: e.target.value})} />
              </div>
            </div> 
          : ""
        }
        <div className="form_row">
            <label> Pod Selection: </label> 
            {renderPodSelection(editExperiment)}
        </div>
      </div>
    )
  }


  function closeModal(){
    setModal({...modal, show: false}) 
    setAddExperiment({...addExperiment, device: -1})
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
                              { modal.add === true 
                              ? ""
                              : <div className="form_row"> <label> Id: </label> <label>{editExperiment.id}</label> </div>
                              }

                              { modal.add === true 
                              ? renderAddModal()
                              : renderEditModal(editExperiment)
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