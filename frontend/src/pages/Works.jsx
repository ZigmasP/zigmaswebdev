
import { Link } from "react-router-dom"; // Importuojame Link komponentą
import "./Works.scss";

const Works = () => {
  const projects = [
    {
      id: 1,
      title: "Projekto pavadinimas 1",
      description: "Trumpas projekto aprašymas 1",
      imageUrl: "nuoroda_i_paveiksleli_1.jpg", // Pakeisk į savo paveikslelio kelią
      demoUrl: "nuoroda_i_demo_1.com",
      sourceUrl: "nuoroda_i_koda_1.com",
    },
    {
      id: 2,
      title: "Projekto pavadinimas 2",
      description: "Trumpas projekto aprašymas 2",
      imageUrl: "nuoroda_i_paveiksleli_2.jpg", // Pakeisk į savo paveikslelio kelią
      demoUrl: "nuoroda_i_demo_2.com",
      sourceUrl: "nuoroda_i_koda_2.com",
    },
    // Pridėk daugiau projektų pagal poreikį
  ];

  return (
    <div>
      <Link to="/" className="back-link">
        Į pagrindinį
      </Link>
      <Link to="/add-work" className="add-work-link">Pridėti darbą</Link> {/* Naujai pridėta */}
      <section id="portfolio">
        <h2>Mano Darbai</h2>
        <div className="projects">
          {projects.map((project) => (
            <div className="project" key={project.id}>
              <img src={project.imageUrl} alt={project.title} />
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-links">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo
                  </a>
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Works;
