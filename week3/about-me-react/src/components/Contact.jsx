import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import "../css/Contact.css";

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2>Contact Me</h2>
      <p>Feel free to connect with me online.</p>

      <div className="contact-links">
        <a href="https://github.com/araika01" target="_blank" rel="noreferrer">
          <FaGithub /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/aray-zhumat-448974388/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin /> LinkedIn
        </a>
        <a
          href="https://www.instagram.com/araizhumat_/"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram /> Instagram
        </a>
        <a href="mailto:your.email@example.com">
          <FaEnvelope /> Email
        </a>
      </div>
    </section>
  );
}

export default Contact;