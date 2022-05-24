import React, { Component } from "react";
import "./progress_circle.css";

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
                <div className="single-chart">
                    <svg viewBox="0 0 36 36" className={'circular-chart '+ this.state.colour}>
                    <path className="circle-bg"
                        d="M18 2.0845
                        a 16 16 0 0 1 0 32
                        a 16 16 0 0 1 0 -32"
                    />
                    <path className="circle"
                        strokeDasharray={this.state.value + ' 100'}
                        d="M18 2.0845
                        a 16 16 0 0 1 0 32
                        a 16 16 0 0 1 0 -32"
                    />
                    { this.state.value === 0 ?
                        <text x="18" y="20" className="caption"> {this.state.caption}</text>
                    : 
                    <>
                        <text x="18" y="18" className="caption"> {this.state.caption}</text>
                        <text x="18" y="24" className="percentage"> {this.state.value + "%"}</text>
                    </> 

                    }

                    </svg>
                </div>
        )
    }
}
  