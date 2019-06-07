class Validator {
  isOccupied(state, row, column) {
    if (state[row][column]) return true;
    return false;
  }
  isInvalidInput({ resultH, resultV, resultD, resultA }) {
    if ([resultH, resultV, resultD, resultA].filter(Boolean).length) return false;
    return true;
  }
}

module.exports = Validator;