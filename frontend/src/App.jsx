import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
const App = () => {

return (
  <>
   <Header />
   <Routes>
      <Route path="/" element={<Home />} />;
      <Route path="/apie-mane" element={<About />} />;
    </Routes>
  </>
 );
};

export default App;