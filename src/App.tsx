import "./App.css";
import Counter from "./components/Counter";
import FetchMeme from "./components/fetchMeme";
import Todo from "./components/Todo";
import ToggleButton from "./components/ToggleButton";

function App() {
  return (
    <div className="flex flex-col gap-8">
      <ToggleButton />
      <Counter />
      <Todo />
      <FetchMeme />
    </div>
  );
}

export default App;
