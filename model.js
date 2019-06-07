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

  //이것도 분리하는게 나을듯
  parseInput(input) {
    const [row, column] = input.split(' ').map(el => Number(el));
    return [row, column];
  }

  setStone(state, turn, row, column) {
    if (turn === 'black') state[row][column] = this.blackStone;
    else state[row][column] = this.whiteStone;
  }

  getDescendingLine(state, row, column) {
    const diff = Math.abs(row - column);
    return state.map((el, i) => {
      if (row < column && i < 8 - diff) return state[i][diff + i];
      if (row >= column && i < 8 - diff) return state[diff + i][i];
    })
  }

  getAscendingLine(state, row, column) {
    const sum = row + column;
    return state.map((el, i) => {
      if (sum < 7 && i < sum + 1) return state[sum - i][i];
      if (sum >= 7 && i < 15 - sum) return state[7 - i][sum - 7 + i];
    })
  }

  getAffectedLines(state, row, column) {
    const horizontalLine = state[row];
    const verticalLine = state.map(el => el[column]);
    const descendingLine = this.getDescendingLine(state, row, column);
    const ascendingLine = this.getAscendingLine(state, row, column);
    
    //디버깅용
    console.log('horizontal(row)', horizontalLine)
    console.log('vertical(column)', verticalLine)
    console.log('descending', descendingLine)
    console.log('ascending', ascendingLine)
    return { horizontalLine, verticalLine, descendingLine, ascendingLine };
  }

  getIndexR(line, rowOrColumn) {
    const indexes = [];
    const inputStoneColor = line[rowOrColumn];
    for (let i = 1; i < 8 - rowOrColumn; i++) {
      let nextStone = line[rowOrColumn + i];
      if (nextStone === 0 || nextStone === undefined) return [];
      if (inputStoneColor === nextStone) return indexes;
      indexes.push(rowOrColumn + i);
    }
  }

  getIndexL(line, rowOrColumn) {
    const indexes = [];
    const inputStoneColor = line[rowOrColumn];
    for (let i = 1; i < rowOrColumn + 1; i++) {
      let prevStone = line[rowOrColumn - i];
      if (prevStone === 0 || prevStone === undefined) return [];
      if (inputStoneColor === prevStone) return indexes;
      indexes.push(rowOrColumn - i);
    }
  }

  concatIdxs({ indexL, indexR }) {
    if (!indexL) return indexR;
    if (!indexR) return indexL;
    return [...indexL, ...indexR];
  }

  reverseRow(indexes, line) {
    if (!indexes.length) return;
    console.log('row', indexes) //디버깅용
    indexes.forEach(el => {
      if (line[el] === this.blackStone) line[el] = this.whiteStone;
      else line[el] = this.blackStone;
    })
    return 'done';
  }

  reverseColumn({ state, indexes, column }) {
    if (!indexes.length) return;
    console.log('column', indexes) //디버깅용
    indexes.forEach(el => {
      if (state[el][column] === this.blackStone) state[el][column] = this.whiteStone;
      else state[el][column] = this.blackStone;
    })
    return 'done';
  }

  reverseDescending({ state, indexes, row, column }) {
    if (!indexes.length) return;
    console.log('descend', indexes) //디버깅용
    const diff = Math.abs(row - column);
    if (row < column) {
      indexes.forEach(el => {
        if (state[el][diff + el] === 1) state[el][diff + el] = 2;
        else state[el][diff + el] = 1;
      })
    }
    else {
      indexes.forEach(el => {
        if (state[diff + el][el] === 1) state[diff + el][el] = 2;
        else state[diff + el][el] = 1;
      })
    }
    return 'done';
  }

  reverseAscending({ state, indexes, row, column }) {
    if (!indexes.length) return;
    console.log('ascend', indexes) //디버깅용
    const sum = row + column;
    if (sum < 7) {
      indexes.forEach(el => {
        if (state[sum - el][el] === 1) state[sum - el][el] = 2;
        else state[sum - el][el] = 1;
      })
    }
    else {
      indexes.forEach(el => {
        if (state[7 - el][sum - 7 + el] === 1) state[7 - el][sum - 7 + el] = 2;
        else state[7 - el][sum - 7 + el] = 1;
      })
    }
    return 'done';
  }

  getIndexes(line, roc) {
    const indexL = this.getIndexL(line, roc);
    const indexR = this.getIndexR(line, roc);
    return this.concatIdxs({ indexL, indexR });
  }

  updateHorizontal(state, { horizontalLine, column }) {
    const indexes = this.getIndexes(horizontalLine, column)
    return this.reverseRow(indexes, horizontalLine);
  }

  updateVertical(state, { verticalLine, row, column }) {
    const indexes = this.getIndexes(verticalLine, row)
    return this.reverseColumn({ indexes, state, column });
  }
  
  updateDescending(state, { descendingLine, row, column }) {
    let roc;
    if (row < column) roc = row;
    else roc = column;
    const indexes = this.getIndexes(descendingLine, roc)
    return this.reverseDescending({ state, indexes, row, column })
  }

  updateAscending(state, { ascendingLine, row, column }) {
    let roc;
    if (row + column < 7) roc = column;
    else roc = 7 - row;
    const indexes = this.getIndexes(ascendingLine, roc)
    return this.reverseAscending({ state, indexes, row, column })
  }

  updateState(input) {
    const [row, column] = this.parseInput(input);
    if (this.validator.isOccupied(this.state, row, column)) return;

    //복사본 만들기
    const stateCopy = this.state.map(el => [...el]);

    //복사본에 돌을 놓는다
    this.setStone(stateCopy, this.turn, row, column);

    //8방향을 배열에 담는다
    const { horizontalLine, verticalLine, descendingLine, ascendingLine } = this.getAffectedLines(stateCopy, row, column);

    //각 라인별 보드 업데이트. result는 'done' or undefined
    const resultH = this.updateHorizontal(stateCopy, { horizontalLine, column });
    const resultV = this.updateVertical(stateCopy, { verticalLine, row, column });
    const resultD = this.updateDescending(stateCopy, { descendingLine, row, column });
    const resultA = this.updateAscending(stateCopy, { ascendingLine, row, column })

    //놓을 수 있는 자리인지 검증
    if (this.validator.isInvalidInput({ resultH, resultV, resultD, resultA })) return console.log('놓을 수 없는 자리입니다');

    //원본을 복사본으로 교체
    this.state = stateCopy;

    this.changeTurn();
  }

}

module.exports = Model;