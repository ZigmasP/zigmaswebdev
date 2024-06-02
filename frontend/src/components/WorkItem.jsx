import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useParams, Link } from "react-router-dom";
import "./WorkItem.scss";

const WorkItem = () => {
  const [work, setWork] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    fetchWork(id);
  }, [id]);

  const fetchWork = async (workId) => {
    try {
      const response = await axios.get(`http://localhost:5000/works/${workId}`);
      setWork(response.data);
    } catch (error) {
      console.error('Error fetching work:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/works/${id}`);
      history.push('/works');
    } catch (error) {
      console.error('Error deleting work:', error);
    }
  };

  if (!work) {
    return <div>Loading...</div>;
  }

  return (
    <div className="work-item-container">
      <h1>{work.title}</h1>
      <p>{work.description}</p>
      {work.image_path && <img src={`http://localhost:5000/${work.image_path}`} alt={work.title} />}
      <div>
        <Link to={`/edit-work/${work.id}`}>Redaguoti</Link>
        <button onClick={handleDelete}>Ištrinti</button>
      </div>
    </div>
  );
};

export default WorkItem;
