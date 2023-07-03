import React, { ChangeEvent } from "react";
import "./createNode.css";

export interface Attribute {
  name: string;
  score: number;
  importance: number;
}

interface Props {
  inputValue: string;
  attributes: Attribute[];
  handleSubmit: (event: any) => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  addAttribute: () => void;
  removeAttribute: (index: number) => void;
  handleAttributeChange: (index: number, attribute: Attribute) => void;
  handleAttributeImportanceChange: (
    index: number,
    attribute: Attribute
  ) => void;
  nodeAdded: boolean;
}

export function CreateNode(props: Props) {
  const handleAttributeScoreChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAttribute = {
      ...props.attributes[index],
      score: parseFloat(event.target.value),
    };
    props.handleAttributeChange(index, updatedAttribute);
  };

  const handleAttributeImportanceChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAttribute = {
      ...props.attributes[index],
      importance: parseFloat(event.target.value),
    };
    props.handleAttributeImportanceChange(index, updatedAttribute);
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={props.handleSubmit}>
        <input
          className="name-input"
          type="text"
          name="input"
          placeholder="Name"
          value={props.inputValue}
          onChange={props.handleInputChange}
          required
        />
        <div>
          {!props.nodeAdded && (
            <div className="add-attribute-wrapper">
              <p>Add an attribute</p>
              <button
                className="action-button"
                onClick={(event) => {
                  event.preventDefault();
                  props.addAttribute();
                }}
              >
                <i className="bi bi-plus" />
              </button>
            </div>
          )}

          {props.attributes.map((attribute, index) => {
            return (
              <div key={index} className="attribute-wrapper">
                <input
                  type="text"
                  name="attribute"
                  placeholder="Add an attribute"
                  value={attribute.name}
                  onChange={(event) =>
                    props.handleAttributeChange(index, {
                      ...attribute,
                      name: event.target.value,
                    })
                  }
                />
                <p>Score: {attribute.score}</p>
                <input
                  className="attribute-score"
                  type="range"
                  name="attributeScore"
                  min={0}
                  max={100}
                  value={attribute.score}
                  onChange={(event) => handleAttributeScoreChange(event, index)}
                />
                <p>Wighting: {attribute.importance}</p>
                <input
                  className="attribute-score"
                  type="range"
                  name="importanceScore"
                  min={0}
                  max={1}
                  step={0.5}
                  value={attribute.importance}
                  onChange={(event) =>
                    handleAttributeImportanceChange(event, index)
                  }
                />
                <button
                  type="button"
                  className="action-button"
                  onClick={() => props.removeAttribute(index)}
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            );
          })}
        </div>

        <input type="submit" name="submit" value="Add" />
      </form>
    </div>
  );
}
