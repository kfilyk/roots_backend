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
  const [addPlant, setAddPlant] = useState(
    {
      name: null,
      supplier: null
    }
  );
  const [editPlant, setEditPlant] = useState(
    {
      id: -1,
      name: null,
      supplier: null
    }
  )

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
            name: addPlant.name,
            supplier: addPlant.supplier
        });
    setPlantList(plant_list => [...plant_list, result.data])
  };

  async function editEntry(e) {
    const result = await axios
        .patch(`/api/plants/${editPlant.id}/`, 
        { 
            id: editPlant.id,
            name: editPlant.name,
            supplier: editPlant.supplier
        }).catch((err) => console.log(err));
    const index = plant_list.findIndex(plant => plant.id === editPlant.id);
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
      setEditPlant(plant)
      setModal({add: false, show: true})
    }
  }
  
  function submitModal(){
    if(modal.add){
      if (addPlant.name === ""){
        alert("Plant name cannot be null.")
        return
      } else {
        addEntry()
      }
    } else {
      if (editPlant.name === ""){
        alert("Plant name cannot be null.")
        return
      } else {
        editEntry()
      }
    }
  }

  function renderAddModal(){
    return (
      <>
        <div className="form_row">
          <input name="name" value={addPlant.name}  placeholder={"Name"} onChange={(e) => setAddPlant({...addPlant, name: e.target.value})} />
        </div>

        <div className="form_row">
          <input name="supplier" value={addPlant.supplier} placeholder={"Supplier"} onChange={(e) => setAddPlant({...addPlant, supplier: e.target.value})} />
        </div>
      </>
    )
  }


function renderEditModal(){
  return (
    <>
      <div className="form_row">
        <input name="name" value={editPlant.name} placeholder={"Name"} onChange={(e) => setEditPlant({...editPlant, name: e.target.value})} />
      </div>

      <div className="form_row">
        <input name="supplier" value={editPlant.supplier} placeholder={"Supplier"} onChange={(e) => setEditPlant({...editPlant, supplier: e.target.value})} />
      </div>
    </>
  )
}

  return (
    <div>
            <button onClick={() => openModal(null)}>+</button>
      {plant_list.map(item => (
        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_description">
              <div>{item.name}</div>
              <div>{item.supplier}</div>
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


export default PlantList;