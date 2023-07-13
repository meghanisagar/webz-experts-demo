import { useState } from "react";
import Demo from "./Demo";
import "./App.css";
import {Button} from 'react-bootstrap';

function App() {
  const [showDemo, setShowDemo] = useState(false);
  return (
    <>
      {showDemo ? (
        <Demo />
      ) : (
        <Button variant="outline-secondary" onClick={() => setShowDemo(true)}>
          Show Demo
        </Button>
      )}
    </>
  );
}

export default App;
