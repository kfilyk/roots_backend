import React, { Component } from "react";
import './App.css';

const deviceList = [
  {
    //id: 1,
    device: "AB1",
    experiment: "EXP1",
    active: true,
  },
  {
    //id: 2,
    device: "AB2",
    experiment: "EXP2",
    active: false,
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewActive: false,
      devices: deviceList,
    };
  }

  displayActive = (status) => {
    if (status) {
      return this.setState({ viewActive: true });
    }

    return this.setState({ viewActive: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={this.state.viewActive ? "nav-link active" : "nav-link"}
          onClick={() => this.displayActive(true)}
        >
          Active
        </span>
        <span
          className={this.state.viewActive ? "nav-link" : "nav-link active"}
          onClick={() => this.displayActive(false)}
        >
          Inactive
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewActive } = this.state;
    const newDevices = this.state.devices.filter(
      (item) => item.active === viewActive)
    ;

    return newDevices.map((item) => (
      <li
        key={item.device}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewActive ? "Experiment complete" : ""
          }`}
          title={item.experiment}
        >
          {item.device}
          <br></br>
          
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Plant Science App</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
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
        </div>
      </main>
    );
  }
}

export default App;
