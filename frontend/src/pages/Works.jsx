import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Works.scss";

const workSchema = Yup.object().shape({
  title: Yup.string().required('Pavadinimas privalomas'),
  description: Yup.string().required('Aprašymas privaloma'),
});

const Works = () => {
  const [works, setWorks] = useState([]); // darbų sąrašas
  const [editingWork, setEditingWork] = useState(null); // Redaguojamas derbas

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/clients') 
      .then((response) => {
        setWorks(response.data); // Įrašyti duomenis
      })
      .catch((error) => {
        console.error('Klaida gaunant duomenis:', error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/works/${id}`);
      setWorks((prev) => prev.filter((work) => work.id !== id));
    } catch (error) {
      console.error('Klaida trinant duomenis:', error);
    }
  };

  const startEditing = (work) => {
    setEditingWork(work);
  };

  const handleEditSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(`http://127.0.0.1:3000/works/${editingWork.id}`, values);
      setWorks((prev) => prev.map((work) => (work.id === editingWork.id ? { ...work, ...response.data } : work)));
      setEditingWork(null);
    } catch (error) {
      console.error('Klaida redaguojant failus:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="worksContainer">
      <h2>Darbų sąrašas</h2>
      <Link to="/add-work" className="addWorkLink">Pridėti naują darbą</Link> {/* Nuoroda į „ClientForm“ su pridėtu stiliumi */}

      <div className="worksFlexContainer">
        {works.map((work) => (
          <div key={work.id} className="workItem">
            {work.photo && (
              <img
                src={`http://127.0.0.1:3000/uploads/${work.photo}`}
                alt={`${work.title} ${work.description}`}
              />
            )}
            {editingWork && editingWork.id === work.id ? (
              <Formik
                initialValues={work}
                validationSchema={workSchema}
                onSubmit={handleEditSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="formGroup">
                      <label>Pavadinimas</label>
                      <Field name="title" type="text" className="inputField" />
                      <ErrorMessage name="title" component="div" className="error" />
                    </div>
                    <div className="formGroup">
                      <label>Aprašymas</label>
                      <Field name="description" type="text" className="inputField" />
                      <ErrorMessage name="desription" component="div" className="error" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="submitButton">
                      Išsaugoti
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <>
                <p>{`${work.title} ${work.description}`}</p>
                <button onClick={() => startEditing(work)} className="editButton">Redaguoti</button>
                <button onClick={() => handleDelete(work.id)} className="deleteButton">Trinti</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
