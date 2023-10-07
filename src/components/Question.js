import React from "react";
import Options from "./Options";

const Question = ({ dispatch, question, answer, points }) => {
  return (
    <section>
      <h4>{question.question}</h4>
      <Options
        dispatch={dispatch}
        question={question}
        answer={answer}
        points={points}
      />
    </section>
  );
};

export default Question;
