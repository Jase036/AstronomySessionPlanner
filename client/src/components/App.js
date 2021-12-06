import styled from 'styled-components';
import Spinner from './Loading/Spinner';
import LocMap from './Maps/LocMap';
import Weather from './Weather/Weather';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";



const App = () => {
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path="/location" element={<LocMap />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

const Wrapper = styled.div`
  display:flex;
`


export default App;
