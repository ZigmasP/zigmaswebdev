import { Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {

  return (
   <div className="home-container">
     <Link to="/" className="back-link">Į pagrindinį</Link>
      <section className="hero">
       <h1>Sveiki atvykę į ZigmasWebDev.lt</h1>
       <p>Kuriu modernias svetaines ir programas</p>
      </section>
    </div>
  );
};

export default Home;
