import React, { Component } from "react";
import Experiment from "./Experiment";
import axios from "axios";
import "./experiment.css"

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        experimentList: this.props.experimentList
    };

    this.deleteEntry = this.deleteEntry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ experimentList: nextProps.experimentList })
  }

  deleteEntry = (id) => {
    axios
      .delete(`/api/experiments/${id}/`)
      .then((res) => {
        this.props.updateExperimentList()
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      this.state.experimentList.map((item) => (
        <Experiment getExperiments={this.props.getExperiments} experiment={item}></Experiment>
      )
    ));
  }
}
