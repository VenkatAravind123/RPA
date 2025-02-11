import React from 'react';
import { FaRobot, FaCode, FaCogs, FaUsers } from 'react-icons/fa';

export default function Home() {
  const containerStyle = {
    padding: "2rem",
    color: "#fff",
    maxWidth: "1200px",
    margin: "0 auto"
  };

  const heroStyle = {
    textAlign: "center",
    marginBottom: "4rem"
  };

  const featuresStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    padding: "2rem 0"
  };

  const featureCardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "2rem",
    textAlign: "center",
    transition: "transform 0.3s ease"
  };

  const iconStyle = {
    fontSize: "2.5rem",
    color: "#e0d074",
    marginBottom: "1rem"
  };

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={{ color: "#e0d074", fontSize: "2.5rem", marginBottom: "1rem" }}>
          Welcome to RPA Club - KL University
        </h1>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "2rem" }}>
          Empowering students with Robotic Process Automation skills for the future
        </p>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ color: "#e0d074", marginBottom: "1rem" }}>About Our Club</h2>
        <p style={{ lineHeight: "1.6" }}>
          The Robotic Process Automation (RPA) Club at KL University is dedicated to exploring 
          and mastering the cutting-edge technology of process automation. We focus on 
          developing skills in tools like UiPath, Blue Prism, and Automation Anywhere, 
          preparing our members for the future of digital transformation.
        </p>
      </div>

      <div style={featuresStyle}>
        <div 
          style={featureCardStyle}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <FaRobot style={iconStyle} />
          <h3 style={{ color: "#e0d074", marginBottom: "1rem" }}>Automation Excellence</h3>
          <p>Learn industry-standard RPA tools and techniques from experts</p>
        </div>

        <div 
          style={featureCardStyle}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <FaCode style={iconStyle} />
          <h3 style={{ color: "#e0d074", marginBottom: "1rem" }}>Hands-on Projects</h3>
          <p>Work on real-world automation projects and build your portfolio</p>
        </div>

        <div 
          style={featureCardStyle}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <FaCogs style={iconStyle} />
          <h3 style={{ color: "#e0d074", marginBottom: "1rem" }}>Skill Development</h3>
          <p>Enhance your technical and problem-solving abilities</p>
        </div>

        <div 
          style={featureCardStyle}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <FaUsers style={iconStyle} />
          <h3 style={{ color: "#e0d074", marginBottom: "1rem" }}>Community</h3>
          <p>Join a community of like-minded automation enthusiasts</p>
        </div>
      </div>
    </div>
  );
}