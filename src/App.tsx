import "./App.css";
import "reactflow/dist/style.css";
import React from "react";
import { useState } from "react";
import { Attribute, CreateNode } from "./components/createNode";
import { CustomNode } from "./components/customNode";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import { WinnerNode } from "./components/winnerNode";
import { Choices } from "./components/choices";

interface NodeData {
  id: string;
  data: { label: string; attributes: Attribute[] };
  position: { x: number; y: number };
}

function App() {
  const [input, setInput] = useState("");
  const [inputs, setInputs] = useState<NodeData[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [winningNode, setWinningNode] = useState<Node | null>(null);
  const [nodeAdded, setNodeAdded] = useState(false);

  const nodeTypes = {
    customNode: CustomNode,
    winnerNode: WinnerNode,
  };

  const choiceNodes: Node[] = inputs.map((input, index) => ({
    id: `node_${input.id}`,
    type: "customNode",
    data: {
      label: input.data.label,
      attributes: input.data.attributes,
    },
    position: { x: 50 + index * 300, y: 50 },
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (attributes.length === 0) {
      alert("At least one attribute is required.");
      return;
    }

    if (input.trim() !== "") {
      setInputs((prevInputs) => [
        ...prevInputs,
        {
          id: `choice_${prevInputs.length}`,
          data: { label: input, attributes: attributes },
          position: { x: 0, y: 0 },
        },
      ]);
      setInput("");
      setNodeAdded(true);
    }
  };

  const handleRemove = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", score: 0, importance: 0 }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, attribute: Attribute) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = attribute;
    setAttributes(updatedAttributes);
  };

  const calculateWinner = () => {
    setEdges([]);
    if (inputs.length === 0) {
      return;
    }

    const winningChoice = inputs.reduce((prevChoice, currentChoice) => {
      const previousChoiceScore = prevChoice.data.attributes.reduce(
        (sum, attribute) => {
          const attributeScore = attribute.score >= 0 ? attribute.score : 0;
          const attributeImpact = attributeScore * (1 - attribute.importance);
          return sum + attributeImpact;
        },
        0
      );
      const currentChoiceScore = currentChoice.data.attributes.reduce(
        (sum, attribute) => {
          const attributeScore = attribute.score >= 0 ? attribute.score : 0;
          const attributeImpact = attributeScore * (1 - attribute.importance);
          return sum + attributeImpact;
        },
        0
      );
      return currentChoiceScore < previousChoiceScore
        ? currentChoice
        : prevChoice;
    });

    const choiceNodesCount = choiceNodes.length;
    const x =
      choiceNodesCount > 0
        ? choiceNodes.reduce((sum, node) => sum + node.position.x, 0) /
          choiceNodesCount
        : 0;
    const y =
      choiceNodesCount > 0
        ? choiceNodes.reduce((sum, node) => sum + node.position.y + 300, 0) /
          choiceNodesCount
        : 0;
    const position = { x, y };

    const winnerNode: Node = {
      id: "winnerNode",
      type: "winnerNode",
      data: {
        label: winningChoice.data.label,
        attributes: winningChoice.data.attributes,
      },
      position: position,
    };

    const updatedEdges: Edge[] = choiceNodes.map((choice) => ({
      id: `edge_${choice.id}`,
      source: choice.id,
      target: winnerNode.id,
    }));

    setEdges(updatedEdges);
    setWinningNode(winnerNode);
  };

  const reset = () => {
    setInput("");
    setInputs([]);
    setAttributes([]);
    setEdges([]);
    setWinningNode(null);
    setNodeAdded(false);
  };

  return (
    <div className="App">
      <h2>Decision App</h2>
      <CreateNode
        handleSubmit={handleSubmit}
        inputValue={input}
        handleInputChange={onChange}
        addAttribute={addAttribute}
        removeAttribute={removeAttribute}
        handleAttributeChange={handleAttributeChange}
        handleAttributeImportanceChange={handleAttributeChange}
        attributes={attributes}
        nodeAdded={nodeAdded}
      />

      <div className="choices-wrapper">
        {inputs.map((i, index) => {
          return (
            <Choices label={i.data.label} onClick={() => handleRemove(index)} />
          );
        })}
      </div>

      <div>
        <button className="calculate-winner-button" onClick={calculateWinner}>
          Calculate Winner
        </button>
        <button className="reset-button" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise" />
        </button>
      </div>

      <div className="React-flow">
        <ReactFlow
          nodes={[...choiceNodes, ...(winningNode ? [winningNode] : [])]}
          edges={edges}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
