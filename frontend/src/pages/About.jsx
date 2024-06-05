import { Link } from "react-router-dom";
import profileImage from "../assets/mano.jpg";
import { FaReact, FaJs, FaNode } from "react-icons/fa";
import "./About.scss";

const About = () => {
  return (
    <div className="about-container">
      <Link to="/" className="back-link">Į pagrindinį</Link>
      <section className="hero">
        <div className="profile-container">
          <img src={profileImage} alt="Profilio nuotrauka" className="profile-image" loading="lazy" />
        </div>
      </section>
      <section className="about-text">
        <div className="content">
          <p>Sveiki! Esu <span className="highlight">Zigmas</span>, specializuojantis frontend (
            <span className="icon-text">
              <FaReact className="icon" color="#61DBFB" /> React,
            </span>
            <span className="icon-text">
              <FaJs className="icon" color="#F0DB4F" /> JavaScript
            </span>) ir backend (
            <span className="icon-text">
              <FaNode className="icon" color="#68A063" /> Node.js
            </span>) technologijose.</p>
          <p>Mano tikslas yra suteikti jums puikų interneto svetainių ir programų patyrimą, atitinkantį jūsų poreikius ir viršijantį jūsų lūkesčius. Esu pasirengęs įgyvendinti jūsų idėjas nuo pradžios iki pabaigos, siekdamas užtikrinti, kad jūsų projektas būtų sėkmingas.</p>
          <p>Šiuo metu esu freelancer, todėl turėčiau galimybę dirbti su jumis tiesiogiai ir suteikti jums asmeninį dėmesį jūsų projektui. Nepaisant to, kad esu pradedantysis, esu labai motyvuotas tobulėti ir teikti aukščiausio lygio paslaugas savo klientams.</p>
          <p>Jei turite klausimų ar norite aptarti savo projektą, nedvejokite susisiekti su manimi. Būsiu labai dėkingas galimybei bendradarbiauti ir padėti jums pasiekti jūsų tikslus.</p>
          <p>Dėkoju už dėmesį ir laukiu galimybės dirbti su jumis!</p>
          <p>Su pagarba,</p>
          <p><span className="highlight">Zigmas</span></p>
        </div>
      </section>
    </div>
  );
};

export default About;
