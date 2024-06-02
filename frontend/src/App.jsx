import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import WorkForm from "./components/WorkForm";

import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
const App = () => {

return (
  <>
   <Header />
   <Routes>
      <Route path="/" element={<Home />} />;
      <Route path="/apie-mane" element={<About />} />;
      <Route path="/mano-darbai" element={<Works />} />;
      <Route path="/add-work" element={<WorkForm />} />;
    </Routes>
  </>
 );
};

export default App;