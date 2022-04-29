import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.experiment.id,
      description: this.props.experiment.description,
      start_date: this.props.experiment.start_date.substring(0,10),
      end_date: this.props.experiment.end_date.substring(0,10),
      score: this.props.experiment.score,
      device: this.props.experiment.device,
      pod1:this.props.experiment.pod1,
      pod2:this.props.experiment.pod2,
      pod3:this.props.experiment.pod3,
      pod4:this.props.experiment.pod4,
      pod5:this.props.experiment.pod5,
      pod6:this.props.experiment.pod6,
      pod7:this.props.experiment.pod7,
      pod8:this.props.experiment.pod8,
      pod9:this.props.experiment.pod9,
      pod10:this.props.experiment.pod10,
      user: this.props.experiment.user,
      day:this.props.experiment.day,
      stage_day:this.props.experiment.stage_day,
      stages:this.props.experiment.stages,
      current_stage: this.props.experiment.current_stage
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
          pod1: this.state.pod1,
          pod2: this.state.pod2,
          pod3: this.state.pod3,
          pod4: this.state.pod4,
          pod5: this.state.pod5,
          pod6: this.state.pod6,
          pod7: this.state.pod7,
          pod8: this.state.pod8,
          pod9: this.state.pod9,
          pod10: this.state.pod10,
          user: this.state.user,
          day: this.state.day,
          stage_day: this.state.stage_day,
          stages: this.state.stages,
          current_stage: this.state.current_stage
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
        trigger={<button className="button" class='actionsButton'> EDIT </button>}
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
                <div class="formRow"> 
                    <label> Id: </label>
                    <label>{this.state.id}</label>
                </div>
                  <div class="formRow"> 
                      <label> Description: </label>
                      <input name="description" value={this.state.description} onChange={this.handleChange} />
                  </div>
                  <div class="formRow"> 
                      <label> Start Date: </label>
                      <input type="date" name="start_date" value={this.state.start_date} onChange={this.handleChange} />
                  </div>
                  <div class="formRow"> 
                      <label> End Date: </label>
                      <input type="date"  name="end_date" value={this.state.end_date} onChange={this.handleChange} />
                  </div>
                  <div class="formRow"> 
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
