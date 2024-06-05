import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Works.scss'; // Importuojame stiliaus failą

const Works = () => {
  const [works, setWorks] = useState([]); // Darbų sąrašas

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/works')
      .then((response) => {
        setWorks(response.data); // Įrašyti duomenis
      })
      .catch((error) => {
        console.error('Klaida gaunant darbus:', error);
      });
  }, []);

  return (
    <div>
      <div className="work-container">
      <Link to="/" className="back-link">Į pagrindinį</Link>
        <div className="works-container">
          {works.map((work) => (
            <div key={work.id} className="workItem">
              <div className="workItemContainer">
                <img src={`http://127.0.0.1:3000/uploads/${work.photo}`} alt={work.title} className="workPhoto" />
                <p className="workTitle">{work.title}</p>
                <p className="workDescription">{work.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Works;
