document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const header = document.querySelector("#currentTurn").firstChild;
    const cells = document.querySelectorAll(".box");
    let turnCount = 1;
    let state = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    for(const cell of cells) {
      cell.addEventListener("click", function takeTurn() {
        if (turnCount % 2 === 0) {
          cell.innerText= "O";
          cell.classList += " o";
        } else {
          cell.innerText = "X";
          cell.classList += " x";
        }
        updateState(cell, state);

        if (turnCount >= 5) {
          cell.addEventListener("onchange", decideWinner(state));
        }

        cell.removeEventListener("click", takeTurn);
        
        header.innerText = turnCount % 2 === 0 ? "X" : "O"; 
        header.parentNode.classList = turnCount % 2 === 0 ? "x" : "o";
        
        if (turnCount === 9) {
          alert("Cat's Game!");
          location.reload(true);
        };

        turnCount++;
      });
    }
  });
});

function updateState(cell, arr) {
  let cellId = cell.id;
  cellId = cellId.split("");

  let i = parseInt(cellId[0]);
  let j = parseInt(cellId[1]);
  arr[i].splice(j, 1, cell.innerText);
}

function decideWinner(state) {
  const len = state.length;
  if (state[0][0] === state[1][1] && state[0][0] === state[2][2]) {
    alert("Game Over! "+ state[1][1] +" Wins!");
    location.reload(true);
  } else if (state[0][2] === state[1][1] && state[1][1] === state[2][0]) {
    alert("Game Over! "+ state[1][1] +" Wins!");
    location.reload(true);
  } else {
    for (var i = 0; i < len; i++) {
      if (state[i][0] === state[i][1] && state[i][0] === state[i][2]) {
        alert("Game Over! "+ state[i][0] +" Wins!");
        location.reload(true);
      } else if (state[0][i] === state[1][i] && state[0][i] === state[2][i]) {
        alert("Game Over! "+ state[0][i] +" Wins!");
        location.reload(true);
      }
    };
  }
}