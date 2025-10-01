import { useState } from 'react'
import CodeCell from "../CodeCell/CodeCell.jsx";
import './Dashboard.css'

const Dashboard = () => {
  const [cells, setCells] = useState([{ id: 1, lang: "javascript", code: "", output: "" }]);

  const addCell = () => {
    setCells([...cells, { id: Date.now(), lang: "javascript", code: "", output: "" }]);
  };

  const deleteCell = (id) => {
    setCells(cells.filter(cell => cell.id !== id));
  }

  return (
    <div className='home'>
      
      <h1>⚡ PolyNote</h1>
      <div className='codecell'>
        {cells.map((cell) => (
          <CodeCell key={cell.id} id={cell.id} onDelete={deleteCell} cell={cell} />
        ))}
      </div>
      <button onClick={addCell} style={{ marginTop: "10px" }}> ➕ Add Cell</button>       
    </div>
  );
}

export default Dashboard
