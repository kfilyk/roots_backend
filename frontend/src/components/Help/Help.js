import React, { useState, useEffect, useRef } from 'react';
import Glossary from './Glossary';
import Videos from './Videos';
import "./help.css"

const Help = () => {
    const [selected_tab, set_selected_tab] = useState("glossary");
    const [isHover, setIsHover] = useState(false)

    function jump(heading){
      const section = document.querySelector( `#${heading}` );
      section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    };

    function renderNav() {
        return (
          <div>
            <div className="sub-nav">
              <span className={selected_tab === "glossary" ? "nav-link active" : "nav-link"} onMouseEnter={()=> setIsHover(true)} onMouseLeave={()=> setIsHover(false)} onClick={() => set_selected_tab("glossary")}>
                GLOSSARY
                <span id="plant-anatomy" style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-plant-anatomy')}>Plant Anatomy</span>
                <span id="plant-care" style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-plant-care')}>Plant Care</span>
                <span id="optimal" style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-optimal')}>Optimal Plant Growth</span>
                <span id="tools" style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-tools')}>Tools</span>
                <span style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-plant-issues')}>Plant Issues</span>
                <span style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-plant-recipes')}>Plant Recipes</span>
                <span style={{display: isHover ? "block" : "none"}} className="section" onClick={()=> jump('gl-accessories')}>Accessories</span>
              </span>
              <span className={selected_tab === "videos" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("videos")}>
                VIDEOS
              </span>
              <span className={selected_tab === "etc" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("etc")}>
                Etc.
              </span>
            </div> 
            <div className="nav">
            </div>
          </div>
        );
      };

    function renderTab(){
      switch(selected_tab) {
        case 'glossary':
          return <Glossary></Glossary>
        case 'videos':
          return <Videos></Videos>
        case 'etc':
          return <div>Etc.</div>
        default:
          return <div>Default</div>
      }
    }

    function renderScrollUp(){
      return (
        <button className="scrollUp" onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>⬆</button>
      )
      
    }

    return (
        <div>
            {renderScrollUp()}
            {renderNav()}
            {renderTab()}
        </div>
      );
}

export default Help