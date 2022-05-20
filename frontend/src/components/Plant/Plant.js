import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";

const PlantList = () => {
  const [plant_list, setPlantList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })
  const [addPlant, setAddPlant] = useState(
    {
      name: 's',
      supplier: 'a'
    }
  );
  const [editPlant, setEditPlant] = useState(
    {
      id: -1,
      name: 's',
      supplier: 'a'
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
    setPlantList(plant_list.filter(plant => plant.id != id))
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
      addEntry()
    } else {
      editEntry()
    }
  }

  return (
    <div>
      <table width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Supplier</th>
            <th></th>
          </tr>
        </thead>
        {plant_list.map(item => (
          <tr key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
            <td>{ item.id }</td>
            <td>{item.name}</td>
            <td>{item.supplier}</td>
            <td>
            <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </td>
          </tr>
        ))}
      </table>  
      <button onClick={() => openModal(null)}>+</button>
      <Popup open={modal.show} onClose={() => setModal({...modal, show: false})} modal nested>
            {(close) => (
            <div className="modal">
                <div className="modal_body">
                <button className="close" onClick={close}>
                    &times;
                </button>
                <div className="modal_type"> { modal.add == true ? "Add Plant" : "Edit Plant" } </div>
                <div className="modal_content">
                    { modal.add == true 
                      ? ""
                      : <div className="form_row"> <label> Id: </label> <label>{editPlant.id}</label> </div>
                    }

                    <div className="form_row">
                    <label> Name: </label> 
                    { modal.add == true 
                      ? <input name="name" value={addPlant.name} onChange={(e) => setAddPlant({...addPlant, name: e.target.value})} />
                      : <input name="name" value={editPlant.name} onChange={(e) => setEditPlant({...editPlant, name: e.target.value})} />
                    }
                    </div>

                    <div className="form_row">
                    <label> Supplier: </label>
                    { modal.add == true 
                      ? <input name="supplier" value={addPlant.supplier} onChange={(e) => setAddPlant({...addPlant, supplier: e.target.value})} />
                      : <input name="supplier" value={editPlant.supplier} onChange={(e) => setEditPlant({...editPlant, supplier: e.target.value})} />
                    }
                    </div>

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