export const formatSeconds = (secs: number): string => {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
