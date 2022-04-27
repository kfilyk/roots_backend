import React, { Component } from "react";
  
//https://codepen.io/sergiopedercini/pen/jmKdbj

export default class CustomModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          value: this.props.progress.value * 100,
          caption: this.props.progress.caption,
          colour: this.props.progress.colour
      };
      
    }
    render() {
        return (
            //https://codepen.io/sergiopedercini/pen/jmKdbj
            <div class="flex-wrapper">
                <div class="single-chart">
                    <svg viewBox="0 0 36 36" class={'circular-chart '+ this.state.colour}>
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray={this.state.value + ' 100'}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage"> {this.state.value}%</text>
                    </svg>
                    <div>{this.state.caption}</div>
                </div>
            </div>
        )
    }
}
  