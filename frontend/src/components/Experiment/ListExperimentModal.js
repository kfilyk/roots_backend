import React, { Component } from "react";
import Experiment from "./Experiment";
import axios from "axios";

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
    let items_list = this.state.experimentList;
    return items_list.map((item) => {
      return <li key={ ''+this.state.selectedTab+' '+ item.id } className="item">
        <Experiment getExperiments={this.props.getExperiments} experiment={item}></Experiment>
      </li>
    });
  }
}
