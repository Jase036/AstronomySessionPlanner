//import dependencies
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//import components
import LocMap from './Maps/LocMap';
import Weather from './Weather/Weather';
import AstroPlan from './Scheduler/AstroPlan';
import Globalstyles from "./Globalstyles";
import Catalog from './Catalog/Catalog';
import Header from './Header/Header';
import Home from './HomePage/Home';


const App = () => {
  return (
    <Router>
      <Globalstyles />
      <Wrapper>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<LocMap />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/catalog" element={<Catalog/>} />
          <Route path="/schedule" element={<AstroPlan />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

const Wrapper = styled.div`
  display:flex;
  flex-direction: column;
`

export default App;
