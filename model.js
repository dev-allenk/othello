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

  getDescendingLine(state, row, column) {
    const diff = Math.abs(row - column);
    return state.map((el, i) => {
      if (i < 7) return state[diff + i][i];
    })
  }

  getAscendingLine(state, row, column) {
    const sum = row + column;
    return state.map((el, i) => {
      if (sum - i >= 0) return state[sum - i][i];
    })
  }

  getAffectedLines(state, row, column) {
    const horizontalLine = state[row];
    const verticalLine = state.map(el => el[column]);
    const descendingLine = getDescendingLine(state, row, column);
    const ascendingLine = getAscendingLine(state, row, column);
    return { horizontalLine, verticalLine, descendingLine, ascendingLine };
  }

  updateState(input) {
    const [row, column] = this.parseInput(input);
    if (this.validator.isOccupied(this.state, row, column)) return;

    this.setStone(this.state, this.turn, row, column);

    const { horizontalLine, verticalLine, descendingLine, ascendingLine } = this.getAffectedLines(this.state, row, column);


    this.changeTurn();
  }

}

module.exports = Model;