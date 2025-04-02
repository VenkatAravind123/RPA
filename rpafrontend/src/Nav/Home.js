import React from 'react';
import { FaRobot, FaCode, FaCogs, FaUsers } from 'react-icons/fa';
import './Home.css'

export default function Home() {
  const features = [
    {
      icon: <FaRobot className="feature-icon" />,
      title: "Automation Excellence",
      text: "Learn industry-standard RPA tools and techniques"
    },
    {
      icon: <FaCode className="feature-icon" />,
      title: "Hands-on Projects",
      text: "Work on real-world automation projects"
    },
    {
      icon: <FaCogs className="feature-icon" />,
      title: "Skill Development",
      text: "Enhance your technical abilities"
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">RPA Club - KL University</h1>
        <p className="hero-subtitle">Empowering students with RPA skills</p>
      </div>

      <div className="about-section">
        <h2 className="about-title">About Our Club</h2>
        <p className="about-text">
          We focus on mastering RPA tools like UiPath, Blue Prism, and Automation Anywhere, 
          preparing our members for digital transformation.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="feature-card"
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {feature.icon}
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>

  );
}