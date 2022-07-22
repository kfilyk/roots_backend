import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import axios from "axios";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import Popup from "reactjs-popup";
import PodCarousel from "../Experiment/PodCarousel"
import ExperimentReading from "../Experiment/ExperimentReading"
import RecipeBar from '../Recipe/RecipeBar';

const Help = () => {
    const [selected_tab, set_selected_tab] = useState("");

    function renderNav() {
        return (
          <div className="nav" id="nav" style={{fontSize: "12px"}}>
            <span className={selected_tab === "glossary" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("glossary")}>
              GLOSSARY
            </span>
            <span className={selected_tab === "videos" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("videos")}>
              VIDEOS
            </span>
            <span className={selected_tab === "etc" ? "nav-link active" : "nav-link"} onClick={() => set_selected_tab("etc")}>
              ???
            </span>
          </div>
        );
      };

    return (
        <div>
            {renderNav()}
            
        </div>
      );
}

export default Help