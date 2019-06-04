class Model {
  constructor({ blackStone, whiteStone, validator }) {
    this.state = Array(8).fill(null).map(() => Array(8).fill(0));
    this.validator = validator;
    this.turn = 'black';
    this.blackStone = blackStone;
    this.whiteStone = whiteStone;
  }
  init() {
    this.state[3][4] = this.blackStone;
    this.state[4][3] = this.blackStone;
    this.state[3][3] = this.whiteStone;
    this.state[4][4] = this.whiteStone;
  }

  changeTurn() {
    if (this.turn === 'black') this.turn = 'white';
    else this.turn = 'black';
  }

  updateState(input) {
    input = input.split(' ').map(el => Number(el));
    const row = input[0];
    const column = input[1];

    if (this.turn === 'black') this.state[row][column] = this.blackStone;
    else this.state[row][column] = this.whiteStone;

    this.changeTurn();
  }

}

module.exports = Model;