import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import "./experiment.css"


export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.experiment.id,
      description: this.props.experiment.description,
      start_date: this.props.experiment.start_date ?? "",
      end_date: this.props.experiment.end_date ?? "",
      score: this.props.experiment.score,
      device: this.props.experiment.device,
      user: this.props.experiment.user,
      day:this.props.experiment.day,
      phase_day:this.props.experiment.phase_day,
      phases:this.props.experiment.phases,
      current_phase: this.props.experiment.current_phase
    };
    this.editEntry = this.editEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  editEntry(e) {
    axios
      .patch(`/api/experiments/${this.state.id}/`, 
        {
          description: this.state.description,
          start_date: this.state.start_date,
          end_date: this.state.end_date,
          score: this.state.score,
          device: this.state.device_id,
          user: this.state.user,
          day: this.state.day,
          phase_day: this.state.phase_day,
          phases: this.state.phases,
          current_phase: this.state.current_phase
        })
      .then((res) => {
        this.props.getExperiments()
        console.log("EDIT")
      })
      .catch((err) => console.log(err));
  };

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Popup
        trigger={<button className="button"> EDIT </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="modal_type"> Edit Experiment </div>
              <div className="modal_content">
                <div className="formRow"> 
                    <label> Id: </label>
                    <label>{this.state.id}</label>
                </div>
                  <div className="formRow"> 
                      <label> Description: </label>
                      <input name="description" value={this.state.description} onChange={this.handleChange} />
                  </div>
                  <div className="formRow"> 
                      <label> Start Date: </label>
                      <input type="date" name="start_date" value={this.state.start_date} onChange={this.handleChange} />
                  </div>
                  <div className="formRow"> 
                      <label> End Date: </label>
                      <input type="date"  name="end_date" value={this.state.end_date} onChange={this.handleChange} />
                  </div>
                  <div className="formRow"> 
                      <label> Device: </label>
                      <input name="device" value={this.state.device} onChange={this.handleChange} />
                  </div>
                <button onClick={() => {
                  this.editEntry()
                  close();
                }}>Save</button>
              </div>
                
            </div>
          </div>
        )}
      </Popup>
    );
  }
}
