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
  start() {
    model.init();
    view.showState(model.state);

    rl.setPrompt(`${model.turn}의 턴입니다. : `);
    rl.prompt();

    rl.on('line', (input) => {
      model.updateState(input);
      view.showState(model.state);

      rl.setPrompt(`${model.turn}의 턴입니다. : `);
      rl.prompt();
    })
    rl.on('close', () => {
      process.exit();
    })
  },
}
app.start();