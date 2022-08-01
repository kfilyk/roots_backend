import React, { useState, useEffect, useRef } from 'react';
import Glossary from './Glossary';
import Videos from './Videos';
import "./help.css"

const Help = () => {
    const [selected_tab, set_selected_tab] = useState("videos");
    const [isHover, setIsHover] = useState(false)

    function renderNav() {
        return (
          <div>
            <div className="nav" id="nav" style={{fontSize: "12px", top: "30px"}}>
              <span className={selected_tab === "glossary" ? "nav-link active" : "nav-link"} onMouseEnter={()=> setIsHover(true)} onMouseLeave={()=> setIsHover(false)} onClick={() => set_selected_tab("glossary")}>
                GLOSSARY
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

    return (
        <div>
            {renderNav()}
            {renderTab()}
        </div>
      );
}

export default Help