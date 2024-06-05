import { Link } from "react-router-dom";
import { FaBuilding, FaUniversity, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import "./Contacts.scss";

const Contacts = () => {
    
  return (
    <div className="contacts-container">
      <Link to="/" className="back-link">Į pradinį</Link>
      <section className="hero">
        <h1>Kontaktai</h1>
      </section>
      <section className="contact-info">
        <div className="contact-item">
          <FaBuilding className="icon" />
          <div>
            <span>Įmonės pavadinimas: Mano įmonė</span>
            <span>Įmonės kodas: 123456789</span>
          </div> 
        </div>
        <div className="contact-item">
          <FaMapMarkerAlt className="icon" />
          <div>
            <span>Adresas: Kruojos g. 8-56, Pakruojis, Lietuva</span>
          </div>
        </div>
        <div className="contact-item">
          <FaUniversity className="icon" />
          <div>
            <span>Banko sąskaitos nr.: LT737300010097043750, Swedbank</span>
          </div>
        </div>
        <div className="contact-item">
          <FaEnvelope className="icon" />
          <div>
            <span>El. paštas: zigmas.1@gmail.com</span>
          </div>
        </div>
        <div className="contact-item">
          <FaPhone className="icon" />
          <div>
            <span>Tel. nr.: +37060627573</span>
          </div>
        </div>
      </section>   
    </div>
  );
};

export default Contacts;
