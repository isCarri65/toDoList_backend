const { envs } = require("./config/env");
const { createServer } = require("./server/server");

const main = () => {
  createServer(envs);
};

(async () => {
  await main();
})();
