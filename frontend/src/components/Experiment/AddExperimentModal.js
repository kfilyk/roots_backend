import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import "./experiment.css"

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: null,
      start_date: null,
      end_date: null,
      score: null,
      device_id: null,
      pod1: null,
      pod2: null,
      pod3: null,
      pod4: null,
      pod5: null,
      pod6: null,
      pod7: null,
      pod8: null,
      pod9: null,
      pod10: null,
      user: null,
      day: null,
      stage_day: null,
      stages: null,
      current_stage: null
    };
    this.addEntry = this.addEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
  }

  addEntry(e) {
    axios
      .post(`/api/experiments/`, 
        { 
          description: this.state.description,
          start_date: this.state.start_date,
          end_date: this.state.end_date,
          score: this.state.score,
          device_id: this.state.device_id,
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
          user:  this.state.user,
          day: this.state.day,
          stage_day: this.state.stage_day,
          stages: this.state.stages,
          current_stage: this.state.current_stage
        })
      .then((res) => {
        this.props.getExperiments()
      })
      .catch((err) => console.log(err));
  };

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Popup
        trigger={<button className="button"> + </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="modal_type"> Create Experiment </div>
              <div className="modal_content">
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
                <div class="formRow"> 
                    <label> Day: </label>
                    <input name="day" value={this.state.day} onChange={this.handleChange} />
                </div>
                <div class="formRow"> 
                    <label> Stage Day: </label>
                    <input name="stage_day" value={this.state.stage_day} onChange={this.handleChange} />
                </div>
                <button onClick={() => {
                this.addEntry()
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
