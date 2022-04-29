import React, { Component, useEffect} from "react";
import EditExperimentModal from "./EditExperimentModal"
import PodCarousel from "./PodCarousel"
import ProgressCircle from "../common/ProgressCircle";

function getColor(value){
    // hue value from 0 to 360
    var hue=(value*120).toString(10); 
    return ["hsl(",hue,", 50%, 50%)"].join("");
}
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          experiment: this.props.experiment,
          completion_score: 0,
      };

    }

    calculateCompletion(sd, ed) {
        var start_date = new Date(sd).getTime()
        var end_date = new Date(ed).getTime()
        var today = new Date().getTime()
        if (today >= end_date) {
            return 1
        } else if (today < start_date) {
            return 0
        } else {
            var percent = (end_date - today)/(end_date - start_date)
            return percent.toFixed(2)
        }
     }

    componentWillReceiveProps(nextProps) {
        this.setState({ experimentList: nextProps.experimentList })
      }

    render() {

        return (
            <div className="experiment_containter">
                <div id="experiment" >
                    <div id="experimentLeft">
                        <div>Exp: { this.state.experiment.description }</div>
                        <div>Device: { this.state.experiment.device }</div>
                        <div>Date: {this.state.experiment.start_date.substring(5,10)} {"->"} { this.state.experiment.end_date.substring(5,10)}, {this.state.experiment.start_date.substring(0,4)}</div>
                        <div>Score: { this.state.experiment.score } </div>
                        <div class="flex-wrapper">
                            <ProgressCircle progress={{value: this.calculateCompletion(this.state.experiment.start_date, this.state.experiment.end_date), caption: 'Completion', colour: 'blue'}}></ProgressCircle>
                            <ProgressCircle progress={{value: this.state.experiment.score, caption: 'Score', colour: 'green'}}></ProgressCircle>
                        </div>
                        <div className='actions'>
                        <EditExperimentModal classs='actionsButton' getExperiments={this.props.getExperiments} experiment={this.state.experiment}></EditExperimentModal>
                        </div>
                    </div>
                    <div id="experimentRight">
                        <PodCarousel experimentId={this.props.experiment.id}></PodCarousel>
                    </div>
                </div>
            </div>
        )
    }
}
  