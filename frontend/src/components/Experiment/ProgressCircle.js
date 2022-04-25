import React, { Component } from "react";
  
export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          progress1: this.props.progress1,
          progress2: this.props.progress2
      };
      
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
                        stroke-dasharray="30, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage"> {this.state.progress1}%</text>
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
                    <text x="18" y="20.35" class="percentage"> {this.state.progress2}%</text>
                    </svg>
                    <div>Score</div>
                </div>
            </div>
        )
    }
}
  