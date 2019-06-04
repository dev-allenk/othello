const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const View = require('./view');
const Validator = require('./validator');
const Model = require('./model');

const validator = new Validator();
const view = new View();
const model = new Model({ validator });

const app = {
  start() {
    rl.setPrompt('입력하세요 : ');
    rl.prompt();
    rl.on('line', (input) => {

      view.showState(model.state);
    })
    rl.on('close', () => {
      process.exit();
    })
  },
}
app.start();