const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const View = require('./view');
const Validator = require('./validator');
const Model = require('./model');

const blackStone = 1;
const whiteStone = 2;

const validator = new Validator();
const view = new View();
const model = new Model({ blackStone, whiteStone, validator });

const app = {
  parseInput(input) {
    const [row, column] = input.split(' ').map(el => Number(el));
    return {row, column};
  },

  start() {
    model.init();
    view.showState(model.state);

    rl.setPrompt(`${model.turn}의 턴입니다. : `);
    rl.prompt();
    
    rl.on('line', (input) => {
      const {row, column} = this.parseInput(input);
      model.executeUpdate({row, column});
      view.showState(model.state);
      
      if(model.isGameEnd(model.state)) {
        console.log(`게임을 종료합니다.`)
      }
      if(!model.hasAnyPossibleInput(model.turn)) {
        console.log('놓을 수 있는 자리가 없어 턴을 넘깁니다.')
        model.changeTurn();
      }
      rl.setPrompt(`${model.turn}의 턴입니다. : `);
      rl.prompt();
    })
    rl.on('close', () => {
      process.exit();
    })
  },
}
app.start();