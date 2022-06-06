import React, { useState, useEffect } from 'react';
import "./progress_circle.css";

const ProgressCircle = (props) => {
    const [value, set_value] = useState(props.progress.value * 100)
    const [caption, set_caption] = useState(props.progress.caption * 100)
    const [colour, set_colour] = useState(props.progress.colour * 100)

    useEffect(() => {
        set_value(props.progress.value * 100)
        set_caption(props.progress.caption * 100)
        set_colour(props.progress.colour * 100)
      }, [props]);

    return (
        //https://codepen.io/sergiopedercini/pen/jmKdbj
        <div className="single-chart">
            <svg viewBox="0 0 36 36" className={'circular-chart '+ colour}>
            <path className="circle-bg"
                d="M18 2.0845
                a 16 16 0 0 1 0 32
                a 16 16 0 0 1 0 -32"
            />
            <path className="circle"
                strokeDasharray={value + ' 100'}
                d="M18 2.0845
                a 16 16 0 0 1 0 32
                a 16 16 0 0 1 0 -32"
            />
            { value === 0 ?
                <text x="18" y="20" className="caption"> {caption}</text>
            : 
            <>
                <text x="18" y="18" className="caption"> {caption}</text>
                <text x="18" y="24" className="percentage"> {value + "%"}</text>
            </> 

            }

            </svg>
        </div>
    )
}

export default ProgressCircle;
  