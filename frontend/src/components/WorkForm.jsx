import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./WorkForm.scss";

const workSchema = Yup.object().shape({
  title: Yup.string().required('Pavadinimas privalomas'),
  description: Yup.string().required('Aprašymas privalomas'),
  photo: Yup.string().required('Nuotrauka privaloma'),
});

const WorkForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append('photo', values.photo);
      formData.append('title', values.title);
      formData.append('description', values.description);

      const response = await axios.post('http://127.0.0.1:3000/works', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Duomenys įterpti:', response.data);
      resetForm();
      navigate('/mano-darbai');
    } catch (error) {
      console.error('Klaida siunčiant duomenis:', error);
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    // Pridėkite kodą atsijungimui, jei reikia
    navigate('/login'); // Galite pakeisti maršrutą į atsijungimo puslapį
  };

  return (
    <div className="workFormContainer">
      <h2>Pridėti darbą</h2>
      <button onClick={handleLogout} className="logoutButton">
        X
      </button>
      <button onClick={() => navigate('/works')} className="workListButton">
        Į darbų sąrašą
      </button>
      <Formik
        initialValues={{
          title: '',
          description: '',
          photo: null,
        }}
        validationSchema={workSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="form">
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
              {isSubmitting ? 'Pateikiama...' : 'Pridėti'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WorkForm;
