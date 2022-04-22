import React, { Component } from "react";
import EditExperimentModal from "./EditExperimentModal"


function getColor(value){
    // hue value from 0 to 360
    var hue=(value*120).toString(10); 
    return ["hsl(",hue,", 50%, 50%)"].join("");
}
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          experiment: this.props.experiment
      };

    }
    render() {
        let hsl = getColor(this.state.experiment.score)

        return (
            <div className="experiment_containter">
                <div className="experiment" style= {{border: 'solid '+hsl+' 6px'}} >
                    <div>{ this.state.experiment.description }</div>
                    <div>{ this.state.experiment.start_date } {"->"} { this.state.experiment.end_date }</div>
                    <div>{ this.state.experiment.score } </div>
                    <EditExperimentModal></EditExperimentModal>

                </div>
            </div>
        )
    }
}
  