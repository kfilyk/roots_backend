import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png"

const PlantList = () => {
  const [plant_list, setPlantList] = useState([]);

  const initPlantModal = {
    show: false,
    add: false,
    name: null,
    scientific_name: null,
    profile: null,
    culinary: null,
    fun_facts: null,
    growing_tips: null,
    harvesting_tips: null, 
    medical_uses: null,
    nutritional_benefits: null,
    storage: null,
  }
  const [plantModal, setPlantModal] = useState(initPlantModal);

  async function fetchData() {
    const result = await axios(
      '/api/plants/',
    );

    setPlantList(result.data)
  } 

  useEffect(() => {
    fetchData();
  }, []);

  async function deleteEntry(id) {
    await axios.delete(`/api/plants/${id}/`);
    setPlantList(plant_list.filter(plant => plant.id !== id))
  }

  function openPlantModal(plant){
    if (plant === null ){
      setPlantModal({...plantModal, add: true, show: true})
    } else {
      plant['show'] = true;
      plant['add'] = false;
      setPlantModal(plant)      
    }
  }

  async function submitPlantModal(e){
      if (plantModal.name === ""){
        alert("Plant name cannot be null.")
        return
      } else {
        if(plantModal.add){
          const result = await axios.post(`/api/plants/`, plantModal).catch((err) => console.log(err));
          if(result.status === 200) {
            setPlantList(plant_list => [result.data, ...plant_list])
          }
        } else {
          const result = await axios.patch(`/api/plants/${plantModal.id}/`, plantModal).catch((err) => console.log(err));
          
          // Updates the plant_list on the client without need of new request to backend
          if(result.status === 200) {
            const index = plant_list.findIndex(pl => pl.id === plantModal.id);
            const updatedItem = result.data
            setPlantList([
              ...plant_list.slice(0, index),
              updatedItem,
              ...plant_list.slice(index + 1)
            ])
          }
        }
      }
  }

  return (
    <div>
      <button onClick={() => openPlantModal(null)}>+</button>
      {plant_list.map(item => (
        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_description">
              <div className="bold_font object_header"><span style={{ textTransform: 'uppercase'}}>{item.name}</span> <span className="normal_font">{item.scientific_name ? " ("+item.scientific_name+")": <></>}</span>{item.profile? <span className="normal_font">{": "+item.profile}</span>: <></>}</div> 
              <div className="object_dropdown">
                
                {item.culinary ? <div className="bold_font">{"\n"}CULINARY<span className="normal_font">{" | "+item.culinary}</span></div> : <></>}
                {item.fun_facts ? <div className="bold_font">{"\n"}FUN FACTS<span className="normal_font">{" | "+item.fun_facts}</span></div> : <></>}
                {item.growing_tips ? <div className="bold_font">{"\n"}GROWING TIPS<span className="normal_font">{" | "+item.growing_tips}</span></div> : <></>}
                {item.harvesting_tips ? <div className="bold_font">{"\n"}HARVESTING TIPS<span className="normal_font">{" | "+item.harvesting_tips}</span></div> : <></>}
                {item.medical_uses ? <div className="bold_font">{"\n"}MEDICAL USES<span className="normal_font">{" | "+item.medical_uses}</span></div> : <></>}
                {item.nutritional_benefits ? <div className="bold_font">{"\n"}NUTRITIONAL BENEFITS<span className="normal_font">{" | "+item.nutritional_benefits}</span></div> : <></>}
                {item.storage ? <div className="bold_font">{"\n"}STORAGE<span className="normal_font">{" | "+item.storage}</span></div> : <></>}
              </div>

            </div>
            <div className='object_actions'>
              <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
              <button onClick={() => openPlantModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </div>
          </div>
        </div>
      ))}
      <Popup open={plantModal.show} onClose={() => {setPlantModal(initPlantModal)}} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
              <div className="modal_body"  onClick={e => e.stopPropagation()}>
                <div className="modal_content">
                  <input className="form_row" value={plantModal.name}  placeholder={"Plant Name"} onChange={(e) => setPlantModal({...plantModal, name: e.target.value})} />
                  <input className="form_row" value={plantModal.scientific_name} placeholder={"Scientific Name"} onChange={(e) => setPlantModal({...plantModal, scientific_name: e.target.value})} />
                  <input className="form_row" value={plantModal.profile} placeholder={"Profile"} onChange={(e) => setPlantModal({...plantModal, profile: e.target.value})} />
                  <input className="form_row" value={plantModal.culinary} placeholder={"Culinary"} onChange={(e) => setPlantModal({...plantModal, culinary: e.target.value})} />
                  <input className="form_row" value={plantModal.fun_facts} placeholder={"Fun Facts"} onChange={(e) => setPlantModal({...plantModal, fun_facts: e.target.value})} />
                  <input className="form_row" value={plantModal.growing_tips} placeholder={"Growing Tips"} onChange={(e) => setPlantModal({...plantModal, growing_tips: e.target.value})} />
                  <input className="form_row" value={plantModal.harvesting_tips} placeholder={"Harvesting Tips"} onChange={(e) => setPlantModal({...plantModal, harvesting_tips: e.target.value})} />
                  <input className="form_row" value={plantModal.medical_uses} placeholder={"Medical Uses"} onChange={(e) => setPlantModal({...plantModal, medical_uses: e.target.value})} />
                  <input className="form_row" value={plantModal.nutritional_benefits} placeholder={"Nutritional Benefits"} onChange={(e) => setPlantModal({...plantModal, nutritional_benefits: e.target.value})} />
                  <input className="form_row" value={plantModal.storage} placeholder={"Storage"} onChange={(e) => setPlantModal({...plantModal, storage: e.target.value})} />                  
                  <button className='save' onClick={() => {
                      submitPlantModal()
                      close();
                    }}>Save
                  </button>
                </div>
                </div>
              </div>
            )}
        </Popup>
    </div>
  );
}


export default PlantList;