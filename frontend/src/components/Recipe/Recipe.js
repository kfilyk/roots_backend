import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png"
import RecipeBar from "./RecipeBar"

const RecipeList = () => {
  //List of all recipes
  const [recipeList, setRecipeList] = useState([]);

  //List of all phases
  const [phaseList, setPhaseList] = useState([]);

  //Used to show a recipe JSON given a recipe id
  const [recipeJSON, setRecipeJSON] = useState({
    show: false,
    name: null,
    recipe_id: -1,
    json: {}
  })

  //Used to switch between editing and adding a recipe;
  //Used to show and hide the add/edit recipe modal
  const [modal, setModal] = useState({
    show: false,
    add: true,
  })

  //Used to add and edit a recipe
  const [recipe, setRecipe] = useState(
    {
      name: null,
      phase1: null,
      phase2: null,
      phase3: null,
      phase4: null,
      phase5: null,
      phase6: null,
      phase7: null,
      phase8: null,
      phase9: null,
      phase10: null,
    }
  );

  //Used to create a new phase on the fly
  const [phase, setPhase] = useState(
    {
      show: true,
      user: null,
      user_name: null,
      days: null,
      waterings_per_day: null,
      watering_duration: null,
      blue_intensity: 99,
      red_intensity: 99,
      white_intensity: 99,
      lights_on_hours: null,
      score: null,
      type: "Germination",
      name: null
    }
  );


  /*
  Input from: phase
  Outputs to: renderCreatePhase()
  Created by: Stella T 08/31/2022
  Last Edit: Stella T 08/31/2022
  Purpose: Makes an API call to create a new phase according to phase variable
  */
  async function addPhase(e) {
    console.log("DD: ", phase)
    const result = await axios
      .post(`/api/phases/`, 
        { 
            name: phase.name,
            type: phase.type,
            days: phase.days,
            waterings_per_day: phase.waterings_per_day,
            watering_duration: phase.watering_duration,
            blue_intensity: phase.blue_intensity,
            red_intensity: phase.red_intensity,
            white_intensity: phase.white_intensity,
            lights_on_hours: phase.lights_on_hours
        });
    if(result.status === 201 || result.status === 200){
      setPhaseList([...phaseList, result.data])
    }
  };

  /*
  Input from: None
  Outputs to: recipeList
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Fetches all recipe objects
  */
  async function fetchRecipes() {
    const result = await axios(
      '/api/recipes/',
    );
    setRecipeList(result.data)
  } 

  /*
  Input from: None
  Outputs to: phaseList; recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon page load, it runs once and gets all phases and recipes
  */
  useEffect(() => {
    fetchPhases();
    fetchRecipes();
  }, []);

  /*
  Input from: None
  Outputs to: phaseList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Fetches all phase objects
  */
  async function fetchPhases() {
    const result = await axios(
      '/api/phases/',
    );
    setPhaseList(result.data)
  } 

  /*
  Input from: recipeList's item.id in return()
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to delete a recipe from the database.
  At the moment, this does not work as intended because of foreign key restraints to the Phase Table. See models.py
  */
  async function deleteEntry(id) {
    await axios.delete(`/api/recipes/${id}/`);
    setRecipeList(recipeList.filter(recipe => recipe.id !== id))
  }

  /*
  Input from: recipe
  Outputs to: submitModal()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Calculates the total days of recipe based on summation of phase days
  */
  function countDays() {
    let days = 0;
    for(let i = 1; i<=10; i++) {
      if (recipe["phase"+i] !== null) {
        days += phaseList.find(phase => phase.id === parseInt(recipe["phase"+i])).days
      }
    }
    recipe.days = days;
  }

  /*
  Input from: submitModal()
  Outputs to: recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to create a recipe in the database.
  */
  async function addRecipe(e) {
    const result = await axios
      .post(`/api/recipes/`, recipe);
      setRecipeList(recipeList => [...recipeList, result.data])
  };

  /*
  Input from: submitModal()
  Outputs to: recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to edit a recipe in the database.
  */
  async function editRecipe(e) {
    const result = await axios
      .patch(`/api/recipes/${recipe.id}/`, recipe)
      .catch((err) => console.log("Error during edit recipe: ", err))

    const index = recipeList.findIndex(r => r.id === recipe.id);
    const updatedItem = result.data
    setRecipeList([
      ...recipeList.slice(0, index),
      updatedItem,
      ...recipeList.slice(index + 1)
    ])
  };

  /*
  Input from: showJSON()
  Outputs to: recipeJSON
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to create a recipe in the database.
  */
  async function getRecipeJSON(id) {
    const result = await axios
      .post(`/api/recipes/get_JSON/`, {recipe_id: id});
      setRecipeJSON({recipe_id: id, show: true, json: result.data})
  };

  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Determines whether modal to be opened is for adding or editing a recipe
  */
  function openModal(r){
    // if no item passed, we are adding a new one
    if (r === null){
      setModal({add: true, show: true})
    } else {
      setRecipe(r)
      setModal({add: false, show: true})
    }
  }
  
  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Verifies recipe constraints (need recipe name + min. 1 phase); calculates total recipe day then makes API call to create recipe
  */
  function submitModal(close){
    if(recipe.name === null || recipe.name === ""){
      alert("Please provide a recipe name.")
      return
    } else if(recipe.phase1 === null) {
      alert("Recipe must have at least 1 phase.")
      return
    }

    for(let i = 1; i <= modal.phases; i++){
      let phase = `phase${i}`
      if(recipe[phase] === null){
        alert(`Phase ${i} cannot be null`)
        return
      }
    }
    countDays();
    if(modal.add) {
      addRecipe()
    } else {
      editRecipe()
    }
    close();
  }

  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon closing the modal, modal is hidden and recipe state is reset. 
  */
  function closeModal(){
    setModal({...modal, show: false}) 
    setRecipe({
      name: null,
      days: 0,
      phase1: null,
      phase2: null,
      phase3: null,
      phase4: null,
      phase5: null,
      phase6: null,
      phase7: null,
      phase8: null,
      phase9: null,
      phase10: null,
    })
  }


  /*
  Input from: renderPhaseSelection()
  Outputs to: recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: For a recipe, updates the phase in a particular spot.
  */
  function updateRecipe(e){
    setRecipe({...recipe,  [e.target.name]: (e.target.value.length === 0 ? null: e.target.value)})
  }

  /*
  Input from: recipe
  Outputs to: renderModal()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Generates a dropdown of all phases to select from to build/edit a recipe
  */
  function renderPhaseSelection(){
    let phase_selection = [];
    for(let i = 1; i<=10; i++) {

      if(i===1 || recipe['phase'+(i-1)]!== null) {
        phase_selection.push(
          <div key={i} className='form-row'>
            <select name={"phase"+i} defaultValue={recipe["phase"+i]} onChange={(e)=>updateRecipe(e)}>
              <option key={-1} value={null}></option>
              {/* {phaseList.map((phase) => ( <option key={`${i}_${phase.id}`} value={phase.id}>{phase.name} | ({phase.type})</option>))} */}
              {phaseList.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
          </div>
        )
      }
    }
    return <div>{phase_selection}</div>;
  }

  /*
  Input from: phase
  Outputs to: renderModal()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Generates input fields to create a new phase on the fly
  */
  function renderCreatePhase(){
    return (
      <div style={{ visibility: phase.show ? 'visible': 'hidden'}}>
        <div className="form_row">
          <input value={phase.name} placeholder={"Name"} onChange={(e) => setPhase({...phase, name: e.target.value})} />
        </div>
        <div className="form_row">
          <select value={phase.type} onChange={(e) => setPhase({...phase, type: e.target.value})} >
            <option value="Germination">Germination</option>
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative Growth</option>
            <option value="Flowering">Flowering</option>
            <option value="Harvest">Harvest</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form_row">
          <input value={phase.days} placeholder={"Days"} min="1" type="number" onKeyPress= {(e) => {if(e.charCode === 45) {e.preventDefault()}}} onChange={(e) => setPhase({...phase, days: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={phase.waterings_per_day} placeholder={"Waterings Per Day"} onChange={(e) => setPhase({...phase, waterings_per_day: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={phase.watering_duration} placeholder={"Watering Duration"} onChange={(e) => setPhase({...phase, watering_duration: e.target.value})} />
        </div>
        <div className="form_row">
          <input value={phase.blue_intensity} id="blue_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhase({...phase, blue_intensity: e.target.value})}/>
          <div className='intensity_text_overlay'>{phase.blue_intensity}</div>
        </div>
        <div className="form_row">
          <input value={phase.red_intensity} id="red_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhase({...phase, red_intensity: e.target.value})} />
          <div className='intensity_text_overlay'>{phase.red_intensity}</div>
        </div>                    
        <div className="form_row">
          <input value={phase.white_intensity}  id="white_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhase({...phase, white_intensity: e.target.value})} />
          <div className='intensity_text_overlay'>{phase.white_intensity}</div>
        </div>   
        <div className="form_row">
          <input value={phase.lights_on_hours} placeholder={"Lights On Hours"} onChange={(e) => setPhase({...phase, lights_on_hours: e.target.value})} />
        </div>
        <button className='save' onClick={() => addPhase()}>Create Phase</button>
      </div>
    )
  }

  /*
  Input from: renderPhaseSelection(); renderCreatePhase()
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Generates modal for add/edit recipe
  */
  function renderModal(){
    return (
      <>
        <div className="form_row">
          <div>
            <input name="name" value={recipe.name || ""} placeholder="Name" onChange={(e) => setRecipe({...recipe, name: e.target.value})} />
            {renderPhaseSelection()}
          </div>
          {renderCreatePhase()}
        </div>
        <div className="form_row">
          
        </div>

      </>
    )
  }

  
  /*
  Input from: return()
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Calls method that makes API call to get JSON form of recipe
  */
  function showJSON(id){
    getRecipeJSON(id)
  }

  /*
  Input from: recipeList; modal; recipeJSON
  Outputs to: Screen
  Created by: Stella T 08/29/2022
  Last Edit: Stella T 08/29/2022
  Purpose: Renders the entire Recipe modal
  */
  return (
    <div>
      <button onClick={() => openModal(null)}>+</button>
      {recipeList.map(item => (

        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_top">
              <div className="object_description">
                <div className="bold_font">{item.name+" | "}<span className="normal_font">{item.days} Days</span></div>
              </div>

              
              <div className='object_actions'>
                <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
                <button onClick={() => openModal(item)}>EDIT</button>
                <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
                <button onClick={() => showJSON(item.id)}>SHOW JSON</button>
              </div>
            </div>
            <RecipeBar phaseList = {phaseList} recipe = {item} experiment={undefined} is_object={true}></RecipeBar> 
          </div>
        </div>
      ))}
      <Popup open={modal.show} onClose={() => closeModal()} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body" onClick={e => e.stopPropagation()}>
                  <div className='createRecipeLeft'>
                    { modal.add === true ? "Create Recipe" : "Edit Recipe" }
                  </div>
                  <div className='create-phase-right'>
                    Create Phase
                  </div>
                <div className="modal_content">
                  {renderModal()}
                  <button className='save' onClick={() => {
                    submitModal(close)
                  }}>Save</button>
                </div>
              </div>
            </div>
            )}
      </Popup>
      <Popup open={recipeJSON.show} onClose={() => setRecipeJSON({...recipeJSON, show: false})} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body" onClick={e => e.stopPropagation()}>
                <div className="modal_content">
                  <pre>{JSON.stringify(recipeJSON.json, null, 2) }</pre>
                  <button className='save' onClick={() => {navigator.clipboard.writeText(JSON.stringify(recipeJSON.json))}}>COPY</button>
                </div>
              </div>
            </div>
            )}
      </Popup>
    </div>
  );
}


export default RecipeList;