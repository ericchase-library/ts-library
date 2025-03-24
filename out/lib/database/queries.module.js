// @bun
// src/lib/ericchase/Utility/Console.ts
var newline_count = 0;
function ConsoleError(...items) {
  console["error"](...items);
  newline_count = 0;
}

// src/lib/server/server.ts
var server_http = `http://${window.location.host}/`;
var server_ws = `ws://${window.location.host}/`;

// src/lib/database/dbdriver-localhost.ts
function getLocalhost(address) {
  return {
    async query(text, params) {
      const response = await fetch(`${address}/database/query`, {
        method: "POST",
        body: JSON.stringify({ text, params })
      });
      if (response.status < 200 || response.status > 299) {
        throw await response.json();
      }
      return await response.json();
    }
  };
}

// src/lib/database/queries.module.ts
var db = getLocalhost(server_http);
async function DatabaseConnected() {
  const q = "SELECT 1";
  await db.query(q, []);
  return true;
}
async function CreateTable(name) {
  const q = `
      CREATE TABLE ${name} (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `;
  await db.query(q, []);
}
async function TableExists(name) {
  const q = `
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );
  `;
  const { exists } = (await db.query(q, [name]))[0];
  return exists ?? false;
}
async function EnsureTableExists(name) {
  try {
    if (await TableExists(name) === true) {
      return { created: false, exists: true };
    }
    await CreateTable(name);
    if (await TableExists(name) === true) {
      return { created: true, exists: true };
    }
  } catch (error) {
    ConsoleError(error);
  }
  return { created: false, exists: false };
}
export {
  TableExists,
  EnsureTableExists,
  DatabaseConnected,
  CreateTable
};
