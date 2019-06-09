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
  constructor() {
  }
  showState(state) {
    const td = document.querySelectorAll('td');
    for (let i = 0; i < 64; i++) {
      td[i].innerText = state[parseInt(i / 8)][i % 8];
    }
  }

  createBoard() {
    const board = document.querySelector('.board');
    for (let i = 0; i < 8; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 8; j++) {
        const td = document.createElement('td');
        td.id = `td${i}${j}`; ``
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
    this.state = Array(8).fill(null).map(() => Array(8).fill(0));
    this.state[3][4] = this.blackStone;
    this.state[4][3] = this.blackStone;
    this.state[3][3] = this.whiteStone;
    this.state[4][4] = this.whiteStone;
  }
}

const blackStone = 1;
const whiteStone = 2;

const validator = new Validator();
const view = new View();
const model = new Model({ blackStone, whiteStone, validator })

const app = {
  init() {
    model.init();
    view.showState(model.state)
  }
}

view.createBoard();
app.init();