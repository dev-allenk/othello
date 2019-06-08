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

module.exports = Validator;