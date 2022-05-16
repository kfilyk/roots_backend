import React, { Component } from "react";
import EditPhaseModal from "./EditPhaseModal";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        phaseList: this.props.phaseList
    };
    this.deleteEntry = this.deleteEntry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ phaseList: nextProps.phaseList })
}

  deleteEntry = (id) => {
    axios
      .delete(`/api/phases/${id}/`)
      .then((res) => {
        this.props.getPhases()
      })
      .catch((err) => console.log(err));
  };

  renderItems = () => {
    return (
      this.state.phaseList.map((item) => (
        <tbody>
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
                <EditPhaseModal getPhases={this.props.getPhases} phaseData={item}/>
                <button onClick={() => { if (window.confirm(`You are about to delete ${item.id} by ${item.author}`)) this.deleteEntry(item.id) }}> DELETE </button>
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
            <th>  </th>
          </tr>
        </thead>
        {this.renderItems()}
      </table>
    )
  }
}
