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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsyoHQEsIBswGIAxAUQBUBhACQG0AGAXUVAAcB7WTAF01YDsmQAD0QBmAExj0tEQE5aAdloyAHEoCMykQBoQAT0QSALOgCstMSeVXDhsWrHyAvo52oMOVgEMImXlHwQfGBYvABurADWwW7BHt6+UAi+4QDGntx8dPRZAmwcGfxIQgYAbJIlIqpiJcoltGol8iaGOvoI4rToyvJNMhaG8ho1Js6uaLFePn74YABOs6yz6Mw46QBmi8joMehxU4nJrGkFWTlFeVw8haDCCNXlleY1dQ1NLXqIaiJq6F-NaoYTGolLRlLZRiAdmtPJgcABXWYEABKZCRAE0zix2Jc+AJbuISugZPJZHUZDIRLRDGoZK1EMofuIxH1ZIMSiYSSVnC4QLxWBA4AIYrlsQU8YgALQlOkIKVSWgKxVKxVOHk7bB4EX5K7ihCGcSmBQMsSqGRqElibQfdoieToS0DEq2ckiAYyQwQnZ7BJanHXYp6sQy5k-ZR2OomsqKaqe8boaGwhFgX1ioq3fWSMzyY2m83iK1tAF2wx9J007O1BQjblAA */
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
