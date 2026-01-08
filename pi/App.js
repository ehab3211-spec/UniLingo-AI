import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background
} from "react-flow-renderer";
import axios from "axios";

const initialElements = [
  { id: "1", type: "input", data: { label: "Start" }, position: { x: 250, y: 5 } },
];

function App() {
  const [elements, setElements] = useState(initialElements);
  const [userId, setUserId] = useState("");
  const [txId, setTxId] = useState("");
  const [piAmount, setPiAmount] = useState(0);

  const onConnect = useCallback(
    (params) => setElements((els) => addEdge(params, els)),
    []
  );

  const addNode = (type) => {
    const newNode = {
      id: (elements.length + 1).toString(),
      data: { label: type },
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 200 },
    };
    setElements((els) => els.concat(newNode));
  };

  const executeWorkflow = async () => {
    try {
      const workflow = elements.map(e => ({ action: e.data.label }));
      const res = await axios.post("http://localhost:3000/command", {
        userId, txId, requiredPi: piAmount, command: workflow
      });
      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div style={{ width: "200px", padding: "10px", background: "#f3f3f3" }}>
        <h3>Nodes</h3>
        <button onClick={() => addNode("generate_text")}>Text</button>
        <button onClick={() => addNode("generate_image")}>Image</button>
        <button onClick={() => addNode("generate_audio")}>Audio</button>
        <button onClick={() => addNode("merge_video")}>Merge Video</button>
        <button onClick={() => addNode("conditional")}>Conditional</button>
        <hr />
        <h3>Pi Payment</h3>
        <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
        <input placeholder="Tx ID" value={txId} onChange={e => setTxId(e.target.value)} />
        <input type="number" placeholder="Pi Amount" value={piAmount} onChange={e => setPiAmount(parseFloat(e.target.value))} />
        <button onClick={executeWorkflow}>Run Workflow</button>
      </div>
      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
