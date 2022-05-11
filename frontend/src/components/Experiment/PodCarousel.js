import React, { Component } from "react";
import axios from "axios";
import ProgressCircle from '../common/ProgressCircle'
import "./experiment.css"
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          podList: this.props.podList,
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ podList: nextProps.podList })
    }

    renderItems = () => {
        return (
          this.state.podList.map((item) => (
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
  