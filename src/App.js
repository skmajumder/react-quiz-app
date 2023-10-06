import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

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
  const [state, dispatch] = useReducer(reducer, initialState);

  const { questions, status } = state;

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
        <p>1/15</p>
        <p>Questions</p>
      </Main>
    </div>
  );
}

export default App;
