import React, { Component } from "react";
import EditStageModal from "./EditStageModal";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        stageList: this.props.stageList
    };
    this.deleteEntry = this.deleteEntry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ stageList: nextProps.stageList })
}

  deleteEntry = (id) => {
    axios
      .delete(`/api/stages/${id}/`)
      .then((res) => {
        this.props.getStages()
      })
      .catch((err) => console.log(err));
  };

  renderItems = () => {
    return (
      this.state.stageList.map((item) => (
        // display list of all items
        <tr key={ item.id }>
            <td> { item.id } </td>
            <td> { item.author } </td>
            <td> { item.days } </td>
            <td> { item.watering_cycles } </td>
            <td> { item.nutrient_cycles } </td>
            <td> { item.nutrient_type } </td>
            <td> { item.blue_intensity } </td>
            <td> { item.red_intensity } </td>
            <td> { item.white1_intensity } </td>
            <td> { item.white2_intensity } </td>
            <td> { item.lights_on_hours } </td>
            <td> { item.score } </td>
            <td>                  
              <EditStageModal getStages={this.props.getStages} stageData={item}/>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id} by ${item.author}`)) this.deleteEntry(item.id) }}> Delete </button>
            </td>
        </tr>
      ))
    );
  }

  render() {
    return (
      <table width="100%">
        <tr>
          <th> ID </th>
          <th> Author </th>
          <th> Days </th>
          <th> Watering Cycles </th>
          <th> Nutr. Cycles </th>
          <th> Nutr. Type </th>
          <th> Blue Intn. </th>
          <th> Red Intn. </th>
          <th> White1 Intn. </th>
          <th> White2 Intn. </th>
          <th> Lights On (hrs) </th>
          <th> Score </th>
        </tr>
        {this.renderItems()}
      </table>
    )
  }
}
