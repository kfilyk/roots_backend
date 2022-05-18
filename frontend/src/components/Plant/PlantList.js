import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";

const PlantList = () => {
  const [plantList, setPlantList] = useState([]);
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
    axios.delete(`/api/plants/${id}/`)
        .then((res) => {
          console.log("DELETE")
          fetchData()
        });
  }

  async function addEntry(e) {
    axios
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

  return (
    <div>
      <tbody>
        {plantList.map(item => (
          <tr key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
            <td>{ item.id }</td>
            <td>{item.name}</td>
            <td>{item.supplier}</td>
            <td>                  
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
    </div>
  );
}


export default PlantList;