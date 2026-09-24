import "../css/Header.css";

export default function Header() {
return ( 
  
<header className="header"> <nav className="navbar"> <h2 className="logo">Aray Zhumat</h2>

    <div className="nav-links">
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <div className="hero">
    <div className="hero-text">
      <p className="hello">Hello!</p>

      <h1>I'm Aray</h1>

      <h2>Information Systems Student</h2>

      <p>
        I am interested in technology, web development and creative UI-UX design.
      </p>

      <a href="#about" className="hero-button">
        More About Me
      </a>
    </div>

    <div className="hero-image">
      <img
        src="./public/5305250089603375298.jpg"
        alt="Profile"
      />
    </div>
  </div>
</header>

);
}
