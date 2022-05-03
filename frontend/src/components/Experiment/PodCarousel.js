import React, { Component } from "react";
import axios from "axios";
import ProgressCircle from '../common/ProgressCircle'
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          podList: []
      };
    }

    componentDidMount(){
      this.getPodScore(this.props.experimentId)
    }

    getPodScore(id) {
        axios
            .get(`/api/pods/?experiment=${id}`)
            .then((res) => {
                this.setState({ podList: res.data })
            })
            .catch((err) => console.log(err));
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
  