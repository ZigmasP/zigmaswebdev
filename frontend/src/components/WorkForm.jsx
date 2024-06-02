import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./WorkForm.scss";

const workSchema = Yup.object().shape({
  firstName: Yup.string().required('Vardas privalomas'),
  lastName: Yup.string().required('Pavardė privaloma'),
  birthDate: Yup.date().required('Gimimo data privaloma'),
});

const WorkForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append('photo', values.photo);
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('birthDate', values.birthDate);

      const response = await axios.post('http://127.0.0.1:3000/add-work', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Duomenys įterpti:', response.data);
      resetForm();
      navigate('/works');
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
    <div className={styles.workFormContainer}>
      <h2>Pridėti darbą</h2>
      <button onClick={handleLogout} className={styles.logoutButton}>
        X
      </button>
      <button onClick={() => navigate('/works')} className={styles.workListButton}>
        Į darbų sąrašą
      </button>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          birthDate: '',
          photo: null,
        }}
        validationSchema={workSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Vardas</label>
              <Field name="firstName" type="text" className={styles.inputField} />
              <ErrorMessage name="firstName" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <label>Pavardė</label>
              <Field name="lastName" type="text" className={styles.inputField} />
              <ErrorMessage name="lastName" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <label>Gimimo data</label>
              <Field name="birthDate" type="date" className={styles.inputField} />
              <ErrorMessage name="birthDate" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <label>Nuotrauka</label>
              <input
                type="file"
                onChange={(event) => setFieldValue('photo', event.currentTarget.files[0])}
                className={styles.inputField}
              />
              <ErrorMessage name="photo" component="div" className={styles.error} />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? 'Pateikiama...' : 'Pridėti'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WorkForm;