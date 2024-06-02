import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./WorkForm.scss";

const WorkForm = () => {
  const [work, setWork] = useState(null);
  const history = useHistory();
  // Keitimas čia
  const { id } = useParams(); // Naujas importas

  useEffect(() => {
    if (id) {
      fetchWork(id);
    }
  }, [id]);

  const fetchWork = async (workId) => {
    try {
      const response = await axios.get(`http://localhost:5000/works/${workId}`);
      setWork(response.data);
    } catch (error) {
      console.error('Error fetching work:', error);
    }
  };

  const initialValues = {
    title: work ? work.title : '',
    description: work ? work.description : '',
    image: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Pavadinimas yra privalomas'),
    description: Yup.string().required('Aprašymas yra privalomas'),
    image: Yup.mixed(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    if (values.image) {
      formData.append('image', values.image);
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/works/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/works', formData);
      }
      history.push('/works');
    } catch (error) {
      console.error('Error saving work:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="work-form-container">
      <h1>{id ? 'Redaguoti darbą' : 'Pridėti naują darbą'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue }) => (
          <Form>
            <div>
              <label>Pavadinimas</label>
              <Field name="title" type="text" />
              <ErrorMessage name="title" component="div" />
            </div>
            <div>
              <label>Aprašymas</label>
              <Field name="description" as="textarea" />
              <ErrorMessage name="description" component="div" />
            </div>
            <div>
              <label>Nuotrauka</label>
              <input
                name="image"
                type="file"
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="image" component="div" />
            </div>
            <button type="submit">Išsaugoti</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WorkForm;
