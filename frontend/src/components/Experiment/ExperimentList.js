import React, { Component } from "react";
import Experiment from "./Experiment";
import axios from "axios";
import "./experiment.css"

export default class CustomModal extends Component {
  constructor(props) {
    super(props);

    this.deleteEntry = this.deleteEntry.bind(this);
  }

  deleteEntry = (id) => {
    axios
      .delete(`/api/experiments/${id}/`)
      .then((res) => {
        this.props.getExperiments()
      })
      .catch((err) => console.log(err));
  };

  render() {
    console.log("EXPERIMENT LIST: ", this.props.experimentList);
    return (
      this.props.experimentList.map((item) => {
        return (<Experiment experiment={item} getExperiments={this.props.getExperiments} plantList={this.props.plantList}/>)
      })
    );
  }
}
