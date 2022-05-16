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

  componentWillReceiveProps(nextProps) {
    this.setState({ plantList: nextProps.plantList })
}

  deleteEntry = (id) => {
    axios
      .delete(`/api/plants/${id}/`)
      .then((res) => {
        this.props.getPlants()
      })
      .catch((err) => console.log(err));
  };

  renderItems = () => {
    return (
      this.state.plantList.map((item) => (
        // display list of all items
        <tbody>
          <tr key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
                    <td>{ item.id }</td>
                    <td>{item.name}</td>
                    <td>{item.supplier}</td>
                    <td>                  
                      <EditPlantModal getPlants={this.props.getPlants} plantData={item}/>
                      <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) this.deleteEntry(item.id) }}> DELETE </button>
                    </td>
          </tr>
        </tbody>
      ))
    );
  }

  render() {
    return (
      <table width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Supplier</th>
            <th></th>
          </tr>
        </thead>
        {this.renderItems()}
      </table>
    )
  }
}
