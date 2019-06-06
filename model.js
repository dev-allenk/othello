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

  getIndexL(line, rowOrColumn) {
    const indexes = [];
    const inputStoneColor = line[rowOrColumn];
    for (let i = 1; i < 8 - rowOrColumn; i++) {
      let nextStone = line[rowOrColumn + i];
      if (nextStone == 0) return;
      if (inputStoneColor === nextStone) return indexes;
      indexes.push(rowOrColumn + i);
    }
  }

  getIndexR(line, rowOrColumn) {
    const indexes = [];
    const inputStoneColor = line[rowOrColumn];
    for (let i = 1; i < rowOrColumn + 1; i++) {
      let prevStone = line[rowOrColumn - i];
      if (prevStone == 0) return;
      if (inputStoneColor === prevStone) return indexes;
      indexes.push(rowOrColumn - i);
    }
  }

  concatIdxs({ indexL, indexR }) {
    if (!indexL) return indexR;
    if (!indexR) return indexL;
    return [...indexL, ...indexR];
  }

  updateHorizontal(state, { horizontalLine, column }) {
    const indexL = getIndexL(horizontalLine, column);
    const indexR = getIndexR(horizontalLine, column);

  }

  updateVertical() {

  }

  updateDescending() {

  }

  updateAscending() {

  }

  updateState(input) {
    const [row, column] = this.parseInput(input);
    if (this.validator.isOccupied(this.state, row, column)) return;

    //TODO : 놓을 수 있는 자리인지 검증하는 로직

    this.setStone(this.state, this.turn, row, column);

    const { horizontalLine, verticalLine, descendingLine, ascendingLine } = this.getAffectedLines(this.state, row, column);

    this.updateHorizontal(this.state, { horizontalLine, column });
    this.updateVertical(this.state, { verticalLine, row, column });
    this.updateDescending(this.state, { descendingLine, row, column });
    this.updateAscending(this.state, { ascendingLine, row, column })

    this.changeTurn();
  }

}

module.exports = Model;