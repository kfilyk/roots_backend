

import React, { Component, } from "react";
import { Navigate } from "react-router-dom";
import Modal from "./Modal";
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
      recipeList: [],

      modal: false,
      activeItem: {
        name: "",
        experiment: "",
        is_online: false,
      },
    };
  }

  // runs after all components mounted on client side
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
          this.getDevices();
          this.getExperiments();
          this.getRecipes();

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
      //.then((res) => console.log(res.data))
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

  getRecipes = () => {
    axios
      .get("/api/recipes/")
      .then((res) => this.setState({ recipeList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      axios
        .put(`/api/devices/${item.id}/`, item)
        .then((res) => this.getDevices());
      return;
    }
    axios
      .post("/api/devices/", item)
      .then((res) => this.getDevices());
  };

  handleDelete = (item) => {
    //console.log(item.type)
    axios
      .delete(`/api/devices/${item.id}/`)
      .then((res) => this.getDevices());
  };

  createItem = () => {
    const item = { name: "", experiment: "", is_online: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleEdit = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
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
        <span className={this.state.selectedTab === "recipe" ? "nav-link active" : "nav-link"} onClick={() => this.setState({ selectedTab: "recipe" })}>
          RECIPES
        </span>
        <span className={this.state.selectedTab === "plant" ? "nav-link active" : "nav-link"} onClick={() => this.setState({ selectedTab: "plant" })}>
          PLANTS
        </span>
      </div>
    );
  };

  renderItems = () => {
    let items_list = [];
    if (this.state.selectedTab === "device"){
      items_list = this.state.deviceList;

      return items_list.map((item) => (
        // display list of all items
        <li key={ ''+this.state.selectedTab+' '+ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
          { item.id }: "{ item.name }"<br></br>
          REGISTRATION_DATE: { item.registration_date }<br></br>
          EXPERIMENT: { item.experiment }<br></br>
          MAC ADDRESS: { item.mac_address }<br></br>
  
          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => this.handleEdit(item)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
            >
              Delete
            </button>
          </span>
        </li>
      ));

    } else if (this.state.selectedTab === "experiment") {
      items_list = this.state.experimentList;

      return items_list.map((item) => (
        // display list of all items
        <li key={ ''+this.state.selectedTab+' '+ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
          ID: { item.id }<br></br>
          DEVICE: { item.device }<br></br>
          DESCRIPTION: { item.description }<br></br>
          SCORE: { item.score }<br></br>
          START DATE: { item.start_date }<br></br>
          END DATE: { item.end_date }<br></br>
          POD1: { item.pod1 }<br></br>
          POD2: { item.pod2 }<br></br>
          POD3: { item.pod3 }<br></br>
          POD4: { item.pod4 }<br></br>
          POD5: { item.pod5 }<br></br>
          POD6: { item.pod6 }<br></br>
          POD7: { item.pod7 }<br></br>
          POD8: { item.pod8 }<br></br>
          POD9: { item.pod9 }<br></br>
          POD10: { item.pod10 }<br></br>

          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => this.handleEdit(item)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
            >
              Delete
            </button>
          </span>
        </li>
      ));

    } else if (this.state.selectedTab === "recipe") {
      items_list = this.state.recipeList;
    }

    return items_list.map((item) => (
      // display list of all items
      <li key={ ''+this.state.selectedTab+' '+ item.id } className="list-group-item d-flex justify-content-between align-items-center" >
        ID: { item.id }<br></br>
        { item.data }<br></br>

        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.handleEdit(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

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
                  <button className="btn btn-primary" onClick={this.createItem} > Add Device </button>

                </div>
              </div>
            </div>

            {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
              />
            ) : null}
          </div>
        </main>

      );
  }
  
}

export default Dashboard;