import { Routes, Route, } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import Contacts from "./pages/Contacts";

const App = () => {
  
return (
  <>
   <Header />
   <Routes>
      <Route path="/" element={<Home />} />;
      <Route path="/apie-mane" element={<About />} />;
      <Route path="/mano-darbai" element={<Works />} />;
      <Route path="/kontaktai" element={<Contacts />} />
    </Routes>
  </>
 );
};

export default App;