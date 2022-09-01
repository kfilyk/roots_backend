import React, { useState, useEffect, useRef } from 'react';
import Glossary from './Glossary';
import Videos from './Videos';
import "./help.css"

/*
OVERALL FILE PURPOSE: 
Renders the Help page.
Contains the nav bar for the help bar under renderTab()
*/
const Help = () => {
    //selected HELP tab, separate from selected tab in dashboard
    const [selected_tab, set_selected_tab] = useState("glossary");

    //Upon hover, expands hamburger menu for glossary page
    const [isHover, setIsHover] = useState(false)

    /*
    Input from: renderNav()
    Outputs to: None
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: Grabs the heading that page then scrolls to.
    See render methods in Glossary, they will have ids. Example: id="gl-plant-issues"
    */
    function jump(heading){
      const section = document.querySelector( `#${heading}` );
      section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    };

    /*
    Input from: None
    Outputs to: return()
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: Renders help navigation bar, tabs include: Glossary; Videos; Etc.
    */
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

    /*
    Input from: selectedTab
    Outputs to: return()
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: Upon selectedTab changing, a different sub-page is loaded
    */
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

    /*
    Input from: renderNav(); renderNavTab();
    Outputs to: Screen
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: The container rendering all the components on the page. 
    */
    return (
        <div>
            {renderNav()}
            {renderTab()}
        </div>
      );
}

export default Help