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
      device: null,
      day: null,
      phase_day: null,
      phases: null,
      current_phase: null,
      plantList: this.props.plantList,
      plant_pods: {}
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
          device: this.state.device,
          day: this.state.day,
          phase_day: this.state.phase_day,
          phases: this.state.phases,
          current_phase: this.state.current_phase,
          plant_pods: this.state.plant_pods
        })
      .then((res) => {
        this.props.getExperiments()
      })
      .catch((err) => console.log(err));

  };

  handleChange (e) {
    if(e.target.name.includes("plant_pod")) { 
      let position = e.target.name.substring(10);
      let plant_pods_copy = { ...this.state.plant_pods }; //create a new copy and change the value of bar
      plant_pods_copy[position] = e.target.value;
      this.setState({plant_pods: plant_pods_copy});
    } else {
      this.setState({[e.target.name]: e.target.value});
    }
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
                <div className="formRow"> 
                    <label> Day: </label>
                    <input name="day" value={this.state.day} onChange={this.handleChange} />
                </div>
                <div className="formRow"> 
                    <label> Phase Day: </label>
                    <input name="phase_day" value={this.state.phase_day} onChange={this.handleChange} />
                </div>
                <div className="formRow"> 
                  {
                    (() => {
                      let plant_pod_selection = []

                      for (let i = 1; i <= 5; i++) {     
                        plant_pod_selection.push(
                          <select name={"plant_pod_"+i} onChange={this.handleChange}> 
                            {/* plantList: list of all possible plants in the database that could be included as a pod option. return position, item id */ }
                            <option value=''></option>
                            { this.state.plantList.map((item) => <option value={item.id}>{item.name} </option>) }  
                          </select>

                        );
                      }
                      return plant_pod_selection;
                
                    })()
                  }

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
