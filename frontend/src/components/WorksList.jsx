import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './WorksList.scss';

const WorksList = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/works');
      setWorks(response.data);
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };

  return (
    <div className="works-container">
      <h1>Mano Darbai</h1>
      <Link to="/add-work" className="add-link">Pridėti naują darbą</Link>
      <ul>
        {works.map((work) => (
          <li key={work.id}>
            <Link to={`/works/${work.id}`}>{work.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorksList;
