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

  //다른 객체로 분리해야할것 같음
  changeTurn() {
    if (this.turn === 'black') this.turn = 'white';
    else this.turn = 'black';
  }

  parseInput(input) {
    return [row, column] = input.split(' ').map(el => Number(el));
  }

  setStone(state, turn, row, column) {
    if (turn === 'black') state[row][column] = this.blackStone;
    else state[row][column] = this.whiteStone;
  }

  updateState(input) {
    const [row, column] = this.parseInput(input);

    if (this.validator.isOccupied(this.state, row, column)) return;

    this.setStone(this.state, this.turn, row, column);

    this.changeTurn();
  }

}

module.exports = Model;