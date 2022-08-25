import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"

const PlantList = () => {
  const [plant_list, setPlantList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })
  const [plant, setPlant] = useState(
    {
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
  );

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
      .post(`/api/plants/`, 
        { 
            name: plant.name,
            scientific_name: plant.scientific_name,
            profile: plant.profile,
            culinary: plant.culinary,
            fun_facts: plant.fun_facts,
            growing_tips: plant.growing_tips,
            harvesting_tips: plant.harvesting_tips, 
            medical_uses: plant.medical_uses,
            nutritional_benefits: plant.nutritional_benefits,
            storage: plant.storage,

        });
    setPlantList(plant_list => [...plant_list, result.data])
  };

  async function editEntry(e) {
    const result = await axios
      .patch(`/api/plants/${plant.id}/`, 
        { 
            id: plant.id,
            name: plant.name,
            scientific_name: plant.scientific_name,
            profile: plant.profile,
            culinary: plant.culinary,
            fun_facts: plant.fun_facts,
            growing_tips: plant.growing_tips,
            harvesting_tips: plant.harvesting_tips,
            medical_uses: plant.medical_uses,
            nutritional_benefits: plant.nutritional_benefits,
            storage: plant.storage,

        }).catch((err) => console.log(err));
    
    // Updates the plant_list on the client without need of new request to backend
    const index = plant_list.findIndex(pl => pl.id === plant.id);
    const updatedItem = result.data
    setPlantList([
      ...plant_list.slice(0, index),
      updatedItem,
      ...plant_list.slice(index + 1)
    ])
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
              <div className="bold_font">{item.name} <span className="normal_font">{" ("+item.scientific_name+ "): "+item.profile}</span></div>
              <div className="bold_font">CULINARY<span className="normal_font">{" | "+item.culinary}</span></div>
              <div className="bold_font">FUN FACTS<span className="normal_font">{" | "+item.fun_facts}</span></div>
              <div className="bold_font">GROWING TIPS<span className="normal_font">{" | "+item.growing_tips}</span></div>
              <div className="bold_font">HARVESTING TIPS<span className="normal_font">{" | "+item.harvesting_tips}</span></div>
              <div className="bold_font">MEDICAL USES<span className="normal_font">{" | "+item.medical_uses}</span></div>
              <div className="bold_font">NUTRITIONAL BENEFITS<span className="normal_font">{" | "+item.nutritional_benefits}</span></div>
              <div className="bold_font">STORAGE<span className="normal_font">{" | "+item.storage}</span></div>

            </div>
            <div className='object_actions'>
              <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
              <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </div>
          </div>
        </div>
      ))}
      <Popup open={modal.show} onClose={() => setModal({...modal, show: false})} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
              <div className="modal_body"  onClick={e => e.stopPropagation()}>
                <div className="modal_type"> { modal.add === true ? "Add Plant" : "Edit Plant" } </div>
                <div className="modal_content">
                  <div className="form_row">
                    <input name="name" value={plant.name}  placeholder={"Name"} onChange={(e) => setPlant({...plant, name: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="scientific_name" value={plant.scientific_name}  placeholder={"Scientific Name"} onChange={(e) => setPlant({...plant, scientific_name: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="profile" value={plant.profile} placeholder={"Profile"} onChange={(e) => setPlant({...plant, profile: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="culinary" value={plant.culinary} placeholder={"Culinary"} onChange={(e) => setPlant({...plant, culinary: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="fun_facts" value={plant.fun_facts} placeholder={"Fun Facts"} onChange={(e) => setPlant({...plant, fun_facts: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="growing_tips" value={plant.growing_tips} placeholder={"Growing Tips"} onChange={(e) => setPlant({...plant, growing_tips: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="harvesting_tips" value={plant.harvesting_tips} placeholder={"Harvesting Tips"} onChange={(e) => setPlant({...plant, harvesting_tips: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="medical_uses" value={plant.medical_uses} placeholder={"Medical Uses"} onChange={(e) => setPlant({...plant, medical_uses: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="nutritional_benefits" value={plant.nutritional_benefits} placeholder={"Nutritional Benefits"} onChange={(e) => setPlant({...plant, nutritional_benefits: e.target.value})} />
                  </div>

                  <div className="form_row">
                    <input name="storage" value={plant.storage} placeholder={"Storage"} onChange={(e) => setPlant({...plant, storage: e.target.value})} />
                  </div>
                  
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