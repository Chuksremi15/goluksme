import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Raises from "./pages/Raises";
import Create from "./pages/Create";
import Campaign from "./pages/Campaign";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Raises />} />
        <Route path="/create" element={<Create />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/campaign/:id" element={<Campaign />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
