import styled from 'styled-components';
import Spinner from './Loading/Spinner';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LocMap from './Maps/LocMap';
import Weather from './Weather/Weather';
import AstroPlan from './Scheduler/AstroPlan';
import Globalstyles from "./Globalstyles";
import Catalog from './Catalog/Catalog';
import Header from './Header/Header';


const App = () => {
  return (
    <Router>
      <Globalstyles />
      <Wrapper>
        <Header />
        <Routes>
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
