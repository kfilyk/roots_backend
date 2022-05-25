import React, { Component, useEffect} from "react";
import ExperimentModal from "./ExperimentModal"
import PodCarousel from "./PodCarousel"
import axios from "axios";
import "./experiment.css"
import vertical_menu_icon from "../../img/vertical_menu_icon.png"

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
        experiment: this.props.experiment,    
        device: this.props.d,
        completion_score: 0,
        pod_list: [],
        device_list: this.props.device_list ?? [],
      };
      this.deleteEntry = this.deleteEntry.bind(this);
      this.getPods = this.getPods.bind(this);
    }

    componentDidMount() {
        this.getPods(this.props.experiment.id);
    }

    deleteEntry = (id) => {
        axios
            .delete(`/api/experiments/${id}/`)
            .then((res) => {
                this.props.getExperiments()
            })
            .catch((err) => console.log(err));
      };

    getPods(id) {
        axios
            .get(`/api/pods/?experiment=${id}`)
            .then((res) => {
                let active_pods = res.data.filter(pod => pod.end_date === null)
                console.log("ACTIVE PODS: ", active_pods)
                this.setState({ pod_list: active_pods})
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
        const device = this.state.device_list.filter(device => device.id === this.state.experiment.device)[0] ?? {} // could also use ||
        let device_name = device.name ?? ""

        
        return (
            <>
                <div className="object_container">
                    <div className="object_description">
                        <div>{ this.state.experiment.name }</div>
                        { !this.props.on_device_page ? 
                            <>
                                <div>Device Name: { device_name }</div>
                                <div>Date: {start_date_string} {"->"} {end_date_string}</div>
                            </>
                            : <></>
                        }

                        <div>Score: { this.state.experiment.score } </div>
                    </div>
                    <div className="pod_carousel_wrapper">
                            {
                                (this.state.pod_list.length > 0) ?                             
                                <PodCarousel pod_list={this.state.pod_list} num_pods = {device.num_pods} ></PodCarousel>
                                :
                                <></>
                            }
                    </div>
                    <div className='object_actions'>
                        <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                        <li key="edit"><ExperimentModal device_list = {this.props.device_list} getExperiments={this.props.getExperiments} experiment={this.props.experiment} add_or_edit = {"edit"}></ExperimentModal></li>
                        <li key="delete"><button onClick= {() =>  { if (window.confirm(`You are about to delete ${this.state.experiment.id}, ${this.state.experiment.name}`)) this.deleteEntry(this.state.experiment.id) }}> DELETE</button></li>
                    </div>
                </div>
            </>
        )
    }
}
  