class Model {
  constructor({ validator }) {
    this.state = Array(8).fill(null).map(() => Array(8).fill(0));
    this.validator = validator;
    this.turn = 'black';
  }
  init() {
    this.state[3][4] = 1;
    this.state[4][3] = 1;
    this.state[3][3] = 2;
    this.state[4][4] = 2;
  }

  changeTurn() {
    if(this.turn === 'black') this.turn = 'white';
    else this.turn = 'black';
  }

  updateState(input) {
    input = input.split(' ').map(el => Number(el));
    const row = input[0];
    const column = input[1];
    
    if(this.turn === 'black') this.state[row][column] = 1;
    else this.state[row][column] = 2;
    
    this.changeTurn();
  }

}

module.exports = Model;