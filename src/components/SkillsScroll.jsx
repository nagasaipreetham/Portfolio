import { useTheme } from '../context/ThemeContext';
import './SkillsScroll.css';

const SKILLS_DATA = [
  { name: 'React', key: 'react' },
  { name: 'Express', key: 'express' },
  { name: 'JavaScript', key: 'javascript' },
  { name: 'HTML5', key: 'html5' },
  { name: 'CSS3', key: 'css3' },
  { name: 'MongoDB', key: 'mongodb' },
  { name: 'MySQL', key: 'mysql' },
  { name: 'Google Cloud', key: 'google-cloud' },
  { name: 'Cloudflare', key: 'cloudflare' },
  { name: 'Git', key: 'git' },
  { name: 'Java', key: 'java' },
  { name: 'Postman', key: 'postman' },
];

export default function SkillsScroll() {
  const { theme } = useTheme();
  const suffix = theme === 'dark' ? 'light' : 'dark';

  // Duplicate the array once to enable seamless loop scroll animation
  const duplicatedSkills = [...SKILLS_DATA, ...SKILLS_DATA];

  return (
    <div className="skills-scroll-container" aria-hidden="true">
      <div className="skills-scroll-track">
        {duplicatedSkills.map((skill, index) => (
          <div key={`${skill.key}-${index}`} className="skills-scroll-item">
            <img 
              src={`/scrollskills/${skill.key}-${suffix}.svg`} 
              alt={skill.name} 
              className="skills-scroll-logo" 
            />
            <span className="skills-scroll-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
