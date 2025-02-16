import React from 'react';
import { FaRobot, FaBullseye, FaTrophy, FaUniversity } from 'react-icons/fa';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';
import rpa from '../images/rpanew.png';
import uipath from '../images/uipath.png';
import blueprism from '../images/blueprism.png';
import automationanywhere from '../images/automation.png';
import selenium from '../images/selenium.png';
import python from '../images/python.png';
import './about.css';

export default function About() {
  return (
    <div>
      <div className='containerStyle'>
        <img src={rpa} alt="" className='logo12'/>
        <div className='right'>
          <h1>ROBOTIC PROCESS AUTOMATION</h1>
          <p>Technical Club in KL University</p>
          <p><span>RPAKLEF</span> is a technology club at KL University where students come together to explore, learn, and implement automation in business processes using advanced automation tools.</p>
          <p><span>Established On:</span><br/>
          On 26th January 2020, this visionary club was formed, paving the way for an innovative learning platform that continues to shape the technical skills and careers of its members.</p>
        </div>
      </div>
      <div className='container'>
        <h3>OUR VISION</h3>
        <p>The RPA CLUB is a community driven by a shared passion for leveraging technology to solve real-world problems. In today's fast-paced world, coding is often viewed as the go-to solution for development, but the RPA club believes in empowering students with tools that go beyond coding, enabling anyone to automate processes effectively.</p>
        <p>This vision encourages students to explore and excel in technologies like UiPath and Automation Anywhere, making automation accessible and simplifying complex challenges for the team.</p>
        <p><span>Tools Used in RPA Club</span><br/>
        The RPA club focuses on equipping its members with hands-on experience in industry-leading tools for robotic process automation and related technologies. Here are some of the primary tools used:</p>
        <div className='tools-section'>
          <div className='tool-item'>
            <div className='tool-header'>
              <div className='tool-content'>
                <h4>1. UiPath</h4>
                <ul>
                  <li>A leading RPA platform that enables end-to-end automation.</li>
                  <li>Provides tools for process designing, automation execution, and monitoring.</li>
                  <li>Known for its user-friendly drag-and-drop interface and strong support for enterprise applications.</li>
                </ul>
              </div>
              <img src={uipath} alt="UiPath Logo" className='tool-logo' />
            </div>
          </div>

          <div className='tool-item'>
            <div className='tool-header'>
              <div className='tool-content'>
                <h4>2. Automation Anywhere</h4>
                <ul>
                  <li>A widely used RPA tool offering advanced features for process automation.</li>
                  <li>Combines robotic process automation with artificial intelligence to solve business problems.</li>
                  <li>Includes cloud-based automation for scalability and real-time collaboration.</li>
                </ul>
              </div>
              <img src={automationanywhere} alt="Automation Anywhere Logo" className='tool-logo' />
            </div>
          </div>

          <div className='tool-item'>
            <div className='tool-header'>
              <div className='tool-content'>
                <h4>3. Blue Prism</h4>
                <ul>
                  <li>Provides a robust platform for scalable and secure automation.</li>
                  <li>Focuses on rule-based processes and is known for its strong integration capabilities.</li>
                </ul>
              </div>
              <img src={blueprism} alt="Blue Prism Logo" className='tool-logo' />
            </div>
          </div>

          <div className='tool-item'>
            <div className='tool-header'>
              <div className='tool-content'>
                <h4>4. Selenium</h4>
                <ul>
                  <li>Used for test automation, especially for web applications.</li>
                  <li>Enables testing and automating processes in dynamic environments.</li>
                </ul>
              </div>
              <img src={selenium} alt="Selenium Logo" className='tool-logo' />
            </div>
          </div>

          <div className='tool-item'>
            <div className='tool-header'>
              <div className='tool-content'>
                <h4>5. Python (Scripting and Automation)</h4>
                <ul>
                  <li>Extensively used for creating custom scripts and integrations in RPA projects.</li>
                  <li>Libraries like pyautogui and robotframework are used for advanced automation.</li>
                </ul>
              </div>
              <img src={python} alt="Python Logo" className='tool-logo' />
            </div>
          </div>
        </div>
      </div>
      <footer className='footer'>
        <div className='footer-content'>
          <h3>Connect With Us</h3>
          <div className='social-links'>
            <a href="https://www.linkedin.com/company/rpa-club-klef/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon" />
              <span>LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/rpa_klef/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            <a href="https://github.com/rpaklef" target="_blank" rel="noopener noreferrer">
              <FaGithub className="social-icon" />
              <span>GitHub</span>
            </a>
            <a href="mailto:rpaclub@kluniversity.in">
              <FaEnvelope className="social-icon" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}