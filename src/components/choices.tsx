import React from "react";
import "./choices.css";
interface Props {
  label: string;
  onClick: () => void;
}

export function Choices(props: Props) {
  return (
    <button className="choice-wrapper" onClick={props.onClick}>
      {props.label}
    </button>
  );
}
