import React, { Component } from "react";
import EditExperimentModal from "./EditExperimentModal"
import PodCarousel from "./PodCarousel"
import ProgressCircle from "./ProgressCircle";

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

    componentWillReceiveProps(nextProps) {
        this.setState({ experimentList: nextProps.experimentList })
      }

    render() {
        let hsl = getColor(this.state.experiment.score)

        return (
            <div className="experiment_containter">
                <div id="experiment" style= {{border: 'solid '+hsl+' 6px'}} >
                    <div id="progressCircles">
                        <div>Exp: { this.state.experiment.description }</div>
                        <div>Device: { this.state.experiment.device }</div>
                        {/* <div>{ this.state.experiment.start_date } {"->"} { this.state.experiment.end_date }</div> */}
                        {/* <div>{ this.state.experiment.score } </div> */}
                        <ProgressCircle progress1='44' progress2='90' colour='green'></ProgressCircle>
                        <EditExperimentModal getExperiments={this.props.getExperiments} experiment={this.state.experiment}></EditExperimentModal>
                    </div>
                    <div id="podCarousel">
                        <PodCarousel experimentId={this.props.experiment.id}></PodCarousel>
                    </div>
                </div>
            </div>
        )
    }
}
  