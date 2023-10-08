import React, { useEffect } from "react";

const Timer = ({ dispatch, secondsRemaining }) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    secondsRemaining % 60 < 10
      ? `0${secondsRemaining % 60}`
      : secondsRemaining % 60;

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "quizTimer" });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="timer">
      {formattedMinutes}:{formattedSeconds}
    </div>
  );
};

export default Timer;
