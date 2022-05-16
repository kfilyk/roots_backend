import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import "./experiment.css"

export default class CustomModal extends Component {

  constructor(props) {
    let today_date = new Date();
    let year = today_date.getUTCFullYear();
    let month = today_date.getUTCMonth() + 1;
    month = month > 9 ? month : '0'+month;
    let day = today_date.getUTCDate();
     
    super(props);
    this.props = props;
    this.state = {
      plantList: this.props.plantList,
      id: this.props.experiment.id ?? null,
      description: this.props.experiment.description ?? null,
      start_date: this.props.experiment.start_date ?? year+"-"+month+"-"+day,
      end_date: this.props.experiment.end_date ?? null,
      score: this.props.experiment.score ?? null,
      device: this.props.experiment.device ?? null,
      day:this.props.experiment.day ?? 0,
      phase_day:this.props.experiment.phase_day ?? 0,
      phases:this.props.experiment.phases ?? null,
      current_phase: this.props.experiment.current_phase ?? 0, // 
      plant_pods: this.props.plant_pods ?? {}
    };
    console.log(this.state.start_date)

    this.editEntry = this.editEntry.bind(this);
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

  editEntry(e) {
    axios
      .patch(`/api/experiments/${this.state.id}/`, 
        {
          description: this.state.description,
          start_date: this.state.start_date,
          end_date: this.state.end_date,
          score: this.state.score,
          device: this.state.device_id,
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
    console.log(this.state.start_date)

  }

  render() {
    return (
      <Popup
        trigger={<button className="button"> 
          { this.props.add_or_edit === "add" ? "+" : "EDIT" }
        </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <div className="modal_header">
                <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="modal_type"> Experiment </div>
              </div>
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

                <button onClick= {
                  () => {
                    if(this.props.add_or_edit === "add") {
                      this.addEntry();
                    } else {
                      this.editEntry();
                    }
                    close();
                  }
                }>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </Popup>
    );
  }
}
