import React, { useState, useEffect } from 'react';

const RecipeBar = (props) => {
    
    useEffect(() => {
        console.log(props.phase_list)
    }, [props]);

    function PhaseStyle(type)  {
        let colour = '';
        let font_colour = '';
        if(type === "Germination" ) {
          colour = `#B1C985`
          font_colour = `#FFFFFF`
        } else if(type === "Seedling" ) {
          colour = `#7AA96A`
          font_colour = `#FFFFFF`
        } else if(type === "Vegetative") {
          colour = `#2A7351`
          font_colour = `#FFFFFF`
        } else if(type === "Flowering") {
          colour = `#DEB1B1`
          font_colour = `#FFFFFF`
        } else if(type === "Harvest") {
          colour = `#D14C4C`
          font_colour = `#FFFFFF`
        } else { // other type
          colour = `#6FC1B6`
          font_colour = `#FFFFFF`
        }
        let style = {
          backgroundColor: colour,
          color: font_colour
        };
        return style;
      };

  function render(){
    let phases = []
    for(let i = 1; i <= 10; i++) {
        let ph = props.phase_list.filter(phase => phase.id === props.recipe["phase"+i])[0] ?? null
        if(ph !== null) {
            let s = PhaseStyle(ph.type)
            s['flex']=ph.days + " 1 0"
            if(i === 1) {
                s['border-bottom-left-radius'] = '10px'
            } 
            if (props.recipe["phase"+(i+1)] === null || i === 10) {
                s['border-bottom-right-radius'] = '10px'
            }
            phases.push(<div className="object_phase" style={s}><span style={{'fontFamily': 'Brandon Grotesque Black'}}>{ph.name} </span> <br/> {ph.type} </div>)
        }
    }
    return phases;
};

  return (
    render()
  );

}


export default RecipeBar;