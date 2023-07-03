import React from "react";
import { Attribute } from "./createNode";
import "./customNode.css";
import { Handle, Position } from "reactflow";

interface Props {
  data: {
    label: string;
    attributes: Attribute[];
  };
}

export function CustomNode(props: Props) {
  return (
    <div className="custom-node-wrapper">
      <h3 className="custom-node-label">{props.data.label}</h3>
      <hr className="divider" />
      {props.data.attributes.map((attribute, index) => (
        <div key={index} className="custom-node-score">
          <div>
            {attribute.name}: {attribute.score}
          </div>
          <input
            className="attribute-score"
            type="range"
            name="attributeScore"
            min={0}
            max={100}
            value={attribute.score}
            readOnly
          />
        </div>
      ))}
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
