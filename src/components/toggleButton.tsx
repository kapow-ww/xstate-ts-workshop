import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";

const toggleMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBcB7KKAG0gHl8BiAFXoHF2AZAUQG0ADAF1EoAA4VYuMrgr5RIAB6IATCQCMAFgDMKlQIEqArAPXrt2gBwqANCACeibUZLbDAgOwCAnFssfzFQBfILs0LDxCUkpqOgh6ADME1g5ufmEFCSkZOQVlBDUtXX1DEzNdTTtHBABaMxdtHQ9tb0sANm8OzWMQ0JB8Cgg4BXCcAmJMyWlZeSQlRDrLdVcjdSMjfUtGto9dqoX9NTbjtqMLNusBSyM2kLCMMajyKloGWfEpnPf52vNtFbWGyu212Hn2tW0HhI3kaAkhZxUHm8G28dxAo0ixGesQYSUm2RmeUQ6mMJA8mm83g8pw8Z1p4JqzhIOk0cNpuiRKN6QSAA */
  initial: "toggledOn",
  types: {} as {
    events: { type: "TOGGLE_ON" } | { type: "TOGGLE_OFF" };
  },
  states: {
    toggledOn: {
      on: {
        TOGGLE_ON: "toggledOff",
      },
    },
    toggledOff: {
      on: {
        TOGGLE_OFF: "toggledOn",
      },
    },
  },
});

function ToggleButton() {
  const [state, send] = useMachine(toggleMachine);

  return (
    <div className="flex item-center gap-4">
      {state?.value === "toggledOn" ? (
        <button
          className="btn btn-success"
          onClick={() => {
            send({ type: "TOGGLE_ON" });
          }}
        >
          เปิด
        </button>
      ) : (
        <button
          className="btn btn-error"
          onClick={() => {
            send({ type: "TOGGLE_OFF" });
          }}
        >
          ปิด
        </button>
      )}

      {JSON.stringify(state)}
    </div>
  );
}

export default ToggleButton;
