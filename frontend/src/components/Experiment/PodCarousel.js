import React, { Component } from "react";
import axios from "axios";
import ProgressCircle from '../common/ProgressCircle'
import "./experiment.css"
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          pod_list: this.props.pod_list ?? null,
          num_pods: this.props.num_pods ?? null,
      };
    }
    /*
    componentWillReceiveProps(nextProps) {
      this.setState({ pod_list: nextProps.pod_list })
      this.setState({ num_pods: nextProps.num_pods })
    }
    */
    
    render() {
      let progress_circle_container = []
      if (this.state.num_pods !== null && this.state.pod_list !== null) {
        console.log("FLAG")
        console.log("POD LIST: ", this.state.pod_list)

        for(let i = 0; i < this.state.num_pods; i++) {
          let pod = this.state.pod_list.filter(pod => pod.position === (i+1))[0] ?? null
          if(pod !== null) {
            progress_circle_container.push(<ProgressCircle key={"pod_"+pod.position+"_"+pod.experiment+"_"+pod.plant} progress={{value: pod.score, caption: pod.plant_name, colour: 'green'}}></ProgressCircle>) 
          } else {
            progress_circle_container.push(<ProgressCircle key={"pod_"+(i+1)+"_empty"} progress={{value: 0, caption: "empty", colour: 'grey'}}></ProgressCircle>) 
          }
        }
        return <> {progress_circle_container }</> ;
      }
    }
}
  