

import React, { Component, } from "react";
import { Navigate } from "react-router-dom";
import Modal from "./Modal";
import axios from "axios";
import Login from './Login';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      deviceList: [],
      experimentList: [],
      modal: false,
      activeItem: {
        name: "",
        experiment: "",
        is_online: false,
      },
    };
  }

  componentDidMount() {
    console.log("AUTH: ", axios.defaults.headers.common.Authorization)
    this.refreshDeviceList();
    console.log(this.state.deviceList)

  };

  // use token to get user id, then use user id to get view
  refreshDeviceList = () => {
    axios
      .get("/api/devices/")
      //.then((res) => console.log(res.data))
      .then((res) => this.setState({ deviceList: res.data }))
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
        .then((res) => this.refreshDeviceList());
      return;
    }
    axios
      .post("/api/devices/", item)
      .then((res) => this.refreshDeviceList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/devices/${item.id}/`)
      .then((res) => this.refreshDeviceList());
  };

  createItem = () => {
    const item = { name: "", experiment: "", is_online: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  handleRequest() {
    // This request will only succeed if the Authorization header
    // contains the API token
    axios
      .get('/auth/logout/')
      
      /*
      .then(response => {
        Actions.auth()
      })
      */
      axios.defaults.headers.common.Authorization = null
      .catch(error =>  console.log(error));
  }


  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Complete
        </span>
        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.deviceList.filter(
      (item) => item.is_online === viewCompleted
    );

    return newItems.map((item) => (
      // display list of all items

      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {item.name}
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.experiment}
        >
          {item.experiment}

        </span>

        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
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

    // if no token
    if (axios.defaults.headers.common.Authorization == null) {
      <Login/>;
    } else {
      return (
        <main className="container">
          <h1 className="text-white text-uppercase text-center my-4">Plant Science Dashboard</h1>
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="card p-3">
                <div className="mb-4">
                  <button
                    className="btn btn-primary"
                    onClick={this.createItem}
                  >
                    Add task
                  </button>
                </div>
                {this.renderTabList()}
                <ul className="list-group list-group-flush border-top-0">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
            <button className="btn btn-primary" title="Logout" onClick={this.handleRequest.bind(this)}>
              Logout
            </button>
          </div>
          {this.state.modal ? (
            <Modal
              activeItem={this.state.activeItem}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}
        </main>

      );
  }
  }
  
}

export default Dashboard;