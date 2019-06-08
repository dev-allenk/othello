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

  setStone(state, turn, row, column) {
    if (turn === 'black') state[row][column] = this.blackStone;
    else state[row][column] = this.whiteStone;
  }

  getDescendDiagonal({ state, row, column }) {
    const diff = Math.abs(row - column);
    return state.map((el, i) => {
      if (row < column && i < 8 - diff) return state[i][diff + i];
      if (row >= column && i < 8 - diff) return state[diff + i][i];
    })
  }

  getAscenedDiagonal({ state, row, column }) {
    const sum = row + column;
    return state.map((el, i) => {
      if (sum < 7 && i < sum + 1) return state[sum - i][i];
      if (sum >= 7 && i < 15 - sum) return state[7 - i][sum - 7 + i];
    })
  }

  getAffectedLine({ state, directionType, row, column }) {
    const map = {
      horizontal: () => state[row],
      vertical: () => state.map(el => el[column]),
      descendDiagonal: () => this.getDescendDiagonal({ state, row, column }),
      ascendDiagonal: () => this.getAscenedDiagonal({ state, row, column })
    }
    return map[directionType]();
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
    return [];
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
    return [];
  }

  getIndexes(line, rowOrColumn) {
    const indexL = this.getIndexL(line, rowOrColumn);
    const indexR = this.getIndexR(line, rowOrColumn);
    return [...indexL, ...indexR];
  }

  executeReverse({ type, state, indexes, row, column }) {
    const diff = Math.abs(row - column);
    const sum = row + column;
    const map = {
      horizontal: (el) => state[row][el] === this.blackStone ? state[row][el] = this.whiteStone : state[row][el] = this.blackStone,
      vertical: (el) => state[el][column] === this.blackStone ? state[el][column] = this.whiteStone : state[el][column] = this.blackStone,
      descendA: (el) => state[el][diff + el] === this.blackStone ? state[el][diff + el] = this.whiteStone : state[el][diff + el] = this.blackStone, //row < column
      descendB: (el) => state[diff + el][el] === this.blackStone ? state[diff + el][el] = this.whiteStone : state[diff + el][el] = this.blackStone, //row >= column
      ascendA: (el) => state[sum - el][el] === this.blackStone ? state[sum - el][el] = this.whiteStone : state[sum - el][el] = this.blackStone, //sum < 7
      ascendB: (el) => state[7 - el][sum - 7 + el] === this.blackStone ? state[7 - el][sum - 7 + el] = this.whiteStone : state[7 - el][sum - 7 + el] = this.blackStone //sum >= 7
    }
    for (let el of indexes) {
      map[type](el);
    }
    return 'done';
  }

  getRoc({ directionType, row, column }) {
    const rocmap = {
      horizontal: () => column,
      vertical: () => row,
      descendDiagonal: () => {
        let roc;
        if (row < column) roc = row;
        else roc = column;
        return roc;
      },
      ascendDiagonal: () => {
        let roc;
        if (row + column < 7) roc = column;
        else roc = 7 - row;
        return roc;
      }
    }
    return rocmap[directionType]();
  }

  updateState({ state, directionType, row, column }) {
    const line = this.getAffectedLine({ state, directionType, row, column });
    const roc = this.getRoc({ directionType, row, column });
    const indexes = this.getIndexes(line, roc);
    if (!indexes.length) return;

    const map = {
      horizontal: () => this.executeReverse({ type: 'horizontal', state, indexes, row, column }),
      vertical: () => this.executeReverse({ type: 'vertical', state, indexes, row, column }),
      descendDiagonal: () => {
        if (row < column) return this.executeReverse({ type: 'descendA', state, indexes, row, column })
        else return this.executeReverse({ type: 'descendB', state, indexes, row, column })
      },
      ascendDiagonal: () => {
        if (row + column < 7) return this.executeReverse({ type: 'ascendA', state, indexes, row, column })
        else return this.executeReverse({ type: 'ascendB', state, indexes, row, column })
      }
    }
    return map[directionType]();
  }

  executeUpdate({ row, column }) {
    if (this.validator.isOccupied(this.state, row, column)) return console.log('이미 돌이 놓여있는 자리입니다.');

    //복사본 만들기
    const state = this.state.map(el => [...el]);

    //복사본에 돌을 놓는다
    this.setStone(state, this.turn, row, column);

    //돌을 뒤집을 수 있으면 뒤집는다
    const types = ['horizontal', 'vertical', 'descendDiagonal', 'ascendDiagonal'];
    // for (let directionType of types) {
    //   this.updateState({ state, directionType, row, column });
    // }
    const result = types.map(directionType => this.updateState({ state, directionType, row, column }));

    if (this.validator.isInvalidInput(result)) return console.log('놓을 수 없는 자리입니다.')

    //원본을 복사본으로 교체
    this.state = state;

    this.changeTurn();
  }
}
module.exports = Model;