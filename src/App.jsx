import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CsvImport from './Components/CsvImport';
const App = () => {
  // const [csvData, setCsvData] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CsvImport />} />
      </Routes>
    </Router>
  );
};

export default App;
