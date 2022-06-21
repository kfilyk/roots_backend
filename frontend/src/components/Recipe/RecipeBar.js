import React, { useState, useEffect } from 'react';
import axios from "axios";

const RecipeBar = (props) => {
  const [recipe, setRecipe] = useState(null);

  async function getRecipe(id) {
    const result = await axios(
      `/api/recipes/${id}/`,
    )
    .catch((err) => console.log(err))
    setRecipe(result.data)
  }

  useEffect(() => {
    // can either send a recipe object OR the id of a recipe to this function
    if(typeof props.recipe === 'number') {
      getRecipe(props.recipe)
    } else {
      setRecipe(props.recipe)
    }
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

  function render() {
    if(recipe === null ||  props.phase_list.length === 0 || typeof recipe === 'undefined') {
      return <div className="recipe_bar_empty"> NO RECIPE ALLOCATED </div>;
    } else {
      let phases = []
      for(let i = 1; i <= 10; i++) {
          let ph = props.phase_list.filter(phase => phase.id === recipe["phase"+i])[0] ?? null
          if(ph !== null) {
              let s = PhaseStyle(ph.type)
              s['flex']=ph.days + " 1 0"
              if(i === 1) {
                  s['borderBottomLeftRadius'] = '10px'
              } 
              if (recipe["phase"+(i+1)] === null || i === 10) {
                  s['borderBottomRightRadius'] = '10px'
              }
              phases.push(<div className="object_phase" style={s}><span style={{'fontFamily': 'Brandon Grotesque Black'}}>{ph.name} </span> <br/> {ph.type} </div>)
          }
      }
      return <div className="recipe_bar"> {phases} </div>;
    }
  };

  return (
    render()
  );

}

export default RecipeBar;