import React, { Component } from "react";
import axios from "axios";
import ProgressCircle from '../common/ProgressCircle'
import "./experiment.css"
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          pod_list: this.props.pod_list,
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ pod_list: nextProps.pod_list })
    }

    renderItems = () => {
        return (
          this.state.pod_list.map((item) => (
            <ProgressCircle progress={{value: item.score, caption: item.plant_name, colour: 'green'}}></ProgressCircle>
          ))
        );
      }
    
      render() {
        return (
            <>
                {this.renderItems()}
            </>
        )
      }
}
  