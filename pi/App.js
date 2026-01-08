import React, { useState, useCallback } from "react";
import ReactFlow, { addEdge, MiniMap, Controls, Background } from "react-flow-renderer";
import axios from "axios";
import "./App.css"; // استدعاء CSS لوضع تصميم Dashboard شفاف ومميز

const initialElements = [
  { id: "1", type: "input", data: { label: "Start" }, position: { x: 250, y: 5 } },
];

function App() {
  const [elements, setElements] = useState(initialElements);
  const [userId, setUserId] = useState("");
  const [txId, setTxId] = useState("");
  const [piAmount, setPiAmount] = useState(0);
  const [results, setResults] = useState([]);

  const onConnect = useCallback(
    (params) => setElements((els) => addEdge(params, els)),
    []
  );

  const addNode = (type) => {
    const newNode = {
      id: (elements.length + 1).toString(),
      data: { label: type },
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 200 },
      style: {
        border: "2px solid #ffd700",
        borderRadius: "10px",
        background:
          type === "parallel"
            ? "rgba(255,150,0,0.7)"
            : type === "conditional"
            ? "rgba(50,150,255,0.7)"
            : type === "plugin"
            ? "rgba(200,0,255,0.7)"
            : "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: 12,
        fontWeight: 600,
      },
    };
    setElements((els) => els.concat(newNode));
  };

  const executeWorkflow = async () => {
    try {
      const workflow = elements.map((e) => ({ action: e.data.label }));

      const res = await axios.post("http://localhost:3000/command", {
        userId,
        txId,
        requiredPi: piAmount,
        command: workflow,
      });

      // عرض النتائج على Result Panel
      setResults((prev) => [...prev, JSON.stringify(res.data, null, 2)]);
    } catch (err) {
      setResults((prev) => [
        ...prev,
        `Error: ${err.response?.data?.message || err.message}`,
      ]);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", background: "linear-gradient(135deg, #1f1c2c, #928dab)" }}>
      {/* Sidebar */}
      <div style={{
        width: "260px",
        padding: "15px",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        color: "#fff",
        overflowY: "auto",
      }}>
        <h2>UniLingo AI Dashboard</h2>

        <h3>Nodes</h3>
        <button onClick={() => addNode("generate_text")}>Text</button>
        <button onClick={() => addNode("generate_image")}>Image</button>
        <button onClick={() => addNode("generate_audio")}>Audio</button>
        <button onClick={() => addNode("merge_video")}>Merge Video</button>
        <button onClick={() => addNode("parallel")}>Parallel</button>
        <button onClick={() => addNode("conditional")}>If-Else</button>
        <button onClick={() => addNode("plugin")}>Plugin</button>

        <hr style={{ borderColor: "#ffd700" }} />
        <h3>Pi Payment</h3>
        <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input placeholder="Tx ID" value={txId} onChange={(e) => setTxId(e.target.value)} />
        <input type="number" placeholder="Pi Amount" value={piAmount} onChange={(e) => setPiAmount(parseFloat(e.target.value))} />
        <button onClick={executeWorkflow}>Run Workflow</button>
      </div>

      {/* React Flow Canvas */}
      <div style={{ flexGrow: 1, position: "relative" }}>
        <ReactFlow elements={elements} onConnect={onConnect} snapToGrid={true} snapGrid={[15, 15]}>
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>

        {/* Results Panel */}
        <div style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          width: "350px",
          maxHeight: "45%",
          background: "rgba(0,0,0,0.6)",
          borderRadius: "10px",
          overflowY: "auto",
          padding: "10px",
          boxShadow: "0 0 15px #ffd700",
        }}>
          <h4 style={{ margin: 0, color: "#ffd700" }}>Results:</h4>
          {results.map((r, idx) => (
            <div key={idx} style={{ marginBottom: "8px", background: "rgba(255,255,255,0.1)", padding: "5px", borderRadius: "6px", fontSize: "13px" }}>
              {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
