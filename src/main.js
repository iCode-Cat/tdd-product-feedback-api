"use strict";
const makeDB = require("./makeDB");

module.exports = {
  run,
  cleanup
};

const services = (module.exports.services = {
  db: null
});

async function run({config}) {
  services.db = await makeDB({config});
  require("./makeExpressServer");
}

function cleanup() {}
