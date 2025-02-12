import "./App.css";
import ToggleButton from "./components/toggleButton";
import Counter from "./components/counter";

function App() {
  return (
    <div className="flex flex-col gap-8">
      <ToggleButton />
      <Counter />
    </div>
  );
}

export default App;
