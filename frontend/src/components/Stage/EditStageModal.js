import React, { Component } from "react";
import Popup from "reactjs-popup";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.stageData.id,
      author: this.props.stageData.author,
      days: this.props.stageData.days,
      watering_cycles: this.props.stageData.watering_cycles,
      nutrient_cycles: this.props.stageData.nutrient_cycles,
      nutrient_type: this.props.stageData.nutrient_type,
      blue_intensity: this.props.stageData.blue_intensity,
      red_intensity: this.props.stageData.red_intensity,
      white1_intensity: this.props.stageData.white1_intensity,
      white2_intensity: this.props.stageData.white2_intensity,
      lights_on_hours: this.props.stageData.lights_on_hours,
      score: this.props.stageData.score
    };

    this.editEntry = this.editEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);


  }

  editEntry(e) {
    axios
      .patch(`/api/stages/${this.props.stageData.id}/`, 
        { 
          author: this.state.author,
          days: this.state.days,
          watering_cycles: this.state.watering_cycles,
          nutrient_cycles: this.state.nutrient_cycles,
          nutrient_type: this.state.nutrient_type,
          blue_intensity: this.state.blue_intensity,
          red_intensity: this.state.red_intensity,
          white1_intensity: this.state.white1_intensity,
          white2_intensity: this.state.white2_intensity,
          lights_on_hours: this.state.lights_on_hours,
          score: this.state.score
        })
      .then((res) => {
        this.props.getStages()
      })
      .catch((err) => console.log(err));
  };

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Popup trigger={<button className="button" class='actionsButton'> EDIT </button>} modal nested>
        {(close) => (
          <div className="modal">
            <div className="modal_body">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="modal_type"> Edit Plant </div>
              <div className="modal_content">
                  <label> Id: </label>
                  {this.state.id}
              <br></br>
                  <label> Author: </label>
                  <input name="author" value={this.state.author} onChange={this.handleChange} />
              <br></br>                  
                  <label> Days: </label>
                  <input name="days" value={this.state.days} onChange={this.handleChange} />
              <br></br>   
                  <label> Watering Cycles: </label>
                  <input name="watering_cycles" value={this.state.watering_cycles} onChange={this.handleChange} />
              <br></br> 
                  <label> Nutrient Cycles: </label>
                  <input name="nutrient_cycles" value={this.state.nutrient_cycles} onChange={this.handleChange} />
              <br></br>   
                  <label> Nutrient Type: </label>
                  <input name="nutrient_type" value={this.state.nutrient_type} onChange={this.handleChange} />
              <br></br>   
                  <label> Blue Intensity: </label>
                  <input name="blue_intensity" value={this.state.blue_intensity} onChange={this.handleChange} />
              <br></br>   
                  <label> Red Intensity: </label>
                  <input name="red_intensity" value={this.state.red_intensity} onChange={this.handleChange} />
              <br></br>
                  <label> White1 Intensity: </label>
                  <input name="white1_intensity" value={this.state.white1_intensity} onChange={this.handleChange} />
              <br></br>
                  <label> White2 Intensity: </label>
                  <input name="white2_intensity" value={this.state.white2_intensity} onChange={this.handleChange} />
              <br></br>
                  <label> Lights on hours: </label>
                  <input name="lights_on_hours" value={this.state.lights_on_hours} onChange={this.handleChange} />
              <br></br>
                  <label> Score: </label>
                  <input name="score" value={this.state.score} onChange={this.handleChange} />
              <br></br>
                                      
              </div>
              <div className="actions">
                <button class='actionsButton' onClick={() => {
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
