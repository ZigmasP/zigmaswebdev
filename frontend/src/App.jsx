import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import WorksList from "./components/WorksList";
import WorkForm from "./components/WorkForm";
import WorkItem from "./components/WorkItem";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apie-mane" element={<About />} />
        <Route path="/works" element={<WorksList />} />
        <Route path="/add-work" element={<WorkForm />} />
        <Route path="/edit-work/:id" element={<WorkForm />} />
        <Route path="/works/:id" element={<WorkItem />} />
      </Routes>
    </>
  );
};

export default App;
