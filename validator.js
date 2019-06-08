class Validator {
  isOccupied(state, row, column) {
    if (state[row][column]) return true;
    return false;
  }
  isInvalidInput(result) {
    if (result.filter(Boolean).length) return false;
    return true;
  }
}

module.exports = Validator;