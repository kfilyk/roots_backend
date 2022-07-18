import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./recipebar.css"

const RecipeBar = (props) => {
  // we NEED this recipe state object, because the props is variably a recipe id OR a recipe object
  const [recipe, setRecipe] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [start_date, setStartDate] = useState(null);
  const [completion_percentage, setCompletionPercentage] = useState(0);
  const [exp_reading_dates, set_exp_reading_dates] = useState([])

  async function getRecipe(id) {
    const result = await axios(
      `/api/recipes/${id}/`,
    )
    .catch((err) => console.log(err))
    setRecipe(result.data)
  }

  async function getReadings(id) {
    const result = await axios.post(`/api/experimentreadings/exp_reading_dates/`,
    { 
      exp_id: id
    }).catch((err) => console.log(err))
    if (result.status === 200){
      set_exp_reading_dates(result.data)
    }
  }

  useEffect(() => {
    // can either send a recipe object OR the id of a recipe to this function
    if(typeof props.recipe === 'number') {
      getRecipe(props.recipe)
    } else {
      setRecipe(props.recipe)
    }

    if(props.experiment.id !== undefined){
      getReadings(props.experiment.id)
      setEndDate(props.experiment.end_date)
      setStartDate(props.experiment.start_date)
    }
  }, []); // [] causes useEffect to only happen ONCE after initial render - will not be called as a result of any other change

  useEffect(() => {
    if(typeof props.recipe === 'number') {
      getRecipe(props.recipe)
    } else {
      setRecipe(props.recipe)
    }  
  }, [props.recipe])
  
  useEffect(() => {
    if(recipe !== null && (typeof props.experiment !== 'undefined')) {
      let sd = new Date(props.experiment.start_date)
      sd.setDate(sd.getDate()+recipe.days)
      setEndDate(sd.getFullYear()+ "-"+(sd.getMonth()+1)+"-"+sd.getDate())
      calc_completion_percentage(props.experiment.day, recipe.days)
    }
  }, [props, recipe]); // useEffect runs when props OR recipe changes

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


  function render_exp_reading_bars(){
    if (exp_reading_dates !== undefined){
      let bars = []
      exp_reading_dates.map((er, index) => {
        let mid = new Date(er.reading_date)
        let start = new Date(start_date)
        let end = new Date(end_date)
        let style = Math.round(( ( mid - start ) / ( end - start ) ) * 100) + "%";
        bars.push(<div key={`${props.experiment.id}_${index}`} style={{left: `calc(${style})`}} className="experiment_reading_line"></div>)
      })
      return bars
    }
  }

  function render_timestamps() {
    if(props.experiment){
      return (
        <div className="recipe_bar_timestamps"> 
          <div className="recipe_bar_start_date" style={{"color": "#B1C985"}}>{props.experiment.start_date.slice(0,10)} </div>
          <div className="recipe_bar_end_date" style={{"color": "#D14C4C"}}>{end_date} </div>
        </div>
      )
    }
  }

  function calc_completion_percentage(exp_days, recipe_days){
    setCompletionPercentage(Math.round(exp_days/recipe_days*100))
  }

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
              phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase" style={s}> <span className="recipe_bar_phase_days">{ph.days}</span> {ph.type}  <span className="recipe_bar_phase_name"> {ph.name}</span> </div>)
          }
      }
      return ( 
        <>
        {render_timestamps()}
        {render_exp_reading_bars()}
        <div style={ { width: `${ completion_percentage }%` } } className="recipe_vertical_line"></div>
        <div className="recipe_bar"> 
          {phases} 
        </div>
        </>
      )
    }
  };

  return (
    render()
  );

}

export default RecipeBar;