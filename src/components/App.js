import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    default:
      throw new Error("Invalid Action");
  }
};

function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuestions() {
      try {
        const response = await fetch(`http://localhost:8000/questions`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Something went wrong with the fetching data");
        }

        const data = await response.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error.name);
          console.log(error.message);
          dispatch({ type: "dataFailed" });
        }
      }
    }

    fetchQuestions();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            dispatch={dispatch}
            question={questions[index]}
            answer={answer}
            points={points}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
