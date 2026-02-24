let active = false;

module.exports = {
  isActive() {
    return active;
  },
  start() {
    active = true;
  },
  stop() {
    active = false;
  }
};
