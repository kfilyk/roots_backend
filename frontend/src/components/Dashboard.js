

import React, { Component, } from "react";
import { Navigate } from "react-router-dom";
import ListPlantModal from './Plant/ListPlantModal';
import AddPlantModal from './Plant/AddPlantModal';
import ListExperimentModal from './Experiment/ListExperimentModal';
import AddExperimentModal from './Experiment/AddExperimentModal';
import Experiment from './Experiment/Experiment';
import ListStageModal from './Stage/ListStageModal';
import AddStageModal from './Stage/AddStageModal';
import axios from "axios";
import user from './user_brown.png';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      isLoggedIn: true,
      selectedTab: "device",
      deviceList: [],
      experimentList: [],
      stageList: [],
      plantList: [],

      modal: false,
      activeItem: {
        name: "",
        experiment: "",
        is_online: false,
      },
    };
    this.getStages = this.getStages.bind(this)
    this.getPlants = this.getPlants.bind(this)
    this.getExperiments = this.getExperiments.bind(this)
  }
  // runs before rendering mounted on client side
  componentDidMount() {
    // if no token found, redirect to login
    if (!window.localStorage.getItem("token")) {
      this.setState({ isLoggedIn: false})
      this.logout()
    }

    if (window.localStorage.getItem("token")) {
      // if a token is found, set the authorization and attempt to vlaidate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem("token")}`;

      axios
        .post("/auth/token/")
        .then(res => {
          if (res.status === 200) {
            console.log("STATUS 200 (SUCCESSFUL): ", res)
          }
          this.setState({ user: res.data.username })
          this.getExperiments();
          this.getDevices();
          this.getStages();
          this.getPlants();

          console.log("IS TOKEN: ", window.localStorage.getItem("token"))

        })
      .catch(res => {
        console.log(res)
        this.setState({ isLoggedIn: false})
        this.logout()
        console.log("AUTO LOGGED OUT!")
      });
    }
  };

  getDevices = () => {
    axios
      .get("/api/devices/")
      .then((res) => {
        console.log("DEVICE RESPONSE: ", res)
        this.setState({ deviceList: res.data })
      })
      .catch((err) => console.log(err));
  };

  getExperiments = () => {
    axios
      .get("/api/experiments/")
      .then((res) => this.setState({ experimentList: res.data }))
      .catch((err) => console.log(err));
  };

  getStages = () => {
    axios
      .get("/api/stages/")
      .then((res) => this.setState({ stageList: res.data }))
      .catch((err) => console.log(err));
  };

  getPlants = () => {
    axios
      .get("/api/plants/")
      .then((res) => this.setState({ plantList: res.data }))
      .catch((err) => console.log(err));
  };

  handleSubmit = (item) => {
    if (this.state.selectedTab === 'device') {
      if (item.id) {
        axios
          .put(`/api/devices/${item.id}/`, item)
          .then((res) => this.getDevices());
        return;
      }
      axios
        .post("/api/devices/", item)
        .then((res) => this.getDevices());
    } else if(this.state.selectedTab ==='experiment') {
      if (item.id) {
        axios
          .put(`/api/experiments/${item.id}/`, item)
          .then((res) => this.getExperiments());
        return;
      }
      axios
        .post("/api/experiments/", item)
        .then((res) => this.getExperiments());      
    } else if(this.state.selectedTab ==='stage') {
      if (item.id) {
        axios
          .put(`/api/stages/${item.id}/`, item)
          .then((res) => this.getStages());
        return;
      }
      axios
        .post("/api/stages/", item)
        .then((res) => this.getStages());         
    } else if(this.state.selectedTab ==='plant') {
      if (item.id) {
        axios
          .put(`/api/plants/${item.id}/`, item)
          .then((res) => this.getPlants());
        return;
      }
      axios
        .post("/api/plants/", item)
        .then((res) => this.getPlants());         
    }
  };

  handleDelete = (item) => {
    //console.log(item.type)
    if (this.state.selectedTab === 'device') {
      axios
      .delete(`/api/devices/${item.id}/`)
      .then((res) => this.getDevices());
    } else if(this.state.selectedTab ==='experiment') {
      axios
      .delete(`/api/experiments/${item.id}/`)
      .then((res) => this.getDevices());
    } else if(this.state.selectedTab ==='stage') {
      axios
      .delete(`/api/stages/${item.id}/`, item)
      .then((res) => this.getExperiments());      
    } else if(this.state.selectedTab ==='plant') {
      axios
      .delete(`/api/plants/${item.id}/`, item)
      .then((res) => this.getPlants());      
    }
  };

  createItem = () => {
    const item = { name: "", experiment: "", is_online: false };

    this.setState({ activeItem: item });
  };

  handleEdit = (item) => {
    this.setState({ activeItem: item });
  };


  logout() {
    // This request will only succeed if the Authorization header
    // contains the API token
    //axios.defaults.headers.common.Authorization =  `Token ${window.localStorage.getItem('token')}`
    axios
      .get('/auth/logout/')

      .then(response => {
        localStorage.removeItem('token');
      })
      .catch(error =>  console.log(error))  
      this.setState({isLoggedIn: false})
  }

  renderTabList = () => {
    return (
      <div className="nav">
        <span className={this.state.selectedTab === "device" ? "nav-link active" : "nav-link"} onClick={() => this.setState({ selectedTab: "device" })}>
          DEVICES
        </span>
        <span className={this.state.selectedTab === "experiment" ? "nav-link active" : "nav-link"} onClick={() => this.setState({ selectedTab: "experiment" })}>
          EXPERIMENTS
        </span>
        <span className={this.state.selectedTab === "stage" ? "nav-link active" : "nav-link"} onClick={() => this.setState({ selectedTab: "stage" })}>
          STAGES
        </span>
        <span className={this.state.selectedTab === "plant" ? "nav-link active" : "nav-link"} onClick={() => this.setState({ selectedTab: "plant" })}>
          PLANTS
        </span>
      </div>
    );
  };

  renderItems = () => {

    let items_list = [];
    let experiment_list = [];
    if (this.state.selectedTab === "device"){
      items_list = this.state.deviceList;
      experiment_list = this.state.experimentList;

      return items_list.map((item) => {
        
        const e = experiment_list.filter(experiment => experiment.id === item.experiment)[0] ?? {} // could also use ||
  
        // display list of all items
        return <li key={ ''+this.state.selectedTab+' '+ item.id } className="item">
          <div className="edit">
            <button class="actionsButton" className="btn btn-secondary mr-2"
              onClick={() => this.handleEdit(item)}
            >
              EDIT
            </button>
            <button class="actionsButton" className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
            >
              DELETE
            </button>
          </div>
          <div className="info">
            <div className="device_name">{ item.name }</div>
            <div>Registered: { item.registration_date }</div>
            <div>Mac: { item.mac_address }</div>
          </div>
          <Experiment experiment = {e}></Experiment>
          <span>
            <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) this.deleteEntry(item.id) }}> DELETE </button>
          </span>
        </li>

      });

    } else if (this.state.selectedTab === "experiment") {
      return(
        <>
          <ListExperimentModal getExperiments={this.getExperiments} experimentList={this.state.experimentList}/>
          <AddExperimentModal getExperiments={this.getExperiments}></AddExperimentModal>
        </>
      );

    } else if (this.state.selectedTab === "stage") {
      return(
        <>
          <ListStageModal getStages={this.getStages} stageList={this.state.stageList}/>
          <AddStageModal getStages={this.getStages}></AddStageModal> 
        </>
      );
    } else if (this.state.selectedTab === "plant") {
      return(
        <>
          <ListPlantModal getPlants={this.getPlants} plantList={this.state.plantList}/>
          <AddPlantModal getPlants={this.getPlants}></AddPlantModal> 
        </>
      );
    }}

  render() {
      if (!this.state.isLoggedIn) {
        return <Navigate to = {{ pathname: "/" }} />;
      }

      return (
        <main className="container">
          <div className="header">
            <h1 className="title">AVA PLANT SCIENCE DATA PLATFORM</h1>
            <div className="user_container">
              <button id="logout" title="Logout" onClick={this.logout.bind(this)}>
                <span>{ this.state.user }</span>
              </button>
              <div className="user_img_frame">
                <img className="user_img" src={user} alt="NO IMG!"/>
              </div>
            </div>
          </div>

          <div className="dashboard">

            <div className="row">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  {this.renderTabList()}
                  <ul className="list-group list-group-flush border-top-0">
                    {this.renderItems()}
                  </ul>
                  {/*<button className="btn btn-primary" onClick={this.createItem} > Add {this.state.selectedTab} </button> */}

                </div>
              </div>
            </div>
          </div>
        </main>

      );
  }
  
}

export default Dashboard;