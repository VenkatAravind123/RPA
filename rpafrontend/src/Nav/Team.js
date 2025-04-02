import React from 'react';
import TeamData from './TeamData';
import { FaLinkedin, FaEnvelope, FaGithub } from 'react-icons/fa';
import './Team.css';

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

  const sortedTeam = [...TeamData].sort((a, b) => 
    (roleHierarchy[a.role] || 99) - (roleHierarchy[b.role] || 99)
  );

  return (
    <div className="team-container">
      <div className="team-header">
        <h1>Our Team</h1>
        <p>Meet the passionate individuals behind RPA Club</p>
      </div>

      {/* Faculty Incharge */}
      {sortedTeam
        .filter(member => member.role === 'Faculty Incharge')
        .map(member => (
          <div key={member.id} className="team-card faculty">
            <img src={member.image} alt={member.name} className="member-image faculty" />
            <h3 className="member-name faculty">{member.name}</h3>
            <h4 className="member-role faculty">{member.role}</h4>
            <p className="member-department">{member.department}</p>
            <div className="social-links">
              <FaLinkedin className="social-icon" onClick={() => handleSocialClick(member.social?.linkedin)} />
              <FaEnvelope className="social-icon" onClick={() => handleSocialClick(`mailto:${member.email}`)} />
            </div>
          </div>
        ))}

      {/* President and Vice President */}
      <div className="leadership-container">
        {sortedTeam
          .filter(member => member.role === 'President' || member.role === 'Vice President')
          .map(member => (
            <div key={member.id} className="team-card leadership">
              <img src={member.image} alt={member.name} className="member-image leadership" />
              <h3 className="member-name leadership">{member.name}</h3>
              <h4 className="member-role leadership">{member.role}</h4>
              <p className="member-department">{member.department}</p>
              <div className="social-links">
                <FaLinkedin className="social-icon" onClick={() => handleSocialClick(member.social?.linkedin)} />
                <FaEnvelope className="social-icon" onClick={() => handleSocialClick(`mailto:${member.email}`)} />
                <FaGithub className="social-icon" onClick={() => handleSocialClick(member.social?.github)} />
              </div>
            </div>
          ))}
      </div>

      {/* Other Team Members */}
      <div className="team-grid">
        {sortedTeam
          .filter(member => !['Faculty Incharge', 'President', 'Vice President'].includes(member.role))
          .map(member => (
            <div key={member.id} className="team-card">
              <img src={member.image} alt={member.name} className="member-image" />
              <h3 className="member-name">{member.name}</h3>
              <h4 className="member-role">{member.role}</h4>
              <p className="member-department">{member.department}</p>
              <div className="social-links">
                <FaLinkedin className="social-icon" onClick={() => handleSocialClick(member.social?.linkedin)} />
                <FaEnvelope className="social-icon" onClick={() => handleSocialClick(`mailto:${member.email}`)} />
                <FaGithub className="social-icon" onClick={() => handleSocialClick(member.social?.github)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}