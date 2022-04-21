import React, { Component } from "react";
import EditPlantModal from "./EditExperimentModal";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        plantList: this.props.plantList
    };

    this.deleteEntry = this.deleteEntry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ plantList: nextProps.plantList })
}

  deleteEntry = (id) => {
    axios
      .delete(`/api/plants/${id}/`)
      .then((res) => {
        this.props.updatePlantList()
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (

            
      items_list = this.state.experimentList;

      return items_list.map((item) => (
        // display list of all items
        <li key={ ''+this.state.selectedTab+' '+ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
          ID: { item.id }<br></br>
          DEVICE: { item.device }<br></br>
          DESCRIPTION: { item.description }<br></br>
          SCORE: { item.score }<br></br>
          START DATE: { item.start_date }<br></br>
          END DATE: { item.end_date }<br></br>
          POD1: { item.pod1 }<br></br>
          POD2: { item.pod2 }<br></br>
          POD3: { item.pod3 }<br></br>
          POD4: { item.pod4 }<br></br>
          POD5: { item.pod5 }<br></br>
          POD6: { item.pod6 }<br></br>
          POD7: { item.pod7 }<br></br>
          POD8: { item.pod8 }<br></br>
          POD9: { item.pod9 }<br></br>
          POD10: { item.pod10 }<br></br>

          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => this.handleEdit(item)}
            >
              Edit
            </button>
            <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) this.deleteEntry(item.id) }}> Delete </button>
          </span>
        </li>
      ));




      this.state.plantList.map((item) => (
        // display list of all items
        <li key={ ''+this.state.selectedTab+' '+ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
                  ID: { item.id }<br></br>
                  Plant Name: { item.name}<br></br>
                  Plant Supplier: { item.supplier}<br></br>
        
                  <span>
                  <EditPlantModal updatePlantList={this.props.updatePlantList} id={item.id} name={item.name} supplier={item.supplier}/>
                    <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) this.deleteEntry(item.id) }}> Delete </button>
                  </span>
                </li>
      ))
    );
  }
}
