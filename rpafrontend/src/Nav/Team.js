import React from 'react';
import TeamData from './TeamData';
import { FaLinkedin, FaEnvelope, FaGit, FaGithub } from 'react-icons/fa';

export default function Team() {
  const roleHierarchy = {
    'Faculty Incharge': 1,
    'President': 2,
    'Vice President': 3,
    'Tech Lead': 4,
    'Web Developer': 5,
    'Internal and External Affairs': 6,
    'Event Manager': 7,
    'Drafting': 8,
    'Social Media Manager': 9,
    'Member': 10
  };
  const handleSocialClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  const containerStyle = {
    padding: "3rem",
    color: "#fff",
    maxWidth: "1400px",
    margin: "0 auto"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "4rem"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "5rem",
    justifyItems: "center",
    padding: "0 1rem"
  };

  const leadershipContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "3rem",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto 3rem auto",
    justifyItems: "center"
  };

  const getCardStyle = (role) => ({
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: role === 'Faculty Incharge' ? "2.5rem" : "2rem",
    border: role === 'Faculty Incharge' ? "3px solid gold" :
           (role === 'President' || role === 'Vice President') ? "2px solid #e0d074" : 
           "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    textAlign: "center",
    width: "100%",
    maxWidth: role === 'Faculty Incharge' ? "600px" : "400px",
    position: "relative",
    overflow: "hidden"
  });

  const getImageStyle = (role) => ({
    width: role === 'Faculty Incharge' ? "220px" :
          (role === 'President' || role === 'Vice President') ? "200px" : "180px",
    height: role === 'Faculty Incharge' ? "220px" :
           (role === 'President' || role === 'Vice President') ? "200px" : "180px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "1.5rem",
    border: role === 'Faculty Incharge' ? "5px solid gold" :
           (role === 'President' || role === 'Vice President') ? "4px solid #e0d074" :
           "3px solid rgba(224, 208, 116, 0.7)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
  });

  const socialStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem"
  };

  const iconStyle = {
    fontSize: "1.2rem",
    color: "#e0d074",
    cursor: "pointer",
    transition: "transform 0.2s ease"
  };

  const sortedTeam = [...TeamData].sort((a, b) => 
    (roleHierarchy[a.role] || 99) - (roleHierarchy[b.role] || 99)
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: "#e0d074", fontSize: "2.5rem", marginBottom: "1rem" }}>
          Our Team
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1.2rem" }}>
          Meet the passionate individuals behind RPA Club
        </p>
      </div>

      {/* Faculty Incharge */}
      {sortedTeam
        .filter(member => member.role === 'Faculty Incharge')
        .map(member => (
          <div
            key={member.id}
            style={{...getCardStyle(member.role), margin: "0 auto 3rem auto"}}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src={member.image} alt={member.name} style={getImageStyle(member.role)} />
            <h3 style={{ color: "#e0d074", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              {member.name}
            </h3>
            <h4 style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.4rem", marginBottom: "1rem" }}>
              {member.role}
            </h4>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem" }}>
              {member.department}
            </p>
            <div style={socialStyle}>
              <FaLinkedin style={iconStyle} onClick={()=> handleSocialClick(member.social?.linkedin)} />
              <FaEnvelope style={iconStyle} onClick={()=>handleSocialClick(`mailto:${member.email}`)}/>
            </div>
          </div>
        ))}

      {/* President and Vice President */}
      <div style={leadershipContainerStyle}>
        {sortedTeam
          .filter(member => member.role === 'President' || member.role === 'Vice President')
          .map(member => (
            <div
              key={member.id}
              style={getCardStyle(member.role)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img src={member.image} alt={member.name} style={getImageStyle(member.role)} />
              <h3 style={{ color: "#e0d074", fontSize: "1.6rem", marginBottom: "0.5rem" }}>
                {member.name}
              </h3>
              <h4 style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.3rem", marginBottom: "1rem" }}>
                {member.role}
              </h4>
              <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1rem" }}>
                {member.department}
              </p>
              <div style={socialStyle}>
              <FaLinkedin style={iconStyle} onClick={()=> handleSocialClick(member.social?.linkedin)} />
              <FaEnvelope style={iconStyle} onClick={()=>handleSocialClick(`mailto:${member.email}`)}/>
              <FaGithub style={iconStyle} onClick={()=>handleSocialClick(member.social?.github)}/>
              </div>
            </div>
          ))}
      </div>

      {/* Other Team Members */}
      <div style={gridStyle}>
        {sortedTeam
          .filter(member => !['Faculty Incharge', 'President', 'Vice President'].includes(member.role))
          .map(member => (
            <div
              key={member.id}
              style={getCardStyle(member.role)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img src={member.image} alt={member.name} style={getImageStyle(member.role)} />
              <h3 style={{ color: "#e0d074", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                {member.name}
              </h3>
              <h4 style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem", marginBottom: "1rem" }}>
                {member.role}
              </h4>
              <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1rem" }}>
                {member.department}
              </p>
              <div style={socialStyle}>
              <FaLinkedin style={iconStyle} onClick={()=> handleSocialClick(member.social?.linkedin)} />
              <FaEnvelope style={iconStyle} onClick={()=>handleSocialClick(`mailto:${member.email}`)}/>
              <FaGithub style={iconStyle} onClick={()=>handleSocialClick(member.social?.github)}/>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}