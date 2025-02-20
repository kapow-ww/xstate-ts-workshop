import { useMachine } from "@xstate/react";
import { setup, assign } from "xstate";

const counterMachine = setup({
  types: {
    context: {} as { count: number },
    events: {} as { type: "INC" } | { type: "DEC" } | { type: "RESET" },
  },
  actions: {
    increment: assign({
      count: ({ context }) => context.count + 1,
    }),
    decrement: assign({
      count: ({ context }) => context.count - 1,
    }),
    reset: assign({
      count: 0,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgMwG0AGAXUVAAcB7WXAF1yf3pAA9EAtAEYRAOgBsAdiEAOSQFYAzAE4ALFQBMQxTIA0IAJ6Ihk8RMmSq005plyZAXwf60WPIVIQwlWj2asOLh5+BG1FCS0hKhlxeW0LRX0jUK1RVS07KMlVGVtFJxcMHAJiEgAnODA2ajokEH92Tm46kNVRIRzVHI6NSQ045STELvDxMfFlGImLGWUnZxB8Ji94Otdijz8WRqCW40khhEVNUVN5cX7FIXl5KlV5hyA */
  context: { count: 0 },
  on: {
    INC: { actions: "increment" },
    DEC: { actions: "decrement" },
    RESET: { actions: "reset" },
  },
});

function Counter() {
  const [state, send] = useMachine(counterMachine);

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl">{+state.context.count}</span>
      <button
        className="btn btn-success"
        onClick={() =>
          send({
            type: "INC",
          })
        }
      >
        เพิ่ม
      </button>

      <button
        className="btn btn-error"
        onClick={() =>
          send({
            type: "DEC",
          })
        }
      >
        ลด
      </button>

      <button
        className="btn btn-warning"
        onClick={() =>
          send({
            type: "RESET",
          })
        }
      >
        รีเซ็ท
      </button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
}

export default Counter;
