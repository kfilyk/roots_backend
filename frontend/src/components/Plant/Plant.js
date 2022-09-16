import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png"

const PlantList = () => {
  const [plant_list, setPlantList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })
  const initPlant = {
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
  const [plant, setPlant] = useState(initPlant);

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

  async function addEntry(e) {
    const result = await axios
      .post(`/api/plants/`, plant).catch((err) => console.log(err));
    if(result.status === 200) {
      setPlantList(plant_list => [result.data, ...plant_list])
    }
  };

  async function editEntry(e) {
    const result = await axios
      .patch(`/api/plants/${plant.id}/`, plant).catch((err) => console.log(err));
    
    // Updates the plant_list on the client without need of new request to backend
    if(result.status === 200) {
      const index = plant_list.findIndex(pl => pl.id === plant.id);
      const updatedItem = result.data
      setPlantList([
        ...plant_list.slice(0, index),
        updatedItem,
        ...plant_list.slice(index + 1)
      ])
    }
  };

  function openModal(plant){
    if (plant === null ){
      setModal({add: true, show: true})
    } else {
      setPlant(plant)
      setModal({add: false, show: true})
    }
  }

  function submitModal(){
      if (plant.name === ""){
        alert("Plant name cannot be null.")
        return
      } else {
        if(modal.add){
          addEntry()
        } else {
          editEntry()
        }
      }
  }

  return (
    <div>
      <button onClick={() => openModal(null)}>+</button>
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
                <div className="bold_font">{"\n"}TEST<span className="normal_font">{" | 123123123231"}</span></div> <></>
              </div>

            </div>
            <div className='object_actions'>
              <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
              <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </div>
          </div>
        </div>
      ))}
      <Popup open={modal.show} onClose={() => {setModal({...modal, show: false}); setPlant(initPlant)}} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
              <div className="modal_body_2"  onClick={e => e.stopPropagation()}>
                <div className="modal_content">
                  <div className="form_row">
                    <input name="name" value={plant.name}  placeholder={"Plant Name"} onChange={(e) => setPlant({...plant, name: e.target.value})} />
                  </div>

                  <input className="form_row" value={plant.scientific_name} placeholder={"Scientific Name"} onChange={(e) => setPlant({...plant, scientific_name: e.target.value})} />
                  <input className="form_row" value={plant.profile} placeholder={"Profile"} onChange={(e) => setPlant({...plant, profile: e.target.value})} />
                    <input className="form_row" value={plant.culinary} placeholder={"Culinary"} onChange={(e) => setPlant({...plant, culinary: e.target.value})} />
                    <input className="form_row" value={plant.fun_facts} placeholder={"Fun Facts"} onChange={(e) => setPlant({...plant, fun_facts: e.target.value})} />
                    <input className="form_row" value={plant.growing_tips} placeholder={"Growing Tips"} onChange={(e) => setPlant({...plant, growing_tips: e.target.value})} />
                    <input className="form_row" value={plant.harvesting_tips} placeholder={"Harvesting Tips"} onChange={(e) => setPlant({...plant, harvesting_tips: e.target.value})} />
                    <input className="form_row" value={plant.medical_uses} placeholder={"Medical Uses"} onChange={(e) => setPlant({...plant, medical_uses: e.target.value})} />
                    <input className="form_row" value={plant.nutritional_benefits} placeholder={"Nutritional Benefits"} onChange={(e) => setPlant({...plant, nutritional_benefits: e.target.value})} />
                    <input className="form_row" value={plant.storage} placeholder={"Storage"} onChange={(e) => setPlant({...plant, storage: e.target.value})} />                  
                  <button className='save' onClick={() => {
                      submitModal()
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