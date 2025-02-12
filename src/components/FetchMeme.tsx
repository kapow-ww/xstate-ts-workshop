import { useMachine } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";

const getMeme = async () => {
  const response = await fetch("https://meme-api.com/gimme");
  return response.json();
};

const memeMachine = setup({
  types: {
    context: {} as { meme?: { url: string }; error?: unknown },
    events: {} as { type: "FETCH" } | { type: "RETRY" },
  },
  actors: {
    fetchMeme: fromPromise(getMeme),
  },
}).createMachine({
  id: "meme",
  initial: "loading",
  context: { meme: undefined, error: undefined },
  states: {
    idle: {
      on: {
        FETCH: {
          target: "loading",
          actions: assign(() => ({ meme: undefined, error: undefined })),
        },
      },
    },
    loading: {
      invoke: {
        src: "fetchMeme",
        onDone: {
          target: "idle",
          actions: assign(({ event }) => ({ meme: event.output })),
        },
        onError: {
          target: "failure",
          actions: assign(({ event }) => ({ error: event.error })),
        },
      },
    },
    failure: { on: { RETRY: "loading" } },
  },
});

function FetchMeme() {
  const [state, send] = useMachine(memeMachine);

  return (
    <div className="flex flex-col items-center gap-4">
      {state.matches("loading") && (
        <span className="loading loading-dots loading-sm"></span>
      )}
      {state.context.meme?.url && (
        <img
          alt="meme"
          src={state.context.meme.url}
          className="max-w-xs rounded"
        />
      )}
      <button
        className="btn btn-sm btn-error"
        onClick={() => send({ type: "FETCH" })}
      >
        get meme
      </button>
    </div>
  );
}

export default FetchMeme;
