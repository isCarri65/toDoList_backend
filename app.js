const { envs } = require("./config/env");
const Backlog = require("./models/Backlog");
const { createServer } = require("./server/server");

const main = async () => {
  createServer(envs);
};

(async () => {
  await main();
})();
