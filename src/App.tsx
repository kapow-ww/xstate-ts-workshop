import "./App.css";
import Counter from "./components/counter";
import Todo from "./components/todo";
import ToggleButton from "./components/toggleButton";

function App() {
  return (
    <div className="flex flex-col gap-8">
      <ToggleButton />
      <Counter />
      <Todo />
    </div>
  );
}

export default App;
