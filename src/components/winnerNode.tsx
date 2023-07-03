import React from "react";
import { Attribute } from "./createNode";
import "./winnerNode.css";
import { Handle, Position } from "reactflow";

interface Props {
  data: {
    label: string;
    attributes: Attribute[];
  };
}

export function WinnerNode(props: Props) {
  return (
    <div className="winner-node-wrapper">
      <Handle type="target" position={Position.Top} />
      <h1> Winner </h1>
      <p>{props.data.label}</p>
    </div>
  );
}
