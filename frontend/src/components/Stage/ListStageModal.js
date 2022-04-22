import React, { Component } from "react";
import EditStageModal from "./EditStageModal";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        stageList: this.props.stageList
    };
    console.log(props)
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

  render() {
    return (
      this.state.stageList.map((item) => (
        // display list of all items
        <li key={ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
                  ID: { item.id }<br></br>
                  Author: { item.author }<br></br>
                  Days: { item.days }<br></br>
                  Watering_cycles: { item.watering_cycles }<br></br>
                  Nutrient_cycles: { item.nutrient_cycles }<br></br>
                  Nutrient_type: { item.nutrient_type }<br></br>
                  Blue_intensity: { item.blue_intensity }<br></br>
                  Red_intensity: { item.red_intensity }<br></br>
                  White1_intensity: { item.white1_intensity }<br></br>
                  White2_intensity: { item.white2_intensity }<br></br>
                  Lights_on_hours: { item.lights_on_hours }<br></br>
                  Score: { item.score }<br></br>
        
                  <span>
                  <EditStageModal getStages={this.props.getStages} stageData={item}/>
                    <button onClick={() => { if (window.confirm(`You are about to delete ${item.id} by ${item.author}`)) this.deleteEntry(item.id) }}> Delete </button>
                  </span>
                </li>
      ))
    );
  }
}
