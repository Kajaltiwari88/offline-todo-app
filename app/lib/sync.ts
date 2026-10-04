import { getDB } from "./db";

export const startSync = async () => {
  const db = await getDB();

  const remoteUrl = process.env.NEXT_PUBLIC_COUCHDB_URL;
  const username = process.env.NEXT_PUBLIC_COUCHDB_USER;
  const password = process.env.NEXT_PUBLIC_COUCHDB_PASSWORD;

  if (!remoteUrl || !username || !password) {
    console.error("CouchDB configuration is missing");
    return;
  }

  const options = {
    live: true,
    retry: true,
    auth: {
      username,
      password,
    },
  };

  const push = db.replicate.to(remoteUrl, options);

  const pull = db.replicate.from(remoteUrl, options);

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