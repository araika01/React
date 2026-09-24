import "../css/About.css";

function About() {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <h2>About Me</h2>

        <p>          
          I was born and raised in the Pavlodar Region. I graduated from high school with a gold medal and enrolled at KBTU in 2023.
          Currently, I am deeply interested in Web Development and Data Science.
        
        
        </p>

        <p>
          At university, I am interested in several hobbies, including reading books and hiking in the mountains. 
          Last year, I read interesting novels by Sara Jio and Agatha Christie, especially detective stories.
       </p>

       <p>
          Now, I am developing my English skills to achieve a high score on the IELTS exam and open up global opportunities for studying for a master's degree.

       </p>
       <div className="about-gallery">
       
      <img
        src={`${import.meta.env.BASE_URL}5305250089603375917.jpg`}
        alt="photo"
      />
      <img
        src={`${import.meta.env.BASE_URL}5305250089603375919.jpg`}
        alt="photo"
      />
      <img
        src={`${import.meta.env.BASE_URL}5305250089603375921.jpg`}
        alt="photo"
      />
    </div>
      </div>
    </section>
  );
}

export default About;