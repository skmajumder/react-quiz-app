import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      throw new Error("Invalid Action");
  }
};

function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length

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
        {status === "ready" && <StartScreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}

export default App;
