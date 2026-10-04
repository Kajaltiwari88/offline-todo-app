import { getDB } from "./db";

export const startSync = async () => {
  const db = await getDB();

  const remoteUrl = process.env.NEXT_PUBLIC_COUCHDB_URL;

  if (!remoteUrl) {
    console.error("CouchDB URL is missing");
    return;
  }

  const push = db.replicate.to(remoteUrl, {
    live: true,
    retry: true,
  });

  const pull = db.replicate.from(remoteUrl, {
    live: true,
    retry: true,
  });

  push.on("change", () => {
    console.log("Pushed local data to CouchDB");
  });

  pull.on("change", () => {
    console.log("Pulled data from CouchDB");
  });

  push.on("error", (error) => {
    console.error("Push error:", error);
  });

  pull.on("error", (error) => {
    console.error("Pull error:", error);
  });

  return {
    cancel: () => {
      push.cancel();
      pull.cancel();
    },
  };
};
