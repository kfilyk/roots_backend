import React, { Component } from "react";
import EditPlantModal from "./EditPlantModal";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        plantList: this.props.plantList
    };

    this.deleteEntry = this.deleteEntry.bind(this);
  }

  deleteEntry = (id) => {
    axios
      .delete(`/api/plants/${id}/`)
      .catch((err) => console.log(err));
  };

  render() {
    return (
      this.state.plantList.map((item) => (
        // display list of all items
        <li key={ ''+this.state.selectedTab+' '+ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
                  ID: { item.id }<br></br>
                  Plant Name: { item.name}<br></br>
                  Plant Supplier: { item.supplier}<br></br>
        
                  <span>
                  <EditPlantModal id={item.id} name={item.name} supplier={item.supplier}/>
                    <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) this.deleteEntry(item.id) }}> Delete </button>
                  </span>
                </li>
      ))
    );
  }
}
