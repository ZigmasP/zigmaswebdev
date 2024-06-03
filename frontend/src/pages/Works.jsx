import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Works.scss'; // Importuojame stiliaus failą

const workSchema = Yup.object().shape({
  title: Yup.string().required('Pavadinimas privalomas'),
  description: Yup.string().required('Aprašymas privalomas'),
  photo: Yup.string().required('Nuotrauka privaloma'),
});

const Works = () => {
  const [works, setWorks] = useState([]); // Darbų sąrašas
  const [editingWork, setEditingWork] = useState(null); // Redaguojamas darbas

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/works')
      .then((response) => {
        setWorks(response.data); // Įrašyti duomenis
      })
      .catch((error) => {
        console.error('Klaida gaunant darbus:', error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/works/${id}`);
      setWorks((prev) => prev.filter((work) => work.id !== id));
    } catch (error) {
      console.error('Klaida trinant darbą:', error);
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
      console.error('Klaida redaguojant darbą:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workListContainer">
      <h2>Darbų sąrašas</h2>
      <Link to="/add-work" className="addWorkLink">Pridėti naują darbą</Link> {/* Nuoroda į „WorkForm“ su pridėtu stiliumi */}

      <div className="worksFlexContainer">
        {works.map((work) => (
          <div key={work.id} className="workItem">
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
                      <ErrorMessage name="description" component="div" className="error" />
                    </div>
                    <div className="formGroup">
                      <label>Nuotrauka</label>
                      <Field name="photo" type="text" className="inputField" />
                      <ErrorMessage name="photo" component="div" className="error" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="submitButton">
                      Išsaugoti
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <>
                <p>{`${work.title} - ${work.description}`}</p>
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
