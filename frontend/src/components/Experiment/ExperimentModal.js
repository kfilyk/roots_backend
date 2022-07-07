import React, { Component,  } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

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
      experiment_list: [],
      pod_selection: {}, // new pod list plants
      capacity: 0,
      today: year+"-"+month+"-"+day,
      device_list: this.props.device_list ?? [],
      id: this.props.experiment.id ?? null,
      name: this.props.experiment.name ?? null,
      start_date: this.props.experiment.start_date ?? year+"-"+month+"-"+day,
      end_date: this.props.experiment.end_date ?? null,
      score: this.props.experiment.score ?? null,
      device: this.props.experiment.device ?? null,
      day:this.props.experiment.day ?? 0,
      phase_day:this.props.experiment.phase_day ?? 0,
      current_phase: this.props.experiment.current_phase ?? 0, 
    };

    this.editEntry = this.editEntry.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getPlants();
    this.getPods(this.state.id);
    this.getExperiments(); // call getExperiments
    //as soon as form instantiation, specify 
    if(this.state.device !== null) {
      this.setState({capacity: this.state.device_list.filter(device => device.id === this.state.device)[0].capacity});
    } else {
      this.setState({capacity: this.state.pod_list.length}); 
    }
  }

  addEntry(e) {
    axios.all([
      axios.post(`/api/experiments/`, 
        { 
          name: this.state.name,
          start_date: this.state.start_date,
          device: this.state.device,
          //current_phase: //add an id reference to the currently running phase
        }),
    ])
    .then((res) => {
      // then add pods:
      for (const [key, value] of Object.entries(this.state.pod_selection)) {
        axios.post(`/api/pods/`, 
          { 
            start_date: this.state.today,
            position: parseInt(key),
            plant: parseInt(value), 
            phase: 0,
            experiment: this.state.id,
          })
      }
    })
    .then((res) => {
      this.setState({device: this.state.new_device})
      this.setState({new_device: null})
      this.props.getExperiments()
      this.getPods()
    })
    .catch((err) => console.log(err))
  
  };

  editEntry(e) {
    // patch experiment and update with new device
    axios.patch(`/api/experiments/${this.state.id}/`, {
        name: this.state.name,
        device: ( this.state.new_device ? this.state.new_device : this.state.device ) 
      })
      .then((res) => {
        this.setState({device: this.state.new_device})
        this.setState({new_device: null})
        this.props.getExperiments()
      })
      .catch((err) => console.log(err));
    
    // patch pods: when a pod is replaced, set an end date: indicates premature termination. 
    // iterate through (new pod selections x existing pods). key == position in byte, value == plant_id
    console.log("POD SELECTION: ", this.state.pod_selection)
    console.log("PODLIST: ", this.state.pod_list)
    for (const [key, value] of Object.entries(this.state.pod_selection)) {
      let pod_found = false;
      // pod 0: [{position: 1, ...}]
      // what if pod_list does not have all filled pods? what if only 4 pods in pod list, but not a fifth?
      for(let p = 0; p < this.state.pod_list.length; p++) {
        console.log(this.state.pod_list[p].position)
        // found the pod to be replaced
        if(this.state.pod_list[p].position === parseInt(key)) {
          console.log("editing ")
          // set the old pod to 'terminated' state (has end date)
          axios
            .patch(`/api/pods/${this.state.pod_list[p].id}/`, { end_date: this.state.today }) // end date set to today
            .then((res) => {
              this.getPods(this.state.id)
            })
            .catch((err) => console.log(err));
          
          // if a new pod was specified for replacement and it WASNT the empty pod option
          if(value !== '') {  
            axios
            .post(`/api/pods/`, { start_date: this.state.today, position: parseInt(key), plant: parseInt(value), experiment: this.state.id }) // end date set to today
            .then((res) => {
              this.getPods(this.state.id)
            })
            .catch((err) => console.log(err));
          }
          pod_found = true
          break
        }
      }

      // otherwise, if no replaceable pod is found, just create a new one
      if(!pod_found) {

        axios
          .post(`/api/pods/`, 
            { 
              start_date: this.state.today,
              position: parseInt(key),
              plant: parseInt(value), 
              experiment: this.state.id,
            })
          .then((res) => {
            this.getPods(this.state.id)
          })
          .catch((err) => console.log(err));
      }


    }
  };

  handleChange (e) {
    //handle pod selection manipulation
    if(e.target.name.includes("pod")) { 

      // we need to keep a dictionary of all the pods we plant to update. 
      // We use a dictionary because indices can be rewritten at the same location 
      let position = e.target.name.substring(4); 
      let pod_selection_temp = this.state.pod_selection
      pod_selection_temp[position] = e.target.value
      this.setState({pod_selection: pod_selection_temp });
      //console.log(pod_selection_temp)
      console.log("CHANGED POD SELECTION: ", this.state.pod_selection )
    } else if (e.target.name.includes("device")) { // if setting a new device, two step process so we can tell the old one its off duty
      console.log("FLAG: ", e.target.value)
      if(e.target.value === "") {
        this.setState({"capacity": 0})
        this.setState({"new_device": null});
      } else {
        this.setState({"capacity": this.state.device_list.filter(device => device.id === parseInt(e.target.value))[0].capacity})
        this.setState({"new_device": e.target.value});
      }
    } else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  getPlants = () => {
    axios
      .get("/api/plants/")
      .then((res) => this.setState({ plant_list: res.data }))
      .catch((err) => console.log(err));

  };

  getPods(id) {
    if(this.state.id !== null) {
      axios
          .get(`/api/pods/?experiment=${id}`)
          .then((res) => {
            let temp_pod_list = res.data.filter(pod => pod.end_date === null)
            this.setState({ pod_list: temp_pod_list})
          })
          .catch((err) => console.log(err));

      
    }
  }

  getExperiments = () => {
    axios
      .get("/api/experiments/")
      .then((res) => this.setState({ experiment_list: res.data }))
      .catch((err) => console.log(err));
  };

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
                  <input className="name_selection" name="name" value={this.state.name} placeholder = {"Experiment Name"} onChange={this.handleChange} />
                  { this.props.add_or_edit === "add" ? 
                    <input className="start_date_selection" type="date" name="start_date" value={this.state.start_date} onChange={this.handleChange} />
                    : ""
                  }
                </div>

                <div className="form_row"> 
                    {
                      (() => {
                        // allow moving experiment to a different device if the device has the same capacity of pods or greater
                        let device_list_selection = [];

                        // for each device in device list, verify that no experiment is using it COMPLETE THIS
                        /*
                        for (const e of Object.entries(this.state.experiment_list)) {
                          console.log("EXPERIMENT: ", e)
                        }
                        */
                        device_list_selection.push(
                          <select className="device_selection" defaultValue= {this.state.device} name="device" onChange={this.handleChange}>
                            <option key={"no_device_available"} value={null}></option>
                            
                            { this.state.device_list.map((item) => (item.capacity >= this.state.capacity) ? <option key={item.id} value={item.id}>{item.name} </option> : <></>) }
                          </select>
                        );
                        return device_list_selection;
                      })()
                    }

                </div>
                 
                {
                  (() => {
                    // only should if a device has been specified: need capacity of device and pod_list from the device
                    if(this.state.device !== null || this.state.new_device !== null) {
                    
                      let pod_list_container = [] 

                      for(let i = 0; i < this.state.capacity; i++) { // 0, 5, 10 whatever

                        let curr_pod = this.state.pod_list.filter(pod => pod.position === (i+1))[0] ?? null
                        let plant = null;      

                        if (curr_pod !== null){
                          plant = curr_pod['plant']
                        }

                        pod_list_container.push(
                          <select className="pod" name={"pod_"+(i+1)} defaultValue={plant} onChange={this.handleChange}> 
                            
                            <option value={null}></option>
                            
                            { this.state.plant_list.map((item) => <option key={item.id} value={item.id}>{item.name}</option>) }

                          </select>
                        );
                      }
                      return <div className="form_row">{pod_list_container}</div>;
                    }               
                  })()
                }

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