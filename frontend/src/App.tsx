import "./App.css";
import Call from "./components/Call";
import Counter from "./components/Counter";
import FetchMeme from "./components/FetchMeme";
import Page from "./components/movie-search";
import TicTacToe from "./components/tic-tac-toe";
import Timer from "./components/timer";
import Todo from "./components/Todo";
import ToggleButton from "./components/ToggleButton";

function App() {
  return (
    <div className="max-w-5xl mx-auto h-screen">
      <div className="flex justify-center items-center flex-col gap-8 h-full">
        {/* <ToggleButton />
      <Counter />
      <Todo />
      <FetchMeme /> */}
        {/* <Call /> */}
        {/* <Timer /> */}
        <TicTacToe />
      </div>
    </div>
  );
}

export default App;
