import "../css/Projects.css";

function Projects() {
  const projects = [
  {
    title: "TempWork",
    description: "Web platform that helps people find temporary work...",
    tags: ["React", "API", "Django"],
    links: [
      { label: "GitHub", url: "https://github.com/araika01/ESG-Project" },
    ],
  },
  {
    title: "beautyME",
    description: "Online beauty shop platform — UI/UX design.",
    tags: ["Figma", "Prototype", "User Flow"],
    links: [
      { label: "Prototype", url: "https://www.figma.com/design/..." },
      { label: "User Flow", url: "https://www.figma.com/board/..." },
    ],
  },
  {
    title: "Parkinson's Voice Detection",
    description: "A machine learning system that screens for Parkinson's...",
    tags: ["Django", "SQL", "Bootstrap"],
    links: [
      { label: "GitHub", url: "https://github.com/Broski228/ML_Final_Project" },
    ],
  },
];

  return (
    <section id="projects" className="projects">
      <h2>My Projects</h2>
      <p className="projects-subtitle">
        A selection of things I've built and worked on
      </p>

      <div className="projects-container">
        {projects.map((p) => (
          <div className="project-card" key={p.title}>
            <h3>{p.title}</h3>
            <p className="project-desc">{p.description}</p>

            <div className="project-tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="project-links">
                {p.links.map((link) => (
            <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                >
                    {link.label} →
                    </a>
                ))}
                </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;