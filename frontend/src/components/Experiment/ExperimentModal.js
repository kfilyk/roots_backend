import React, { Component,  } from "react";
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
      plant_list: [],
      pod_list: [],
      num_pods: 0,
      device_list: this.props.device_list ?? [],
      id: this.props.experiment.id ?? null,
      description: this.props.experiment.description ?? null,
      start_date: this.props.experiment.start_date ?? year+"-"+month+"-"+day,
      end_date: this.props.experiment.end_date ?? null,
      score: this.props.experiment.score ?? null,
      device: this.props.experiment.device ?? null,
      day:this.props.experiment.day ?? 0,
      phase_day:this.props.experiment.phase_day ?? 0,
      phases:this.props.experiment.phases ?? null,
      current_phase: this.props.experiment.current_phase ?? 0, 
    };

    this.editEntry = this.editEntry.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getPlants();
    this.getPodList(this.state.id);
    //as soon as form instantiation, specify 
    if(this.state.device !== null) {
      this.setState({num_pods: this.state.device_list.filter(device => device.id === this.state.device)[0].num_pods});
    } else {
      this.setState({num_pods: this.state.pod_list.length}); 
    }
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
    //handle pod manipulation
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

  getPlants = () => {
    axios
      .get("/api/plants/")
      .then((res) => this.setState({ plant_list: res.data }))
      .catch((err) => console.log(err));
    console.log("GOT PLANT LIST")

  };

  getPodList(id) {
    axios
        .get(`/api/pods/?experiment=${id}`)
        .then((res) => {
            this.setState({ pod_list: res.data })
        })
        .catch((err) => console.log(err));
      console.log("GOT POD LIST")
  }

  render() {
    return (
      <Popup
        trigger={<button> 
          { this.props.add_or_edit === "add" ? "+" : "EDIT" }
        </button>}
        modal
        nested
      >
        
        {(close) => (
          <div className="modal" onClick={close}>
            <div className="modal_body" onClick={e => e.stopPropagation()}>
              <div className="modal_content">
                <div className="form_row"> 
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
                        // allow moving experiment to a different device if the device has the same capacity of pods or greater
                        let device_list_selection = [];
                        device_list_selection.push(
                          <select className="device" name="device" onChange={this.handleChange} >
                            
                            { this.state.device_list.map((item) => (item.num_pods >= this.state.num_pods) && ((item.id === this.state.id) || (item.experiment == null)) ? <option value={item.id}>{item.name} </option> : <></>) }
                          </select>
                        );
                        return device_list_selection;
                      })()
                    }

                </div>

                <div className="form_row"> 
                  {
                    (() => {
                      // only should if a device has been specified: need num_pods of device and pod_list from the device
                      if(this.state.device !== null) {
                      
                        let pod_list_selection = [] // {{position:1, plant_id: 5}, {position:4, plant_id: 2}}
                        /*
                        console.log("POD_LIST: ", pod_list)
                        console.log("PLANT_LIST: ", plant_list)
                        console.log("FLAG: ", pod_list[0]['position'])
                        console.log("FLAG: ", pod_list[0]['plant_name'])
                        */
                        for(let i = 0; i < this.state.num_pods; i++) { // 0, 5, 10 whatever
                          // use select[name] in handleChange to indicate the pod thats being affected
                          console.log(this.state.num_pods);
                          let plant_name = null;
                          let plant_id = null;
                          if(this.state.pod_list.length > 0) {
                            
                            plant_name = this.state.pod_list[i]['plant_name'];
                            plant_id = this.state.pod_list[i]['plant'];
                          } 

                          pod_list_selection.push(
                            <select className="pod" name={"pod_"+(i+1)} value={{value: plant_name, label: plant_id}} onChange={this.handleChange}> 
                              
                              <option value={null}></option>
                              { this.state.plant_list.map((item) => <option key={item.id} value={item.id}>{item.name} </option>) }

                            </select>
                          );
                        }
                        console.log("POD LIST SELECTION: ", pod_list_selection);
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
