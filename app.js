class Validator {
  isOccupied(stone) {
    if (stone !== 0) return true;
    return false;
  }
  isInvalidInput(result) {
    if (result.filter(Boolean).length) return false;
    return true;
  }
}

class View {
  init() {
    const td = document.querySelectorAll('td');
    for (let i = 0; i < 64; i++) {
      td[i].classList.remove('black');
      td[i].classList.remove('white');
    }
  }
  showState(state) {
    const td = document.querySelectorAll('td');
    for (let i = 0; i < 64; i++) {
      if (state[parseInt(i / 8)][i % 8] === 1) {
        td[i].classList.remove('white');
        td[i].classList.add('black');
      }
      if (state[parseInt(i / 8)][i % 8] === 2) {
        td[i].classList.remove('black');
        td[i].classList.add('white');
      }
    }
  }

  createBoard() {
    const board = document.querySelector('.board');
    for (let i = 0; i < 8; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 8; j++) {
        const td = document.createElement('td');
        td.id = `${i}${j}`; ``
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }
}

class Model {
  constructor({ blackStone, whiteStone, validator }) {
    this.state = [];
    this.validator = validator;
    this.turn = 'black';
    this.blackStone = blackStone;
    this.whiteStone = whiteStone;
  }
  init() {
    console.log('init!')
    this.state = Array(8).fill(null).map(() => Array(8).fill(0));
    this.state[3][4] = this.blackStone;
    this.state[4][3] = this.blackStone;
    this.state[3][3] = this.whiteStone;
    this.state[4][4] = this.whiteStone;
  }
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
    if (this.validator.isOccupied(this.state[row][column])) return console.log('이미 돌이 놓여있는 자리입니다.');
    const state = this.state.map(el => [...el]);
    this.setStone(state, this.turn, row, column);
    const types = ['horizontal', 'vertical', 'descendDiagonal', 'ascendDiagonal'];
    const result = types.map(directionType => this.updateState({ state, directionType, row, column }));
    if (this.validator.isInvalidInput(result)) return console.log('놓을 수 없는 자리입니다.')
    this.state = state;
    this.changeTurn();
  }

  hasAnyPossibleInput(turn) {
    const types = ['horizontal', 'vertical', 'descendDiagonal', 'ascendDiagonal'];
    const stone = turn === 'black' ? this.blackStone : this.whiteStone;
    const possibility = [];
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (this.validator.isOccupied(this.state[row][column])) continue;
        const state = this.state.map(el => [...el]);
        state[row][column] = stone;
        const result = types.map(directionType => this.updateState({ state, directionType, row, column }));
        if (this.validator.isInvalidInput(result)) continue;
        possibility.push(true);
      }
    }
    return possibility.filter(Boolean).length === 0 ? false : true;
  }

  isGameEnd(state) {
    const flatState = state.reduce((acc, curr) => [...acc, ...curr]);
    const stateWithoutEmpty = flatState.filter(Boolean);
    if (flatState.every(el => el !== 0)) return true;
    if (stateWithoutEmpty.every(el => el === 1) || stateWithoutEmpty.every(el => el === 2)) return true;
    if (!this.hasAnyPossibleInput('black') || !this.hasAnyPossibleInput('white')) return true;
    return false;
  }

  countStones(state, stoneType) {
    const flatState = state.reduce((acc, curr) => [...acc, ...curr]);
    return flatState.filter(el => el === stoneType).length;
  }
}

class Controller {
  constructor({ model, view }) {
    this.model = model;
    this.view = view;
  }
  init() {
    this.view.init();
    this.model.init();
    this.view.showState(this.model.state)
  }
  parseInput(input) {
    const [row, column] = input.split('').map(el => Number(el));
    return { row, column };
  }
}

const blackStone = 1;
const whiteStone = 2;

const validator = new Validator();
const view = new View();
const model = new Model({ blackStone, whiteStone, validator });
const controller = new Controller({ model, view });

const app = {

  start() {
    const td = document.querySelectorAll('td');
    for (let el of td) {
      el.addEventListener('click', function (event) {
        const { row, column } = controller.parseInput(event.target.id);
        model.executeUpdate({ row, column });
        view.showState(model.state);
        if (model.isGameEnd(model.state)) {
          const blackScore = model.countStones(model.state, model.blackStone);
          const whiteScore = model.countStones(model.state, model.whiteStone);
          if (blackScore === whiteScore) console.log(`게임을 종료합니다. 무승부입니다.`);
          else {
            const winner = blackScore < whiteScore ? 'white' : 'black';
            console.log(`게임을 종료합니다. ${winner}의 승리입니다.`)
          }
        }
        if (!model.hasAnyPossibleInput(model.turn)) {
          console.log('놓을 수 있는 자리가 없어 턴을 넘깁니다.')
          model.changeTurn();
        }
      })
    }
    const restartBtn = document.querySelector('.restart-btn');
    restartBtn.addEventListener('click', function () {
      controller.init();
    });
  }
}

view.createBoard();
controller.init();
app.start();