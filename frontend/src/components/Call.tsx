import { useActorRef, useMachine, useSelector } from "@xstate/react";
import React, { useEffect, useState } from "react";
import { assign, fromPromise, setup } from "xstate";
import { v4 as uuidv4 } from "uuid";
import { delay } from "../functions/deley";
import { formatSeconds } from "../functions/time";

interface CallContext {
  callId: string | null;
  startDate: string | null;
  endDate: string | null;
  timer: number;
  error: object | null;
  timerInterval?: number;
}

type CallEvent =
  | { type: "START_CALL" }
  | { type: "END_CALL" }
  | { type: "RETRY_CALL" }
  | { type: "RESET" };

const callWorkflowMachine = setup({
  types: {
    context: {} as CallContext,
    events: {} as CallEvent,
  },
  actors: {
    fetchCallDetails: fromPromise(async () => {
      await delay(2000);

      console.log("Completed fetch call details");
      return {
        callId: uuidv4(),
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };
    }),
  },
  actions: {
    resetTimer: assign({
      timer: 0,
    }),
    startTimer: assign(({ context }) => {
      const timerInterval = setInterval(() => {
        context.timer += 1;
      }, 1000);
      return { timerInterval };
    }),
    stopTimer: ({ context }) => {
      if (context.timerInterval) {
        clearInterval(context.timerInterval);
      }
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbdB1A9gJwGsAzdHAdwDoBLCdMAYgGUAVAQQCVmB9AYVYBl+AbQAMAXUSgADjlhUALlRwA7SSAAeiACwBWAGwUAnHoAcAdkM6zZvQGY9ZgEwAaEAE9EjkYYq2-tnQBGQIDHHVtDAF9I1zRMXEIScgopPDApVDT6CBUwamUANxwCPLjsfGJSSlT0zLAEKkKcNEUVUTF2tRk5VtUkDUQTEx8LPUN7EQDA-Rd3T1szCkCRBz1A8ccF2xEdaNiMcsSqlLSMrLA8PHwU9FR5InwAWwoyhMrkmrP6xqKWpWV2p1+t0FP81JoELoDMZzJZrHYHLMPAgwj4TP4AuY9FpsSYtHsQK8KklKGVGlB6ABRAByABFeAJhOIurJQSpwYhAo4hhQtCtbI49I5xoZdLZXMjNjoKHoVjYrFozCIlbYCUSjskiGBIAAjVDIAj0diUxiU5hA6Ss3ochAhQIGGay0zBHSbLQSwYmCg6dGYmw4rR4-ExQkHN4kigXK54I1m9gATQZggtIBB1v6EMCNgoIlzImmYXMwxWHoQCx8Il9ApWWdWarDxOOUfwsdN5uZwKtYIznOzefzrp9ZmLelLoqWeknwx0OkDOhEYWiIeUOAgcDU6veZBZPW7oAhAFpR3MEEf6-FG8kaHQd2y+vvEH5HEZTMOdlmrCZAmOtDLJ6ZLFnEx50XENNwjT46lvdMHwQSdAgoFUszxHYbCzUspV8fx7RMBdDGHV1z0OLcXgOcloL3AZbW8aVzHnXR4XsJwMMcZ8MSFKxxgYojw2OLVdX1AgKPZHtbS0RxFkCLEVi-AtbHdE8v29fsbGFCIxR4y9KGbPBhPvKjxNLZZpVne1-3M-8l0iIA */
  id: "callWorkflow",
  context: {
    callId: null,
    startDate: null,
    endDate: null,
    timer: 0,
    error: null,
  },
  initial: "idle",

  states: {
    idle: {
      on: {
        START_CALL: { target: "prepare" },
      },
    },
    prepare: {
      invoke: {
        src: "fetchCallDetails",
        onDone: {
          target: "calling",
          actions: assign(({ context, event }) => {
            return {
              ...context,
              ...event.output,
            };
          }),
        },
        onError: {
          target: "error",
          // actions: assign({
          //   error: ({ event }) => event.output.message,
          // }),
        },
      },
    },
    calling: {
      entry: ["resetTimer", "startTimer"],
      on: {
        END_CALL: {
          target: "feedback",
          actions: assign({
            endDate: () => new Date().toISOString(),
          }),
        },
      },
    },
    feedback: {
      entry: ["stopTimer"],
      on: {
        RESET: "idle",
      },
    },
    error: {
      on: {
        RETRY_CALL: "prepare",
        RESET: "idle",
      },
    },
  },
});

function Call() {
  const [state, send] = useMachine(callWorkflowMachine);

  console.log("timer : ", state.context.timer);

  const handleStartCall = () => send({ type: "START_CALL" });
  const handleEndCall = () => send({ type: "END_CALL" });
  const handleReset = () => send({ type: "RESET" });

  return (
    <div>
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
              {/* <p className="text-red-600">{formatSeconds(currentTimer)}</p> */}
            </div>
          )}
          {state.matches("feedback") && (
            <div className="text-center">
              <p>end call</p>{" "}
              {/* <p className="text-gray-500">{formatSeconds(currentTimer)}</p> */}
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
            {state.matches("feedback") && (
              <button className="btn btn-warning" onClick={handleReset}>
                reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Call;
