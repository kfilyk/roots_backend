import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import RecipeBar from "./RecipeBar"

const RecipeList = () => {
  const [recipe_list, setRecipeList] = useState([]);
  const [phase_list, setPhaseList] = useState([]);
  const [recipeJSON, setRecipeJSON] = useState({
    show: false,
    name: null,
    recipe_id: -1,
    json: {}
  })

  const [modal, setModal] = useState({
    show: false,
    add: true,
  })

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
      setPhaseList([...phase_list, result.data])
    }
  };

  async function fetchRecipes() {
    const result = await axios(
      '/api/recipes/',
      // '/api/recipes/recipe_user_specific/',
    );
    // console.log("FR: ", result.data)
    setRecipeList(result.data)

    /*
    const result2 = await axios(
      '/api/phases/',
    );
    setPhaseList(result2.data)
    */
  } 

  useEffect(() => {
    fetchPhases();
    fetchRecipes();
  }, []);

  async function fetchPhases() {
    const result = await axios(
      '/api/phases/',
    );
    setPhaseList(result.data)
  } 

  async function deleteEntry(id) {
    await axios.delete(`/api/recipes/${id}/`);
    setRecipeList(recipe_list.filter(recipe => recipe.id !== id))
  }

  function countDays() {
    let days = 0;
    for(let i = 1; i<=10; i++) {
      if (recipe["phase"+i] !== null) {
        days += phase_list.find(phase => phase.id === parseInt(recipe["phase"+i])).days
      }
    }
    recipe.days = days;
  }

  async function addRecipe(e) {
    const result = await axios
      .post(`/api/recipes/`, recipe);
      setRecipeList(recipe_list => [...recipe_list, result.data])
  };

  async function editRecipe(e) {
    const result = await axios
      .patch(`/api/recipes/${recipe.id}/`, recipe)
      .catch((err) => console.log("Error during edit recipe: ", err))

    const index = recipe_list.findIndex(r => r.id === recipe.id);
    const updatedItem = result.data
    setRecipeList([
      ...recipe_list.slice(0, index),
      updatedItem,
      ...recipe_list.slice(index + 1)
    ])
  };

  async function getRecipeJSON(id) {
    const result = await axios
      .post(`/api/recipes/get_JSON/`, {recipe_id: id});
      setRecipeJSON({recipe_id: id, show: true, json: result.data})
  };

  function openModal(r){
    // if no item passed, we are adding a new one
    if (r === null){
      setModal({add: true, show: true})
    } else {
      setRecipe(r)
      setModal({add: false, show: true})
    }
  }
  
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

  function update_recipe(e){
    setRecipe({...recipe,  [e.target.name]: (e.target.value.length === 0 ? null: e.target.value)})
  }

  function render_phase_selection(){
    let phase_selection = [];
    for(let i = 1; i<=10; i++) {

      if(i===1 || recipe['phase'+(i-1)]!== null) {
        phase_selection.push(
          <div key={i} className='form-row'>
            <select name={"phase"+i} defaultValue={recipe["phase"+i]} onChange={(e)=>update_recipe(e)}>
              <option key={-1} value={null}></option>
              {/* {phase_list.map((phase) => ( <option key={`${i}_${phase.id}`} value={phase.id}>{phase.name} | ({phase.type})</option>))} */}
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
          </div>
        )
      }
    }
    return <div>{phase_selection}</div>;
  }

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

  function renderModal(){
    return (
      <>
        <div className="form_row">
          <div>
            <input name="name" value={recipe.name || ""} placeholder="Name" onChange={(e) => setRecipe({...recipe, name: e.target.value})} />
            {render_phase_selection()}
          </div>
          {renderCreatePhase()}
        </div>
        <div className="form_row">
          
        </div>

      </>
    )
  }

  

  function showJSON(id){
    getRecipeJSON(id)
  }


  return (
    <div>
      <button onClick={() => openModal(null)}>+</button>
      {recipe_list.map(item => (

        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_top">
              <div className="object_description">
                <div className="bold_font">{item.name}</div><div>{item.days} Days</div>
              </div>

              
              <div className='object_actions'>
                <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                <button onClick={() => openModal(item)}>EDIT</button>
                <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
                <button onClick={() => showJSON(item.id)}>SHOW JSON</button>
              </div>
            </div>
            <RecipeBar phase_list = {phase_list} recipe = {item} experiment={undefined} is_object={true}></RecipeBar> 
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
                  <div className='createPhaseRight'>
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