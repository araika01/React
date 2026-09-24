import "../css/Skills.css";

function Skills() {
  const skills = [
    "JavaScript",
    "React",
    "SQL",
    "UI/UX Design",
    "Git & GitHub",
    "Machine Learning",
    "IT Audit",
    "Django Framework"

  ];

  return (
    <section id="skills" className="skills">
      <h2>My Skills</h2>

      <div className="skills-container">
        {skills.map((skill) => (
          <div className="skill-card" key={skill}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;