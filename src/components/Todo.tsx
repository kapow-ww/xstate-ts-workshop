import { useMachine } from "@xstate/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { setup, assign } from "xstate";

interface Todos {
  id: string;
  text: string;
}

type TodoEvent =
  | { type: "ADD_TODO"; text: string }
  | { type: "REMOVE_TODO"; id: string };

const todoMachine = setup({
  types: {
    context: {} as { todos: Todos[] },
    events: {} as TodoEvent,
  },
  actions: {
    addTodo: assign({
      todos: ({ context, event }) => {
        if (event.type !== "ADD_TODO") return context.todos;

        return [
          ...context.todos,
          {
            id: uuidv4(),
            text: event.text,
          },
        ];
      },
    }),
    removeTodo: assign({
      todos: ({ context, event }) => {
        if (event.type !== "REMOVE_TODO") return context.todos;

        return context.todos.filter((t) => t.id !== event.id);
      },
    }),
  },
}).createMachine({
  context: { todos: [] },
  on: {
    ADD_TODO: {
      actions: "addTodo",
    },
    REMOVE_TODO: {
      actions: "removeTodo",
    },
  },
});

function Todo() {
  const [state, send] = useMachine(todoMachine);

  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      send({ type: "ADD_TODO", text: inputValue });
      setInputValue("");
    }
  };

  return (
    <div>
      <div>{JSON.stringify(state)}</div>
      <div className="join">
        <div>
          <div>
            <input
              className="input input-bordered join-item"
              placeholder="กรอกข้อมูล"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>

        <div className="indicator">
          <button
            className="btn btn-success  join-item"
            onClick={() => handleAdd()}
          >
            เพิ่ม
          </button>
        </div>
      </div>

      <ul>
        {state.context.todos.map((todo) => (
          <li key={todo.id} className="p-2 border-b flex justify-between">
            <span>{todo.text}</span>
            <button
              className="btn btn-sm btn-error"
              onClick={() => send({ type: "REMOVE_TODO", id: todo.id })}
            >
              ลบ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
