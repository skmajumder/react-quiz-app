import React from "react";

const Options = ({ question }) => {
  return (
    <div className="options">
      {question.options.map((option, i) => (
        <button key={i} className="btn btn-option">
          {option}
        </button>
      ))}
    </div>
  );
};

export default Options;
