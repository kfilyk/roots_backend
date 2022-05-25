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
  }, [experiment_list]);

  async function fetchPlants() {
    const result = await axios(
      '/api/plants/',
    );
    setPlantList(result.data)
  } 

  useEffect(() => {
    fetchPlants();
  }, []);


  async function deleteEntry(id) {
    await axios.delete(`/api/experiment/${id}/`);
    setExperimentList(experiment_list.filter(experiment => experiment.id != id))
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
      console.log("submitModal function not done... ")
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

  function renderAddModal(){
      return (
        <div>
          THIS IS NOT DONE.
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
        <div>
            {experiment_list.map(item => (
              <div key={item.id} className="item">
                  <div className="object_container">
                    <div className="object_description">
                        <div>{ item.name }</div>
                        <div>Device Name: { item.device }</div>
                        <div>Date: {item.start_date} {"->"} {item.end_date}</div>
                        <div>Score: { item.score } </div>
                    </div>
                    <div className="pod_carousel_wrapper">                          
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
        </div>
      <div>
      <button onClick={() => openModal(null)}>+</button>
      <Popup open={modal.show} onClose={() => setModal({...modal, show: false})} modal nested>
        {(close) => (
              <div className="modal">
                  <div className="modal_body">
                  <button className="close" onClick={close}>
                      &times;
                  </button>
                  <div className="modal_type"> { modal.add == true ? "Add Experiment" : "Edit Experiment" } </div>
                  <div className="modal_content">
                      { modal.add == true 
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