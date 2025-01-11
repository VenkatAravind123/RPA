import React from 'react';
import team from './TeamData';


export default function Team() {
  const containerStyle = {
    padding: "2rem",
    color: "#fff"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    padding: "1rem"
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "transform 0.3s ease",
    textAlign: "center"
  };

  const imageStyle = {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "1rem",
    border: "3px solid #e0d074"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#e0d074", textAlign: "center", marginBottom: "2rem" }}>
        Our Team
      </h2>
      <div style={gridStyle}>
        {team.map((member) => (
          <div
            key={member.id}
            style={cardStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img
              src={member.image}
              alt={member.name}
              style={imageStyle}
            />
            <h3 style={{ color: "#e0d074", marginBottom: "0.5rem" }}>
              {member.name}
            </h3>
            <h4 style={{ color: "rgba(255, 255, 255, 0.8)", marginBottom: "0.5rem" }}>
              {member.role}
            </h4>
            <p style={{ color: "#e0d074", marginBottom: "0.5rem" }}>
              {member.department}
            </p>
            <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}