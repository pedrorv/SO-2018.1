const { isProduction } = require('./utilities');

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const BASE_DIFFICULTY = isProduction() ? 4 : 2;
const MINE_RATE = isProduction() ? 1 * MINUTE : 15 * SECOND;

const INITIAL_BALANCE = isProduction() ? 100 : 1000;
const MINING_REWARD = 10;

module.exports = {
  BASE_DIFFICULTY,
  MINE_RATE,
  INITIAL_BALANCE,
  MINING_REWARD,
  SECOND,
  MINUTE,
};
