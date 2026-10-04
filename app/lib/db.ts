export const getDB = async () => {
  const PouchDBModule = await import("pouchdb-browser");

  const PouchDB = PouchDBModule.default;

  return new PouchDB("offline-todos");
};
