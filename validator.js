class Validator {
  isOccupied(state, row, column) {
    if (state[row][column]) return true;
    console.log('이미 돌이 놓인 자리입니다!')
    return false;
  }
}

module.exports = Validator;