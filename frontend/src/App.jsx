import { useState } from 'react'
import CodeCell from "../components/CodeCell/CodeCell.jsx";
import './App.css'

function App() {
  const [cells, setCells] = useState([{ id: 1, lang: "javascript", code: "", output: "" }]);

  const addCell = () => {
    setCells([...cells, { id: Date.now(), lang: "javascript", code: "", output: "" }]);
  };

  return (
    <div className='home'>
      <h1>⚡ PolyNote</h1>
      <div className='codecell'>
        {cells.map((cell) => (
          <CodeCell key={cell.id} cell={cell} />
        ))}
      </div>
      <button onClick={addCell} style={{ marginTop: "10px" }}> ➕ Add Cell</button>
    </div>
  );
}

export default App
