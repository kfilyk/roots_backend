import React, { Component } from "react";
import axios from "axios";
import ProgressCircle from '../common/ProgressCircle'
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          id: this.props.experimentId,
          podList: [{score: 0.10, caption: 'Basil'}, {score: 0.20, caption: 'Dill'}, {score: 0.30, caption: 'Lemon'}, {score: 0.40, caption: 'Tomato'}, {score: 0.50, caption: 'Parsley'}],
          pod1_score: 0.10 * 100,
          pod2_score: 0.20 * 100,
          pod3_score: 0.30 * 100,
          pod4_score: 0.40 * 100,
          pod5_score: 0.50 * 100,
        //   pod1_score: this.props.experiment.pod1_score,
        //   pod2_score: this.props.experiment.pod2_score,
        //   pod3_score: this.props.experiment.pod3_score,
        //   pod4_score: this.props.experiment.pod4_score,
        //   pod5_score: this.props.experiment.pod5_score,
        //   pod1: this.props.experiment.pod1,
        //   pod2: this.props.experiment.pod2,
        //   pod3: this.props.experiment.pod3,
        //   pod4: this.props.experiment.pod4,
        //   pod5: this.props.experiment.pod5,
      };
    //   console.log(props)
    }

    getPodScore(e) {
        axios
            .get(`/api/pods/${this.state.id}/`)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => console.log(err));
        this.setState({[e.target.name]: e.target.value})
    }

    renderItems = () => {
        return (
          this.state.podList.map((item) => (
            <ProgressCircle progress={{value: item.score, caption: item.caption, colour: 'green'}}></ProgressCircle>
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
  