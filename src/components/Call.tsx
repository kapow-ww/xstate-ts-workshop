import { useMachine } from "@xstate/react";
import { v4 as uuidv4 } from "uuid";
import { assign, fromCallback, fromPromise, sendTo, setup } from "xstate";

const timerMachine = setup({
  types: {
    context: {} as {
      seconds: number;
    },
    events: {} as
      | { type: "START" }
      | { type: "STOP" }
      | { type: "RESET" }
      | { type: "TICK" },
  },
  actors: {
    ticks: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: "TICK" });
      }, 1000);
      return () => clearInterval(interval);
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgCc4wAXAbQAYBdRUABwHtZcrc39mQAHogCMATgDMAOmEB2ABziZdOQFYAbOLUq6agDQgAniIBMAX1P60WPISKTYVNixaQSD9GVqN+7Tt178QgiyapIALDKiwioRkSrGMXqGiOKqknTKMmIq2sZqMmYWIFY4BMT2js6uqAQArlRg9ExIIL5cPHwtQSpy6XRROnTioloSxvpGCMYyoQrimvMy4j0qomHmlhilthVOLhBuYJi8EE0+HO0BXYjqkuLGa8JyYcPyEpoTInLCkirywsMojIesJCptrGU7GRavh8AQoG5KmcWm1-J1QEFjGEwuEInIJOoxKpRCpPgh5ippCNjHQVpFUnINsUtjZytDYfCSAAVACSAGEANLI1gXNGBFJqUJhGkxSJhBRhHRkvI4ujCDKg-rGb73cxFfBsCBwfglVlEc5+DrihBhMlrSQJeLGcRhdQZCLiJmmyG7KoQC2XdGCG7jZLkmQydJyVRyNRyB6rHQyL0sn3suH4KABsXXcnDdIjCk08TqtQvMmaHF5eLLGLR2RrPWmIA */

  id: "timer",
  context: {
    seconds: 0,
  },
  initial: "stopped",
  states: {
    stopped: {
      on: {
        START: {
          guard: ({ context }) => context.seconds === 0,
          target: "running",
        },
      },
    },
    running: {
      invoke: {
        src: "ticks",
      },
      on: {
        STOP: "stopped",
        TICK: {
          actions: assign({
            seconds: ({ context }) => context.seconds + 1,
          }),
        },
      },
    },
  },
  on: {
    RESET: {
      guard: ({ context }) => context.seconds > 0,
      actions: assign({
        seconds: 0,
      }),
    },
  },
});

async function delay(ms: number, errorProbability: number = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorProbability) {
        reject({ type: "ServiceNotAvailable" });
      } else {
        resolve();
      }
    }, ms);
  });
}

type callEvent =
  | { type: "START_CALL" }
  | { type: "END_CALL" }
  | { type: "RESET" };

interface CallData {
  callId: string;
  startDate: Date;
  endDate: Date;
}

const callWorkflow = setup({
  types: {
    context: {} as {
      data: CallData | null;
      timerRef: any;
    },
    events: {} as callEvent,
  },
  actors: {
    fetchCallDetails: fromPromise(async () => {
      await delay(2000);

      console.log("Completed fetch call details");
      return {
        callId: uuidv4(),
        startDate: new Date(),
        endDate: new Date(),
      };
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQBUBBAJXoH0BhRgGW4G0ADAF1EoAA4B7WLgAuuCflEgAHogCMAdgBsJACwaAnGq0AOXVt0AmNUYMAaEAE9ElkwGYSBjW7UDLAn0sDYK0AX1CHNCw8QlIxACcwMXRE6ggFMDJ8ADcJAGtMqJwCYhIEpJSwBAJczHQ5BUEhJqVJaQbFJBVEAFYtARI1NX8BEwMekw1R+ycXXRMSHrcDAS1TDSmVtXDIjGLYssTk1LB4+Il4sop6gDML1BIimNLy46qaiTqOppauttl5J1QKoEH0BkMRmMJlMxg5nAg3LoBhoTBYLMM-AZ9DsQE8SqQ6hQKAQoNQAKIAOQAIpwePxhK0pACFEoQUYNCRtCZLBtdMZ3Lo3HC5hyAj1jGtLJY+qieji8Qd4vUSdRmGTaGT6L9xEyOqzEFiep4bD5DL4NpYhbMEMMFmo3K5LW4ekEBF45RFcXtnqRsOhsmAAAQJCQAIyoqFV6s12pA-z1XRBWh6RpT+ksunGWl8al0woQVh0WilZilAglbm84U9+AkEDgSgVxEZ7UB+oQAFotPmu-LvfiyJQwC3mUDugXLPn7RyjGs+itrPpTH3ogPXpURwngYg3A6SAEVho1GMAjYtFb4ZZ+pygv0liZxcYeroV-tSoTifgoJu24nEBsDBINwxjcNZtH6IIZkvLRAPZAxuWfYZc22T0m1IJU5C-H8WT-G0BBTEgHysTQlj5NQ+inUCgI0aFuWAjYhhMV8fRIP0A2Dc5wzAVBsLHEFtCNeYDGLXQekMXQJI0fNESNPwUwMHkbCxYZq1CIA */
  initial: "idle",
  context: {
    data: null,
    timerRef: null,
  },
  states: {
    idle: {
      on: {
        START_CALL: {
          target: "prepare",
        },
      },
    },
    prepare: {
      invoke: {
        src: "fetchCallDetails",
        onDone: {
          target: "calling",
          actions: [
            assign({
              data: ({ event }) => event.output as CallData,
            }),
          ],
        },
        onError: {
          target: "have problem",
        },
      },
    },
    calling: {
      on: {
        END_CALL: {
          target: "rating",
          actions: [({ context }) => context.timerRef?.send({ type: "STOP" })],
        },
      },
    },
    rating: {
      on: {
        RESET: {
          target: "idle",
        },
      },
    },
    "have problem": {
      on: {
        RESET: {
          target: "idle",
        },
      },
    },
  },
});

const formatSeconds = (secs: number): string => {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

function Call() {
  const [state, send] = useMachine(callWorkflow);
  const elapsed = state.context.timerRef
    ? state.context.timerRef?.getSnapshot()?.context?.seconds ?? 0
    : 0;

  console.log(elapsed);
  const handleStartCall = () => {
    send({ type: "START_CALL" });
  };

  const handleEndCall = () => {
    send({ type: "END_CALL" });
  };

  const handleReset = () => {
    send({ type: "RESET" });
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure>
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <img src="/user.jpg" alt="user-image" />
          </div>
        </div>
      </figure>
      <div className="card-body items-center">
        <h2 className="card-title">Jane Doe</h2>

        {state.matches("idle") && <p>you want to call?</p>}
        {state.matches("prepare") && (
          <div className="text-center">
            <p>ring ring ...</p>
          </div>
        )}
        {state.matches("calling") && (
          <div className="text-center">
            <p>in call...</p>
            <p className="text-red-600">{formatSeconds(elapsed)}</p>
          </div>
        )}
        {state.matches("rating") && (
          <div className="text-center">
            <p>end call</p>{" "}
            <p className="text-gray-500">{formatSeconds(elapsed)}</p>
          </div>
        )}

        <div className="card-actions justify-end">
          {state.matches("idle") && (
            <button className="btn  btn-success" onClick={handleStartCall}>
              start call
            </button>
          )}
          {state.matches("calling") && (
            <button className="btn btn-error" onClick={handleEndCall}>
              end call
            </button>
          )}
          {state.matches("rating") && (
            <button className="btn btn-warning" onClick={handleReset}>
              reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Call;
