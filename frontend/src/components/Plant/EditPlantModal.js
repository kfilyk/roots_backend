import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
        id: this.props.plantData.id,
        name: this.props.plantData.name,
        supplier: this.props.plantData.supplier
    };

    this.editEntry = this.editEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  editEntry(e) {
    axios
      .patch(`/api/plants/${this.state.id}/`, 
        { 
            id: `${this.state.id}`,
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
      <Popup trigger={<button className="button"> EDIT </button>} modal nested>
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="modal_type"> Edit Plant </div>
              <div className="modal_content">
                <div className="form_row">
                  <label> Id: </label> <label>{this.state.id}</label>
                </div>

                <div className="form_row">
                  <label> Name: </label> <input name="name" value={this.state.name} onChange={this.handleChange} />
                </div>

                <div className="form_row">
                  <label> Supplier: </label> <input name="supplier" value={this.state.supplier} onChange={this.handleChange} />
                </div>

                <button className='save' onClick={() => {
                this.editEntry()
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
