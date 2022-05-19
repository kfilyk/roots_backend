import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";

const PlantList = () => {
  const [plantList, setPlantList] = useState([]);
  const [showEditPlant, setShowEditPlant] = useState(false)
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
    await axios.delete(`/api/plants/${id}/`)
        .then((res) => {
          console.log("DELETE")
          fetchData()
        });
  }

  async function addEntry(e) {
    await axios
      .post(`/api/plants/`, 
        { 
            name: addPlant.name,
            supplier: addPlant.supplier
        })
      .then((res) => {
        console.log("ADD: ", addPlant)
        fetchData()
      })
      .catch((err) => console.log(err));
  };

  async function editEntry(e) {
    await axios
        .patch(`/api/plants/${editPlant.id}/`, 
        { 
            id: editPlant.id,
            name: editPlant.name,
            supplier: editPlant.supplier
        })
        .then((res) => {
          fetchData()
        })
        .catch((err) => console.log(err));
  };

  function openEditPlant(plant){
    setEditPlant(plant)
    setShowEditPlant(true)
  }

  return (
    <div>
      <tbody>
        {plantList.map(item => (
          <tr key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
            <td>{ item.id }</td>
            <td>{item.name}</td>
            <td>{item.supplier}</td>
            <td>
            <button onClick={() => openEditPlant(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </td>
          </tr>
        ))}
      </tbody>  
      <Popup
        trigger={<button className="button"> + </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="modal_type"> Add New Plant </div>
              <div className="modal_content">

                    <div className="form_row">
                      <label> Name: </label> <input name="addPlant.name" value={addPlant.name} onChange={(e) => setAddPlant({...addPlant, name: e.target.value})} />
                    </div>

                    <div className="form_row">
                      <label> Supplier: </label> <input name="addPlant.supplier" value={addPlant.supplier} onChange={(e) => setAddPlant({...addPlant, supplier: e.target.value})} />
                    </div>
                    
                    <button className='save' onClick={() => {
                      addEntry()
                      close();}}>Save
                    </button>
              </div>
            </div>
          </div>
        )}
      </Popup>

      <Popup open={showEditPlant} onClose={() => setShowEditPlant(false)} modal nested>
            {(close) => (
            <div className="modal">
                <div className="modal_body">
                <button className="close" onClick={close}>
                    &times;
                </button>
                <div className="modal_type"> Edit Plant </div>
                <div className="modal_content">
                    <div className="form_row">
                    <label> Id: </label> <label>{editPlant.id}</label>
                    </div>

                    <div className="form_row">
                    <label> Name: </label> <input name="name" value={editPlant.name} onChange={(e) => setEditPlant({...editPlant, name: e.target.value})} />
                    </div>

                    <div className="form_row">
                    <label> Supplier: </label> <input name="supplier" value={editPlant.supplier} onChange={(e) => setEditPlant({...editPlant, supplier: e.target.value})} />
                    </div>

                    <button className='save' onClick={() => {
                    editEntry()
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