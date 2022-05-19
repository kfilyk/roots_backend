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
      pod_list: this.props.pod_list ?? {},
      device_list: this.props.device_list ?? {}
    };

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
          pod_list: this.state.pod_list
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
          end_date: this.state.end_date,
          score: this.state.score,
          device: this.state.device_id, /* only allow changing to empty device with no active experiment  */
          phases: this.state.phases,
          current_phase: this.state.current_phase,
          pod_list: this.state.pod_list
        })
      .then((res) => {
        this.props.getExperiments()
      })
      .catch((err) => console.log(err));
  };

  handleChange (e) {
    if(e.target.name.includes("pod")) { 
      let position = e.target.name.substring(5);
      let pod_list_copy = { ...this.state.pod_list }; //create a new copy and change the value of bar
      pod_list_copy[position] = e.target.value;
      this.setState({pod_list: pod_list_copy});
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
                <div className="form_row"> 
                  <label> Description: </label>
                  <input name="description" value={this.state.description} onChange={this.handleChange} />
                </div>
                { this.props.add_or_edit === "add" ? 
                  <div className="form_row"> 
                      <label> Start Date: </label>
                      <input type="date" name="start_date" value={this.state.start_date} onChange={this.handleChange} />
                  </div>
                  : ""
                }

                <div className="form_row"> 
                    <label> Device: </label>
                    {
                      (() => {
                        let device_list_selection = [];
                        device_list_selection.push(
                          <select className="device" name="device" onChange={this.handleChange} >
                            { this.state.device_list.map((item) => (item.id !== this.state.id) && (item.experiment == null) ? <option value={item.id}>{item.name} </option> : <></>) }
                          </select>
                        );
                        return device_list_selection;
                      })()
                    }

                </div>

                <div className="form_row"> 
                  {
                    (() => {
                      if(this.state.device !== null) {

                        let d = this.state.device_list.filter(device => device.id === this.state.device)[0]; // could also use ||
                        let num_pods = d.num_pods;

                        let pod_list_selection = []
                        console.log("PLANT LIST: ", this.state.plantList) 
                        console.log("POD LIST: ", this.state.pod_list);

                        for(let i = 0; i < num_pods; i++) {
                          if (this.state.pod_list !== {})  {
                            /* plantList: list of all possible plants in the database that could be included as a pod option. return position, item id */
                            /*
                            pod_list_selection.push(
                              <select className="pod" name={"pod_"+i} value={{value:this.state.pod_list[i-1]['position'], label: this.state.pod_list[i-1]['plant_name']}} onChange={this.handleChange}> 
                                
                                <option name={"pod_"+i} value=''></option>
                                { this.state.plantList.map((item) => <option value={item.id}>{item.name} </option>) }  

                              </select>
                            );
                            */

                          } else {
                            pod_list_selection.push(
                              <select className="pod" name={"pod_"+(i+1)} onChange={this.handleChange}> 
                                
                                {/* plantList: list of all possible plants in the database that could be included as a pod option. return position, item id */ }
                                <option name={"pod_"+(i+1)} value=''></option>
                                { this.state.plantList.map((item) => <option value={item.id}>{item.name} </option>) }  

                              </select>
                            );
                          }
                        }
                        return pod_list_selection;
                      } 
                
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
