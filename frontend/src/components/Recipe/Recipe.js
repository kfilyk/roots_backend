import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"

const RecipeList = () => {
  const [recipe_list, setRecipeList] = useState([]);
  const [phase_list, setPhaseList] = useState([]);
  const [value, setValue] = useState("default");


  const [modal, setModal] = useState({
    show: false,
    add: false
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

  async function fetchData() {
    const result = await axios(
      '/api/recipes/',
    );

    setRecipeList(result.data)

    const result2 = await axios(
      '/api/phases/',
    );
    setPhaseList(result2.data)
  } 

  useEffect(() => {
    fetchData();
  }, []);

  async function deleteEntry(id) {
    await axios.delete(`/api/recipes/${id}/`);
    setRecipeList(recipe_list.filter(recipe => recipe.id !== id))
  }

  async function addEntry(e) {
    const result = await axios
      .post(`/api/recipes/`, 
        { 
            name: recipe.name,
            phase1: recipe.phase1,
            phase2: recipe.phase2,
            phase3: recipe.phase3,
            phase4: recipe.phase4,
            phase5: recipe.phase5,
            phase6: recipe.phase6,
            phase7: recipe.phase7,
            phase8: recipe.phase8,
            phase9: recipe.phase9,
            phase10: recipe.phase10,
        });
        setRecipeList(recipe_list => [...recipe_list, result.data])
  };

  async function editEntry(e) {
    await axios
      .patch(`/api/recipes/${recipe.id}/`, 
      { 
          name: recipe.name,
          phase1: recipe.phase1,
          phase2: recipe.phase2,
          phase3: recipe.phase3,
          phase4: recipe.phase4,
          phase5: recipe.phase5,
          phase6: recipe.phase6,
          phase7: recipe.phase7,
          phase8: recipe.phase8,
          phase9: recipe.phase9,
          phase10: recipe.phase10,
      }).catch((err) => console.log(err));
      fetchData();
  };

  function openModal(r){
    if (r === null ){
      setModal({add: true, show: true})
    } else {
      setRecipe(r)
      setModal({add: false, show: true})
    }
  }
  
  function submitModal(){
    if(modal.add){
      addEntry()
    } else {
      editEntry()
    }
  }

  function closeModal(){
    setModal({...modal, show: false}) 
    setRecipe({
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
    })
  }


  function renderModal(){
    return (
      <>
        <div className="form_row">
          <input name="name" value={recipe.name} placeholder="Name" onChange={(e) => setRecipe({...recipe, name: e.target.value})} />
        </div>
        {(() => {
          let phase_selection = []

          for(let i = 0; i< 10; i++) {
            let p = 'phase'+ i
            phase_selection.push(
              <>
                <div className="form_row">
                  <select name="supplier" defaultValue={value} onChange={(e) => { setRecipe({...recipe, [p]: e.target.value}); console.log(recipe)} }>
                    <option value={"default"} disabled hidden>{"Phase "+(i+1)}</option>
                    {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
                  </select>
                </div>
              </>
            )
          }
          return phase_selection;
        })()
        }
      </>
    )
  }


  return (
    <div>

      {recipe_list.map(item => (
        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_description">
              <div className="object_name">{item.name}</div>
              <div>{item.supplier}</div>
            </div>
            <div className="object_content">                          
              
            </div>
            <div className='object_actions'>
              <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
              <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => openModal(null)}>+</button>
      <Popup open={modal.show} onClose={() => closeModal()} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body" onClick={e => e.stopPropagation()}>
                <div className="modal_type"> { modal.add === true ? "Create Recipe" : "Edit Recipe" } </div>
                <div className="modal_content">
                  {renderModal()}
                  <button className='save' onClick={() => {
                    submitModal()
                    close();
                  }}>Save</button>
                </div>
              </div>
            </div>
            )}
        </Popup>
    </div>
  );
}


export default RecipeList;