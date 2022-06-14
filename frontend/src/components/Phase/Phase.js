import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import white_light_icon from "../../img/white_light_icon.png"
import blue_light_icon from "../../img/blue_light_icon.png"
import red_light_icon from "../../img/red_light_icon.png"
import water_icon from "../../img/water_icon.png"
import './phase.css'

const Phase = () => {
  const [phaseList, setPhaseList] = useState([]);
  const [selected_phase, setPhaseNav] = useState("all");
  console.log("PHASE:", selected_phase)
  const [modal, setModal] = useState({
    show: false,
    add: false
  })
  const [addPhase, setAddPhase] = useState(
    {
        user: null,
        user_name: null,
        days: null,
        waterings_per_day: null,
        watering_duration: null,
        blue_intensity: 100,
        red_intensity: 100,
        white_intensity: 100,
        lights_on_hours: null,
        score: null,
        type: null,
        name: null
    }
  );
  const [editPhase, setEditPhase] = useState(
    {
      id: -1,
      user: null,
      user_name: null,
      days: null,
      waterings_per_day: null,
      watering_duration: null,
      blue_intensity: null,
      red_intensity: null,
      white_intensity: null,
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
    setPhaseList(phaseList.filter(phase => phase.id !== id))
  }

  async function addEntry(e) {
    const result = await axios
      .post(`/api/phases/`, 
        { 
            name: addPhase.name,
            type: addPhase.type,
            days: addPhase.days,
            waterings_per_day: addPhase.waterings_per_day,
            watering_duration: addPhase.watering_duration,
            blue_intensity: addPhase.blue_intensity,
            red_intensity: addPhase.red_intensity,
            white_intensity: addPhase.white_intensity,
            lights_on_hours: addPhase.lights_on_hours
        });
    setPhaseList(phaseList => [...phaseList, result.data])
  };

  async function editEntry(e) {
    const result = await axios
        .patch(`/api/phases/${editPhase.id}/`, 
        { 
            name: editPhase.name,
            type: editPhase.type,
            days: editPhase.days,
            waterings_per_day: editPhase.waterings_per_day,
            watering_duration: editPhase.watering_duration,
            blue_intensity: editPhase.blue_intensity,
            red_intensity: editPhase.red_intensity,
            white_intensity: editPhase.white_intensity,
            lights_on_hours: editPhase.lights_on_hours
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
        <div className="form_row">
          <input value={addPhase.name} placeholder={"Name"} onChange={(e) => setAddPhase({...addPhase, name: e.target.value})} />
        </div>
        <div className="form_row">
          <select value={addPhase.type} onChange={(e) => setAddPhase({...addPhase, type: e.target.value})} >
            <option value="Germination">Germination</option>
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative Growth</option>
            <option value="Flowering">Flowering</option>
            <option value="Harvest">Harvest</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form_row">
          <input value={addPhase.days} placeholder={"Days"} onChange={(e) => setAddPhase({...addPhase, days: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={addPhase.waterings_per_day} placeholder={"Watering Cycles"} onChange={(e) => setAddPhase({...addPhase, waterings_per_day: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={addPhase.watering_duration} placeholder={"Watering Duration"} onChange={(e) => setAddPhase({...addPhase, watering_duration: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={addPhase.blue_intensity} id="blue_intensity_slider" className="slider" type="range" min={0} max={100} onChange={(e) => setAddPhase({...addPhase, blue_intensity: e.target.value})}/>
          <div className='intensity_text_overlay'>{addPhase.blue_intensity}</div>
        </div>
        <div className="form_row">
          <input value={addPhase.red_intensity} id="red_intensity_slider" className="slider" type="range" min={0} max={100} onChange={(e) => setAddPhase({...addPhase, red_intensity: e.target.value})} />
          <div className='intensity_text_overlay'>{addPhase.red_intensity}</div>
        </div>                    
        <div className="form_row">
          <input value={addPhase.white_intensity}  id="white_intensity_slider" className="slider" type="range" min={0} max={100} onChange={(e) => setAddPhase({...addPhase, white_intensity: e.target.value})} />
          <div className='intensity_text_overlay'>{addPhase.white_intensity}</div>
        </div>   
        <div className="form_row">
          <input value={addPhase.lights_on_hours} placeholder={"Lights On Hours"} onChange={(e) => setAddPhase({...addPhase, lights_on_hours: e.target.value})} />
        </div>
      </>
    )
  }


  function renderEditModal(){
    return (
      <>        
        <div className="form_row">
          <input value={editPhase.name} placeholder={"Name"} onChange={(e) => setEditPhase({...editPhase, name: e.target.value})} />
        </div>
        <div className="form_row">
          <select value={editPhase.type} onChange={(e) => setAddPhase({...editPhase, type: e.target.value})} >
            <option value="Germination">Germination</option>
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative Growth</option>
            <option value="Flowering">Flowering</option>
            <option value="Harvest">Harvest</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form_row">
          <input value={editPhase.days} placeholder={"Days"}  onChange={(e) => setEditPhase({...editPhase, days: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={editPhase.waterings_per_day} placeholder={"Watering Cycles"} onChange={(e) => setEditPhase({...editPhase, waterings_per_day: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={editPhase.watering_duration} placeholder={"Watering Duration"} onChange={(e) => setEditPhase({...editPhase, watering_duration: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={editPhase.blue_intensity} id="blue_intensity_slider" className="slider" type="range" min={0} max={100} onChange={(e) => setEditPhase({...editPhase, blue_intensity: e.target.value})} ></input>
          <div className='intensity_text_overlay'>{editPhase.blue_intensity}</div>
        </div>
        <div className="form_row">
          <input value={editPhase.red_intensity} id="red_intensity_slider" className="slider" type="range" min={0} max={100} onChange={(e) => setEditPhase({...editPhase, red_intensity: e.target.value})} />
          <div className='intensity_text_overlay'>{editPhase.red_intensity}</div>

        </div>                    
        <div className="form_row">
          <input value={editPhase.white_intensity} id="white_intensity_slider" className="slider" type="range" min={0} max={100} onChange={(e) => setEditPhase({...editPhase, white_intensity: e.target.value})} />
          <div className='intensity_text_overlay'>{editPhase.white_intensity}</div>

        </div>   
        <div className="form_row">
          <input value={editPhase.lights_on_hours} placeholder={"Lights On Hours"} onChange={(e) => setEditPhase({...editPhase, lights_on_hours: e.target.value})} />
        </div>

      </>
    )
  }

  function PhaseStyle(type)  {
    let colour = '';
    let font_colour = '';
    if(type === "Germination" ) {
      colour = `#B1C985`
      font_colour = `#FFFFFF`
    } else if(type === "Seedling" ) {
      colour = `#7AA96A`
      font_colour = `#FFFFFF`
    } else if(type === "Vegetative") {
      colour = `#2A7351`
      font_colour = `#FFFFFF`
    } else if(type === "Flowering") {
      colour = `#DEB1B1`
      font_colour = `#FFFFFF`
    } else if(type === "Harvest") {
      colour = `#D14C4C`
      font_colour = `#FFFFFF`
    } else { // other type
      colour = `#6FC1B6`
      font_colour = `#FFFFFF`
    }
    let style = {
      backgroundColor: colour,
      color: font_colour
    };
    return style;
  };

  function renderNav() {
    return (
      <div className="nav" style={{fontSize: "12px"}}>
        <span className={selected_phase === "All" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("All")}>
          ALL
        </span>
        <span className={selected_phase === "Germination" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("Germination")}>
          GERMINATION
        </span>
        <span className={selected_phase === "Seedling" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("Seedling")}>
          SEEDLING
        </span>
        <span className={selected_phase === "Vegetative" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("Vegetative")}>
          VEGETATIVE GROWTH
        </span>
        <span className={selected_phase === "Flowering" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("Flowering")}>
          FLOWERING
        </span>
        <span className={selected_phase === "Harvest" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("Harvest")}>
          HARVEST
        </span>
        <span className={selected_phase === "Other" ? "nav-link active" : "nav-link"} onClick={() => setPhaseNav("Other")}>
          OTHER
        </span>
      </div>
    );
  };

  return (
    <div>
      {renderNav()}
      {phaseList.filter(phase => (phase.type === selected_phase) || selected_phase === "all").map(item => (
        <div key={ item.id } className="item" >
          <div className="object_container" >
            <div className="object_top">
              <div className="object_description" style={PhaseStyle(item.type)}>
                <div className="phase_type object_name"> { item.type.toUpperCase() } | { item.name } </div>
                <div>Author: { item.user_name } </div>
                <div> { item.days } Days</div>
                {/*<div> { item.score } </div>*/}
              </div>
              <div className="object_content"> 
                <div className="phase_content">
                  <div className="watering">
                    {(() => {
                      let waterings = [];
                      for(let i = 0; i < item.waterings_per_day; i++) {
                        waterings.push(<img src={water_icon} alt="Water" style={{width:'30px', padding:'5px' }}/>)
                      }
                      return waterings;
                    })()}
                  / per day, {item.watering_duration} minute(s) each
                  </div>
                  <div className="lighting">
                    <div> <img src={blue_light_icon} alt="Blue Light" style={{width:'30px', padding:'5px', paddingBottom:'0px'}}></img> <div className="light_intensity" >{item.blue_intensity}</div> </div>
                    <div> <img src={red_light_icon} alt="Red Light" style={{width:'30px', padding:'5px', paddingBottom:'0px'}}></img> <div className="light_intensity">{item.red_intensity}</div> </div>
                    <div> <img src={white_light_icon} alt="White Light" style={{width:'30px', padding:'5px', paddingBottom:'0px'}}></img> <div className="light_intensity">{item.white_intensity}</div> </div>
                    , { item.lights_on_hours } hours per day
                  </div>
                </div>
              </div>
            </div>
            <div className="object_actions">
              <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
              <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => openModal(null)}>+</button>
      <Popup open={modal.show} onClose={() => setModal({...modal, show: false})} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body"  onClick={e => e.stopPropagation()}>
                <div className="modal_type"> { modal.add === true ? "Add Phase" : "Edit Phase" } </div>
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