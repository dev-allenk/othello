class View {
  showState(state) {
    console.log(state);
  }

  createBoard() {
    const board = document.querySelector('.board');
    for (let i = 0; i < 8; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 8; j++) {
        const td = document.createElement('td');
        td.innerText = 0;
        td.id = `td${i}${j}`;``
        tr.appendChild(td);
      }
      board.appendChild(tr);
    }
  }
}

const view = new View();

view.createBoard();