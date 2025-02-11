import React from 'react';
import { FaRobot, FaBullseye, FaTrophy, FaUniversity } from 'react-icons/fa';
import rpa from '../images/rpanew.png'
export default function About() {
  const containerStyle = {
    display:"flex",
    margin:"0 auto",
    padding:"10px",
    width:"1300px",
    gap:"30px",
    alighItems:"center"
  };
const logo = {
    width: "50%",
}
  

  return (
    <div style={containerStyle}>
      <img src={rpa} alt="" style={logo}/>
      <h1 style={{ color: "#e0d074", textAlign: "center", marginBottom: "3rem" }}>
        About RPA Club
      </h1>

    
    </div>
  );
}