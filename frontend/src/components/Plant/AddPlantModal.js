import React, { Component } from "react";
import Popup from "reactjs-popup";
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
    axios
      .post(`/api/plants/`, 
        { 
            name: `${this.state.name}`,
            supplier: `${this.state.supplier}`
        })
      .then((res) => {
        this.props.getPlants()
      })
      .catch((err) => console.log(err));
  };

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Popup
        trigger={<button className="button" class='actionsButton'> + </button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> Add New Plant </div>
              <div className="content">
              <br></br>
              <label> Name: </label>
                  <input name="name" value={this.state.name} onChange={this.handleChange} />
              <br></br>
              <label> Supplier: </label>
                  <input name="supplier" value={this.state.supplier} onChange={this.handleChange} />
              </div>
              <div className="actions">
                <button class='actionsButton' onClick={() => {
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
