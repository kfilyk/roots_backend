import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";

const Phase = () => {
  const [phaseList, setPhaseList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })
  const [addPhase, setAddPhase] = useState(
    {
        author: null,
        days: null,
        watering_cycles: null,
        nutrient_cycles: null,
        nutrient_type: null,
        blue_intensity: null,
        red_intensity: null,
        white1_intensity: null,
        white2_intensity: null,
        lights_on_hours: null,
        score: null,
        type: null,
        name: null
    }
  );
  const [editPhase, setEditPhase] = useState(
    {
      id: -1,
      author: null,
      days: null,
      watering_cycles: null,
      nutrient_cycles: null,
      nutrient_type: null,
      blue_intensity: null,
      red_intensity: null,
      white1_intensity: null,
      white2_intensity: null,
      lights_on_hours: null,
      score: null,
      type: null,
      name: null
    }
  )

  async function fetchData() {
    const result = await axios(
      '/api/phases/',
    );

    setPhaseList(result.data)
  } 

  useEffect(() => {
    fetchData();
  }, []);

  async function deleteEntry(id) {
    await axios.delete(`/api/phases/${id}/`);
    setPhaseList(phaseList.filter(phase => phase.id != id))
  }

  async function addEntry(e) {
    const result = await axios
      .post(`/api/phases/`, 
        { 
            author: addPhase.author,
            days: addPhase.days,
            watering_cycles: addPhase.watering_cycles,
            nutrient_cycles: addPhase.nutrient_cycles,
            nutrient_type: addPhase.nutrient_type,
            blue_intensity: addPhase.blue_intensity,
            red_intensity: addPhase.red_intensity,
            white1_intensity: addPhase.white1_intensity,
            white2_intensity: addPhase.white2_intensity,
            lights_on_hours: addPhase.lights_on_hours,
            score: addPhase.score,
            type: addPhase.type,
            name: addPhase.name
        });
    setPhaseList(phaseList => [...phaseList, result.data])
  };

  async function editEntry(e) {
    const result = await axios
        .patch(`/api/phases/${editPhase.id}/`, 
        { 
            id: editPhase.id,
            author: editPhase.author,
            days: editPhase.days,
            watering_cycles: editPhase.watering_cycles,
            nutrient_cycles: editPhase.nutrient_cycles,
            nutrient_type: editPhase.nutrient_type,
            blue_intensity: editPhase.blue_intensity,
            red_intensity: editPhase.red_intensity,
            white1_intensity: editPhase.white1_intensity,
            white2_intensity: editPhase.white2_intensity,
            lights_on_hours: editPhase.lights_on_hours,
            score: editPhase.score,
            type: editPhase.type,
            name: editPhase.name
        }).catch((err) => console.log(err));
    const index = phaseList.findIndex(phase => phase.id === editPhase.id);
    const updatedItem = result.data
    setPhaseList([
      ...phaseList.slice(0, index),
      updatedItem,
      ...phaseList.slice(index + 1)
    ])
  };

  function openModal(phase){
    if (phase === null ){
      setModal({add: true, show: true})
    } else {
      setEditPhase(phase)
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

  function renderAddModal(){
    return (
      <>
        <div className="form_row"> <label> Id: </label> <label>{addPhase.id}</label> </div>
        
        <div className="form_row">
          <label> Author</label> 
          <input value={addPhase.author} onChange={(e) => setAddPhase({...addPhase, author: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Days</label> 
          <input value={addPhase.days} onChange={(e) => setAddPhase({...addPhase, days: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Watering Cycles</label> 
          <input value={addPhase.watering_cycles} onChange={(e) => setAddPhase({...addPhase, watering_cycles: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Nutrient Cycles</label> 
          <input value={addPhase.nutrient_cycles} onChange={(e) => setAddPhase({...addPhase, nutrient_cycles: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Nutrient Type</label> 
          <input value={addPhase.nutrient_type} onChange={(e) => setAddPhase({...addPhase, nutrient_type: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Blue Intensity</label> 
          <input value={addPhase.blue_intensity} onChange={(e) => setAddPhase({...addPhase, blue_intensity: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Red Intensity</label> 
          <input value={addPhase.red_intensity} onChange={(e) => setAddPhase({...addPhase, red_intensity: e.target.value})} />
        </div>                    
  
        <div className="form_row">
          <label> White1 Intensity</label> 
          <input value={addPhase.white1_intensity} onChange={(e) => setAddPhase({...addPhase, white1_intensity: e.target.value})} />
        </div>   
  
        <div className="form_row">
          <label> White2 Intensity</label> 
          <input value={addPhase.white2_intensity} onChange={(e) => setAddPhase({...addPhase, white2_intensity: e.target.value})} />
        </div>   
  
        <div className="form_row">
          <label> Lights On Hours</label> 
          <input value={addPhase.lights_on_hours} onChange={(e) => setAddPhase({...addPhase, lights_on_hours: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Score</label> 
          <input value={addPhase.score} onChange={(e) => setAddPhase({...addPhase, score: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Type</label> 
          <input value={addPhase.type} onChange={(e) => setAddPhase({...addPhase, type: e.target.value})} />
        </div>
  
        <div className="form_row">
          <label> Name</label> 
          <input value={addPhase.name} onChange={(e) => setAddPhase({...addPhase, name: e.target.value})} />
        </div>
      </>
    )}


function renderEditModal(){
  return (
    <>
      <div className="form_row"> <label> Id: </label> <label>{editPhase.id}</label> </div>
      
      <div className="form_row">
        <label> Author</label> 
        <input value={editPhase.author} onChange={(e) => setEditPhase({...editPhase, author: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Days</label> 
        <input value={editPhase.days} onChange={(e) => setEditPhase({...editPhase, days: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Watering Cycles</label> 
        <input value={editPhase.watering_cycles} onChange={(e) => setEditPhase({...editPhase, watering_cycles: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Nutrient Cycles</label> 
        <input value={editPhase.nutrient_cycles} onChange={(e) => setEditPhase({...editPhase, nutrient_cycles: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Nutrient Type</label> 
        <input value={editPhase.nutrient_type} onChange={(e) => setEditPhase({...editPhase, nutrient_type: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Blue Intensity</label> 
        <input value={editPhase.blue_intensity} onChange={(e) => setEditPhase({...editPhase, blue_intensity: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Red Intensity</label> 
        <input value={editPhase.red_intensity} onChange={(e) => setEditPhase({...editPhase, red_intensity: e.target.value})} />
      </div>                    

      <div className="form_row">
        <label> White1 Intensity</label> 
        <input value={editPhase.white1_intensity} onChange={(e) => setEditPhase({...editPhase, white1_intensity: e.target.value})} />
      </div>   

      <div className="form_row">
        <label> White2 Intensity</label> 
        <input value={editPhase.white2_intensity} onChange={(e) => setEditPhase({...editPhase, white2_intensity: e.target.value})} />
      </div>   

      <div className="form_row">
        <label> Lights On Hours</label> 
        <input value={editPhase.lights_on_hours} onChange={(e) => setEditPhase({...editPhase, lights_on_hours: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Score</label> 
        <input value={editPhase.score} onChange={(e) => setEditPhase({...editPhase, score: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Type</label> 
        <input value={editPhase.type} onChange={(e) => setEditPhase({...editPhase, type: e.target.value})} />
      </div>

      <div className="form_row">
        <label> Name</label> 
        <input value={editPhase.name} onChange={(e) => setEditPhase({...editPhase, name: e.target.value})} />
      </div>
    </>
  )
}

  return (
    <div>
        <table width="100%">
        <thead>
        <tr>
            <th> ID </th>
            <th> Author </th>
            <th> Days </th>
            <th> Watering Cycles </th>
            <th> Nutr. Cycles </th>
            <th> Nutr. Type </th>
            <th> Blue Intn. </th>
            <th> Red Intn. </th>
            <th> White1 Intn. </th>
            <th> White2 Intn. </th>
            <th> Lights On (hrs) </th>
            <th> Score </th>
            <th> Type </th>
            <th> Name </th>
            <th>  </th>
        </tr>
        {phaseList.map(item => (
          <tr key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
              <td> { item.id } </td>
              <td> { item.author } </td>
              <td> { item.days } </td>
              <td> { item.watering_cycles } </td>
              <td> { item.nutrient_cycles } </td>
              <td> { item.nutrient_type } </td>
              <td> { item.blue_intensity } </td>
              <td> { item.red_intensity } </td>
              <td> { item.white1_intensity } </td>
              <td> { item.white2_intensity } </td>
              <td> { item.lights_on_hours } </td>
              <td> { item.score } </td>
              <td> { item.type } </td>
              <td> { item.name } </td>
            <td>
            <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </td>
          </tr>
        ))}
        </thead>
      </table>  
      <button onClick={() => openModal(null)}>+</button>
      <Popup open={modal.show} onClose={() => setModal({...modal, show: false})} modal nested>
            {(close) => (
            <div className="modal">
                <div className="modal_body">
                <button className="close" onClick={close}>
                    &times;
                </button>
                <div className="modal_type"> { modal.add == true ? "Add Phase" : "Edit Phase" } </div>
                <div className="modal_content">
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
  );
}


export default Phase;