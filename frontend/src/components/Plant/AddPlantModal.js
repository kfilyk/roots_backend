import React, { Component } from "react";
import Popup from "reactjs-popup";
import {Input, Label,} from "reactstrap";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        supplier: ''
    };

    this.addEntry = this.addEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addEntry(e) {
    if (window.localStorage.getItem("token")) {
      // if a token is found, set the authorization and attempt to vlaidate it against the server
      axios.defaults.headers.common.Authorization = `Token ${window.localStorage.getItem("token")}`;

      axios
      .post(`/api/plants/`, 
        { 
            name: `${this.state.name}`,
            supplier: `${this.state.supplier}`
        })
      .then((res) => {
        //DO SOMETHING HERE???
      })
      .catch((err) => console.log(err));
    } else {
      console.log("Error with ADD")
    }

  };

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Popup
        trigger={<button className="button"> Add </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header"> Add New Plant </div>
            <div className="content">
            <label> Name: </label>
                <input name="name" value={this.state.name} onChange={this.handleChange} />
            <br></br>
            <label> Supplier: </label>
                <input name="supplier" value={this.state.supplier} onChange={this.handleChange} />
            </div>
            <div className="actions">
              <button onClick={this.addEntry}>Save</button>
            </div>
          </div>
        )}
      </Popup>
    );
  }
}
