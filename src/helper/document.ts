export const doc = <T>(callback: (Document) => T) => {
  try {
    if (document) {
      return callback(document);
    }
  } catch {
  }
};
