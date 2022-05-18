import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlantList() {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const fetchData = async () => {
      const result = await axios(
        '/api/plants/',
      );

      setData(result.data);
    } 

    fetchData();
  }, []);

  function deletePlant(id) {
    axios.delete(`/api/plants/${id}/`)
        .then(() => setData(data.filter(item => item.id !== id)));
  }

  return (
    <tbody>
      {data.map(item => (
        <tr key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
          <td>{ item.id }</td>
          <td>{item.name}</td>
          <td>{item.supplier}</td>
          <td>                  
            {/* <EditPlantModal getPlants={this.props.getPlants} plantData={item}/> */}
            <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deletePlant(item.id) }}> DELETE </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default PlantList;