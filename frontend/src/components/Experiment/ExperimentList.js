import React, { Component } from "react";
import Experiment from "./Experiment";
import axios from "axios";
import "./experiment.css"

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.props = props; // this seems to fix props.undefined errors!
    this.state = {
      device_list: this.props.device_list,
      deleteEntry: this.deleteEntry.bind(this),
    };
  }

  deleteEntry = (id) => {
    axios
      .delete(`/api/experiments/${id}/`)
      .then((res) => {
        this.props.getExperiments() // adds to internal state
      })
      .catch((err) => console.log(err));
  };

  render() {
    console.log("EXPERIMENT LIST: ", this.props.experimentList);
    return (
      this.props.experimentList.map((item) => {
        return <li key={ ''+this.state.selectedTab+' '+ item.id } className="item">
                <Experiment device_list = { this.state.device_list } getExperiments={this.props.getExperiments} experiment={item} on_device_page = {false}/>
                </li>
      })
    );
  }
}
