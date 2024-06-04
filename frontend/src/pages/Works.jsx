import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Works.scss'; // Importuojame stiliaus failą

const workSchema = Yup.object().shape({
  title: Yup.string().required('Pavadinimas privalomas'),
  description: Yup.string().required('Aprašymas privalomas'),
  photo: Yup.mixed().required('Nuotrauka privaloma'),
});

const Works = () => {
  const [works, setWorks] = useState([]); // Darbų sąrašas
  const [editingWork, setEditingWork] = useState(null); // Redaguojamas darbas
  const [message, setMessage] = useState(null); // Pranešimo būsena

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
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      if (values.photo) {
        formData.append('photo', values.photo);
      } else if (editingWork.photo) {
        formData.append('photo', editingWork.photo);
      } else {
        alert('Nuotrauka privaloma');
        setSubmitting(false);
        return;
      }

      const response = await axios.put(`http://127.0.0.1:3000/works/${editingWork.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setWorks((prev) =>
        prev.map((work) =>
          work.id === editingWork.id ? { ...work, ...response.data } : work
        )
      );
      setEditingWork(null);
      setMessage({ type: 'success', text: 'Pakeitimai sėkmingai išsaugoti' });
    } catch (error) {
      console.error('Klaida redaguojant darbą:', error);
      setMessage({ type: 'error', text: 'Nepavyko išsaugoti pakeitimų' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000); // Pašalina pranešimą po 3 sekundžių
    }
  };

  return (
    <div className="workListContainer">
     <Link to="/add-work" className="addWorkLink">Pridėti naują darbą</Link> {/* Nuoroda į „WorkForm“ su pridėtu stiliumi */}
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      
      <div className="worksFlexContainer">
        {works.map((work) => (
          <div key={work.id} className="workItem">
            {editingWork && editingWork.id === work.id ? (
              <Formik
                initialValues={{
                  title: work.title,
                  description: work.description,
                  photo: '', // Nustatome pradžią reikšmę
                }}
                validationSchema={workSchema}
                onSubmit={handleEditSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
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
                      <input
                        type="file"
                        onChange={(event) => setFieldValue('photo', event.currentTarget.files[0])}
                        className="inputField"
                      />
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
                <div className="workItemContainer">
                  <img src={`http://127.0.0.1:3000/uploads/${work.photo}`} alt={work.title} className="workPhoto" />
                  <p className="workTitle">{work.title}</p>
                  <p className="workDescription">{work.description}</p>
                  <div>
                    <button onClick={() => startEditing(work)} className="editButton">Redaguoti</button>
                    <button onClick={() => handleDelete(work.id)} className="deleteButton">Trinti</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
