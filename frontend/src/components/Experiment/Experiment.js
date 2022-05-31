import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import PodCarouselTwo from "./PodCarouselTwo"
import vertical_menu_icon from "../../img/vertical_menu_icon.png"

const ExperimentList = () => {
  const [experiment_list, setExperimentList] = useState([]);
  const [plant_list, setPlantList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })

  const [available_devices, set_available_devices] = useState([])

  const [addExperiment, setAddExperiment] = useState({
    name: 'unknown',
    num_pods: -1,
    device: -1,
    plants: [],
    start_date: '',
    end_date: '', 
  })

  const [editExperiment, setEditExperiment] = useState({
    id: -1,
    name: 'unknown',
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
    await axios.delete(`/api/experiment/${id}/`);
    setExperimentList(experiment_list.filter(experiment => experiment.id !== id))
  }

  function openModal(experiment){
    if (experiment === null ){
      setModal({add: true, show: true})
    } else {
      setEditExperiment(experiment)
      setModal({add: false, show: true})
    }
  }

  function submitModal(){
    if(modal.add){
      // addEntry()
      console.log(addExperiment)
    } else {
      editEntry()
    }
  }

  async function editEntry(e) {
    const result = await axios
        .patch(`/api/experiments/${editExperiment.id}/`, 
        { 
            id: editExperiment.id,
            name: editExperiment.name
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
    setAddExperiment({...addExperiment, device: selected_device['id'], num_pods: selected_device['num_pods'], plants:Array(5).fill(-1)})
  }

  function renderAvailableDevices(){
    return (
      <select className="device_selection" defaultValue= {addExperiment.device} name="device" onChange={(e) => setDevice(e)}>
          {available_devices.map(item => (
              <option key={item.id} value={item.id}> {item.name} </option>
          ))}
      </select>
    )
  }

  function setPod(e){
    let plant = e.target.value
    let position = e.target.name.substring(4); 
    console.log("OLD: ", addExperiment.plants)
    const new_pods = [
      ...addExperiment.plants.slice(0, position),
      plant,
      ...addExperiment.plants.slice(position + 1)
    ]
    console.log("NEW: ", new_pods)
    setAddExperiment({...addExperiment, plants: new_pods})
  }

  function renderPodSelection(){
    let pod_container = []
    for(let i = 0; i < addExperiment.num_pods; i++) {
      pod_container.push(
        <select className="pod_selection" name={"pod_"+(i)} defaultValue={-1} onChange={(e) => setPod(e)}>
            {plant_list.map(item => (
                <option key={item.id} value={item.id}> {item.name} </option>
            ))}
        </select>
      )
    }
    return pod_container
  }
 
  function renderAddModal(){
      return (
        <div>
            <div className="form_row">
              <label> Experiment Name: </label> 
              <input name="name" value={addExperiment.name} onChange={(e) => setAddExperiment({...addExperiment, name: e.target.value})} />
            </div>
            <div className="form_row">
              <label> Device: </label> 
                {renderAvailableDevices()}
            </div>
            <div className="form_row">
              <label> Start Date: </label> 
              <input type="date" name="start_date" value={addExperiment.start_date} onChange={(e) => setAddExperiment({...addExperiment, start_date: e.target.value})} />
            </div>
            <div className="form_row">
              <label> End Date: </label> 
              <input type="date" name="end_date" value={addExperiment.end_date} onChange={(e) => setAddExperiment({...addExperiment, end_date: e.target.value})} />
            </div>
            {renderPodSelection()}
        </div>
      )
  }


  function renderEditModal(){
    return (
      <div className="form_row">
        <label> Name: </label> 
            <input name="name" value={editExperiment.name} onChange={(e) => setEditExperiment({...editExperiment, name: e.target.value})} />
      </div>
    )
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
                    <PodCarouselTwo experimentID={item.id} deviceId={item.device}></PodCarouselTwo>
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
            <Popup open={modal.show} onClose={() => setModal({...modal, show: false})} modal nested>
            {(close) => (
                    <div className="modal">
                        <div className="modal_body">
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="modal_type"> { modal.add === true ? "Add Experiment" : "Edit Experiment" } </div>
                        <div className="modal_content">
                            { modal.add === true 
                            ? ""
                            : <div className="form_row"> <label> Id: </label> <label>{editExperiment.id}</label> </div>
                            }

                            { modal.add === true 
                            ? renderAddModal()
                            : renderEditModal()
                            }

                            <button className='save' onClick={() => {
                            submitModal()
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