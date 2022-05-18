import React, { Component, useEffect} from "react";
import ExperimentModal from "./ExperimentModal"
import PodCarousel from "./PodCarousel"
import ProgressCircle from "../common/ProgressCircle";
import axios from "axios";
import PlantList from "../Plant/PlantList";
import "./experiment.css"

function getColor(value){
    // hue value from 0 to 360
    var hue=(value*120).toString(10); 
    return ["hsl(",hue,", 50%, 50%)"].join("");
}
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.props = props; // this seems to fix props.undefined errors!
      this.state = {
          plantList: this.props.plantList,
          experiment: this.props.experiment,       
          completion_score: 0,
          podList: [] 
      };
      this.deleteEntry = this.deleteEntry.bind(this);
      this.getPodList = this.getPodList.bind(this);
    }

    componentDidMount() {
        this.getPodList(this.props.experiment.id)
    }

    deleteEntry = (id) => {
        axios
            .delete(`/api/experiments/${id}/`)
            .then((res) => {
                this.props.getExperiments()
            })
            .catch((err) => console.log(err));
      };

    getPodList(id) {
        axios
            .get(`/api/pods/?experiment=${id}`)
            .then((res) => {
                this.setState({ podList: res.data })
                console.log("POD LIST: ", this.state.podList)
            })
            .catch((err) => console.log(err));
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

    render() {
        let start_date_string = this.state.experiment.start_date ?? ""
        let end_date_string = this.state.experiment.start_date ?? ""
        return (
            <div className="experiment_containter">
                <div id="experiment" >
                    <div id="experimentLeft">
                        <div>Exp: { this.state.experiment.description }</div>
                        <div>Device ID: { this.state.experiment.device }</div>
                        <div>Device Name: { this.state.experiment.device }</div>
                        <div>Date: {start_date_string} {"->"} {end_date_string}</div>
                        <div>Score: { this.state.experiment.score } </div>
                        {/*
                        <div className="flex-wrapper">
                            <ProgressCircle progress={{value: this.calculateCompletion(this.state.experiment.start_date, this.state.experiment.end_date) ?? 0, caption: 'Completion', colour: 'blue'} }></ProgressCircle>
                            <ProgressCircle progress={{value: this.state.experiment.score, caption: 'Score', colour: 'green'}}></ProgressCircle>
                        </div>
                        */}
                        
                    </div>
                    <div id="experimentRight">
                        <div className='actionsContainer'>
                            <ExperimentModal getExperiments={this.props.getExperiments} plantList={this.props.plantList} experiment={this.props.experiment} add_or_edit = {"edit"}></ExperimentModal>
                            <button onClick={() => { if (window.confirm(`You are about to delete ${this.state.experiment.id}, ${this.state.experiment.description}`)) this.deleteEntry(this.state.experiment.id) }}> DELETE </button>
                        </div>
                        <div className="podCarouselWrapper">
                            <PodCarousel podList={this.state.podList}></PodCarousel>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
  