import React, { Component } from "react";
import Popup from "reactjs-popup";
import {Input, Label,} from "reactstrap";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: this.props.id,
        name: this.props.name,
        supplier: this.props.supplier
    };

    this.editEntry = this.editEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addEntry(e) {
    
    axios
      .post(`/api/plants/${this.state.id}/`, 
        { 
            id: `${this.state.id}`,
            name: `${this.state.name}`,
            supplier: `${this.state.supplier}`
        })
      .then((res) => {
        //DO SOMETHING HERE???
      })
      .catch((err) => console.log(err));
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
            <br></br>
            <label> Name: </label>
                <input name="name" value={this.state.name} onChange={this.handleChange} />
            <br></br>
            <label> Supplier: </label>
                <input name="supplier" value={this.state.supplier} onChange={this.handleChange} />
            </div>
            <div className="actions">
              <button onClick={this.editEntry}>Add New Plant</button>
            </div>
          </div>
        )}
      </Popup>
    );
  }
}
