export const delay = async (ms: number, errorProbability: number = 0) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorProbability) {
        reject({ type: "ServiceNotAvailable" });
      } else {
        resolve();
      }
    }, ms);
  });
};
