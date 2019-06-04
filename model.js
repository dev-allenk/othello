class Model {
  constructor({ validator }) {
    this.state = Array(8).fill(null).map(() => Array(8).fill(0));
    this.validator = validator;
  }
  init() {
    model.state[3][4] = 1;
    model.state[4][3] = 1;
    model.state[3][3] = 2;
    model.state[4][4] = 2;
  }
}

module.exports = Model;