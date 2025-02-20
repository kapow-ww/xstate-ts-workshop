import { assign, fromPromise, setup } from "xstate";

interface Movie {
  id: string;
  name: string;
}

const moviesDatabase = [
  { id: "1", name: "Shadows of the Past" },
  { id: "2", name: "The Lost City of Eldrador" },
  { id: "3", name: "Realms of Wonder" },
  { id: "4", name: "Echoes of Eternity" },
  { id: "5", name: "Stellar Horizon" },
  { id: "6", name: "The Great Prank War" },
  { id: "7", name: "The Weight of Memories" },
  { id: "8", name: "Love in the Time of Sunset" },
  { id: "9", name: "Whispers of the Heart" },
  { id: "10", name: "Quantum Rift" },
] satisfies Movie[];

export const machine = setup({
  types: {
    events: {} as
      | Readonly<{ type: "updated-search-text"; value: string }>
      | Readonly<{ type: "open-movie"; movieId: Movie["id"] }>
      | Readonly<{ type: "close-movie" }>,
    context: {} as Readonly<{
      searchText: string;
      searchError: string;
      movies: Movie[];
      openedMovie: Movie | null;
    }>,
  },
  actors: {
    searching: fromPromise(
      ({ input }: { input: { searchText: string } }) =>
        new Promise<Movie[]>((resolve, reject) =>
          Math.random() < 0.1
            ? reject(new Error("Error while searching movie"))
            : setTimeout(() => {
                resolve(
                  moviesDatabase.filter((movie) =>
                    movie.name
                      .toLowerCase()
                      .includes(input.searchText.toLowerCase())
                  )
                );
              }, 1000)
        )
    ),
  },
  actions: {
    onUpdatedSearchText: assign((_, { value }: { value: string }) => ({
      searchText: value,
    })),
    onSearchedMovie: assign((_, { value }: { value: Movie[] }) => ({
      movies: value,
    })),
    onSearchedError: assign((_, { value }: { value: unknown }) => ({
      searchError: value instanceof Error ? value.message : "Unknown error",
    })),
    onMovieOpened: assign(
      ({ context }, { movieId }: { movieId: Movie["id"] }) => ({
        openedMovie:
          context.movies.find((movie) => movie.id === movieId) ?? null,
      })
    ),
    onMovieClosed: assign({ openedMovie: null }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsD2A3AlmAtLMAhgE4DGAFjsgeZgHZgDEArgA4QEAukehpFXADw4BtAAwBdRKBapYmDplS0pIAYgAsAJgA0IAJ6JNAVnUA6AGxHzAZgAcm8wHZNARlsBOW+YC+33WixcfGJySmoyOkZUFjBaSgxsMUkkEBk5BSUVNQQcc1FTUVtRTXVnc1L3R3UXXQMETXcLayrRF3KjZzd3dV9-BKDeUKoaelMAVTZOSABlQbIGAVgOKdMCADMuIgAKPNEASgYA7B4QimGI0Yn2LghZ06SVNPlFZRTsrTNrTVsXOyNNBytFzqWqGRy2Uy2ezdawmcyaazWHp+EBHAanMIjMCmO58OhQBgQJTYujoVAAa2xaJOfExF2xuJGUAQpNQJE4LySDxSTwyr1A2Uc-wK4OBjhcLkc3XKoIQkscpnURmsbicP1h5hcRl6qP6NKG4UiOLm+IYYCIRFQRFMLAANpw1lbkKZqcFaecjYyLszWey+VyJI9ZM9Mm9EELNCKfqUJVL1DL9GD8upRDZrO53A1HKmhTrXXM6UaAPIxegQACy-QYJFtslwaO50mDfKy4eFolFMcl0pBiYQP1MRlEw6q7g6lXcwN8KNoqAgcBU+YxHvoQfSL1bORchQKRRKZQqVVlOA6kPheSMnmsTgcyL6gX1Z0NowAkhBbWA1yH+apEO5rxYKaWCmzTAkYsouJOpiZpUyruOYthGEUU4oku7rPtiVxTLccxfi2Yb1KemiiCqDSiPGKZuLKmiOAqULfJ4tjgnk8F3rqD5ugaWLGqc+J4RuBFWPkVjGG0-yOOYNjUSYph2NYw7qPYdhONqqF6pxT7cV6ACiFpWvxoYCn+AHlKmJgkeKSrUZmpi-N8ElSl4dmOHm6kFiu2IlrEkCVoEBk-tkHTmLZY5fPBRRaKI7gQeRphlJeErlOmHjIr4QA */
  id: "movie-search-machine",
  context: { searchText: "", searchError: "", movies: [], openedMovie: null },
  initial: "Idle",
  on: {
    "updated-search-text": {
      target: ".UpdatedSearch",
      actions: { type: "onUpdatedSearchText", params: ({ event }) => event },
    },
    "open-movie": {
      target: ".OpenedMovie",
      actions: { type: "onMovieOpened", params: ({ event }) => event },
    },
  },
  states: {
    Idle: {},
    UpdatedSearch: {
      after: {
        600: {
          target: "Searching",
        },
      },
    },
    Searching: {
      invoke: {
        src: "searching",
        input: ({ context }) => ({ searchText: context.searchText }),
        onError: {
          target: "SearchError",
          actions: {
            type: "onSearchedError",
            params: ({ event }) => ({ value: event.error }),
          },
        },
        onDone: {
          target: "Idle",
          actions: {
            type: "onSearchedMovie",
            params: ({ event }) => ({ value: event.output }),
          },
        },
      },
    },
    SearchError: {},
    OpenedMovie: {
      on: {
        "close-movie": {
          target: "Idle",
          actions: { type: "onMovieClosed" },
        },
      },
    },
  },
});
