import React, { Component } from "react";
import axios from "axios";
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          id: this.props.experimentId
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

    render() {
        return (
            //https://codepen.io/sergiopedercini/pen/jmKdbj
            <div class="flex-wrapper">
                <div class="single-chart">
                    <svg viewBox="0 0 36 36" class="circular-chart blue">
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray="50, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">40%</text>
                    </svg>
                    <div>Completion</div>
                </div>

                <div class="single-chart">
                    <svg viewBox="0 0 36 36" class="circular-chart green">
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray="60, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">40%</text>
                    </svg>
                    <div>Score</div>
                </div>

                <div class="single-chart">
                    <svg viewBox="0 0 36 36" class="circular-chart green">
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray="60, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">40%</text>
                    </svg>
                    <div>Score</div>
                </div>

                <div class="single-chart">
                    <svg viewBox="0 0 36 36" class="circular-chart green">
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray="60, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">40%</text>
                    </svg>
                    <div>Score</div>
                </div>

                <div class="single-chart">
                    <svg viewBox="0 0 36 36" class="circular-chart green">
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray="60, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">40%</text>
                    </svg>
                    <div>Score</div>
                </div>
            </div>
        )
    }
}
  