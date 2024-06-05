import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading"; // Komponentas rodomas įkeliant

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Works = lazy(() => import("./pages/Works"));
const Contacts = lazy(() => import("./pages/Contacts"));

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apie-mane" element={<About />} />
            <Route path="/mano-darbai" element={<Works />} />
            <Route path="/kontaktai" element={<Contacts />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default App;
