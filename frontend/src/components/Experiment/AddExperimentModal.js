import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        description: '',
        start_date: '',
        end_date: '',
        score: '',
        device_id: '',
        pod1:'',
        pod2:'',
        pod3:'',
        pod4:'',
        pod5:'',
        pod6:'',
        pod7:'',
        pod8:'',
        pod9:'',
        pod10:'',
        user: '',
        day:'',
        stage_day:'',
        stages:'',
        current_stage:''
    };
    this.addEntry = this.addEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
  }

  addEntry(e) {
    axios
      .post(`/api/experiments/`, 
        { 
          description: `${this.state.description}`,
          start_date: `${this.state.start_date}`,
          end_date: `${this.state.end_date}`,
          score: `${this.state.score}`,
          device_id: `${this.state.device_id}`,
          pod1:`${this.state.pod1}`,
          pod2:`${this.state.pod2}`,
          pod3:`${this.state.pod3}`,
          pod4:`${this.state.pod4}`,
          pod5:`${this.state.pod5}`,
          pod6:`${this.state.pod6}`,
          pod7:`${this.state.pod7}`,
          pod8:`${this.state.pod8}`,
          pod9:`${this.state.pod9}`,
          pod10:`${this.state.pod10}`,
          user: `${this.state.user}`,
          day:`${this.state.day}`,
          stage_day:`${this.state.stage_day}`,
          stages:`${this.state.stages}`,
          current_stage:`${this.state.current_stage}`
        })
      .then((res) => {
        this.props.updateExperimentList()
      })
      .catch((err) => console.log(err));
  };

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Popup
        trigger={<button className="button" class='actionsButton'> + </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> Create Experiment </div>
              <div className="content">
                <br></br>
                <label> Description: </label>
                <input name="description" value={this.state.description} onChange={this.handleChange} />
                <br></br>
                <label> Start Date: </label>
                <input type="date" name="start_date" value={this.state.start_date} onChange={this.handleChange} />
                <br></br>
                <label> End Date: </label>
                <input type="date"  name="end_date" value={this.state.end_date} onChange={this.handleChange} />
                <br></br>
                <label> Device: </label>
                <input name="device" value={this.state.device} onChange={this.handleChange} />

              </div>
              <div className="actions">
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
